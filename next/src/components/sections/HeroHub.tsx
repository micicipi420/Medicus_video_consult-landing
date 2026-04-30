import Image from 'next/image';
import { Sparkles, ArrowRight, Mic, Video, Globe } from 'lucide-react';

export function HeroHub() {
  return (
    <section
      className="relative flex min-h-[calc(100svh-1rem)] items-start justify-center pt-20 pb-10 sm:pt-24 lg:min-h-[calc(100svh-5rem)] lg:items-center lg:pt-32 lg:pb-14"
      id="hero"
    >
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <div className="w-full min-w-0 max-w-[calc(100vw-2rem)] lg:max-w-2xl">
            {/* Glass pill badge */}
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-glass-border bg-[var(--glass-section-fill)] px-4 py-2.5 shadow-glass-sm backdrop-blur-[var(--glass-section-blur)] sm:px-5">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-mu-blue" />
              <span className="text-xs font-semibold leading-snug text-mu-text-900 sm:text-sm">
                Австрийская медицинская компания с&nbsp;офисом в&nbsp;Казахстане
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-5 max-w-full break-words text-[2.25rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl">
              <span className="text-mu-text-900 drop-shadow-sm">
                Европейские врачи, мировые клиники&nbsp;&mdash;{' '}
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                доступны из&nbsp;Казахстана
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-7 max-w-full text-lg font-medium leading-relaxed text-mu-text-700 sm:max-w-xl sm:text-xl lg:mb-8">
              MedicusUnion&nbsp;&mdash; международная медицинская платформа.
              Онлайн-консультация с&nbsp;зарубежным врачом, чек-ап
              в&nbsp;ведущей клинике или полная организация лечения
              за&nbsp;границей&nbsp;&mdash; мы&nbsp;берём на&nbsp;себя всё,
              от&nbsp;разбора вашего случая до&nbsp;наблюдения после
              возвращения.
            </p>

            {/* CTA Buttons */}
            <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:mb-10">
              {/* Primary CTA - gradient */}
              <a
                href="#contact"
                className="group flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-mu-blue to-mu-accent-blue px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-mu-blue/30 transition-[transform,box-shadow,filter] duration-200 hover:shadow-xl hover:shadow-mu-blue/40 active:scale-[0.98] sm:w-auto"
              >
                Обсудить мой случай
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              {/* Secondary CTA - glass */}
              <a
                href="#services"
                className="w-full rounded-3xl border border-glass-border bg-[var(--glass-section-fill)] px-8 py-4 text-center text-lg font-semibold text-mu-text-900 shadow-glass backdrop-blur-[var(--glass-section-blur)] transition-[background-color,border-color,box-shadow] duration-200 hover:bg-[var(--glass-card-fill)] sm:w-auto"
              >
                Узнать больше
              </a>
            </div>

            {/* Trust indicator line */}
            <p className="max-w-2xl text-sm font-semibold leading-relaxed text-mu-text-700 sm:text-base">
              MedicusUnion GmbH, Австрия&nbsp;&middot;&nbsp;ТОО
              в&nbsp;Казахстане&nbsp;&middot;&nbsp;ISO&nbsp;27001&nbsp;&middot;&nbsp;43&nbsp;клиники&nbsp;&middot;&nbsp;11&nbsp;стран&nbsp;&middot;&nbsp;15+&nbsp;лет
              опыта
            </p>
          </div>

          {/* Right Content - Video-call frame */}
          <div className="relative mt-2 w-full lg:mt-0">
            {/* Video-call window */}
            <div
              className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-mu-text-900/85 bg-mu-text-900 shadow-glass-lg sm:border-[8px] sm:rounded-[3rem]"
              role="img"
              aria-label="Видеоконсультация с европейским врачом MedicusUnion"
            >
              {/* Doctor photo (the "video feed") */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src="/hero-doctor.webp"
                  alt="Врач на платформе MedicusUnion"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Subtle bottom gradient for legibility under chrome */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-mu-text-900/55 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-mu-text-900/30 to-transparent" />
              </div>

              {/* Top-left: doctor name pill */}
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-mu-text-900/55 px-3 py-1.5 backdrop-blur-md sm:left-4 sm:top-4 sm:px-4 sm:py-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-mu-green-500 shadow-[0_0_0_3px_rgba(53,182,120,0.25)]" />
                <span className="text-xs font-semibold tracking-tight text-white sm:text-sm">
                  {/* TODO(content): replace with real on-team doctor name when available */}
                  Dr. Stefan&nbsp;Mayr&nbsp;&middot;&nbsp;Vienna
                </span>
              </div>

              {/* Top-right: live indicator */}
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-mu-text-900/55 px-2.5 py-1.5 backdrop-blur-md sm:right-4 sm:top-4 sm:px-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs">
                  В&nbsp;эфире
                </span>
              </div>

              {/* Bottom-center: video-call control row */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center sm:bottom-6">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-mu-text-900/55 px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    <Mic className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </div>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    <Video className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </div>
                  <div
                    className="flex h-9 items-center rounded-full bg-red-500/95 px-3 text-xs font-bold uppercase tracking-wider text-white sm:h-10 sm:px-4 sm:text-sm"
                    aria-hidden="true"
                  >
                    HD
                  </div>
                </div>
              </div>
            </div>

            {/* Floating credibility badge — single, repositioned to avoid chrome */}
            <div className="absolute -right-3 -top-3 z-10 flex items-center gap-3 rounded-3xl border border-glass-border-strong bg-[var(--glass-card-fill)] p-3 shadow-glass backdrop-blur-[var(--glass-card-blur)] sm:-right-6 sm:-top-6 sm:gap-4 sm:rounded-[2rem] sm:p-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mu-green-500 to-mu-green-600 text-white shadow-inner sm:h-14 sm:w-14">
                <Globe className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>
              <div className="pr-1 sm:pr-2">
                <div className="text-xl font-bold leading-none tracking-tight text-mu-text-900 sm:text-2xl">
                  43
                </div>
                <div className="text-[11px] font-semibold leading-tight text-mu-text-700 sm:text-sm">
                  Клиники в&nbsp;11&nbsp;странах
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
