import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import { connectDatabase, disconnectDatabase } from '../config/database';

// Load environment variables
dotenv.config();

// Seed the database with users and transactions
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    console.log('Connected to database, starting seed process...');
    
    // Clear existing data
    await Transaction.deleteMany({});
    
    // Find or create a test user
    let user = await User.findOne({ username: 'testuser' });
    if (!user) {
      console.log('Creating test user...');
      user = new User({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();
    }
    
    // Read transaction data from JSON file
    console.log('Reading transaction data from JSON file...');
    const jsonPath = path.join(__dirname, '..', 'data', 'transaction.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const transactionData = JSON.parse(rawData);
    
    console.log(`Found ${transactionData.length} transactions in JSON file`);
    
    // Transform the data to match our schema
    const transactions = transactionData.map((item: any) => ({
      userId: user._id.toString(), // Assign to our test user
      date: new Date(item.date),
      amount: parseFloat(item.amount),
      // Map category to our schema's format
      type: item.category === 'Revenue' ? 'income' : 'expense',
      // Use the original category as is or map to one of our categories
      category: item.category === 'Revenue' ? 'Salary' : 
               item.category === 'Expense' ? 'Shopping' : item.category,
      // Map status to our schema's format
      status: item.status === 'Paid' ? 'completed' : 
              item.status === 'Pending' ? 'pending' : 'cancelled',
      description: `Imported transaction #${item.id}`
    }));
    
    // Insert transactions
    await Transaction.insertMany(transactions);
    
    console.log(`Seed completed: Created ${transactions.length} transactions`);
    
    // Disconnect from database
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  }
};

// Run the seed process
seedDatabase();