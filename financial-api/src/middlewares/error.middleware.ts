import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validateRequest = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
};

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error(err.stack);
  
  res.status(500).json({
    message: err.message || 'Internal server error'
  });
};

export const notFoundHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  res.status(404).json({ message: 'Resource not found' });
};