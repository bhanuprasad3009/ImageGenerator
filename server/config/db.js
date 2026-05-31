import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI;

    // Fallback if no MONGO_URI is set or if it's set to localhost but we don't have MongoDB running
    if (!dbUrl || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      console.log('No external MongoDB URI found or pointing to localhost. Spinning up MongoMemoryServer...');
      mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
      console.log(`MongoMemoryServer started at ${dbUrl}`);
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // If we used MongoMemoryServer, we should seed the database automatically so it's ready to go!
    if (mongoServer) {
      console.log('In-memory database detected. Running database seeder...');
      const { seedDatabaseInline } = await import('../utils/seedInline.js');
      await seedDatabaseInline();
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

export default connectDB;
