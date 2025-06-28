'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SpenDriftLogo } from '@/components/icons';
import { LayoutGrid, BarChart2, Trophy, PlusCircle, MessageCircle, Gem, BrainCircuit, LogOut, Sparkles, BadgeCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/shared/theme-toggle';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { useData } from '@/context/data-context';

const links = [
  { href: '/dashboard', label: 'DASHBOARD', icon: LayoutGrid, emoji: '⚡', code: '001' },
  { href: '/analytics', label: 'ANALYTICS', icon: BarChart2, emoji: '📊', code: '002' },
  { href: '/goals', label: 'GOALS', icon: Trophy, emoji: '🏆', code: '003' },
  { href: '/rewards', label: 'REWARDS', icon: Gem, emoji: '💎', code: '004' },
  { href: '/reflection', label: 'REFLECTION', icon: BrainCircuit, emoji: '🔮', code: '005' },
  { href: '/guidance', label: 'GUIDANCE', icon: MessageCircle, emoji: '🤖', code: '006' },
  { href: '/ai-insights', label: 'AI INSIGHTS', icon: Sparkles, emoji: '✨', code: '008' },
  { href: '/add-expense', label: 'ADD_EXPENSE', icon: PlusCircle, emoji: '💸', code: '007' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { signOut, user, userProfile } = useAuth();
  const { points } = useData ? useData() : { points: 0 };
  const badges = [
    { name: 'First Goal!', desc: 'Completed your first goal', icon: <Award className="text-yellow-400" />, earned: true },
    { name: 'Streak Master', desc: '5-day streak', icon: <Sparkles className="text-pink-400" />, earned: false },
    { name: 'Big Saver', desc: 'Saved over ₹10,000', icon: <BadgeCheck className="text-green-500" />, earned: false },
  ];
  const [profileOpen, setProfileOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-primary/30 bg-primary/5 flex items-center justify-center">
            <SpenDriftLogo className="text-primary w-6 h-6" />
          </div>
          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-col text-left focus:outline-none" tabIndex={0}>
                <span className="font-retro text-primary text-sm font-medium cursor-pointer">
                  {userProfile?.display_name || user?.email || 'User'}
                </span>
                <span className="font-mono text-xs text-muted-foreground truncate max-w-[150px] cursor-pointer">
                  {user?.email}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="glassmorphism w-80 p-6 flex flex-col items-center z-50">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center text-3xl font-bold mb-2">
                {userProfile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="font-retro text-primary text-lg mb-1">{userProfile?.display_name || user?.email || 'User'}</div>
              <div className="text-muted-foreground font-mono text-xs mb-2">{user?.email}</div>
              <div className="flex gap-4 w-full justify-center my-2">
                <div className="flex flex-col items-center">
                  <Gem className="h-6 w-6 text-primary mb-1" />
                  <div className="font-mono text-base font-bold">{points}</div>
                  <div className="text-xs text-muted-foreground">Zen Points</div>
                </div>
                <div className="flex flex-col items-center">
                  <Sparkles className="h-6 w-6 text-yellow-400 mb-1" />
                  <div className="font-mono text-base font-bold">0</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
              </div>
              <div className="w-full mt-2">
                <div className="font-bold mb-1 text-primary text-xs">Badges</div>
                <div className="flex gap-2 flex-wrap">
                  {badges.map(badge => (
                    <div key={badge.name} className={`flex flex-col items-center ${badge.earned ? '' : 'opacity-40'}`}>
                      <div className="text-2xl mb-0.5">{badge.icon}</div>
                      <span className="font-bold text-xs">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-full mt-4 mb-2">Edit Profile</Button>
              <ThemeToggle />
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-card rounded-xl p-8 shadow-xl w-full max-w-md flex flex-col items-center">
                    <div className="text-xl font-bold mb-4">Edit Profile (Mockup)</div>
                    <div className="text-muted-foreground mb-4">Profile editing coming soon!</div>
                    <Button onClick={() => setEditing(false)} className="w-full">Close</Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 p-3">
        <div className="mb-4">
          <div className="text-xs font-mono text-muted-foreground mb-3 px-2">
            NAVIGATION
          </div>
        </div>
        
        <SidebarMenu className="space-y-1">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                isActive={pathname === link.href}
                className={`
                  group relative w-full justify-start gap-3 p-3 rounded-md
                  font-mono text-sm transition-all duration-200
                  ${pathname === link.href 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                asChild
              >
                <Link href={link.href} className="flex items-center w-full">
                  <div className="flex items-center gap-3 flex-1">
                    <link.icon className="h-4 w-4" />
                    <span className="truncate font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{link.emoji}</span>
                    <span className="font-mono text-xs opacity-50">{link.code}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <div className="border-t border-border p-4 space-y-4">
        <div>
          <div className="text-xs font-mono text-muted-foreground mb-2">
            SETTINGS
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
      </div>
    </div>
  );
}
