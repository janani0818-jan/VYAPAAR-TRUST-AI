import React from 'react';
import { Download, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export const SampleDataDownloader: React.FC = () => {
  const downloadSample = (type: string) => {
    window.open(`/api/data/samples/${type}`, '_blank');
  };

  return (
    <div className="bg-[#121212] border border-[#ffffff15] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-medium text-white text-sm flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Download Sample Testing Datasets</span>
          </h3>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            Use these pre-formatted sample CSV templates to test automated feature extraction and recalculation engine.
          </p>
        </div>
        <span className="text-[9px] font-light bg-[#1A1A1A] text-stone-300 px-2.5 py-1 border border-[#ffffff10] uppercase tracking-widest">
          Demo Connector
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => downloadSample('gst')}
          className="flex items-center justify-between bg-[#1A1A1A] hover:bg-[#222222] border border-[#ffffff10] hover:border-[#ffffff25] p-3 transition text-left group"
        >
          <div>
            <div className="font-serif text-xs text-white group-hover:text-amber-300">GST_Data.csv</div>
            <div className="text-[10px] text-stone-500 font-light">GSTR-1 & 3B logs</div>
          </div>
          <Download className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300" />
        </button>

        <button
          onClick={() => downloadSample('bank')}
          className="flex items-center justify-between bg-[#1A1A1A] hover:bg-[#222222] border border-[#ffffff10] hover:border-[#ffffff25] p-3 transition text-left group"
        >
          <div>
            <div className="font-serif text-xs text-white group-hover:text-emerald-300">Bank_Txs.csv</div>
            <div className="text-[10px] text-stone-500 font-light">Current account ledger</div>
          </div>
          <Download className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-300" />
        </button>

        <button
          onClick={() => downloadSample('upi')}
          className="flex items-center justify-between bg-[#1A1A1A] hover:bg-[#222222] border border-[#ffffff10] hover:border-[#ffffff25] p-3 transition text-left group"
        >
          <div>
            <div className="font-serif text-xs text-white group-hover:text-purple-300">UPI_Txs.csv</div>
            <div className="text-[10px] text-stone-500 font-light">QR & settlements</div>
          </div>
          <Download className="w-3.5 h-3.5 text-stone-500 group-hover:text-purple-300" />
        </button>

        <button
          onClick={() => downloadSample('invoices')}
          className="flex items-center justify-between bg-[#1A1A1A] hover:bg-[#222222] border border-[#ffffff10] hover:border-[#ffffff25] p-3 transition text-left group"
        >
          <div>
            <div className="font-serif text-xs text-white group-hover:text-amber-300">Invoices.csv</div>
            <div className="text-[10px] text-stone-500 font-light">Trade receivables</div>
          </div>
          <Download className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300" />
        </button>
      </div>

      <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-stone-500 font-light">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Prototype mode: External APIs and data sources are simulated with deterministic synthetic schemas.</span>
      </div>
    </div>
  );
};
