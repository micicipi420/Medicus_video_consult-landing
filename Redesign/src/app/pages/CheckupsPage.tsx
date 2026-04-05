import { motion } from 'motion/react';
import { ClipboardCheck, ArrowRight, CheckCircle2, Clock, MapPin, Stethoscope, Smartphone, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

const programs = [
  {
    name: 'Базовый чек-ап',
    price: 'от $350',
    duration: '1 день',
    location: 'Турция',
    items: ['Общий анализ крови и мочи', 'УЗИ органов брюшной полости', 'ЭКГ', 'Консультация терапевта', 'Заключение на русском языке'],
  },
  {
    name: 'Расширенный чек-ап',
    price: 'от $800',
    duration: '1–2 дня',
    location: 'Южная Корея',
    items: ['Полный анализ крови (60+ показателей)', 'КТ грудной клетки', 'УЗИ всех органов', 'Гастроскопия', 'Консультация 3 специалистов', 'Онкомаркеры'],
    popular: true,
  },
  {
    name: 'Премиум чек-ап',
    price: 'от $2 500',
    duration: '2 дня',
    location: 'Южная Корея',
    items: ['Всё из расширенного', 'МРТ головного мозга', 'ПЭТ-КТ', 'Колоноскопия', 'Кардио-стресс тест', 'Генетический скрининг', 'VIP-палата'],
  },
];

const features = [
  { icon: <Clock className="w-6 h-6" />, title: 'За 1–2 дня', desc: 'Полное обследование без очередей и ожиданий' },
  { icon: <MapPin className="w-6 h-6" />, title: 'Южная Корея и Турция', desc: 'Лучшие диагностические центры мирового уровня' },
  { icon: <Stethoscope className="w-6 h-6" />, title: 'Передовое оборудование', desc: 'AI-диагностика, ПЭТ-КТ, МРТ 3Т нового поколения' },
  { icon: <Smartphone className="w-6 h-6" />, title: 'Результаты в приложении', desc: 'Все результаты и заключения — в личном кабинете' },
  { icon: <Users className="w-6 h-6" />, title: 'Корпоративные чек-апы', desc: 'Программы для компаний — от 10 сотрудников' },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Всё включено', desc: 'Виза, трансфер, переводчик, проживание рядом с клиникой' },
];

export function CheckupsPage() {
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
              <ClipboardCheck className="w-4 h-4 text-mu-blue" />
              <span className="text-sm font-bold text-mu-blue uppercase tracking-wider">от $350</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
              <span className="text-mu-text-900">Чек-ап </span>
              <br />
              <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
                за рубежом
              </span>
            </h1>
            <p className="text-xl text-mu-text-700 font-medium leading-relaxed mb-8 max-w-xl">
              Комплексное обследование в лучших клиниках Южной Кореи и Турции за 1–2 дня. Виза, трансфер, переводчик, результаты в приложении.
            </p>
            <motion.button
              className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-semibold shadow-lg shadow-mu-blue/30 hover:shadow-xl hover:shadow-mu-blue/40 transition-all flex items-center gap-2 group text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contacts')}
            >
              Подобрать программу
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white/40 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1758206524001-56b1b1ec72cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2hlY2t1cCUyMGhlYWx0aCUyMHNjcmVlbmluZ3xlbnwxfHx8fDE3NzUyMzgyODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical checkup"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/60 shadow-glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-mu-blue border border-white/60 mb-5">
                {f.icon}
              </div>
              <h3 className="text-xl font-extrabold text-mu-text-900 mb-2">{f.title}</h3>
              <p className="text-mu-text-700 font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="container mx-auto px-4 lg:px-6 mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
            Программы чек-апов
          </span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              className={`bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border shadow-glass flex flex-col relative ${
                p.popular ? 'border-mu-blue/40 shadow-[0_16px_48px_color-mix(in_oklch,var(--color-mu-blue)_15%,transparent)]' : 'border-white/60'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Популярный
                </div>
              )}
              <h3 className="text-2xl font-extrabold text-mu-text-900 mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent">{p.price}</span>
              </div>
              <div className="flex gap-4 text-sm text-mu-text-700 font-bold mb-6">
                <span>{p.duration}</span>
                <span className="text-mu-blue">{p.location}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {p.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-mu-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-mu-text-900 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                  p.popular
                    ? 'bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white shadow-[0_16px_32px_color-mix(in_oklch,var(--color-mu-blue)_30%,transparent)]'
                    : 'bg-white/50 backdrop-blur-xl border border-white/60 text-mu-text-900 shadow-glass-inner'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contacts')}
              >
                Выбрать программу
                <ArrowRight className="w-5 h-5" />
              </motion.button>
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-6">
            Не знаете, какой чек-ап выбрать?
          </h2>
          <p className="text-xl text-mu-text-700 font-medium mb-10 max-w-2xl mx-auto">
            Оставьте заявку — координатор подберёт программу, исходя из вашего возраста, анамнеза и пожеланий.
          </p>
          <motion.button
            className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-10 py-5 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 text-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contacts')}
          >
            Подобрать программу
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}