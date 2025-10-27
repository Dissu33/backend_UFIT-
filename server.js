// backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_DB_URI;

// Convert PORT to number
const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Database Connection ---
const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully! 🚀');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- Routes ---
// Mount the authentication routes under the /api/auth path
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Server Start ---
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`Server running on port ${portNumber}`);
});