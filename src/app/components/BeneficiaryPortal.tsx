import { useState } from 'react';
import { UserCheck, Plus, Paperclip, CheckCircle, AlertCircle, X, Building2, Thermometer } from 'lucide-react';
import { mockBeneficiaries, mockBatches } from '../mockData';
import type { Beneficiary, DispensingRecord } from '../types';
import { PriorityBadge } from './StatusBadge';

const FEE_PER_ML = 0.5;

const billingConfig: Record<string, { bg: string; text: string; border: string }> = {
  paid:    { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  pending: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  waived:  { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
};

export function BeneficiaryPortal() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);
  const [selected, setSelected] = useState<Beneficiary | null>(mockBeneficiaries[0]);
  const [showDispenseForm, setShowDispenseForm] = useState(false);
  const [dispenseForm, setDispenseForm] = useState({
    batchId: '',
    volumeMl: '',
    billingStatus: 'paid' as 'paid' | 'pending' | 'waived',
    coolerVerified: false,
    safetyCleared: false,
  });
  const [dispensed, setDispensed] = useState(false);

  // FEFO: sort by expiration date ascending
  const availableBatches = mockBatches
    .filter(b => b.status === 'pasteurized')
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

  const computedFee = dispenseForm.volumeMl ? parseFloat(dispenseForm.volumeMl) * FEE_PER_ML : 0;

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !dispenseForm.safetyCleared) return;

    const newRecord: DispensingRecord = {
      id: `d${Date.now()}`,
      beneficiaryId: selected.id,
      batchId: dispenseForm.batchId,
      volumeMl: parseFloat(dispenseForm.volumeMl),
      date: new Date().toISOString().split('T')[0],
      fee: dispenseForm.billingStatus === 'waived' ? 0 : computedFee,
      billingStatus: dispenseForm.billingStatus,
      safetyCleared: true,
    };

    setBeneficiaries(prev => prev.map(b => b.id === selected.id
      ? { ...b, dispensingHistory: [...b.dispensingHistory, newRecord] }
      : b
    ));
    setSelected(prev => prev ? { ...prev, dispensingHistory: [...prev.dispensingHistory, newRecord] } : null);
    setDispenseForm({ batchId: '', volumeMl: '', billingStatus: 'paid', coolerVerified: false, safetyCleared: false });
    setShowDispenseForm(false);
    setDispensed(true);
    setTimeout(() => setDispensed(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 md:mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">Beneficiary Queue & Fulfillment Desk</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>FEFO dispensing · Prescription verification · Billing management</p>
        </div>
      </div>

      {dispensed && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700" style={{ fontSize: '0.875rem' }}>
          <CheckCircle className="w-4 h-4" /> Milk dispensed successfully. Stock volume deducted.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Beneficiary List */}
        <div className="space-y-2 order-2 md:order-1">
          <h3 className="text-gray-700 mb-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Registered Beneficiaries</h3>
          {beneficiaries.map(ben => (
            <div
              key={ben.id}
              onClick={() => { setSelected(ben); setShowDispenseForm(false); }}
              className="bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-sm"
              style={{
                borderColor: selected?.id === ben.id ? '#1E3A8A' : '#E5E7EB',
                boxShadow: selected?.id === ben.id ? '0 0 0 2px rgba(30,58,138,0.2)' : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>{ben.infantName}</div>
                  <div className="text-gray-500" style={{ fontSize: '0.75rem' }}>Guardian: {ben.guardianName}</div>
                </div>
                {!ben.prescriptionAttached && (
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <PriorityBadge priority={ben.priority} />
                {ben.coolerCheckCompleted && (
                  <span className="flex items-center gap-1 text-teal-600" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    <Thermometer className="w-3 h-3" /> Cooler ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="md:col-span-2 order-1 md:order-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <UserCheck className="w-5 h-5 text-[#1E3A8A]" />
                    <h2 className="text-[#1E3A8A]">{selected.infantName}</h2>
                  </div>
                  <p className="text-gray-500" style={{ fontSize: '0.8rem' }}>Guardian: {selected.guardianName}</p>
                </div>
                <PriorityBadge priority={selected.priority} />
              </div>

              <div className="p-6 grid grid-cols-2 gap-5">
                {/* Beneficiary Info */}
                <div className="space-y-4">
                  {/* Clinic Assignment */}
                  <div className="flex items-start gap-2.5 px-3 py-2.5 bg-[#EFF6FF] rounded-lg border border-blue-100">
                    <Building2 className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-gray-500" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinic Assignment</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E3A8A' }}>{selected.clinicAssignment}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 mb-1" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical Needs</label>
                    <p className="text-gray-700 bg-[#F8FAFC] rounded-lg px-3 py-2.5" style={{ fontSize: '0.85rem' }}>{selected.clinicalNeeds}</p>
                  </div>

                  {/* Prescription & Cooler status */}
                  <div className="space-y-2">
                    {selected.prescriptionAttached ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <Paperclip className="w-4 h-4 text-green-600" />
                        <span className="text-green-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Prescription Attached & Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Prescription Required</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${selected.coolerCheckCompleted ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'}`}>
                      <Thermometer className={`w-4 h-4 ${selected.coolerCheckCompleted ? 'text-teal-600' : 'text-gray-400'}`} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: selected.coolerCheckCompleted ? '#0F766E' : '#9CA3AF' }}>
                        {selected.coolerCheckCompleted ? 'Insulated Cooler Verified' : 'Cooler Check Pending'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDispenseForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white transition-all"
                    style={{ background: '#1E3A8A', fontSize: '0.875rem', fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#1E3A8A')}
                  >
                    <Plus className="w-4 h-4" /> New Dispensing Order
                  </button>
                </div>

                {/* Dispensing History */}
                <div>
                  <label className="block text-gray-500 mb-2" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispensing History</label>
                  {selected.dispensingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {selected.dispensingHistory.map(record => {
                        const bs = billingConfig[record.billingStatus] || billingConfig.pending;
                        return (
                          <div key={record.id} className="bg-[#F8FAFC] rounded-lg px-3 py-2.5 border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A' }}>{record.batchId}</span>
                              <span className="px-2 py-0.5 rounded-full border capitalize" style={{ background: bs.bg, color: bs.text, borderColor: bs.border, fontSize: '0.68rem', fontWeight: 700 }}>
                                {record.billingStatus === 'paid' ? `₱${record.fee.toFixed(2)} Paid` : record.billingStatus === 'waived' ? 'Waived' : `₱${record.fee.toFixed(2)} Pending`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{record.volumeMl} mL · {record.date}</span>
                              {record.safetyCleared && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-6 bg-[#F8FAFC] rounded-lg border border-dashed border-gray-200" style={{ fontSize: '0.8rem' }}>
                      No dispensing records yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-400" style={{ fontSize: '0.875rem' }}>
              Select a beneficiary from the list to view details
            </div>
          )}
        </div>
      </div>

      {/* Dispense Modal */}
      {showDispenseForm && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) setShowDispenseForm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#1E3A8A]">FEFO Checkout — Release Order</h2>
              <button onClick={() => setShowDispenseForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500 mb-4" style={{ fontSize: '0.8rem' }}>
              Beneficiary: <strong>{selected.infantName}</strong> · Guardian: {selected.guardianName}
            </p>
            {availableBatches.length > 0 && (
              <div className="mb-4 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg" style={{ fontSize: '0.75rem', color: '#0F766E' }}>
                Batches sorted by FEFO — oldest expiry dispatched first.
              </div>
            )}

            <form onSubmit={handleDispense} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Batch (FEFO) *</label>
                <select
                  required
                  value={dispenseForm.batchId}
                  onChange={e => setDispenseForm(f => ({ ...f, batchId: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
                  style={{ fontSize: '0.875rem' }}
                  onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                >
                  <option value="">Select available batch...</option>
                  {availableBatches.map(b => (
                    <option key={b.id} value={b.batchId}>
                      {b.batchId} — {b.volumeMl} mL · Exp: {b.expirationDate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Volume to Dispense (mL) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={dispenseForm.volumeMl}
                  onChange={e => setDispenseForm(f => ({ ...f, volumeMl: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
                  style={{ fontSize: '0.875rem' }}
                  onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                />
              </div>

              {/* Billing Status */}
              <div>
                <label className="block mb-2 text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Billing Status *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['paid', 'pending', 'waived'] as const).map(s => {
                    const cfg = billingConfig[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDispenseForm(f => ({ ...f, billingStatus: s }))}
                        className="py-2 rounded-lg border capitalize transition-all"
                        style={{
                          background: dispenseForm.billingStatus === s ? cfg.bg : 'white',
                          color: dispenseForm.billingStatus === s ? cfg.text : '#6B7280',
                          borderColor: dispenseForm.billingStatus === s ? cfg.border : '#E5E7EB',
                          fontSize: '0.8rem',
                          fontWeight: dispenseForm.billingStatus === s ? 700 : 400,
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {dispenseForm.volumeMl && dispenseForm.billingStatus !== 'waived' && (
                <div className="bg-[#F0FDF4] border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700" style={{ fontSize: '0.85rem' }}>Processing Fee (auto-calculated)</span>
                    <span className="text-green-800" style={{ fontSize: '1rem', fontWeight: 700 }}>₱{computedFee.toFixed(2)}</span>
                  </div>
                  <p className="text-green-600 mt-0.5" style={{ fontSize: '0.72rem' }}>Rate: ₱{FEE_PER_ML}/mL × {dispenseForm.volumeMl} mL</p>
                </div>
              )}
              {dispenseForm.billingStatus === 'waived' && (
                <div className="bg-[#EFF6FF] border border-blue-200 rounded-lg px-4 py-3">
                  <span className="text-blue-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Fee waived — no charge applied to guardian.</span>
                </div>
              )}

              {/* Cooler check */}
              <label className="flex items-start gap-3 cursor-pointer bg-teal-50 border border-teal-200 rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={dispenseForm.coolerVerified}
                  onChange={e => setDispenseForm(f => ({ ...f, coolerVerified: e.target.checked }))}
                  style={{ accentColor: '#0E7490', width: 16, height: 16, marginTop: 2 }}
                  required
                />
                <div>
                  <span className="text-teal-800" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Insulated Cooler Verified *</span>
                  <p className="text-teal-600 mt-0.5" style={{ fontSize: '0.72rem' }}>Guardian has presented a compliant insulated cooler for safe transport.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer bg-[#FFFBEB] border border-amber-200 rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={dispenseForm.safetyCleared}
                  onChange={e => setDispenseForm(f => ({ ...f, safetyCleared: e.target.checked }))}
                  style={{ accentColor: '#D97706', width: 16, height: 16, marginTop: 2 }}
                  required
                />
                <div>
                  <span className="text-amber-800" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Safety Clearance Verified *</span>
                  <p className="text-amber-600 mt-0.5" style={{ fontSize: '0.73rem' }}>I confirm that all safety protocols have been followed and this release is clinically appropriate.</p>
                </div>
              </label>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDispenseForm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!dispenseForm.safetyCleared || !dispenseForm.coolerVerified}
                  className="flex-1 py-2.5 rounded-lg text-white transition-all disabled:opacity-50"
                  style={{ background: '#1E3A8A', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  Release Milk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
