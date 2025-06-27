'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseExpenseChat, type ParseExpenseChatOutput } from '@/ai/flows/parse-expense-chat';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  chatInput: z.string().min(10, 'Cmon, give me something to work with!'),
});

export default function ChatParser() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseExpenseChatOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatInput: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await parseExpenseChat(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed to parse your expense. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Chat Expense Entry 💬</CardTitle>
        <CardDescription>Just tell me what you spent. I'll figure out the rest. e.g., "boba tea for 350 rupees on tuesday"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="chatInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your expense</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. copped new kicks for ₹4500 yesterday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Parse Expense
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg space-y-2">
            <h3 className="font-bold">Parsed Expense:</h3>
            <p><strong>Category:</strong> {result.category}</p>
            <p><strong>Amount:</strong> ₹{result.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {result.date}</p>
            <p><strong>Description:</strong> {result.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
