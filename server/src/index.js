// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConnect.js'; // <-- import dbConnect
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import feedRoutes from './routes/feedRoutes.js';
import cors from "cors";
 
// Initialize environment variables
dotenv.config();

// Create an Express app
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,  // allow your Vite frontend
  credentials: true,                // if you send cookies / auth headers
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to Database
connectDB();

// Define the Port
const PORT = process.env.PORT || 5000;

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/feed', feedRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
