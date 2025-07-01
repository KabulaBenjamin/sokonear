// src/routes/chatbot.ts
import { Router } from 'express';
const router = Router();

// Simple chatbot endpoint – adjust logic as needed
router.post('/', (req, res) => {
  const userMessage = req.body.message;
  let botResponse = "I'm not sure how to answer that.";

  if (userMessage.toLowerCase().includes("hello")) {
    botResponse = "Hi there! Welcome to SokoNear.";
  } else if (userMessage.toLowerCase().includes("help")) {
    botResponse = "How can I help you today?";
  }
  // Return a JSON response
  res.json({ response: botResponse });
});

export default router;