import { Order, ORDER_STATUSES } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    cart.calculateTotals();

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      productName: item.product.name,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      selectedPrintType: item.selectedPrintType,
      printLocation: item.printLocation,
      artworkUrl: item.artworkUrl,
      unitPrice: item.unitPrice,
      totalItemPrice: item.totalItemPrice
    }));

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: orderItems,
      shippingAddress: shippingAddress || req.user.address,
      billingSummary: {
        subtotal: cart.subtotal,
        taxAmount: cart.taxAmount,
        shippingCharge: cart.shippingCharge,
        grandTotal: cart.finalAmount
      },
      currentStatus: 'OrderPlaced',
      paymentDetails: {
        gateway: req.body.paymentMethod === 'Razorpay' ? 'Razorpay' : 'Cash On Delivery',
        status: 'Pending'
      },
      timeline: [{
        status: 'OrderPlaced',
        note: 'Order successfully created and placed by customer',
        updatedBy: req.user.name,
        timestamp: new Date()
      }]
    });

    // Clear user cart after order placement
    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    // Send confirmation email
    const emailHtml = `
      <h1>Order Confirmation</h1>
      <p>Dear ${req.user.name},</p>
      <p>Thank you for your order! Your order <strong>${orderNumber}</strong> has been successfully placed.</p>
      <p><strong>Total Amount:</strong> ₹${order.billingSummary.grandTotal}</p>
      <p>We will notify you when your order is processed.</p>
      <p>Best regards,<br>MerchStudio Team</p>
    `;

    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: emailHtml,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customer can only view their own order unless admin
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentIndex = ORDER_STATUSES.indexOf(order.currentStatus);
    const targetIndex = ORDER_STATUSES.indexOf(status);

    if (targetIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid target status' });
    }

    // Strict sequential state transition check (No skipping allowed, except to Cancelled)
    if (status !== 'Cancelled') {
      if (targetIndex !== currentIndex + 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid state transition from '${order.currentStatus}' to '${status}'. Order steps cannot be skipped! Required next step is '${ORDER_STATUSES[currentIndex + 1]}'`
        });
      }
    }

    order.currentStatus = status;
    order.timeline.push({
      status,
      note: note || `Status advanced to ${status}`,
      updatedBy: req.user ? req.user.name : 'System Admin',
      timestamp: new Date()
    });

    await order.save();

    // Populate customer to get email
    await order.populate('customer', 'name email');

    // Send status update email
    const emailHtml = `
      <h1>Order Update</h1>
      <p>Dear ${order.customer.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong>${status}</strong>.</p>
      <p><strong>Note:</strong> ${note || `Status advanced to ${status}`}</p>
      <p>Best regards,<br>MerchStudio Team</p>
    `;

    await sendEmail({
      to: order.customer.email,
      subject: `Order Update - ${order.orderNumber}`,
      html: emailHtml,
    });

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    // Cannot cancel after printing has started
    const nonCancellableStates = ['PrintingInProgress', 'QualityCheck', 'Packed', 'ShipmentCreated', 'Shipped', 'OutForDelivery', 'Delivered'];
    if (nonCancellableStates.includes(order.currentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already in stage '${order.currentStatus}' (Printing or beyond).`
      });
    }

    order.currentStatus = 'Cancelled';
    order.timeline.push({
      status: 'Cancelled',
      note: 'Order cancelled by customer before printing started.',
      updatedBy: req.user.name,
      timestamp: new Date()
    });

    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};
