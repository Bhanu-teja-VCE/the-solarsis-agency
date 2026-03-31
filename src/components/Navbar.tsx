import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 flex items-center justify-center">
            <div className="w-3 h-3 bg-background rounded-full" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide">Solarsis</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="hidden md:block">
          <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-all hover:border-purple-500/50 glow-button">
            Book a Discovery Call
          </button>
        </div>

        <button className="md:hidden text-white/70" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          <a href="#services" className="text-white/70 hover:text-white py-2" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#process" className="text-white/70 hover:text-white py-2" onClick={() => setIsOpen(false)}>Process</a>
          <a href="#contact" className="text-white/70 hover:text-white py-2" onClick={() => setIsOpen(false)}>Contact</a>
          <button className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium mt-2">
            Book a Discovery Call
          </button>
        </div>
      )}
    </motion.nav>
  );
}
