import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import { validateRequest } from '../middlewares/error.middleware';
import { body, validationResult } from 'express-validator';

// Validation rules
export const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Controller methods
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };
    
    const result = await registerUser(userData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const credentials = {
      username: req.body.username,
      password: req.body.password
    };
    
    const result = await loginUser(credentials);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const user = await getUserById(req.user.userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};