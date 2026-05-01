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
    <section className="container mx-auto px-4 lg:px-6 mb-16" id={id}>
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
          {heading}
        </span>
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndices.has(index);
          return (
            <div
              key={index}
              className="bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2rem] border border-white/60 shadow-glass overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between p-6 text-left text-lg font-extrabold text-mu-text-900 cursor-pointer hover:bg-[var(--glass-form-fill)] transition-colors"
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
                <div className="px-6 pb-6 text-mu-text-700 font-medium leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
