import { Order } from '../models/Order.model.js';
import { Product } from '../models/Product.model.js';
import { Cart } from '../models/Cart.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to generate human-readable Order Number
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomSuffix}`;
};

/**
 * Create Order
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'Your order must contain at least one item.');
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
    throw new ApiError(400, 'Complete shipping address and contact phone are required.');
  }

  // Verify stock and compute authentic prices directly from database
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product || item.productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, `Product "${item.name}" is no longer available.`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`
      );
    }

    const price = product.discountPrice || product.price;
    itemsPrice += price * item.quantity;

    // Decrement stock
    product.stock -= item.quantity;
    await product.save();

    verifiedItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price,
      quantity: item.quantity,
    });
  }

  // Shipping logic: free shipping over 2000 BDT or $50, else standard shipping fee
  const shippingPrice = itemsPrice >= 2000 ? 0 : 80;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
  const totalAmount = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cash_on_delivery',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalAmount,
    notes: notes || '',
  });

  // Clear user's saved DB cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], subtotal: 0, totalItems: 0 });

  return res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
});

/**
 * Get Customer's Orders
 * GET /api/v1/orders/mine
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
});

/**
 * Get Order Details by ID
 * GET /api/v1/orders/:id
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone avatar');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  // Security check: Must be owner or admin
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have permission to view this order.');
  }

  return res.status(200).json(new ApiResponse(200, order, 'Order details retrieved'));
});

/**
 * Get All Orders (Admin Only)
 * GET /api/v1/orders
 */
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const filter = {};
  if (status && status !== 'All') {
    filter.orderStatus = status;
  }
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalCount,
        },
      },
      'Admin orders retrieved'
    )
  );
});

/**
 * Update Order Status (Admin Only)
 * PUT /api/v1/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (status) {
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      // If COD, delivering marks it paid
      if (order.paymentMethod === 'cash_on_delivery') {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentStatus = 'paid';
      }
    }
    if (status === 'Cancelled') {
      // Restore inventory
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }
  }

  if (trackingNumber !== undefined) {
    order.trackingNumber = trackingNumber;
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }

  await order.save();

  return res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
});
