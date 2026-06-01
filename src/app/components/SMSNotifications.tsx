import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { mockSMSLogs } from '../mockData';
import { DeliveryStatusBadge } from './StatusBadge';

export function SMSNotifications() {
  const logs = mockSMSLogs;

  const stats = {
    total: logs.length,
    delivered: logs.filter(l => l.status === 'delivered').length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
  };

  return (
    <div className="p-6 max-w-[1100px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">Automated SMS Notification Logs</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Track outgoing notifications to waiting guardians</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sent', value: stats.total, color: '#1E3A8A', bg: '#EFF6FF' },
          { label: 'Delivered', value: stats.delivered, color: '#15803D', bg: '#F0FDF4' },
          { label: 'In Transit', value: stats.sent, color: '#1D4ED8', bg: '#DBEAFE' },
          { label: 'Failed', value: stats.failed, color: '#991B1B', bg: '#FEF2F2' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: stat.bg }}>
              <Send className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div className="text-gray-500" style={{ fontSize: '0.78rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Log Thread */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-gray-800">Message Activity Thread</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#1E3A8A' }}>
              {['Recipient', 'Guardian', 'Message Preview', 'Sent At', 'Delivery Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#374151', fontFamily: 'monospace' }}>{log.recipient}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-700" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{log.guardianName}</td>
                <td className="px-4 py-3.5" style={{ maxWidth: 300 }}>
                  <p className="text-gray-600" style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {log.message}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-gray-500" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{log.sentAt}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <DeliveryStatusBadge status={log.status} />
                    {log.status === 'failed' && (
                      <button className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all" title="Retry sending">
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
