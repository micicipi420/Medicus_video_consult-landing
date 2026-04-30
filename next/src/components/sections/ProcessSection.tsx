import {
  FileSearch,
  Plane,
  HeartPulse,
  ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ProcessStep = {
  number: string;
  title: string;
  description: React.ReactNode;
  Icon: LucideIcon;
  gradient: string;
  shadow: string;
};

const STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Разбор вашего случая',
    description: (
      <>
        Вы&nbsp;присылаете документы&nbsp;— мы&nbsp;анализируем историю болезни
        и&nbsp;подбираем оптимальный путь: онлайн-консультацию, чек-ап
        или лечение в&nbsp;профильной клинике.
      </>
    ),
    Icon: FileSearch,
    gradient: 'bg-gradient-to-br from-mu-blue to-mu-accent-blue',
    shadow: 'shadow-mu-blue/25',
  },
  {
    number: '02',
    title: 'Подготовка',
    description: (
      <>
        Переводим документы, записываем к&nbsp;врачу, при необходимости
        организуем визу, билеты, проживание и&nbsp;трансферы. Полный план
        до&nbsp;оплаты.
      </>
    ),
    Icon: Plane,
    gradient: 'bg-gradient-to-br from-mu-accent-teal to-mu-green-600',
    shadow: 'shadow-mu-green-600/25',
  },
  {
    number: '03',
    title: 'Консультация или лечение',
    description: (
      <>
        Онлайн-встреча с&nbsp;переводчиком&nbsp;— или приём в&nbsp;клинике
        с&nbsp;личным сопровождающим. На&nbsp;каждом этапе&nbsp;— координатор
        MedicusUnion.
      </>
    ),
    Icon: HeartPulse,
    gradient: 'bg-gradient-to-br from-mu-accent-orange to-mu-accent-red',
    shadow: 'shadow-mu-accent-orange/25',
  },
  {
    number: '04',
    title: 'После лечения',
    description: (
      <>
        Письменное заключение врача с&nbsp;переводом. Координация наблюдения
        с&nbsp;врачами в&nbsp;Казахстане. Контрольные онлайн-консультации
        при&nbsp;необходимости.
      </>
    ),
    Icon: ClipboardList,
    gradient: 'bg-gradient-to-br from-mu-green-500 to-mu-green-600',
    shadow: 'shadow-mu-green-600/25',
  },
] as const;

export function ProcessSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20" id="process">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section title */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              От&nbsp;обращения до&nbsp;результата&nbsp;— 4&nbsp;шага
            </span>
          </h2>
          <p className="text-base font-medium leading-relaxed text-mu-text-700 sm:text-lg">
            Вы&nbsp;занимаетесь здоровьем&nbsp;— мы&nbsp;берём на&nbsp;себя всё
            остальное.
          </p>
        </div>

        {/* Steps with dotted connector */}
        <div className="relative mx-auto max-w-6xl">
          {/* Desktop horizontal dotted connector — sits behind the cards (md:768px+) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] right-[12%] top-[64px] hidden h-0 border-t-2 border-dotted border-mu-text-700/25 md:block"
          />
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {STEPS.map((step) => {
              const { Icon } = step;
              return (
                <div
                  key={step.number}
                  className="group relative flex h-full flex-col rounded-[2rem] border border-glass-border bg-[var(--glass-card-fill)] p-6 shadow-glass backdrop-blur-[var(--glass-card-blur)] transition-[background-color,border-color,box-shadow] duration-300 hover:border-glass-border-strong hover:bg-[var(--glass-form-fill)] hover:shadow-glass-lg sm:p-7"
                >
                  {/* Number + icon row */}
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${step.gradient} ${step.shadow} text-xl font-extrabold tracking-tight`}
                    >
                      {step.number}
                    </div>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border bg-[var(--glass-button-fill)] text-mu-text-700 backdrop-blur-[var(--glass-button-blur)]"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-lg font-bold tracking-tight text-mu-text-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-mu-text-700 sm:text-base">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
