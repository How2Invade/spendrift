'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Goal } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Button } from '../ui/button';
import { CheckCircle, Edit, Trash2, Shield, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onComplete?: (goalId: string) => void;
}

export default function GoalCard({ goal, onEdit, onDelete, onComplete }: GoalCardProps) {
  const { completeGoal } = useData();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleComplete = () => {
    if (goal.isCompleted) return;
    setShowVerification(true);
  };

  const confirmCompletion = () => {
    if (onComplete) onComplete(goal.id);
    else completeGoal(goal.id);
    setShowConfetti(true);
    setShowVerification(false);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <>
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

      {/* Custom Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-sm border-2 border-primary/20">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-primary">
              Goal Verification
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Please confirm that you have truly completed this goal before claiming your rewards.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{goal.emoji}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {goal.points} Zen Points
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Progress: {goal.progress}%
                </span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Ready to claim rewards?</p>
                  <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                    Make sure you've actually achieved this goal before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowVerification(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={confirmCompletion}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
