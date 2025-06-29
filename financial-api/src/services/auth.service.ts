import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  username: string;
  password: string;
}

export const registerUser = async (userData: RegisterInput): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email: userData.email }, { username: userData.username }]
  });
  
  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }
  
  // Create new user
  const user = new User(userData);
  await user.save();
  
  const token = generateToken(user);
  
  return {
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  };
};

export const loginUser = async ({ email, password }: { email: string, password: string }) => {
  // Find user by email instead of username
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' }
  );
  
  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  // Use type assertion to help TypeScript understand the return type
  const user = await User.findById(userId).select('-password').lean();
  
  // If no user is found, return null
  if (!user) {
    return null;
  }
  
  // Convert to IUser type
  return user as unknown as IUser;
};