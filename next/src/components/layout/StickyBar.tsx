'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function StickyBar() {
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();
  const ctaHref = pathname === '/' ? '#contact' : '/contacts';

  useEffect(() => {
    const contactSection = document.querySelector('#contact');
    const footerElement = document.querySelector('footer');

    const targets = [contactSection, footerElement].filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const visibleSet = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target);
          } else {
            visibleSet.delete(entry.target);
          }
        });
        setIsHidden(visibleSet.size > 0);
      },
      { threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 rounded-2xl border border-white/60 bg-white/68 p-3 shadow-glass-lg backdrop-blur-3xl transition-transform duration-300 lg:hidden ${isHidden ? 'translate-y-[calc(100%+24px)]' : ''}`}
      role="complementary"
      aria-label="Быстрые действия"
    >
      <div className="flex items-center justify-between gap-3">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex min-h-11 items-center text-sm font-semibold text-mu-text-900"
          aria-label={`Позвонить ${PHONE_DISPLAY}`}
        >
          {PHONE_DISPLAY}
        </a>
        <a
          href={ctaHref}
          className="flex min-h-11 items-center rounded-xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-mu-blue/30 transition-[transform,box-shadow,filter] duration-200 active:scale-[0.96]"
        >
          Обсудить случай
        </a>
      </div>
    </div>
  );
}
