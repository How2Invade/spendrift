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

const goalSchema = z.object({
  title: z.string().min(3, { message: 'Goal title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  points: z.coerce.number().min(10, { message: 'Points must be at least 10.' }),
  emoji: z.string().min(1, { message: 'Please add an emoji.' }),
});

// Mock AI goal suggestions
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
];

export default function GoalsPage() {
  const { goals, addGoal, completeGoal } = useData();
  const [open, setOpen] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });

  // Memoize AI suggestions so they don't change on every render
  const getAISuggestions = useMemo(() => () => {
    // In real app, call AI backend here
    setAISuggestions(mockAIGoals.map((g, i) => ({ ...g, id: 'ai-' + i })));
  }, []);

  // Accept an AI goal
  const acceptAIGoal = (goal) => {
    addGoal({
      ...goal,
      id: `${goal.title}-${Date.now()}`,
      progress: 0,
      isCompleted: false,
    });
    setAISuggestions((prev) => prev.filter((g) => g.title !== goal.title));
  };

  // Reject an AI goal
  const rejectAIGoal = (goal) => {
    setAISuggestions((prev) => prev.filter((g) => g.title !== goal.title));
  };

  // When a goal is completed, award points
  const handleCompleteGoal = (goalId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal && !goal.isCompleted) {
      setUserPoints((prev) => prev + (goal.points || 0));
      completeGoal(goalId);
    }
  };

  const onSubmit = (data: z.infer<typeof goalSchema>) => {
    addGoal(data);
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
          </h1>
          <p className="text-muted-foreground font-mono">Track your progress and stay motivated to reach your financial objectives.</p>
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
                    <Input id="points" type="number" {...register('points')} className="col-span-3" />
                    {errors.points && <p className="text-destructive text-xs col-span-4">{errors.points.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="emoji" className="text-right">Emoji</Label>
                    <Input id="emoji" {...register('emoji')} className="col-span-3" />
                    {errors.emoji && <p className="text-destructive text-xs col-span-4">{errors.emoji.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Goal</Button>
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
      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" /> AI Suggested Goals
          </h2>
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
        </div>
      )}
      {/* User Goals */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onComplete={handleCompleteGoal} />
          ))}
        </div>
      ) : (
        aiSuggestions.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold text-primary">No Goals Yet!</h2>
            <p className="text-muted-foreground mt-2">Click "Add Goal" or "Suggest Goals" to get started on your financial journey.</p>
          </div>
        )
      )}
    </div>
  );
}
