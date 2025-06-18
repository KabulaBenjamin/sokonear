// src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // In a real application, you'd verify a JWT or session data here.
  // For demonstration, let’s assume a header 'authorization' holds a JSON string:
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user = JSON.parse(req.headers.authorization);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};