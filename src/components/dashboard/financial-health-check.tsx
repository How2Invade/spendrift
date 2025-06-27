'use client';

import { useState } from 'react';
import { financialHealthAdvisor, type FinancialHealthAdvisorOutput } from '@/ai/flows/financial-health-advisor';
import { useData } from '@/context/data-context';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HeartPulse, AlertTriangle, Goal, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

export default function FinancialHealthCheck() {
  const { toast } = useToast();
  const { transactions, goals } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinancialHealthAdvisorOutput | null>(null);

  async function getHealthCheck() {
    if (transactions.length < 5) {
      toast({
        variant: 'default',
        title: 'Need more data, fam!',
        description: 'Add at least 5 transactions for a proper health check.',
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const transactionHistory = transactions.map(t => `${t.category},${t.amount},${t.date},${t.type}`).join('\n');
      const userGoals = goals.map(g => g.title).join(', ');
      // Assuming a mock income for now. In a real app, this would be user-provided.
      const userIncome = 75000;
      
      const output = await financialHealthAdvisor({ transactionHistory, userGoals, userIncome });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI is ghosting us.',
        description: 'The health check failed. Maybe try again in a bit?',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Financial Health Check 🩺</CardTitle>
        <CardDescription>Get a quick AI-powered vibe check on your finances.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[300px]">
        {result ? (
          <div className="space-y-4 text-sm">
             <div className="text-center p-4 bg-muted rounded-lg">
                <p className="font-bold text-lg">{result.overallStatus}</p>
            </div>

            {result.riskWarnings && result.riskWarnings.length > 0 && (
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-destructive" />Risk Radar</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-destructive">
                  {result.riskWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.subscriptionSuggestions && result.subscriptionSuggestions.length > 0 && (
                 <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2"><BellRing className="h-4 w-4 text-primary" />Subscription Scan</h4>
                    <div className="space-y-2">
                    {result.subscriptionSuggestions.map((sub, index) => (
                        <div key={index} className="p-2 bg-muted/50 rounded-md">
                            <p className="font-semibold">{sub.name}</p>
                            <p className="text-muted-foreground">{sub.suggestion}</p>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {result.goalAnalysis && (
                <div>
                    <h4 className="font-bold flex items-center gap-2 mb-2"><Goal className="h-4 w-4 text-primary" />Goal Getter Check</h4>
                    <p className="text-muted-foreground">{result.goalAnalysis}</p>
                </div>
            )}

            {result.spendingFeedback && (
                <div>
                    <h4 className="font-bold mb-2">Pro Tip 💡</h4>
                    <p className="text-muted-foreground">{result.spendingFeedback}</p>
                </div>
            )}

            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Run Check Again
            </Button>
          </div>
        ) : (
          <Button onClick={getHealthCheck} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HeartPulse className="mr-2 h-4 w-4" />}
            Get My Financial Vibe Check
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
