import Image from 'next/image';
import { Sparkles, ArrowRight, Globe, ShieldCheck } from 'lucide-react';

export function HeroHub() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-32 pb-16 lg:pt-40"
      id="hero"
    >
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Glass pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-[20px] border border-glass-border px-5 py-2.5 rounded-full shadow-glass-sm mb-6">
              <Sparkles className="w-4 h-4 text-mu-blue" />
              <span className="text-sm font-semibold text-mu-text-900">
                Австрийская медицинская компания с&nbsp;офисом в&nbsp;Казахстане
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              <span className="text-mu-text-900 drop-shadow-sm">
                Европейские врачи, мировые клиники&nbsp;&mdash;{' '}
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                доступны из&nbsp;Казахстана
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-mu-text-700 mb-10 max-w-xl leading-relaxed font-medium">
              MedicusUnion&nbsp;&mdash; международная медицинская платформа.
              Онлайн-консультация с&nbsp;зарубежным врачом, чек-ап
              в&nbsp;ведущей клинике или полная организация лечения
              за&nbsp;границей&nbsp;&mdash; мы&nbsp;берём на&nbsp;себя всё,
              от&nbsp;разбора вашего случая до&nbsp;наблюдения после
              возвращения.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              {/* Primary CTA - gradient */}
              <a
                href="#contact"
                className="w-full sm:w-auto bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-lg shadow-mu-blue/30 hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
              >
                Обсудить мой случай
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              {/* Secondary CTA - glass */}
              <a
                href="#services"
                className="w-full sm:w-auto bg-white/50 backdrop-blur-[20px] text-mu-text-900 px-8 py-4 rounded-3xl font-semibold shadow-glass hover:bg-white/60 transition-all border border-glass-border text-lg"
              >
                Узнать больше
              </a>
            </div>

            {/* Trust indicator line */}
            <p className="text-base text-mu-text-700 font-semibold leading-relaxed">
              MedicusUnion GmbH, Австрия&nbsp;&middot;&nbsp;ТОО
              в&nbsp;Казахстане&nbsp;&middot;&nbsp;ISO&nbsp;27001&nbsp;&middot;&nbsp;43&nbsp;клиники&nbsp;&middot;&nbsp;11&nbsp;стран&nbsp;&middot;&nbsp;15+&nbsp;лет
              опыта
            </p>
          </div>

          {/* Right Content - Photo Composition */}
          <div className="relative lg:h-[600px] w-full mt-10 lg:mt-0">
            {/* Main image */}
            <div className="absolute right-0 top-0 w-[85%] h-[85%] rounded-[3rem] overflow-hidden shadow-glass-lg border-[8px] border-white/40 backdrop-blur-3xl z-10 bg-white/20">
              <Image
                src="/hero-doctor.webp"
                alt="Врач на платформе MedicusUnion"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Secondary overlapping image */}
            <div className="absolute left-0 bottom-4 w-3/5 h-[45%] rounded-[2.5rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-2xl z-20 bg-white/30">
              <Image
                src="/hero-consultation.webp"
                alt="Консультация с пациентом"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 30vw"
                priority
              />
            </div>

            {/* Floating badge - 43 clinics */}
            <div className="absolute -right-6 top-1/4 bg-white/70 backdrop-blur-[40px] p-4 rounded-[2rem] shadow-glass border border-glass-border-strong z-30 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-mu-green-500 to-mu-green-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <Globe className="w-7 h-7" />
              </div>
              <div className="pr-2">
                <div className="text-2xl font-bold text-mu-text-900 tracking-tight">
                  43
                </div>
                <div className="text-sm text-mu-text-700 font-semibold">
                  Клиники в 11 странах
                </div>
              </div>
            </div>

            {/* Floating badge - 15+ years */}
            <div className="absolute left-8 top-12 bg-white/70 backdrop-blur-[40px] px-6 py-4 rounded-[2rem] shadow-glass border border-glass-border-strong z-30 flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-mu-blue to-mu-accent-blue rounded-2xl flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="font-extrabold text-mu-text-900 text-lg">
                  15+ лет
                </div>
                <div className="text-sm text-mu-text-700 font-semibold">
                  Опыта работы
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
