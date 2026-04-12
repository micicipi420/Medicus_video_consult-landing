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
      className={`fixed bottom-4 left-4 right-4 z-50 bg-white/60 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-glass-lg p-3 lg:hidden transition-transform duration-300 ${isHidden ? 'translate-y-[calc(100%+16px)]' : ''}`}
      role="complementary"
      aria-label="Быстрые действия"
    >
      <div className="flex items-center justify-between gap-3">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="text-mu-text-900 font-medium text-sm"
          aria-label={`Позвонить ${PHONE_DISPLAY}`}
        >
          {PHONE_DISPLAY}
        </a>
        <a
          href={ctaHref}
          className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-3 rounded-xl font-extrabold shadow-lg shadow-mu-blue/30 text-sm"
        >
          Обсудить случай
        </a>
      </div>
    </div>
  );
}
