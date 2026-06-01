import { useState } from 'react';
import { TestTube2, ChevronDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockBatches, mockLabResults } from '../mockData';
import type { LabResult } from '../types';

const THRESHOLDS = {
  totalPlateCount: 10000,
  coliformCount: 20,
  phMin: 6.4,
  phMax: 7.2,
};

function computeResult(tpc: number, cc: number, ph: number): 'pass' | 'fail' {
  if (tpc > THRESHOLDS.totalPlateCount) return 'fail';
  if (cc > THRESHOLDS.coliformCount) return 'fail';
  if (ph < THRESHOLDS.phMin || ph > THRESHOLDS.phMax) return 'fail';
  return 'pass';
}

export function LabResultsPanel() {
  const [phase, setPhase] = useState<'pre' | 'post'>('pre');
  const [selectedBatch, setSelectedBatch] = useState(mockBatches[0]?.batchId || '');
  const [results, setResults] = useState<LabResult[]>(mockLabResults);
  const [form, setForm] = useState({ totalPlateCount: '', coliformCount: '', phBalance: '' });
  const [saved, setSaved] = useState(false);

  const batchResults = results.filter(r => r.batchId === selectedBatch);

  const tpc = parseFloat(form.totalPlateCount);
  const cc = parseFloat(form.coliformCount);
  const ph = parseFloat(form.phBalance);
  const projected = form.totalPlateCount && form.coliformCount && form.phBalance
    ? computeResult(tpc, cc, ph)
    : null;

  const tpcInvalid = form.totalPlateCount !== '' && tpc > THRESHOLDS.totalPlateCount;
  const ccInvalid = form.coliformCount !== '' && cc > THRESHOLDS.coliformCount;
  const phInvalid = form.phBalance !== '' && (ph < THRESHOLDS.phMin || ph > THRESHOLDS.phMax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResult: LabResult = {
      id: `lr${Date.now()}`,
      batchId: selectedBatch,
      phase,
      totalPlateCount: tpc,
      coliformCount: cc,
      phBalance: ph,
      result: computeResult(tpc, cc, ph),
      testedDate: new Date().toISOString().split('T')[0],
      testedBy: 'Nurse (Current Session)',
    };
    setResults(prev => [...prev, newResult]);
    setForm({ totalPlateCount: '', coliformCount: '', phBalance: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resultConfig = {
    pass: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    fail: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA', icon: <XCircle className="w-3.5 h-3.5" /> },
    pending: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="p-4 md:p-6 max-w-[1100px]">
      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">Lab Results Panel</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Microbial and chemical analysis — Pre & Post-Pasteurization evaluation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6">
        {/* Entry Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TestTube2 className="w-4 h-4 text-[#1E3A8A]" />
              <h3 className="text-gray-800">Log Lab Result</h3>
            </div>

            {saved && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700" style={{ fontSize: '0.8rem' }}>
                <CheckCircle className="w-4 h-4" /> Lab result saved.
              </div>
            )}

            {/* Phase Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              {(['pre', 'post'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className="flex-1 py-1.5 rounded-md transition-all"
                  style={{
                    background: phase === p ? 'white' : 'transparent',
                    color: phase === p ? '#1E3A8A' : '#6B7280',
                    fontSize: '0.8rem',
                    fontWeight: phase === p ? 700 : 400,
                    boxShadow: phase === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {p === 'pre' ? 'Pre-Pasteurization' : 'Post-Pasteurization'}
                </button>
              ))}
            </div>

            {/* Batch Selector */}
            <div className="mb-4">
              <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Target Batch *</label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={e => setSelectedBatch(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white appearance-none"
                  style={{ fontSize: '0.875rem' }}
                  onFocus={e => (e.target.style.borderColor = '#EC4899')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                >
                  {mockBatches.map(b => (
                    <option key={b.id} value={b.batchId}>{b.batchId} — {b.status.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Total Plate Count (cfu/mL) *
                  <span className="text-gray-400 ml-1" style={{ fontSize: '0.72rem', fontWeight: 400 }}>≤ 10,000</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.totalPlateCount}
                  onChange={e => setForm(f => ({ ...f, totalPlateCount: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={{
                    fontSize: '0.875rem',
                    border: `1.5px solid ${tpcInvalid ? '#FECACA' : '#E5E7EB'}`,
                    background: tpcInvalid ? '#FFF5F5' : 'white',
                  }}
                  onFocus={e => (e.target.style.borderColor = tpcInvalid ? '#F87171' : '#EC4899')}
                  onBlur={e => (e.target.style.borderColor = tpcInvalid ? '#FECACA' : '#E5E7EB')}
                />
                {tpcInvalid && <p className="mt-1 text-red-600" style={{ fontSize: '0.72rem' }}>⚠ Exceeds safe threshold of 10,000 cfu/mL</p>}
              </div>

              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Coliform Count (cfu/mL) *
                  <span className="text-gray-400 ml-1" style={{ fontSize: '0.72rem', fontWeight: 400 }}>≤ 20</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.coliformCount}
                  onChange={e => setForm(f => ({ ...f, coliformCount: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={{
                    fontSize: '0.875rem',
                    border: `1.5px solid ${ccInvalid ? '#FECACA' : '#E5E7EB'}`,
                    background: ccInvalid ? '#FFF5F5' : 'white',
                  }}
                  onFocus={e => (e.target.style.borderColor = ccInvalid ? '#F87171' : '#EC4899')}
                  onBlur={e => (e.target.style.borderColor = ccInvalid ? '#FECACA' : '#E5E7EB')}
                />
                {ccInvalid && <p className="mt-1 text-red-600" style={{ fontSize: '0.72rem' }}>⚠ Exceeds coliform pathogen limit of 20 cfu/mL</p>}
              </div>

              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  pH Balance *
                  <span className="text-gray-400 ml-1" style={{ fontSize: '0.72rem', fontWeight: 400 }}>6.4 – 7.2</span>
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min={0}
                  max={14}
                  value={form.phBalance}
                  onChange={e => setForm(f => ({ ...f, phBalance: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={{
                    fontSize: '0.875rem',
                    border: `1.5px solid ${phInvalid ? '#FECACA' : '#E5E7EB'}`,
                    background: phInvalid ? '#FFF5F5' : 'white',
                  }}
                  onFocus={e => (e.target.style.borderColor = phInvalid ? '#F87171' : '#EC4899')}
                  onBlur={e => (e.target.style.borderColor = phInvalid ? '#FECACA' : '#E5E7EB')}
                />
                {phInvalid && <p className="mt-1 text-red-600" style={{ fontSize: '0.72rem' }}>⚠ pH outside acceptable range (6.4 – 7.2)</p>}
              </div>

              {/* Live projection */}
              {projected && (
                <div className="rounded-lg px-4 py-3 border" style={{
                  background: projected === 'pass' ? '#F0FDF4' : '#FFF5F5',
                  borderColor: projected === 'pass' ? '#BBF7D0' : '#FECACA',
                }}>
                  <div className="flex items-center gap-2">
                    {projected === 'pass'
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <XCircle className="w-4 h-4 text-red-600" />}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: projected === 'pass' ? '#15803D' : '#991B1B' }}>
                      Projected Evaluation: {projected.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: projected === 'pass' ? '#15803D' : '#991B1B', marginTop: 4 }}>
                    {projected === 'pass' ? 'All parameters within safe limits. Batch may proceed.' : 'One or more parameters exceed safety thresholds.'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white transition-all"
                style={{ background: '#1E3A8A', fontSize: '0.875rem', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1E3A8A')}
              >
                Submit Lab Result
              </button>
            </form>
          </div>
        </div>

        {/* Results Table */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-[#1E3A8A]" />
              <h3 className="text-gray-800">Results for {selectedBatch || '—'}</h3>
              <span className="ml-auto text-gray-400" style={{ fontSize: '0.78rem' }}>{batchResults.length} records</span>
            </div>

            {batchResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#1E3A8A' }}>
                      {['Phase', 'TPC (cfu/mL)', 'Coliform (cfu/mL)', 'pH', 'Tested By', 'Date', 'Evaluation'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r, i) => {
                      const rc = resultConfig[r.result];
                      const isTpcHigh = r.totalPlateCount > THRESHOLDS.totalPlateCount;
                      const isCcHigh = r.coliformCount > THRESHOLDS.coliformCount;
                      const isPhOff = r.phBalance < THRESHOLDS.phMin || r.phBalance > THRESHOLDS.phMax;
                      return (
                        <tr key={r.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full" style={{
                              background: r.phase === 'pre' ? '#FFF0F7' : '#EFF6FF',
                              color: r.phase === 'pre' ? '#9D174D' : '#1E3A8A',
                              fontSize: '0.72rem', fontWeight: 700,
                            }}>
                              {r.phase === 'pre' ? 'Pre-Past.' : 'Post-Past.'}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ fontSize: '0.82rem', fontWeight: 600, color: isTpcHigh ? '#991B1B' : '#15803D' }}>
                            {r.totalPlateCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3" style={{ fontSize: '0.82rem', fontWeight: 600, color: isCcHigh ? '#991B1B' : '#15803D' }}>
                            {r.coliformCount}
                          </td>
                          <td className="px-4 py-3" style={{ fontSize: '0.82rem', fontWeight: 600, color: isPhOff ? '#991B1B' : '#15803D' }}>
                            {r.phBalance}
                          </td>
                          <td className="px-4 py-3 text-gray-600" style={{ fontSize: '0.78rem' }}>{r.testedBy}</td>
                          <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.75rem' }}>{r.testedDate}</td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border w-fit" style={{ background: rc.bg, color: rc.text, borderColor: rc.border, fontSize: '0.7rem', fontWeight: 700 }}>
                              {rc.icon} {r.result.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <TestTube2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>No lab results for this batch yet.</p>
                <p className="text-gray-300 mt-1" style={{ fontSize: '0.78rem' }}>Submit a result using the form on the left.</p>
              </div>
            )}
          </div>

          {/* Threshold Reference */}
          <div className="mt-4 bg-[#EFF6FF] rounded-xl border border-blue-100 p-4">
            <h4 className="text-[#1E3A8A] mb-2" style={{ fontSize: '0.8rem', fontWeight: 700 }}>DOH Biovigilance Thresholds</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Plate Count', limit: '≤ 10,000 cfu/mL' },
                { label: 'Coliform Count', limit: '≤ 20 cfu/mL' },
                { label: 'pH Balance', limit: '6.4 – 7.2' },
              ].map(t => (
                <div key={t.label} className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                  <div className="text-gray-500" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{t.label}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A' }}>{t.limit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
