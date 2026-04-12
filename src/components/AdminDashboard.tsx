import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trash2, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface Lead {
  id: string;
  content: string;
  timestamp: any;
  source: string;
  type: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });

    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    const unsubscribeLeads = onSnapshot(q, (snapshot) => {
      const leadsData: Lead[] = [];
      snapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsData);
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLeads();
    };
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteDoc(doc(db, 'leads', id));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Secure Dashboard</span>
            </div>
            <h1 className="text-4xl font-display font-bold">Solarsis Leads</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {leads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass-card rounded-3xl border border-white/5"
              >
                <div className="text-white/30 mb-2">No leads collected yet</div>
                <div className="text-xs text-white/20">New inquiries will appear here in real-time</div>
              </motion.div>
            ) : (
              leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                          {lead.type || 'Chat Inquiry'}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {lead.timestamp?.toDate().toLocaleString() || 'Just now'}
                        </div>
                      </div>
                      <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl">
                        {lead.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
