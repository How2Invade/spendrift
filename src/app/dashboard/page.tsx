'use client';

import { DollarSign, CreditCard, PiggyBank, Smile, Frown } from 'lucide-react';
import SummaryCard from '@/components/dashboard/summary-card';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SpendingAdvice from '@/components/dashboard/spending-advice';
import ParentAlert from '@/components/dashboard/parent-alert';
import FinancialForecast from '@/components/dashboard/financial-forecast';

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
    <div className="flex flex-col gap-8 p-4 md:p-8 retro-grid min-h-screen">
      {/* Header with retro styling */}
      <header className="relative">
        <div className="terminal-text mb-4">
          <span className="matrix-text">FINANCIAL_DASHBOARD_v2.0</span>
        </div>
        <h1 className="text-4xl font-bold font-retro text-primary glow-text mb-2">
          DASHBOARD ⚡
        </h1>
        <p className="text-muted-foreground font-mono">
          {'>'} Welcome back! Here&apos;s your financial status report.
        </p>
        
        {/* Decorative scan line */}
        <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </header>

      {/* Summary cards with cyberpunk styling */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((data, index) => (
          <div
            key={data.title}
            className="retro-card neon-border p-6 group hover:bg-primary/5 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg border border-primary/30 bg-primary/10">
                <data.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(3, '0')}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="font-mono text-sm text-muted-foreground tracking-wider">
                {data.title.toUpperCase()}
              </p>
              <p className="text-2xl font-bold font-retro text-primary glow-text">
                {data.value}
              </p>
              <p className="text-xs font-mono text-accent">
                {data.change}
              </p>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Main content grid with retro styling */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="retro-card p-6">
            <div className="terminal-text mb-4">
              <span className="matrix-text">RECENT_TRANSACTIONS</span>
            </div>
            <RecentTransactions />
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="retro-card p-6">
            <div className="terminal-text mb-4">
              <span className="matrix-text">AI_GUIDANCE</span>
            </div>
            <SpendingAdvice />
          </div>
          
          <div className="retro-card p-6">
            <div className="terminal-text mb-4">
              <span className="matrix-text">FORECAST</span>
            </div>
            <FinancialForecast />
          </div>
          
          <div className="retro-card p-6">
            <div className="terminal-text mb-4">
              <span className="matrix-text">ALERTS</span>
            </div>
            <ParentAlert />
          </div>
        </div>
      </div>
      
      {/* Footer status bar */}
      <div className="mt-8 border-t border-primary/20 pt-4">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>STATUS: ACTIVE</span>
            <span>•</span>
            <span>LAST_SYNC: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>CONNECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
