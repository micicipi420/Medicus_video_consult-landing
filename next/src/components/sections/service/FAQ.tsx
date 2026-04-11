'use client';

import { useState, type ReactNode } from 'react';

interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  heading?: string;
  items: FAQItem[];
  id?: string;
}

export function FAQ({ heading = 'Частые вопросы', items, id }: FAQProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section className="py-12 lg:py-[6.25rem] bg-white" id={id}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-center text-[#18212C] mb-10 leading-[1.2] tracking-[-0.02em] text-balance">
          {heading}
        </h2>
        <div className="max-w-[800px] mx-auto space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndices.has(index);
            return (
              <div
                key={index}
                className="border border-black/[0.06] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-6 text-left font-heading text-[1.125rem] font-bold text-[#18212C] cursor-pointer hover:bg-black/[0.02] transition-colors"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                >
                  <span>{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    width="24"
                    height="24"
                    aria-hidden="true"
                    className={`shrink-0 ml-4 motion-safe:transition-transform motion-safe:duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-[1.125rem] text-[rgba(24,33,44,0.55)] leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
