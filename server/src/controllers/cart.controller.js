import { Cart } from '../models/Cart.model.js';
import { Product } from '../models/Product.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get Authenticated User's Cart
 * GET /api/v1/cart
 */
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  return res.status(200).json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
});

/**
 * Sync Cart with Database
 * PUT /api/v1/cart/sync
 */
export const syncCartWithDB = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Validate items against current product stock
  const validatedItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product || item.productId);
    if (product && product.isActive) {
      const finalPrice = product.discountPrice || product.price;
      const finalQty = Math.min(item.quantity, product.stock);
      if (finalQty > 0) {
        validatedItems.push({
          product: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url || item.image,
          price: finalPrice,
          quantity: finalQty,
          stock: product.stock,
        });
      }
    }
  }

  cart.items = validatedItems;
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, 'Cart synced successfully'));
});

/**
 * Merge Guest Cart into User DB Cart upon Login
 * POST /api/v1/cart/merge
 */
export const mergeGuestCart = asyncHandler(async (req, res) => {
  const { guestCartItems = [] } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingMap = new Map();
  cart.items.forEach((item) => existingMap.set(item.product.toString(), item));

  for (const guestItem of guestCartItems) {
    const pId = (guestItem.product || guestItem.productId || '').toString();
    const product = await Product.findById(pId);
    if (!product || !product.isActive || product.stock <= 0) continue;

    const finalPrice = product.discountPrice || product.price;

    if (existingMap.has(pId)) {
      const existing = existingMap.get(pId);
      existing.quantity = Math.min(existing.quantity + guestItem.quantity, product.stock);
      existing.price = finalPrice;
    } else {
      existingMap.set(pId, {
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || guestItem.image,
        price: finalPrice,
        quantity: Math.min(guestItem.quantity, product.stock),
        stock: product.stock,
      });
    }
  }

  cart.items = Array.from(existingMap.values());
  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, 'Guest cart merged successfully'));
});

/**
 * Clear DB Cart
 * DELETE /api/v1/cart
 */
export const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return res.status(200).json(new ApiResponse(200, cart, 'Cart cleared successfully'));
});
