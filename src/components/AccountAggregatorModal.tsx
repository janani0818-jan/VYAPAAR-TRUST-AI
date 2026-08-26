import React, { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, Lock, KeyRound, X } from 'lucide-react';

interface AccountAggregatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountAggregatorModal: React.FC<AccountAggregatorModalProps> = ({ isOpen, onClose }) => {
  const [consentGranted, setConsentGranted] = useState(true);
  const [durationMonths, setDurationMonths] = useState(12);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#121212] max-w-xl w-full border border-[#ffffff20] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-[#0A0A0A] text-white p-6 flex items-center justify-between border-b border-[#ffffff15]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1A1A1A] border border-[#ffffff15] flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-light uppercase tracking-[0.2em] bg-[#1A1A1A] text-amber-300 px-2 py-0.5 border border-amber-800/40">
                  Prototype / Simulated Integration
                </span>
              </div>
              <h3 className="font-serif font-medium text-base text-white mt-1">Account Aggregator Consent Flow</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-stone-300">
          {/* Architecture Step Flow Diagram */}
          <div className="bg-[#0A0A0A] border border-[#ffffff10] p-4">
            <span className="text-[9px] font-light text-stone-400 uppercase tracking-[0.25em] block mb-3">
              Consent-Driven Financial Data Pipeline
            </span>

            <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-light">
              <div className="bg-[#1A1A1A] p-2 border border-[#ffffff10] text-stone-200">
                <span className="block font-medium text-amber-300">1. User Consent</span>
                <span className="text-[8px] text-stone-500 block mt-0.5">Permissions Granted</span>
              </div>
              <div className="bg-[#1A1A1A] p-2 border border-[#ffffff10] text-stone-200">
                <span className="block font-medium text-amber-300">2. Simulated Access</span>
                <span className="text-[8px] text-stone-500 block mt-0.5">Bank / GST / UPI</span>
              </div>
              <div className="bg-[#1A1A1A] p-2 border border-[#ffffff10] text-stone-200">
                <span className="block font-medium text-amber-300">3. Data Analysis</span>
                <span className="text-[8px] text-stone-500 block mt-0.5">Feature Extraction</span>
              </div>
              <div className="bg-[#1A1A1A] p-2 border border-[#ffffff10] text-stone-200">
                <span className="block font-medium text-amber-300">4. Trust Intelligence</span>
                <span className="text-[8px] text-stone-500 block mt-0.5">Score & Risk</span>
              </div>
            </div>
          </div>

          {/* Consent Details */}
          <div className="space-y-3 text-xs font-light">
            <p className="text-stone-200">
              VyapaarTrust AI requests consent to retrieve financial statements for automated credit risk analysis:
            </p>

            <div className="space-y-2 bg-[#0A0A0A] p-3.5 border border-[#ffffff10]">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>GST Return Statements (GSTR-1, GSTR-3B filings)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bank Current Account Statements (Encrypted ledger)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Digital UPI Merchant Settlement Volume</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Trade Receivables & Invoice Settlement Ledger</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-stone-300">Consent Validity Duration:</span>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="bg-[#0A0A0A] border border-[#ffffff20] text-xs text-white p-2 font-mono"
              >
                <option value={6}>6 Months</option>
                <option value={12}>12 Months (Recommended)</option>
                <option value={24}>24 Months</option>
              </select>
            </div>
          </div>

          {/* Security & Disclaimer */}
          <div className="flex items-start space-x-2.5 text-[11px] text-stone-400 bg-[#0A0A0A] p-3 border border-[#ffffff10]">
            <Lock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-normal uppercase tracking-wider block mb-0.5">Prototype Simulation Notice</strong>
              This application operates in simulated hackathon prototype mode using deterministic connectors. It does not maintain live production connections to RBI Account Aggregator network APIs.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#0A0A0A] p-4 border-t border-[#ffffff15] flex items-center justify-between">
          <button
            onClick={() => {
              setConsentGranted(false);
              onClose();
            }}
            className="text-xs font-light text-stone-400 hover:text-white uppercase tracking-wider px-3 py-2 transition"
          >
            Revoke Consent
          </button>

          <button
            onClick={() => {
              setConsentGranted(true);
              onClose();
            }}
            className="border border-[#ffffff] text-white hover:bg-white hover:text-black text-xs font-light tracking-[0.2em] uppercase px-5 py-2.5 transition-colors flex items-center space-x-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Grant Demo Consent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

