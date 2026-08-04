import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to file location (backend/.env) as well as CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudApiKey = process.env.CLOUDINARY_API_KEY?.trim();
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

if (!cloudName || !cloudApiKey || !cloudApiSecret || cloudName.includes('your_') || cloudApiKey.includes('your_') || cloudApiSecret.includes('your_')) {
  console.warn('⚠️ Cloudinary is not fully configured. Image upload requests will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set with valid credentials.');
}

// Connect to MongoDB Database
connectDB();

// Middleware Setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://virasat-seven.vercel.app',
  'https://turf.localhostt.live',
  'https://virasat-anqmlp2lk-devendrabhattsqaure-7149s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    // allow any vercel deployment (wildcard logic) or exact matches
    if (allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root API Welcome & Health Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Custom Merchandise E-Commerce & Order Management API',
    version: '1.0.0',
    documentation: '/PROJECT_SPECIFICATION_AND_WORKFLOW.md'
  });
});

// API root route for proxy requests to /api
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'API root is available. Use /api/v1/... for backend endpoints.',
    version: '1.0.0',
    routes: '/api/v1'
  });
});

// API root route for /api/v1
app.get('/api/v1', (req, res) => {
  res.json({
    status: 'online',
    message: 'API v1 root is available. Use /api/v1/<resource> to access backend endpoints.',
    version: '1.0.0',
    available: [
      '/api/v1/auth',
      '/api/v1/products',
      '/api/v1/cart',
      '/api/v1/orders',
      '/api/v1/payments',
      '/api/v1/shipping',
      '/api/v1/admin',
      '/api/v1/categories',
      '/api/v1/upload',
      '/api/v1/wishlist'
    ]
  });
});

// API Routes Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/shipping', shippingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
});
