import React, { useState, useEffect } from 'react';
import { MSMEProfile } from '../types';
import { api } from '../services/api';
import { ArrowLeft, GitCompare, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MSMECompareProps {
  selectedIds: string[];
  onBack: () => void;
}

export const MSMECompare: React.FC<MSMECompareProps> = ({ selectedIds, onBack }) => {
  const [profiles, setProfiles] = useState<MSMEProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadComparison() {
      try {
        const data = await api.compareMSMEs(selectedIds.length > 0 ? selectedIds : ['msme_abc_textiles', 'msme_sri_lakshmi', 'msme_greenleaf_agro']);
        setProfiles(data);
      } catch (err) {
        console.error('Failed to load comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [selectedIds]);

  if (loading || profiles.length === 0) {
    return <div className="p-8 text-slate-500">Loading Side-by-Side Comparison...</div>;
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low Risk':
        return <span className="bg-emerald-950/60 text-emerald-400 text-[9px] font-light px-2.5 py-0.5 border border-emerald-800/60 uppercase tracking-widest">Low Risk</span>;
      case 'Moderate Risk':
        return <span className="bg-amber-950/60 text-amber-300 text-[9px] font-light px-2.5 py-0.5 border border-amber-800/60 uppercase tracking-widest">Moderate Risk</span>;
      case 'Medium-High Risk':
        return <span className="bg-amber-950/80 text-amber-400 text-[9px] font-light px-2.5 py-0.5 border border-amber-700/80 uppercase tracking-widest">Medium-High Risk</span>;
      case 'High Risk':
        return <span className="bg-rose-950/60 text-rose-300 text-[9px] font-light px-2.5 py-0.5 border border-rose-800/60 uppercase tracking-widest">High Risk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-light tracking-wider uppercase text-stone-300 hover:text-white bg-[#121212] border border-[#ffffff15] px-3.5 py-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>

        <span className="text-[10px] font-light text-stone-400 uppercase tracking-widest bg-[#121212] px-3 py-1.5 border border-[#ffffff15]">
          Comparing {profiles.length} Selected Entities
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">COMPARATIVE UNDERWRITING MATRIX</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Side-by-Side Credit Comparison</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Comparative risk matrix across financial health pillars, compliance logs, and working capital indicators
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#121212] border border-[#ffffff15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0A0A] text-white text-xs font-serif border-b border-[#ffffff15]">
                <th className="p-4 w-56 font-normal uppercase tracking-widest text-[10px] text-stone-400 font-sans">Financial Metric</th>
                {profiles.map((p) => (
                  <th key={p.id} className="p-4 border-l border-[#ffffff15]">
                    <div className="font-normal text-sm text-white">{p.companyName}</div>
                    <div className="text-[10px] text-stone-500 font-sans font-light mt-0.5">{p.sector} • {p.location}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff10] text-xs text-stone-300 font-light">
              {/* Trust Score */}
              <tr className="bg-[#1A1A1A]">
                <td className="p-4 text-white font-serif italic font-normal text-sm">VyapaarTrust Score</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15]">
                    <span className="text-xl font-serif text-amber-300 font-normal">{p.analysis.trustScore}</span>
                    <span className="text-stone-500 text-xs font-sans"> / 100</span>
                  </td>
                ))}
              </tr>

              {/* Risk Classification */}
              <tr>
                <td className="p-4 text-stone-400">Risk Band</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15]">
                    {getRiskBadge(p.analysis.riskLevel)}
                  </td>
                ))}
              </tr>

              {/* Credit Readiness */}
              <tr>
                <td className="p-4 text-stone-400">Credit Readiness Rating</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] font-mono text-emerald-400">
                    {p.analysis.creditReadinessPct}%
                  </td>
                ))}
              </tr>

              {/* Financial Stability */}
              <tr>
                <td className="p-4 text-stone-400">Financial Stability (30%)</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200">
                    {p.analysis.components.financialStability.score}/100
                    <span className="block text-[10px] text-stone-500 font-light mt-0.5 font-mono">
                      CV {p.analysis.features.revenueCV.toFixed(1)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Cash Flow Health */}
              <tr>
                <td className="p-4 text-stone-400">Cash Flow Health (25%)</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200">
                    {p.analysis.components.cashFlowHealth.score}/100
                    <span className="block text-[10px] text-stone-500 font-light mt-0.5 font-mono">
                      Ratio {p.analysis.features.inflowOutflowRatio.toFixed(2)}x
                    </span>
                  </td>
                ))}
              </tr>

              {/* GST Compliance */}
              <tr>
                <td className="p-4 text-stone-400">GST Compliance (20%)</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200">
                    {p.analysis.components.gstCompliance.score}/100
                    <span className="block text-[10px] text-stone-500 font-light mt-0.5 font-mono">
                      On-time {p.analysis.features.gstFilingConsistencyPct.toFixed(0)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Transaction Consistency */}
              <tr>
                <td className="p-4 text-stone-400">Tx Consistency (15%)</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200">
                    {p.analysis.components.transactionConsistency.score}/100
                    <span className="block text-[10px] text-stone-500 font-light mt-0.5 font-mono">
                      Digital {p.analysis.features.digitalTxRatio.toFixed(0)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Invoice Behaviour */}
              <tr>
                <td className="p-4 text-stone-400">Invoice Behaviour (10%)</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200">
                    {p.analysis.components.invoiceBehaviour.score}/100
                    <span className="block text-[10px] text-stone-500 font-light mt-0.5 font-mono">
                      Delay {p.analysis.features.avgPaymentDelayDays.toFixed(0)} days
                    </span>
                  </td>
                ))}
              </tr>

              {/* Concentration Risk */}
              <tr>
                <td className="p-4 text-stone-400">Top Buyer Concentration</td>
                {profiles.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[#ffffff15] text-stone-200 font-mono">
                    {p.analysis.features.topCustomerConcentrationPct.toFixed(0)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
