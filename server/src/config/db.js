import mongoose from 'mongoose';

const redactMongoUri = (uri) => {
  if (!uri) return '<missing>';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:<redacted>@');
};

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });

    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection failed for ${redactMongoUri(mongoUri)}`);
    throw error;
  }
};
