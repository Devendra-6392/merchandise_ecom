import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['T-Shirts', 'Hoodies', 'Caps', 'Mugs', 'Bottles', 'Tote Bags', 'Stickers'] 
  },
  basePrice: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  availableSizes: [{ 
    type: String, 
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size'] 
  }],
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
