'use client';

import { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';

const goalSchema = z.object({
  title: z.string().min(3, { message: 'Goal title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  points: z.coerce.number().min(10, { message: 'Points must be at least 10.' }),
  emoji: z.string().min(1, { message: 'Please add an emoji.' }),
});

export default function GoalsPage() {
  const { goals, addGoal } = useData();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = (data: z.infer<typeof goalSchema>) => {
    addGoal(data);
    reset();
    setOpen(false);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Goals 🏆</h1>
          <p className="text-muted-foreground">Crush these goals to level up your savings game. You got this!</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Goal
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
      </header>
      
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Goals Yet!</h2>
            <p className="text-muted-foreground mt-2">Click "Add New Goal" to get started on your financial journey.</p>
        </div>
      )}
    </div>
  );
}
