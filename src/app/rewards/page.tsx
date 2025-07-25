'use client';

import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Gift, Award, Lock, BadgeCheck, ShoppingBag, Store, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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

const badges = [
  { name: 'First Goal!', desc: 'Completed your first goal', icon: <Award className="text-yellow-400" />, earned: true },
  { name: 'Streak Master', desc: '5-day streak', icon: <Sparkles className="text-pink-400" />, earned: false },
  { name: 'Big Saver', desc: 'Saved over ₹10,000', icon: <BadgeCheck className="text-green-500" />, earned: false },
  { name: 'Mystery Opener', desc: 'Opened a mystery box', icon: <Gift className="text-purple-500" />, earned: false },
];

const perks = [
  { name: 'Confetti', desc: 'Animated confetti on achievements', unlocked: true },
  { name: 'Retro Theme', desc: 'Unlock a retro UI theme', unlocked: false },
  { name: 'Custom Icon', desc: 'Change your profile icon', unlocked: false },
];

const mysteryBox = { opened: false, reward: '🎉 100 Bonus Points!' };

const realWorldRewards = [
  { brand: 'Starbucks', offer: '₹100 off on your next coffee', comingSoon: true },
  { brand: 'Amazon', offer: '5% cashback coupon', comingSoon: true },
  { brand: 'Zomato', offer: 'Free delivery coupon', comingSoon: true },
];

export default function RewardsPage() {
  const { points, redeemPoints } = useData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-rewards');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<any>(null);
  const [redeemError, setRedeemError] = useState("");

  const handleRedeem = async (reward: any) => {
    setRedeemError("");
    setRedeemedReward(reward);
    setShowRedeem(true);

    if (points < reward.cost) {
      setRedeemError("Not enough points to redeem this reward.");
      return;
    }
    const success = await redeemPoints(reward.cost);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    if (!success) {
      setRedeemError("There was an error redeeming your reward. Please try again later.");
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <PartyPopper className="animate-bounce text-6xl text-primary" />
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rewards Center 💎</h1>
          <p className="text-muted-foreground">Track your progress, earn badges, and unlock epic rewards.</p>
        </div>
        <div className="glassmorphism p-4 rounded-lg flex items-center gap-4">
          <Gem className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-bold">{points} Zen Points</p>
          </div>
        </div>
      </header>
      <Tabs key={points} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-rewards">My Rewards</TabsTrigger>
          <TabsTrigger value="trophy-case">Trophy Case</TabsTrigger>
          <TabsTrigger value="shop">Reward Shop</TabsTrigger>
          <TabsTrigger value="real-world">Real-World Rewards</TabsTrigger>
        </TabsList>
        <TabsContent value="my-rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Your earned badges</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 flex-wrap">
                {badges.filter(b => b.earned).map(badge => (
                  <div key={badge.name} className="flex flex-col items-center">
                    <div className="text-4xl mb-1">{badge.icon}</div>
                    <span className="font-bold">{badge.name}</span>
                    <span className="text-xs text-muted-foreground">{badge.desc}</span>
                  </div>
                ))}
                {badges.filter(b => !b.earned).length === 0 && <span className="text-muted-foreground">No badges yet!</span>}
              </CardContent>
            </Card>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Perks</CardTitle>
                <CardDescription>Unlockable fun features</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 flex-wrap">
                {perks.map(perk => (
                  <div key={perk.name} className={`flex flex-col items-center ${perk.unlocked ? '' : 'opacity-50'}`}> 
                    <span className="font-bold">{perk.name}</span>
                    <span className="text-xs text-muted-foreground">{perk.desc}</span>
                    {perk.unlocked ? <span className="text-green-500 text-xs">Unlocked</span> : <span className="text-muted-foreground text-xs">Locked</span>}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Streak</CardTitle>
                <CardDescription>Keep your streak alive for bonuses!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-mono">🔥 0 Days</div>
                <div className="text-xs text-muted-foreground mt-2">Reach 5 days for a bonus badge!</div>
              </CardContent>
            </Card>
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Mystery Box</CardTitle>
                <CardDescription>Complete goals for a chance to open!</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Gift className="text-5xl text-purple-500 mb-2" />
                <Button disabled variant="outline">Open (Complete a goal!)</Button>
                <div className="text-xs text-muted-foreground mt-2">{mysteryBox.opened ? mysteryBox.reward : 'Locked'}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="trophy-case">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map(badge => (
              <Card key={badge.name} className={`glassmorphism flex flex-col items-center p-6 ${badge.earned ? '' : 'opacity-40'}`}>
                <div className="text-5xl mb-2">{badge.icon}</div>
                <span className="font-bold">{badge.name}</span>
                <span className="text-xs text-muted-foreground">{badge.desc}</span>
                {!badge.earned && <Lock className="mt-2 text-muted-foreground" />}
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shop">
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
                    onClick={() => handleRedeem(reward)}
                    disabled={points < reward.cost}
                    className="w-full"
                  >
                    Redeem for {reward.cost} Points
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Dialog open={showRedeem} onOpenChange={setShowRedeem}>
            <DialogContent className="glassmorphism max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">🎉 Reward Redeemed!</DialogTitle>
                <DialogDescription>
                  {redeemedReward && (
                    <>
                      <div className="mt-2 text-lg font-mono text-primary">{redeemedReward.title}</div>
                      <div className="mt-1 text-muted-foreground">{redeemedReward.description}</div>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3 my-4">
                <div className="text-4xl">{redeemedReward?.emoji}</div>
                {redeemError ? (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-6 py-3 font-mono text-lg text-destructive shadow">
                    {redeemError}
                  </div>
                ) : (
                  <div className="bg-background/80 border border-primary/30 rounded-lg px-6 py-3 font-mono text-lg text-primary shadow">
                    Coupon Code: <span className="font-bold">ZEN-FAKE-{Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">(This is a mockup. Real rewards coming soon!)</div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowRedeem(false)} className="w-full">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="real-world">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realWorldRewards.map((r) => (
              <Card key={r.brand} className="glassmorphism flex flex-col items-center p-6 opacity-60">
                <Store className="text-4xl mb-2 text-primary" />
                <span className="font-bold text-lg">{r.brand}</span>
                <span className="text-xs text-muted-foreground mb-2">{r.offer}</span>
                <Button disabled variant="outline">Coming Soon</Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
