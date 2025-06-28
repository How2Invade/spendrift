"use client";
import { useAuth } from '@/context/auth-context';
import { useData } from '@/context/data-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/theme-toggle';
import { Gem, LogOut, BadgeCheck, Sparkles, Award } from 'lucide-react';
import { useState } from 'react';

const badges = [
  { name: 'First Goal!', desc: 'Completed your first goal', icon: <Award className="text-yellow-400" />, earned: true },
  { name: 'Streak Master', desc: '5-day streak', icon: <Sparkles className="text-pink-400" />, earned: false },
  { name: 'Big Saver', desc: 'Saved over ₹10,000', icon: <BadgeCheck className="text-green-500" />, earned: false },
];

export default function ProfilePage() {
  const { user, userProfile, signOut } = useAuth();
  const { points } = useData();
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen bg-background items-center">
      <Card className="w-full max-w-2xl glassmorphism flex flex-col items-center p-8">
        <CardHeader className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center text-5xl font-bold mb-4">
            {userProfile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <CardTitle className="text-3xl font-retro text-primary mb-1">{userProfile?.display_name || user?.email || 'User'}</CardTitle>
          <div className="text-muted-foreground font-mono text-sm mb-2">{user?.email}</div>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="mb-2">Edit Profile</Button>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-6 items-center">
          <div className="flex gap-6 w-full justify-center">
            <div className="flex flex-col items-center">
              <Gem className="h-8 w-8 text-primary mb-1" />
              <div className="font-mono text-lg font-bold">{points}</div>
              <div className="text-xs text-muted-foreground">Zen Points</div>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="h-8 w-8 text-yellow-400 mb-1" />
              <div className="font-mono text-lg font-bold">0</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="font-bold mb-2 text-primary">Badges</div>
            <div className="flex gap-4 flex-wrap">
              {badges.map(badge => (
                <div key={badge.name} className={`flex flex-col items-center ${badge.earned ? '' : 'opacity-40'}`}>
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <span className="font-bold text-sm">{badge.name}</span>
                  <span className="text-xs text-muted-foreground">{badge.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 mt-8">
            <ThemeToggle />
            <Button variant="outline" size="lg" className="w-full mt-2" onClick={signOut}>
              <LogOut className="mr-2 h-5 w-5" /> Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Edit Profile Modal (mockup) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl p-8 shadow-xl w-full max-w-md flex flex-col items-center">
            <div className="text-xl font-bold mb-4">Edit Profile (Mockup)</div>
            <div className="text-muted-foreground mb-4">Profile editing coming soon!</div>
            <Button onClick={() => setEditing(false)} className="w-full">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
} 