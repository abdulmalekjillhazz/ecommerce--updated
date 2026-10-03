import { Order } from '../models/Order.model.js';
import { Product } from '../models/Product.model.js';
import { User } from '../models/User.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Admin Dashboard Statistics & KPI Metrics
 * GET /api/v1/admin/analytics
 */
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalProducts,
    totalUsers,
    lowStockProducts,
    recentOrders,
    revenueAggregation,
    orderStatusAggregation,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' }),
    Product.find({ stock: { $lte: 5 }, isActive: true }).select('name stock price sku images category').limit(5).lean(),
    Order.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name email').lean(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

  // Format status map
  const statusCounts = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  orderStatusAggregation.forEach((item) => {
    if (statusCounts[item._id] !== undefined) {
      statusCounts[item._id] = item.count;
    }
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        kpis: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers: totalUsers,
          lowStockAlerts: lowStockProducts.length,
        },
        statusCounts,
        recentOrders,
        lowStockProducts,
      },
      'Admin analytics loaded'
    )
  );
});
