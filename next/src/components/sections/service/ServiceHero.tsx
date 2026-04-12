import type { ReactNode } from 'react';

interface ServiceHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle: ReactNode;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  trustLine?: string;
  illustration: ReactNode;
  variant?: 'default' | 'abroad' | 'checkup';
}

export function ServiceHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustLine,
  illustration,
  variant = 'default',
}: ServiceHeroProps) {
  return (
    <section className="pt-32 pb-16" id="hero">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content side */}
          <div>
            {eyebrow && (
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-glass-inner mb-6">
                <span className="text-sm font-bold text-mu-blue uppercase tracking-wider">
                  {eyebrow}
                </span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-balance">
              {title}
            </h1>
            <p className="text-xl text-mu-text-700 font-medium leading-relaxed mb-8 max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href={primaryCta.href}
                className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] transition-all flex items-center justify-center gap-2 group text-lg"
              >
                {primaryCta.text}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="bg-white/50 backdrop-blur-xl text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-white/60 transition-all border border-white/60 text-lg text-center"
                >
                  {secondaryCta.text}
                </a>
              )}
            </div>
            {trustLine && (
              <p className="text-sm text-mu-text-700 font-semibold">
                {trustLine}
              </p>
            )}
          </div>

          {/* Illustration side */}
          <div className="hidden lg:block">
            {illustration}
          </div>
        </div>
      </div>
    </section>
  );
}
