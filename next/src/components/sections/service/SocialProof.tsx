interface SocialProofItem {
  number: string;
  label: string;
}

interface SocialProofProps {
  items: SocialProofItem[];
}

export function SocialProof({ items }: SocialProofProps) {
  return (
    <section className="bg-[#1A365D] py-8" aria-label="Ключевые цифры">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <span className="font-heading text-[2.5rem] font-bold leading-none text-white tabular-nums">
              {item.number}
            </span>
            <span className="text-[1.125rem] text-white/85 block mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
