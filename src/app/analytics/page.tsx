import CategoryDonutChart from '@/components/analytics/category-donut-chart';
import SpendingChart from '@/components/analytics/spending-chart';
import AdvancedAnalytics from '@/components/analytics/advanced-analytics';

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen">
      <header className="relative">
        <div className="mb-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Data Analytics
          </span>
        </div>
        <h1 className="text-4xl font-bold font-retro text-primary mb-2">
          ANALYTICS 📊
        </h1>
        <p className="text-muted-foreground">
          Analyzing your financial data patterns and trends.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SpendingChart />
        <CategoryDonutChart />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AdvancedAnalytics />
      </div>
    </div>
  );
}
