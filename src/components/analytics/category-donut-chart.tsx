'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

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

const chartData = [
  { category: 'Food & Drinks 🍔', amount: 450, fill: 'var(--color-food)' },
  { category: 'Shopping 🛍️', amount: 300, fill: 'var(--color-shopping)' },
  { category: 'Transport 🚗', amount: 200, fill: 'var(--color-transport)' },
  { category: 'Entertainment 🎬', amount: 278, fill: 'var(--color-entertainment)' },
  { category: 'Bills 🧾', amount: 189, fill: 'var(--color-bills)' },
];

const chartConfig = {
  amount: {
    label: 'Amount',
  },
  food: {
    label: 'Food & Drinks 🍔',
    color: 'hsl(var(--chart-1))',
  },
  shopping: {
    label: 'Shopping 🛍️',
    color: 'hsl(var(--chart-2))',
  },
  transport: {
    label: 'Transport 🚗',
    color: 'hsl(var(--chart-3))',
  },
  entertainment: {
    label: 'Entertainment 🎬',
    color: 'hsl(var(--chart-4))',
  },
  bills: {
    label: 'Bills 🧾',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function CategoryDonutChart() {
  return (
    <Card className="flex flex-col glassmorphism">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Where your money really goes...</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Food & Drinks is your top category this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total spending for the last 30 days.
        </div>
      </CardFooter>
    </Card>
  );
}
