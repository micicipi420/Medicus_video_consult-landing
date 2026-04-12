import Image from 'next/image';
import Link from 'next/link';
import { Video, Globe, ClipboardCheck, ArrowRight } from 'lucide-react';

interface ServiceCardData {
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  href: string;
}

const SERVICES: ServiceCardData[] = [
  {
    image: '/service-consultation.webp',
    imageAlt: 'Онлайн-консультация с врачом',
    icon: <Video className="w-6 h-6" />,
    iconBg: 'bg-mu-blue/10',
    iconColor: 'text-mu-accent-blue',
    badge: 'от 450\u00A0\u20AC',
    badgeColor: 'text-mu-accent-blue',
    title: 'Мнение зарубежного врача\u00A0\u2014 без\u00A0перелёта',
    description:
      'Загрузите медицинские документы\u00A0\u2014 мы\u00A0переведём их и\u00A0организуем видеоконсультацию с\u00A0профильным специалистом из\u00A0Германии, Израиля, Швейцарии или другой страны. Врач изучит ваш случай до\u00A0встречи. После\u00A0\u2014 письменное заключение в\u00A0личном кабинете.',
    features: [
      'Перевод документов и консультации',
      'Результат за 5 дней',
      'Письменное заключение',
    ],
    ctaText: 'Записаться на\u00A0консультацию',
    href: '/consultations',
  },
  {
    image: '/service-treatment.webp',
    imageAlt: 'Современная клиника',
    icon: <Globe className="w-6 h-6" />,
    iconBg: 'bg-mu-accent-teal-bg',
    iconColor: 'text-mu-accent-teal',
    badge: 'план лечения бесплатно',
    badgeColor: 'text-mu-accent-teal',
    title: 'Организуем лечение за\u00A0границей\u00A0\u2014 под\u00A0ключ',
    description:
      'Подберём клинику и\u00A0врача под ваш диагноз из\u00A0сети в\u00A011\u00A0странах. Организуем онлайн-консультацию до\u00A0вылета, возьмём на\u00A0себя визу, логистику, переводчика и\u00A0сопровождение. После возвращения\u00A0\u2014 наблюдение и\u00A0связь с\u00A0врачом.',
    features: [
      '11 стран, 43 клиники-партнёра',
      'Полная организация',
      'Координация до выздоровления',
    ],
    ctaText: 'Получить план лечения',
    href: '/treatment-abroad',
  },
  {
    image: '/service-checkup.webp',
    imageAlt: 'Чек-ап обследование',
    icon: <ClipboardCheck className="w-6 h-6" />,
    iconBg: 'bg-mu-green-50',
    iconColor: 'text-mu-green-600',
    badge: 'от $350',
    badgeColor: 'text-mu-green-700',
    title: 'Проверьте здоровье в\u00A0клинике мирового уровня',
    description:
      'Комплексное обследование за\u00A01\u20132\u00A0дня в\u00A0Samsung Medical Center, Severance Hospital или клиниках Стамбула. Полная организация: виза, трансфер, переводчик, сопровождающий. Результаты\u00A0\u2014 в\u00A0приложении с\u00A0переводом на\u00A0русский.',
    features: [
      'Южная Корея и Турция',
      'Программы от базовой до премиум',
      'Корпоративные чек-апы',
    ],
    ctaText: 'Подобрать программу',
    href: '/checkup',
  },
];

export function ServicesGrid() {
  return (
    <section className="py-16 relative z-10" id="services">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-glass-border px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
            <span className="text-sm font-bold text-mu-accent-blue uppercase tracking-wider">
              Наши Услуги
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Выберите, что вам нужно
            </span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((card) => (
            <div key={card.href} className="relative group h-full flex flex-col">
              <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 hover:-translate-y-2 h-full flex flex-col overflow-hidden">
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden p-3">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/40 shadow-inner">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Floating icon */}
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${card.iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center ${card.iconColor} shadow-glass-sm border border-glass-border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      {card.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 pt-4 flex-grow flex flex-col">
                  {/* Price badge */}
                  <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-glass-border px-4 py-1.5 rounded-full shadow-sm w-fit mb-5">
                    <span className={`text-sm font-bold ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-mu-text-900 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-mu-text-700 font-medium leading-relaxed mb-6">
                    {card.description}
                  </p>
                  {/* Feature list */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-white/60 backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glass-inner-strong">
                          <svg
                            className="w-3.5 h-3.5 text-mu-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-mu-text-900 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* CTA button */}
                  <Link
                    href={card.href}
                    className="w-full bg-white/50 backdrop-blur-xl border border-glass-border text-mu-text-900 py-4 rounded-2xl font-bold shadow-glass-sm hover:bg-white/70 hover:shadow-glass transition-all flex items-center justify-center gap-2 group/btn mt-auto"
                  >
                    {card.ctaText}
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
