import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ExplainabilityCard } from '../components/ExplainabilityCard';
import { TrustScoreGauge } from '../components/TrustScoreGauge';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { BrainCircuit, Sliders, ShieldCheck } from 'lucide-react';

export const TrustAnalysis: React.FC = () => {
  const { currentMSME } = useAuth();

  if (!currentMSME) return <div className="p-8 text-slate-500">Loading Analysis...</div>;

  const { analysis } = currentMSME;

  const radarData = [
    { subject: 'Financial Stability', A: analysis.components.financialStability.score, fullMark: 100 },
    { subject: 'Cash Flow Health', A: analysis.components.cashFlowHealth.score, fullMark: 100 },
    { subject: 'GST Compliance', A: analysis.components.gstCompliance.score, fullMark: 100 },
    { subject: 'Tx Consistency', A: analysis.components.transactionConsistency.score, fullMark: 100 },
    { subject: 'Invoice Behaviour', A: analysis.components.invoiceBehaviour.score, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#ffffff10] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">EXPLAINABLE AI & FEATURE DECOMPOSITION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Trust Score & Risk Intelligence Analysis</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          In-depth mathematical feature decomposition and SHAP factor analysis for {currentMSME.companyName}
        </p>
      </div>

      {/* Trust Gauge Overview */}
      <TrustScoreGauge
        score={analysis.trustScore}
        riskLevel={analysis.riskLevel}
        creditReadinessPct={analysis.creditReadinessPct}
        companyName={currentMSME.companyName}
        size="md"
      />

      {/* SHAP Explainability & AI Interpretation Card */}
      <ExplainabilityCard
        positiveFactors={analysis.positiveFactors}
        riskFactors={analysis.riskFactors}
        aiInterpretation={analysis.aiInterpretation}
      />

      {/* Radar Chart & Feature Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-[#121212] p-6 border border-[#ffffff15] flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-medium text-white text-sm mb-1">Financial Pillar Balance (Radar Profile)</h3>
            <p className="text-xs text-stone-400 font-light mb-4">Multi-dimensional evaluation across 5 credit health dimensions</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10, fontFamily: 'serif' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" fontSize={9} />
                <Radar name={currentMSME.companyName} dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Sensitivity Table */}
        <div className="bg-[#121212] p-6 border border-[#ffffff15] space-y-4">
          <div>
            <h3 className="font-serif font-medium text-white text-sm">Extracted Quantitative Features</h3>
            <p className="text-xs text-stone-400 font-light">Key financial variables evaluated by scoring engine</p>
          </div>

          <div className="divide-y divide-[#ffffff10] text-xs font-light">
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Turnover Variation (CV)</span>
              <span className="font-mono text-white">{analysis.features.revenueCV.toFixed(1)}%</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Inflow / Outflow Ratio</span>
              <span className="font-mono text-white">{analysis.features.inflowOutflowRatio.toFixed(2)}x</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">GST On-time Filing Rate</span>
              <span className="font-mono text-white">{analysis.features.gstFilingConsistencyPct.toFixed(0)}%</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Avg GST Late Days</span>
              <span className="font-mono text-white">{analysis.features.avgGstLateDays.toFixed(1)} days</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Avg Invoice Payment Delay</span>
              <span className="font-mono text-white">{analysis.features.avgPaymentDelayDays.toFixed(0)} days</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Top Buyer Concentration</span>
              <span className="font-mono text-white">{analysis.features.topCustomerConcentrationPct.toFixed(0)}%</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-400">Digital Settlement Footprint</span>
              <span className="font-mono text-white">{analysis.features.digitalTxRatio.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
