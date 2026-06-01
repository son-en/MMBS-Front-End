import { useState } from 'react';
import { Mail, RefreshCw, X, Eye, Droplets } from 'lucide-react';
import { mockEmailLogs } from '../mockData';
import type { EmailLog } from '../types';

const statusConfig: Record<EmailLog['status'], { bg: string; text: string; border: string; label: string }> = {
  delivered: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Delivered' },
  sent: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', label: 'Sent' },
  failed: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA', label: 'Failed — Retry' },
  bounced: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Bounced' },
};

export function EmailCommunications() {
  const [logs] = useState<EmailLog[]>(mockEmailLogs);
  const [previewLog, setPreviewLog] = useState<EmailLog | null>(null);

  const stats = {
    total: logs.length,
    delivered: logs.filter(l => l.status === 'delivered').length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed' || l.status === 'bounced').length,
  };

  return (
    <div className="p-4 md:p-6 max-w-[1100px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">Email Communications Hub</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Automated email dispatch logs for beneficiary pickup notifications</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all w-full md:w-auto" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
        {[
          { label: 'Total Dispatched', value: stats.total, color: '#1E3A8A', bg: '#EFF6FF' },
          { label: 'Delivered', value: stats.delivered, color: '#15803D', bg: '#F0FDF4' },
          { label: 'In Transit', value: stats.sent, color: '#1D4ED8', bg: '#DBEAFE' },
          { label: 'Failed / Bounced', value: stats.failed, color: '#991B1B', bg: '#FEF2F2' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: stat.bg }}>
              <Mail className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div className="text-gray-500" style={{ fontSize: '0.75rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-gray-800">Emailing Logs</h3>
          <span className="ml-auto text-gray-400" style={{ fontSize: '0.78rem' }}>{logs.length} records</span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
          <thead>
            <tr style={{ background: '#1E3A8A' }}>
              {['Email ID', 'Beneficiary ID', 'Target Batch ID', 'Guardian', 'Sender Account', 'Sent At', 'Status', 'Preview'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => {
              const sc = statusConfig[log.status];
              return (
                <tr key={log.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                  <td className="px-4 py-3" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E3A8A', fontFamily: 'monospace' }}>{log.emailId}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{log.beneficiaryId}</td>
                  <td className="px-4 py-3" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0E7490' }}>{log.targetBatchId}</td>
                  <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{log.guardianName}</td>
                  <td className="px-4 py-3 text-gray-400" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{log.senderAccount}</td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{log.sentAt}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full border" style={{ background: sc.bg, color: sc.text, borderColor: sc.border, fontSize: '0.7rem', fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPreviewLog(log)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                      style={{ fontSize: '0.72rem', fontWeight: 500 }}
                    >
                      <Eye className="w-3 h-3" /> View
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
          {logs.map(log => {
            const sc = statusConfig[log.status];
            return (
              <div key={log.id} className="px-4 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>
                      {log.emailId}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>
                      {log.guardianName}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full border flex-shrink-0" style={{ background: sc.bg, color: sc.text, borderColor: sc.border, fontSize: '0.68rem', fontWeight: 600 }}>
                    {sc.label}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Beneficiary</span>
                    <span style={{ fontSize: '0.78rem', color: '#374151', fontFamily: 'monospace' }}>{log.beneficiaryId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Batch ID</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0E7490' }}>{log.targetBatchId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Sent At</span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{log.sentAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewLog(log)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  style={{ fontSize: '0.8rem', fontWeight: 500 }}
                >
                  <Eye className="w-3.5 h-3.5" /> View Email Preview
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Sandbox Overlay */}
      {previewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) setPreviewLog(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full md:w-auto" style={{ maxWidth: 580, maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-gray-700" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Template Sandbox — Email Preview</span>
              </div>
              <button onClick={() => setPreviewLog(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5">
              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 border border-gray-100" style={{ fontSize: '0.78rem' }}>
                <div className="flex gap-2 mb-1"><span className="text-gray-400 w-14">From:</span><span className="text-gray-700">{previewLog.senderAccount}</span></div>
                <div className="flex gap-2 mb-1"><span className="text-gray-400 w-14">To:</span><span className="text-gray-700">{previewLog.recipientEmail}</span></div>
                <div className="flex gap-2"><span className="text-gray-400 w-14">Subject:</span><span className="text-gray-700 font-medium">{previewLog.subject}</span></div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 text-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                      <Droplets className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white" style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>LACTA BANK</span>
                  </div>
                  <p className="text-white/70" style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Makati Milk Bank · Official Notification</p>
                </div>

                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4" style={{ fontSize: '0.85rem' }}>Dear <strong>{previewLog.guardianName}</strong>,</p>
                  <p className="text-gray-600 mb-5" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                    We are pleased to inform you that batch <strong style={{ color: '#0E7490' }}>{previewLog.targetBatchId}</strong> has passed all biovigilance protocols and has been cleared for pickup.
                  </p>

                  <div className="rounded-lg overflow-hidden border border-gray-200 mb-5">
                    <div className="px-4 py-2.5" style={{ background: '#1E3A8A' }}>
                      <span className="text-white" style={{ fontSize: '0.78rem', fontWeight: 700 }}>Pickup Schedule & Clearance Details</span>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {[
                          ['Batch Reference', previewLog.targetBatchId],
                          ['Clearance Status', 'Fully Cleared — Safe for Neonatal Use'],
                          ['Pickup Window', 'Within 48 hours of this notification'],
                          ['Location', 'Makati Milk Bank · Ground Floor, Makati City Hall'],
                          ['Contact', '+63 2 8888-MILK | lactabank@makati.gov.ph'],
                        ].map(([label, value]) => (
                          <tr key={label} className="border-b border-gray-100 last:border-0">
                            <td className="px-4 py-2 text-gray-500" style={{ fontSize: '0.75rem', fontWeight: 600, width: '40%' }}>{label}</td>
                            <td className="px-4 py-2 text-gray-700" style={{ fontSize: '0.75rem' }}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-gray-400" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
                    Please present your valid ID and pediatrician's prescription upon collection. This email was automatically generated by the LACTA BANK distribution system.
                  </p>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 text-center" style={{ background: '#F8FAFC' }}>
                  <p className="text-gray-400" style={{ fontSize: '0.68rem' }}>LACTA BANK · Makati City Health Department · noreply@lactabank.ph</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
