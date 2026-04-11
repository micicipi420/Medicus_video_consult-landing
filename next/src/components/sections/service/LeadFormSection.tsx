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

function GreenCheckmark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <path
        d="M4 10l4 4 8-8"
        stroke="#047857"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
    <section className="py-12 lg:py-[6.25rem] bg-[#F5F7F9]" id={id}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          {/* Left column: info + trust items */}
          <div>
            <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#18212C] mb-4 leading-[1.2] tracking-[-0.02em] text-balance">
              {heading}
            </h2>
            <div className="text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed mb-8">
              {subtext}
            </div>
            <ul className="space-y-3">
              {trustItems.map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 text-[1.125rem] text-[#4A4E5C]"
                >
                  {item.icon || <GreenCheckmark />}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: form wrapper */}
          <div>
            <div className="bg-white border border-black/[0.08] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 md:p-10 max-w-[540px] md:max-w-none">
              <ContactForm />
            </div>
            {privacyText && (
              <p className="text-[0.8125rem] text-[rgba(24,33,44,0.55)] mt-4">
                {privacyText}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
