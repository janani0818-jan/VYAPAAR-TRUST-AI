import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileSpreadsheet, Building2, CreditCard, QrCode, FileText, CheckCircle2, XCircle } from 'lucide-react';

export const FinancialProfile: React.FC = () => {
  const { currentMSME } = useAuth();
  const [activeTab, setActiveTab] = useState<'gst' | 'bank' | 'upi' | 'invoices'>('gst');

  if (!currentMSME) return <div className="p-8 text-slate-500">Loading Financial Profile...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#ffffff10] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">LEDGER & COMPLIANCE SIGNALS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Financial Profile & Raw Signals</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Underlying GST filings, bank statement ledgers, UPI merchant settlements, and trade receivables for {currentMSME.companyName}
        </p>
      </div>

      {/* Business Meta Summary Card */}
      <div className="bg-[#121212] p-6 border border-[#ffffff15] grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">GSTIN</span>
          <p className="text-sm font-serif text-white mt-1 font-normal tracking-wide">{currentMSME.gstin}</p>
        </div>
        <div>
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Sector</span>
          <p className="text-sm font-serif text-white mt-1 font-normal">{currentMSME.sector}</p>
        </div>
        <div>
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Promoter</span>
          <p className="text-sm font-serif text-white mt-1 font-normal">{currentMSME.ownerName}</p>
        </div>
        <div>
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Annual Turnover</span>
          <p className="text-sm font-serif text-amber-300 mt-1 font-normal">₹{(currentMSME.annualTurnover / 100000).toFixed(2)} Lakhs</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[#ffffff15] flex space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('gst')}
          className={`pb-3 text-xs font-light uppercase tracking-[0.15em] border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'gst'
              ? 'border-white text-white font-normal'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>GST Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`pb-3 text-xs font-light uppercase tracking-[0.15em] border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'bank'
              ? 'border-white text-white font-normal'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bank Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('upi')}
          className={`pb-3 text-xs font-light uppercase tracking-[0.15em] border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'upi'
              ? 'border-white text-white font-normal'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>UPI Footprint</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-xs font-light uppercase tracking-[0.15em] border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'border-white text-white font-normal'
              : 'border-transparent text-stone-500 hover:text-stone-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trade Invoices</span>
        </button>
      </div>

      {/* Tab Content Tables */}
      <div className="bg-[#121212] border border-[#ffffff15] overflow-hidden">
        {activeTab === 'gst' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F0F0F] border-b border-[#ffffff15] text-[10px] font-light text-stone-400 uppercase tracking-[0.2em]">
                  <th className="p-4">Month</th>
                  <th className="p-4">Turnover</th>
                  <th className="p-4">Tax Liability</th>
                  <th className="p-4">Tax Paid</th>
                  <th className="p-4">Filing Status</th>
                  <th className="p-4">Late Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffffff10] text-xs text-stone-300 font-light">
                {currentMSME.analysis.gstComplianceHistory.map((g, i) => (
                  <tr key={i} className="hover:bg-[#1A1A1A] transition">
                    <td className="p-4 font-serif text-white">{g.month}</td>
                    <td className="p-4 font-mono">₹{g.turnover.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-mono">₹{Math.round(g.turnover * 0.12).toLocaleString('en-IN')}</td>
                    <td className="p-4 font-mono">₹{Math.round(g.turnover * 0.12).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      {g.filedOnTime ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-light bg-emerald-950/60 px-2.5 py-0.5 border border-emerald-800/60 text-[9px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>On Time</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-400 font-light bg-rose-950/60 px-2.5 py-0.5 border border-rose-800/60 text-[9px] uppercase tracking-wider">
                          <XCircle className="w-3 h-3" />
                          <span>Delayed</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono">{g.lateDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="p-8 text-center text-xs text-stone-400 font-light space-y-2">
            <p className="font-serif text-white text-base font-normal">Bank Statement Ledger Analysis</p>
            <p className="max-w-md mx-auto leading-relaxed">
              Simulated current account ledger with 12-month transaction logs. Total monthly inflow averages ₹{(currentMSME.annualTurnover / 12).toFixed(0)} with continuous credit-to-debit ratio of {currentMSME.analysis.features.inflowOutflowRatio.toFixed(2)}x.
            </p>
          </div>
        )}

        {activeTab === 'upi' && (
          <div className="p-8 text-center text-xs text-stone-400 font-light space-y-2">
            <p className="font-serif text-white text-base font-normal">UPI & Digital Settlement Velocity</p>
            <p className="max-w-md mx-auto leading-relaxed">
              Digital footprint accounts for {currentMSME.analysis.features.digitalTxRatio.toFixed(0)}% of total transaction volume with average {Math.round(currentMSME.analysis.features.monthlyTxCount)} digital settlements per month.
            </p>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="p-8 text-center text-xs text-stone-400 font-light space-y-2">
            <p className="font-serif text-white text-base font-normal">Trade Receivables & Customer Concentration</p>
            <p className="max-w-md mx-auto leading-relaxed">
              Top customer concentration is {currentMSME.analysis.features.topCustomerConcentrationPct.toFixed(0)}% of total turnover. Average invoice collection delay is {currentMSME.analysis.features.avgPaymentDelayDays.toFixed(0)} days beyond agreed terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
