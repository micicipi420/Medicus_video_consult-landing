'use client';

import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/use-scrolled';

export function HeaderClient({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled();

  return (
    <header
      className={cn(
        'fixed z-50 transition-[padding,box-shadow] duration-300 top-4 left-4 right-4 mx-auto max-w-7xl',
        'rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50',
        'shadow-glass-header',
        'flex items-center',
        // Default glass state (v9 Tier 0)
        'bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[150%] py-5',
        // Scrolled glass state (v9 Tier 0 — same fill/blur tokens; only saturate + padding differ)
        isScrolled && 'bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[180%] py-3',
      )}
    >
      {children}
    </header>
  );
}
