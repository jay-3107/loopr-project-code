export interface TransactionData {
  // Remove _id from here, it will be provided by Document
  userId: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

// Add a separate interface for use when returning transaction data
export interface TransactionResponse extends TransactionData {
  _id: string; // Include _id here for response objects
}

export interface TransactionFilter {
  userId: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: 'income' | 'expense';
  category?: string;
  status?: 'completed' | 'pending' | 'cancelled';
  search?: string; // Add this line for search functionality
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
  total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}