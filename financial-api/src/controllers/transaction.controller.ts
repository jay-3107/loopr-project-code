import { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import * as TransactionService from '../services/transaction.service';
import { PaginationOptions, TransactionFilter } from '../types/transaction.types';

// Validation rules
export const createTransactionValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('status').optional().isIn(['completed', 'pending', 'cancelled']).withMessage('Invalid status')
];

export const updateTransactionValidation = [
  param('id').notEmpty().withMessage('Transaction ID is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('status').optional().isIn(['completed', 'pending', 'cancelled']).withMessage('Invalid status')
];

// Helper to validate request and return errors
const validateRequest = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    if (!validateRequest(req, res)) return;
    
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const transactionData = {
      ...req.body,
      userId: req.user.userId
    };
    
    const transaction = await TransactionService.createTransaction(transactionData);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a transaction by ID
export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const transaction = await TransactionService.getTransactionById(req.params.id, req.user.userId);
    
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    if (!validateRequest(req, res)) return;
    
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const transaction = await TransactionService.updateTransaction(
      req.params.id,
      req.user.userId,
      req.body
    );
    
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const deleted = await TransactionService.deleteTransaction(req.params.id, req.user.userId);
    
    if (!deleted) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions with filtering, sorting, and pagination
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Parse pagination options
    const paginationOptions: PaginationOptions = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortField: (req.query.sortField as string) || 'date',
      sortOrder: (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc'
    };
    
    // Build filter
    const filter: TransactionFilter = {
      userId: req.user.userId
    };
    
    // Apply filters from query parameters
    if (req.query.startDate) filter.startDate = req.query.startDate as string;
    if (req.query.endDate) filter.endDate = req.query.endDate as string;
    if (req.query.minAmount) filter.minAmount = parseFloat(req.query.minAmount as string);
    if (req.query.maxAmount) filter.maxAmount = parseFloat(req.query.maxAmount as string);
    if (req.query.type) filter.type = req.query.type as 'income' | 'expense';
    if (req.query.category) filter.category = req.query.category as string;
    if (req.query.status) filter.status = req.query.status as 'completed' | 'pending' | 'cancelled';
    if (req.query.search) filter.search = req.query.search as string;
    
    const result = await TransactionService.getTransactions(filter, paginationOptions);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get available categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const categories = await TransactionService.getCategories(req.user.userId);
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};