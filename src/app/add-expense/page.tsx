import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatParser from '@/components/add-expense/chat-parser';
import StatementParser from '@/components/add-expense/statement-parser';
import RecentTransactions from '@/components/dashboard/recent-transactions';

export default function AddExpensePage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Add Expense 💸</h1>
        <p className="text-muted-foreground">Log your spending. The easy way.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat Entry</TabsTrigger>
              <TabsTrigger value="statement">Statement Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <ChatParser />
            </TabsContent>
            <TabsContent value="statement">
              <StatementParser />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
