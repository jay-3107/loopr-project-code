import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import * as authService from '../services/auth.service';
import { validateRequest } from '../middlewares/error.middleware';
import { body, validationResult } from 'express-validator';

// Updated validation rules for login - using email instead of username
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Registration validation remains the same but email is now more important
export const registerValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
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

// Updated login method to use email instead of username
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Login user (this will now also create sample data if needed)
    const result = await authService.loginUser(email, password);
    
    // Return token and user
    return res.status(200).json(result);
  } catch (error) {
    next(error);
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