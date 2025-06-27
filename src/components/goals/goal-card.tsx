import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Goal } from '@/lib/types';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  return (
    <Card className="glassmorphism">
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
          <Badge variant={goal.progress === 100 ? 'default' : 'secondary'}>
            {goal.progress === 100 ? 'Completed!' : 'In Progress'}
          </Badge>
          <span>{goal.progress}% Complete</span>
        </div>
      </CardContent>
    </Card>
  );
}
