// src/controllers/export.controller.ts
import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
import { Parser } from 'json2csv';
import { TokenPayload } from '../utils/jwt.utils';

interface TransactionDocument {
  [key: string]: any;
  date?: Date;
}

/**
 * Export transactions as CSV
 */
export const exportCSV = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = (req.user as TokenPayload).userId;
    const { fields, filters } = req.body;

    // Validate required fields
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: 'Fields are required for CSV export' });
    }

    // Build query based on filters
    const query: any = { userId };

    if (filters) {
      // Date range filter
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) {
          query.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.date.$lte = new Date(filters.endDate);
        }
      }

      // Category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // Status filter
      if (filters.status) {
        query.status = filters.status;
      }

      // Type filter (income/expense)
      if (filters.type) {
        query.type = filters.type;
      }

      // Amount range filter
      if (filters.minAmount || filters.maxAmount) {
        query.amount = {};
        if (filters.minAmount) {
          query.amount.$gte = parseFloat(filters.minAmount);
        }
        if (filters.maxAmount) {
          query.amount.$lte = parseFloat(filters.maxAmount);
        }
      }
    }

    // Fetch transactions based on query
    const transactions = await Transaction.find(query).select(fields.join(' ')).lean();

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found matching the criteria' });
    }

    // Format transactions for CSV export
    const formattedTransactions = transactions.map((transaction: TransactionDocument) => {
      // Create a new object for CSV output
      const csvRow: Record<string, any> = {};
      
      // Copy only the requested fields
      fields.forEach(field => {
        // Format date field as string
        if (field === 'date' && transaction.date) {
          csvRow[field] = new Date(transaction.date).toISOString().split('T')[0];
        } else {
          csvRow[field] = transaction[field];
        }
      });
      
      return csvRow;
    });

    // Convert to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedTransactions);

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');

    // Send CSV response
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Error generating CSV export' });
  }
};