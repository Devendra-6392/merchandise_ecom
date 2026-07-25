import { Order } from '../models/Order.js';

export const createShipment = async (req, res, next) => {
  try {
    const { orderId, courierName } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const trackingNumber = `TRK${Math.floor(100000000 + Math.random() * 900000000)}`;
    const shipmentId = `SHP-${Date.now()}`;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 4);

    order.shippingDetails = {
      courierName: courierName || 'Shiprocket Express',
      trackingNumber,
      shipmentId,
      estimatedDeliveryDate: estimatedDate,
      shippingStatus: 'In Transit'
    };

    if (order.currentStatus === 'Packed') {
      order.currentStatus = 'ShipmentCreated';
      order.timeline.push({
        status: 'ShipmentCreated',
        note: `Shipment created via ${order.shippingDetails.courierName}. Tracking #: ${trackingNumber}`,
        updatedBy: req.user ? req.user.name : 'System Admin',
        timestamp: new Date()
      });
    }

    await order.save();
    res.json({ success: true, message: 'Shipment created successfully', shippingDetails: order.shippingDetails, order });
  } catch (error) {
    next(error);
  }
};

export const getTrackingInfo = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const order = await Order.findOne({ 'shippingDetails.trackingNumber': trackingId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Shipment tracking record not found' });
    }

    res.json({
      success: true,
      trackingInfo: {
        orderNumber: order.orderNumber,
        currentStatus: order.currentStatus,
        shippingDetails: order.shippingDetails,
        timeline: order.timeline
      }
    });
  } catch (error) {
    next(error);
  }
};
