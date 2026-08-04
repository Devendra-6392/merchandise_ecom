import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merchandise_ecom';
    mongoUri = mongoUri.trim();
    if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
      mongoUri = mongoUri.slice(1, -1).trim();
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};
