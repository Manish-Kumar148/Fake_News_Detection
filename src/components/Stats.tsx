import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Activity, BarChart3, PieChart as PieChartIcon, Shield, Target, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';

export default function Stats() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserStats(doc.data().stats);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  const data = [
    { name: 'Mon', fake: 4, real: 10 },
    { name: 'Tue', fake: 7, real: 8 },
    { name: 'Wed', fake: 12, real: 5 },
    { name: 'Thu', fake: 5, real: 15 },
    { name: 'Fri', fake: 9, real: 12 },
    { name: 'Sat', fake: 3, real: 18 },
    { name: 'Sun', fake: 6, real: 14 },
  ];

  return (
    <section id="analytics" className="py-24 px-4 bg-[#E4E3E0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#141414]" />
            <h2 className="text-3xl font-sans font-bold tracking-tight text-[#141414]">Global Trust Trends</h2>
          </div>
          
          {user && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <div className="bg-[#141414] text-[#E4E3E0] px-6 py-4 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">User Trust Score</span>
                <span className="text-xl font-black">{userStats?.trustScore || 100}%</span>
              </div>
              <div className="bg-white border border-[#141414]/10 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]/40 uppercase">Reliability</p>
                  <p className="text-sm font-bold text-[#141414]">Elite Verifier</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white border border-[#141414]/10 p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <Target className="w-6 h-6 text-[#141414]/20" />
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
              </div>
              <h4 className="text-3xl font-black text-[#141414] mb-1">{userStats?.checksPerformed || 0}</h4>
              <p className="text-xs uppercase tracking-widest font-bold text-[#141414]/40">Verified Sources Checked</p>
           </div>
           
           <div className="bg-white border border-[#141414]/10 p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <Activity className="w-6 h-6 text-[#141414]/20" />
              </div>
              <h4 className="text-3xl font-black text-[#141414] mb-1">98.4%</h4>
              <p className="text-xs uppercase tracking-widest font-bold text-[#141414]/40">Flagging Accuracy</p>
           </div>

           <div className="bg-white border border-[#141414]/10 p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <Users className="w-6 h-6 text-[#141414]/20" />
              </div>
              <h4 className="text-3xl font-black text-[#141414] mb-1">+1.2k</h4>
              <p className="text-xs uppercase tracking-widest font-bold text-[#141414]/40">Community Trust Impact</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#E4E3E0] border border-[#141414]/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#141414]" />
              <h4 className="font-bold text-[#141414]/60 uppercase text-xs tracking-widest">Real vs Fake Detection Volume</h4>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#14141450', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#14141450', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '12px', color: '#E4E3E0' }} 
                    itemStyle={{ color: '#E4E3E0' }}
                  />
                  <Area type="monotone" dataKey="real" stroke="#10b981" fillOpacity={1} fill="url(#colorReal)" strokeWidth={3} />
                  <Area type="monotone" dataKey="fake" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFake)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-rows-2 gap-6"
          >
            <div className="bg-[#141414] text-[#E4E3E0] rounded-3xl p-8 relative overflow-hidden">
               <div className="relative z-10">
                <Activity className="w-8 h-8 mb-4 opacity-50" />
                <h4 className="text-4xl font-black mb-2">94.2%</h4>
                <p className="text-xs uppercase tracking-widest font-bold opacity-40">System Accuracy Rate</p>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                  <BarChart3 className="w-48 h-48 -mr-12 -mb-12" />
               </div>
            </div>
            <div className="bg-[#E4E3E0] border border-[#141414]/10 rounded-3xl p-8">
              <h4 className="font-bold text-[#141414]/60 uppercase text-xs tracking-widest mb-4">Sentiment Analysis Impact</h4>
              <div className="flex items-center gap-4 h-full">
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Aggressive</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141414]/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#141414]" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Manipulative</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141414]/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#141414]" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
