import mongoose from 'mongoose';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
config();

// Define types
interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

interface TransactionDocument extends mongoose.Document {
  originalId?: number;
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile?: string;
  createdAt: Date;
}

interface TransactionData {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

// Define User schema
const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Define Transaction schema
const transactionSchema = new mongoose.Schema<TransactionDocument>({
  originalId: { type: Number }, // To keep track of the original ID from JSON
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  user_id: { type: String, required: true }, // We'll keep the original user_id
  user_profile: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model<UserDocument>('User', userSchema);
const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);

// Function to read transaction data from file
async function readTransactionData(): Promise<TransactionData[]> {
  try {
    const filePath = path.join(__dirname, '../data/transaction.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transaction data file:', error);
    return [];
  }
}

// Function to seed the database
async function seedDatabase(): Promise<void> {
  try {
    // Connect to MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Existing data cleared');

    // Create default users based on the unique user_ids in transactions
    const transactionData = await readTransactionData();
    
    // Extract unique user_ids from transaction data
    const uniqueUserIds = [...new Set(transactionData.map((t: TransactionData) => t.user_id))];
    
    // Create users
    console.log('Creating users...');
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash('password123', saltRounds);
    
    const userPromises = uniqueUserIds.map((userId: string) => {
      return User.create({
        username: userId,
        email: `${userId}@example.com`,
        password: defaultPassword,
        role: userId === 'user_001' ? 'admin' : 'user'
      });
    });
    
    await Promise.all(userPromises);
    console.log(`Created ${uniqueUserIds.length} users`);

    // Insert transactions
    console.log('Inserting transactions...');
    const transactions = transactionData.map((transaction: TransactionData) => ({
      originalId: transaction.id,
      date: new Date(transaction.date),
      amount: transaction.amount,
      category: transaction.category,
      status: transaction.status,
      user_id: transaction.user_id,
      user_profile: transaction.user_profile
    }));

    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Execute the seeding function
seedDatabase();