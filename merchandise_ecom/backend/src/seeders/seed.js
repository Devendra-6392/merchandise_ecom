import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

const sampleUsers = [
  {
    name: 'Admin Manager',
    email: 'admin@merchandise.com',
    password: 'adminpassword123',
    role: 'admin',
    phone: '+91 9876543210',
    address: {
      street: '123 HQ Boulevard, Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      country: 'India'
    }
  },
  {
    name: 'John Doe',
    email: 'customer@example.com',
    password: 'customerpassword123',
    role: 'customer',
    phone: '+91 9123456789',
    address: {
      street: '45 Park View Apartments, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    }
  }
];

const sampleProducts = [
  {
    name: 'Premium Oversized Cotton T-Shirt',
    sku: 'TSHIRT-COT-001',
    description: 'Heavyweight 240 GSM organic cotton custom printable oversized t-shirt. Ideal for DTF and Screen Printing.',
    category: 'T-Shirts',
    basePrice: 599,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Jet Black', hexCode: '#000000' },
      { name: 'Pure White', hexCode: '#FFFFFF' },
      { name: 'Navy Blue', hexCode: '#000080' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing', 'Embroidery'],
    stockQuantity: 250
  },
  {
    name: 'Custom Fleece Pullover Hoodie',
    sku: 'HOODIE-FLE-002',
    description: '350 GSM premium fleece lined custom hoodie with kangaroo pockets and double-layered hood.',
    category: 'Hoodies',
    basePrice: 1299,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Heather Grey', hexCode: '#808080' },
      { name: 'Charcoal Black', hexCode: '#1A1A1A' }
    ],
    allowedPrintTypes: ['DTF Printing', 'Embroidery', 'Screen Printing'],
    stockQuantity: 120
  },
  {
    name: 'Embroidered Structured Snapback Cap',
    sku: 'CAP-SNAP-003',
    description: '6-panel structured snapback cap featuring premium cotton twill material.',
    category: 'Caps',
    basePrice: 399,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['One Size'],
    availableColors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Olive Green', hexCode: '#556B2F' }
    ],
    allowedPrintTypes: ['Embroidery'],
    stockQuantity: 180
  },
  {
    name: 'Custom Ceramic Coffee Mug (350ml)',
    sku: 'MUG-CER-004',
    description: 'High-gloss ceramic mug with AAA grade sublimated print longevity. Dishwasher and microwave safe.',
    category: 'Mugs',
    basePrice: 249,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['One Size'],
    availableColors: [
      { name: 'Classic White', hexCode: '#FFFFFF' }
    ],
    allowedPrintTypes: ['Sublimation', 'UV Printing'],
    stockQuantity: 500
  },
  {
    name: 'Insulated Stainless Steel Water Bottle (750ml)',
    sku: 'BOT-SS-005',
    description: 'Double-wall vacuum insulated flask keeping drinks hot or cold for 24 hours. Custom laser engraving or UV print.',
    category: 'Bottles',
    basePrice: 699,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['One Size'],
    availableColors: [
      { name: 'Matte Black', hexCode: '#111111' },
      { name: 'Silver Steel', hexCode: '#C0C0C0' }
    ],
    allowedPrintTypes: ['UV Printing', 'Sublimation'],
    stockQuantity: 90
  },
  {
    name: 'Heavy Duty Canvas Tote Bag',
    sku: 'TOTE-CAN-006',
    description: 'Eco-friendly 100% natural cotton canvas tote bag with reinforced handles.',
    category: 'Tote Bags',
    basePrice: 199,
    images: ['https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['One Size'],
    availableColors: [
      { name: 'Natural Beige', hexCode: '#F5F5DC' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing'],
    stockQuantity: 300
  },
  {
    name: 'Die-Cut Vinyl Die-Cut Stickers (Pack of 5)',
    sku: 'STICKER-VIN-007',
    description: 'Waterproof, UV resistant custom die-cut vinyl stickers for laptops and water bottles.',
    category: 'Stickers',
    basePrice: 149,
    images: ['https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80'],
    availableSizes: ['One Size'],
    availableColors: [
      { name: 'Multicolor', hexCode: '#FF5733' }
    ],
    allowedPrintTypes: ['UV Printing'],
    stockQuantity: 1000
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('[Seeder] Inserting sample users...');
    const createdUsers = await User.create(sampleUsers);

    console.log('[Seeder] Inserting merchandise products...');
    await Product.create(sampleProducts);

    console.log('✅ [Seeder] Database seeded successfully!');
    console.log(`🔑 Admin Credentials: ${sampleUsers[0].email} / ${sampleUsers[0].password}`);
    console.log(`👤 Customer Credentials: ${sampleUsers[1].email} / ${sampleUsers[1].password}`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
