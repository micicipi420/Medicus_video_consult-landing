import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

interface StatProps {
  number: string;
  label: string;
  delay: number;
  color: string;
  bg: string;
}

function StatCard({ number, label, delay, color, bg }: StatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayNumber, setDisplayNumber] = useState('0');

  useEffect(() => {
    if (isInView) {
      // Extract numeric part for animation
      const numericMatch = number.match(/\d+/);
      if (numericMatch) {
        const targetNum = parseInt(numericMatch[0]);
        const hasPlus = number.includes('+');
        const duration = 2000;
        const steps = 60;
        const increment = targetNum / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= targetNum) {
            setDisplayNumber(number);
            clearInterval(timer);
          } else {
            setDisplayNumber(Math.floor(current).toString() + (hasPlus ? '+' : ''));
          }
        }, duration / steps);
        return () => clearInterval(timer);
      } else {
        setDisplayNumber(number);
      }
    }
  }, [isInView, number]);

  return (
    <motion.div
      ref={ref}
      className={`relative group flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-glass-border shadow-glass hover:shadow-glass-lg hover:bg-white/70 hover:border-glass-border-strong transition-all duration-500 overflow-hidden`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={`absolute -inset-10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl rounded-full ${bg}`} />
      
      <motion.div
        className={`text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-sm ${color} relative z-10 group-hover:scale-110 transition-transform duration-500`}
        animate={isInView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {displayNumber}
      </motion.div>
      <div className="text-mu-text-700 font-bold text-lg text-center uppercase tracking-wider relative z-10">{label}</div>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-12 z-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard number="43" label="клиники" delay={0} color="text-mu-accent-blue" bg="bg-mu-blue" />
          <StatCard number="11" label="стран" delay={0.1} color="text-mu-accent-teal" bg="bg-mu-accent-teal" />
          <StatCard number="500+" label="врачей" delay={0.2} color="text-mu-accent-orange" bg="bg-mu-accent-orange" />
          <StatCard number="15+" label="лет опыта" delay={0.3} color="text-mu-green-600" bg="bg-mu-green-500" />
        </div>
      </div>
    </section>
  );
}