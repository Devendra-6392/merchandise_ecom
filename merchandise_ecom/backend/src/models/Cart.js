import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  selectedSize: { type: String, required: true },
  selectedColor: { type: String, required: true },
  selectedPrintType: { type: String, required: true },
  printLocation: { 
    type: String, 
    required: true,
    enum: ['Front', 'Back', 'Left Chest', 'Right Sleeve', 'Left Sleeve', 'Full Print'] 
  },
  artworkUrl: { type: String, default: '' },
  unitPrice: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((acc, item) => acc + item.totalItemPrice, 0);
  this.taxAmount = Math.round(this.subtotal * 0.18 * 100) / 100; // 18% GST/Tax
  this.shippingCharge = this.subtotal > 999 || this.subtotal === 0 ? 0 : 99; // Free shipping over 999
  this.finalAmount = Math.round((this.subtotal + this.taxAmount + this.shippingCharge) * 100) / 100;
};

export const Cart = mongoose.model('Cart', cartSchema);
