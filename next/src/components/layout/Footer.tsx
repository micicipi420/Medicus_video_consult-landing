import { FOOTER_NAV_LINKS, PHONE_NUMBER, PHONE_DISPLAY, EMAIL, COMPANY_NAME, TAGLINE } from '@/lib/navigation';

export function Footer() {
  return (
    <footer className="bg-[#1A365D] text-white py-12 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Company info */}
          <div>
            <p className="font-heading text-[1.25rem] font-bold mb-2">{COMPANY_NAME}</p>
            <p className="text-[1rem] text-white/70">{TAGLINE}</p>
          </div>
          {/* Contacts */}
          <div>
            <p className="mb-2">
              <a href={`tel:${PHONE_NUMBER}`} className="text-[1.125rem] text-white hover:text-[#2B6CB0] transition-colors">
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <a href={`mailto:${EMAIL}`} className="text-[1.125rem] text-white hover:text-[#2B6CB0] transition-colors">
                {EMAIL}
              </a>
            </p>
          </div>
          {/* Nav */}
          <div>
            {FOOTER_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block mb-2 text-[1.125rem] text-white hover:text-[#2B6CB0] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        {/* Legal */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-[1rem] text-white/50">
            &copy;&nbsp;2026 {COMPANY_NAME}. Все&nbsp;права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
