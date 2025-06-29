import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import mongoose from 'mongoose';

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

export const loginUser = async (credentials: LoginInput): Promise<AuthResponse> => {
  // Find user by username
  const user = await User.findOne({ username: credentials.username });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check password
  const isPasswordValid = await user.comparePassword(credentials.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
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