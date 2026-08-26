import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { currentMSME } = useAuth();

  if (!currentMSME) return <div className="p-8 text-slate-500">Loading Recommendations...</div>;

  const { recommendations } = currentMSME.analysis;

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'HIGH':
        return <span className="bg-rose-950/60 text-rose-300 text-[9px] font-light px-2.5 py-0.5 border border-rose-800/60 uppercase tracking-widest">High Priority</span>;
      case 'MEDIUM':
        return <span className="bg-amber-950/60 text-amber-300 text-[9px] font-light px-2.5 py-0.5 border border-amber-800/60 uppercase tracking-widest">Medium Priority</span>;
      case 'LOW':
        return <span className="bg-[#1A1A1A] text-stone-300 text-[9px] font-light px-2.5 py-0.5 border border-[#ffffff15] uppercase tracking-widest">Low Priority</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#ffffff10] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">CREDIT OPTIMIZATION ROADMAP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Actionable Recommendations</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Targeted operational guidance derived from detected financial risk signals for {currentMSME.companyName}
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-[#121212] border border-[#ffffff15] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-light uppercase tracking-[0.25em] text-amber-300">Target Trust Score Growth</span>
          <h2 className="text-2xl font-serif font-normal text-white mt-1">
            Potential Score Impact: <span className="text-emerald-400 italic">+12 to +18 Points</span>
          </h2>
          <p className="text-xs text-stone-400 font-light mt-1 max-w-xl leading-relaxed">
            Executing these recommended adjustments can transition your financial profile from <strong className="text-white font-normal">{currentMSME.analysis.riskLevel}</strong> to an enhanced low-risk credit tier within 60-90 days.
          </p>
        </div>

        <div className="shrink-0 bg-[#1A1A1A] p-5 border border-[#ffffff15] text-center min-w-[160px]">
          <div className="text-[10px] text-stone-400 font-light uppercase tracking-widest">Current Score</div>
          <div className="text-3xl font-serif text-white font-normal mt-1">{currentMSME.analysis.trustScore} <span className="text-xs text-stone-500 font-sans">/ 100</span></div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-[#121212] p-6 border border-[#ffffff15] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ffffff10] pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#1A1A1A] border border-[#ffffff15] flex items-center justify-center text-amber-300">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-white text-sm">{rec.title}</h3>
                  <span className="text-[10px] font-light text-stone-500 uppercase tracking-widest">{rec.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getPriorityBadge(rec.priority)}
                <span className="text-[9px] font-light text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 border border-emerald-800/60 uppercase tracking-widest">
                  Impact: {rec.expectedScoreImpact}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 font-light leading-relaxed">{rec.description}</p>

            <div className="bg-[#1A1A1A] p-4 border border-[#ffffff10] space-y-1">
              <span className="text-[9px] font-light text-amber-300 uppercase tracking-[0.2em] block">Actionable Operational Step</span>
              <p className="text-xs text-stone-200 font-light leading-normal">{rec.actionableStep}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
