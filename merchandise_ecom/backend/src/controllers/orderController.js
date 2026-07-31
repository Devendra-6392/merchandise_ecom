import mongoose from 'mongoose';
import { Order, ORDER_STATUSES } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items: bodyItems, billingSummary: bodyBilling, paymentMethod } = req.body;

    let orderItems = [];

    if (bodyItems && Array.isArray(bodyItems) && bodyItems.length > 0) {
      const defaultProduct = await Product.findOne({ isActive: true });
      orderItems = bodyItems.map(item => {
        let prodId = item.product || item.productId || item._id;
        if (!prodId || !mongoose.Types.ObjectId.isValid(prodId)) {
          prodId = defaultProduct ? defaultProduct._id : undefined;
        }
        return {
          product: prodId,
          productName: item.productName || item.name || 'Custom Garment',
          quantity: Number(item.quantity || 1),
          selectedSize: item.selectedSize || item.size || 'M',
          selectedColor: item.selectedColor || item.color || 'Standard',
          selectedPrintType: item.selectedPrintType || item.printType || 'Screen Printing',
          printLocation: item.printLocation || 'Front',
          artworkUrl: item.artworkUrl || '',
          unitPrice: Number(item.unitPrice || item.price || 0),
          totalItemPrice: Number(item.totalItemPrice || (item.unitPrice || 0) * (item.quantity || 1))
        };
      });
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (cart && cart.items.length > 0) {
        cart.calculateTotals();
        orderItems = cart.items.map(item => ({
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
        // Clear user cart
        cart.items = [];
        cart.calculateTotals();
        await cart.save();
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided for order creation' });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const calcSubtotal = orderItems.reduce((acc, curr) => acc + curr.totalItemPrice, 0);
    const subtotal = bodyBilling?.subtotal !== undefined ? Number(bodyBilling.subtotal) : calcSubtotal;
    const taxAmount = bodyBilling?.taxAmount !== undefined ? Number(bodyBilling.taxAmount) : 0;
    const shippingCharge = bodyBilling?.shippingCharge !== undefined ? Number(bodyBilling.shippingCharge) : 150;
    const discountAmount = bodyBilling?.discountAmount !== undefined ? Number(bodyBilling.discountAmount) : 0;
    const grandTotal = bodyBilling?.grandTotal !== undefined ? Number(bodyBilling.grandTotal) : (subtotal + taxAmount + shippingCharge - discountAmount);

    let customerId = req.user ? req.user._id : null;
    if (!customerId) {
      const customerEmail = shippingAddress?.email || 'customer@example.com';
      let existingCust = await User.findOne({ email: customerEmail });
      if (!existingCust) {
        existingCust = await User.findOne({ role: 'customer' });
      }
      if (!existingCust) {
        existingCust = await User.create({
          name: shippingAddress?.name || 'Devendra Yadav',
          email: customerEmail,
          password: 'defaultpassword123',
          role: 'customer'
        });
      }
      customerId = existingCust._id;
    }

    const order = await Order.create({
      orderNumber,
      customer: customerId,
      items: orderItems,
      shippingAddress: shippingAddress || req.user?.address || {
        name: 'Devendra Yadav',
        phone: '+91 98765 43210',
        street: 'Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        country: 'India'
      },
      billingSummary: {
        subtotal,
        taxAmount,
        shippingCharge,
        discountAmount,
        grandTotal
      },
      currentStatus: 'OrderPlaced',
      paymentDetails: {
        gateway: paymentMethod === 'Razorpay' ? 'Razorpay' : 'Cash On Delivery',
        status: 'Pending'
      },
      timeline: [{
        status: 'OrderPlaced',
        note: 'Order successfully created and placed by customer',
        updatedBy: req.user ? req.user.name : (shippingAddress?.name || 'Customer'),
        timestamp: new Date()
      }]
    });

    // Attempt email sending safely
    try {
      const emailHtml = `
        <h1>Order Confirmation</h1>
        <p>Dear ${req.user?.name || shippingAddress?.name || 'Customer'},</p>
        <p>Thank you for your order! Your order <strong>${orderNumber}</strong> has been successfully placed.</p>
        <p><strong>Total Amount:</strong> ₹${order.billingSummary.grandTotal}</p>
        <p>We will notify you when your order is processed.</p>
        <p>Best regards,<br>MerchStudio Team</p>
      `;

      if (req.user?.email || customerEmail) {
        await sendEmail({
          to: req.user?.email || customerEmail,
          subject: `Order Confirmation - ${orderNumber}`,
          html: emailHtml,
        });
      }
    } catch (emailErr) {
      console.warn('[OrderEmail] Confirmation email notice:', emailErr.message);
    }

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
    const idOrNum = req.params.id;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(idOrNum)) {
      query = { $or: [{ _id: idOrNum }, { orderNumber: idOrNum }] };
    } else {
      query = { orderNumber: idOrNum };
    }

    const order = await Order.findOne(query)
      .populate('customer', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
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

    const targetIndex = ORDER_STATUSES.indexOf(status);
    if (targetIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid target status' });
    }

    order.currentStatus = status;
    order.timeline.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user ? req.user.name : 'System Admin',
      timestamp: new Date()
    });

    await order.save();

    // Populate customer to get email if available
    try {
      await order.populate('customer', 'name email');
      if (order.customer && order.customer.email) {
        const emailHtml = `
          <h1>Order Update</h1>
          <p>Dear ${order.customer.name},</p>
          <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong>${status}</strong>.</p>
          <p><strong>Note:</strong> ${note || `Status updated to ${status}`}</p>
          <p>Best regards,<br>MerchStudio Team</p>
        `;

        await sendEmail({
          to: order.customer.email,
          subject: `Order Update - ${order.orderNumber}`,
          html: emailHtml,
        });
      }
    } catch (emailErr) {
      console.warn('[OrderEmail Warning] Status update email notice:', emailErr.message);
    }

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
