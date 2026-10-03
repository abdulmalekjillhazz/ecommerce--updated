import mongoose from 'mongoose';

let cached = globalThis.__mongooseCache || { conn: null, promise: null };
globalThis.__mongooseCache = cached;

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is not configured');

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};
