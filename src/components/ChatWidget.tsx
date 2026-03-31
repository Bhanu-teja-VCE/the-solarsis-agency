import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Calendar, HelpCircle } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[340px] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Solarsis AI</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 bg-black/20">
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 shrink-0 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-background rounded-full" />
                </div>
                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-white/90 leading-relaxed shadow-sm">
                  How can we help you automate your business today?
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors text-sm text-left group">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-white">Ask a question</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl glass border border-white/10 hover:bg-white/10 transition-colors text-sm text-left group">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-white">Book a call</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 relative group"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageSquare className="w-6 h-6 relative z-10" />}
      </motion.button>
    </div>
  );
}
