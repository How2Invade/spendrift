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
import { LayoutGrid, BarChart2, Trophy, PlusCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/shared/theme-toggle';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutGrid,
    emoji: '✨',
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart2,
    emoji: '📈',
  },
  {
    href: '/goals',
    label: 'Goals',
    icon: Trophy,
    emoji: '🏆',
  },
  {
    href: '/guidance',
    label: 'Guidance',
    icon: MessageCircle,
    emoji: '💬',
  },
  {
    href: '/add-expense',
    label: 'Add Expense',
    icon: PlusCircle,
    emoji: '💸',
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <SpenDriftLogo className="text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <a>
                    <link.icon className="h-5 w-5" />
                    <span className="truncate">{link.label}</span>
                    <span className="ml-auto">{link.emoji}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <div className="p-4 border-t hidden md:block">
         <ThemeToggle />
       </div>
    </>
  );
}
