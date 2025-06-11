// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import chatbotRoutes from './routes/chatbot';
import recommendationsRoutes from './routes/recommendations';
import cartRoutes from './routes/cart'; // Import the cart routes

dotenv.config();

const app = express();

// Allow CORS to let the frontend (http://localhost:5173) access the API
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Ensure the MongoDB URI is provided
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Test route - useful during development to verify the API is running.
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the E-commerce Backend!');
});

// Mount routes for authentication, products, chatbot, recommendations, and cart
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/cart', cartRoutes); // Mount cart routes

// In src/index.ts, before mounting your routes
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});