import Image from 'next/image';

export function CoordinatorCard() {
  return (
    <div className="flex items-start gap-4 mb-8">
      <Image
        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80"
        alt="Айгерим -- медицинский координатор"
        width={64}
        height={64}
        className="rounded-full object-cover shrink-0"
      />
      <div>
        <p className="font-heading text-lg font-bold text-mu-text-900">Айгерим</p>
        <p className="text-sm text-mu-blue font-semibold">Старший медицинский координатор</p>
        <p className="text-sm text-mu-text-500 mt-1">
          Выслушаю вашу ситуацию и{'\u00A0'}помогу выбрать оптимальное решение. Бесплатно и{'\u00A0'}без обязательств.
        </p>
      </div>
    </div>
  );
}
