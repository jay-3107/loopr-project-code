import mongoose, { Document, Schema } from 'mongoose';
import { TransactionData } from '../types/transaction.types';

// Extend Document but omit the _id conflict from TransactionData
export interface ITransaction extends Omit<TransactionData, '_id'>, Document {}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { 
      type: String, 
      required: true,
      ref: 'User'
    },
    date: { 
      type: Date, 
      required: true,
      default: Date.now 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['income', 'expense'], 
      required: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ['completed', 'pending', 'cancelled'], 
      default: 'completed' 
    }
  }, 
  { 
    timestamps: true 
  }
);

// Create indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;