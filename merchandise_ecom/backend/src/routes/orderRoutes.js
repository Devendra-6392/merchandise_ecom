import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
