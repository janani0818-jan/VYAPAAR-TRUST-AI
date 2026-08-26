import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrustScoreGauge } from '../components/TrustScoreGauge';
import { HealthIndicatorCard } from '../components/HealthIndicatorCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, FileText, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface MSMEDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const MSMEDashboard: React.FC<MSMEDashboardProps> = ({ onNavigate, onOpenReportModal }) => {
  const { currentMSME } = useAuth();

  if (!currentMSME) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading MSME Financial Profile...
      </div>
    );
  }

  const { analysis } = currentMSME;
  const { components } = analysis;

  const indicatorsList = [
    components.financialStability,
    components.cashFlowHealth,
    components.gstCompliance,
    components.transactionConsistency,
    components.invoiceBehaviour,
    {
      name: 'Business Stability',
      key: 'businessStability',
      score: Math.round((components.financialStability.score + components.gstCompliance.score) / 2),
      weightPct: 15,
      status: components.financialStability.status,
      shortExplanation: 'Composite stability combining revenue growth, operational scale, and regulatory tax compliance.',
      detail: 'Evaluates long-term enterprise sustainability across macroeconomic cycles.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ffffff10] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-[1px] w-8 bg-stone-600"></span>
            <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">FINANCIAL TRUST OVERVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">
            Good morning, {currentMSME.companyName}
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Business Financial Intelligence • GSTIN: <span className="text-stone-200 tracking-wider font-mono">{currentMSME.gstin}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('upload')}
            className="bg-[#161616] hover:bg-[#202020] text-stone-300 text-xs font-light tracking-wider uppercase px-4 py-2 border border-[#ffffff15] transition"
          >
            Upload Data
          </button>
          <button
            onClick={onOpenReportModal}
            className="border border-[#ffffff] text-white hover:bg-white hover:text-black text-xs font-light tracking-[0.2em] uppercase px-4 py-2 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Trust Score Card */}
      <TrustScoreGauge
        score={analysis.trustScore}
        riskLevel={analysis.riskLevel}
        creditReadinessPct={analysis.creditReadinessPct}
        companyName={currentMSME.companyName}
        size="lg"
      />

      {/* Financial Health Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-6 bg-stone-600"></span>
            <h2 className="text-base font-serif font-normal text-white">Financial Health Indicators</h2>
          </div>
          <span className="text-[10px] text-stone-500 font-light uppercase tracking-[0.2em]">6 Core Trust Pillars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicatorsList.map((ind, idx) => (
            <HealthIndicatorCard
              key={idx}
              indicator={ind}
              onClick={() => onNavigate('analysis')}
            />
          ))}
        </div>
      </div>

      {/* Financial Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-[#121212] p-6 border border-[#ffffff15]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-medium text-white text-sm">Revenue Trend (GSTR Turnover)</h3>
              <p className="text-xs text-stone-400 font-light">Monthly reported turnover over analyzed 12 months</p>
            </div>
            <span className="text-[10px] font-light text-emerald-400 bg-emerald-950/60 px-2.5 py-1 border border-emerald-800/60 uppercase tracking-widest">
              MoM Growth +{analysis.features.revenueGrowthMoM.toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.monthlyRevenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Turnover']}
                  contentStyle={{ backgroundColor: '#181818', borderColor: '#ffffff20', color: '#fff', fontSize: '12px', borderRadius: '0px' }}
                />
                <Line type="monotone" dataKey="turnover" stroke="#d4af37" strokeWidth={2} dot={{ r: 3, fill: '#d4af37' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Inflow vs Outflow Chart */}
        <div className="bg-[#121212] p-6 border border-[#ffffff15]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-medium text-white text-sm">Monthly Cash Flow Health</h3>
              <p className="text-xs text-stone-400 font-light">Bank Inflow vs Outflow comparative analysis</p>
            </div>
            <span className="text-[10px] font-light text-stone-300 bg-[#1A1A1A] px-2.5 py-1 border border-[#ffffff10] uppercase tracking-widest">
              Ratio {analysis.features.inflowOutflowRatio.toFixed(2)}x
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.monthlyCashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#181818', borderColor: '#ffffff20', color: '#fff', fontSize: '12px', borderRadius: '0px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#a3a3a3' }} />
                <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="outflow" name="Outflow" fill="#f43f5e" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Credit Readiness Overview Section */}
      <div className="bg-[#121212] p-6 border border-[#ffffff15] space-y-4">
        <div className="flex items-center justify-between border-b border-[#ffffff10] pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <h3 className="font-serif font-medium text-white text-base">Credit Readiness & Underwriting Rating</h3>
          </div>
          <span className="text-xs font-light text-amber-300 bg-amber-950/50 px-3 py-1 border border-amber-800/60 uppercase tracking-widest">
            {analysis.creditReadinessPct}% Credit Readiness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-light text-emerald-400 uppercase tracking-[0.25em] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Core Business Strengths</span>
            </h4>
            <div className="space-y-1.5 text-xs text-stone-300 font-light">
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-emerald-400 font-serif">•</span>
                <span>GSTR Filing Discipline at {analysis.features.gstFilingConsistencyPct.toFixed(0)}% on-time submission rate.</span>
              </div>
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-emerald-400 font-serif">•</span>
                <span>Positive working capital coverage ratio of {analysis.features.inflowOutflowRatio.toFixed(2)}x.</span>
              </div>
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-emerald-400 font-serif">•</span>
                <span>Active digital transaction volume with strong bank ledger transparency.</span>
              </div>
            </div>
          </div>

          {/* Key Improvement Areas */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-light text-amber-400 uppercase tracking-[0.25em] flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Score Improvement Opportunities</span>
            </h4>
            <div className="space-y-1.5 text-xs text-stone-300 font-light">
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-amber-400 font-serif">•</span>
                <span>Reduce invoice collection delays (current average {analysis.features.avgPaymentDelayDays.toFixed(0)} days).</span>
              </div>
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-amber-400 font-serif">•</span>
                <span>Smooth out seasonal cash flow spikes and maintain 1.5x minimum operating buffer.</span>
              </div>
              <div className="bg-[#1A1A1A] p-2.5 border border-[#ffffff10] flex items-start space-x-2">
                <span className="text-amber-400 font-serif">•</span>
                <span>Diversify customer portfolio to lower single-buyer concentration risk.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-light tracking-widest uppercase text-stone-300 hover:text-white flex items-center space-x-1 transition"
          >
            <span>View Actionable Recommendations</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
