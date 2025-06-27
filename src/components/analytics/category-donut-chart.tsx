'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';
import { useData } from '@/context/data-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  amount: {
    label: 'Amount (₹)',
  },
} satisfies ChartConfig;


export default function CategoryDonutChart() {
  const { transactions } = useData();

  const { chartData, topCategory } = useMemo(() => {
    if (transactions.length === 0) {
      return { chartData: [], topCategory: null };
    }

    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });
    
    const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

    const data = Object.entries(categorySpending)
      .map(([category, amount], index) => ({
        category,
        amount,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.amount - a.amount);
      
    const top = data.length > 0 ? data[0].category : null;

    return { chartData: data, topCategory: top };
  }, [transactions]);


  return (
    <Card className="flex flex-col glassmorphism">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Where your money really goes...</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
         {chartData.length > 0 ? (
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                </PieChart>
            </ChartContainer>
        ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No spending data available.
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {topCategory && (
            <div className="flex items-center gap-2 font-medium leading-none">
            {topCategory} is your top category this month <TrendingUp className="h-4 w-4" />
            </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing total spending for the last month.
        </div>
      </CardFooter>
    </Card>
  );
}
