'use client';

import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/use-scrolled';

export function HeaderClient({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled();

  return (
    <header
      className={cn(
        'fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-7xl',
        'rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50',
        'shadow-glass-header',
        'flex items-center',
        // Default glass state
        'bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5',
        // Scrolled glass state
        isScrolled && 'bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] py-3',
      )}
    >
      {children}
    </header>
  );
}
