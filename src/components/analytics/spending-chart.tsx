'use client';

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

const chartData = [
  { day: 'Mon', spending: 500 },
  { day: 'Tue', spending: 750 },
  { day: 'Wed', spending: 220 },
  { day: 'Thu', spending: 680 },
  { day: 'Fri', spending: 1200 },
  { day: 'Sat', spending: 900 },
  { day: 'Sun', spending: 450 },
];

const chartConfig = {
  spending: {
    label: 'Spending',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function SpendingChart() {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Weekly Spending 🗓️</CardTitle>
        <CardDescription>Your spending activity for the last week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
      </CardContent>
    </Card>
  );
}
