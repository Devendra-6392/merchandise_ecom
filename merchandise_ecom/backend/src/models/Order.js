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
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  selectedSize: { type: String, default: 'M' },
  selectedColor: { type: String, default: 'Standard' },
  selectedPrintType: { type: String, default: 'Screen Printing' },
  printLocation: { type: String, default: 'Front' },
  artworkUrl: { type: String, default: '' },
  unitPrice: { type: Number, required: true, default: 0 },
  totalItemPrice: { type: Number, required: true, default: 0 }
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
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  billingSummary: {
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 }
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
