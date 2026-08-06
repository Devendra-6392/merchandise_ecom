import { Order } from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
    });

    const options = {
      amount: Math.round(order.billingSummary.grandTotal * 100),
      currency: 'INR',
      receipt: order.orderNumber,
    };

    const paymentOrder = await razorpay.orders.create(options);

    res.json({ success: true, paymentOrder });
  } catch (error) {
    console.error("Razorpay Error:", error);
    next(error);
  }
};

export const getPaymentConfig = async (req, res, next) => {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key';
    res.json({ success: true, razorpayKeyId });
  } catch (error) {
    console.error("Payment config error:", error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, transactionId, status, razorpay_signature, razorpay_order_id, razorpay_payment_id } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let isSuccess = false;

    if (status !== 'Failed' && razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret';
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        isSuccess = true;
      }
    }

    if (!isSuccess && status !== 'Failed') {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    order.paymentDetails = {
      paymentId: razorpay_payment_id || paymentId || `PAY-${Date.now()}`,
      transactionId: transactionId || razorpay_order_id || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      gateway: 'Razorpay',
      status: isSuccess ? 'Successful' : 'Failed',
      paidAt: isSuccess ? new Date() : null
    };

    if (isSuccess && order.currentStatus === 'OrderPlaced') {
      order.currentStatus = 'PaymentVerified';
      order.timeline.push({
        status: 'PaymentVerified',
        note: `Payment verified successfully via Razorpay`,
        updatedBy: 'Payment Service',
        timestamp: new Date()
      });
    }

    await order.save();
    res.json({ success: true, message: isSuccess ? 'Payment verified successfully' : 'Payment failed', order });
  } catch (error) {
    console.error("Verification Error:", error);
    next(error);
  }
};
