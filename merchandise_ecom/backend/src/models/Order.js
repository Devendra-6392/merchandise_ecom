import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'OrderPlaced',
  'PaymentVerified',
  'DesignApproved',
  'PrintingInProgress',
  'QualityCheck',
  'Packed',
  'ShipmentCreated',
  'Shipped',
  'OutForDelivery',
  'Delivered',
  'Cancelled'
];

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, required: true },
  selectedColor: { type: String, required: true },
  selectedPrintType: { type: String, required: true },
  printLocation: { type: String, required: true },
  artworkUrl: { type: String },
  unitPrice: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true }
});

const timelineEntrySchema = new mongoose.Schema({
  status: { type: String, required: true, enum: ORDER_STATUSES },
  note: { type: String },
  updatedBy: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  billingSummary: {
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  currentStatus: {
    type: String,
    enum: ORDER_STATUSES,
    default: 'OrderPlaced'
  },
  timeline: [timelineEntrySchema],
  paymentDetails: {
    paymentId: { type: String },
    transactionId: { type: String },
    gateway: { type: String, default: 'Razorpay / Mock' },
    status: { type: String, enum: ['Pending', 'Successful', 'Failed', 'Refunded'], default: 'Pending' },
    paidAt: { type: Date }
  },
  shippingDetails: {
    courierName: { type: String, default: 'Shiprocket / Delhivery Mock' },
    trackingNumber: { type: String },
    shipmentId: { type: String },
    estimatedDeliveryDate: { type: Date },
    shippingStatus: { type: String, default: 'Pending' }
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
