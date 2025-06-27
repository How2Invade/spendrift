'use client';

import { useState } from 'react';
import { analyzeSpendingPatterns, type SpendingAdviceOutput } from '@/ai/flows/analyze-spending-patterns';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdvancedAnalytics() {
  const { toast } = useToast();
  const { transactions } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpendingAdviceOutput | null>(null);

  async function getAnalysis() {
    if (transactions.length < 5) {
        toast({
            variant: 'default',
            title: 'Need more data!',
            description: 'Add at least 5 transactions to get a meaningful analysis.',
        });
        return;
    }
    setLoading(true);
    setResult(null);
    try {
      const spendingData = transactions.map(t => `${t.category},${t.amount},${t.date},${t.emotionalState || 'not-set'}`).join('\n');
      const personalData = "Age: 22, Income: ₹75000/month, Goal: Save for a trip to Goa.";

      const output = await analyzeSpendingPatterns({ spendingData, personalData });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Bummer! AI is on a break.',
        description: 'Failed to get your analysis. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            Advanced AI Analysis 🔮
        </CardTitle>
        <CardDescription>
            Let our AI analyze your spending for patterns, overspending, and subscription overload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result ? (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-bold">Spending Patterns & Overspending:</h4>
              <p className="text-muted-foreground">{result.analysisSummary}</p>
            </div>
            <div>
              <h4 className="font-bold">Recommendations:</h4>
              <p className="text-muted-foreground">{result.advice}</p>
            </div>
            {result.emotionalStateTags && result.emotionalStateTags.length > 0 && (
              <div>
                <h4 className="font-bold">Emotional Spending Tags:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.emotionalStateTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
            )}
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Analyze Again
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={getAnalysis} disabled={loading} size="lg">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get AI Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
