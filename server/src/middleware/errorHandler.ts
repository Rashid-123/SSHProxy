import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(
    {
      error: err,
      path: req.path,
      method: req.method,
      stack: err.stack,
    },
    'Unhandled error'
  );

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
}