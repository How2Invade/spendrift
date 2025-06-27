import ChatInterface from '@/components/guidance/chat-interface';

export default function GuidancePage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 h-full">
      <header>
        <h1 className="text-3xl font-bold font-headline">AI Financial Guidance 💬</h1>
        <p className="text-muted-foreground">Your personal finance guru. Ask me anything about your spending.</p>
      </header>
      <ChatInterface />
    </div>
  );
}
