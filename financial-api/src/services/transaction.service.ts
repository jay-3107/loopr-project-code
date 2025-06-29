import Transaction, { ITransaction } from '../models/transaction.model';
import { 
  TransactionData, 
  TransactionFilter, 
  PaginationOptions, 
  PaginatedResponse 
} from '../types/transaction.types';
import mongoose from 'mongoose';

// Create a new transaction
export const createTransaction = async (data: TransactionData): Promise<ITransaction> => {
  const transaction = new Transaction(data);
  return await transaction.save();
};

// Get transaction by ID
export const getTransactionById = async (id: string, userId: string): Promise<ITransaction | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid transaction ID');
  }

  return await Transaction.findOne({ _id: id, userId });
};

// Update transaction
export const updateTransaction = async (
  id: string, 
  userId: string, 
  data: Partial<TransactionData>
): Promise<ITransaction | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid transaction ID');
  }

  // Prevent updating userId
  const updateData = { ...data };
  delete updateData.userId;

  return await Transaction.findOneAndUpdate(
    { _id: id, userId }, 
    updateData, 
    { new: true, runValidators: true }
  );
};

// Delete transaction
export const deleteTransaction = async (id: string, userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid transaction ID');
  }

  const result = await Transaction.deleteOne({ _id: id, userId });
  return result.deletedCount > 0;
};

// Get transactions with filtering, sorting, and pagination
export const getTransactions = async (
  filter: TransactionFilter,
  options: PaginationOptions
): Promise<PaginatedResponse<ITransaction>> => {
  // Build filter query
  const query: any = {};
  
  // User ID filter (required for security)
  if (filter.userId) {
    query.userId = filter.userId;
  }
  
  // Date range filter
  if (filter.startDate) {
    query.date = { $gte: new Date(filter.startDate) };
  }
  
  if (filter.endDate) {
    if (!query.date) query.date = {};
    query.date.$lte = new Date(filter.endDate);
  }
  
  // Amount range filter
  if (filter.minAmount !== undefined) {
    query.amount = { $gte: filter.minAmount };
  }
  
  if (filter.maxAmount !== undefined) {
    if (!query.amount) query.amount = {};
    query.amount.$lte = filter.maxAmount;
  }
  
  // Type filter (income/expense)
  if (filter.type) {
    query.type = filter.type;
  }
  
  // Category filter
  if (filter.category) {
    query.category = filter.category;
  }
  
  // Status filter
  if (filter.status) {
    query.status = filter.status;
  }
  
  // Search filter (search in description and category)
  if (filter.search) {
    const searchRegex = new RegExp(filter.search, 'i');
    query.$or = [
      { description: searchRegex },
      { category: searchRegex }
    ];
  }
  
  // Calculate pagination
  const page = Math.max(1, options.page);
  const limit = Math.max(1, Math.min(100, options.limit));  // Limit between 1 and 100
  const skip = (page - 1) * limit;
  
  // Prepare sort options
  const sortField = options.sortField || 'date';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
  const sort: any = {};
  sort[sortField] = sortOrder;
  
  // Execute query with pagination
  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query)
  ]);
  
  // Calculate total pages
  const pages = Math.ceil(total / limit);
  
  // Return paginated result
  return {
    data: transactions,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  };
};

// Get available categories
export const getCategories = async (userId: string): Promise<string[]> => {
  const categories = await Transaction.distinct('category', { userId });
  return categories;
};