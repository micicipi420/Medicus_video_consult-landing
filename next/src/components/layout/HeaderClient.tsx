'use client';

import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/use-scrolled';

export function HeaderClient({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center transition-all duration-300 h-16 md:h-[76px]',
        isScrolled ? 'liquid-nav header--scrolled' : 'bg-white',
      )}
    >
      {children}
    </header>
  );
}
