// backend/api/server.js (Renamed and moved for Vercel Serverless)

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
// PORT is ignored in serverless, but kept for local development
const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_DB_URI;

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Database Connection ---
const connectDB = async () => {
    // ⚠️ CRITICAL: Mongoose connection options for Vercel Serverless
    const connectionOptions = {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        // ... any other necessary options for stability
    };
    
    try {
        await mongoose.connect(MONGO_URI, connectionOptions);
        console.log('MongoDB connected successfully! 🚀');
    } catch (err) {
        // Vercel deployment logs will show this error
        console.error('MongoDB connection error:', err.message);
        // Do NOT call process.exit(1) in a serverless function, as it kills the instance.
    }
};

// ⚠️ IMPORTANT: Call connectDB outside the export if you want a warm connection
connectDB();

// --- Routes ---
// Mount the authentication routes under the /api/auth path
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// -------------------------------------------------------------
// 🚀 CRITICAL CHANGE: Serverless Export
// Vercel requires the Express app object to be exported.
// The app.listen() call is removed.
// -------------------------------------------------------------
export default app;