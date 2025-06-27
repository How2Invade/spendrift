import { mockTransactions } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function RecentTransactions() {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Recent Transactions 🧾</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => (
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
      </CardContent>
    </Card>
  );
}
