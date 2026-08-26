import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SampleDataDownloader } from '../components/SampleDataDownloader';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Play } from 'lucide-react';

interface DataUploadProps {
  onUploadSuccess: () => void;
}

export const DataUpload: React.FC<DataUploadProps> = ({ onUploadSuccess }) => {
  const { currentMSME, refreshCurrentMSME } = useAuth();
  const [dataType, setDataType] = useState<'gst' | 'bank' | 'upi' | 'invoices'>('gst');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<Array<{ step: string; done: boolean }>>([
    { step: 'File uploaded & parsed', done: false },
    { step: 'Records & headers validated', done: false },
    { step: 'Financial features extracted', done: false },
    { step: 'Risk indicators & feature drivers calculated', done: false },
    { step: 'Trust Score & Credit Readiness generated', done: false },
  ]);

  if (!currentMSME) return <div className="p-8 text-slate-500">Loading Upload Module...</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleProcessUpload = async () => {
    if (!fileContent.trim()) {
      setError('Please select or paste CSV data before processing.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Reset processing steps
    setProcessingSteps((steps) => steps.map((s) => ({ ...s, done: false })));

    try {
      // Simulate step-by-step progress visually
      for (let i = 0; i < 5; i++) {
        await new Promise((res) => setTimeout(res, 200));
        setProcessingSteps((steps) =>
          steps.map((s, idx) => (idx <= i ? { ...s, done: true } : s))
        );
      }

      const res = await api.uploadData(currentMSME.id, dataType, fileContent);
      await refreshCurrentMSME();
      setSuccessMsg(res.message);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Data processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#ffffff10] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">DATA INGESTION & FEATURE ENGINEERING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Data Upload & Feature Connector</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Upload custom financial CSV records to run real-time feature extraction and Trust Score recalculation
        </p>
      </div>

      {/* Sample Downloaders */}
      <SampleDataDownloader />

      {/* Main Upload Box */}
      <div className="bg-[#121212] p-6 border border-[#ffffff15] space-y-6">
        <div className="flex items-center justify-between border-b border-[#ffffff10] pb-4">
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-amber-300" />
            <h3 className="font-serif font-medium text-white text-sm">Select Dataset Category to Ingest</h3>
          </div>
          <span className="text-xs text-stone-400 font-light">Target Entity: <strong className="text-white font-normal">{currentMSME.companyName}</strong></span>
        </div>

        {/* Category Radio Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'gst', label: 'GST Returns', desc: 'GSTR-1 / 3B Turnover' },
            { id: 'bank', label: 'Bank Statements', desc: 'Current account ledger' },
            { id: 'upi', label: 'UPI Transactions', desc: 'Digital settlements' },
            { id: 'invoices', label: 'Invoices', desc: 'Trade receivables' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setDataType(cat.id as any);
                setFileContent('');
                setFileName('');
              }}
              className={`p-3.5 border text-left transition ${
                dataType === cat.id
                  ? 'border-[#ffffff40] bg-[#1A1A1A] text-white'
                  : 'border-[#ffffff10] bg-[#0F0F0F] hover:bg-[#161616] text-stone-400'
              }`}
            >
              <div className="font-serif text-xs font-normal text-white">{cat.label}</div>
              <div className="text-[10px] text-stone-500 font-light mt-0.5">{cat.desc}</div>
            </button>
          ))}
        </div>

        {/* File Drag-and-Drop Area */}
        <div className="border border-dashed border-[#ffffff20] hover:border-[#ffffff40] p-8 text-center transition bg-[#0A0A0A]">
          <FileSpreadsheet className="w-8 h-8 text-stone-500 mx-auto mb-3" />
          <p className="text-xs font-serif text-white mb-1">
            {fileName ? `Loaded: ${fileName}` : `Upload ${dataType.toUpperCase()} CSV File`}
          </p>
          <p className="text-[11px] text-stone-500 font-light mb-4">Click to browse or drag and drop standard CSV file</p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file-input"
          />

          <label
            htmlFor="csv-file-input"
            className="inline-flex items-center space-x-2 border border-[#ffffff30] hover:bg-white hover:text-black text-white text-[10px] tracking-[0.2em] uppercase font-light px-4 py-2 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Browse CSV File</span>
          </label>
        </div>

        {/* CSV Preview / Manual Paste Textarea */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-light text-stone-400 uppercase tracking-[0.25em]">
            Raw CSV Data Input & Live Editor
          </label>
          <textarea
            rows={5}
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            placeholder={`month,gst_filed,filing_date,tax_liability,tax_paid,turnover,late_days\n2026-05,true,2026-05-18,120000,120000,1000000,0`}
            className="w-full bg-[#050505] text-stone-200 font-mono text-xs p-4 border border-[#ffffff15] focus:outline-none focus:border-[#ffffff40]"
          />
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 p-3 text-xs flex items-center space-x-2 font-light">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 p-4 text-xs space-y-1 font-light">
            <div className="flex items-center space-x-2 font-serif text-sm text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <p className="text-stone-400">
              Financial features, risk classification, explainability drivers, and recommendations recalculated live!
            </p>
          </div>
        )}

        {/* Processing Status Checklist */}
        {loading && (
          <div className="bg-[#0A0A0A] border border-[#ffffff15] text-stone-200 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-serif text-amber-300 mb-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Running Feature Engineering Engine...</span>
            </div>
            {processingSteps.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-light">
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-stone-700 shrink-0" />
                )}
                <span className={step.done ? 'text-stone-200' : 'text-stone-500'}>{step.step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleProcessUpload}
            disabled={loading}
            className="border border-[#ffffff] text-white hover:bg-white hover:text-black text-xs font-light tracking-[0.2em] uppercase px-6 py-3 transition-colors flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Process Dataset & Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
