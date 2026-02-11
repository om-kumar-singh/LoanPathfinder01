// Vercel serverless function entry point
require('dotenv').config();
const connectDB = require('../config/db');
const app = require('../app');

// Connect to MongoDB
let isConnected = false;

const connect = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
};

// Connect on cold start
connect();

// Export for Vercel serverless
module.exports = async (req, res) => {
  // Ensure DB connection
  await connect();
  // Handle the request
  app(req, res);
};
