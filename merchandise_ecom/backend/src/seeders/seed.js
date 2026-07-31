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
    name: 'ORANGERED OVERSIZED MONOLITH HOODIE',
    sku: 'HOODIE-MONO-001',
    description: 'Architectural boxy hoodie crafted from 500 GSM custom-knit French Terry cotton. Features distressed double-layer hood and minimal Orangered tonal embroidery.',
    category: 'Outerwear',
    price: 2499,
    basePrice: 2499,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'LIMITED / 50 PCS',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: ['100% Organic French Terry Cotton', 'Crafted in Mumbai, India', 'Custom Matte Black Hardware', 'Preshrunk Heavy Fabric'],
    availableColors: [
      { name: 'Jet Black', hexCode: '#000000' },
      { name: 'Heather Grey', hexCode: '#808080' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing', 'Embroidery'],
    stockQuantity: 45
  },
  {
    name: 'ARCHIVAL TRENCH COAT / ORANGERED ACCENT',
    sku: 'COAT-TRN-002',
    description: 'Double-breasted trench coat with structured shoulder pads and Orangered silk satin interior lining. Features storm flap and custom engraved horn buttons.',
    category: 'Coats',
    price: 5999,
    basePrice: 5999,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'RUNWAY EXCLUSIVE',
    sizes: ['M', 'L', 'XL'],
    specs: ['Water-Resistant Premium Twill', 'Orangered Silk Satin Lining', 'Belted Waist with Steel Buckle', 'Dry Clean Only'],
    availableColors: [
      { name: 'Beige Twill', hexCode: '#F5F5DC' },
      { name: 'Charcoal Black', hexCode: '#1A1A1A' }
    ],
    allowedPrintTypes: ['Embroidery', 'Screen Printing'],
    stockQuantity: 20
  },
  {
    name: 'RAW DENIM SELVEDGE CARGO TROUSERS',
    sku: 'PANTS-DEN-003',
    description: '14oz selvedge denim pant with wide-leg profile, articulated cargo pockets, and Orangered contrast topstitching.',
    category: 'Pants',
    price: 3299,
    basePrice: 3299,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'NEW IN',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: ['14oz Premium Selvedge Denim', 'Custom Rivets & Button Fly', 'Articulated Knee Pleats', 'Unwashed Raw Finish'],
    availableColors: [
      { name: 'Indigo Blue', hexCode: '#000080' },
      { name: 'Washed Black', hexCode: '#222222' }
    ],
    allowedPrintTypes: ['Embroidery', 'Screen Printing'],
    stockQuantity: 80
  },
  {
    name: 'DECONSTRUCTED FLIGHT BOMBER JACKET',
    sku: 'BOMB-FLGT-004',
    description: 'Heavy nylon MA-1 flight jacket with asymmetrical Orangered utility straps, custom ribbing, and thermal insulation.',
    category: 'Outerwear',
    price: 4999,
    basePrice: 4999,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'RESTOCKED',
    sizes: ['S', 'M', 'L'],
    specs: ['Military-Grade Flight Nylon', 'Primaloft Thermal Insulation', 'Heavy Duty Two-Way Zip', 'Water-Repellent Outer'],
    availableColors: [
      { name: 'Olive Green', hexCode: '#556B2F' },
      { name: 'Jet Black', hexCode: '#000000' }
    ],
    allowedPrintTypes: ['DTF Printing', 'Embroidery'],
    stockQuantity: 30
  },
  {
    name: 'TAILORED EDITORIAL BLAZER / CHARCOAL',
    sku: 'BLZR-TLR-005',
    description: 'Single-button peak-lapel blazer in deep charcoal virgin wool with high-waist darting and Orangered interior piping.',
    category: 'Tailoring',
    price: 4499,
    basePrice: 4499,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'CLASSIC',
    sizes: ['M', 'L', 'XL'],
    specs: ['100% Virgin Wool Blend', 'Breathable Lining', 'Padded Shoulders & Peak Lapel', 'Tailored Fit'],
    availableColors: [
      { name: 'Charcoal Grey', hexCode: '#333333' }
    ],
    allowedPrintTypes: ['Embroidery'],
    stockQuantity: 25
  },
  {
    name: 'PREMIUM OVERSIZED COTTON T-SHIRT',
    sku: 'TSHIRT-COT-006',
    description: 'Heavyweight 240 GSM organic cotton custom printable oversized t-shirt. Ideal for DTF and Screen Printing.',
    category: 'T-Shirts',
    price: 799,
    basePrice: 799,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'ESSENTIAL',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: ['240 GSM Organic Cotton', 'Pre-shrunk Fabric', 'Ribbed Collar', 'Ideal for DTF & Screen Print'],
    availableColors: [
      { name: 'Jet Black', hexCode: '#000000' },
      { name: 'Pure White', hexCode: '#FFFFFF' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing', 'Embroidery'],
    stockQuantity: 250
  },
  {
    name: 'SIGNATURE MONOGRAM HEAVYWEIGHT TEE',
    sku: 'TEE-MONO-007',
    description: 'Boxy fit short sleeve t-shirt cut from 300 GSM combed jersey with high-density Orangered studio chest print.',
    category: 'Tops',
    price: 1299,
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'BESTSELLER',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: ['300 GSM Combed Organic Cotton', 'Ribbed Collar', 'High-Density Screenprint', 'Pre-shrunk Garment Wash'],
    availableColors: [
      { name: 'Off White', hexCode: '#FAF9F6' },
      { name: 'Vintage Black', hexCode: '#1C1C1C' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing'],
    stockQuantity: 150
  },
  {
    name: 'EMBROIDERED STRUCTURED SNAPBACK CAP',
    sku: 'CAP-SNAP-008',
    description: '6-panel structured snapback cap featuring premium cotton twill material and 3D puff embroidery capability.',
    category: 'Caps',
    price: 499,
    basePrice: 499,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'TRENDING',
    sizes: ['One Size'],
    specs: ['100% Cotton Twill', 'Adjustable Snap Closure', '6-Panel Structure', 'High-Density Embroidery Ready'],
    availableColors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'Olive Green', hexCode: '#556B2F' }
    ],
    allowedPrintTypes: ['Embroidery'],
    stockQuantity: 180
  },
  {
    name: 'CUSTOM CERAMIC COFFEE MUG (350ML)',
    sku: 'MUG-CER-009',
    description: 'High-gloss ceramic mug with AAA grade sublimated print longevity. Dishwasher and microwave safe.',
    category: 'Mugs',
    price: 299,
    basePrice: 299,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'POPULAR',
    sizes: ['One Size'],
    specs: ['350ml Ceramic Capacity', 'AAA Sublimation Coating', 'Microwave & Dishwasher Safe', 'Glossy Finish'],
    availableColors: [
      { name: 'Classic White', hexCode: '#FFFFFF' }
    ],
    allowedPrintTypes: ['Sublimation', 'UV Printing'],
    stockQuantity: 500
  },
  {
    name: 'INSULATED STAINLESS STEEL BOTTLE (750ML)',
    sku: 'BOT-SS-010',
    description: 'Double-wall vacuum insulated flask keeping drinks hot or cold for 24 hours. Custom laser engraving or UV print.',
    category: 'Bottles',
    price: 799,
    basePrice: 799,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'ECO-FRIENDLY',
    sizes: ['One Size'],
    specs: ['750ml Food-Grade Steel', '24hr Temperature Lock', 'Leak-Proof Cap', 'Laser Engraving Ready'],
    availableColors: [
      { name: 'Matte Black', hexCode: '#111111' },
      { name: 'Silver Steel', hexCode: '#C0C0C0' }
    ],
    allowedPrintTypes: ['UV Printing', 'Sublimation'],
    stockQuantity: 90
  },
  {
    name: 'HEAVY DUTY CANVAS TOTE BAG',
    sku: 'TOTE-CAN-011',
    description: 'Eco-friendly 100% natural cotton canvas tote bag with reinforced handles and interior zipper pouch.',
    category: 'Tote Bags',
    price: 399,
    basePrice: 399,
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'ORGANIC COTTON',
    sizes: ['One Size'],
    specs: ['100% Organic Canvas Cotton', 'Heavy Duty X-Stitching', 'Interior Pocket', 'DTF & Screen Print Ready'],
    availableColors: [
      { name: 'Natural Beige', hexCode: '#F5F5DC' }
    ],
    allowedPrintTypes: ['Screen Printing', 'DTF Printing'],
    stockQuantity: 300
  },
  {
    name: 'DIE-CUT VINYL STICKERS (PACK OF 5)',
    sku: 'STICKER-VIN-012',
    description: 'Waterproof, UV resistant custom die-cut vinyl stickers for laptops and water bottles.',
    category: 'Stickers',
    price: 199,
    basePrice: 199,
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=85',
    hoverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85'
    ],
    badge: 'WATERPROOF',
    sizes: ['One Size'],
    specs: ['Premium Vinyl Film', 'Matte Laminate Protection', 'Scratch & Weather Proof', 'Residue-Free Peel'],
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
