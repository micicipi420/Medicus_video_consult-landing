import { motion } from 'motion/react';
import { Globe2, CheckCircle2, ArrowRight, Plane, Building2, Users, HeartPulse, FileCheck, Languages } from 'lucide-react';
import { useNavigate } from 'react-router';

const countries = [
  { name: 'Германия', clinics: 8, flag: '🇩🇪' },
  { name: 'Австрия', clinics: 4, flag: '🇦🇹' },
  { name: 'Швейцария', clinics: 3, flag: '🇨🇭' },
  { name: 'Израиль', clinics: 6, flag: '🇮🇱' },
  { name: 'ОАЭ', clinics: 4, flag: '🇦🇪' },
  { name: 'Южная Корея', clinics: 5, flag: '🇰🇷' },
  { name: 'Турция', clinics: 7, flag: '🇹🇷' },
  { name: 'Индия', clinics: 6, flag: '🇮🇳' },
];

const included = [
  { icon: <Building2 className="w-6 h-6" />, title: 'Подбор клиники', desc: 'Анализ диагноза, подбор 2–3 клиник, сравнение цен и результатов' },
  { icon: <Plane className="w-6 h-6" />, title: 'Визовая поддержка', desc: 'Медицинское приглашение, помощь с документами, бронирование' },
  { icon: <Users className="w-6 h-6" />, title: 'Сопровождение', desc: 'Личный координатор в стране лечения, переводчик, трансфер' },
  { icon: <HeartPulse className="w-6 h-6" />, title: 'Лечение', desc: 'Организация приёмов, операций, реабилитации — полная координация' },
  { icon: <FileCheck className="w-6 h-6" />, title: 'Документация', desc: 'Перевод, заверение, хранение всех медицинских документов' },
  { icon: <Languages className="w-6 h-6" />, title: 'Переводчик', desc: 'Профессиональный медицинский переводчик на всех этапах' },
];

const steps = [
  { num: '01', title: 'Консультация', desc: 'Расскажите о вашей ситуации. Мы изучим документы и определим оптимальное направление.' },
  { num: '02', title: 'Подбор клиники', desc: 'Предложим 2–3 клиники с ценами, сроками и прогнозами. Вы выбираете.' },
  { num: '03', title: 'Организация', desc: 'Виза, перелёт, трансфер, проживание, переводчик — всё берём на себя.' },
  { num: '04', title: 'Лечение', desc: 'Координируем весь процесс, на связи 24/7. После — помощь с реабилитацией.' },
];

export function TreatmentAbroadPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-16">
      {/* Hero */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-sm shadow-glass-inner mb-6">
              <Globe2 className="w-4 h-4 text-mu-blue" />
              <span className="text-sm font-bold text-mu-blue uppercase tracking-wider">100+ клиник</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
              <span className="text-mu-text-900">Лечение </span>
              <br />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                за рубежом
              </span>
            </h1>
            <p className="text-xl text-mu-text-700 font-medium leading-relaxed mb-8 max-w-xl">
              Организуем лечение под ключ: от подбора клиники до реабилитации. Визовая поддержка, перелёт, проживание, переводчик, сопровождение на каждом этапе.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-lg shadow-mu-blue/30 hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center justify-center gap-2 group text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contacts')}
              >
                Получить план лечения
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white/40 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1720180244462-648c13ee01e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMHJvb20lMjBwYXRpZW50fGVufDF8fHx8MTc3NTE5NjI1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern hospital"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Countries */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Страны и клиники
          </span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countries.map((c, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-glass text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-4xl mb-3">{c.flag}</div>
              <h3 className="text-lg font-extrabold text-mu-text-900 mb-1">{c.name}</h3>
              <p className="text-sm text-mu-blue font-bold">{c.clinics} клиник</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-mu-text-900">Что </span>
          <span className="bg-gradient-to-r from-mu-blue to-mu-green-600 bg-clip-text text-transparent">включено</span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {included.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
                {item.icon}
              </div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">{item.title}</h3>
              <p className="text-mu-text-700 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Как это работает
          </span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-6xl font-extrabold text-mu-blue/15 mb-4">{s.num}</div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">{s.title}</h3>
              <p className="text-mu-text-700 font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-6">
        <motion.div
          className="bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-12 lg:p-20 text-center border border-white/60 shadow-glass-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-mu-green-300/20 rounded-full blur-[100px] -z-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-6">
            Начните с бесплатной консультации
          </h2>
          <p className="text-xl text-mu-text-700 font-medium mb-10 max-w-2xl mx-auto">
            Расскажите о вашей ситуации — мы предложим оптимальный план лечения с ценами и сроками.
          </p>
          <motion.button
            className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-10 py-5 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 text-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contacts')}
          >
            Оставить заявку
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}