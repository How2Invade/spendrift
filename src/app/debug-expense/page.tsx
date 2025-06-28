'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { parseExpenseChat } from '@/ai/flows/parse-expense-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function DebugExpensePage() {
  const { user, userProfile, loading } = useAuth();
  const { transactions, addTransaction } = useData();
  const { toast } = useToast();
  const [testInput, setTestInput] = useState('bought coffee for 250 rupees today');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAI = async () => {
    setIsLoading(true);
    try {
      const result = await parseExpenseChat({ chatInput: testInput });
      setTestResult(result);
      toast({ title: 'AI Parse Success', description: 'Check the result below' });
    } catch (error) {
      console.error('AI Test Error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'AI Parse Failed', 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAddTransaction = async () => {
    if (!testResult) {
      toast({ variant: 'destructive', title: 'No parsed data', description: 'Parse expense first' });
      return;
    }

    try {
      await addTransaction({ ...testResult, type: 'expense' });
      toast({ title: 'Transaction Added', description: 'Check recent transactions' });
    } catch (error) {
      console.error('Add Transaction Error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Add Transaction Failed', 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const testManualTransaction = async () => {
    const manualTransaction = {
      amount: 100,
      description: 'Test manual transaction',
      category: 'food',
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
      type: 'expense' as const
    };

    try {
      await addTransaction(manualTransaction);
      toast({ title: 'Manual Transaction Added', description: 'Direct database test successful' });
    } catch (error) {
      console.error('Manual Transaction Error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Manual Transaction Failed', 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Debug Add Expense 🔍</h1>
        <p className="text-muted-foreground">Test the expense parsing and adding functionality</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Profile:</strong> {userProfile ? 'Loaded' : 'Not loaded'}</p>
              <p><strong>Points:</strong> {userProfile?.points || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</p>
              <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
              <p><strong>Gemini API:</strong> Server-side only</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test AI Parsing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter expense description"
            />
            <Button onClick={testAI} disabled={isLoading}>
              {isLoading ? 'Parsing...' : 'Test AI Parse'}
            </Button>
            {testResult && (
              <div className="bg-muted p-3 rounded">
                <pre>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Add Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Total Transactions: {transactions.length}</p>
            <div className="space-y-2">
              <Button onClick={testAddTransaction} disabled={!testResult}>
                Add Parsed Transaction
              </Button>
              <Button onClick={testManualTransaction} variant="outline">
                Add Manual Transaction
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {transactions.slice(0, 3).map((t) => (
                <div key={t.id} className="text-sm p-2 border rounded mb-2">
                  <p><strong>{t.description}</strong></p>
                  <p>{t.category} - ₹{t.amount} - {t.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
