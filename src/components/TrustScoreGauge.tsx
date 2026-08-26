import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'Medium-High Risk' | 'High Risk';
  creditReadinessPct: number;
  companyName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  riskLevel,
  creditReadinessPct,
  companyName = 'Business',
  size = 'md',
}) => {
  // SVG Gauge Math
  const radius = size === 'lg' ? 70 : size === 'md' ? 55 : 40;
  const stroke = size === 'lg' ? 12 : size === 'md' ? 10 : 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low Risk':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', stroke: '#10b981' };
      case 'Moderate Risk':
        return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', stroke: '#f59e0b' };
      case 'Medium-High Risk':
        return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', stroke: '#f97316' };
      case 'High Risk':
        return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', stroke: '#ef4444' };
      default:
        return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', stroke: '#3b82f6' };
    }
  };

  const colorConfig = getRiskColor(riskLevel);

  return (
    <div className="bg-[#121212] p-6 border border-[#ffffff15] relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Score Title & Description */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-stone-600"></span>
              <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">VYAPAARTRUST SCORE</span>
            </div>
            <span className={`text-[9px] font-medium tracking-[0.2em] uppercase px-2.5 py-0.5 border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}>
              {riskLevel.toUpperCase()}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight italic font-normal">
            {score} <span className="text-base font-sans not-italic text-stone-500 font-light">/ 100</span>
          </h2>

          <p className="text-xs text-stone-300 font-light leading-relaxed max-w-lg">
            Your evaluation profile reflects <strong className="text-white font-normal">{riskLevel === 'Low Risk' ? 'high operational stability and GST compliance' : 'moderate credit consistency'}</strong> with structured improvement metrics.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center space-x-2 bg-[#1A1A1A] px-3 py-1.5 border border-[#ffffff10]">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-stone-300 font-light">Credit Readiness: <strong className="text-white font-medium">{creditReadinessPct}%</strong></span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1A1A1A] px-3 py-1.5 border border-[#ffffff10]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-stone-300 font-light">Lender Confidence: <strong className="text-white font-medium">High Institutional Grade</strong></span>
            </div>
          </div>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative flex items-center justify-center shrink-0 p-2">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90 drop-shadow-sm"
          >
            <circle
              stroke="#262626"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={colorConfig.stroke}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              strokeLinecap="butt"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-serif text-white font-normal leading-none">{score}</span>
            <span className="text-[9px] font-light text-stone-400 uppercase tracking-[0.2em] mt-1">Trust Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};
