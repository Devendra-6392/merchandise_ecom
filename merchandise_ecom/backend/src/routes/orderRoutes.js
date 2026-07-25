import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);

export default router;
