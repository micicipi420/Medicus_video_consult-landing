import { CheckCircle2 } from 'lucide-react';

export function PlatformSection() {
  return (
    <section className="py-16 relative z-10" id="platform">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
              Ваши документы, снимки и{'\u00A0'}связь с{'\u00A0'}врачом{'\u00A0'}{'\u2014'} в{'\u00A0'}одном месте
            </span>
          </h2>
        </div>

        <div className="bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] rounded-[3rem] p-8 md:p-12 border border-glass-border shadow-glass max-w-3xl mx-auto">
          <p className="text-mu-text-700 font-medium text-lg leading-relaxed mb-8">
            У{'\u00A0'}MedicusUnion есть то, чего нет ни{'\u00A0'}у{'\u00A0'}одного медицинского агентства{'\u00A0'}{'\u2014'} собственная цифровая платформа. Это защищённый личный кабинет, где вы{'\u00A0'}видите:
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-mu-text-900 font-medium">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-mu-green-600" aria-hidden="true" />
              Результаты анализов и{'\u00A0'}заключения врачей{'\u00A0'}{'\u2014'} с{'\u00A0'}переводом на{'\u00A0'}русский язык
            </li>
            <li className="flex items-start gap-3 text-mu-text-900 font-medium">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-mu-green-600" aria-hidden="true" />
              Медицинские снимки через встроенный DICOM-вьювер
            </li>
            <li className="flex items-start gap-3 text-mu-text-900 font-medium">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-mu-green-600" aria-hidden="true" />
              Историю переписки с{'\u00A0'}координатором и{'\u00A0'}врачом
            </li>
            <li className="flex items-start gap-3 text-mu-text-900 font-medium">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-mu-green-600" aria-hidden="true" />
              План лечения и{'\u00A0'}все документы
            </li>
            <li className="flex items-start gap-3 text-mu-text-900 font-medium">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-mu-green-600" aria-hidden="true" />
              ИИ-анализ лабораторных исследований
            </li>
          </ul>
          <p className="text-mu-text-700 font-medium text-lg leading-relaxed mb-4">
            Доступно через браузер и{'\u00A0'}мобильное приложение (iOS и{'\u00A0'}Android).
          </p>
          <p className="text-mu-text-900 font-bold">
            Данные защищены по{'\u00A0'}стандартам ISO{'\u00A0'}27001 и{'\u00A0'}GDPR.
          </p>
        </div>
      </div>
    </section>
  );
}
