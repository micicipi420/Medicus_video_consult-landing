import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Услуги', action: () => scrollToSection('services') },
    { label: 'Почему мы', action: () => scrollToSection('why-us') },
    { label: 'Контакты', to: '/contacts' },
  ];

  return (
    <>
      <motion.header
        className={`fixed z-50 transition-all duration-500 top-4 left-4 right-4 mx-auto max-w-7xl rounded-[2.5rem] px-4 md:px-8 border-[0.5px] border-white/50 shadow-glass-header ${
          isScrolled ? 'bg-white/50 backdrop-blur-[60px] backdrop-saturate-[180%] py-3' : 'bg-white/30 backdrop-blur-[40px] backdrop-saturate-[150%] py-5'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent"
            >
              MedicusUnion
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`transition-colors font-medium tracking-tight ${
                    location.pathname === item.to ? 'text-mu-blue' : 'text-mu-text-700 hover:text-mu-blue'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Desktop Phone & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+77015322478"
              className="flex items-center gap-2 text-mu-text-700 hover:text-mu-blue transition-colors font-medium tracking-tight"
            >
              <Phone className="w-4 h-4" />
              +7 701 532 24 78
            </a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95, type: "spring", stiffness: 400 }}>
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-mu-blue/25 hover:shadow-xl hover:shadow-mu-blue/30 transition-shadow inline-block tracking-tight"
              >
                Оставить заявку
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-mu-text-700 bg-white/50 rounded-full backdrop-blur-xl backdrop-saturate-[180%] border border-white/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute top-24 left-4 right-4 bg-white/60 backdrop-blur-[80px] backdrop-saturate-[200%] shadow-glass-lg rounded-3xl overflow-hidden border-[0.5px] border-white/50"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <nav className="flex flex-col p-6 gap-2">
                {navItems.map((item) =>
                  item.to ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="text-left text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight"
                    >
                      {item.label}
                    </button>
                  )
                )}
                <div className="h-[0.5px] bg-white/40 my-2" />
                <a
                  href="tel:+77015322478"
                  className="flex items-center gap-3 text-mu-text-900 hover:bg-white/40 rounded-2xl px-4 py-3 transition-colors font-medium tracking-tight"
                >
                  <Phone className="w-5 h-5 text-mu-blue" />
                  +7 701 532 24 78
                </a>
                <Link
                  to="/contacts"
                  className="bg-gradient-to-r from-mu-blue to-mu-accent-blue text-white px-6 py-4 rounded-2xl font-semibold tracking-tight shadow-lg mt-4 w-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Оставить заявку
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}