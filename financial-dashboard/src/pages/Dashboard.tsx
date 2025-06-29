import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
// Removed axios import as it's unused
import type { SummaryData, ChartDataPoint, CategoryData, Transaction, Pagination, FilterOptions, User } from '@/types/dashboard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RevenueExpenseChart } from '@/components/dashboard/RevenueExpenseChart';
import { ExpenseCategoriesChart } from '@/components/dashboard/ExpenseCategoriesChart';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { 
    getSampleTransactions, 
    calculateTotalIncome, 
    calculateTotalExpenses, 
    calculateSpendingByCategory
    // Removed getTransactionsByDateRange as it's unused
} from '@/utils/sampleData';

// Import icons
import {
    BarChart3,
    Home,
    Settings,
    CreditCard,
    FileText,
    LogOut,
    User as UserIcon,
    PieChart,
    Menu,
    X
} from "lucide-react";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // State management
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState<SummaryData>({
        totalRevenue: 0,
        totalExpenses: 0,
        netBalance: 0,
        totalTransactions: 0,
        pendingTransactions: 0
    });
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<FilterOptions>({
        startDate: '',
        endDate: '',
        category: '',
        status: '',
        type: ''
    });

    // Get current user from localStorage
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                setUser(JSON.parse(userString));
            } catch (e) {
                console.error('Error parsing user data from localStorage');
            }
        }
    }, []);

    // Get current path
    const pathname = window.location.pathname;

    // Load dashboard data using sample data
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return; // Stop here if no token
        }

        const loadSampleDashboardData = async () => {
            setLoading(true);
            try {
                // Get userId from user object, or use a default if not available
                const userId = user?._id || 'default-user-id';
                
                // Get sample transactions for the user
                const allTransactions = getSampleTransactions(userId);
                
                // Calculate summary data
                const totalRevenue = calculateTotalIncome(userId);
                const totalExpenses = calculateTotalExpenses(userId);
                const netBalance = totalRevenue - totalExpenses;
                const totalTransactions = allTransactions.length;
                const pendingTransactions = allTransactions.filter(t => t.status === 'pending').length;
                
                const summaryData = {
                    totalRevenue,
                    totalExpenses,
                    netBalance,
                    totalTransactions,
                    pendingTransactions
                };
                
                // Create chart data (last 6 months)
                const chartData = generateChartData(allTransactions);
                
                // Create category breakdown data
                const categorySpending = calculateSpendingByCategory(userId);
                const categoryData = Object.entries(categorySpending).map(([category, amount], index) => ({
                    id: index,
                    category,
                    amount,
                    percentage: (amount / totalExpenses) * 100
                }));
                
                // Paginate transactions
                const { paginatedTransactions, pagination } = paginateTransactions(
                    allTransactions, 
                    1, 
                    10, 
                    searchTerm, 
                    filters
                );
                
                // Update state with all the data
                setSummaryData(summaryData);
                setChartData(chartData);
                setCategoryData(categoryData);
                setTransactions(paginatedTransactions);
                setPagination(pagination);

            } catch (error) {
                console.error('Error loading sample dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSampleDashboardData();
    }, [navigate, user, searchTerm, filters]);

    // Generate chart data for the last 6 months
    // Generate chart data for the last 6 months
const generateChartData = (transactions: any[]): ChartDataPoint[] => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data: ChartDataPoint[] = [];
    
    // Create test data for all 6 months with significant values
    // This ensures the chart displays correctly while you're developing
    return [
      { month: "Jan 2025", income: 5000, expense: 3000 },
      { month: "Feb 2025", income: 5500, expense: 3200 },
      { month: "Mar 2025", income: 4800, expense: 3500 },
      { month: "Apr 2025", income: 6000, expense: 3800 },
      { month: "May 2025", income: 5200, expense: 3100 },
      { month: "Jun 2025", income: 5800, expense: 3400 }
    ];
};

    // Paginate and filter transactions
    const paginateTransactions = (
        allTransactions: any[],
        page: number,
        limit: number,
        searchTerm: string,
        filters: FilterOptions
    ) => {
        // Apply search filter
        let filtered = [...allTransactions];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(term) ||
                t.category.toLowerCase().includes(term)
            );
        }
        
        // Apply date range filter
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            filtered = filtered.filter(t => {
                const date = new Date(t.date);
                return date >= startDate && date <= endDate;
            });
        }
        
        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(t => 
                t.category.toLowerCase() === filters.category.toLowerCase()
            );
        }
        
        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(t => 
                t.status.toLowerCase() === filters.status.toLowerCase()
            );
        }
        
        // Apply type filter
        if (filters.type) {
            filtered = filtered.filter(t => 
                t.type.toLowerCase() === filters.type.toLowerCase()
            );
        }
        
        // Sort by date, newest first
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Calculate pagination
        const total = filtered.length;
        const pages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        // Get page of transactions
        const paginatedTransactions = filtered.slice(startIndex, endIndex);
        
        return {
            paginatedTransactions,
            pagination: {
                total,
                page,
                limit,
                pages
            }
        };
    };

    // Handle transactions search
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
    };

    // Handle filter change
    const handleFilter = async (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    // Handle page change for pagination
    const handlePageChange = async (newPage: number) => {
        const userId = user?._id || 'default-user-id';
        const allTransactions = getSampleTransactions(userId);
        
        const { paginatedTransactions, pagination } = paginateTransactions(
            allTransactions,
            newPage,
            10,
            searchTerm,
            filters
        );
        
        setTransactions(paginatedTransactions);
        setPagination(pagination);
    };

    // Handle export to CSV
    const handleExport = () => {
        const userId = user?._id || 'default-user-id';
        const filteredTransactions = getSampleTransactions(userId);
        
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Amount,Type,Category,Description,Status\n";
        
        filteredTransactions.forEach(t => {
            const formattedDate = new Date(t.date).toLocaleDateString();
            const row = [
                formattedDate,
                t.amount,
                t.type,
                t.category,
                `"${t.description}"`,
                t.status
            ];
            csvContent += row.join(",") + "\n";
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transactions-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Download file
        link.click();
        link.remove();
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r transition-all duration-300 ease-in-out flex flex-col`}>
                {/* Sidebar Header */}
                <div className="flex items-center h-16 px-4 border-b">
                    {sidebarOpen ? (
                        <>
                            <BarChart3 className="h-6 w-6 text-primary" />
                            <span className="ml-2 text-xl font-semibold">Financial</span>
                            <button onClick={() => setSidebarOpen(false)} className="ml-auto">
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setSidebarOpen(true)} className="mx-auto">
                            <Menu className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 py-4 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                        <Link to="/dashboard">
                            <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm ${pathname === '/dashboard' ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                                <Home className="h-4 w-4" />
                                {sidebarOpen && <span className="ml-3">Overview</span>}
                            </div>
                        </Link>
                        <Link to="/dashboard/transactions">
                            <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm ${pathname === '/dashboard/transactions' ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                                <CreditCard className="h-4 w-4" />
                                {sidebarOpen && <span className="ml-3">Transactions</span>}
                            </div>
                        </Link>
                        <Link to="/dashboard/analytics">
                            <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm ${pathname === '/dashboard/analytics' ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                                <PieChart className="h-4 w-4" />
                                {sidebarOpen && <span className="ml-3">Analytics</span>}
                            </div>
                        </Link>
                        <Link to="/dashboard/reports">
                            <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm ${pathname === '/dashboard/reports' ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                                <FileText className="h-4 w-4" />
                                {sidebarOpen && <span className="ml-3">Reports</span>}
                            </div>
                        </Link>
                        <Link to="/dashboard/settings">
                            <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm ${pathname === '/dashboard/settings' ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                                <Settings className="h-4 w-4" />
                                {sidebarOpen && <span className="ml-3">Settings</span>}
                            </div>
                        </Link>
                    </nav>
                </div>

                {/* User Info & Logout */}
                <div className="border-t p-4">
                    {sidebarOpen ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="ml-2">
                                    <p className="text-sm font-medium">{user?.username || 'User'}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <Button size="icon" variant="outline" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center border-b px-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">Financial Dashboard</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button variant="ghost" size="icon">
                            <UserIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Main Content Area with Scroll */}
                <main className="flex-1 overflow-auto p-6">
                    {/* Financial Summary Cards */}
                    <SummaryCards summaryData={summaryData} loading={loading} />

                    {/* Charts Section */}
                    <div className="grid gap-6 md:grid-cols-2 mb-6">
                        <RevenueExpenseChart chartData={chartData} loading={loading} />
                        <ExpenseCategoriesChart categoryData={categoryData} loading={loading} />
                    </div>

                    {/* Recent Transactions Table */}
                    <TransactionsTable
                        transactions={transactions}
                        pagination={pagination}
                        loading={loading}
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        onPageChange={handlePageChange}
                        onExport={handleExport}
                    />
                </main>
            </div>
        </div>
    );
}