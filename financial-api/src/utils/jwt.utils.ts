import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

// Define payload type
export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

// Generate JWT token
export const generateToken = (user: IUser): string => {
  const payload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role
  };

  // @ts-ignore - Ignore TypeScript errors for jwt.sign
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'fallback_secret', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    // @ts-ignore - Ignore TypeScript errors for jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (
      typeof decoded === 'object' && 
      decoded !== null &&
      'userId' in decoded && 
      'username' in decoded && 
      'role' in decoded
    ) {
      return {
        userId: String(decoded.userId),
        username: String(decoded.username),
        role: String(decoded.role)
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};