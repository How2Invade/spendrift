import CategoryDonutChart from '@/components/analytics/category-donut-chart';
import SpendingChart from '@/components/analytics/spending-chart';

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen bg-background">
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
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Spending Timeline
            </h3>
          </div>
          <SpendingChart />
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Category Breakdown
            </h3>
          </div>
          <CategoryDonutChart />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Future Modules
          </h3>
        </div>
        <h2 className="text-2xl font-bold font-retro text-primary mb-4">
          Advanced Analytics 🔮
        </h2>
        <p className="text-muted-foreground">
          Advanced AI insights modules are currently in development. Expected features include predictive modeling, behavior analysis, and risk assessment.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">Development in progress</span>
        </div>
      </div>
    </div>
  );
}
