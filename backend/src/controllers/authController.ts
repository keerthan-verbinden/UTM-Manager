import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/db.js';
import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Check if user already exists
    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbService.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await dbService.findUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in. Please try again.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};
