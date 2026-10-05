import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes.ts';
import linkRoutes from './routes/linkRoutes.ts';

export function createExpressApp(): express.Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/links', linkRoutes);

  // Centralized Error Handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}

export default createExpressApp;
