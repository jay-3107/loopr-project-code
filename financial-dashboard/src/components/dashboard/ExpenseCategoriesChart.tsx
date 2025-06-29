import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryData } from "@/types/dashboard";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
// import type { PieLabelRenderProps } from 'recharts';

interface ExpenseCategoriesChartProps {
  categoryData: CategoryData[];
  loading: boolean;
}

export function ExpenseCategoriesChart({ categoryData, loading }: ExpenseCategoriesChartProps) {
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Custom label with name and percentage
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (!percent) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for small slices

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as CategoryData;
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{data.category}</p>
          <p>{formatCurrency(data.amount)}</p>
          <p>{`${data.percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4">
      <h3 className="text-base font-medium mb-4">Expense Categories</h3>
      {loading ? (
        <div className="w-full aspect-[16/9] bg-muted/20 rounded-md flex items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="w-full aspect-[16/9]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="amount"
                isAnimationActive={true}
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}