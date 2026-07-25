import express from 'express';
import { createShipment, getTrackingInfo } from '../controllers/shippingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-shipment', protect, adminOnly, createShipment);
router.get('/track/:trackingId', getTrackingInfo);

export default router;
