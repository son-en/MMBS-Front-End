import { useState } from 'react';
import { AlertTriangle, Package, Search, Filter } from 'lucide-react';
import { mockBatches } from '../mockData';
import type { MilkBatch, MilkStatus } from '../types';
import { StatusBadge } from './StatusBadge';

const LOW_STOCK_THRESHOLD = 500;

export function InventoryDashboard() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MilkStatus | 'all'>('all');
  const [batches] = useState<MilkBatch[]>(mockBatches);

  const filtered = batches.filter(b => {
    const matchesSearch = b.batchId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const rawVol = batches.filter(b => b.status === 'raw').reduce((s, b) => s + b.volumeMl, 0);
  const quarantinedVol = batches.filter(b => b.status === 'quarantined').reduce((s, b) => s + b.volumeMl, 0);
  const pasteurizedVol = batches.filter(b => b.status === 'pasteurized').reduce((s, b) => s + b.volumeMl, 0);
  const rejectedVol = batches.filter(b => b.status === 'rejected').reduce((s, b) => s + b.volumeMl, 0);

  const isLowRaw = rawVol < LOW_STOCK_THRESHOLD;
  const isLowPasteurized = pasteurizedVol < LOW_STOCK_THRESHOLD;

  const kpiCards = [
    { label: 'Raw Stock', vol: rawVol, count: batches.filter(b => b.status === 'raw').length, status: 'raw' as MilkStatus, low: isLowRaw },
    { label: 'Quarantined', vol: quarantinedVol, count: batches.filter(b => b.status === 'quarantined').length, status: 'quarantined' as MilkStatus, low: false },
    { label: 'Ready Pasteurized', vol: pasteurizedVol, count: batches.filter(b => b.status === 'pasteurized').length, status: 'pasteurized' as MilkStatus, low: isLowPasteurized },
  ];

  const gradientStyle = (status: MilkStatus) => {
    if (status === 'raw') return 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(30,58,138,0.04))';
    if (status === 'quarantined') return 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(30,58,138,0.04))';
    return 'linear-gradient(135deg, rgba(14,116,144,0.08), rgba(30,58,138,0.04))';
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px]">
      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">Real-Time Inventory Dashboard</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Live milk stock levels and batch tracking</p>
      </div>

      {/* Alerts */}
      {(isLowRaw || isLowPasteurized) && (
        <div className="mb-4 md:mb-5 space-y-2">
          {isLowPasteurized && (
            <div className="flex items-start gap-2 md:gap-3 px-4 md:px-5 py-3 rounded-xl border-2 border-red-300 bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-red-700" style={{ fontWeight: 700, fontSize: '0.85rem' }}>CRITICAL LOW STOCK: </span>
                <span className="text-red-600" style={{ fontSize: '0.82rem' }}>
                  Ready Pasteurized stock is at {pasteurizedVol} mL — below the {LOW_STOCK_THRESHOLD} mL minimum threshold. Immediate action required.
                </span>
              </div>
            </div>
          )}
          {isLowRaw && (
            <div className="flex items-start gap-2 md:gap-3 px-4 md:px-5 py-3 rounded-xl border-2 border-amber-300 bg-amber-50">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-700" style={{ fontWeight: 700, fontSize: '0.85rem' }}>LOW INCOMING STOCK: </span>
                <span className="text-amber-600" style={{ fontSize: '0.82rem' }}>
                  Raw stock at {rawVol} mL — consider activating donor outreach programs.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards — 1-col on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5 md:mb-6">
        {kpiCards.map(card => (
          <div
            key={card.label}
            className="bg-white rounded-xl border p-5 md:p-6 shadow-sm"
            style={{
              background: gradientStyle(card.status),
              borderColor: card.low ? '#FCA5A5' : '#E5E7EB',
            }}
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <StatusBadge status={card.status} small />
              {card.low && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="text-gray-800" style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{card.vol}</div>
            <div className="text-gray-500 mt-0.5" style={{ fontSize: '0.8rem' }}>mL total volume</div>
            <div className="mt-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{card.count} batch{card.count !== 1 ? 'es' : ''}</span>
            </div>
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((card.vol / 1500) * 100, 100)}%`,
                  background: card.status === 'raw' ? '#EC4899' : card.status === 'quarantined' ? '#D97706' : '#0E7490',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Batch ID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
            style={{ fontSize: '0.875rem' }}
            onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
          {(['all', 'raw', 'quarantined', 'pasteurized', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg border transition-all capitalize"
              style={{
                background: filterStatus === s ? '#1E3A8A' : 'white',
                color: filterStatus === s ? 'white' : '#374151',
                borderColor: filterStatus === s ? '#1E3A8A' : '#E5E7EB',
                fontSize: '0.78rem',
                fontWeight: 500,
              }}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['Batch ID', 'CTN(s)', 'Volume (mL)', 'Created Date', 'Expiration Date', 'Temp (°C)', 'Lab Result', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch, i) => (
                <tr
                  key={batch.id}
                  style={{
                    background: batch.status === 'rejected' ? '#FFF5F5' : i % 2 === 0 ? '#FAFAFA' : 'white',
                    borderLeft: batch.status === 'rejected' ? '3px solid #FECACA' : '3px solid transparent',
                  }}
                >
                  <td className="px-4 py-3" style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1E3A8A' }}>{batch.batchId}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{batch.ctn}</td>
                  <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>{batch.volumeMl}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{batch.createdDate}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{batch.expirationDate}</td>
                  <td className="px-4 py-3 text-gray-600" style={{ fontSize: '0.8rem' }}>{batch.pasteurizationTemp ? `${batch.pasteurizationTemp}°C` : '—'}</td>
                  <td className="px-4 py-3">
                    {batch.labResult ? (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: batch.labResult === 'pass' ? '#0E7490' : batch.labResult === 'reject' ? '#991B1B' : '#92400E',
                      }}>
                        {batch.labResult.charAt(0).toUpperCase() + batch.labResult.slice(1)}
                      </span>
                    ) : <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>Pending</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={batch.status} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(batch => (
            <div
              key={batch.id}
              className="px-4 py-4"
              style={{
                background: batch.status === 'rejected' ? '#FFF5F5' : 'white',
                borderLeft: batch.status === 'rejected' ? '3px solid #FECACA' : 'none',
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                    {batch.batchId}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {batch.ctn}
                  </div>
                </div>
                <StatusBadge status={batch.status} small />
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Volume</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E3A8A' }}>{batch.volumeMl} mL</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Temperature</div>
                  <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                    {batch.pasteurizationTemp ? `${batch.pasteurizationTemp}°C` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Created</div>
                  <div style={{ fontSize: '0.8rem', color: '#374151' }}>{batch.createdDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Expiration</div>
                  <div style={{ fontSize: '0.8rem', color: '#374151' }}>{batch.expirationDate}</div>
                </div>
                <div className="col-span-2">
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Lab Result</div>
                  {batch.labResult ? (
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: batch.labResult === 'pass' ? '#0E7490' : batch.labResult === 'reject' ? '#991B1B' : '#92400E',
                    }}>
                      {batch.labResult.charAt(0).toUpperCase() + batch.labResult.slice(1)}
                    </span>
                  ) : <span className="text-gray-400" style={{ fontSize: '0.8rem' }}>Pending</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-gray-400" style={{ fontSize: '0.875rem' }}>No batches found matching your criteria.</div>
        )}
      </div>

      {/* Footer summary */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 px-2">
        <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>{filtered.length} of {batches.length} batches shown</span>
        <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>Total inventory: {batches.reduce((s, b) => s + (b.status !== 'rejected' ? b.volumeMl : 0), 0)} mL usable stock</span>
        <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>{rejectedVol} mL rejected / discarded</span>
      </div>
    </div>
  );
}
