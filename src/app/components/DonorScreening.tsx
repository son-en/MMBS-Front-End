import { useState } from 'react';
import {
  ClipboardCheck, Eye, CheckCircle2, XCircle, AlertTriangle, Clock,
  UserCheck, X, Shield, Activity, ChevronDown, ChevronUp, FileText, User,
} from 'lucide-react';
import type { ScreeningApplication, OperationalProgram } from '../types';

const PROGRAM_LABELS: Record<OperationalProgram, string> = {
  milky_way: 'Milky Way',
  supsup_todo: 'Supsup Todo',
  moms_act: "Mom's ACT",
};

const STATUS_CONFIG = {
  pending_review: { label: 'Pending Review', bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  approved: { label: 'Approved — Active', bg: '#F0FDF4', color: '#15803D', border: '#86EFAC' },
  temp_deferred: { label: 'Temp. Deferred', bg: '#FFF5F5', color: '#991B1B', border: '#FECACA' },
  permanently_deferred: { label: 'Perm. Deferred', bg: '#FFF5F5', color: '#7F1D1D', border: '#FCA5A5' },
};

interface Props {
  applications: ScreeningApplication[];
  onUpdate: (id: string, patch: Partial<ScreeningApplication>) => void;
  currentUserName: string;
}

type DeferralStep = 'choose' | 'notes';

export function DonorScreening({ applications, onUpdate, currentUserName }: Props) {
  const [selected, setSelected] = useState<ScreeningApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reject flow state
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [deferralStep, setDeferralStep] = useState<DeferralStep>('choose');
  const [deferralType, setDeferralType] = useState<'temporary' | 'permanent' | null>(null);
  const [deferralNotes, setDeferralNotes] = useState('');

  // Success flash
  const [flashSuccess, setFlashSuccess] = useState(false);

  // Accordion open state for mobile cards
  const [accordionOpen, setAccordionOpen] = useState({ a: true, b: true, c: true });
  const toggleAccordion = (key: 'a' | 'b' | 'c') =>
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const openDrawer = (app: ScreeningApplication) => {
    setSelected(app);
    setDrawerOpen(true);
    setShowRejectPanel(false);
    setDeferralStep('choose');
    setDeferralType(null);
    setDeferralNotes('');
    setFlashSuccess(false);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  const handleApprove = () => {
    if (!selected) return;
    const nextDtn = `DTN-2024-0${10 + applications.filter(a => a.dtn).length}`;
    const now = new Date().toLocaleString('en-PH');
    onUpdate(selected.id, {
      status: 'approved',
      dtn: nextDtn,
      reviewedBy: currentUserName,
      reviewedAt: now,
    });
    setFlashSuccess(true);
    setTimeout(() => {
      setFlashSuccess(false);
      closeDrawer();
    }, 1800);
  };

  const handleRejectConfirm = () => {
    if (!selected || !deferralType || deferralNotes.trim().length < 10) return;
    const now = new Date().toLocaleString('en-PH');
    const nextDtn = selected.dtn ?? `DTN-2024-D${String(applications.filter(a => a.dtn).length + 1).padStart(2, '0')}`;
    onUpdate(selected.id, {
      status: deferralType === 'temporary' ? 'temp_deferred' : 'permanently_deferred',
      dtn: nextDtn,
      reviewedBy: currentUserName,
      reviewedAt: now,
      deferralType,
      deferralNotes: deferralNotes.trim(),
    });
    closeDrawer();
  };

  const pending = applications.filter(a => a.status === 'pending_review');
  const reviewed = applications.filter(a => a.status !== 'pending_review');

  const FlagPill = ({ label, flagged }: { label: string; flagged: boolean }) => (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        background: flagged ? '#FFF5F5' : '#F0FDF4',
        color: flagged ? '#DC2626' : '#15803D',
        fontSize: '0.72rem',
        fontWeight: 700,
        border: `1px solid ${flagged ? '#FECACA' : '#86EFAC'}`,
      }}
    >
      {flagged ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      {label}
    </span>
  );

  return (
    <div className="p-4 md:p-6 max-w-[1300px] relative">
      {/* Header */}
      <div className="mb-4 md:mb-5 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-[#1E3A8A]">Donor Screening & Verification Queue</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
            Clinical review of submitted donor health profiles · UC-02 Screening Module
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
              {pending.length} Pending Review
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50">
            <Activity className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span style={{ fontSize: '0.75rem', color: '#1E3A8A' }}>
              {applications.length} total submissions
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 md:mb-6">
        {[
          { label: 'Pending Review', value: applications.filter(a => a.status === 'pending_review').length, bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
          { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, bg: '#F0FDF4', color: '#15803D', border: '#86EFAC' },
          { label: 'Temp. Deferred', value: applications.filter(a => a.status === 'temp_deferred').length, bg: '#FFF5F5', color: '#991B1B', border: '#FECACA' },
          { label: 'Perm. Deferred', value: applications.filter(a => a.status === 'permanently_deferred').length, bg: '#FFF5F5', color: '#7F1D1D', border: '#FCA5A5' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border px-4 py-3 flex items-center justify-between"
            style={{ background: s.bg, borderColor: s.border }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: s.color }}>{s.label}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Pending Queue */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="px-4 md:px-5 py-4 border-b border-gray-100 flex items-center gap-2" style={{ background: '#1E3A8A' }}>
            <ClipboardCheck className="w-4 h-4 text-white" />
            <span className="text-white" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
              Pending Screenings — Awaiting Clinical Review
            </span>
            <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-amber-900" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
              {pending.length}
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Temp. Ref ID', 'Submitted', 'Full Name', 'Program', 'Serology Flags', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 border-b border-gray-100" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((app, i) => {
                  const cfg = STATUS_CONFIG[app.status];
                  const hasRisk = app.hepatitisB === 'YES' || app.hivRiskPartner || app.serologyHepBStatus === 'flagged';
                  return (
                    <tr key={app.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>{app.tempRefId}</td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem' }}>{app.submittedAt}</td>
                      <td className="px-4 py-3">
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{app.firstName} {app.lastName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{app.dateOfBirth}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{PROGRAM_LABELS[app.program]}</span>
                      </td>
                      <td className="px-4 py-3">
                        {hasRisk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700" style={{ fontSize: '0.7rem', fontWeight: 700 }}><AlertTriangle className="w-3 h-3" /> Risk Flags</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700" style={{ fontSize: '0.7rem', fontWeight: 600 }}><CheckCircle2 className="w-3 h-3" /> Clear</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-1 rounded-full border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, fontSize: '0.72rem', fontWeight: 700 }}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openDrawer(app)} className="inline-flex items-center gap-1.5 transition-colors" style={{ color: '#1E3A8A', fontSize: '0.8rem', fontWeight: 600 }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#EC4899'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#1E3A8A'}>
                          <Eye className="w-3.5 h-3.5" /> Review Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden divide-y divide-gray-100">
            {pending.map(app => {
              const hasRisk = app.hepatitisB === 'YES' || app.hivRiskPartner || app.serologyHepBStatus === 'flagged';
              return (
                <div key={app.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E3A8A', fontFamily: 'monospace' }}>{app.tempRefId}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', marginTop: 2 }}>{app.firstName} {app.lastName}</div>
                    </div>
                    {hasRisk ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700" style={{ fontSize: '0.68rem', fontWeight: 700 }}><AlertTriangle className="w-3 h-3" /> Risk</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700" style={{ fontSize: '0.68rem', fontWeight: 600 }}><CheckCircle2 className="w-3 h-3" /> Clear</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700" style={{ fontSize: '0.68rem', fontWeight: 600 }}>{PROGRAM_LABELS[app.program]}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{app.submittedAt}</span>
                  </div>
                  <button
                    onClick={() => openDrawer(app)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white"
                    style={{ background: '#EC4899', fontWeight: 700, fontSize: '0.875rem', minHeight: 48 }}
                  >
                    <Eye className="w-4 h-4" /> Review Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewed.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700" style={{ fontWeight: 700, fontSize: '0.875rem' }}>Reviewed Applications</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['DTN / Ref ID', 'Full Name', 'Program', 'Status', 'Reviewed By', 'Reviewed At', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 border-b border-gray-100" style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviewed.map((app, i) => {
                  const cfg = STATUS_CONFIG[app.status];
                  return (
                    <tr key={app.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>{app.dtn ?? app.tempRefId}</td>
                      <td className="px-4 py-3" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{app.firstName} {app.lastName}</td>
                      <td className="px-4 py-3"><span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{PROGRAM_LABELS[app.program]}</span></td>
                      <td className="px-4 py-3"><span className="inline-block px-2.5 py-1 rounded-full border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, fontSize: '0.72rem', fontWeight: 700 }}>{cfg.label}</span></td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem' }}>{app.reviewedBy ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem' }}>{app.reviewedAt ?? '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openDrawer(app)} className="inline-flex items-center gap-1.5 transition-colors" style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600 }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#1E3A8A'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'}>
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden divide-y divide-gray-100">
            {reviewed.map(app => {
              const cfg = STATUS_CONFIG[app.status];
              return (
                <div key={app.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E3A8A', fontFamily: 'monospace' }}>{app.dtn ?? app.tempRefId}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: 1 }}>{app.firstName} {app.lastName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 1 }}>{app.reviewedBy ?? '—'} · {app.reviewedAt ?? '—'}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-full border" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border, fontSize: '0.65rem', fontWeight: 700 }}>{cfg.label}</span>
                    <button onClick={() => openDrawer(app)} className="flex items-center gap-1 text-gray-500" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── RIGHT SLIDE-OVER DRAWER ─── */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer Panel — full screen on mobile, 520px slide-over on desktop */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300"
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 520,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {selected && (
          <>
            {/* Success Flash Overlay */}
            {flashSuccess && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 rounded">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#15803D' }}>Donor Approved & Activated</p>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 6 }}>Audit log entry created.</p>
              </div>
            )}

            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0"
              style={{ background: '#1E3A8A' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-white/70" />
                  <span className="text-white" style={{ fontWeight: 800, fontSize: '1rem' }}>
                    {selected.firstName} {selected.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-blue-200" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {selected.dtn ?? selected.tempRefId}
                  </span>
                  <span className="text-blue-200/50">·</span>
                  <span
                    className="inline-block px-2 py-0.5 rounded-full border"
                    style={{
                      background: STATUS_CONFIG[selected.status].bg,
                      color: STATUS_CONFIG[selected.status].color,
                      borderColor: STATUS_CONFIG[selected.status].border,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                    }}
                  >
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
              <button onClick={closeDrawer} className="text-white/70 hover:text-white transition-colors mt-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* Card A: Maternal / Personal History */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-left"
                  style={{ background: '#EFF6FF', borderBottom: accordionOpen.a ? '1px solid #DBEAFE' : 'none' }}
                  onClick={() => toggleAccordion('a')}
                >
                  <User className="w-3.5 h-3.5 text-[#1E3A8A] flex-shrink-0" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1 }}>
                    Card A — Maternal & Personal History
                  </span>
                  {accordionOpen.a ? <ChevronUp className="w-4 h-4 text-[#1E3A8A]" /> : <ChevronDown className="w-4 h-4 text-[#1E3A8A]" />}
                </button>
                {accordionOpen.a && <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Full Name', value: `${selected.firstName} ${selected.lastName}` },
                    { label: 'Date of Birth', value: selected.dateOfBirth },
                    { label: 'Phone', value: selected.phone },
                    { label: 'Program', value: PROGRAM_LABELS[selected.program] },
                    { label: 'Address', value: selected.address, span: true },
                    { label: 'Submitted At', value: selected.submittedAt, span: true },
                  ].map(f => (
                    <div key={f.label} className={f.span ? 'col-span-2' : ''}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: '0.82rem', color: '#111827', fontWeight: 500 }}>{f.value}</div>
                    </div>
                  ))}
                  <div className="col-span-2 flex items-center gap-2 mt-1">
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Informed Consent:</span>
                    <FlagPill label={selected.consentSigned ? 'Signed ✓' : 'NOT Signed'} flagged={!selected.consentSigned} />
                  </div>
                </div>}
              </div>

              {/* Card B: Clinical Profiling */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-left"
                  style={{ background: '#FFF7ED', borderBottom: accordionOpen.b ? '1px solid #FED7AA' : 'none' }}
                  onClick={() => toggleAccordion('b')}
                >
                  <FileText className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1 }}>
                    Card B — Clinical Profiling
                  </span>
                  {accordionOpen.b ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-orange-600" />}
                </button>
                {accordionOpen.b && <div className="p-4 space-y-3">
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Current Medications / Supplements</div>
                    <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200" style={{ fontSize: '0.82rem', color: '#374151' }}>
                      {selected.medications || 'None reported'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Lifestyle & Behavioral Risk Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      <FlagPill label={`Tuberculosis: ${selected.tuberculosis}`} flagged={selected.tuberculosis === 'YES'} />
                      <FlagPill label={`Syphilis: ${selected.syphilis}`} flagged={selected.syphilis === 'YES'} />
                      <FlagPill label={`Illegal Drugs: ${selected.illegalDrugs}`} flagged={selected.illegalDrugs === 'YES'} />
                      <FlagPill label={`Blood Transfusion: ${selected.bloodTransfusion}`} flagged={selected.bloodTransfusion === 'YES'} />
                      <FlagPill label="Partner HIV Risk" flagged={selected.hivRiskPartner} />
                    </div>
                  </div>
                </div>}
              </div>

              {/* Card C: Serological Screening */}
              {(() => {
                const isFlagged = selected.serologyHepBStatus === 'flagged' || selected.serologyHivStatus === 'flagged';
                return (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: isFlagged ? '#FECACA' : '#BBF7D0' }}>
                <button
                  className="w-full px-4 py-2.5 flex items-center gap-2 text-left"
                  style={{
                    background: isFlagged ? '#FFF5F5' : '#F0FDF4',
                    borderBottom: accordionOpen.c ? `1px solid ${isFlagged ? '#FECACA' : '#BBF7D0'}` : 'none',
                  }}
                  onClick={() => toggleAccordion('c')}
                >
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isFlagged ? '#DC2626' : '#15803D' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isFlagged ? '#991B1B' : '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em', flex: 1 }}>
                    Card C — Serological Screening Gate
                  </span>
                  {accordionOpen.c ? <ChevronUp className="w-4 h-4" style={{ color: isFlagged ? '#DC2626' : '#15803D' }} /> : <ChevronDown className="w-4 h-4" style={{ color: isFlagged ? '#DC2626' : '#15803D' }} />}
                </button>
                {accordionOpen.c && <div className="p-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'HIV Status', value: selected.serologyHivStatus, flagged: selected.serologyHivStatus === 'flagged' },
                    { label: 'Hepatitis B Status', value: selected.serologyHepBStatus, flagged: selected.serologyHepBStatus === 'flagged' },
                    { label: 'HepB Self-Reported', value: selected.hepatitisB === 'YES' ? 'Reported YES' : 'Reported NO', flagged: selected.hepatitisB === 'YES' },
                  ].map(f => (
                    <div key={f.label} className="px-4 py-3 rounded-xl border" style={{ background: f.flagged ? '#FFF5F5' : '#F8FAFC', borderColor: f.flagged ? '#FECACA' : '#E5E7EB' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{f.label}</div>
                      <div className="flex items-center gap-1.5">
                        {f.flagged ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: f.flagged ? '#DC2626' : f.value === 'pending' ? '#92400E' : '#15803D', textTransform: 'capitalize' }}>
                          {f.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>}
              </div>
                );
              })()}

              {/* Deferral Notes (if already reviewed) */}
              {selected.deferralNotes && (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                    Clinical Deferral Justification
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#7F1D1D', lineHeight: 1.6 }}>{selected.deferralNotes}</p>
                  <div className="mt-2 text-xs text-red-400">
                    {selected.deferralType === 'temporary' ? 'Temporary Deferral' : 'Permanent Deferral'} · Reviewed by {selected.reviewedBy} · {selected.reviewedAt}
                  </div>
                </div>
              )}

              {/* Reject Panel inline */}
              {showRejectPanel && selected.status === 'pending_review' && (
                <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5 space-y-4">
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#991B1B' }}>Reject / Defer Application</div>

                  {deferralStep === 'choose' && (
                    <div className="space-y-2">
                      <p style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: 8 }}>Select the clinical deferral classification:</p>
                      {([
                        { value: 'temporary', label: 'Temporary Deferral', desc: 'Infection or medication that will clear up later. Donor may re-apply.' },
                        { value: 'permanent', label: 'Permanent Deferral', desc: 'High-risk markers or positive serology confirmed. Donor ineligible.' },
                      ] as const).map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
                          style={{
                            borderColor: deferralType === opt.value ? '#DC2626' : '#FECACA',
                            background: deferralType === opt.value ? '#FEF2F2' : 'white',
                          }}
                        >
                          <input
                            type="radio"
                            name="deferral"
                            value={opt.value}
                            checked={deferralType === opt.value}
                            onChange={() => setDeferralType(opt.value)}
                            style={{ accentColor: '#DC2626', marginTop: 2, flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991B1B' }}>{opt.label}</div>
                            <div style={{ fontSize: '0.72rem', color: '#B91C1C', marginTop: 2 }}>{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                      <button
                        onClick={() => deferralType && setDeferralStep('notes')}
                        disabled={!deferralType}
                        className="w-full py-2 rounded-lg border-2 border-red-400 text-red-700 transition-all"
                        style={{ fontSize: '0.82rem', fontWeight: 600, background: deferralType ? '#FEE2E2' : 'white', cursor: deferralType ? 'pointer' : 'not-allowed', opacity: deferralType ? 1 : 0.5 }}
                      >
                        Continue to Justification Notes →
                      </button>
                    </div>
                  )}

                  {deferralStep === 'notes' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                          {deferralType === 'temporary' ? 'Temporary Deferral' : 'Permanent Deferral'}
                        </span>
                        <button onClick={() => setDeferralStep('choose')} className="text-red-400 hover:text-red-600 transition-colors" style={{ fontSize: '0.72rem' }}>
                          ← Change
                        </button>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991B1B' }} className="block mb-1.5">
                          Mandatory Clinical Deferral Justification Notes *
                        </label>
                        <textarea
                          value={deferralNotes}
                          onChange={e => setDeferralNotes(e.target.value)}
                          rows={4}
                          placeholder="Document the clinical reasoning for this deferral decision. Include specific health indicators, test results, or behavioral risk factors that support this determination..."
                          className="w-full px-3 py-2.5 rounded-lg border-2 outline-none resize-none"
                          style={{ fontSize: '0.8rem', borderColor: deferralNotes.trim().length < 10 ? '#FCA5A5' : '#EF4444', background: 'white' }}
                        />
                        {deferralNotes.trim().length < 10 && deferralNotes.length > 0 && (
                          <p style={{ fontSize: '0.7rem', color: '#DC2626', marginTop: 2 }}>Minimum 10 characters required.</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowRejectPanel(false)}
                          className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 transition-all hover:bg-gray-50"
                          style={{ fontSize: '0.82rem', fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRejectConfirm}
                          disabled={deferralNotes.trim().length < 10}
                          className="flex-1 py-2 rounded-lg text-white transition-all"
                          style={{
                            background: deferralNotes.trim().length >= 10 ? '#DC2626' : '#FCA5A5',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: deferralNotes.trim().length >= 10 ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Confirm Deferral
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer — Action Buttons */}
            {selected.status === 'pending_review' && !showRejectPanel && (
              <div className="flex-shrink-0 border-t border-gray-100 p-4 md:p-5 flex flex-col md:grid md:grid-cols-2 gap-3" style={{ background: '#F8FAFC' }}>
                {/* Approve */}
                <button
                  onClick={handleApprove}
                  className="flex items-center justify-center gap-2 rounded-xl text-white transition-all order-1 md:order-none"
                  style={{ background: '#EC4899', fontSize: '0.875rem', fontWeight: 700, minHeight: 52, padding: '0.875rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DB2777'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(236,72,153,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EC4899'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
                >
                  <UserCheck className="w-4 h-4" />
                  Approve & Activate Donor
                </button>

                {/* Reject */}
                <button
                  onClick={() => setShowRejectPanel(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 transition-all order-2 md:order-none"
                  style={{ borderColor: '#FCA5A5', color: '#DC2626', background: 'white', fontSize: '0.875rem', fontWeight: 700, minHeight: 52, padding: '0.875rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC2626'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FCA5A5'; }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject / Defer Application
                </button>
              </div>
            )}

            {/* Already reviewed footer */}
            {selected.status !== 'pending_review' && (
              <div className="flex-shrink-0 border-t border-gray-100 p-4 text-center" style={{ background: '#F8FAFC' }}>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                  Application reviewed by <strong>{selected.reviewedBy}</strong> on {selected.reviewedAt}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FlagPill({ label, flagged }: { label: string; flagged: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        background: flagged ? '#FFF5F5' : '#F0FDF4',
        color: flagged ? '#DC2626' : '#15803D',
        fontSize: '0.72rem',
        fontWeight: 700,
        border: `1px solid ${flagged ? '#FECACA' : '#86EFAC'}`,
      }}
    >
      {flagged ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      {label}
    </span>
  );
}
