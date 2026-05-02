/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import { AnalysisResult } from './services/analysisService';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import Stats from './components/Stats';
import { motion, AnimatePresence } from 'motion/react';

import SocialDiscovery from './components/SocialDiscovery';
import BatchResults from './components/BatchResults';

function AppContent() {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [batchResults, setBatchResults] = useState<AnalysisResult[]>([]);

  const handleAnalysisResult = (result: AnalysisResult) => {
    setCurrentResult(result);
    // Scroll to results if needed
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBatchResults = (results: AnalysisResult[]) => {
    setBatchResults(results);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] selection:bg-[#141414] selection:text-[#E4E3E0]">
      <Navbar />
      
      <main>
        {!currentResult && <Hero />}
        
        <Analyzer onResult={handleAnalysisResult} onBatchResult={handleBatchResults} />
        
        <AnimatePresence mode="wait">
          {batchResults.length > 1 && (
            <BatchResults results={batchResults} onSelect={setCurrentResult} />
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {currentResult && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="scroll-mt-32"
            >
              <div id="results" className="max-w-7xl mx-auto px-4 mb-24">
                <div className="flex justify-between items-center mb-12">
                   <h2 className="text-4xl font-sans font-black tracking-tight text-[#141414]">DETECTION REPORT</h2>
                   <button 
                    onClick={() => setCurrentResult(null)}
                    className="text-sm font-bold uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors"
                   >
                    Close Report
                   </button>
                </div>
                <ResultDisplay result={currentResult} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SocialDiscovery onResult={handleAnalysisResult} />

        <History />
        
        <Stats />
      </main>

      <footer className="bg-[#141414] text-[#E4E3E0] py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#E4E3E0] rounded-sm flex items-center justify-center">
                 <div className="w-4 h-4 bg-[#141414] rotate-45"></div>
              </div>
              <span className="font-sans font-black text-2xl tracking-tighter uppercase">VERITAS AI</span>
            </div>
            <p className="text-[#E4E3E0]/40 max-w-sm text-sm">
              An open-source initiative to reclaim digital truth in an era of synthetic deception.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold tracking-[0.3em] opacity-20 mb-4">Architected for the Future</p>
            <div className="flex justify-end gap-8 text-sm font-medium opacity-60">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy Protocol</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">API Reference</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Governance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
