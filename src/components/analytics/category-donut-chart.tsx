'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  amount: {
    label: 'Amount (₹)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


export default function CategoryDonutChart() {
  const { transactions } = useData();

  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return [];
    }

    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });
    
    const data = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((b, a) => a.amount - b.amount);

    return data;
  }, [transactions]);


  return (
    <Card className="flex flex-col glassmorphism h-full">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>A detailed look at your spending by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
         {chartData.length > 0 ? (
            <ChartContainer
                config={chartConfig}
                className="h-[250px] w-full"
            >
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                    left: 10,
                    }}
                >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                    dataKey="category"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 15)}
                    />
                    <XAxis dataKey="amount" type="number" hide />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                    dataKey="amount"
                    fill="var(--color-amount)"
                    radius={5}
                    />
                </BarChart>
            </ChartContainer>
        ) : (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No spending data available.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
