// Vercel serverless function - handles all /api/* routes
// Note: Environment variables are injected by Vercel, no need for dotenv in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
}
const connectDB = require('../server/config/db');
const app = require('../server/app');

// Connect to MongoDB (with connection pooling for serverless)
let isConnected = false;
let connectionPromise = null;

const connect = async () => {
  if (isConnected) return;
  
  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        await connectDB();
        isConnected = true;
        console.log('MongoDB connected');
      } catch (err) {
        console.error('MongoDB connection error:', err);
        connectionPromise = null;
        throw err;
      }
    })();
  }
  
  return connectionPromise;
};

// Export for Vercel serverless
module.exports = async (req, res) => {
  try {
    await connect();
    app(req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};
