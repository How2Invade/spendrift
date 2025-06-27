'use client';

import { useState } from 'react';
import { analyzeSpendingPatterns, type SpendingAdviceOutput } from '@/ai/flows/analyze-spending-patterns';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SpendingAdvice() {
  const { toast } = useToast();
  const { transactions } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpendingAdviceOutput | null>(null);

  async function getAdvice() {
    if (transactions.length === 0) {
        toast({
            variant: 'default',
            title: 'Not enough data yet!',
            description: 'Add some transactions first to get personalized advice.',
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
        title: 'Oof! AI is sleeping.',
        description: 'Failed to get your advice. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>AI Savings Coach 🧠</CardTitle>
        <CardDescription>Get AI-powered tips to boost your savings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[300px]">
        {result ? (
          <div className="space-y-4 text-sm">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-bold text-lg">{result.analysisSummary}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">The Glow Up Plan ✨</h4>
              <p className="text-muted-foreground">{result.advice}</p>
            </div>
            {result.emotionalStateTags && result.emotionalStateTags.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Your Spending Moods</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.emotionalStateTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
            )}
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Start Over
            </Button>
          </div>
        ) : (
          <Button onClick={getAdvice} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get My Advice
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
