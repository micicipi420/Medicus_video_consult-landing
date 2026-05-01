'use client';

import { useRef } from 'react';
import { useSpecularHighlight } from '@/hooks/use-specular-highlight';

interface GlassInteractionProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
}

/**
 * Wrapper component that enables cursor-tracking specular highlights
 * on glass surfaces. Attaches useSpecularHighlight to set --mouse-x
 * and --mouse-y CSS custom properties from pointer events.
 *
 * Hover/press brightness states are handled purely by CSS
 * (liquid-glass.css Section 16) -- no Framer Motion needed.
 */
export function GlassInteraction({
  children,
  className,
  as: Tag = 'div',
}: GlassInteractionProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSpecularHighlight(ref);

  if (Tag === 'div') {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (Tag === 'article') {
    return (
      <article ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </article>
    );
  }

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={className}>
      {children}
    </section>
  );
}
