export interface User {
  _id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SummaryData {
  totalRevenue: number;
  totalExpenses: number;
  netBalance: number;
  totalTransactions: number;
  pendingTransactions: number;
}

export interface ChartDataPoint {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface FilterOptions {
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  type: string;
}