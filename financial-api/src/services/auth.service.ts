import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

import { createSampleTransactionsForUser } from './sampleData.service';
import { config } from '../config/env';

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
  
  // Generate token
  const token = generateToken(user);
  
  // Create sample transactions for the newly registered user
  try {
    console.log(`Creating sample data for new user: ${user._id}`);
    await createSampleTransactionsForUser(user._id.toString());
    // Update user to mark sample data as created
    await User.findByIdAndUpdate(user._id, { sampleDataCreated: true });
    console.log(`Sample data created successfully for user: ${user._id}`);
  } catch (error) {
    console.error('Error creating sample data during registration:', error);
    // We still want to proceed with registration even if sample data creation fails
  }
  
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

export const loginUser = async (email: string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT token with type assertion to fix TypeScript error
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    config.jwtSecret as Secret,
    { expiresIn: config.jwtExpiresIn } as SignOptions
  );
  
  // Create sample transactions if this is a new user or sample data wasn't created
  if (!user.sampleDataCreated) {
    try {
      console.log(`Creating sample data for existing user: ${user._id}`);
      await createSampleTransactionsForUser(user._id.toString());
      // Update user to mark sample data as created
      await User.findByIdAndUpdate(user._id, { sampleDataCreated: true });
      console.log(`Sample data created successfully for user: ${user._id}`);
    } catch (error) {
      console.error('Error creating sample data during login:', error);
      // We still want to proceed with login even if sample data creation fails
    }
  }
  
  // Return user data and token
  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
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