import { Router } from 'express';
import {
  getCart,
  syncCartWithDB,
  mergeGuestCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.put('/sync', syncCartWithDB);
router.post('/merge', mergeGuestCart);
router.delete('/', clearCart);

export default router;
