'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseExpenseChat } from '@/ai/flows/parse-expense-chat';
import { useData } from '@/context/data-context';

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
  const { addTransaction } = useData();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatInput: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const output = await parseExpenseChat(values);
      addTransaction({ ...output, type: 'expense' }); // Assuming chat parser is for expenses
      toast({
        title: 'Expense Added! 💸',
        description: `Logged "${output.description}" for ₹${output.amount}.`,
      });
      form.reset();
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
              Parse & Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
