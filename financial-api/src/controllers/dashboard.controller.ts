// src/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
// Import the existing TokenPayload interface
import { TokenPayload } from '../utils/jwt.utils';

// Define chart data interface
interface MonthData {
  month: string;
  income: number;
  expense: number;
}

/**
 * Get dashboard summary statistics
 */
export const getSummary = async (req: Request, res: Response) => {
  try {
    // Use the user object from request
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = (req.user as TokenPayload).userId; // Use the userId property from your TokenPayload

    // Get total revenue
    const totalRevenue = await Transaction.aggregate([
      { $match: { userId: userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total expenses
    const totalExpenses = await Transaction.aggregate([
      { $match: { userId: userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total transactions
    const totalTransactions = await Transaction.countDocuments({ userId });

    // Get pending transactions
    const pendingTransactions = await Transaction.countDocuments({ 
      userId, 
      status: 'pending' 
    });

    // Calculate net balance
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    const expenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const netBalance = revenue - expenses;

    // Return dashboard summary
    res.json({
      totalRevenue: revenue,
      totalExpenses: expenses,
      netBalance,
      totalTransactions,
      pendingTransactions
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
};

/**
 * Get revenue vs expense chart data
 */
export const getRevenueExpenseChart = async (req: Request, res: Response) => {
  try {
    // Use the user object from request
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = (req.user as TokenPayload).userId;
    
    // Get revenue and expenses grouped by month
    const chartData = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: { 
            month: { $month: '$date' }, 
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format data for chart
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Process the data for easier charting
    const formattedData: MonthData[] = [];
    const processedMonths = new Set<string>();
    
    chartData.forEach(item => {
      const monthIndex = item._id.month - 1;
      const year = item._id.year;
      const monthYear = `${months[monthIndex]} ${year}`;
      const type = item._id.type;
      
      // Check if we already have an entry for this month
      let monthData = formattedData.find(d => d.month === monthYear);
      
      if (!monthData) {
        // Create a new month entry
        monthData = {
          month: monthYear,
          income: 0,
          expense: 0
        };
        formattedData.push(monthData);
      }
      
      // Update the appropriate type value
      if (type === 'income') {
        monthData.income = item.total;
      } else if (type === 'expense') {
        monthData.expense = item.total;
      }
      
      processedMonths.add(monthYear);
    });

    // Sort by month and year
    formattedData.sort((a: MonthData, b: MonthData) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching revenue expense chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

/**
 * Get category breakdown data for charts
 * Returns transaction amounts grouped by category
 */
export const getCategoryBreakdown = async (req: Request, res: Response) => {
  try {
    // Check user authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = (req.user as TokenPayload).userId;
    
    // Get optional type filter from query params (income/expense)
    const { type } = req.query;
    const typeFilter = type ? { type: type as string } : {};
    
    // Get optional date range from query params
    const { startDate, endDate } = req.query;
    
    // Create properly typed date filter
    let dateFilter: { date?: { $gte?: Date, $lte?: Date } } = {};
    
    if (startDate || endDate) {
      dateFilter.date = {};
      
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate as string);
      }
      
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate as string);
      }
    }
    
    // Aggregate transactions by category
    const categoryData = await Transaction.aggregate([
      { 
        $match: { 
          userId: userId,
          ...typeFilter,
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          amount: '$total',
          _id: 0
        }
      },
      { $sort: { amount: -1 } }
    ]);
    
    // If no data was found, return an empty array
    if (!categoryData.length) {
      return res.json([]);
    }
    
    // Calculate total for percentage calculations
    const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);
    
    // Add percentage to each category
    const enhancedData = categoryData.map(item => ({
      ...item,
      percentage: parseFloat(((item.amount / totalAmount) * 100).toFixed(2))
    }));
    
    res.json(enhancedData);
  } catch (error) {
    console.error('Error fetching category breakdown data:', error);
    res.status(500).json({ message: 'Error fetching category breakdown data' });
  }
};