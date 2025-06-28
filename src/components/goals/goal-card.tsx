'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Goal } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Button } from '../ui/button';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onComplete?: (goalId: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete, onComplete }: GoalCardProps) {
  const { completeGoal } = useData();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    if (goal.isCompleted) return;
    // Mockup verification step
    const verified = window.confirm('Verification Step (Mockup)\n\nPlease confirm you have truly completed this goal!');
    if (!verified) return;
    if (onComplete) onComplete(goal.id);
    else completeGoal(goal.id);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <Card className="glassmorphism flex flex-col relative">
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <span role="img" aria-label="confetti" className="text-5xl animate-bounce">🎉</span>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{goal.emoji}</span>
            {goal.title}
            {goal.category && (
              <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{goal.category}</span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {onEdit && <Button size="icon" variant="ghost" onClick={() => onEdit(goal)}><Edit className="w-4 h-4" /></Button>}
            {onDelete && <Button size="icon" variant="ghost" onClick={() => onDelete(goal.id)}><Trash2 className="w-4 h-4" /></Button>}
          </div>
        </div>
        <CardDescription>{goal.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Progress value={goal.progress} className="h-2 flex-1" />
          <span className="text-xs font-mono text-muted-foreground">{goal.progress}%</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <Badge variant={goal.isCompleted ? 'default' : 'secondary'}>
            {goal.isCompleted ? 'Completed!' : `${goal.points} Zen Points`}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleComplete} 
          disabled={goal.isCompleted}
          className="w-full"
        >
          {goal.isCompleted ? <><CheckCircle className="mr-2 h-4 w-4" /> Done!</> : 'Mark as Complete'}
        </Button>
      </CardFooter>
    </Card>
  );
}
