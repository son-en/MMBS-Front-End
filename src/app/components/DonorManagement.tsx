import { useState } from 'react';
import { Plus, Search, X, AlertCircle, CheckCircle, User, ChevronDown } from 'lucide-react';
import type { Donor, OperationalProgram } from '../types';
import { mockDonors } from '../mockData';

const programLabels: Record<OperationalProgram, string> = {
  supsup_todo: 'Supsup Todo',
  milky_way: 'Milky Way',
  moms_act: "Mom's Act",
};

const programColors: Record<OperationalProgram, { bg: string; text: string }> = {
  milky_way: { bg: '#EFF6FF', text: '#1E3A8A' },
  supsup_todo: { bg: '#FFF0F7', text: '#9D174D' },
  moms_act: { bg: '#F0FDF4', text: '#15803D' },
};

export function DonorManagement() {
  const [donors, setDonors] = useState<Donor[]>(mockDonors);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    operationalProgram: 'milky_way' as OperationalProgram,
    medicalStatus: 'eligible' as Donor['medicalStatus'],
    consentSigned: false,
  });
  const [saved, setSaved] = useState(false);

  const filtered = donors.filter(d => {
    const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || d.dtn.toLowerCase().includes(search.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonor: Donor = {
      id: String(donors.length + 1),
      dtn: `DTN-2024-${String(donors.length + 1).padStart(3, '0')}`,
      firstName: form.firstName,
      lastName: form.lastName,
      registrationDate: new Date().toISOString().split('T')[0],
      medicalStatus: form.medicalStatus,
      operationalProgram: form.operationalProgram,
      eligibilityState: form.medicalStatus === 'eligible' ? 'active' : 'on_hold',
      consentSigned: form.consentSigned,
      hivStatus: 'pending',
      hepBStatus: 'pending',
    };
    setDonors(prev => [...prev, newDonor]);
    setShowModal(false);
    setSaved(true);
    setForm({ firstName: '', lastName: '', operationalProgram: 'milky_way', medicalStatus: 'eligible', consentSigned: false });
    setTimeout(() => setSaved(false), 3000);
  };

  const medicalStatusConfig: Record<Donor['medicalStatus'], { bg: string; text: string; border: string; label: string }> = {
    eligible: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Eligible' },
    temp_deferred: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA', label: 'Temp. Deferred' },
    permanently_deferred: { bg: '#FEF2F2', text: '#7F1D1D', border: '#FCA5A5', label: 'Perm. Deferred' },
    inactive: { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB', label: 'Inactive' },
  };

  const eligibilityConfig: Record<Donor['eligibilityState'], { bg: string; text: string; label: string }> = {
    active: { bg: '#ECFEFF', text: '#0E7490', label: 'Active' },
    on_hold: { bg: '#FFFBEB', text: '#92400E', label: 'On Hold' },
    terminated: { bg: '#FFF5F5', text: '#991B1B', label: 'Terminated' },
  };

  const serologicalConfig = (status: 'negative' | 'pending' | 'flagged') => ({
    negative: { color: '#15803D', label: '−' },
    pending: { color: '#92400E', label: '?' },
    flagged: { color: '#991B1B', label: '⚑' },
  }[status]);

  return (
    <div className="p-4 md:p-6 max-w-[1300px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">Donor Records</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Registered breast milk donor directory with serological tracking</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all w-full md:w-auto"
          style={{ background: '#EC4899', fontWeight: 600, fontSize: '0.875rem' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#DB2777')}
          onMouseLeave={e => (e.currentTarget.style.background = '#EC4899')}
        >
          <Plus className="w-4 h-4" /> Register Donor
        </button>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700" style={{ fontSize: '0.82rem' }}>
          <CheckCircle className="w-4 h-4" /> Donor profile saved to database.
        </div>
      )}

      <div className="relative mb-4 md:mb-5 max-w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or DTN..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
          style={{ fontSize: '0.875rem' }}
          onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
          onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['DTN', 'First Name', 'Last Name', 'Medical Status', 'Operational Program', 'Eligibility State', 'HIV', 'Hep-B', 'Consent'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-white" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((donor, i) => {
                const isDeferred = donor.medicalStatus === 'temp_deferred' || donor.medicalStatus === 'permanently_deferred';
                const medStyle = medicalStatusConfig[donor.medicalStatus];
                const eligStyle = eligibilityConfig[donor.eligibilityState];
                const progStyle = programColors[donor.operationalProgram];
                return (
                  <tr
                    key={donor.id}
                    style={{
                      background: isDeferred ? '#FFF5F5' : i % 2 === 0 ? '#FAFAFA' : 'white',
                      borderLeft: isDeferred ? '3px solid #FCA5A5' : '3px solid transparent',
                    }}
                  >
                    <td className="px-3 py-3" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A' }}>{donor.dtn}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#FFF0F7] flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-[#EC4899]" />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1F2937' }}>{donor.firstName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{donor.lastName}</td>
                    <td className="px-3 py-3">
                      {isDeferred && <AlertCircle className="w-3 h-3 text-red-500 inline mr-1" />}
                      <span className="px-2 py-0.5 rounded-full border" style={{ background: medStyle.bg, color: medStyle.text, borderColor: medStyle.border, fontSize: '0.7rem', fontWeight: 700 }}>
                        {medStyle.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full" style={{ background: progStyle.bg, color: progStyle.text, fontSize: '0.7rem', fontWeight: 600 }}>
                        {programLabels[donor.operationalProgram]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full border" style={{ background: eligStyle.bg, color: eligStyle.text, borderColor: eligStyle.bg, fontSize: '0.7rem', fontWeight: 600 }}>
                        {eligStyle.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: serologicalConfig(donor.hivStatus).color }}>
                        {serologicalConfig(donor.hivStatus).label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: serologicalConfig(donor.hepBStatus).color }}>
                        {serologicalConfig(donor.hepBStatus).label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {donor.consentSigned
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <X className="w-4 h-4 text-red-400" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(donor => {
            const isDeferred = donor.medicalStatus === 'temp_deferred' || donor.medicalStatus === 'permanently_deferred';
            const medStyle = medicalStatusConfig[donor.medicalStatus];
            const eligStyle = eligibilityConfig[donor.eligibilityState];
            const progStyle = programColors[donor.operationalProgram];
            return (
              <div
                key={donor.id}
                className="px-4 py-4"
                style={{
                  background: isDeferred ? '#FFF5F5' : 'white',
                  borderLeft: isDeferred ? '3px solid #FCA5A5' : 'none',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>{donor.dtn}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#FFF0F7] flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-[#EC4899]" />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>
                        {donor.firstName} {donor.lastName}
                      </span>
                    </div>
                  </div>
                  {isDeferred && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full border" style={{ background: medStyle.bg, color: medStyle.text, borderColor: medStyle.border, fontSize: '0.7rem', fontWeight: 700 }}>
                    {medStyle.label}
                  </span>
                  <span className="px-2 py-1 rounded-full" style={{ background: progStyle.bg, color: progStyle.text, fontSize: '0.7rem', fontWeight: 600 }}>
                    {programLabels[donor.operationalProgram]}
                  </span>
                  <span className="px-2 py-1 rounded-full border" style={{ background: eligStyle.bg, color: eligStyle.text, borderColor: eligStyle.bg, fontSize: '0.7rem', fontWeight: 600 }}>
                    {eligStyle.label}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginBottom: 2 }}>HIV</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: serologicalConfig(donor.hivStatus).color }}>
                      {serologicalConfig(donor.hivStatus).label}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginBottom: 2 }}>Hep-B</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: serologicalConfig(donor.hepBStatus).color }}>
                      {serologicalConfig(donor.hepBStatus).label}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginBottom: 2 }}>Consent</div>
                    {donor.consentSigned
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <X className="w-5 h-5 text-red-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-gray-400" style={{ fontSize: '0.875rem' }}>No donors found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center md:justify-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="h-full bg-white shadow-2xl overflow-y-auto w-full md:w-auto" style={{ maxWidth: '100%', width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 440, padding: '32px 28px' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[#1E3A8A]">Register New Donor</h2>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.78rem' }}>Onboarding drawer — complete all required fields</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>First Name *</label>
                  <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none" style={{ fontSize: '0.875rem' }} onFocus={e => (e.target.style.borderColor = '#EC4899')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
                </div>
                <div>
                  <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Last Name *</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none" style={{ fontSize: '0.875rem' }} onFocus={e => (e.target.style.borderColor = '#EC4899')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Operational Program *</label>
                <div className="space-y-2">
                  {(['milky_way', 'supsup_todo', 'moms_act'] as OperationalProgram[]).map(p => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="program" value={p} checked={form.operationalProgram === p} onChange={() => setForm(f => ({ ...f, operationalProgram: p }))} style={{ accentColor: '#EC4899', width: 15, height: 15 }} />
                      <span style={{ fontSize: '0.82rem', color: form.operationalProgram === p ? '#EC4899' : '#374151', fontWeight: form.operationalProgram === p ? 600 : 400 }}>
                        {p === 'milky_way' ? 'Milky Way (Hospital NICU)' : p === 'supsup_todo' ? 'Supsup Todo (Mobile Center)' : "Mom's Act (Household Pickup)"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Medical Status</label>
                <div className="relative">
                  <select value={form.medicalStatus} onChange={e => setForm(f => ({ ...f, medicalStatus: e.target.value as Donor['medicalStatus'] }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white appearance-none" style={{ fontSize: '0.875rem' }} onFocus={e => (e.target.style.borderColor = '#EC4899')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')}>
                    <option value="eligible">Eligible</option>
                    <option value="temp_deferred">Temporary Deferral</option>
                    <option value="permanently_deferred">Permanent Deferral</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer bg-[#FFF0F7] border border-pink-200 rounded-lg p-3">
                <input type="checkbox" checked={form.consentSigned} onChange={e => setForm(f => ({ ...f, consentSigned: e.target.checked }))} style={{ accentColor: '#EC4899', width: 16, height: 16, marginTop: 2 }} required />
                <div>
                  <span className="text-pink-800" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Informed Consent Toggle *</span>
                  <p className="text-pink-600 mt-0.5" style={{ fontSize: '0.72rem' }}>Donor has reviewed and signed the informed consent document.</p>
                </div>
              </label>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" style={{ fontSize: '0.875rem' }}>Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-white" style={{ background: '#1E3A8A', fontSize: '0.875rem', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')} onMouseLeave={e => (e.currentTarget.style.background = '#1E3A8A')}>
                  Save Log to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
