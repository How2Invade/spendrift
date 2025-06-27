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
import { LayoutGrid, BarChart2, Trophy, PlusCircle, MessageCircle, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/shared/theme-toggle';

const links = [
  { href: '/dashboard', label: 'DASHBOARD', icon: LayoutGrid, emoji: '⚡', code: '001' },
  { href: '/analytics', label: 'ANALYTICS', icon: BarChart2, emoji: '�', code: '002' },
  { href: '/goals', label: 'GOALS', icon: Trophy, emoji: '�', code: '003' },
  { href: '/rewards', label: 'REWARDS', icon: Gem, emoji: '💎', code: '004' },
  { href: '/guidance', label: 'GUIDANCE', icon: MessageCircle, emoji: '🤖', code: '005' },
  { href: '/add-expense', label: 'ADD_EXPENSE', icon: PlusCircle, emoji: '�', code: '006' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="cyber-sidebar h-full flex flex-col">
      <SidebarHeader className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-primary bg-primary/10 flex items-center justify-center">
            <SpenDriftLogo className="text-primary w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-retro text-primary text-sm tracking-wider">SPENDRIFT</span>
            <span className="font-mono text-xs text-muted-foreground">v2.0.25</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 p-2">
        <div className="mb-4">
          <div className="terminal-text text-xs mb-2">
            NAVIGATION_MENU
          </div>
        </div>
        
        <SidebarMenu className="space-y-1">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                isActive={pathname === link.href}
                className={`
                  group relative w-full justify-start gap-3 p-3 rounded-lg
                  font-mono text-sm transition-all duration-300
                  ${pathname === link.href 
                    ? 'bg-primary/20 text-primary border border-primary/30 neon-border' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20'
                  }
                `}
                asChild
              >
                <Link href={link.href} className="flex items-center w-full">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <link.icon className="h-4 w-4" />
                      {pathname === link.href && (
                        <div className="absolute -inset-1 bg-primary/20 rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className="truncate font-medium tracking-wide">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{link.emoji}</span>
                    <span className="font-mono text-xs text-muted-foreground/60">{link.code}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <div className="border-t border-primary/20 p-4">
        <div className="terminal-text text-xs mb-3">
          SYSTEM_CONTROLS
        </div>
        <ThemeToggle />
        
        {/* System status indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-muted-foreground">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
