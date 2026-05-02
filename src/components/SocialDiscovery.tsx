import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Twitter, Facebook, MessageSquare, ShieldAlert, 
  Search, RefreshCw, Zap, CheckCircle2, User,
  MoreHorizontal, Heart, MessageCircle, Share2
} from 'lucide-react';
import { analyzeContent, AnalysisResult } from '../services/analysisService';
import { cn } from '../lib/utils';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'reddit';
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  engagement: string;
  isAnalyzed?: boolean;
  verdict?: AnalysisResult['verdict'];
  confidence?: number;
}

const MOCK_POSTS: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    author: 'TechInsider',
    handle: '@techinsider',
    content: "BREAKING: New satellite data shows global cooling is actually accelerating. The mainstream media is hiding the truth about the upcoming ice age. #ClimateChange #FakeNews",
    timestamp: '2m ago',
    engagement: '14.2K'
  },
  {
    id: '2',
    platform: 'reddit',
    author: 'CryptoWhale',
    handle: 'u/cryptowhale',
    content: "The central bank just leaked a secret plan to ban all decentralized wallets by Friday. Move your assets now to this secure off-shore exchange before they freeze everything!",
    timestamp: '15m ago',
    engagement: '5.4K'
  },
  {
    id: '3',
    platform: 'facebook',
    author: 'HealthWatch',
    handle: 'Global Health Updates',
    content: "Did you know that common table salt is actually a government experiment to track cellular movement? Switch to our proprietary 'Quantum Salt' today for total privacy.",
    timestamp: '1h ago',
    engagement: '2.8K'
  }
];

export default function SocialDiscovery({ onResult }: { onResult: (res: AnalysisResult) => void }) {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleScan = async (post: SocialPost) => {
    setScanningId(post.id);
    try {
      const result = await analyzeContent(post.content, 'social');
      
      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, isAnalyzed: true, verdict: result.verdict, confidence: result.confidenceScore } : p
      ));

      onResult(result);

      // Save to history
      if (user) {
        await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          content: post.content,
          type: 'social',
          ...result,
          createdAt: serverTimestamp(),
        });

        // Update user stats
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const currentStats = userSnap.data().stats || { checksPerformed: 0, trustScore: 100 };
          await updateDoc(userRef, {
            'stats.checksPerformed': currentStats.checksPerformed + 1
          });
        }
      }
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setScanningId(null);
    }
  };

  const getVerdictStyles = (verdict?: string) => {
    switch (verdict) {
      case 'Real': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Fake': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Suspicious': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <section id="discovery" className="py-24 px-4 bg-[#141414] text-[#E4E3E0]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-amber-500" />
              <h2 className="text-4xl font-sans font-black tracking-tighter uppercase italic">Social Discovery</h2>
            </div>
            <p className="text-[#E4E3E0]/40 max-w-lg">
              Live scanning of trending social narratives. Our engine monitors cross-platform patterns to identify misinformation peaks before they go viral.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#E4E3E0] text-[#141414] rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95">
            <RefreshCw className="w-4 h-4" />
            Refresh Stream
          </button>
        </div>

        <div className="space-y-6">
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#E4E3E0]/5 border border-[#E4E3E0]/10 rounded-3xl p-6 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E4E3E0]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 opacity-40" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{post.author}</h4>
                    <span className="text-xs opacity-40">{post.handle} • {post.timestamp}</span>
                  </div>
                </div>
                <div className="opacity-40">
                  {post.platform === 'twitter' && <Twitter className="w-5 h-5" />}
                  {post.platform === 'facebook' && <Facebook className="w-5 h-5" />}
                  {post.platform === 'reddit' && <MessageSquare className="w-5 h-5" />}
                </div>
              </div>

              <p className="text-lg mb-6 leading-relaxed opacity-80">{post.content}</p>

              <div className="flex items-center justify-between pt-4 border-t border-[#E4E3E0]/10">
                <div className="flex items-center gap-6 text-sm opacity-40">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.engagement}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> 842</span>
                  <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> 165</span>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {post.isAnalyzed && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border",
                          getVerdictStyles(post.verdict)
                        )}
                      >
                        {post.verdict?.toUpperCase()} ({post.confidence}%)
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    onClick={() => handleScan(post)}
                    disabled={scanningId === post.id}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      post.isAnalyzed 
                        ? "bg-[#E4E3E0]/10 text-[#E4E3E0] cursor-default" 
                        : "bg-amber-500 text-[#141414] hover:bg-amber-400 active:scale-95"
                    )}
                  >
                    {scanningId === post.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Scanning...
                      </>
                    ) : post.isAnalyzed ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Analysis Ready
                      </>
                    ) : (
                      <>
                        <Search className="w-3 h-3" />
                        Deep Scan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <button className="text-xs font-bold uppercase tracking-[0.4em] opacity-20 hover:opacity-100 transition-opacity">
              Load More Suspicious Activity
           </button>
        </div>
      </div>
    </section>
  );
}
