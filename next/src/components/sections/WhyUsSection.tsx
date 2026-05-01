import Image from 'next/image';
import { Smartphone, Globe, Award, ShieldCheck } from 'lucide-react';

export function WhyUsSection() {
  return (
    <section className="py-16 relative z-10" id="why-us">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-[var(--glass-section-fill)] backdrop-blur-[var(--glass-section-blur)] border border-glass-border px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
                <span className="text-sm font-bold text-mu-green-600 uppercase tracking-wider">О компании</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-mu-text-900 drop-shadow-sm">
                Чем мы{'\u00A0'}<span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">отличаемся</span>
              </h2>
              <p className="text-mu-text-700 font-medium text-xl">
                Мы{'\u00A0'}{'\u2014'} не{'\u00A0'}просто медицинский агрегатор. Мы{'\u00A0'}берем на{'\u00A0'}себя ответственность за{'\u00A0'}ваше здоровье на{'\u00A0'}каждом этапе лечения.
              </p>
            </div>

            <div className="space-y-12">
              {/* Advantage 1: Platform */}
              <div className="relative flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mu-blue/10 backdrop-blur-[var(--glass-button-blur)] rounded-[1.5rem] flex items-center justify-center shadow-glass-sm border border-glass-border text-mu-accent-blue transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Smartphone size={32} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-extrabold text-mu-text-900 mb-2 leading-snug drop-shadow-sm group-hover:text-mu-blue transition-colors">
                    Не{'\u00A0'}агентство{'\u00A0'}{'\u2014'} медицинская платформа
                  </h3>
                  <p className="text-mu-text-700 font-medium leading-relaxed text-sm md:text-base">
                    Личный кабинет с{'\u00A0'}результатами, снимками (DICOM-вьювер), заключениями врачей и{'\u00A0'}историей обследований. Не{'\u00A0'}чат в{'\u00A0'}мессенджере, а{'\u00A0'}защищённая система, доступная с{'\u00A0'}любого устройства.
                  </p>
                </div>
              </div>

              {/* Advantage 2: 43 clinics */}
              <div className="relative flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mu-accent-teal-bg backdrop-blur-[var(--glass-button-blur)] rounded-[1.5rem] flex items-center justify-center shadow-glass-sm border border-glass-border text-mu-accent-teal transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Globe size={32} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-extrabold text-mu-text-900 mb-2 leading-snug drop-shadow-sm group-hover:text-mu-blue transition-colors">
                    <span className="text-mu-accent-teal">43</span> клиники в <span className="text-mu-accent-teal">11</span> странах
                  </h3>
                  <p className="text-mu-text-700 font-medium leading-relaxed text-sm md:text-base">
                    Германия, Австрия, Швейцария, Израиль, Южная Корея, Турция, ОАЭ, Индия и{'\u00A0'}другие. Подбираем клинику и{'\u00A0'}врача под ваш случай{'\u00A0'}{'\u2014'} объективно, а{'\u00A0'}не{'\u00A0'}{'\u00AB'}по{'\u00A0'}договорённости{'\u00BB'}.
                  </p>
                </div>
              </div>

              {/* Advantage 3: Legal */}
              <div className="relative flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mu-accent-orange-bg backdrop-blur-[var(--glass-button-blur)] rounded-[1.5rem] flex items-center justify-center shadow-glass-sm border border-glass-border text-mu-accent-orange transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Award size={32} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-extrabold text-mu-text-900 mb-2 leading-snug drop-shadow-sm group-hover:text-mu-blue transition-colors">
                    <span className="text-mu-accent-orange">15+</span> лет, <span className="text-mu-accent-orange">10{'\u00A0'}000+</span> пациентов
                  </h3>
                  <p className="text-mu-text-700 font-medium leading-relaxed text-sm md:text-base">
                    MedicusUnion GmbH{'\u00A0'}{'\u2014'} зарегистрирована в{'\u00A0'}Австрии. ТОО {'\u00AB'}MedicusUnion KZ{'\u00BB'}{'\u00A0'}{'\u2014'} офис в{'\u00A0'}Казахстане, резидент Astana Hub. Договор, чеки, прозрачные условия. Не{'\u00A0'}перевод на{'\u00A0'}карту физлицу.
                  </p>
                </div>
              </div>

              {/* Advantage 4: Data protection */}
              <div className="relative flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-mu-green-50 backdrop-blur-[var(--glass-button-blur)] rounded-[1.5rem] flex items-center justify-center shadow-glass-sm border border-glass-border text-mu-green-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <ShieldCheck size={32} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-extrabold text-mu-text-900 mb-2 leading-snug drop-shadow-sm group-hover:text-mu-blue transition-colors">
                    Абсолютная надёжность
                  </h3>
                  <p className="text-mu-text-700 font-medium leading-relaxed text-sm md:text-base">
                    Сертификация ISO{'\u00A0'}27001, соответствие GDPR. Медицинские данные зашифрованы и{'\u00A0'}хранятся на{'\u00A0'}серверах в{'\u00A0'}Европе. Непрерывность: чек-ап выявил проблему{'\u00A0'}{'\u2014'} организуем лечение. Всё в{'\u00A0'}рамках одной платформы.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images Collage */}
          <div className="relative h-[600px] hidden md:block">
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="space-y-6 pt-12">
                <div className="h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-[var(--glass-section-blur)] bg-[var(--glass-section-fill)]">
                  <Image src="/whyus-team.webp" alt="Медицинская команда" width={1080} height={720} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-80 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-[var(--glass-section-blur)] bg-[var(--glass-section-fill)]">
                  <Image src="/whyus-patient.webp" alt="Врач и пациент" width={1080} height={720} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-80 rounded-[3rem] overflow-hidden shadow-glass-lg border-[6px] border-white/50 backdrop-blur-[var(--glass-section-blur)] bg-[var(--glass-section-fill)]">
                  <Image src="/whyus-doctor.webp" alt="Медицинский специалист" width={1080} height={720} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-64 rounded-[3rem] overflow-hidden shadow-glass-lg border border-white/60 bg-[var(--glass-card-fill)] backdrop-blur-[var(--glass-card-blur)] p-8 flex flex-col justify-center shadow-glass-inner">
                  <ShieldCheck size={48} className="mb-4 text-mu-blue drop-shadow-sm" />
                  <div className="text-4xl font-extrabold mb-2 text-mu-text-900">100%</div>
                  <div className="text-mu-text-700 font-bold leading-tight">Конфиденциальность медицинских данных</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
