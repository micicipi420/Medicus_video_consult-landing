import Link from 'next/link';
import { Phone, Mail, Shield, Globe } from 'lucide-react';
import {
  FOOTER_SERVICES_LINKS,
  FOOTER_NAV_LINKS,
  PHONE_NUMBER,
  PHONE_DISPLAY,
  EMAIL,
  COMPANY_NAME,
  TAGLINE,
} from '@/lib/navigation';

export function Footer() {
  return (
    <footer className="relative overflow-hidden z-10 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Glass card container */}
        <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg">
          {/* 4-column grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Company */}
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                {COMPANY_NAME}
              </h3>
              <p className="text-mu-text-700 font-medium leading-relaxed mb-4">
                {TAGLINE}
              </p>
              <div className="space-y-1">
                <p className="text-mu-text-700 text-sm font-medium leading-relaxed">
                  MedicusUnion GmbH&nbsp;&middot;&nbsp;Bruno-Marek-Allee&nbsp;20/50, 1020&nbsp;Wien, Austria
                </p>
                <p className="text-mu-text-700 text-sm font-medium leading-relaxed">
                  ТОО&nbsp;&laquo;MedicusUnion&nbsp;KZ&raquo;&nbsp;&middot;&nbsp;Казахстан, Алматы&nbsp;&middot;&nbsp;Резидент Astana&nbsp;Hub
                </p>
              </div>
            </div>

            {/* Column 2: Services (Услуги) */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Услуги</h4>
              <div className="space-y-3">
                {FOOTER_SERVICES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-mu-text-700 hover:text-mu-blue transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Navigation (Навигация) */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Навигация</h4>
              <div className="space-y-3">
                {FOOTER_NAV_LINKS.map((link) =>
                  link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-mu-text-700 hover:text-mu-blue transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block text-mu-text-700 hover:text-mu-blue transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Column 4: Contacts (Контакты) */}
            <div>
              <h4 className="font-extrabold text-lg text-mu-text-900 mb-4">Контакты</h4>
              <div className="space-y-4">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong">
                    <Phone size={16} className="text-mu-blue" />
                  </span>
                  <span className="text-mu-text-900 font-medium group-hover:text-mu-blue transition-colors">
                    {PHONE_DISPLAY}
                  </span>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-glass-inner-strong">
                    <Mail size={16} className="text-mu-blue" />
                  </span>
                  <span className="text-mu-text-900 font-medium group-hover:text-mu-blue transition-colors">
                    {EMAIL}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-mu-text-300/30 pt-8 mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-mu-text-700 font-medium text-sm">
              &copy;&nbsp;2026 {COMPANY_NAME}. Все&nbsp;права защищены.
            </p>
            <div className="flex items-center gap-4 text-mu-text-700 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-mu-green-600" strokeWidth={2} />
                ISO&nbsp;27001
              </span>
              <span>&middot;</span>
              <span>GDPR</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-mu-green-600" strokeWidth={2} />
                Astana&nbsp;Hub
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
