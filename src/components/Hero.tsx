import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[100px] opacity-30 pointer-events-none translate-x-1/4 -translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs font-medium text-purple-300 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>We solve hurdles using AI.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6"
          >
            Scale Infinitely.<br />
            Work Less.<br />
            <span className="text-gradient">Automate Everything.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed"
          >
            From custom AI software to fully automated workflows, we build the systems that put your business on autopilot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="group relative px-8 py-4 rounded-full bg-white text-background font-medium flex items-center justify-center gap-2 transition-transform hover:scale-105 pulse-glow">
              <span>Automate Your Business</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full glass border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
              View Our Work
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
          className="relative hidden lg:block"
          style={{ perspective: 1000 }}
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
            {/* Abstract Dashboard Mockup */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-6 flex flex-col gap-4"
              style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="h-2 w-24 bg-white/10 rounded-full" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                  <div className="h-2 w-16 bg-white/20 rounded-full mb-4" />
                  <div className="text-3xl font-display font-bold text-white">99.9%</div>
                  <div className="text-xs text-green-400 mt-1">+12% efficiency</div>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                  <div className="h-2 w-20 bg-white/20 rounded-full mb-4" />
                  <div className="text-3xl font-display font-bold text-white">24/7</div>
                  <div className="text-xs text-purple-400 mt-1">Active Agents</div>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-purple-500/20 to-sky-500/20 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <div className="relative z-10">
                    <div className="h-2 w-24 bg-white/30 rounded-full mb-6" />
                    <div className="flex items-end gap-2 h-20">
                      {[40, 70, 45, 90, 65, 100, 85].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-purple-500 to-sky-400 rounded-t-sm opacity-80"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-20 glass p-4 rounded-xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Workflow Optimized</div>
                  <div className="text-xs text-white/50">Just now</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
