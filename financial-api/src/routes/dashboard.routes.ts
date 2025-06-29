// src/routes/dashboard.routes.ts
import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all dashboard routes
router.use(authenticate);

// Dashboard summary endpoint
router.get('/summary', dashboardController.getSummary);

// Revenue vs Expense chart data
router.get('/charts/revenue-expense', dashboardController.getRevenueExpenseChart);

export default router;