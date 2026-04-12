'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Burger button -- glass pill style, visible below lg */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        className="lg:hidden p-2 text-mu-text-700 bg-white/50 rounded-full backdrop-blur-xl backdrop-saturate-[180%] border border-white/50"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Glass nav panel */}
          <nav className="absolute top-24 left-4 right-4 bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] shadow-glass-lg rounded-3xl overflow-hidden border-[0.5px] border-white/50">
            <div className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link) =>
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight"
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
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/40 transition-colors"
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
                className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-4 rounded-2xl font-extrabold tracking-tight shadow-lg mt-4 w-full text-center block"
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
