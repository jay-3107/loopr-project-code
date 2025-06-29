// services/sampleData.service.ts
import fs from 'fs';
import path from 'path';
import Transaction from '../models/transaction.model';
import User from '../models/user.model';

export const createSampleTransactionsForUser = async (userId: string): Promise<void> => {
  try {
    // Check if user already has transactions
    const existingTransactions = await Transaction.countDocuments({ userId });
    
    // If user already has transactions, don't create sample data
    if (existingTransactions > 0) {
      console.log(`User ${userId} already has ${existingTransactions} transactions. Skipping sample data creation.`);
      
      // Update user document even if we skip creating transactions
      await User.findByIdAndUpdate(userId, { sampleDataCreated: true });
      return;
    }
    
    // Read transaction data from JSON file
    const jsonPath = path.join(__dirname, '..', 'data', 'transaction.json');
    console.log(`Looking for sample data at: ${jsonPath}`);
    
    // Check if file exists before reading
    if (!fs.existsSync(jsonPath)) {
      console.error(`Sample data file not found at: ${jsonPath}`);
      throw new Error('Sample data file not found');
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const transactionData = JSON.parse(rawData);
    
    console.log(`Creating ${transactionData.length} sample transactions for user ${userId}`);
    
    // Transform the data to match our schema, handling your specific JSON structure
    const transactions = transactionData.map((item: any) => ({
      userId: userId, // Use the passed userId instead of item.user_id
      date: new Date(item.date),
      amount: parseFloat(item.amount.toString()),
      type: item.category === 'Revenue' ? 'income' : 'expense',
      category: item.category === 'Revenue' ? 'Income' : item.category,
      status: item.status === 'Paid' ? 'completed' : 
              item.status === 'Pending' ? 'pending' : 'cancelled',
      description: `${item.category} transaction`
      // user_profile is ignored as it's not in our schema
    }));
    
    // Insert transactions
    await Transaction.insertMany(transactions);
    
    // Update user document after successfully creating transactions
    await User.findByIdAndUpdate(userId, { sampleDataCreated: true });
    
    console.log(`Successfully created ${transactions.length} sample transactions for user ${userId}`);
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};