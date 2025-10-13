import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path if necessary
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ----------------------
// POST /api/auth/signup
// ----------------------
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Save user to database
    await newUser.save();

    // Do NOT return the password hash
    const userResponse = newUser.toObject();
    delete userResponse.password; 

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// ----------------------
// POST /api/auth/login
// ----------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid Credentials.' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials.' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-fallback-secret', // Use a secret key from .env file
      { expiresIn: '1h' }
    );

    // 4. Send the token back
    res.json({ 
        message: 'Login successful!', 
        token,
        user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;