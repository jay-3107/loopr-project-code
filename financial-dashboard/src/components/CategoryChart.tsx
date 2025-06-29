import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { calculateSpendingByCategory } from '../utils/sampleData';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  userId: string;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ userId }) => {
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    if (userId) {
      const categorySpending = calculateSpendingByCategory(userId);
      const categories = Object.keys(categorySpending);
      const amounts = Object.values(categorySpending);
      
      // Generate random colors for each category
      const backgroundColors = categories.map(() => 
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
      );
      
      setChartData({
        labels: categories,
        datasets: [
          {
            label: 'Spending by Category',
            data: amounts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [userId]);
  
  if (!chartData) return <div>Loading chart data...</div>;
  
  return <Doughnut data={chartData} />;
};

export default CategoryChart;