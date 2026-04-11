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
      className="py-12 lg:py-[6.25rem] bg-gradient-to-b from-[#F0F7FF] to-white relative overflow-hidden"
      id="hero"
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(56,198,244,0.08)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[15%] right-[-8%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(53,182,120,0.06)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      {(variant === 'abroad' || variant === 'checkup') && (
        <div
          className="absolute top-[50%] left-[60%] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(43,108,176,0.05)_0%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content side */}
          <div>
            {eyebrow && (
              <p className="text-[1rem] font-heading font-bold uppercase tracking-[0.08em] text-[#1A4D80] mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#18212C] mb-6 text-balance">
              {title}
            </h1>
            <p className="text-[1.25rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-8 max-w-[640px]">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={primaryCta.href} className="btn-primary btn-hero">
                {primaryCta.text}
              </a>
              {secondaryCta && (
                <a href={secondaryCta.href} className="btn-outline btn-hero">
                  {secondaryCta.text}
                </a>
              )}
            </div>
            {trustLine && (
              <p className="text-[0.8125rem] text-[rgba(24,33,44,0.55)] mt-6">
                {trustLine}
              </p>
            )}
          </div>

          {/* Illustration side */}
          <div className="hidden md:flex items-center justify-center">
            {illustration}
          </div>
        </div>
      </div>
    </section>
  );
}
