import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, CalendarCheck, CheckCircle2, Phone, Mail as MailIcon, UserCircle, Zap } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'booking_form' | 'booking_success';
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/* ─── Keywords that trigger the booking form ─── */
const BOOKING_TRIGGERS = [
  'book a call', 'book call', 'schedule a call', 'schedule call',
  'start working', 'work together', 'hire you', 'hire solarsis',
  'get started', 'let\'s start', 'lets start', 'want to start',
  'contact bhanu', 'talk to bhanu', 'reach out',
  'interested', 'sign up', 'get a quote', 'pricing',
  'i need help', 'need your help', 'can you help',
  'i want to', 'looking for', 'need a', 'build me',
];

function shouldShowBookingForm(message: string): boolean {
  const lower = message.toLowerCase();
  return BOOKING_TRIGGERS.some(trigger => lower.includes(trigger));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hey! 👋 How can we help you automate your business today? If you\'re ready to get started, just say "book a call" anytime!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '', email: '', phone: '', message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showBookingForm]);

  /* ─── Save lead to Firestore ─── */
  const saveLead = async (message: string) => {
    try {
      await addDoc(collection(db, 'leads'), {
        type: 'chat_inquiry',
        content: message,
        timestamp: serverTimestamp(),
        source: 'chat_widget'
      });
    } catch (e) {
      console.error("Error adding lead: ", e);
    }
  };

  /* ─── Save booking request to Firestore + send notification ─── */
  const saveBooking = async (form: BookingForm) => {
    try {
      // Save to Firestore
      await addDoc(collection(db, 'booking_requests'), {
        name: form.name,
        email: form.email,
        phone: form.phone || 'Not provided',
        message: form.message || 'No additional message',
        chatHistory: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        timestamp: serverTimestamp(),
        status: 'new',
        source: 'chat_widget'
      });

      // Send instant push notification via ntfy.sh
      // Doing a 'simple' POST request without custom headers to avoid CORS preflight blocking in browsers
      try {
        await fetch('https://ntfy.sh/solarsis-leads-bhanu', {
          method: 'POST',
          body: `🔥 NEW BOOKING REQUEST! 🔥\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nMessage: ${form.message || 'None'}`
        });
      } catch (e) {
        // Notification is optional — booking still saved to Firestore
        console.log('Push notification failed (non-critical)');
      }

    } catch (e) {
      console.error("Error saving booking: ", e);
      throw e;
    }
  };

  /* ─── Handle booking form submit ─── */
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) return;

    setIsSubmittingBooking(true);
    try {
      await saveBooking(bookingForm);
      setShowBookingForm(false);
      setBookingSubmitted(true);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Awesome, ${bookingForm.name.split(' ')[0]}! 🎉 I've sent your details to Bhanu. He'll personally reach out to you within a few hours. In the meantime, feel free to ask me anything else about Solarsis!`,
          type: 'booking_success'
        }
      ]);
      setBookingForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Oops, something went wrong submitting your request. Please try again or email hello@solarsis.ai directly!' }
      ]);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  /* ─── Handle chat message submit ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    // Check if user wants to book a call
    if (shouldShowBookingForm(userMsg)) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Let\'s get you connected with Bhanu! 🚀 Fill in your details below and he\'ll reach out to you personally:',
          type: 'booking_form'
        }
      ]);
      setShowBookingForm(true);
      return;
    }

    setIsLoading(true);

    // Save lead to Firestore on first message
    if (messages.length === 1) {
      saveLead(userMsg);
    }

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: `You are Solarsis AI, the intelligent AI assistant embedded on the Solarsis Agency website.

ABOUT SOLARSIS AGENCY:
- Solarsis is a solo AI automation agency founded and run by Bhanu Teja, based in Hyderabad, India.
- It is a one-person agency — Bhanu handles everything from strategy to development to delivery.
- Despite being solo, Solarsis delivers enterprise-grade AI systems because Bhanu leverages cutting-edge AI tools and agentic workflows to multiply his output.

SERVICES WE OFFER:
1. Custom AI Software — Vibe-coded MVPs, dashboards, client portals, and full-stack apps built in days.
2. AI Workflow Automation — Connecting apps with n8n, Make.com, and custom pipelines. Eliminating manual work.
3. Omnichannel Lead Generation — Automated cold email, LinkedIn outreach, and lead scraping systems.
4. AI Chatbots & Assistants — 24/7 customer support bots trained on your business docs (like me!).
5. RAG & Vector Database Solutions — Building AI that truly understands your business data using Pinecone, pgvector, etc.
6. Website Design & Development — Premium, SEO-optimized websites that convert visitors into customers.
7. Voice AI & Call Automation — Speed-to-lead systems and AI voice agents for qualifying and booking calls.
8. AI Copywriting — Sales pages, email sequences, ad copy, and blog content powered by AI.
9. SEO Optimization — Technical SEO, on-page optimization, and content strategy.
10. Prompt Engineering — Custom prompt systems for businesses adopting AI tools.

PERSONALITY & RULES:
- Be warm, friendly, and genuinely helpful. You represent Bhanu's personal brand.
- Keep answers concise (2-4 sentences max unless the user asks for detail).
- Be persuasive but never pushy. Guide visitors toward booking a discovery call.
- If someone seems interested in working together, encourage them to say "book a call" — the system will automatically show a booking form.
- If asked about pricing, say: "Every project is custom-scoped. Just say 'book a call' below and Bhanu will reach out with a free quote!"
- If asked who the owner/founder is, say: "Solarsis was founded by Bhanu Teja — he's a solo founder who uses AI to punch way above his weight class."
- If anyone asks for examples, pricing, an audit, or how we can help their specific business, tell them to scroll up and enter their URL into the Solarsis Engine section to see exactly how much revenue they are losing!
- If asked about contact, share: hello@solarsis.ai or suggest typing "book a call" to connect directly.
- Never make up capabilities we don't have. Never badmouth competitors.
- If you don't know something specific, say "Great question — type 'book a call' and Bhanu will personally answer that for you!"` },
            ...messages.filter(m => m.type !== 'booking_form' && m.type !== 'booking_success')
              .map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, my systems are currently offline. Please email hello@solarsis.ai!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[360px] h-[500px] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col bg-black/40 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
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
              <div className="flex items-center gap-2">
                {/* Audit Engine Button */}
                <button
                  onClick={() => {
                    const el = document.getElementById('audit-engine');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      setIsOpen(false);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px] font-medium hover:bg-purple-500/30 transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  Run Audit
                </button>

                {/* Quick Book Button in Header */}
                {!bookingSubmitted && !showBookingForm && (
                  <button
                    onClick={() => {
                      setMessages(prev => [
                        ...prev,
                        { role: 'assistant', content: 'Let\'s get you connected with Bhanu! 🚀 Fill in your details below:', type: 'booking_form' }
                      ]);
                      setShowBookingForm(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[11px] font-medium hover:bg-green-500/30 transition-colors"
                  >
                    <CalendarCheck className="w-3 h-3" />
                    Book Call
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 
                    ${msg.role === 'user' ? 'bg-white/10 text-white/70' : 'bg-gradient-to-tr from-purple-500 to-sky-400'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <div className="w-2 h-2 bg-background rounded-full" />}
                  </div>
                  <div className={`p-3 text-sm leading-relaxed shadow-sm max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-sky-500/20 border border-sky-500/30 text-white rounded-2xl rounded-tr-sm' 
                      : msg.type === 'booking_success'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-200 rounded-2xl rounded-tl-sm'
                        : 'bg-white/10 border border-white/5 text-white/90 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* ─── INLINE BOOKING FORM ─── */}
              {showBookingForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 shrink-0 flex items-center justify-center mt-1">
                    <CalendarCheck className="w-4 h-4 text-white" />
                  </div>
                  <form 
                    onSubmit={handleBookingSubmit}
                    className="flex-1 bg-gradient-to-b from-purple-500/10 to-sky-500/10 border border-purple-500/20 rounded-2xl rounded-tl-sm p-4 space-y-3"
                  >
                    <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      Book a Discovery Call
                    </div>

                    {/* Name */}
                    <div className="relative">
                      <UserCircle className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <input
                        type="text"
                        placeholder="Your name *"
                        required
                        value={bookingForm.name}
                        onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <MailIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <input
                        type="email"
                        placeholder="Your email *"
                        required
                        value={bookingForm.email}
                        onChange={e => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={bookingForm.phone}
                        onChange={e => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    {/* Message */}
                    <textarea
                      placeholder="Tell us briefly what you need..."
                      value={bookingForm.message}
                      onChange={e => setBookingForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={2}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmittingBooking}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-sky-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isSubmittingBooking ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submit Request
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-background rounded-full" />
                  </div>
                  <div className="p-4 bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={showBookingForm ? "Fill the form above ☝️" : "Type a message..."}
                  disabled={showBookingForm}
                  className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-sky-500/50 disabled:opacity-40"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim() || showBookingForm}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-300 disabled:opacity-50 transition-colors p-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
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
