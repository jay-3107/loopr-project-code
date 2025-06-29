import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as TransactionController from '../controllers/transaction.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Transaction routes
router.post('/', TransactionController.createTransactionValidation, TransactionController.createTransaction);
router.get('/', TransactionController.getTransactions);
router.get('/categories', TransactionController.getCategories);
router.get('/:id', TransactionController.getTransaction);
router.put('/:id', TransactionController.updateTransactionValidation, TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;