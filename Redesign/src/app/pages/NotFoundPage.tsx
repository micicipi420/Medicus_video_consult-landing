import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-16 min-h-[80vh] flex items-center justify-center">
      <motion.div
        className="text-center max-w-lg mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-8xl font-extrabold bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent mb-6">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-mu-text-900 mb-4">Страница не найдена</h1>
        <p className="text-mu-text-700 font-medium mb-8">
          Возможно, страница была перемещена или удалена.
        </p>
        <motion.button
          className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-8 py-4 rounded-3xl font-bold shadow-lg shadow-mu-blue/30 flex items-center gap-2 mx-auto hover:shadow-xl hover:shadow-mu-blue/40 transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
          На главную
        </motion.button>
      </motion.div>
    </div>
  );
}