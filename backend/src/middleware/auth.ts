import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { dbService } from '../services/db.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    const user = await dbService.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ error: 'User no longer exists or session expired' });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
