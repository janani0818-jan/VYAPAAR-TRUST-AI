import React from 'react';
import { ComponentScore } from '../types';
import { Info, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface HealthIndicatorCardProps {
  indicator: ComponentScore;
  onClick?: () => void;
}

export const HealthIndicatorCard: React.FC<HealthIndicatorCardProps> = ({ indicator, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return { text: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-800/60', bar: 'bg-emerald-400', icon: CheckCircle2 };
      case 'GOOD':
        return { text: 'text-stone-300', bg: 'bg-stone-800/60', border: 'border-stone-700/60', bar: 'bg-stone-300', icon: CheckCircle2 };
      case 'MODERATE':
        return { text: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-800/60', bar: 'bg-amber-400', icon: AlertTriangle };
      case 'WEAK':
      case 'CRITICAL':
        return { text: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-800/60', bar: 'bg-rose-400', icon: AlertCircle };
      default:
        return { text: 'text-stone-400', bg: 'bg-stone-900', border: 'border-stone-800', bar: 'bg-stone-500', icon: Info };
    }
  };

  const statusStyle = getStatusColor(indicator.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div
      onClick={onClick}
      className="bg-[#121212] p-5 border border-[#ffffff15] hover:border-[#ffffff30] transition cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-serif font-medium text-white text-sm group-hover:text-amber-300 transition">{indicator.name}</h3>
            <span className="text-[9px] bg-[#1A1A1A] text-stone-400 font-light px-2 py-0.5 border border-[#ffffff10] uppercase tracking-wider">
              {indicator.weightPct}% weight
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className={`text-[9px] font-medium tracking-[0.2em] uppercase px-2 py-0.5 border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {indicator.status}
            </span>
            <StatusIcon className={`w-3.5 h-3.5 ${statusStyle.text}`} />
          </div>
        </div>

        {/* Score & Progress Bar */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-serif text-white italic">{indicator.score} <span className="text-xs font-sans not-italic text-stone-500 font-light">/ 100</span></span>
        </div>

        <div className="w-full h-1 bg-[#262626] overflow-hidden mb-3">
          <div
            className={`h-full ${statusStyle.bar} transition-all duration-700`}
            style={{ width: `${indicator.score}%` }}
          />
        </div>

        {/* Short Explanation */}
        <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2">{indicator.shortExplanation}</p>
      </div>

      {/* Detail Footer */}
      <div className="mt-4 pt-3 border-t border-[#ffffff10] flex items-center justify-between text-[10px] text-stone-500 font-light tracking-wider uppercase">
        <span>Click for metric detail</span>
        <Info className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 transition" />
      </div>
    </div>
  );
};
