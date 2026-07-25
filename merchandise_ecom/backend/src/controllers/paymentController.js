import { Order } from '../models/Order.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const mockPaymentOrder = {
      id: `pay_order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Math.round(order.billingSummary.grandTotal * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      status: 'created'
    };

    res.json({ success: true, paymentOrder: mockPaymentOrder });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, transactionId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isSuccess = status !== 'Failed';

    order.paymentDetails = {
      paymentId: paymentId || `PAY-${Date.now()}`,
      transactionId: transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      gateway: 'Razorpay / Stripe Mock',
      status: isSuccess ? 'Successful' : 'Failed',
      paidAt: isSuccess ? new Date() : null
    };

    if (isSuccess && order.currentStatus === 'OrderPlaced') {
      order.currentStatus = 'PaymentVerified';
      order.timeline.push({
        status: 'PaymentVerified',
        note: `Payment verified successfully via ${order.paymentDetails.gateway}`,
        updatedBy: 'Payment Service',
        timestamp: new Date()
      });
    }

    await order.save();
    res.json({ success: true, message: isSuccess ? 'Payment verified successfully' : 'Payment failed', order });
  } catch (error) {
    next(error);
  }
};
