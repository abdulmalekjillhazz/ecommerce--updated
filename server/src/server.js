import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 E-Commerce API Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on PORT: http://localhost:${PORT}`);
    console.log(`🔗 Connected Client Origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`====================================================`);
  });

  // Handle graceful shutdowns
  const handleExit = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleExit('SIGTERM'));
  process.on('SIGINT', () => handleExit('SIGINT'));
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
