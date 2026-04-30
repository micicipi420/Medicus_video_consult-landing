'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Body scroll lock
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Burger button -- glass pill style, visible below lg */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-[var(--glass-section-fill)] text-mu-text-700 shadow-glass-sm backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[180%] transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.96] lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-mu-text-900/35 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Glass nav panel */}
          <nav className="absolute left-4 right-4 top-24 overflow-hidden rounded-3xl border-[0.5px] border-white/55 bg-[var(--glass-section-fill)] shadow-glass-lg backdrop-blur-[var(--glass-section-blur)] backdrop-saturate-[200%]">
            <div className="flex flex-col gap-2 p-5">
              {NAV_LINKS.map((link) =>
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="min-h-12 rounded-2xl px-4 py-3 font-semibold tracking-tight text-mu-text-900 transition-[background-color,color] duration-200 hover:bg-white/45"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="min-h-12 rounded-2xl px-4 py-3 font-semibold tracking-tight text-mu-text-900 transition-[background-color,color] duration-200 hover:bg-white/45"
                  >
                    {link.label}
                  </a>
                ),
              )}

              {/* Divider */}
              <div className="h-[0.5px] bg-white/40 my-2" />

              {/* Phone link with icon */}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 transition-[background-color,color] duration-200 hover:bg-white/45"
              >
                <Phone size={20} className="text-mu-blue" />
                <span className="text-mu-text-900 font-medium tracking-tight">
                  {PHONE_DISPLAY}
                </span>
              </a>

              {/* CTA button */}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 block min-h-14 w-full rounded-2xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-6 py-4 text-center font-extrabold tracking-tight text-white shadow-lg transition-[transform,box-shadow,filter] duration-200 active:scale-[0.96]"
              >
                Обсудить случай
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
