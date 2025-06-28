'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '@/context/data-context';
import GoalCard from '@/components/goals/goal-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const goalSchema = z.object({
  title: z.string().min(3, { message: 'Goal title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  points: z.coerce.number().min(10, { message: 'Points must be at least 10.' }),
  emoji: z.string().min(1, { message: 'Please add an emoji.' }),
  category: z.string().optional(),
});

// Mock AI goal suggestions (bank of 8 goals)
const mockAIGoals = [
  {
    title: 'Save ₹5000 this month',
    description: 'Set aside at least ₹5000 from your income this month.',
    points: 50,
    emoji: '💰',
  },
  {
    title: 'Track all expenses for 7 days',
    description: 'Record every expense for a week to understand your spending.',
    points: 30,
    emoji: '📝',
  },
  {
    title: 'No eating out for 5 days',
    description: 'Prepare all your meals at home for 5 days straight.',
    points: 40,
    emoji: '🍲',
  },
  {
    title: 'Review subscriptions',
    description: 'Audit your monthly subscriptions and cancel one you don\'t use.',
    points: 25,
    emoji: '🔍',
  },
  {
    title: 'Walk 10,000 steps daily for a week',
    description: 'Stay healthy and track your steps for 7 days.',
    points: 20,
    emoji: '🚶',
  },
  {
    title: 'No impulse buys for 10 days',
    description: 'Avoid all unplanned purchases for 10 days.',
    points: 35,
    emoji: '🛑',
  },
  {
    title: 'Read a finance book',
    description: 'Finish reading a book about personal finance.',
    points: 60,
    emoji: '📚',
  },
  {
    title: 'Cook all meals at home for a week',
    description: 'Don\'t eat out or order in for 7 days.',
    points: 45,
    emoji: '👨‍🍳',
  },
];

// Mock AI analysis function for points
function aiAssignPoints(title, description) {
  // Simple mock: longer/more challenging goals get more points
  const lower = (title + ' ' + description).toLowerCase();
  if (lower.includes('save') && lower.match(/\d+/)) {
    const amount = parseInt(lower.match(/\d+/)[0], 10);
    return Math.min(100, Math.max(20, Math.floor(amount / 100)));
  }
  if (lower.includes('week') || lower.includes('7 days')) return 40;
  if (lower.includes('month')) return 60;
  if (lower.includes('read') || lower.includes('book')) return 30;
  if (lower.includes('no') && lower.includes('spend')) return 35;
  if (lower.includes('track')) return 25;
  return 20;
}

export default function GoalsPage() {
  const { goals, addGoal, completeGoal, deleteGoal, editGoal } = useData();
  const [open, setOpen] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState(
    mockAIGoals.map((g, i) => ({ ...g, id: 'ai-' + i }))
  );
  const [userPoints, setUserPoints] = useState(0);
  const [editingGoal, setEditingGoal] = useState(null);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [streak, setStreak] = useState(0);
  const [justAddedGoalId, setJustAddedGoalId] = useState(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });
  const [activeTab, setActiveTab] = useState('accepted');
  const [aiPoints, setAIPoints] = useState(20);
  const [aiEmoji, setAIEmoji] = useState('🎯');
  const [aiLoading, setAILoading] = useState(false);

  // Memoize AI suggestions so they don't change on every render
  const getAISuggestions = useMemo(() => () => {
    // In real app, call AI backend here
    setAISuggestions(mockAIGoals.map((g, i) => ({ ...g, id: 'ai-' + i })));
  }, []);

  // Accept an AI goal with animation and toast
  const acceptAIGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: `${goal.title}-${Date.now()}`,
      progress: 0,
      isCompleted: false,
    };
    addGoal(newGoal);
    setAISuggestions((prev) => prev.filter((g) => g.id !== goal.id));
    setJustAddedGoalId(newGoal.id);
    toast({
      title: 'Goal Added!',
      description: `"${goal.title}" added. Earn ${goal.points} points!`,
    });
    setTimeout(() => setJustAddedGoalId(null), 2000);
  };

  // Reject an AI goal
  const rejectAIGoal = (goal) => {
    setAISuggestions((prev) => prev.filter((g) => g.id !== goal.id));
  };

  // When a goal is completed, award points and update streak/history
  const handleCompleteGoal = (goalId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal && !goal.isCompleted) {
      setUserPoints((prev) => prev + (goal.points || 0));
      setCompletedGoals((prev) => [{ ...goal, completedAt: new Date() }, ...prev]);
      setStreak((prev) => prev + 1);
      completeGoal(goalId);
    }
  };

  // Handle goal editing
  const handleEditGoal = (goal) => setEditingGoal(goal);
  const handleDeleteGoal = (goalId) => deleteGoal(goalId);

  const getAISuggestion = async (title, description) => {
    if (title.length > 2 && description.length > 9) {
      setAILoading(true);
      try {
        const res = await fetch('/api/analyze-goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const aiRes = await res.json();
        setAIPoints(aiRes.points || 20);
        setAIEmoji(aiRes.emoji || '🎯');
      } catch {
        setAIPoints(20);
        setAIEmoji('🎯');
      } finally {
        setAILoading(false);
      }
    }
  };

  const onSubmit = (data) => {
    addGoal({ ...data, points: Number(data.points), emoji: data.emoji });
    reset();
    setOpen(false);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
            Your Goals
            <span className="text-green-600 text-lg font-mono bg-green-100 px-3 py-1 rounded-full">Points: {userPoints}</span>
            <span className="text-blue-600 text-lg font-mono bg-blue-100 px-3 py-1 rounded-full">Streak: {streak}</span>
          </h1>
          <p className="text-muted-foreground font-mono">Track your progress and stay motivated to reach your financial objectives.</p>
          <div className="mt-2 text-sm text-primary font-semibold">"Every small step counts. Keep going!"</div>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add a New Goal</DialogTitle>
                  <DialogDescription>
                    Create a new financial goal to work towards. Make it challenging but achievable!
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" {...register('title')} className="col-span-3" />
                    {errors.title && <p className="text-destructive text-xs col-span-4">{errors.title.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" {...register('description')} className="col-span-3" />
                    {errors.description && <p className="text-destructive text-xs col-span-4">{errors.description.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="points" className="text-right">Points</Label>
                    <Input id="points" type="number" {...register('points')} value={aiPoints} onChange={e => setAIPoints(Number(e.target.value))} className="col-span-2" />
                    <Button type="button" size="sm" className="col-span-1" onClick={async (e) => {
                      const form = e.currentTarget.form;
                      const title = form?.title?.value || '';
                      const description = form?.description?.value || '';
                      await getAISuggestion(title, description);
                    }} disabled={aiLoading}>
                      {aiLoading ? 'AI...' : 'Get AI Suggestion'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="emoji" className="text-right">Emoji</Label>
                    <Input id="emoji" {...register('emoji')} value={aiEmoji} onChange={e => setAIEmoji(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!!errors.title || !!errors.description}>Save Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {/* Suggest AI Goals button */}
          {goals.length === 0 && (
            <Button variant="secondary" onClick={getAISuggestions} className="font-mono flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Suggest Goals
            </Button>
          )}
        </div>
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="suggested">Suggested Goals</TabsTrigger>
          <TabsTrigger value="accepted">Accepted Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="suggested">
          {aiSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiSuggestions.map((goal) => (
                <div key={goal.id} className="bg-card border border-primary/20 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xl font-bold">
                    <span>{goal.emoji}</span> {goal.title}
                  </div>
                  <div className="text-muted-foreground text-sm mb-2">{goal.description}</div>
                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" onClick={() => acceptAIGoal(goal)} variant="success">Accept</Button>
                    <Button size="sm" onClick={() => rejectAIGoal(goal)} variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold text-primary">No Suggestions Left!</h2>
              <p className="text-muted-foreground mt-2">You have accepted or rejected all suggested goals.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="accepted">
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className={justAddedGoalId === goal.id ? 'animate-pulse ring-2 ring-green-400 ring-offset-2 relative' : ''}>
                  {justAddedGoalId === goal.id && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <span role="img" aria-label="confetti" className="text-5xl animate-bounce">🎉</span>
                    </div>
                  )}
                  <GoalCard goal={goal} onEdit={handleEditGoal} onDelete={handleDeleteGoal} onComplete={handleCompleteGoal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold text-primary">No Accepted Challenges!</h2>
              <p className="text-muted-foreground mt-2">Accept a suggested goal to get started.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Completed Goals History */}
      {completedGoals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-primary mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map((goal, idx) => (
              <div key={goal.id + idx} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 opacity-70">
                <div className="flex items-center gap-2 text-xl font-bold">
                  <span>{goal.emoji}</span> {goal.title}
                </div>
                <div className="text-muted-foreground text-sm mb-2">{goal.description}</div>
                <div className="text-xs text-muted-foreground">Completed at: {goal.completedAt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
