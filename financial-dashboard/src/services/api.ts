import axios from 'axios';
import type { SummaryData, ChartDataPoint, CategoryData, Transaction, FilterOptions } from '@/types/dashboard';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to add the token to all requests
api.interceptors.request.use(
  config => {
    // Skip auth for login/register endpoints
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      // Log the full token for debugging (in development only)
      console.log('Using token:', token);
      
      // Make sure the format is correct - "Bearer <token>"
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Log the full authorization header
      console.log('Authorization header:', config.headers['Authorization']);
    } else {
      console.warn('No token found for request:', config.url);
    }
    return config;
  },
  error => Promise.reject(error)
);
// Add response interceptor for global error handling
api.interceptors.response.use(
  response => {
    console.log(`Request succeeded: ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`Request failed with status ${error.response.status}: ${error.config?.url}`);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        console.log('Authentication error detected');
        
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          console.log('Clearing auth data due to 401 error');
          // Uncomment these if you want automatic redirection on 401
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // window.location.href = '/login';
        }
      }
    } else {
      console.error('Request failed without response:', error.message);
    }
    
    return Promise.reject(error);
  }
);


// API functions
export const getDashboardSummary = async (): Promise<SummaryData> => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getRevenueExpenseChart = async (): Promise<ChartDataPoint[]> => {
  const response = await api.get('/dashboard/charts/revenue-expense');
  return response.data;
};

export const getCategoryBreakdown = async (type: string = 'expense'): Promise<CategoryData[]> => {
  const response = await api.get(`/dashboard/charts/category-breakdown?type=${type}`);
  return response.data;
};

export const getTransactions = async (
  page: number = 1, 
  limit: number = 10, 
  searchTerm: string = '',
  filters?: FilterOptions
): Promise<{ data: Transaction[], pagination: any }> => {
  const params = new URLSearchParams();
  
  if (searchTerm) {
    params.append('search', searchTerm);
  }
  
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.append(key, value);
      }
    }
  }
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await api.get(`/transactions?${params.toString()}`);
  return response.data;
};

export const exportTransactions = async (fields: string[], filters?: FilterOptions): Promise<Blob> => {
  const response = await api.post('/export/csv', {
    fields,
    filters
  }, {
    responseType: 'blob'
  });
  
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

export default api;