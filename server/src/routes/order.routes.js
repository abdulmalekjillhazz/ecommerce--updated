import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Customer authenticated routes
router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only order management routes
router.get('/', protect, restrictTo('admin'), getAllOrdersAdmin);
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

export default router;
