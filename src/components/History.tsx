import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, ShieldAlert, ShieldQuestion, ChevronRight, FileText, Link as LinkIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { AnalysisResult } from '../services/analysisService';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'analyses');
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    try {
      await deleteDoc(doc(db, 'analyses', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `analyses/${id}`);
    }
  };

  const getIcon = (verdict: string) => {
    switch (verdict) {
      case 'Real': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Fake': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'Suspicious': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      default: return <ShieldQuestion className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!user) return null;

  return (
    <section id="history" className="py-24 px-4 bg-[#E4E3E0]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Clock className="w-8 h-8 text-[#141414]" />
          <h2 className="text-3xl font-sans font-bold tracking-tight">Recent Investigations</h2>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#141414] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-[#141414]/20 rounded-3xl p-20 text-center">
            <p className="text-[#141414]/40 text-lg">Your history is clear. Start by analyzing a claim.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white border border-[#141414]/10 rounded-2xl p-5 hover:border-[#141414] transition-all flex items-center gap-6"
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  item.type === 'url' ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600"
                )}>
                  {item.type === 'url' ? <LinkIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {getIcon(item.verdict)}
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                      {item.verdict} • {item.confidenceScore}% Certainty
                    </span>
                  </div>
                  <p className="text-[#141414] font-medium truncate pr-4">
                    {item.content}
                  </p>
                  <p className="text-xs text-[#141414]/40 mt-1">
                    {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'PPP p') : 'Just now'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="p-3 bg-[#141414]/5 rounded-xl">
                    <ChevronRight className="w-5 h-5 text-[#141414]/40 group-hover:text-[#141414] transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
