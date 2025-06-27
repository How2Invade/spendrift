import GoalCard from '@/components/goals/goal-card';
import { mockGoals } from '@/lib/mock-data';

export default function GoalsPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Your Goals 🏆</h1>
        <p className="text-muted-foreground">Crush these goals to level up your savings game. You got this!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
