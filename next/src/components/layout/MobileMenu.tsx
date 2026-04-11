'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        className="md:hidden p-2 -mr-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          />

          {/* Nav panel */}
          <nav className="fixed top-16 left-4 right-4 z-50 rounded-2xl bg-white shadow-xl p-6 flex flex-col gap-1 transform transition-transform duration-200">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-[1.125rem] text-[#18212C] hover:bg-[#F0F7FF] transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-[1.125rem] text-[#18212C] hover:bg-[#F0F7FF] transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
            <hr className="my-2 border-black/[0.06]" />
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="block px-4 py-3 rounded-xl font-heading font-bold text-[1.125rem] text-[#1A4D80] hover:bg-[#F0F7FF] transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
          </nav>
        </>
      )}
    </>
  );
}
