'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Goal } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const { completeGoal } = useData();

  return (
    <Card className="glassmorphism flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{goal.emoji}</span>
          {goal.title}
        </CardTitle>
        <CardDescription>{goal.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={goal.progress} className="h-2" />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <Badge variant={goal.isCompleted ? 'default' : 'secondary'}>
            {goal.isCompleted ? 'Completed!' : `${goal.points} Zen Points`}
          </Badge>
          <span>{goal.progress}% Complete</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => completeGoal(goal.id)} 
          disabled={goal.isCompleted}
          className="w-full"
        >
          {goal.isCompleted ? <><CheckCircle className="mr-2 h-4 w-4" /> Done!</> : 'Mark as Complete'}
        </Button>
      </CardFooter>
    </Card>
  );
}
