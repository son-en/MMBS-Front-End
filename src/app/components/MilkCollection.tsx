import { useState } from 'react';
import { AlertTriangle, CheckCircle, Milk, ChevronDown, Ban } from 'lucide-react';
import { mockDonors, mockCollections } from '../mockData';
import type { CollectionRecord, ScreeningApplication } from '../types';
import { BottomSheetModal } from './BottomSheetModal';

const DAILY_MAX = 800;
const SESSION_MIN = 30;
const SESSION_MAX = 240;

const programLabels: Record<CollectionRecord['program'], string> = {
  supsup_todo: 'Supsup Todo (Mobile Center Collection)',
  milky_way: 'Milky Way (Hospital NICU)',
  moms_act: "Mom's Act (Household Pickup)",
};

interface MilkCollectionProps {
  screeningApplications?: ScreeningApplication[];
}

export function MilkCollection({ screeningApplications = [] }: MilkCollectionProps) {
  const [collections, setCollections] = useState<CollectionRecord[]>(mockCollections);
  const [form, setForm] = useState({
    dtn: '',
    ctn: '',
    volumeMl: '',
    arrivalTempC: '',
    program: '' as CollectionRecord['program'] | '',
  });
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mobileErrorSheet, setMobileErrorSheet] = useState(false);

  const activeDonors = mockDonors.filter(d => d.medicalStatus === 'eligible');

  // Build combined donor list: eligible from mockDonors + approved/deferred from screeningApplications with DTNs
  const screeningDonors = screeningApplications
    .filter(a => a.dtn && (a.status === 'approved' || a.status === 'temp_deferred' || a.status === 'permanently_deferred'))
    .map(a => ({ dtn: a.dtn!, name: `${a.firstName} ${a.lastName}`, deferred: a.status !== 'approved' }));
  const allSelectableDtns = [
    ...activeDonors.map(d => ({ dtn: d.dtn, name: `${d.firstName} ${d.lastName}`, deferred: false })),
    ...screeningDonors.filter(sd => !activeDonors.find(d => d.dtn === sd.dtn)),
  ];

  const deferredScreeningApp = form.dtn
    ? screeningApplications.find(
        a => a.dtn === form.dtn && (a.status === 'temp_deferred' || a.status === 'permanently_deferred')
      )
    : undefined;
  const deferredDonorRecord = form.dtn
    ? mockDonors.find(
        d => d.dtn === form.dtn && (d.medicalStatus === 'temp_deferred' || d.medicalStatus === 'permanently_deferred')
      )
    : undefined;
  const isDeferralBlocked = !!(deferredScreeningApp || deferredDonorRecord);
  const deferralLabel = deferredScreeningApp?.status === 'permanently_deferred' || deferredDonorRecord?.medicalStatus === 'permanently_deferred'
    ? 'Permanent'
    : 'Temporary';
  const deferralNotes = deferredScreeningApp?.deferralNotes;

  const checkSafetyRules = (dtn: string, volume: number) => {
    if (volume < SESSION_MIN || volume > SESSION_MAX) {
      return `Session volume ${volume} mL is outside safe range (${SESSION_MIN}–${SESSION_MAX} mL per session).`;
    }
    const todayCollections = collections.filter(c => c.dtn === dtn);
    const todayTotal = todayCollections.reduce((s, c) => s + c.volumeMl, 0);
    if (todayTotal + volume > DAILY_MAX) {
      return `Daily limit exceeded: ${todayTotal + volume} mL would surpass the ${DAILY_MAX} mL/day safe threshold for this donor.`;
    }
    return null;
  };

  const handleVolumeChange = (val: string) => {
    setForm(f => ({ ...f, volumeMl: val }));
    if (form.dtn && val) {
      const warn = checkSafetyRules(form.dtn, parseFloat(val));
      setWarning(warn);
      if (warn && window.innerWidth < 768) {
        setMobileErrorSheet(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeferralBlocked) return;
    const volume = parseFloat(form.volumeMl);
    const safetyWarn = checkSafetyRules(form.dtn, volume);
    if (safetyWarn) { setWarning(safetyWarn); return; }

    const donor = activeDonors.find(d => d.dtn === form.dtn);
    const newRecord: CollectionRecord = {
      id: String(collections.length + 1),
      ctn: form.ctn,
      dtn: form.dtn,
      donorName: donor ? `${donor.firstName} ${donor.lastName}` : 'Unknown',
      volumeMl: volume,
      arrivalTempC: parseFloat(form.arrivalTempC),
      collectionDate: new Date().toISOString().split('T')[0],
      program: form.program as CollectionRecord['program'],
    };
    setCollections(prev => [newRecord, ...prev]);
    setForm({ dtn: '', ctn: '', volumeMl: '', arrivalTempC: '', program: '' });
    setWarning(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px]">
      {/* Bottom Sheet Error — mobile only */}
      <BottomSheetModal
        open={mobileErrorSheet}
        onClose={() => setMobileErrorSheet(false)}
        title="Safety Guardrail Triggered"
        message={warning ?? ''}
        detail="Please verify the volume entry before proceeding. Clinical review may be required."
      />

      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">Milk Collection Station</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Log each milk donation session with safety guardrails</p>
      </div>

      {/* Layout: single-col on mobile, 5-col grid on desktop */}
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-6">
        {/* Collection Form */}
        <div className="md:col-span-2">
          {/* Mobile: sticky-footer form wrapper */}
          <div className="md:static">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Milk className="w-5 h-5 text-[#EC4899]" />
              <h3 className="text-gray-800">New Collection Entry</h3>
            </div>

            {success && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700" style={{ fontSize: '0.8rem' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> Collection record saved successfully.
              </div>
            )}

            {isDeferralBlocked && (
              <div className="mb-5 rounded-xl border-2 border-[#FF4444] bg-[#FFF0F0] p-4 flex items-start gap-3">
                <Ban className="w-6 h-6 text-[#CC0000] flex-shrink-0 mt-0.5" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#CC0000', letterSpacing: '0.01em' }}>
                    INTAKE DENIED: Medical Deferral Active
                  </div>
                  <div className="mt-1" style={{ fontSize: '0.82rem', color: '#991B1B' }}>
                    Target DTN <strong>{form.dtn}</strong> is currently flagged under{' '}
                    <strong>{deferralLabel} Medical Deferral Status</strong>.
                    Milk collection is not permitted until the deferral is lifted by an authorized clinician.
                  </div>
                  {deferralNotes && (
                    <div className="mt-2 px-3 py-2 bg-red-100 rounded-lg" style={{ fontSize: '0.77rem', color: '#7F1D1D' }}>
                      <strong>Deferral Notes:</strong> {deferralNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            <form id="collection-form" onSubmit={handleSubmit} className="space-y-4">
              {/* DTN Dropdown */}
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Donor Tracking Number (DTN) *</label>
                <div className="relative">
                  <select
                    required
                    value={form.dtn}
                    onChange={e => setForm(f => ({ ...f, dtn: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white appearance-none pr-9"
                    style={{ fontSize: '0.875rem' }}
                    onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                  >
                    <option value="">Search & select donor...</option>
                    {allSelectableDtns.map(d => (
                      <option key={d.dtn} value={d.dtn}>
                        {d.dtn} — {d.name}{d.deferred ? ' ⚠ DEFERRED' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* CTN */}
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Collection Tracking Number (CTN) *</label>
                <input
                  type="text"
                  required
                  value={form.ctn}
                  onChange={e => setForm(f => ({ ...f, ctn: e.target.value }))}
                  placeholder="e.g. CTN-2024-0107"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none bg-white"
                  style={{ fontSize: '0.875rem' }}
                  onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                />
              </div>

              {/* Volume */}
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Volume *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    max={1000}
                    value={form.volumeMl}
                    onChange={e => handleVolumeChange(e.target.value)}
                    placeholder="Enter volume"
                    className="w-full px-3 py-2.5 pr-12 border rounded-lg outline-none bg-white"
                    style={{
                      fontSize: '0.875rem',
                      borderColor: warning ? '#FCA5A5' : '#E5E7EB',
                    }}
                    onFocus={e => { e.target.style.borderColor = warning ? '#FCA5A5' : '#EC4899'; }}
                    onBlur={e => { e.target.style.borderColor = warning ? '#FCA5A5' : '#E5E7EB'; }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '0.8rem' }}>mL</span>
                </div>
                <p className="text-gray-400 mt-1" style={{ fontSize: '0.72rem' }}>Safe session range: {SESSION_MIN}–{SESSION_MAX} mL | Daily max: {DAILY_MAX} mL</p>
              </div>

              {/* Temperature */}
              <div>
                <label className="block mb-1.5 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Arrival Temperature *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={form.arrivalTempC}
                    onChange={e => setForm(f => ({ ...f, arrivalTempC: e.target.value }))}
                    placeholder="Enter temperature"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg outline-none bg-white"
                    style={{ fontSize: '0.875rem' }}
                    onFocus={e => { e.target.style.borderColor = '#EC4899'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '0.8rem' }}>°C</span>
                </div>
              </div>

              {/* Program */}
              <div>
                <label className="block mb-2 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>Collection Program *</label>
                <div className="space-y-2">
                  {(['supsup_todo', 'milky_way', 'moms_act'] as const).map(p => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="program"
                        value={p}
                        checked={form.program === p}
                        onChange={() => setForm(f => ({ ...f, program: p }))}
                        style={{ accentColor: '#EC4899', width: 15, height: 15 }}
                        required
                      />
                      <span style={{ fontSize: '0.82rem', color: form.program === p ? '#EC4899' : '#374151', fontWeight: form.program === p ? 600 : 400 }}>
                        {programLabels[p]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Desktop inline submit */}
              <button
                type="submit"
                disabled={isDeferralBlocked}
                className="hidden md:block w-full py-2.5 rounded-lg text-white transition-all mt-2"
                style={{
                  background: isDeferralBlocked ? '#9CA3AF' : '#1E3A8A',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: isDeferralBlocked ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!isDeferralBlocked) (e.currentTarget as HTMLButtonElement).style.background = '#1e40af'; }}
                onMouseLeave={e => { if (!isDeferralBlocked) (e.currentTarget as HTMLButtonElement).style.background = '#1E3A8A'; }}
              >
                {isDeferralBlocked ? 'Intake Blocked — Deferral Active' : 'Save to Database'}
              </button>
            </form>
          </div>
          </div>

          {/* Mobile sticky footer submit */}
          <div className="md:hidden sticky bottom-[72px] left-0 right-0 z-20 px-4 pb-3 pt-2 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
            <button
              type="button"
              disabled={isDeferralBlocked}
              className="w-full py-4 rounded-xl text-white transition-all"
              style={{
                background: isDeferralBlocked ? '#9CA3AF' : '#EC4899',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: isDeferralBlocked ? 'not-allowed' : 'pointer',
                minHeight: 52,
              }}
              onClick={() => {
                const formEl = document.getElementById('collection-form') as HTMLFormElement | null;
                formEl?.requestSubmit();
              }}
            >
              {isDeferralBlocked ? 'Intake Blocked — Deferral Active' : 'Confirm Intake Run'}
            </button>
          </div>
        </div>

        {/* Right side: Warning area + Recent Records */}
        <div className="md:col-span-3 space-y-4">
          {/* Safety Warning — desktop only (mobile uses bottom sheet) */}
          {warning && (
            <div className="hidden md:flex items-start gap-3 px-5 py-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-red-700" style={{ fontWeight: 700, fontSize: '0.9rem' }}>Safety Guardrail Triggered</div>
                <div className="text-red-600 mt-1" style={{ fontSize: '0.82rem' }}>{warning}</div>
                <div className="text-red-500 mt-2" style={{ fontSize: '0.77rem' }}>Please verify the volume entry before proceeding. Clinical review may be required.</div>
              </div>
            </div>
          )}

          {/* Reference Card */}
          <div className="bg-[#EFF6FF] border border-blue-200 rounded-xl px-5 py-4">
            <div className="text-[#1E3A8A]" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Safety Reference</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Min per session', value: `${SESSION_MIN} mL` },
                { label: 'Max per session', value: `${SESSION_MAX} mL` },
                { label: 'Max per day', value: `${DAILY_MAX} mL` },
                { label: 'Safe temp range', value: '2–4 °C arrival' },
              ].map(r => (
                <div key={r.label} className="bg-white rounded-lg px-3 py-2.5 border border-blue-100">
                  <div className="text-gray-500" style={{ fontSize: '0.7rem' }}>{r.label}</div>
                  <div className="text-[#1E3A8A]" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Collections */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-800">Recent Collections</h3>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#1E3A8A' }}>
                    {['CTN', 'DTN / Donor', 'Volume', 'Temp', 'Program', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {collections.slice(0, 8).map((c, i) => (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E3A8A' }}>{c.ctn}</td>
                      <td className="px-4 py-2.5">
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{c.dtn}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{c.donorName}</div>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.volumeMl} mL</td>
                      <td className="px-4 py-2.5 text-gray-600" style={{ fontSize: '0.8rem' }}>{c.arrivalTempC} °C</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full" style={{
                          background: c.program === 'milky_way' ? '#EFF6FF' : c.program === 'supsup_todo' ? '#FFF0F7' : '#F0FDF4',
                          color: c.program === 'milky_way' ? '#1E3A8A' : c.program === 'supsup_todo' ? '#9D174D' : '#15803D',
                          fontSize: '0.7rem', fontWeight: 600
                        }}>
                          {c.program === 'milky_way' ? 'Milky Way' : c.program === 'supsup_todo' ? 'Supsup Todo' : "Mom's Act"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500" style={{ fontSize: '0.78rem' }}>{c.collectionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="md:hidden divide-y divide-gray-100">
              {collections.slice(0, 6).map(c => (
                <div key={c.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E3A8A', fontFamily: 'monospace' }}>{c.ctn}</div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{c.dtn} · {c.donorName}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full" style={{
                      background: c.program === 'milky_way' ? '#EFF6FF' : c.program === 'supsup_todo' ? '#FFF0F7' : '#F0FDF4',
                      color: c.program === 'milky_way' ? '#1E3A8A' : c.program === 'supsup_todo' ? '#9D174D' : '#15803D',
                      fontSize: '0.65rem', fontWeight: 700
                    }}>
                      {c.program === 'milky_way' ? 'Milky Way' : c.program === 'supsup_todo' ? 'Supsup Todo' : "Mom's Act"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Volume </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A' }}>{c.volumeMl} mL</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Temp </span>
                      <span style={{ fontSize: '0.82rem', color: '#374151' }}>{c.arrivalTempC} °C</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginLeft: 'auto' }}>{c.collectionDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
