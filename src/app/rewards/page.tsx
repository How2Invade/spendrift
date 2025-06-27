'use client';

import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const rewards = [
  {
    title: 'Exclusive Wallpaper Pack',
    description: 'Level up your phone with these sick wallpapers.',
    cost: 250,
    emoji: '📱',
  },
  {
    title: 'Premium App Icon',
    description: 'Flex on your friends with a special edition app icon.',
    cost: 500,
    emoji: '✨',
  },
  {
    title: 'AI Deep-Dive Report',
    description: 'Get a personalized, in-depth financial analysis from our AI.',
    cost: 1000,
    emoji: '🤖',
  },
   {
    title: 'Plant a Tree',
    description: 'We will plant a tree on your behalf. Good for you and the planet!',
    cost: 750,
    emoji: '🌳',
  },
];

export default function RewardsPage() {
  const { points } = useData();
  const { toast } = useToast();

  const handleRedeem = (cost: number) => {
    // In a real app, this would deduct points.
    // For now, we just show a toast.
    toast({
      title: 'Coming Soon! 🚀',
      description: 'Point redemption is in the works. Your points are safe!',
    });
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rewards Store 💎</h1>
          <p className="text-muted-foreground">Cash in your Zen Points for some epic rewards.</p>
        </div>
        <div className="glassmorphism p-4 rounded-lg flex items-center gap-4">
          <Gem className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-bold">{points} Zen Points</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.title} className="glassmorphism flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-4xl">{reward.emoji}</span>
                {reward.title}
              </CardTitle>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-end">
              <Button
                onClick={() => handleRedeem(reward.cost)}
                disabled={points < reward.cost}
                className="w-full"
              >
                Redeem for {reward.cost} Points
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
