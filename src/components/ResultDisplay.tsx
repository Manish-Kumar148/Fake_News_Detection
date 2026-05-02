import React from 'react';
import { AnalysisResult } from '../services/analysisService';
import { motion } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, ShieldQuestion, 
  BarChart, PieChart, Info, 
  User, Calendar, ExternalLink,
  ChevronRight, Twitter, Facebook, Share2, Globe
} from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { cn } from '../lib/utils';

export default function ResultDisplay({ result }: { result: AnalysisResult }) {
  const shareText = `Veritas AI Detection Report: This information has been flagged as ${result.verdict} with ${result.confidenceScore}% confidence. Analyze truth at Veritas AI.`;
  const shareUrl = window.location.href;

  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };
  const getIcon = () => {
    switch (result.verdict) {
      case 'Real': return <ShieldCheck className="w-12 h-12 text-emerald-500" />;
      case 'Fake': return <ShieldAlert className="w-12 h-12 text-rose-500" />;
      case 'Suspicious': return <ShieldAlert className="w-12 h-12 text-amber-500" />;
      default: return <ShieldQuestion className="w-12 h-12 text-blue-500" />;
    }
  };

  const getVerdictColor = () => {
    switch (result.verdict) {
      case 'Real': return 'text-emerald-500';
      case 'Fake': return 'text-rose-500';
      case 'Suspicious': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  const chartData = [
    { name: 'Confidence', value: result.confidenceScore },
    { name: 'Uncertainty', value: 100 - result.confidenceScore },
  ];

  const COLORS = [
    result.verdict === 'Real' ? '#10b981' : result.verdict === 'Fake' ? '#f43f5e' : '#f59e0b',
    'rgba(20, 20, 20, 0.05)'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto py-12 px-4 space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Verdict Card */}
        <div className="lg:col-span-2 bg-[#E4E3E0] border border-[#141414]/10 rounded-3xl p-8 shadow-sm">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#141414]/40 mb-2 block">Detection Status</span>
              <div className="flex items-center gap-4">
                {getIcon()}
                <h3 className={cn("text-5xl font-sans font-black tracking-tighter", getVerdictColor())}>
                  {result.verdict.toUpperCase()}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-[#141414]/40">Confidence Score</span>
              <div className="text-3xl font-mono font-bold text-[#141414]">
                {result.confidenceScore}%
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button 
                  onClick={shareToX}
                  className="p-2 bg-[#141414] text-[#E4E3E0] rounded-lg hover:opacity-80 transition-opacity"
                  title="Share to X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  onClick={shareToFacebook}
                  className="p-2 bg-[#141414] text-[#E4E3E0] rounded-lg hover:opacity-80 transition-opacity"
                  title="Share to Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              AI Analysis Report
            </h4>
            <p className="text-lg leading-relaxed text-[#141414]/80 mb-6">
              {result.analysis}
            </p>

            {result.summaryPoints && result.summaryPoints.length > 0 && (
              <div className="space-y-3 bg-[#141414]/5 p-6 rounded-2xl border border-[#141414]/10">
                <h5 className="text-sm font-black uppercase tracking-tight text-[#141414]">Evidence Summary</h5>
                <ul className="space-y-2">
                  {result.summaryPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#141414]/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#141414] mt-1.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.suspiciousWords.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] mb-4">Highlighted Red Flags</h4>
              <div className="flex flex-wrap gap-2">
                {result.suspiciousWords.map((word, i) => (
                  <span key={i} className="bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confidence Chart Card */}
        <div className="bg-[#141414] rounded-3xl p-8 flex flex-col justify-center items-center text-[#E4E3E0]">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-8 w-full text-center">Probability Distribution</h4>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-center space-y-1">
            <p className="text-3xl font-black">{result.confidenceScore}%</p>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Certainty Index</p>
          </div>
        </div>
      </div>

      {/* Metadata & Secondary Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#E4E3E0] border border-[#141414]/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#141414]/5 rounded-lg">
              <User className="w-5 h-5 text-[#141414]/60" />
            </div>
            <span className="text-sm font-bold text-[#141414]/60 uppercase tracking-wider">Source Author</span>
          </div>
          <p className="text-lg font-medium text-[#141414]">{result.metadata.author || 'Anonymous / Unverified'}</p>
        </div>

        <div className="bg-[#E4E3E0] border border-[#141414]/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#141414]/5 rounded-lg">
              <Globe className="w-5 h-5 text-[#141414]/60" />
            </div>
            <span className="text-sm font-bold text-[#141414]/60 uppercase tracking-wider">Estimated Publisher</span>
          </div>
          <p className="text-lg font-medium text-[#141414] truncate">{result.metadata.source || 'Aggregator Node'}</p>
        </div>

        <div className="bg-[#E4E3E0] border border-[#141414]/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#141414]/5 rounded-lg">
              <Calendar className="w-5 h-5 text-[#141414]/60" />
            </div>
            <span className="text-sm font-bold text-[#141414]/60 uppercase tracking-wider">Publication Date</span>
          </div>
          <p className="text-lg font-medium text-[#141414]">{result.metadata.publishedDate || 'N/A'}</p>
        </div>
      </div>
    </motion.div>
  );
}
