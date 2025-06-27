'use client';

import { DollarSign, CreditCard, PiggyBank, Smile, HeartPulse, Sparkles, Zap, PlusCircle } from 'lucide-react';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SpendingAdvice from '@/components/dashboard/spending-advice';
import ParentAlert from '@/components/dashboard/parent-alert';
import FinancialForecast from '@/components/dashboard/financial-forecast';
import FinancialHealthCheck from '@/components/dashboard/financial-health-check';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const summaryData = [
    {
      title: 'Earned',
      value: '₹50,000.00',
      icon: DollarSign,
      change: '+10.2% this month',
    },
    {
      title: 'Spent',
      value: '₹22,500.50',
      icon: CreditCard,
      change: '-5.1% this month',
    },
    {
      title: 'Saved',
      value: '₹27,499.50',
      icon: PiggyBank,
      change: '+20.5% this month',
    },
    {
      title: 'Mood',
      value: 'Vibing',
      icon: Smile,
      change: 'Based on spending',
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 min-h-screen bg-background">
      {/* Header */}
      <header className="relative">
        <div className="mb-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Financial Dashboard
          </span>
        </div>
        <h1 className="text-4xl font-bold font-retro text-primary mb-2">
          DASHBOARD ⚡
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your financial status report.
        </p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data, index) => (
          <div
            key={data.title}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                <data.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-wide">
                {data.title}
              </p>
              <p className="text-2xl font-bold font-retro text-foreground">
                {data.value}
              </p>
              <p className="text-xs text-primary">
                {data.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <RecentTransactions
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/add-expense">
                  <PlusCircle className="mr-2" />
                  Add Expense
                </Link>
              </Button>
            }
          />
        </div>
        <div className="space-y-8">
          <Tabs defaultValue="health-check" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="health-check"><HeartPulse className="h-4 w-4 mr-2"/>Health</TabsTrigger>
              <TabsTrigger value="advice"><Sparkles className="h-4 w-4 mr-2"/>Advice</TabsTrigger>
              <TabsTrigger value="forecast"><Zap className="h-4 w-4 mr-2"/>Forecast</TabsTrigger>
            </TabsList>
            <TabsContent value="health-check" className="mt-4">
              <FinancialHealthCheck />
            </TabsContent>
            <TabsContent value="advice" className="mt-4">
              <SpendingAdvice />
            </TabsContent>
            <TabsContent value="forecast" className="mt-4">
              <FinancialForecast />
            </TabsContent>
          </Tabs>
          <ParentAlert />
        </div>
      </div>
    </div>
  );
}
