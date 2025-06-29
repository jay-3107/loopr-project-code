import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartDataPoint } from "@/types/dashboard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

interface RevenueExpenseChartProps {
  chartData: ChartDataPoint[];
  loading: boolean;
}

export function RevenueExpenseChart({ chartData, loading }: RevenueExpenseChartProps) {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Custom tooltip formatter using 'any' type for props
  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-green-500">
            Revenue: {formatCurrency(Number(payload[0].value))}
          </p>
          <p className="text-red-500">
            Expenses: {formatCurrency(Number(payload[1].value))}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-medium mb-4">Revenue vs Expenses</h3>
      {loading ? (
        <div className="w-full aspect-[16/9] bg-muted/20 rounded-md flex items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="w-full aspect-[16/9]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Revenue" fill="#4ade80" />
              <Bar dataKey="expense" name="Expenses" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}