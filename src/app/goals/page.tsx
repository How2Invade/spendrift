'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '@/context/data-context';
import { useAuth } from '@/context/auth-context';
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
import { PlusCircle, Sparkles, BadgePercent, Smile, Gem, TrendingUp, CheckCircle, X, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Goal } from '@/lib/types';

// Custom Toast Type
interface CustomToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'celebration';
  title: string;
  description: string;
  points?: number;
  duration?: number;
}

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
function aiAssignPoints(title: string, description: string): number {
  // Simple mock: longer/more challenging goals get more points
  const lower = (title + ' ' + description).toLowerCase();
  if (lower.includes('save') && lower.match(/\d+/)) {
    const amount = parseInt(lower.match(/\d+/)?.[0] || '0', 10);
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
  const { goals, addGoal, completeGoal, deleteGoal, editGoal, points, awardPoints } = useData();
  const { user, userProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState(
    mockAIGoals.map((g, i) => ({ ...g, id: 'ai-' + i }))
  );
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [completedGoals, setCompletedGoals] = useState<Array<Goal & { completedAt: Date }>>([]);
  const [streak, setStreak] = useState(0);
  const [justAddedGoalId, setJustAddedGoalId] = useState<string | null>(null);
  const [pointsAnimation, setPointsAnimation] = useState(false);
  const [customToasts, setCustomToasts] = useState<CustomToast[]>([]);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });
  const [activeTab, setActiveTab] = useState('accepted');
  const [aiPoints, setAIPoints] = useState('');
  const [aiEmoji, setAIEmoji] = useState('');
  const [aiLoading, setAILoading] = useState(false);
  // Watch form values for AI Suggestion
  const watchedTitle = useWatch({ control, name: 'title' });
  const watchedDescription = useWatch({ control, name: 'description' });
  const [showCongrats, setShowCongrats] = useState<null | { goal: Goal, bonusPoints: number }>(null);

  // Custom Toast System
  const showCustomToast = (toastData: Omit<CustomToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: CustomToast = {
      ...toastData,
      id,
      duration: toastData.duration || 4000,
    };
    
    setCustomToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setCustomToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
  };

  const removeCustomToast = (id: string) => {
    setCustomToasts(prev => prev.filter(t => t.id !== id));
  };

  // Animate points when they change
  useEffect(() => {
    setPointsAnimation(true);
    const timer = setTimeout(() => setPointsAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [points]);

  // Debug logging and points synchronization
  useEffect(() => {
    console.log('Goals Page - Current state:', {
      points,
      userProfile: userProfile ? {
        id: userProfile.id,
        points: userProfile.points,
        display_name: userProfile.display_name
      } : null,
      user: user ? { id: user.id, email: user.email } : null,
      goalsCount: goals.length
    });

    // Synchronize points with user profile if there's a mismatch
    if (userProfile && typeof userProfile.points === 'number' && userProfile.points !== points) {
      console.log('Points mismatch detected. Syncing:', userProfile.points, 'vs local:', points);
      // Note: points state is managed by DataContext, so we don't set it directly here
    }
  }, [points, userProfile, user, goals.length]);

  // Memoize AI suggestions so they don't change on every render
  const getAISuggestions = useMemo(() => () => {
    // In real app, call AI backend here
    setAISuggestions(mockAIGoals.map((g, i) => ({ ...g, id: 'ai-' + i })));
  }, []);

  // Accept an AI goal with animation and toast
  const acceptAIGoal = (goal: typeof mockAIGoals[0] & { id: string }) => {
    const newGoal = {
      ...goal,
      id: `${goal.title}-${Date.now()}`,
      progress: 0,
      isCompleted: false,
    };
    addGoal(newGoal);
    setAISuggestions((prev) => prev.filter((g) => g.id !== goal.id));
    setJustAddedGoalId(newGoal.id);
    
    // Award bonus points for accepting a goal
    awardPoints(5, 'Goal Acceptance Bonus');
    
    // Show custom toast instead of browser toast
    showCustomToast({
      type: 'success',
      title: 'Goal Added! 🎯',
      description: `"${goal.title}" has been added to your challenges.`,
      points: goal.points + 5,
    });
    
    setTimeout(() => setJustAddedGoalId(null), 2000);
  };

  // Reject an AI goal
  const rejectAIGoal = (goal: typeof mockAIGoals[0] & { id: string }) => {
    setAISuggestions((prev) => prev.filter((g) => g.id !== goal.id));
  };

  // When a goal is completed, show modal instead of toast
  const handleCompleteGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal && !goal.isCompleted) {
      setCompletedGoals((prev) => [{ ...goal, completedAt: new Date() }, ...prev]);
      setStreak((prev) => prev + 1);
      completeGoal(goalId);
      let bonusPoints = 0;
      if (streak > 0 && streak % 3 === 0) {
        bonusPoints = 10;
      }
      setShowCongrats({ goal, bonusPoints });
    }
  };

  // Handle goal editing
  const handleEditGoal = (goal: Goal) => setEditingGoal(goal);
  const handleDeleteGoal = (goalId: string) => deleteGoal(goalId);

  const getAISuggestion = async (title: string, description: string) => {
    if (title.length > 2 && description.length > 9) {
      setAILoading(true);
      try {
        const res = await fetch('/api/analyze-goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const aiRes = await res.json();
        setAIPoints(aiRes.points || '');
        setAIEmoji(aiRes.emoji || '');
      } catch {
        setAIPoints('');
        setAIEmoji('');
      } finally {
        setAILoading(false);
      }
    }
  };

  const onSubmit = (data: z.infer<typeof goalSchema>) => {
    addGoal({ ...data, points: Number(data.points), emoji: data.emoji });
    reset();
    setOpen(false);
    
    // Show custom toast for manual goal creation
    showCustomToast({
      type: 'success',
      title: 'Custom Goal Created! ✨',
      description: `"${data.title}" has been added to your challenges.`,
      points: Number(data.points),
    });
  };

  // Custom Toast Component
  const CustomToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {customToasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-in slide-in-from-right-full duration-300 fade-in-0
            ${toast.type === 'celebration' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' : ''}
            ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
            ${toast.type === 'info' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
            ${toast.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
            text-white p-4 rounded-xl shadow-2xl border-l-4 border-white/30
            backdrop-blur-sm relative overflow-hidden transform hover:scale-105 transition-transform
            min-w-[320px] max-w-sm
          `}
        >
          {/* Background Animation for Celebration */}
          {toast.type === 'celebration' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-gradient-to-br from-yellow-300 to-transparent"></div>
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={() => removeCustomToast(toast.id)}
            className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-6">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'celebration' && <Trophy className="h-6 w-6 animate-bounce" />}
              {toast.type === 'success' && <CheckCircle className="h-6 w-6" />}
              {toast.type === 'info' && <Star className="h-6 w-6" />}
              {toast.type === 'warning' && <Sparkles className="h-6 w-6" />}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg mb-1">{toast.title}</h4>
              <p className="text-white/90 text-sm leading-relaxed">{toast.description}</p>
              
              {/* Points Display */}
              {toast.points && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Gem className="h-4 w-4" />
                    <span className="font-bold text-sm">+{toast.points} Zen Points</span>
                  </div>
                  {toast.type === 'celebration' && (
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-300 animate-pulse text-lg"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div
              className="h-full bg-white/50 transition-all ease-linear"
              style={{
                animation: `shrink ${toast.duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Custom Toast Container */}
      <CustomToastContainer />
      {/* Congratulations Modal */}
      <Dialog open={!!showCongrats} onOpenChange={open => { if (!open) setShowCongrats(null); }}>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary mb-2">🎉 Congratulations!</DialogTitle>
            {showCongrats && (
              <DialogDescription>
                You completed: <span className="font-bold">{showCongrats.goal.title}</span>
              </DialogDescription>
            )}
          </DialogHeader>
          {showCongrats && (
            <>
              <div className="text-2xl font-retro mb-4">+{showCongrats.goal.points + showCongrats.bonusPoints} Zen Points</div>
              {showCongrats.bonusPoints > 0 && <div className="text-green-600 font-mono mb-2">Streak Bonus: +{showCongrats.bonusPoints}</div>}
              <Button
                className="w-full mt-2 py-3 text-lg font-bold"
                onClick={() => {
                  awardPoints(showCongrats.goal.points + showCongrats.bonusPoints, 'Goal Completion');
                  setShowCongrats(null);
                }}
              >
                Claim Points
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="p-4 md:p-8 flex flex-col gap-8 bg-background min-h-screen relative">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
            Your Goals
            <div className={`flex items-center gap-2 text-green-600 text-lg font-mono bg-green-100 px-3 py-1 rounded-full transition-all duration-500 ${pointsAnimation ? 'scale-110 bg-green-200 shadow-lg ring-2 ring-green-300 ring-opacity-50' : ''}`}>
              <Gem className={`h-4 w-4 ${pointsAnimation ? 'animate-pulse text-green-700' : ''}`} />
              <span className={`font-bold ${pointsAnimation ? 'text-green-800' : ''}`}>{points} Zen Points</span>
              {pointsAnimation && <TrendingUp className="h-4 w-4 animate-bounce text-green-700" />}
            </div>
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
            <DialogContent className="sm:max-w-[430px] bg-card/90 rounded-2xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-1">Add a New Goal</DialogTitle>
                  <DialogDescription className="mb-2">
                    Create a new financial goal to work towards. Make it challenging but achievable!
                  </DialogDescription>
                </DialogHeader>
                {/* Title & Description */}
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm mb-1">Title</Label>
                    <Input id="title" {...register('title')} className="w-full rounded-lg bg-muted/60 focus:ring-2 focus:ring-primary" placeholder="e.g. Save for a new phone" />
                    {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm mb-1">Description</Label>
                    <Input id="description" {...register('description')} className="w-full rounded-lg bg-muted/60 focus:ring-2 focus:ring-primary" placeholder="Describe your goal..." />
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
                <div className="border-t border-border my-2" />
                {/* AI Suggestion Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="rounded-lg px-4 py-1 font-mono text-sm"
                      onClick={async () => {
                        if ((watchedTitle?.length || 0) < 3 || (watchedDescription?.length || 0) < 10) {
                          showCustomToast({
                            type: 'warning',
                            title: 'Please enter more details!',
                            description: 'Title must be at least 3 characters and description at least 10 characters.',
                          });
                          return;
                        }
                        await getAISuggestion(watchedTitle || '', watchedDescription || '');
                      }}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
                          AI...
                        </span>
                      ) : (
                        <span>✨ Get AI Suggestion</span>
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <Label htmlFor="points" className="text-xs mb-1 flex items-center gap-1"><BadgePercent className="w-4 h-4" /> Points</Label>
                      <Input id="points" type="number" {...register('points')} value={aiPoints} onChange={e => setAIPoints(e.target.value)} className="w-full rounded-lg bg-muted/60 focus:ring-2 focus:ring-primary text-lg" placeholder="AI will suggest" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <Label htmlFor="emoji" className="text-xs mb-1 flex items-center gap-1"><Smile className="w-4 h-4" /> Emoji</Label>
                      <Input id="emoji" {...register('emoji')} value={aiEmoji} onChange={e => setAIEmoji(e.target.value)} className="w-full rounded-lg bg-muted/60 focus:ring-2 focus:ring-primary text-lg" placeholder="AI will suggest" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full mt-2 py-3 text-lg font-bold" disabled={!!errors.title || !!errors.description}>Save Goal</Button>
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
                    <Button size="sm" onClick={() => acceptAIGoal(goal)} variant="default">Accept</Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {goals.map((goal) => (
                <div key={goal.id} className={`
                  transition-all duration-300 hover:scale-105
                  ${justAddedGoalId === goal.id ? 'animate-pulse ring-2 ring-green-400 ring-offset-2 relative' : ''}
                `}>
                  {justAddedGoalId === goal.id && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <span role="img" aria-label="confetti" className="text-5xl animate-bounce">🎉</span>
                    </div>
                  )}
                  <GoalCard 
                    goal={goal} 
                    onEdit={handleEditGoal} 
                    onDelete={handleDeleteGoal} 
                    onComplete={handleCompleteGoal} 
                  />
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
    </>
  );
}
