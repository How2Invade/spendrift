'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="text-xs font-mono text-muted-foreground mb-2">THEME_MODE</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="retro-button w-full justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>{theme === 'dark' ? 'NEON' : 'LIGHT'}</span>
            </div>
            <span className="text-xs opacity-60">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="retro-card border-primary/30 font-mono text-xs"
        >
          <DropdownMenuItem 
            onClick={() => setTheme('light')}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Sun className="h-3 w-3 mr-2" />
            PARENT_APPROVED
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('dark')}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Moon className="h-3 w-3 mr-2" />
            NEON_VIBE
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
