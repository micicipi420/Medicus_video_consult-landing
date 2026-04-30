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
    <section
      className="pt-28 pb-12 lg:pt-32 lg:pb-16"
      id="hero"
      data-hero-variant={variant}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Content side */}
          <div>
            {eyebrow && (
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/60 bg-[var(--glass-section-fill)] px-4 py-2.5 shadow-glass-inner backdrop-blur-[var(--glass-section-blur)] sm:px-5">
                <span className="text-xs font-bold uppercase leading-snug tracking-wide text-mu-blue sm:text-sm">
                  {eyebrow}
                </span>
              </div>
            )}
            <h1 className="mb-5 text-4xl font-extrabold leading-[1.08] text-balance sm:text-5xl md:text-6xl lg:text-6xl">
              {title}
            </h1>
            <p className="mb-7 max-w-xl text-lg font-medium leading-relaxed text-mu-text-700 sm:text-xl lg:mb-8">
              {subtitle}
            </p>
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-12">
              <a
                href={primaryCta.href}
                className="group flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-8 py-4 text-center text-lg font-semibold text-white shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] transition-[transform,box-shadow,filter] duration-200 hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] sm:w-auto"
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
                  className="w-full rounded-3xl border border-white/60 bg-[var(--glass-section-fill)] px-8 py-4 text-center text-lg font-semibold text-mu-text-900 shadow-glass backdrop-blur-[var(--glass-section-blur)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-[var(--glass-card-fill)] sm:w-auto"
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
