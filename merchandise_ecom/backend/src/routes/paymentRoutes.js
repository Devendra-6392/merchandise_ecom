import express from 'express';
import { createPaymentOrder, getPaymentConfig, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
