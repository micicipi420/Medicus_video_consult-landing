import { CircleHelp, Globe, Heart, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProblemCard {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: React.ReactNode;
  description: React.ReactNode;
}

const PROBLEMS: ProblemCard[] = [
  {
    icon: CircleHelp,
    iconBg: 'bg-mu-blue/10',
    iconColor: 'text-mu-accent-blue',
    title: (
      <>
        Получили диагноз{'\u00A0'}{'\u2014'} и{'\u00A0'}не{'\u00A0'}уверены,
        что он{'\u00A0'}верный
      </>
    ),
    description: (
      <>
        Разные врачи говорят разное, а{'\u00A0'}решение нужно принимать сейчас.
        Хотите услышать мнение специалиста, которому можно доверять.
      </>
    ),
  },
  {
    icon: Globe,
    iconBg: 'bg-mu-accent-teal-bg',
    iconColor: 'text-mu-accent-teal',
    title: (
      <>
        Нужно лечение, которого в{'\u00A0'}Казахстане нет
      </>
    ),
    description: (
      <>
        Вам сказали {'\u00AB'}нужно ехать за{'\u00A0'}границу{'\u00BB'},
        но{'\u00A0'}куда именно, к{'\u00A0'}кому и{'\u00A0'}как это
        организовать{'\u00A0'}{'\u2014'} непонятно. Проверенной информации мало.
      </>
    ),
  },
  {
    icon: Heart,
    iconBg: 'bg-mu-green-50',
    iconColor: 'text-mu-green-600',
    title: (
      <>
        Чувствуете себя нормально{'\u00A0'}{'\u2014'} но{'\u00A0'}давно
        не{'\u00A0'}проверялись
      </>
    ),
    description: (
      <>
        Серьёзные заболевания на{'\u00A0'}ранних стадиях не{'\u00A0'}болят.
        Хотите знать точно, что всё в{'\u00A0'}порядке, а{'\u00A0'}не{'\u00A0'}
        надеяться на{'\u00A0'}{'\u00AB'}авось{'\u00BB'}.
      </>
    ),
  },
  {
    icon: Users,
    iconBg: 'bg-mu-accent-orange-bg',
    iconColor: 'text-mu-accent-orange',
    title: (
      <>
        Организуете лечение или обследование для близкого
      </>
    ),
    description: (
      <>
        На{'\u00A0'}вас ответственность за{'\u00A0'}выбор врача и{'\u00A0'}
        клиники. Вы{'\u00A0'}не{'\u00A0'}медик, но{'\u00A0'}решение должно быть
        правильным. И{'\u00A0'}времени на{'\u00A0'}ошибки нет.
      </>
    ),
  },
];

export function ProblemSection() {
  return (
    <section className="py-16 relative z-10" id="problem">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-mu-text-900 mb-4">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Узнаёте свою ситуацию?
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PROBLEMS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="group cursor-pointer flex flex-col h-full">
                <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-glass border border-glass-border hover:border-glass-border-strong hover:shadow-glass-lg transition-all duration-500 h-full flex flex-col overflow-hidden p-3">
                  <div className="p-8 pt-8 flex flex-col flex-grow relative">
                    <div
                      className={`w-14 h-14 ${card.iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-glass-sm border border-glass-border mb-6 ${card.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-mu-text-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-mu-text-700 font-medium leading-relaxed mb-6 flex-grow">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
