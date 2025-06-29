import express from 'express';
import { login, register, getCurrentUser, loginValidation, registerValidation } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;