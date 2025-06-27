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
import { LayoutGrid, BarChart2, Trophy, PlusCircle, MessageCircle, Gem, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/shared/theme-toggle';

const links = [
  { href: '/dashboard', label: 'DASHBOARD', icon: LayoutGrid, emoji: '⚡', code: '001' },
  { href: '/analytics', label: 'ANALYTICS', icon: BarChart2, emoji: '📊', code: '002' },
  { href: '/goals', label: 'GOALS', icon: Trophy, emoji: '🏆', code: '003' },
  { href: '/rewards', label: 'REWARDS', icon: Gem, emoji: '💎', code: '004' },
  { href: '/reflection', label: 'REFLECTION', icon: BrainCircuit, emoji: '🔮', code: '005' },
  { href: '/guidance', label: 'GUIDANCE', icon: MessageCircle, emoji: '🤖', code: '006' },
  { href: '/add-expense', label: 'ADD_EXPENSE', icon: PlusCircle, emoji: '💸', code: '007' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-primary/30 bg-primary/5 flex items-center justify-center">
            <SpenDriftLogo className="text-primary w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-retro text-primary text-sm font-medium">SPENDRIFT</span>
            <span className="font-mono text-xs text-muted-foreground">v2.0.25</span>
          </div>
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
      
      <div className="border-t border-border p-4">
        <div className="text-xs font-mono text-muted-foreground mb-3">
          SETTINGS
        </div>
        <ThemeToggle />
        
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
      </div>
    </div>
  );
}
