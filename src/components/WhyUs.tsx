import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function WhyUs() {
  return (
    <section id="process" className="py-32 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
            One partner.<br />
            <span className="text-gradient">Infinite scale.</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Traditional agencies are bloated, slow, and expensive. We operate like a special ops team—agile, highly technical, and focused purely on ROI. We don't bill for hours; we bill for outcomes.
          </p>
          
          <div className="space-y-4">
            {[
              "Rapid prototyping and deployment in days.",
              "Zero bloat. Direct access to elite engineers.",
              "Systems designed to self-heal and adapt.",
              "Measurable ROI from day one."
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0" />
                <span className="text-white/80">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="glass-card rounded-2xl p-8 border border-white/10 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-sm text-white/50 mb-1">Current Status</div>
                <div className="text-xl font-display font-semibold text-green-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Accepting New Clients
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/50 mb-1">Average Turnaround</div>
                <div className="text-xl font-display font-semibold text-white">14 Days</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Discovery & Architecture</span>
                  <span className="text-white">100%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-full rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Development & Integration</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "65%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-sky-400 rounded-full relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative background card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-sky-500/20 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
