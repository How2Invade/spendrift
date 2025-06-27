'use client';

import React from 'react';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function RecentTransactions({ action }: { action?: React.ReactNode }) {
  const { transactions } = useData();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions 🧾</CardTitle>
          {transactions.length === 0 && (
              <CardDescription className="pt-1.5">Your most recent transactions will appear here once added.</CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-medium font-mono',
                    transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'
                  )}>
                    {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
