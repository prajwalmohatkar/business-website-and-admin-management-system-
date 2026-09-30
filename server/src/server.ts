import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { logger } from './utils/logger';
import { seedDatabase } from './seed/seedData';
import { localStore } from './utils/localStore';

const startServer = async () => {
  try {
    // Ensure zero-setup local store is ready immediately
    await localStore.init();

    const app = createApp();

    // Start HTTP server immediately so health checks and endpoints are responsive
    const server = app.listen(ENV.PORT, () => {
      logger.info(`=======================================================`);
      logger.info(`Backend Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
      logger.info(`API Base URL: http://localhost:${ENV.PORT}/api`);
      logger.info(`Sitemap:      http://localhost:${ENV.PORT}/sitemap.xml`);
      logger.info(`Robots:       http://localhost:${ENV.PORT}/robots.txt`);
      logger.info(`=======================================================`);
    });

    // Connect to database asynchronously
    connectDB()
      .then(async (dbConnected) => {
        if (dbConnected) {
          await seedDatabase();
        } else {
          logger.warn('Server running without active MongoDB connection.');
          logger.warn('Configure MONGODB_URI in server/.env (e.g. MongoDB Atlas).');
        }
      })
      .catch((err) => {
        logger.error('Database connection error:', err);
      });

    // Handle graceful shutdown
    const handleShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error: any) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
