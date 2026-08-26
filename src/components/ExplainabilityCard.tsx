import React from 'react';
import { FeatureContribution } from '../types';
import { PlusCircle, MinusCircle, Sparkles, BrainCircuit } from 'lucide-react';

interface ExplainabilityCardProps {
  positiveFactors: FeatureContribution[];
  riskFactors: FeatureContribution[];
  aiInterpretation: string;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  positiveFactors,
  riskFactors,
  aiInterpretation,
}) => {
  return (
    <div className="bg-[#121212] p-6 border border-[#ffffff15] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ffffff10] pb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-stone-700 bg-[#1A1A1A] flex items-center justify-center text-stone-300">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-white text-base">Explainable AI — Trust Score Drivers</h3>
            <p className="text-xs text-stone-400 font-light">Transparent feature contribution analysis explaining score computation logic</p>
          </div>
        </div>
        <span className="text-[9px] font-light bg-[#1A1A1A] text-stone-300 px-3 py-1 border border-[#ffffff10] uppercase tracking-[0.2em] self-start sm:self-auto">
          Feature Contribution Analysis
        </span>
      </div>

      {/* Positive vs Risk Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Drivers */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 p-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-light text-[10px] uppercase tracking-[0.2em] mb-3">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Positive Contributing Factors (+ Points)</span>
          </div>

          <div className="space-y-2.5">
            {positiveFactors.map((f, i) => (
              <div key={i} className="bg-[#1A1A1A] p-3 border border-emerald-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-xs">{f.featureName}</span>
                  <span className="text-[10px] font-serif text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/60">
                    +{f.pointsImpact} pts
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-light leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Drivers */}
        <div className="bg-rose-950/20 border border-rose-900/40 p-4">
          <div className="flex items-center space-x-2 text-rose-400 font-light text-[10px] uppercase tracking-[0.2em] mb-3">
            <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Risk Contributing Factors (- Points)</span>
          </div>

          <div className="space-y-2.5">
            {riskFactors.map((f, i) => (
              <div key={i} className="bg-[#1A1A1A] p-3 border border-rose-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-xs">{f.featureName}</span>
                  <span className="text-[10px] font-serif text-rose-400 bg-rose-950/80 px-2 py-0.5 border border-rose-800/60">
                    {f.pointsImpact} pts
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-light leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Business Interpretation Box */}
      <div className="bg-[#181818] border border-[#ffffff15] p-5 text-stone-200">
        <div className="flex items-center space-x-2 text-amber-300 font-light text-[10px] uppercase tracking-[0.25em] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Business Interpretation</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line font-light">
          {aiInterpretation}
        </p>
      </div>
    </div>
  );
};
