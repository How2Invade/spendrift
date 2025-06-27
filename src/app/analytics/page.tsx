import CategoryDonutChart from '@/components/analytics/category-donut-chart';
import SpendingChart from '@/components/analytics/spending-chart';

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 retro-grid min-h-screen">
      <header className="relative">
        <div className="terminal-text mb-4">
          <span className="matrix-text">DATA_ANALYTICS_MODULE</span>
        </div>
        <h1 className="text-4xl font-bold font-retro text-primary glow-text mb-2">
          ANALYTICS �
        </h1>
        <p className="text-muted-foreground font-mono">
          {'>'} Analyzing your financial data patterns...
        </p>
        <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="retro-card p-6">
          <div className="terminal-text mb-4">
            <span className="matrix-text">SPENDING_TIMELINE</span>
          </div>
          <SpendingChart />
        </div>
        
        <div className="retro-card p-6">
          <div className="terminal-text mb-4">
            <span className="matrix-text">CATEGORY_BREAKDOWN</span>
          </div>
          <CategoryDonutChart />
        </div>
      </div>

      <div className="retro-card p-6 holographic">
        <div className="terminal-text mb-4">
          <span className="matrix-text">FUTURE_MODULES</span>
        </div>
        <h2 className="text-2xl font-bold font-retro text-primary mb-4">
          ADVANCED_ANALYTICS.EXE 🔮
        </h2>
        <p className="text-muted-foreground font-mono">
          {'>'} Advanced AI insights modules are currently in development...
          <br />
          {'>'} Expected deployment: Q3 2025
          <br />
          {'>'} Features: Predictive modeling, behavior analysis, risk assessment
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="font-mono text-xs text-secondary">DEVELOPMENT_IN_PROGRESS</span>
        </div>
      </div>
    </div>
  );
}
