import Link from 'next/link';
import { HeaderClient } from './HeaderClient';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function Header() {
  return (
    <HeaderClient>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between w-full">
        <Link href="/" className="font-heading text-lg font-bold text-mu-text-900">
          MedicusUnion
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-mu-text-500 hover:text-mu-blue transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-mu-text-500 hover:text-mu-blue transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="hidden md:inline-flex items-center font-heading text-base font-semibold text-mu-blue-text hover:text-mu-text-900 transition-colors min-h-12"
          >
            {PHONE_DISPLAY}
          </a>
          <MobileMenu />
        </div>
      </div>
    </HeaderClient>
  );
}
