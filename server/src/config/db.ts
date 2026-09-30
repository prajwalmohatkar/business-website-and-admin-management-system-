import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from '../utils/logger';
import { localStore } from '../utils/localStore';

let isConnected = false;

// Disable Mongoose command buffering so queries fail-fast when offline
mongoose.set('bufferCommands', false);

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  // Always ensure local storage is initialized as safe fallback
  await localStore.init();

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
    });

    isConnected = !!conn.connections[0].readyState;
    logger.info(`MongoDB Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    logger.warn(`MongoDB not connected (${error.message}).`);
    logger.info('>> Server is operating in ZERO-SETUP LOCAL STORAGE MODE.');
    logger.info('>> All products, categories, settings, and admin logins work out-of-the-box.');
    logger.info('>> To use cloud MongoDB, set MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected. Switched to local storage mode.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('MongoDB reconnected.');
});
