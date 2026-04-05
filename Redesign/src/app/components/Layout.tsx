import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from './Header';
import { Footer } from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="relative min-h-screen bg-mu-text-50 selection:bg-mu-blue/30 selection:text-mu-text-900 overflow-x-hidden">
      <ScrollToTop />
      {/* Global iOS 26 Liquid Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-mu-blue/30 mix-blend-multiply blur-[120px]"
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-mu-green-300/20 mix-blend-multiply blur-[120px]"
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-mu-accent-blue/15 mix-blend-multiply blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:gap-16 pb-8">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}