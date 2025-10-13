import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { // We will store the HASHED password here
    type: String,
    required: true,
  },
}, { timestamps: true }); // Adds 'createdAt' and 'updatedAt' fields automatically

const User = mongoose.model('User', userSchema);
export default User;