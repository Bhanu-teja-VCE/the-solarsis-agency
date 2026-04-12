import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Code2, Workflow, Zap, MessageSquareText, Globe, Database, PenTool, BarChart3, Headphones, Search, Mail, BrainCircuit } from 'lucide-react';

/* ─── CORE SERVICES (Large Hero Cards) ─── */
const coreServices = [
  {
    icon: <Code2 className="w-7 h-7" />,
    title: "Custom AI Software",
    description: "Vibe-coded MVPs, bespoke dashboards, and intelligent portals — shipped in days, not months. We turn complex requirements into elegant, functional software.",
    features: ["React / Next.js Apps", "Admin Dashboards", "Client Portals", "API Integrations"],
    color: "sky",
    gradient: "from-sky-500/20 to-transparent",
    borderGlow: "border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:border-sky-400/60 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]",
    iconBg: "bg-sky-500/10 text-sky-400",
    tagColor: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  {
    icon: <Workflow className="w-7 h-7" />,
    title: "AI Workflow Automation",
    description: "Eliminate manual data entry and repetitive tasks. We connect your apps with intelligent, self-healing workflows that run 24/7 on autopilot.",
    features: ["n8n / Make.com", "Zapier Alternatives", "Self-Healing Logic", "Multi-App Sync"],
    color: "purple",
    gradient: "from-purple-500/20 to-transparent",
    borderGlow: "border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:border-purple-400/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    iconBg: "bg-purple-500/10 text-purple-400",
    tagColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Omnichannel Lead Generation",
    description: "Zero-cost, fully automated outreach pipelines powered by AI agents that scrape, prospect, qualify, and book meetings across email, LinkedIn, and calls.",
    features: ["Cold Email Systems", "LinkedIn Outreach", "Lead Scraping", "Auto-Booking"],
    color: "amber",
    gradient: "from-amber-500/20 to-transparent",
    borderGlow: "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-400/60 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    iconBg: "bg-amber-500/10 text-amber-400",
    tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
];

/* ─── SECONDARY SERVICES (Medium Cards) ─── */
const secondaryServices = [
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    title: "AI Chatbots & Assistants",
    description: "24/7 customer support bots that read your docs, answer questions, and convert visitors into leads. Embeddable on any website.",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    border: "hover:border-emerald-500/40",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "RAG & Vector Databases",
    description: "Build AI systems that actually know your business. We implement retrieval-augmented generation with Pinecone, Weaviate, and pgvector.",
    iconBg: "bg-rose-500/10 text-rose-400",
    border: "hover:border-rose-500/40",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Website Design & Development",
    description: "Premium, conversion-optimized websites with SEO baked in. From landing pages to full e-commerce — we make your brand unforgettable.",
    iconBg: "bg-cyan-500/10 text-cyan-400",
    border: "hover:border-cyan-500/40",
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "Voice AI & Call Automation",
    description: "Speed-to-lead systems that call prospects the second they fill a form. AI voice agents that qualify, route, and book on your behalf.",
    iconBg: "bg-orange-500/10 text-orange-400",
    border: "hover:border-orange-500/40",
  },
];

/* ─── MICRO SKILLS (Small Chip Cards — AI-powered) ─── */
const microSkills = [
  { icon: <PenTool className="w-4 h-4" />,   title: "AI Copywriting",       tag: "AI-Powered" },
  { icon: <Search className="w-4 h-4" />,     title: "SEO Optimization",     tag: "Technical" },
  { icon: <Mail className="w-4 h-4" />,       title: "Email Sequences",      tag: "Automated" },
  { icon: <BarChart3 className="w-4 h-4" />,  title: "Analytics & Reporting", tag: "Data-Driven" },
  { icon: <BrainCircuit className="w-4 h-4" />, title: "Prompt Engineering", tag: "AI-Powered" },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yTransforms = [y1, y2, y3];

  return (
    <section id="services" className="py-32 relative" ref={containerRef}>
      {/* Ambient background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Full-Stack AI Agency Services
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Everything You Need to{' '}
            <span className="text-gradient">Scale</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto text-lg"
          >
            From AI automation to copywriting — we don't just build tools, we architect autonomous systems that replace friction with flow.
          </motion.p>
        </div>

        {/* ── TIER 1: Core Services (3 Large Hero Cards) ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-12" style={{ perspective: 1000 }}>
          {coreServices.map((service, index) => (
            <motion.div
              key={index}
              style={{ y: yTransforms[index] }}
              initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.12, type: "spring", bounce: 0.35 }}
              className="glass-card rounded-2xl p-8 relative overflow-hidden group flex flex-col"
            >
              {/* Glow border */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none ${service.borderGlow}`} />
              {/* Top gradient wash */}
              <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${service.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${service.iconBg} border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-display font-bold mb-3 text-white group-hover:text-gradient transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm mb-6 flex-1">
                  {service.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${service.tagColor} transition-all duration-300 group-hover:scale-105`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TIER 2: Secondary Services (4 Medium Cards, 2x2 Grid) ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {secondaryServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 * index }}
              className={`group rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] ${service.border} hover:bg-white/[0.04] transition-all duration-400 hover:shadow-lg`}
            >
              <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-base font-display font-semibold mb-2 text-white/90">{service.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ── TIER 3: Micro Skills (Horizontal chip row) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-white/40 uppercase tracking-wider">Also included with every engagement</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {microSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.06 * index }}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{skill.title}</span>
                  <span className="text-[10px] font-medium text-purple-400/70 uppercase tracking-wide">{skill.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
