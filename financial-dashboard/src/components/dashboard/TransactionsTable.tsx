import { useState } from 'react';
import type { Transaction, Pagination, FilterOptions } from "../../types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination: Pagination;
  loading: boolean;
  onSearch: (term: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
}

export function TransactionsTable({ 
  transactions, 
  pagination, 
  loading,
  onSearch,
  onFilter,
  onPageChange,
  // Note: onExport is declared but not used internally in this component
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-base font-medium">Recent Transactions</h3>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-8 w-[200px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => onFilter({
            startDate: '',
            endDate: '',
            category: '',
            status: '',
            type: ''
          })}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'outline'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
}