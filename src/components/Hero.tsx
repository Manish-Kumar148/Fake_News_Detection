import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Decorative architectural grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414]/5 mb-8 border border-[#141414]/10 shadow-sm"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#141414]">Powered by Gemini 2.0 Flash</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-sans font-black text-6xl md:text-8xl lg:text-[9vw] leading-[0.88] tracking-tighter text-[#141414] mb-8"
        >
          TRUTH IS NOT<br />
          <span className="text-[#141414]/40">SUBJECTIVE.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-[#141414]/60 mb-12"
        >
          The first multi-modal verification engine designed to neutralize misinformation 
          at the source. Analyzing semantics, sentiment, and metadata to protect your narrative.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
           <a 
            href="#analyzer"
            className="group relative bg-[#141414] text-[#E4E3E0] px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
           >
            <span className="relative z-10">Start Investigation</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
           </a>
           <div className="flex items-center gap-4 text-[#141414]/40 font-bold uppercase text-xs tracking-widest">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 99% Accuracy</span>
              <span className="w-1 h-1 bg-[#141414]/20 rounded-full"></span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Global Sources</span>
           </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex justify-center mt-20"
      >
        <ArrowDown className="text-[#141414]/20 w-8 h-8" />
      </motion.div>
    </div>
  );
}
