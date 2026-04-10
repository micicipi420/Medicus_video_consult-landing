'use client';

import { PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function StickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] py-2 lg:hidden"
      role="complementary"
      aria-label="Quick actions"
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="font-heading text-sm font-semibold text-mu-blue-text whitespace-nowrap min-h-12 inline-flex items-center"
          aria-label={`Позвонить ${PHONE_DISPLAY}`}
        >
          {PHONE_DISPLAY}
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-mu-cta-from to-mu-cta-to hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Оставить заявку
        </a>
      </div>
    </div>
  );
}
