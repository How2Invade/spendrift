'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '@/components/shared/theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="flex-1">
        <SidebarTrigger className="lg:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
