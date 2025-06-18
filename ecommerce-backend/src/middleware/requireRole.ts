// src/middleware/requireRole.ts
import { Request, Response, NextFunction } from 'express';

export const requireRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: insufficient role' });
};