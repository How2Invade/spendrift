"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, HeartPulse, Zap, Bot } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';

const aiConfigs = [
  {
    key: "health",
    label: "Financial Health",
    icon: <HeartPulse className="h-5 w-5 mr-2 text-pink-500" />,
    welcome: "Ask me about your financial health, habits, and how to improve!",
    prompts: [
      "How healthy are my finances?",
      "What can I do to improve my savings?",
      "Am I spending too much on food?",
    ],
  },
  {
    key: "advice",
    label: "Spending Advice",
    icon: <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />,
    welcome: "Get smart, personalized advice for your spending habits.",
    prompts: [
      "How can I save more this month?",
      "Any tips for budgeting as a student?",
      "How do I avoid impulse buys?",
    ],
  },
  {
    key: "forecast",
    label: "Forecast",
    icon: <Zap className="h-5 w-5 mr-2 text-blue-500" />,
    welcome: "See your financial future! Ask for predictions and trends.",
    prompts: [
      "What will my balance look like in 3 months?",
      "Forecast my expenses for next month.",
      "Will I reach my savings goal?",
    ],
  },
];

function ChatUI({ aiKey, prompts, welcome }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", text: welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('user_id', user.id)
        .eq('ai_type', aiKey)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data && data.messages) {
        setMessages(data.messages);
      }
    })();
  }, [user, aiKey]);

  // Save chat history to Supabase on change
  useEffect(() => {
    if (!user) return;
    (async () => {
      await supabase.from('ai_chat_history').upsert({
        user_id: user.id,
        ai_type: aiKey,
        messages,
        created_at: new Date().toISOString(),
      }, { onConflict: ['user_id', 'ai_type'] });
    })();
  }, [messages, user, aiKey]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (msg) => {
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `AI (${aiKey}): Here's a smart answer to: "${msg}" 🚀` },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-2 flex-wrap mb-2">
        {prompts.map((p) => (
          <Button key={p} size="sm" variant="secondary" onClick={() => sendMessage(p)} disabled={loading}>{p}</Button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto rounded-lg p-4 space-y-3 min-h-[220px] max-h-[320px] bg-card/80 border border-border">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-[80%] px-4 py-2 rounded-xl shadow font-mono text-sm
              ${m.role === "user"
                ? "bg-primary text-white self-end"
                : "bg-background/80 text-foreground border border-border self-start"}
            `}>
              {m.role === "ai" && (
                <span className="absolute -left-7 top-1"><Bot className="h-4 w-4 text-primary/70" /></span>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
            <Bot className="h-4 w-4 text-primary/60" /> AI is thinking <span className="animate-bounce">...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="flex gap-2 mt-2"
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage(input.trim());
          setInput("");
        }}
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
      </form>
    </div>
  );
}

export default function AIInsightsPage() {
  const [tab, setTab] = useState(aiConfigs[0].key);
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen bg-background">
      <header className="mb-4">
        <h1 className="text-4xl font-bold font-retro text-primary mb-2 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-yellow-400" /> AI Insights
        </h1>
        <p className="text-muted-foreground font-mono">Chat with your personal finance AIs for health checks, advice, and forecasts!</p>
      </header>
      <Card className="w-full max-w-3xl mx-auto glassmorphism">
        <CardHeader>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4">
              {aiConfigs.map(a => (
                <TabsTrigger key={a.key} value={a.key} className="flex items-center gap-2">
                  {a.icon}{a.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {aiConfigs.map(a => (
              <TabsContent key={a.key} value={a.key} className="mt-0">
                <ChatUI aiKey={a.key} prompts={a.prompts} welcome={a.welcome} />
              </TabsContent>
            ))}
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}

// Animations (add to your global CSS or Tailwind config):
// .animate-fade-in-right { animation: fadeInRight 0.4s; }
// .animate-fade-in-left { animation: fadeInLeft 0.4s; }
// .animate-spin-slow { animation: spin 2.5s linear infinite; } 