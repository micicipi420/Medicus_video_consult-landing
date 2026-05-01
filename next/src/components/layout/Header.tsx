import Link from 'next/link';
import { Phone } from 'lucide-react';
import { HeaderClient } from './HeaderClient';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY } from '@/lib/navigation';

export function Header() {
  return (
    <HeaderClient>
      <div className="flex items-center justify-between w-full">
        {/* Logo -- gradient text */}
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent"
        >
          MedicusUnion
        </Link>

        {/* Desktop navigation -- visible at lg (1024px) */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('/') && !link.href.includes('#') ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight whitespace-nowrap"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight whitespace-nowrap"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* Desktop right side: phone + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-2 text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight"
          >
            <Phone size={16} />
            {PHONE_DISPLAY}
          </a>
          <a
            href="#contact"
            className="bg-gradient-to-r from-mu-cta-brand-from to-mu-cta-brand-to text-white px-6 py-2.5 rounded-full font-extrabold shadow-lg shadow-mu-blue/25 hover:shadow-xl hover:shadow-mu-blue/30 transition-shadow tracking-tight"
          >
            Обсудить случай
          </a>
        </div>

        {/* Mobile menu toggle -- visible below lg */}
        <MobileMenu />
      </div>
    </HeaderClient>
  );
}
