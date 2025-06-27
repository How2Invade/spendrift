'use client';

import { useState, useRef, useEffect } from 'react';
import { financialGuidanceChat } from '@/ai/flows/financial-guidance-chat';
import type { FinancialGuidanceChatInput } from '@/ai/flows/financial-guidance-chat';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const INITIAL_MESSAGE = "Hello! I'm FinBot. Please paste your bank statement text, and I can help you analyze it.";

export default function ChatInterface() {
  const { toast } = useToast();
  const [statement, setStatement] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartChat = () => {
    if (statement.trim().length < 50) {
      toast({
        variant: 'destructive',
        title: 'Statement is too short!',
        description: 'Please paste a more complete bank statement to get started.',
      });
      return;
    }
    setMessages([
      {
        role: 'model',
        content: INITIAL_MESSAGE,
      },
    ]);
    setChatStarted(true);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    const currentUserInput = userInput;
    setUserInput('');
    setLoading(true);

    try {
      const input: FinancialGuidanceChatInput = {
        statementText: statement,
        // The history should not include the initial bot message.
        history: newMessages.filter(m => m.content !== INITIAL_MESSAGE),
      };
      const result = await financialGuidanceChat(input);
      setMessages([...newMessages, { role: 'model', content: result.response }]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI is taking a nap',
        description: 'Could not get a response. Please try again.',
      });
      // Revert to previous messages and put user input back in the box
      setMessages(messages);
      setUserInput(currentUserInput);
    } finally {
      setLoading(false);
    }
  };

  if (!chatStarted) {
    return (
      <Card className="glassmorphism w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Statement</CardTitle>
          <CardDescription>
            Paste your bank statement below. Your data is processed securely and is not stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your bank statement text here..."
            className="min-h-[300px] font-mono text-xs"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />
          <Button onClick={handleStartChat} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Start Guidance Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism w-full flex-1 flex flex-col h-full overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
         <div className="space-y-4" ref={viewportRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
          <Input
            placeholder="Ask a follow-up question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
