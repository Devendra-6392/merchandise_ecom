import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => {
      return order.paymentDetails && order.paymentDetails.status === 'Successful'
        ? sum + order.billingSummary.grandTotal
        : sum;
    }, 0);

    const pendingOrdersCount = await Order.countDocuments({ currentStatus: 'OrderPlaced' });
    const printingOrdersCount = await Order.countDocuments({ currentStatus: 'PrintingInProgress' });
    const deliveredOrdersCount = await Order.countDocuments({ currentStatus: 'Delivered' });

    const lowStockProducts = await Product.find({ stockQuantity: { $lt: 20 }, isActive: true });

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrdersCount,
        printingOrdersCount,
        deliveredOrdersCount,
        lowStockProductsCount: lowStockProducts.length
      },
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.currentStatus = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};
