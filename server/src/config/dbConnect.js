// src/config/dbConnect.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!mongoURI) {
    console.error('MONGO_URI is not defined. Please set it in your .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process if unable to connect
  }
};

export default connectDB;
