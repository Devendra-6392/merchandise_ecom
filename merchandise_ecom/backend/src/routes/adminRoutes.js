import express from 'express';
import { getDashboardStats, getAllOrdersAdmin } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard/stats', getDashboardStats);
router.get('/orders', getAllOrdersAdmin);

export default router;
