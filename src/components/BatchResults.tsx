import React from 'react';
import { AnalysisResult } from '../services/analysisService';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BatchResults({ results, onSelect }: { results: AnalysisResult[], onSelect: (res: AnalysisResult) => void }) {
  if (results.length <= 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-8 mb-12"
    >
      <div className="bg-[#141414] rounded-3xl p-8 border border-[#E4E3E0]/10">
        <h3 className="text-[#E4E3E0] text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
          Batch Analysis Results
          <span className="bg-[#E4E3E0]/10 px-2 py-0.5 rounded text-[10px]">{results.length} items</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res, i) => (
            <button 
              key={i}
              onClick={() => onSelect(res)}
              className="flex items-center gap-4 bg-[#E4E3E0]/5 border border-[#E4E3E0]/10 p-4 rounded-2xl hover:bg-[#E4E3E0]/10 transition-all text-left group"
            >
              <div className="shrink-0">
                {res.verdict === 'Real' && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                {res.verdict === 'Fake' && <ShieldAlert className="w-6 h-6 text-rose-500" />}
                {(res.verdict === 'Suspicious' || res.verdict === 'Inconclusive') && <ShieldQuestion className="w-6 h-6 text-amber-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[#E4E3E0] font-bold text-sm truncate">{res.metadata.source || 'Analysis #' + (i+1)}</p>
                <p className="text-[#E4E3E0]/40 text-xs uppercase tracking-tight">{res.verdict} • {res.confidenceScore}% Confidence</p>
              </div>

              <ChevronRight className="w-4 h-4 text-[#E4E3E0]/20 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
