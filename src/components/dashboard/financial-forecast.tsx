'use client';

import { useState } from 'react';
import { forecastFinancials, type ForecastFinancialsOutput } from '@/ai/flows/forecast-financials';
import { useData } from '@/context/data-context';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FinancialForecast() {
  const { toast } = useToast();
  const { transactions } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastFinancialsOutput | null>(null);

  async function getForecast() {
    if (transactions.length < 3) {
      toast({
        variant: 'default',
        title: 'Need more data!',
        description: 'Add at least 3 transactions for an accurate forecast.',
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const transactionHistory = transactions.map(t => `${t.category},${t.amount},${t.date},${t.type}`).join('\n');
      
      const output = await forecastFinancials({ transactionHistory });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating forecast.',
        description: 'The AI crystal ball is a bit foggy. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Financial Forecast 🔮</CardTitle>
        <CardDescription>Look into your financial future. No cap.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[300px]">
        {result ? (
          <div className="space-y-4 text-sm">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-bold text-lg">{result.cashFlowForecast}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Risk Assessment 🚨</h4>
              <p className="text-muted-foreground">{result.riskAssessment}</p>
            </div>
            {result.earlyWarnings && result.earlyWarnings.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Early Warnings ⚠️</h4>
                <ul className="mt-2 space-y-2">
                  {result.earlyWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Start Over
            </Button>
          </div>
        ) : (
          <Button onClick={getForecast} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            Get Financial Forecast
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
