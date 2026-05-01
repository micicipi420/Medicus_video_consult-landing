interface SocialProofItem {
  number: string;
  label: string;
}

interface SocialProofProps {
  items: SocialProofItem[];
}

export function SocialProof({ items }: SocialProofProps) {
  const gridCols = items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <section className="container mx-auto px-4 lg:px-6 mb-16" aria-label="Ключевые цифры">
      <div className={`grid grid-cols-2 ${gridCols} gap-6`}>
        {items.map((item) => (
          <div
            key={item.label}
            className="relative group flex flex-col items-center justify-center p-8 bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] rounded-[2.5rem] border border-white/60 shadow-glass hover:shadow-glass-lg hover:bg-[var(--glass-form-fill)] transition-all duration-500 overflow-hidden"
          >
            <div className="text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-sm text-mu-accent-blue relative z-10">
              {item.number}
            </div>
            <div className="text-mu-text-700 font-bold text-lg text-center uppercase tracking-wider relative z-10">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
