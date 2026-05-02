import React, { useState } from 'react';
import { Search, Link as LinkIcon, FileText, Send, Loader2, ShieldCheck, ShieldAlert, ShieldQuestion, Globe, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { analyzeContent, AnalysisResult } from '../services/analysisService';

export default function Analyzer({ onResult, onBatchResult }: { 
  onResult: (res: AnalysisResult) => void,
  onBatchResult?: (results: AnalysisResult[]) => void 
}) {
  const [type, setType] = useState<'text' | 'url'>('text');
  const [isBulk, setIsBulk] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setProgress(0);
    
    try {
      if (isBulk) {
        const items = content.split('\n').filter(line => line.trim().length > 0);
        const results: AnalysisResult[] = [];
        
        for (let i = 0; i < items.length; i++) {
          const result = await analyzeContent(items[i], type);
          results.push(result);
          setProgress(Math.round(((i + 1) / items.length) * 100));

          // Save each to history if user is logged in
          if (user) {
            await addDoc(collection(db, 'analyses'), {
              userId: user.uid,
              content: items[i].substring(0, 500),
              type,
              ...result,
              createdAt: serverTimestamp(),
            });
          }
        }
        
        if (onBatchResult) onBatchResult(results);
        if (results.length > 0) onResult(results[0]); // Show first by default

        // Update user stats once for the batch
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const currentStats = userSnap.data().stats || { checksPerformed: 0, trustScore: 100 };
            await updateDoc(userRef, {
              'stats.checksPerformed': currentStats.checksPerformed + items.length
            });
          }
        }
      } else {
        const result = await analyzeContent(content, type);
        onResult(result);

        if (user) {
          const resultRef = await addDoc(collection(db, 'analyses'), {
            userId: user.uid,
            content: content.substring(0, 500),
            type,
            ...result,
            createdAt: serverTimestamp(),
          });

          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const currentStats = userSnap.data().stats || { checksPerformed: 0, trustScore: 100 };
            await updateDoc(userRef, {
              'stats.checksPerformed': currentStats.checksPerformed + 1
            });
          }
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze content. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <section id="analyzer" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans font-bold text-4xl md:text-5xl tracking-tight text-[#141414] mb-4"
          >
            Detect Truth, Instantaneously.
          </motion.h2>
          <p className="text-[#141414]/60 max-w-2xl mx-auto">
            Our advanced NLP engine analyzes patterns, context, and metadata.
            {isBulk && " Bulk mode active: analyzing multiple entries."}
          </p>
        </div>

        <div className="mb-6 flex justify-center">
           <button 
            onClick={() => setIsBulk(!isBulk)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border flex items-center gap-2",
              isBulk ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" : "text-[#141414] border-[#141414]/20 hover:border-[#141414]"
            )}
           >
            {isBulk ? <Zap className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Layers className="w-4 h-4" />}
            {isBulk ? "Bulk Mode Enabled" : "Enable Multi-Verification"}
           </button>
        </div>

        <div className="bg-[#141414] rounded-3xl p-1 shadow-2xl overflow-hidden relative">
          {loading && isBulk && (
            <div className="absolute top-0 left-0 h-1 bg-amber-500 z-20 transition-all duration-300" style={{ width: `${progress}%` }} />
          )}
          
          <div className="bg-[#E4E3E0] rounded-[calc(1.5rem-1px)] overflow-hidden">
            <div className="flex border-b border-[#141414]/10">
              <button 
                onClick={() => setType('text')}
                className={cn(
                  "flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all",
                  type === 'text' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5 text-[#141414]"
                )}
              >
                <FileText className="w-5 h-5" />
                {isBulk ? 'Bulk Text' : 'Plain Text'}
              </button>
              <button 
                onClick={() => setType('url')}
                className={cn(
                  "flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all",
                  type === 'url' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414]/5 text-[#141414]"
                )}
              >
                <LinkIcon className="w-5 h-5" />
                {isBulk ? 'Bulk URLs' : 'URL / Article'}
              </button>
            </div>

            <div className="p-6">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isBulk ? "Enter each URL or text block on a new line..." : "Paste news content, social media post, or claim here..."}
                className="w-full h-48 bg-transparent border-none resize-none focus:ring-0 text-lg text-[#141414] placeholder-[#141414]/30"
              />

              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-xs font-bold text-[#141414]/40 uppercase tracking-widest">
                  {isBulk && content.split('\n').filter(l => l.trim()).length > 0 && (
                    <span>{content.split('\n').filter(l => l.trim()).length} entries detected</span>
                  )}
                </div>
                
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !content.trim()}
                  className="w-full sm:w-auto bg-[#141414] text-[#E4E3E0] px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isBulk ? `Verifying... ${progress}%` : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      {isBulk ? 'Rapid Verification' : 'Verify Now'}
                      <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
