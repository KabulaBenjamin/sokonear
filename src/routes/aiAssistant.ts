// src/routes/aiAssistant.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Define an async route handler with Request, Response and NextFunction.
router.post(
  '/assistant',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get the OpenAI instance from app.locals
      const openai = req.app.locals.openai;
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: 'No prompt provided' });
        return;
      }

      // Call the Chat API endpoint for gpt-3.5-turbo.
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      const reply =
        completion.choices[0]?.message?.content ?? 'No reply generated.';
      res.json({ reply });
    } catch (error) {
      console.error('Error in AI assistant:', error);
      next(error); // Pass the error to Express error handling middleware
    }
  }
);

export default router;