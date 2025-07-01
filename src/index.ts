// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import chatbotRoutes from './routes/chatbot';
import recommendationsRoutes from './routes/recommendations';
import cartRoutes from './routes/cart'; // Import the cart routes
import aiAssistantRoutes from './routes/aiAssistant'; // Import the AI assistant route

dotenv.config();

const app = express();

// Allow CORS so the frontend (http://localhost:5173) can access the API
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

// Set up the OpenAI client using the OPENAI_API_KEY from your .env
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not defined in environment variables.');
  // Optionally exit if AI functionality is critical:
  // process.exit(1);
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Attach the OpenAI instance to the app locals so it can be accessed in routes.
app.locals.openai = openai;

// Test route - useful during development to verify the API is running.
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the E-commerce Backend!');
});

// Mount routes for authentication, products, chatbot, recommendations, cart, and AI assistant.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ai', aiAssistantRoutes);

// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});