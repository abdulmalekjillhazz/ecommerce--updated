import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

dotenv.config();

let dbPromise;

const handler = async (req, res) => {
  try {
    dbPromise ||= connectDB();
    await dbPromise;
    return app(req, res);
  } catch (error) {
    console.error('[Vercel API] Startup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
};

export default handler;
