import { Droplets, Users, Package, AlertTriangle, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockBatches, mockDonors, mockBeneficiaries, analyticsMonthlyData } from '../mockData';
import { StatusBadge } from './StatusBadge';

export function DashboardOverview() {
  const rawVolume = mockBatches.filter(b => b.status === 'raw').reduce((s, b) => s + b.volumeMl, 0);
  const quarantinedVolume = mockBatches.filter(b => b.status === 'quarantined').reduce((s, b) => s + b.volumeMl, 0);
  const pasteurizedVolume = mockBatches.filter(b => b.status === 'pasteurized').reduce((s, b) => s + b.volumeMl, 0);
  const activeDonors = mockDonors.filter(d => d.medicalStatus === 'eligible').length;
  const lowStockThreshold = 300;
  const isLowStock = pasteurizedVolume < lowStockThreshold;

  const now = new Date();
  const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const isNearExpiry = (dateStr: string) => new Date(dateStr) <= thirtyDaysOut;

  const kpis = [
    {
      label: 'Raw Stock',
      value: `${rawVolume} mL`,
      icon: Droplets,
      gradient: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(236,72,153,0.08))',
      iconBg: '#FFF0F7',
      iconColor: '#EC4899',
      sub: `${mockBatches.filter(b => b.status === 'raw').length} batches`,
    },
    {
      label: 'Quarantined',
      value: `${quarantinedVolume} mL`,
      icon: AlertTriangle,
      gradient: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(236,72,153,0.08))',
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      sub: `${mockBatches.filter(b => b.status === 'quarantined').length} batches pending`,
    },
    {
      label: 'Ready Pasteurized',
      value: `${pasteurizedVolume} mL`,
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(236,72,153,0.08))',
      iconBg: '#ECFEFF',
      iconColor: '#0E7490',
      sub: `${mockBatches.filter(b => b.status === 'pasteurized').length} batches ready`,
    },
    {
      label: 'Active Donors',
      value: activeDonors.toString(),
      icon: Users,
      gradient: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(236,72,153,0.08))',
      iconBg: '#EFF6FF',
      iconColor: '#1E3A8A',
      sub: `${mockDonors.filter(d => d.medicalStatus === 'temp_deferred' || d.medicalStatus === 'permanently_deferred').length} deferred`,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1200px]">
      {/* Header */}
      <div>
        <h1 className="text-[#1E3A8A]">Dashboard Overview</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Real-time biovigilance metrics · Makati Milk Bank</p>
      </div>

      {/* Low Stock Alert */}
      {isLowStock && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border-2 border-[#FECACA] bg-red-50 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-red-700" style={{ fontWeight: 700, fontSize: '0.9rem' }}>LOW STOCK ALERT: </span>
            <span className="text-red-600" style={{ fontSize: '0.875rem' }}>
              Pasteurized milk stock is below critical threshold ({pasteurizedVolume} mL / {lowStockThreshold} mL minimum).
              Immediate donor outreach recommended.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm" style={{ background: kpi.gradient }}>
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.iconBg }}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: kpi.iconColor }} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-gray-800" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1 }}>{kpi.value}</div>
              <div className="text-gray-600 mt-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{kpi.label}</div>
              <div className="text-gray-400 mt-0.5" style={{ fontSize: '0.7rem' }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row — stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Volume Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-gray-800">Monthly Volume Trend</h3>
              <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Collection vs Dispensing (mL)</p>
            </div>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={analyticsMonthlyData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis key="y" tick={{ fontSize: 10, fill: '#94A3B8' }} width={36} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8 }} />
              <Line key="rawMl" type="monotone" dataKey="rawMl" name="Raw Collected" stroke="#1E3A8A" strokeWidth={2} dot={false} />
              <Line key="dispensedMl" type="monotone" dataKey="dispensedMl" name="Dispensed" stroke="#EC4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donor Growth */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-gray-800">Active Donor Growth</h3>
              <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Monthly enrolled active donors</p>
            </div>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={analyticsMonthlyData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis key="y" tick={{ fontSize: 10, fill: '#94A3B8' }} width={36} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8 }} />
              <Bar key="donors" dataKey="donors" name="Donors" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Batches — desktop table, mobile card stack */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-4 md:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800">Recent Milk Batches</h3>
          <span className="text-gray-400" style={{ fontSize: '0.8rem' }}>{mockBatches.length} batches total</span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['Batch ID', 'Volume', 'Created', 'Expiration', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBatches.slice(0, 5).map((batch, i) => (
                <tr key={batch.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                  <td className="px-4 py-3 text-gray-800" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{batch.batchId}</td>
                  <td className="px-4 py-3 text-gray-600" style={{ fontSize: '0.82rem' }}>{batch.volumeMl} mL</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{batch.createdDate}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{batch.expirationDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={batch.status} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden divide-y divide-gray-100">
          {mockBatches.slice(0, 5).map(batch => (
            <div key={batch.id} className="px-4 py-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E3A8A', fontFamily: 'monospace' }}>
                  {batch.batchId}
                </span>
                <StatusBadge status={batch.status} small />
              </div>
              {/* Card Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Volume</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A' }}>{batch.volumeMl} mL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Created</span>
                  <span style={{ fontSize: '0.78rem', color: '#374151' }}>{batch.createdDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Expiration</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isNearExpiry(batch.expirationDate) ? 700 : 400,
                    color: isNearExpiry(batch.expirationDate) ? '#EC4899' : '#374151',
                  }}>
                    {batch.expirationDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row — single col on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: 'Beneficiaries Registered', value: mockBeneficiaries.length, icon: Package },
          { label: 'Pending Lab Results', value: mockBatches.filter(b => b.status === 'quarantined').length, icon: AlertTriangle },
          { label: 'Deferred Donors', value: mockDonors.filter(d => d.medicalStatus === 'temp_deferred' || d.medicalStatus === 'permanently_deferred').length, icon: Users },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 px-4 md:px-5 py-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <div className="text-gray-800" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{stat.value}</div>
                <div className="text-gray-500" style={{ fontSize: '0.78rem' }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
