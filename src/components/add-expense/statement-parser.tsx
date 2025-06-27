'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseBankStatement, type ParseBankStatementOutput } from '@/ai/flows/parse-bank-statement';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  statementText: z.string().min(50, 'This statement looks a bit empty. Paste more content!'),
});

export default function StatementParser() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseBankStatementOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statementText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await parseBankStatement(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Parse party failed.',
        description: 'Could not analyze your statement. Please check the format and try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Statement Upload 📄</CardTitle>
        <CardDescription>Paste your bank or UPI statement text below. The AI will do the heavy lifting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="statementText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste your statement here..." className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Analyze Statement
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg space-y-4">
            <div>
              <h3 className="font-bold">Spending Insights:</h3>
              <p className="text-sm">{result.spendingInsights}</p>
            </div>
            <div>
              <h3 className="font-bold">Expense Categories:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.categories.map((cat) => (
                  <Badge key={cat} variant="secondary">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
