import { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Solarsis completely transformed our operations. We cut manual data entry by 90% in just two weeks. The ROI is undeniable.",
    name: "Sarah Jenkins",
    title: "COO",
    company: "TechFlow"
  },
  {
    quote: "The custom AI portal they built for us is lightyears ahead of our competitors. It's like having a 24/7 sales team that never sleeps.",
    name: "Marcus Chen",
    title: "Founder",
    company: "Elevate Partners"
  },
  {
    quote: "Agile, brilliant, and incredibly fast. They delivered a fully automated lead gen system that doubled our pipeline in a month.",
    name: "Elena Rodriguez",
    title: "VP of Growth",
    company: "Nexus"
  },
  {
    quote: "We were drowning in repetitive tasks. Solarsis built an AI workflow that gave our team their time back. Incredible experience.",
    name: "David Foster",
    title: "CEO",
    company: "Foster Logistics"
  },
  {
    quote: "The best agency experience I've ever had. No bloat, just pure execution and results. They truly understand AI.",
    name: "Rachel Kim",
    title: "Director of Ops",
    company: "Zenith Media"
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth : 424; // 400px width + 24px gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Client <span className="text-gradient">Outcomes</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl">
              Don't just take our word for it. See how we've helped businesses scale infinitely.
            </p>
          </motion.div>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(192,132,252,0.3)]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-110 hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                type: "spring",
                bounce: 0.3
              }}
              className="snap-start shrink-0 w-[85vw] md:w-[400px] glass-card rounded-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-purple-500/40 mb-6" />
                <p className="text-white/80 text-lg leading-relaxed mb-8">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center font-display font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/50">{t.title}, <span className="text-white/70">{t.company}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
