import mongoose from 'mongoose';
import { logger } from './logger';

const mongoUri = process.env.DB_URL;

if (!mongoUri) {
  throw new Error('Environment variable DB_URL is not defined');
}

/**
 * Connects to MongoDB using mongoose.
 */
export const connectToDatabase = () => {
  try {
    mongoose.connect(mongoUri);
    logger.info('🛢️ Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB.
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};
