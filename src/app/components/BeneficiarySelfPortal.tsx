import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockBatches, mockBeneficiaries } from '../mockData';
import type { User as UserType } from '../types';
import { StatusBadge } from './StatusBadge';

interface BeneficiarySelfPortalProps {
  currentUser: UserType;
}

export function BeneficiarySelfPortal({ currentUser }: BeneficiarySelfPortalProps) {
  const beneficiary = mockBeneficiaries.find(b => b.guardianName.split(' ').slice(-1)[0] === currentUser.name.split(' ').slice(-1)[0]) || mockBeneficiaries[0];
  const availableBatches = mockBatches.filter(b => b.status === 'pasteurized');
  const pendingBatches = mockBatches.filter(b => b.status === 'quarantined');

  const priorityLabel = { 1: 'Priority 1 — Critical NICU', 2: 'Priority 2 — High Need', 3: 'Priority 3 — Standard' }[beneficiary.priority];
  const priorityColor = { 1: '#991B1B', 2: '#92400E', 3: '#15803D' }[beneficiary.priority];
  const priorityBg = { 1: '#FEF2F2', 2: '#FFFBEB', 3: '#F0FDF4' }[beneficiary.priority];

  return (
    <div className="p-4 md:p-6 max-w-[900px]">
      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">Milk Availability Portal</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Check available milk stock and your pickup schedule</p>
      </div>

      {/* Beneficiary Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 mb-4 md:mb-5">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#1E3A8A] flex items-center justify-center text-white flex-shrink-0" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {beneficiary.infantName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-800 mb-1">{beneficiary.infantName}</h2>
            <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>Guardian: {beneficiary.guardianName}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full border" style={{ background: priorityBg, color: priorityColor, borderColor: priorityColor + '33', fontSize: '0.72rem', fontWeight: 700 }}>
                {priorityLabel}
              </span>
              {beneficiary.prescriptionAttached
                ? <span className="flex items-center gap-1 text-green-600" style={{ fontSize: '0.75rem', fontWeight: 600 }}><CheckCircle className="w-3.5 h-3.5" /> Prescription on file</span>
                : <span className="flex items-center gap-1 text-amber-600" style={{ fontSize: '0.75rem', fontWeight: 600 }}><AlertCircle className="w-3.5 h-3.5" /> Prescription needed</span>}
            </div>
          </div>
          <div className="md:ml-auto">
            <div className="text-right">
              <div className="text-gray-500" style={{ fontSize: '0.75rem' }}>Total Received</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>
                {beneficiary.dispensingHistory.reduce((s, d) => s + d.volumeMl, 0)} mL
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Available Now */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <h3 className="text-gray-800">Available Now</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-teal-100 text-teal-700" style={{ fontSize: '0.72rem', fontWeight: 700 }}>{availableBatches.length} batches</span>
          </div>

          {availableBatches.length > 0 ? (
            <div className="space-y-3">
              {availableBatches.map(batch => (
                <div key={batch.id} className="bg-[#F0FDFA] rounded-lg p-3 border border-teal-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0E7490' }}>{batch.batchId}</span>
                    <StatusBadge status={batch.status} small />
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span style={{ fontSize: '0.78rem' }}>Volume: <strong className="text-gray-700">{batch.volumeMl} mL</strong></span>
                    <span style={{ fontSize: '0.75rem' }}>Expires: {batch.expirationDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400" style={{ fontSize: '0.82rem' }}>
              No batches currently available. You will receive an SMS when new stock is ready.
            </div>
          )}
        </div>

        {/* Pending Lab Clearance */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="text-gray-800">Pending Lab Clearance</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-700" style={{ fontSize: '0.72rem', fontWeight: 700 }}>{pendingBatches.length} batches</span>
          </div>

          {pendingBatches.length > 0 ? (
            <div className="space-y-3">
              {pendingBatches.map(batch => (
                <div key={batch.id} className="bg-[#FFFBEB] rounded-lg p-3 border border-amber-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#92400E' }}>{batch.batchId}</span>
                    <StatusBadge status={batch.status} small />
                  </div>
                  <p className="text-amber-600" style={{ fontSize: '0.75rem' }}>Awaiting microbial lab results. We will notify you when cleared.</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400" style={{ fontSize: '0.82rem' }}>No batches pending lab clearance.</div>
          )}
        </div>
      </div>

      {/* Pickup Schedule */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-gray-800">My Dispensing History</h3>
        </div>
        {beneficiary.dispensingHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#1E3A8A' }}>
                  {['Batch', 'Volume', 'Date', 'Processing Fee', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {beneficiary.dispensingHistory.map((record, i) => (
                  <tr key={record.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                    <td className="px-4 py-2.5 text-[#1E3A8A]" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{record.batchId}</td>
                    <td className="px-4 py-2.5 text-gray-700" style={{ fontSize: '0.82rem' }}>{record.volumeMl} mL</td>
                    <td className="px-4 py-2.5 text-gray-500" style={{ fontSize: '0.8rem' }}>{record.date}</td>
                    <td className="px-4 py-2.5" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#15803D' }}>₱{record.fee.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-green-600" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400" style={{ fontSize: '0.82rem' }}>No dispensing history yet.</div>
        )}
      </div>
    </div>
  );
}
