import { useState } from 'react';
import {
  FlaskConical, Thermometer, Clock, AlertTriangle, ChevronRight,
  ArrowLeft, Droplets, Activity, CheckCircle2, XCircle,
} from 'lucide-react';
import type { CollectionRecord } from '../types';

const TEMP_MIN = 62.5;
const TEMP_MAX = 63.0;
const MINUTES = [0, 15, 30];

const RAW_COLLECTIONS: CollectionRecord[] = [
  { id: 'r1', ctn: 'CTN-2024-0106', dtn: 'DTN-2024-008', donorName: 'Esperanza Villanueva', volumeMl: 195, arrivalTempC: 4.3, collectionDate: '2024-04-14', program: 'moms_act' },
  { id: 'r2', ctn: 'CTN-2024-0109', dtn: 'DTN-2024-001', donorName: 'Maria Santos', volumeMl: 165, arrivalTempC: 4.0, collectionDate: '2024-04-18', program: 'milky_way' },
  { id: 'r3', ctn: 'CTN-2024-0110', dtn: 'DTN-2024-002', donorName: 'Ana Reyes', volumeMl: 210, arrivalTempC: 3.9, collectionDate: '2024-04-18', program: 'supsup_todo' },
  { id: 'r4', ctn: 'CTN-2024-0111', dtn: 'DTN-2024-004', donorName: 'Cecilia Mendoza', volumeMl: 180, arrivalTempC: 4.4, collectionDate: '2024-04-17', program: 'moms_act' },
  { id: 'r5', ctn: 'CTN-2024-0112', dtn: 'DTN-2024-005', donorName: 'Rosario Dela Cruz', volumeMl: 220, arrivalTempC: 4.1, collectionDate: '2024-04-17', program: 'milky_way' },
  { id: 'r6', ctn: 'CTN-2024-0113', dtn: 'DTN-2024-007', donorName: 'Dolores Ramos', volumeMl: 155, arrivalTempC: 3.7, collectionDate: '2024-04-18', program: 'supsup_todo' },
];

const PROGRAM_LABELS: Record<string, string> = {
  milky_way: 'Milky Way',
  supsup_todo: 'Sup-Sup Todo',
  moms_act: "Mom's ACT",
};

function generateBatchId() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `BATCH-${stamp}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

type Checkpoint = { minute: number; value: string; deviation: boolean };
type BatchDraft = {
  batchId: string;
  collections: CollectionRecord[];
  startTime: string;
  endTime: string;
  checkpoints: Checkpoint[];
};

const CheckIcon = () => (
  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PasteurizationBoard() {
  const [activeTab, setActiveTab] = useState<'pooling' | 'logger'>('pooling');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showWarning, setShowWarning] = useState(false);
  const [batchDraft, setBatchDraft] = useState<BatchDraft | null>(null);
  const [completed, setCompleted] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setShowWarning(false);
  };

  const toggleAll = () => {
    setSelectedIds(prev =>
      prev.size === RAW_COLLECTIONS.length ? new Set() : new Set(RAW_COLLECTIONS.map(c => c.id))
    );
    setShowWarning(false);
  };

  const handleProceed = () => {
    if (selectedIds.size < 2) {
      setShowWarning(true);
      return;
    }
    const cols = RAW_COLLECTIONS.filter(c => selectedIds.has(c.id));
    setBatchDraft({
      batchId: generateBatchId(),
      collections: cols,
      startTime: '',
      endTime: '',
      checkpoints: MINUTES.map(m => ({ minute: m, value: '', deviation: false })),
    });
    setCompleted(false);
    setActiveTab('logger');
  };

  const updateCheckpoint = (minute: number, value: string) => {
    const num = parseFloat(value);
    const deviation = value !== '' && !isNaN(num) && (num < TEMP_MIN || num > TEMP_MAX);
    setBatchDraft(p => p ? {
      ...p,
      checkpoints: p.checkpoints.map(c => c.minute === minute ? { ...c, value, deviation } : c),
    } : null);
  };

  const handleComplete = () => setCompleted(true);

  const handleBackToPooling = () => {
    setActiveTab('pooling');
    setBatchDraft(null);
    setCompleted(false);
  };

  const hasDeviation = batchDraft?.checkpoints.some(c => c.deviation) ?? false;
  const totalVolume = batchDraft?.collections.reduce((s, c) => s + c.volumeMl, 0) ?? 0;
  const selectedVolume = RAW_COLLECTIONS.filter(c => selectedIds.has(c.id)).reduce((s, c) => s + c.volumeMl, 0);

  return (
    <div className="p-4 md:p-6 max-w-[1300px]">

      {/* Page Header */}
      <div className="mb-4 md:mb-5 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-[#1E3A8A]">Pasteurization Manager</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
            Holder Method (62.5–63.0°C · 30 min) · Biovigilance Workflow Engine
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 w-fit" style={{ fontSize: '0.75rem' }}>
          <Activity className="w-3.5 h-3.5" />
          UC-04 Processing Module
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-0 mb-5 md:mb-6 border-b border-gray-200 overflow-x-auto">
        {/* Workflow step indicator */}
        <div className="flex items-center mr-2 md:mr-4">
          <div className="flex items-center gap-1 md:gap-2 mr-2 md:mr-4">
            <div
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-3 cursor-pointer relative whitespace-nowrap"
              onClick={() => setActiveTab('pooling')}
              style={{ color: activeTab === 'pooling' ? '#EC4899' : '#6B7280' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: activeTab === 'pooling' ? '#EC4899' : '#E5E7EB',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >1</div>
              <Droplets className="w-4 h-4 hidden md:block" />
              <span style={{ fontSize: '0.8rem', fontWeight: activeTab === 'pooling' ? 700 : 400 }} className="hidden sm:inline">
                Raw Milk Pooling
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: activeTab === 'pooling' ? 700 : 400 }} className="sm:hidden">
                Pooling
              </span>
              {selectedIds.size > 0 && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ background: '#FFF0F7', color: '#EC4899', fontSize: '0.65rem', fontWeight: 700 }}
                >
                  {selectedIds.size}
                </span>
              )}
              {activeTab === 'pooling' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EC4899]" />
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300" />

            <div
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-3 relative whitespace-nowrap"
              onClick={() => batchDraft && setActiveTab('logger')}
              style={{
                color: activeTab === 'logger' ? '#EC4899' : batchDraft ? '#6B7280' : '#D1D5DB',
                cursor: batchDraft ? 'pointer' : 'default',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: activeTab === 'logger' ? '#EC4899' : batchDraft ? '#6B7280' : '#E5E7EB',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >2</div>
              <Thermometer className="w-4 h-4 hidden md:block" />
              <span style={{ fontSize: '0.8rem', fontWeight: activeTab === 'logger' ? 700 : 400 }} className="hidden sm:inline">
                Holder Pasteurization Logger
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: activeTab === 'logger' ? 700 : 400 }} className="sm:hidden">
                Logger
              </span>
              {hasDeviation && activeTab === 'logger' && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: '#FFFBEB', color: '#92400E', fontSize: '0.65rem', fontWeight: 700, border: '1px solid #FDE68A' }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  DEVIATION
                </span>
              )}
              {activeTab === 'logger' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EC4899]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TAB 1: RAW MILK POOLING ─── */}
      {activeTab === 'pooling' && (
        <div>
          {/* Warning Banner */}
          {showWarning && (
            <div className="flex items-start gap-3 px-5 py-4 mb-5 rounded-xl border-2 border-red-200 bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#B91C1C' }}>Pooling Action Denied</p>
                <p style={{ fontSize: '0.82rem', color: '#DC2626', marginTop: 2 }}>
                  A minimum of <strong>2</strong> raw milk collection containers must be selected to create a consolidated
                  processing batch. Currently selected: <strong>{selectedIds.size}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>
                Unprocessed Raw Stock — Intake Queue
              </p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.75rem' }}>
                {RAW_COLLECTIONS.length} containers available · Select 2 or more to begin batch pooling
              </p>
            </div>

            <button
              onClick={handleProceed}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all w-full md:w-auto"
              style={{
                background: selectedIds.size >= 2 ? '#1E3A8A' : '#9CA3AF',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: selectedIds.size >= 2 ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => {
                if (selectedIds.size >= 2) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#EC4899';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(236,72,153,0.45)';
                }
              }}
              onMouseLeave={e => {
                if (selectedIds.size >= 2) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1E3A8A';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }
              }}
            >
              <FlaskConical className="w-4 h-4" />
              Proceed to Batch Pooling
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full">
              <thead>
                <tr style={{ background: '#1E3A8A' }}>
                  <th className="px-4 py-3" style={{ width: 44 }}>
                    <button
                      onClick={toggleAll}
                      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: 'rgba(255,255,255,0.6)',
                        background: selectedIds.size === RAW_COLLECTIONS.length ? '#EC4899' : 'transparent',
                      }}
                    >
                      {selectedIds.size === RAW_COLLECTIONS.length && <CheckIcon />}
                    </button>
                  </th>
                  {['CTN', 'DTN', 'Donor Name', 'Volume (mL)', 'Arrival Temp (°C)', 'Program', 'Collection Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAW_COLLECTIONS.map((c, i) => {
                  const sel = selectedIds.has(c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => toggleSelect(c.id)}
                      className="cursor-pointer transition-all"
                      style={{
                        background: sel ? '#FFF0F7' : i % 2 === 0 ? '#FAFAFA' : 'white',
                        borderLeft: `3px solid ${sel ? '#EC4899' : 'transparent'}`,
                      }}
                      onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLTableRowElement).style.background = '#F0F4FF'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = sel ? '#FFF0F7' : i % 2 === 0 ? '#FAFAFA' : 'white'; }}
                    >
                      <td className="px-4 py-3">
                        <div
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                          style={{ borderColor: sel ? '#EC4899' : '#D1D5DB', background: sel ? '#EC4899' : 'white' }}
                        >
                          {sel && <CheckIcon />}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A' }}>{c.ctn}</td>
                      <td className="px-4 py-3 text-gray-600" style={{ fontSize: '0.8rem' }}>{c.dtn}</td>
                      <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.8rem' }}>{c.donorName}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
                          style={{ background: '#FFF0F7', color: '#9D174D', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          <Droplets className="w-3 h-3" />
                          {c.volumeMl} mL
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full"
                          style={{
                            background: c.arrivalTempC <= 4.0 ? '#ECFEFF' : '#FFF7ED',
                            color: c.arrivalTempC <= 4.0 ? '#0E7490' : '#C2410C',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          {c.arrivalTempC}°C
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                          style={{ fontSize: '0.72rem', fontWeight: 600 }}
                        >
                          {PROGRAM_LABELS[c.program] || c.program}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem' }}>{c.collectionDate}</td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="md:hidden">
              {/* Select all button */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-[#1E3A8A]"
                  style={{ fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: selectedIds.size === RAW_COLLECTIONS.length ? '#EC4899' : '#D1D5DB',
                      background: selectedIds.size === RAW_COLLECTIONS.length ? '#EC4899' : 'white',
                    }}
                  >
                    {selectedIds.size === RAW_COLLECTIONS.length && <CheckIcon />}
                  </div>
                  Select All ({selectedIds.size}/{RAW_COLLECTIONS.length})
                </button>
              </div>

              {/* Cards */}
              <div className="divide-y divide-gray-100">
                {RAW_COLLECTIONS.map(c => {
                  const sel = selectedIds.has(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSelect(c.id)}
                      className="px-4 py-4"
                      style={{
                        background: sel ? '#FFF0F7' : 'white',
                        borderLeft: sel ? '3px solid #EC4899' : 'none',
                      }}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ borderColor: sel ? '#EC4899' : '#D1D5DB', background: sel ? '#EC4899' : 'white' }}
                          >
                            {sel && <CheckIcon />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                              {c.ctn}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>
                              {c.dtn} · {c.donorName}
                            </div>
                          </div>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: '#FFF0F7', color: '#9D174D', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          <Droplets className="w-3 h-3" />
                          {c.volumeMl} mL
                        </span>
                      </div>

                      {/* Card Details */}
                      <div className="grid grid-cols-2 gap-3 pl-8">
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Temp</div>
                          <span
                            className="inline-block px-2 py-0.5 rounded-full mt-1"
                            style={{
                              background: c.arrivalTempC <= 4.0 ? '#ECFEFF' : '#FFF7ED',
                              color: c.arrivalTempC <= 4.0 ? '#0E7490' : '#C2410C',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {c.arrivalTempC}°C
                          </span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Date</div>
                          <div style={{ fontSize: '0.8rem', color: '#374151', marginTop: 2 }}>{c.collectionDate}</div>
                        </div>
                        <div className="col-span-2">
                          <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Program</div>
                          <span
                            className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 mt-1"
                            style={{ fontSize: '0.72rem', fontWeight: 600 }}
                          >
                            {PROGRAM_LABELS[c.program] || c.program}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selection Footer */}
          {selectedIds.size > 0 && (
            <div
              className="mt-4 flex items-center gap-3 px-5 py-3.5 rounded-xl border"
              style={{ background: '#FFF0F7', borderColor: '#FBCFE8' }}
            >
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse flex-shrink-0" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#9D174D' }}>
                {selectedIds.size} container{selectedIds.size > 1 ? 's' : ''} selected ·{' '}
                Combined volume: <strong>{selectedVolume} mL</strong>
                {selectedIds.size < 2 && (
                  <span style={{ color: '#DB2777', marginLeft: 8 }}>
                    (Select {2 - selectedIds.size} more to enable pooling)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: HOLDER PASTEURIZATION LOGGER ─── */}
      {activeTab === 'logger' && batchDraft && (
        <div>
          {/* Back + Batch Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <button
                onClick={handleBackToPooling}
                className="flex items-center gap-1.5 transition-colors"
                style={{ fontSize: '0.82rem', color: '#6B7280' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#1E3A8A'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Pooling
              </button>
              <span className="text-gray-300 select-none">|</span>
              <FlaskConical className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-[#1E3A8A]" style={{ fontSize: '1.05rem' }}>{batchDraft.batchId}</h2>

              {/* Dynamic Status Badge */}
              {completed ? (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid #6EE7B7' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Holder Log Complete
                </span>
              ) : hasDeviation ? (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: '#FFFBEB', color: '#92400E', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid #FDE68A' }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Temperature Deviation — Hold
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: '#ECFEFF', color: '#0E7490', fontSize: '0.75rem', fontWeight: 700, border: '1.5px solid #A5F3FC' }}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Holder Method — Active
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              {batchDraft.collections.length} containers pooled · {totalVolume} mL
            </div>
          </div>

          {/* Deviation Alert Banner */}
          {hasDeviation && !completed && (
            <div
              className="flex items-start gap-2 md:gap-3 px-4 md:px-5 py-3 md:py-4 mb-4 md:mb-5 rounded-xl border-2"
              style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400E' }}>
                  Temperature Deviation Detected — Batch on Hold
                </p>
                <p style={{ fontSize: '0.82rem', color: '#B45309', marginTop: 2 }}>
                  One or more temperature checkpoints are outside the mandatory Holder Method range of{' '}
                  <strong>{TEMP_MIN}–{TEMP_MAX}°C</strong>. Automated batch completion is blocked.
                  Review flagged readings and consult senior staff before proceeding.
                </p>
              </div>
            </div>
          )}

          {/* Completion Banner */}
          {completed && (
            <div
              className="flex items-start gap-2 md:gap-3 px-4 md:px-5 py-3 md:py-4 mb-4 md:mb-5 rounded-xl border-2"
              style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#15803D' }}>
                  Holder Pasteurization Log Completed
                </p>
                <p style={{ fontSize: '0.82rem', color: '#16A34A', marginTop: 2 }}>
                  Batch <strong>{batchDraft.batchId}</strong> has been logged successfully. All checkpoints were within the
                  62.5–63.0°C Holder Method range. Batch is pending lab testing before final approval.
                </p>
              </div>
            </div>
          )}

          {/* Main Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-4 md:gap-5">

            {/* LEFT: Batch Config + Pooled Collections */}
            <div className="space-y-4">

              {/* Batch Configuration Card */}
              <div className="rounded-xl border border-blue-100 p-4 md:p-5" style={{ background: '#EFF6FF' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E3A8A', marginBottom: 14 }}>
                  Batch Configuration
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block mb-1.5"
                        style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        Batch Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                        <input
                          type="time"
                          value={batchDraft.startTime}
                          onChange={e => setBatchDraft(p => p ? { ...p, startTime: e.target.value } : null)}
                          className="w-full pl-8 pr-2 py-2 rounded-lg border border-blue-200 bg-white outline-none"
                          style={{ fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block mb-1.5"
                        style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        Batch End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                        <input
                          type="time"
                          value={batchDraft.endTime}
                          onChange={e => setBatchDraft(p => p ? { ...p, endTime: e.target.value } : null)}
                          className="w-full pl-8 pr-2 py-2 rounded-lg border border-blue-200 bg-white outline-none"
                          style={{ fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto-summed Volume */}
                  <div>
                    <label
                      className="block mb-1.5"
                      style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Consolidated Target Volume (Auto-Summed)
                    </label>
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 bg-white"
                    >
                      <Droplets className="w-3.5 h-3.5 text-pink-400" />
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1E3A8A' }}>{totalVolume} mL</span>
                      <span className="ml-auto" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                        from {batchDraft.collections.length} containers
                      </span>
                    </div>
                  </div>

                  {/* Batch ID */}
                  <div>
                    <label
                      className="block mb-1.5"
                      style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Auto-Generated Batch ID
                    </label>
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 bg-white"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                        {batchDraft.batchId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pooled Collections List */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
                <h3 style={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', marginBottom: 10 }}>
                  Pooled Collections ({batchDraft.collections.length})
                </h3>
                <div className="space-y-2">
                  {batchDraft.collections.map(c => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: '#F8FAFC' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E3A8A' }}>{c.ctn}</span>
                        <span className="ml-2" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.dtn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.donorName.split(' ').at(-1)}</span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ background: '#FFF0F7', color: '#9D174D', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                          {c.volumeMl} mL
                        </span>
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded-lg mt-1"
                    style={{ background: '#EFF6FF', borderTop: '1px dashed #BFDBFE' }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E3A8A' }}>Total</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full"
                      style={{ background: '#1E3A8A', color: 'white', fontSize: '0.78rem', fontWeight: 700 }}
                    >
                      {totalVolume} mL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Temperature Checkpoints */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                    Live Temperature Checkpoints
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 2 }}>
                    Mandatory benchmark: {TEMP_MIN}–{TEMP_MAX}°C sustained over 30 minutes
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 w-fit">
                  <Thermometer className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1E3A8A' }}>3 readings</span>
                </div>
              </div>

              {/* Column Headers - hidden on mobile */}
              <div className="hidden md:grid mb-2 px-1" style={{ gridTemplateColumns: '72px 1fr 120px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minute</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: 16 }}>Temperature Input</span>
                <span className="text-right" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
              </div>

              {/* Checkpoints */}
              <div className="space-y-2 flex-1">
                {batchDraft.checkpoints.map(cp => {
                  const num = parseFloat(cp.value);
                  const hasVal = cp.value !== '' && !isNaN(num);
                  const inRange = hasVal && !cp.deviation;
                  const isDeviation = hasVal && cp.deviation;

                  return (
                    <div
                      key={cp.minute}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 md:px-4 py-3 md:py-2.5 rounded-xl border transition-all"
                      style={{
                        background: isDeviation ? '#FFFBEB' : inRange ? '#F0FDF4' : '#F8FAFC',
                        borderColor: isDeviation ? '#FDE68A' : inRange ? '#BBF7D0' : '#E5E7EB',
                      }}
                    >
                      {/* Mobile: Minute + Status row */}
                      <div className="flex sm:hidden items-center justify-between mb-1">
                        <div
                          className="flex items-center justify-center py-1 px-3 rounded-lg"
                          style={{
                            background: isDeviation ? '#FEF3C7' : inRange ? '#DCFCE7' : '#E5E7EB',
                            color: isDeviation ? '#92400E' : inRange ? '#15803D' : '#6B7280',
                          }}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{cp.minute}m</span>
                        </div>
                        {/* Mobile Status */}
                        <div className="flex justify-end">
                          {isDeviation && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                              style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.62rem', fontWeight: 700 }}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              DEVIATION
                            </span>
                          )}
                          {inRange && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                              style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.62rem', fontWeight: 700 }}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              IN RANGE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Desktop: Minute pill */}
                      <div
                        className="hidden sm:flex flex-shrink-0 w-16 items-center justify-center py-1 rounded-lg"
                        style={{
                          background: isDeviation ? '#FEF3C7' : inRange ? '#DCFCE7' : '#E5E7EB',
                          color: isDeviation ? '#92400E' : inRange ? '#15803D' : '#6B7280',
                        }}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{cp.minute}m</span>
                      </div>

                      {/* Input */}
                      <div className="relative flex-1">
                        <Thermometer
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                          style={{ color: isDeviation ? '#D97706' : inRange ? '#16A34A' : '#9CA3AF' }}
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder={`${TEMP_MIN}–${TEMP_MAX}`}
                          value={cp.value}
                          disabled={completed}
                          onChange={e => updateCheckpoint(cp.minute, e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg border outline-none transition-all"
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: hasVal ? 700 : 400,
                            borderColor: isDeviation ? '#FCD34D' : inRange ? '#86EFAC' : '#E2E8F0',
                            background: completed ? '#F9FAFB' : 'white',
                            color: isDeviation ? '#92400E' : inRange ? '#15803D' : '#374151',
                          }}
                        />
                      </div>

                      {/* Desktop Status */}
                      <div className="hidden sm:flex flex-shrink-0 w-28 justify-end">
                        {isDeviation && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.62rem', fontWeight: 700 }}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            DEVIATION
                          </span>
                        )}
                        {inRange && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.62rem', fontWeight: 700 }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            IN RANGE
                          </span>
                        )}
                        {!hasVal && (
                          <span style={{ fontSize: '0.72rem', color: '#D1D5DB' }}>Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reference Guide */}
              <div
                className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-100"
                style={{ background: '#EFF6FF' }}
              >
                <Thermometer className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <p style={{ fontSize: '0.75rem', color: '#1E3A8A' }}>
                  <strong>Holder Method Standard (WHO / DOH):</strong> Maintain{' '}
                  <strong>62.5–63.0°C</strong> continuously for <strong>30 minutes</strong>.
                  Any reading outside this range flags the batch for review and blocks automated completion.
                </p>
              </div>

              {/* Complete / Blocked Button */}
              {!completed ? (
                <button
                  onClick={handleComplete}
                  disabled={hasDeviation}
                  className="w-full mt-4 py-3 rounded-xl text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    background: hasDeviation ? '#9CA3AF' : '#1E3A8A',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: hasDeviation ? 'not-allowed' : 'pointer',
                    opacity: hasDeviation ? 0.65 : 1,
                  }}
                  onMouseEnter={e => { if (!hasDeviation) { (e.currentTarget as HTMLButtonElement).style.background = '#EC4899'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(236,72,153,0.4)'; } }}
                  onMouseLeave={e => { if (!hasDeviation) { (e.currentTarget as HTMLButtonElement).style.background = '#1E3A8A'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; } }}
                >
                  {hasDeviation ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Completion Blocked — Temperature Deviation
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Holder Pasteurization Log
                    </>
                  )}
                </button>
              ) : (
                <div
                  className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: '#F0FDF4', border: '2px solid #86EFAC' }}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803D' }}>
                    Pasteurization Log Saved — Pending Lab Testing
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
