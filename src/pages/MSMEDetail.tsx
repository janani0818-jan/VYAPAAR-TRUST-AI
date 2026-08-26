import React, { useState, useEffect } from 'react';
import { MSMEProfile } from '../types';
import { api } from '../services/api';
import { TrustScoreGauge } from '../components/TrustScoreGauge';
import { HealthIndicatorCard } from '../components/HealthIndicatorCard';
import { ExplainabilityCard } from '../components/ExplainabilityCard';
import { ArrowLeft, FileText, Building2, ShieldCheck } from 'lucide-react';

interface MSMEDetailProps {
  msmeId: string;
  onBack: () => void;
  onOpenReportModal: (msme: MSMEProfile) => void;
}

export const MSMEDetail: React.FC<MSMEDetailProps> = ({ msmeId, onBack, onOpenReportModal }) => {
  const [profile, setProfile] = useState<MSMEProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const p = await api.getMSMEProfile(msmeId);
        setProfile(p);
      } catch (err) {
        console.error('Failed to fetch detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [msmeId]);

  if (loading || !profile) {
    return <div className="p-8 text-slate-500">Loading MSME Risk Profile...</div>;
  }

  const { analysis } = profile;
  const { components } = analysis;

  const indicatorsList = [
    components.financialStability,
    components.cashFlowHealth,
    components.gstCompliance,
    components.transactionConsistency,
    components.invoiceBehaviour,
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between border-b border-[#ffffff10] pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-light tracking-wider uppercase text-stone-300 hover:text-white bg-[#121212] border border-[#ffffff15] px-3.5 py-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>

        <button
          onClick={() => onOpenReportModal(profile)}
          className="border border-[#ffffff] text-white hover:bg-white hover:text-black text-xs font-light tracking-[0.2em] uppercase px-4 py-2 transition-colors flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Dossier</span>
        </button>
      </div>

      {/* Business Meta Banner */}
      <div className="bg-[#121212] p-6 border border-[#ffffff15] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[9px] font-light uppercase tracking-[0.2em] text-stone-300 bg-[#1A1A1A] px-2.5 py-1 border border-[#ffffff10]">
            {profile.sector}
          </span>
          <h1 className="text-2xl font-serif text-white mt-3 font-normal">{profile.companyName}</h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            GSTIN: <span className="text-stone-200 font-mono tracking-wider">{profile.gstin}</span> • Promoter: <span className="text-stone-200">{profile.ownerName}</span> • Location: {profile.location}
          </p>
        </div>

        <div className="flex items-center space-x-6 text-xs text-stone-400 font-light border-t md:border-t-0 md:border-l border-[#ffffff10] pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Annual Turnover</span>
            <p className="font-serif text-amber-300 text-sm mt-0.5 font-normal">₹{(profile.annualTurnover / 100000).toFixed(2)} Lakhs</p>
          </div>
          <div>
            <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Employees</span>
            <p className="font-serif text-white text-sm mt-0.5 font-normal">{profile.employeeCount} Staff</p>
          </div>
          <div>
            <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Incorporation</span>
            <p className="font-serif text-white text-sm mt-0.5 font-normal">{profile.incorporationYear}</p>
          </div>
        </div>
      </div>

      {/* Trust Gauge */}
      <TrustScoreGauge
        score={analysis.trustScore}
        riskLevel={analysis.riskLevel}
        creditReadinessPct={analysis.creditReadinessPct}
        companyName={profile.companyName}
        size="lg"
      />

      {/* 5 Pillars */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-[1px] w-6 bg-stone-600"></span>
          <h2 className="text-base font-serif font-normal text-white">5 Financial Health Pillars</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicatorsList.map((ind, idx) => (
            <HealthIndicatorCard key={idx} indicator={ind} />
          ))}
        </div>
      </div>

      {/* Explainability Drivers */}
      <ExplainabilityCard
        positiveFactors={analysis.positiveFactors}
        riskFactors={analysis.riskFactors}
        aiInterpretation={analysis.aiInterpretation}
      />
    </div>
  );
};
