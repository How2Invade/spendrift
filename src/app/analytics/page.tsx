import CategoryDonutChart from '@/components/analytics/category-donut-chart';
import SpendingChart from '@/components/analytics/spending-chart';

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Analytics 📈</h1>
        <p className="text-muted-foreground">Get the lowdown on your cash flow. It's giving... data.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SpendingChart />
        <CategoryDonutChart />
      </div>

       <div className="mt-8">
         <h2 className="text-2xl font-bold font-headline mb-4">More Insights Coming Soon... 🔮</h2>
         <p className="text-muted-foreground">We're cooking up more fire analytics to help you level up your finance game. Stay tuned!</p>
       </div>
    </div>
  );
}
