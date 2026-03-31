import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Code2, Workflow, Zap } from 'lucide-react';

const services = [
  {
    icon: <Code2 className="w-6 h-6 text-sky-400" />,
    title: "Custom AI Software",
    description: "Vibe-coded MVPs and bespoke portals. We turn complex requirements into elegant, functional software in days, not months.",
    gradient: "from-sky-500/20 to-transparent",
    borderGlow: "border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:border-sky-400/60 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]"
  },
  {
    icon: <Workflow className="w-6 h-6 text-purple-400" />,
    title: "AI Automations",
    description: "Seamlessly connect your apps. Eliminate manual data entry and repetitive tasks with intelligent, self-healing workflows.",
    gradient: "from-purple-500/20 to-transparent",
    borderGlow: "border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:border-purple-400/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Omnichannel Lead Gen",
    description: "Zero-cost, fully automated sales pipelines powered by AI agents that prospect, qualify, and book meetings 24/7.",
    gradient: "from-amber-500/20 to-transparent",
    borderGlow: "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-400/60 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
  }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yTransforms = [y1, y2, y3];

  return (
    <section id="services" className="py-32 relative" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Systems that <span className="text-gradient">Scale</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            We don't just build tools; we architect autonomous systems that replace friction with flow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8" style={{ perspective: 1000 }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              style={{ y: yTransforms[index] }}
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15, 
                type: "spring", 
                bounce: 0.4 
              }}
              className="glass-card rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none ${service.borderGlow}`} />
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${service.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-4 text-white">{service.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
