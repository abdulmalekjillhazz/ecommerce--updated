import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
} from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:idOrSlug', getProductByIdOrSlug);

// Customer protected review route
router.post('/:id/reviews', protect, addProductReview);

// Admin-only management routes
router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;
