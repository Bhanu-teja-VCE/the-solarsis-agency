import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Zap, ArrowRight, ShieldCheck, Mail, CheckCircle, TrendingDown } from 'lucide-react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

interface AuditResult {
  industry: string;
  estimatedLostRevenue: number;
  leaks: { title: string; fix: string }[];
}

export default function AuditEngine() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'results' | 'email-prompt' | 'success' | 'error'>('idle');
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const scanSteps = [
    "Initializing Solarsis Engine...",
    "Bypassing security protocols...",
    "Scraping deep DOM content...",
    "Analyzing conversion funnel...",
    "Running revenue leak models...",
    "Finalizing brutal audit..."
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    setStatus('scanning');
    setScanStep(0);

    // Simulate scanning steps
    const stepInterval = setInterval(() => {
      setScanStep(prev => {
        if (prev < scanSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: targetUrl })
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website');
      }

      setResult(data.audit);
      setStatus('results');
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Something went wrong capturing the data.');
      setStatus('error');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !result) return;

    setIsSendingEmail(true);
    try {
      // 1. Send via Netlify function
      await fetch('/.netlify/functions/send-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditData: result, websiteUrl: url })
      });

      // 2. Save lead to Firestore
      await addDoc(collection(db, 'leads'), {
        websiteUrl: url,
        email,
        industry: result.industry,
        estimatedLostRevenue: result.estimatedLostRevenue,
        createdAt: new Date(),
        source: 'audit_engine'
      });

      // 3. Optional Ntfy ping for the owner so they know they got a lead via Audit
      fetch('https://ntfy.sh/solarsis-leads-bhanu', {
        method: 'POST',
        body: `🚨 AUDIT LEAD! ${url} is losing $${result.estimatedLostRevenue}/mo!\nEmail: ${email}`
      }).catch(console.error);

      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send email, please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <section id="audit-engine" className="py-24 relative overflow-hidden bg-black border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent blur-3xl opacity-50" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" /> Solarsis Intelligence Engine
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
          >
            Run your website through our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Brutal Audit</span> for free.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg"
          >
            Enter your URL. Our AI will scrape your site and instantly identify 3 exact revenue bottlenecks killing your conversions.
          </motion.p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STATE: IDLE */}
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      required
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Scan Website <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* STATE: SCANNING */}
            {status === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="absolute w-24 h-24 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <div className="absolute w-16 h-16 border-4 border-r-indigo-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-150" />
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="font-mono text-purple-400 text-lg">
                  {scanSteps[scanStep]}
                  <span className="animate-pulse">_</span>
                </div>
              </motion.div>
            )}

            {/* STATE: RESULTS */}
            {status === 'results' && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Scan Complete: {url}</h3>
                    <p className="text-white/50 text-sm">Industry: {result.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-sm mb-1 uppercase font-bold tracking-wider">Est. Monthly Leak</p>
                    <p className="text-3xl font-black text-red-500 flex items-center justify-end gap-2">
                       <TrendingDown className="w-6 h-6" />
                       \${result.estimatedLostRevenue?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.leaks.map((leak, idx) => (
                    <div key={idx} className="bg-[#111] border border-red-500/20 p-4 rounded-xl flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{leak.title}</h4>
                        <p className="text-white/60 text-sm">{leak.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Shall we send this full report to your email?</h3>
                  <div className="max-w-md mx-auto">
                    <form onSubmit={handleEmailSubmit} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isSendingEmail}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                        Send Report
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATE: SUCCESS */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex w-16 h-16 bg-green-500/10 rounded-full items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Report Sent!</h3>
                <p className="text-white/60">Check your inbox for the full breakdown.</p>
                <button
                  onClick={() => { setStatus('idle'); setUrl(''); setEmail(''); }}
                  className="mt-8 text-purple-400 hover:text-purple-300 font-medium"
                >
                  Scan another website
                </button>
              </motion.div>
            )}

            {/* STATE: ERROR */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Security Block</h3>
                <p className="text-red-400 mb-6 max-w-sm mx-auto">{errorMsg}</p>
                <button
                  onClick={() => { setStatus('idle'); }}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
