// Define transaction interface
export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  description: string;
  userId?: string;
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: 1,
    date: "2024-01-05T08:34:12Z",
    amount: 3500.00,
    category: "Salary",
    type: "income",
    status: "completed",
    description: "Monthly salary"
  },
  {
    id: 2,
    date: "2024-01-08T11:14:38Z",
    amount: 200.50,
    category: "Groceries",
    type: "expense",
    status: "completed",
    description: "Weekly grocery shopping"
  },
  {
    id: 3,
    date: "2024-01-10T18:22:04Z",
    amount: 45.75,
    category: "Dining",
    type: "expense",
    status: "completed",
    description: "Dinner with friends"
  },
  {
    id: 4,
    date: "2024-01-15T14:05:32Z",
    amount: 500.00,
    category: "Rent",
    type: "expense",
    status: "completed",
    description: "Monthly rent payment"
  },
  {
    id: 5,
    date: "2024-01-20T09:45:18Z",
    amount: 120.25,
    category: "Utilities",
    type: "expense",
    status: "completed",
    description: "Electricity bill"
  },
  {
    id: 6,
    date: "2024-01-25T13:30:00Z",
    amount: 800.00,
    category: "Freelance",
    type: "income",
    status: "completed",
    description: "Web development project"
  },
  {
    id: 7,
    date: "2024-01-27T17:10:45Z",
    amount: 65.00,
    category: "Transport",
    type: "expense",
    status: "completed",
    description: "Fuel refill"
  },
  {
    id: 8,
    date: "2024-02-01T08:30:22Z",
    amount: 3500.00,
    category: "Salary",
    type: "income",
    status: "completed",
    description: "Monthly salary"
  },
  {
    id: 9,
    date: "2024-02-05T12:15:30Z",
    amount: 300.00,
    category: "Shopping",
    type: "expense",
    status: "completed",
    description: "New clothes"
  },
  {
    id: 10,
    date: "2024-02-10T19:20:10Z",
    amount: 50.00,
    category: "Entertainment",
    type: "expense",
    status: "completed",
    description: "Movie tickets"
  },
  {
    id: 11,
    date: "2024-02-15T10:05:40Z",
    amount: 150.00,
    category: "Internet",
    type: "expense",
    status: "completed",
    description: "Monthly subscription"
  },
  {
    id: 12,
    date: "2024-02-20T16:30:25Z",
    amount: 200.00,
    category: "Bonus",
    type: "income",
    status: "completed",
    description: "Performance bonus"
  },
  {
    id: 13,
    date: "2024-02-25T11:45:50Z",
    amount: 85.75,
    category: "Healthcare",
    type: "expense",
    status: "completed",
    description: "Pharmacy purchase"
  },
  {
    id: 14,
    date: "2024-03-01T08:30:00Z",
    amount: 3500.00,
    category: "Salary",
    type: "income",
    status: "completed",
    description: "Monthly salary"
  },
  {
    id: 15,
    date: "2024-03-05T14:20:15Z",
    amount: 250.30,
    category: "Groceries",
    type: "expense",
    status: "completed",
    description: "Monthly grocery shopping"
  },
  {
    id: 16,
    date: "2024-03-10T18:45:30Z",
    amount: 75.00,
    category: "Dining",
    type: "expense",
    status: "completed",
    description: "Restaurant dinner"
  },
  {
    id: 17,
    date: "2024-03-15T09:10:20Z",
    amount: 500.00,
    category: "Rent",
    type: "expense",
    status: "completed",
    description: "Monthly rent payment"
  },
  {
    id: 18,
    date: "2024-03-18T13:25:45Z",
    amount: 1000.00,
    category: "Contract",
    type: "income",
    status: "completed",
    description: "Contract work payment"
  },
  {
    id: 19,
    date: "2024-03-22T15:50:10Z",
    amount: 120.00,
    category: "Utilities",
    type: "expense",
    status: "completed",
    description: "Water and electricity"
  },
  {
    id: 20,
    date: "2024-03-25T11:00:30Z",
    amount: 60.50,
    category: "Transport",
    type: "expense",
    status: "completed",
    description: "Public transport pass"
  },
  {
    id: 21,
    date: "2024-04-01T08:30:00Z",
    amount: 3500.00,
    category: "Salary",
    type: "income",
    status: "completed",
    description: "Monthly salary"
  },
  {
    id: 22,
    date: "2024-04-05T10:15:20Z",
    amount: 220.75,
    category: "Groceries",
    type: "expense",
    status: "completed",
    description: "Grocery shopping"
  },
  {
    id: 23,
    date: "2024-04-10T17:40:55Z",
    amount: 35.00,
    category: "Entertainment",
    type: "expense",
    status: "completed",
    description: "Streaming service subscription"
  },
  {
    id: 24,
    date: "2024-04-15T13:20:30Z",
    amount: 500.00,
    category: "Rent",
    type: "expense",
    status: "completed",
    description: "Monthly rent payment"
  },
  {
    id: 25,
    date: "2024-04-20T09:45:15Z",
    amount: 130.00,
    category: "Utilities",
    type: "expense",
    status: "pending",
    description: "Electricity bill"
  },
  {
    id: 26,
    date: "2024-04-23T16:30:40Z",
    amount: 500.00,
    category: "Freelance",
    type: "income",
    status: "pending",
    description: "Logo design project"
  },
  {
    id: 27,
    date: "2024-04-27T12:10:25Z",
    amount: 90.25,
    category: "Shopping",
    type: "expense",
    status: "pending",
    description: "Online purchase"
  },
  {
    id: 28,
    date: "2024-05-01T08:30:00Z",
    amount: 3500.00,
    category: "Salary",
    type: "income",
    status: "pending",
    description: "Monthly salary"
  },
  {
    id: 29,
    date: "2024-05-05T11:50:35Z",
    amount: 200.00,
    category: "Groceries",
    type: "expense",
    status: "pending",
    description: "Monthly grocery shopping"
  },
  {
    id: 30,
    date: "2024-05-10T19:25:40Z",
    amount: 55.50,
    category: "Dining",
    type: "expense",
    status: "pending",
    description: "Dinner out"
  }
];

// Function to get sample transaction data with the current user ID added
export const getSampleTransactions = (userId: string): Transaction[] => {
  // Map through the sample transactions and add the userId to each
  return sampleTransactions.map(transaction => ({
    ...transaction,
    userId
  }));
};

// Function to get transactions for a specific month/year
export const getTransactionsByMonth = (userId: string, month: number, year: number): Transaction[] => {
  const transactions = getSampleTransactions(userId);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
  });
};

// Function to get transactions for a specific date range
export const getTransactionsByDateRange = (userId: string, startDate: Date, endDate: Date): Transaction[] => {
  const transactions = getSampleTransactions(userId);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Function to calculate total income for a user
export const calculateTotalIncome = (userId: string): number => {
  const transactions = getSampleTransactions(userId);
  
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Function to calculate total expenses for a user
export const calculateTotalExpenses = (userId: string): number => {
  const transactions = getSampleTransactions(userId);
  
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Get transactions by category
export const getTransactionsByCategory = (userId: string, category: string): Transaction[] => {
  const transactions = getSampleTransactions(userId);
  
  return transactions.filter(transaction => transaction.category === category);
};

// Calculate spending by category
export const calculateSpendingByCategory = (userId: string): Record<string, number> => {
  const transactions = getSampleTransactions(userId);
  const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');
  
  return expenseTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
};