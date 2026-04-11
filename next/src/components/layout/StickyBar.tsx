'use client';

import { useState, useEffect } from 'react';
import { PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function StickyBar() {
  const [isHidden, setIsHidden] = useState(false);

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
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] py-2 lg:hidden transition-transform duration-300 ${isHidden ? 'translate-y-full' : ''}`}
      role="complementary"
      aria-label="Quick actions"
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="font-heading text-[1rem] font-bold text-[#1A4D80] whitespace-nowrap min-h-12 inline-flex items-center"
          aria-label={`Позвонить ${PHONE_DISPLAY}`}
        >
          {PHONE_DISPLAY}
        </a>
        <a
          href="#contact"
          className="btn-primary btn-sticky"
        >
          Оставить заявку
        </a>
      </div>
    </div>
  );
}
