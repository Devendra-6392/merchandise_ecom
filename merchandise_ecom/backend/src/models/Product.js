import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  basePrice: { type: Number },
  image: { type: String, required: true },
  hoverImage: { type: String },
  images: [{ type: String }],
  badge: { type: String },
  sizes: [{ type: String }],
  specs: [{ type: String }],
  availableColors: [{
    name: String,
    hexCode: String
  }],
  allowedPrintTypes: [{ 
    type: String, 
    enum: ['Screen Printing', 'DTF Printing', 'Sublimation', 'Embroidery', 'UV Printing'] 
  }],
  stockQuantity: { type: Number, required: true, min: 0, default: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
