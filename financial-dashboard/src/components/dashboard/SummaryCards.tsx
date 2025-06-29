import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummaryData } from "../../types/dashboard";

interface SummaryCardsProps {
  summaryData: SummaryData;
  loading: boolean;
}

export function SummaryCards({ summaryData, loading }: SummaryCardsProps) {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="p-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
            <p className="text-2xl font-bold">{formatCurrency(summaryData.netBalance)}</p>
            <span className="text-xs text-green-500">Current Balance</span>
          </>
        )}
      </Card>
      <Card className="p-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <p className="text-2xl font-bold">{formatCurrency(summaryData.totalRevenue)}</p>
            <span className="text-xs text-green-500">All Time Income</span>
          </>
        )}
      </Card>
      <Card className="p-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <p className="text-2xl font-bold">{formatCurrency(summaryData.totalExpenses)}</p>
            <span className="text-xs text-red-500">All Time Expenses</span>
          </>
        )}
      </Card>
      <Card className="p-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </>
        ) : (
          <>
            <h3 className="text-sm font-medium text-muted-foreground">Pending Transactions</h3>
            <p className="text-2xl font-bold">{summaryData.pendingTransactions}</p>
            <span className="text-xs text-muted-foreground">Awaiting Processing</span>
          </>
        )}
      </Card>
    </div>
  );
}