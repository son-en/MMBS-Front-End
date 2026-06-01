import { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, Droplets, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsMonthlyData, mockBatches, mockDonors, mockBeneficiaries } from '../mockData';

type Period = 'daily' | 'weekly' | 'monthly' | 'annual';

const weeklyData = [
  { week: 'Wk 1', collected: 480, pasteurized: 420, dispensed: 380, donors: 8 },
  { week: 'Wk 2', collected: 520, pasteurized: 460, dispensed: 410, donors: 9 },
  { week: 'Wk 3', collected: 490, pasteurized: 450, dispensed: 400, donors: 8 },
  { week: 'Wk 4', collected: 560, pasteurized: 500, dispensed: 450, donors: 10 },
];

const dailyData = [
  { day: 'Mon', collected: 120, dispensed: 90 },
  { day: 'Tue', collected: 145, dispensed: 110 },
  { day: 'Wed', collected: 98, dispensed: 85 },
  { day: 'Thu', collected: 162, dispensed: 130 },
  { day: 'Fri', collected: 140, dispensed: 105 },
  { day: 'Sat', collected: 75, dispensed: 60 },
  { day: 'Sun', collected: 40, dispensed: 35 },
];

const annualData = [
  { year: '2021', donors: 48, batches: 182, dispensed: 7200 },
  { year: '2022', donors: 63, batches: 240, dispensed: 9600 },
  { year: '2023', donors: 89, batches: 312, dispensed: 12500 },
  { year: '2024', donors: 21, batches: 18, dispensed: 1420 },
];

const statusPieData = [
  { name: 'Pasteurized', value: mockBatches.filter(b => b.status === 'pasteurized').length, color: '#0E7490' },
  { name: 'Quarantined', value: mockBatches.filter(b => b.status === 'quarantined').length, color: '#D97706' },
  { name: 'Raw', value: mockBatches.filter(b => b.status === 'raw').length, color: '#EC4899' },
  { name: 'Rejected', value: mockBatches.filter(b => b.status === 'rejected').length, color: '#991B1B' },
];

const programData = [
  { name: 'Milky Way', value: 3, color: '#1E3A8A' },
  { name: 'Supsup Todo', value: 2, color: '#EC4899' },
  { name: "Mom's Act", value: 2, color: '#0E7490' },
];

export function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('monthly');

  const chartData = period === 'daily' ? dailyData : period === 'weekly' ? weeklyData : period === 'annual' ? annualData : analyticsMonthlyData;
  const xKey = period === 'daily' ? 'day' : period === 'weekly' ? 'week' : period === 'annual' ? 'year' : 'month';

  return (
    <div className="p-4 md:p-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">Administrative Analytics & DOH Reports</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Official reporting data for Department of Health compliance</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all"
          style={{ background: '#1E3A8A', fontSize: '0.875rem', fontWeight: 600 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1E3A8A')}
          onClick={() => alert('DOH Report export functionality would generate a formatted PDF/Excel report here.')}
        >
          <Download className="w-4 h-4" /> Download Signed PDF
        </button>
      </div>

      {/* Period Controls */}
      <div className="flex items-center gap-2 mb-5 bg-white rounded-xl border border-gray-100 p-1.5 w-fit shadow-sm">
        {(['daily', 'weekly', 'monthly', 'annual'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-4 py-2 rounded-lg transition-all capitalize"
            style={{
              background: period === p ? '#1E3A8A' : 'transparent',
              color: period === p ? 'white' : '#6B7280',
              fontSize: '0.82rem',
              fontWeight: period === p ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* DOH Report Matrix */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <BarChart3 className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-[#1E3A8A]">DOH Manual of Operations — Data Matrix ({period.charAt(0).toUpperCase() + period.slice(1)} Report)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['Indicator', 'Value', 'Unit', 'Benchmark', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { indicator: 'Active Donors Enrolled', value: mockDonors.filter(d => d.medicalStatus === 'eligible').length, unit: 'Donors', benchmark: '≥ 10', ok: true },
                { indicator: 'Total Collections (Apr 2024)', value: 6, unit: 'Sessions', benchmark: '≥ 4/week', ok: true },
                { indicator: 'Total Volume Collected', value: `${mockBatches.reduce((s, b) => s + b.volumeMl, 0)} mL`, unit: 'mL', benchmark: '≥ 5,000 mL/month', ok: false },
                { indicator: 'Pasteurization Success Rate', value: `${Math.round((mockBatches.filter(b => b.status === 'pasteurized').length / mockBatches.length) * 100)}%`, unit: '%', benchmark: '≥ 80%', ok: true },
                { indicator: 'Lab Rejection Rate', value: `${Math.round((mockBatches.filter(b => b.status === 'rejected').length / mockBatches.length) * 100)}%`, unit: '%', benchmark: '≤ 15%', ok: true },
                { indicator: 'Beneficiaries Served', value: mockBeneficiaries.filter(b => b.dispensingHistory.length > 0).length, unit: 'Infants', benchmark: 'Max need', ok: true },
                { indicator: 'Deferred Donors', value: mockDonors.filter(d => d.medicalStatus === 'temp_deferred' || d.medicalStatus === 'permanently_deferred').length, unit: 'Donors', benchmark: '< 20% of roster', ok: true },
                { indicator: 'Expired Batches (12-month window)', value: 0, unit: 'Batches', benchmark: '0 expired', ok: true },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                  <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 500 }}>{row.indicator}</td>
                  <td className="px-4 py-3" style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1E3A8A' }}>{row.value}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{row.unit}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{row.benchmark}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full border" style={{
                      background: row.ok ? '#F0FDF4' : '#FFF5F5',
                      color: row.ok ? '#15803D' : '#991B1B',
                      borderColor: row.ok ? '#BBF7D0' : '#FECACA',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}>
                      {row.ok ? 'Met' : 'Below Target'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
        {/* Volume Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-gray-800">Collection & Dispensing Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis key="x" dataKey={xKey} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis key="y" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.8rem', border: '1px solid #E2E8F0', borderRadius: 8 }} />
              <Bar key="collected" dataKey={period === 'daily' ? 'collected' : period === 'annual' ? 'dispensed' : 'rawMl'} name="Collected" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar key="dispensed" dataKey={period === 'daily' ? 'dispensed' : period === 'annual' ? 'donors' : 'dispensedMl'} name="Dispensed" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donor Growth */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-gray-800">Donor Growth Line</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={period === 'annual' ? annualData : analyticsMonthlyData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis key="x" dataKey={period === 'annual' ? 'year' : 'month'} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis key="y" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.8rem', border: '1px solid #E2E8F0', borderRadius: 8 }} />
              <Line key="donors" type="monotone" dataKey="donors" name="Active Donors" stroke="#EC4899" strokeWidth={2.5} dot={{ fill: '#EC4899', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Batch Status Pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-gray-800">Batch Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie key="pie" data={statusPieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {statusPieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Program Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-gray-800">Collection Program Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie key="pie" data={programData} cx="50%" cy="50%" outerRadius={75} dataKey="value">
                {programData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Legend key="legend" iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '0.78rem' }} />
              <Tooltip key="tooltip" contentStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
