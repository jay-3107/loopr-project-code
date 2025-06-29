// src/services/transaction.service.ts
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
  if (filter.startDate || filter.endDate) {
    query.date = {};
    if (filter.startDate) {
      query.date.$gte = new Date(filter.startDate);
    }
    if (filter.endDate) {
      query.date.$lte = new Date(filter.endDate);
    }
  }
  
  // Amount range filter
  if (filter.minAmount !== undefined || filter.maxAmount !== undefined) {
    query.amount = {};
    if (filter.minAmount !== undefined) {
      query.amount.$gte = filter.minAmount;
    }
    if (filter.maxAmount !== undefined) {
      query.amount.$lte = filter.maxAmount;
    }
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
  
  // Enhanced search functionality across multiple fields
  if (filter.search) {
    // Create array for $or conditions
    query.$or = [
      { description: { $regex: filter.search, $options: 'i' } },
      { category: { $regex: filter.search, $options: 'i' } },
      { notes: { $regex: filter.search, $options: 'i' } },
      { status: { $regex: filter.search, $options: 'i' } }
    ];
    
    // Also search for amounts if the search query is numeric
    if (!isNaN(Number(filter.search))) {
      query.$or.push({ amount: Number(filter.search) });
    }
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
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  // Return paginated result in the format your application expects
  return {
    data: transactions,
    pagination: {
      total,
      page,
      limit,
      pages: totalPages,
      hasNextPage,
      hasPrevPage
    }
  };
};

// Get available categories
export const getCategories = async (userId: string): Promise<string[]> => {
  const categories = await Transaction.distinct('category', { userId });
  return categories;
};