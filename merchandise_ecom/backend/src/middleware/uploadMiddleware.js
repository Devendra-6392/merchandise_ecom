import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Note: Cloudinary configuration will happen in app.js or server.js where dotenv is loaded.
// Make sure to set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'merchandise_ecom',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

export const upload = multer({ storage: storage });
