import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional middleware for role-based access
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    
    next();
  };
};