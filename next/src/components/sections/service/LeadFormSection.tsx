import type { ReactNode } from 'react';
import { ContactForm } from '@/components/sections/ContactForm';

interface TrustItem {
  icon?: ReactNode;
  text: string;
}

interface LeadFormSectionProps {
  heading: string;
  subtext: ReactNode;
  trustItems: TrustItem[];
  privacyText?: string;
  id?: string;
}

function GlassCheckmark() {
  return (
    <span className="w-6 h-6 bg-[var(--glass-button-fill)] backdrop-blur-[var(--glass-button-blur)] border border-white/60 rounded-full flex items-center justify-center flex-shrink-0 shadow-glass-inner-strong">
      <svg
        className="w-3.5 h-3.5 text-mu-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  );
}

export function LeadFormSection({
  heading,
  subtext,
  trustItems,
  privacyText,
  id = 'form',
}: LeadFormSectionProps) {
  return (
    <section className="container mx-auto mb-16 px-4 lg:px-6" id={id}>
      <div className="rounded-[3.5rem] p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          {/* Left column: info + trust items */}
          <div>
            <h2 className="mb-4 text-4xl font-extrabold leading-[1.12] text-mu-text-900 text-balance md:text-5xl">
              {heading}
            </h2>
            <div className="mb-8 text-lg font-medium leading-relaxed text-mu-text-700">
              {subtext}
            </div>
            <ul className="space-y-3">
              {trustItems.map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 text-mu-text-900 font-medium"
                >
                  {item.icon || <GlassCheckmark />}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: form wrapper */}
          <div>
            <div className="rounded-[2.5rem] border border-white/60 bg-[var(--glass-form-fill)] p-5 shadow-glass backdrop-blur-[var(--glass-form-blur)] sm:p-7 md:p-9">
              <ContactForm />
            </div>
            {privacyText && (
              <p className="text-sm text-mu-text-700 font-medium mt-4">
                {privacyText}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
