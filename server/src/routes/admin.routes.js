import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Restrict all routes in this router to admin
router.use(protect, restrictTo('admin'));

router.get('/analytics', getDashboardAnalytics);

export default router;
