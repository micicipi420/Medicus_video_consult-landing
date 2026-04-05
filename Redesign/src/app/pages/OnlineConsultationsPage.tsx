import { motion } from 'motion/react';
import { Video, CheckCircle2, ArrowRight, Clock, Globe, FileText, MessageSquare, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

const steps = [
  { num: '01', title: 'Оставьте заявку', desc: 'Опишите ситуацию и прикрепите документы. Мы подберём врача нужной специализации.', color: 'text-mu-accent-blue' },
  { num: '02', title: 'Перевод документов', desc: 'Мы переведём ваши медицинские документы на язык врача (входит в стоимость).', color: 'text-mu-green-500' },
  { num: '03', title: 'Видеоконсультация', desc: 'Врач проведёт консультацию на вашем языке через переводчика. 45–60 минут.', color: 'text-mu-accent-teal' },
  { num: '04', title: 'Письменное заключение', desc: 'В течение 3–5 дней вы получите детальное заключение с планом лечения.', color: 'text-mu-accent-orange' },
];

const specializations = [
  'Онкология', 'Кардиология', 'Ортопедия', 'Неврология',
  'Гинекология', 'Урология', 'Гастроэнтерология', 'Эндокринология',
  'Офтальмология', 'Дерматология', 'Педиатрия', 'Пульмонология',
];

const features = [
  { icon: <Clock className="w-6 h-6" />, title: 'За 5 рабочих дней', desc: 'От заявки до заключения — без перелёта и ожидания', color: 'text-mu-accent-blue', bg: 'bg-mu-blue/10' },
  { icon: <Globe className="w-6 h-6" />, title: 'Врачи из 7 стран', desc: 'Германия, Австрия, Швейцария, Израиль, ОАЭ, Корея, Турция', color: 'text-mu-accent-teal', bg: 'bg-mu-accent-teal-bg' },
  { icon: <FileText className="w-6 h-6" />, title: 'Перевод документов', desc: 'Профессиональный медицинский перевод включён в стоимость', color: 'text-mu-green-600', bg: 'bg-mu-green-50' },
  { icon: <MessageSquare className="w-6 h-6" />, title: 'На вашем языке', desc: 'Консультация с переводчиком — русский, казахский, английский', color: 'text-mu-accent-orange', bg: 'bg-mu-accent-orange-bg' },
  { icon: <Shield className="w-6 h-6" />, title: 'ISO 27001', desc: 'Полная конфиденциальность медицинских данных', color: 'text-mu-accent-red', bg: 'bg-mu-accent-red-bg' },
  { icon: <Star className="w-6 h-6" />, title: 'Второе мнение', desc: 'Независимая оценка вашего диагноза и плана лечения', color: 'text-mu-blue', bg: 'bg-mu-blue/10' },
];

export function OnlineConsultationsPage() {
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
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-full shadow-glass-inner mb-6">
              <Video className="w-4 h-4 text-mu-accent-red" />
              <span className="text-sm font-bold text-mu-text-900 uppercase tracking-wider">от 450 EUR</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
              <span className="text-mu-text-900">Онлайн-</span>
              <br />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                консультации
              </span>
            </h1>
            <p className="text-xl text-mu-text-700 font-medium leading-relaxed mb-8 max-w-xl">
              Видеоконсультация с европейским специалистом на вашем языке. Второе мнение по диагнозу, план лечения, письменное заключение. За 5 дней, без перелёта.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] hover:shadow-[0_20px_40px_color-mix(in_oklch,var(--color-mu-blue)_40%,transparent)] transition-all flex items-center justify-center gap-2 group text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contacts')}
              >
                Записаться на консультацию
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
            <div className="rounded-[3rem] overflow-hidden shadow-glass-lg border-[8px] border-white/40 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1758691463620-188ca7c1a04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB2aWRlbyUyMGNhbGwlMjB0ZWxlbWVkaWNpbmUlMjBsYXB0b3B8ZW58MXx8fHwxNzc1MjM4Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Doctor video consultation"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass group hover:border-white/80 hover:shadow-glass-lg transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={`w-14 h-14 ${f.bg} backdrop-blur-xl rounded-2xl flex items-center justify-center ${f.color} shadow-glass-sm border border-white/60 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">{f.title}</h3>
              <p className="text-mu-text-700 font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-teal to-mu-green-600 bg-clip-text text-transparent">
            Как это работает
          </span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass relative group hover:bg-white/80 hover:border-white/80 hover:shadow-glass-lg transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className={`text-6xl font-extrabold ${s.color} opacity-20 mb-4 group-hover:opacity-40 group-hover:-translate-y-2 group-hover:scale-105 origin-left transition-all duration-500`}>{s.num}</div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-3">{s.title}</h3>
              <p className="text-mu-text-700 font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.div
          className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/60 shadow-glass-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-mu-text-900 mb-8 text-center">Доступные специализации</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {specializations.map((s, i) => (
              <motion.div
                key={i}
                className="bg-white/50 backdrop-blur-md border border-white/60 px-6 py-3 rounded-full font-bold text-mu-text-900 shadow-glass-inner hover:bg-mu-green-50 hover:text-mu-green-700 transition-colors cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {s}
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            className="absolute top-0 left-0 w-96 h-96 bg-mu-accent-teal-bg rounded-full blur-[100px] -z-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-mu-accent-orange-bg rounded-full blur-[100px] -z-10"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-6">
            Готовы получить консультацию?
          </h2>
          <p className="text-xl text-mu-text-700 font-medium mb-10 max-w-2xl mx-auto">
            Оставьте заявку — координатор свяжется с вами, уточнит детали и подберёт врача.
          </p>
          <motion.button
            className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-10 py-5 rounded-3xl font-bold shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)] text-lg flex items-center gap-2 mx-auto"
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