'use client';

import { useState } from 'react';
import { analyzeSpendingPatterns, type SpendingAdviceOutput } from '@/ai/flows/analyze-spending-patterns';
import { mockTransactions } from '@/lib/mock-data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SpendingAdvice() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpendingAdviceOutput | null>(null);

  async function getAdvice() {
    setLoading(true);
    setResult(null);
    try {
      // In a real app, this data would be dynamic
      const spendingData = mockTransactions.map(t => `${t.category},${t.amount},${t.date},${t.emotionalState}`).join('\n');
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
        <CardDescription>Get some AI-powered tips to boost your savings game.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold">The Tea 🍵:</h4>
              <p className="text-sm">{result.analysisSummary}</p>
            </div>
            <div>
              <h4 className="font-bold">The Glow Up Plan ✨:</h4>
              <p className="text-sm">{result.advice}</p>
            </div>
            <div>
              <h4 className="font-bold">Your Spending Moods:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.emotionalStateTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </div>
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
