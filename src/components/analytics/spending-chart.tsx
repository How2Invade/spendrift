'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { useData } from '@/context/data-context';

const chartConfig = {
  spending: {
    label: 'Spending',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function SpendingChart() {
  const { transactions } = useData();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    const dailySpending = last7Days.map(date => {
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const isoDate = date.toISOString().split('T')[0];
        
        const spending = transactions
            .filter(t => t.date === isoDate && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { day, spending };
    });

    return dailySpending;
  }, [transactions]);

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Weekly Spending 🗓️</CardTitle>
        <CardDescription>Your spending activity for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `₹${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="spending" fill="var(--color-spending)" radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
            <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
                Add transactions to see your weekly spending.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
