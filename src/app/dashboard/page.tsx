'use client';

import { DollarSign, CreditCard, PiggyBank, Smile, Frown } from 'lucide-react';
import SummaryCard from '@/components/dashboard/summary-card';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SpendingAdvice from '@/components/dashboard/spending-advice';
import ParentAlert from '@/components/dashboard/parent-alert';
import FinancialForecast from '@/components/dashboard/financial-forecast';
import FinancialHealthCheck from '@/components/dashboard/financial-health-check';

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
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Dashboard ✨</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial tea.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data) => (
          <SummaryCard key={data.title} {...data} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="flex flex-col gap-8">
          <FinancialHealthCheck />
          <SpendingAdvice />
          <FinancialForecast />
          <ParentAlert />
        </div>
      </div>
    </div>
  );
}
