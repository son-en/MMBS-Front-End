import { useState } from 'react';
import { ClipboardList, Search, Shield } from 'lucide-react';
import { mockAuditLogs, mockSystemUsers } from '../mockData';
import type { SystemUser } from '../types';

const actionColors: Record<string, { bg: string; text: string; border: string }> = {
  INSERT: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  UPDATE: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  DELETE: { bg: '#FFF5F5', text: '#991B1B', border: '#FECACA' },
  EXPORT: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  REVOKE: { bg: '#FAF5FF', text: '#7E22CE', border: '#E9D5FF' },
};

export function AuditLogs() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);

  const logs = mockAuditLogs.filter(l =>
    l.changedBy.toLowerCase().includes(search.toLowerCase()) ||
    l.targetTable.toLowerCase().includes(search.toLowerCase()) ||
    l.auditAction.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'revoked' ? 'active' : 'revoked' } : u));
  };

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    admin: { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
    nurse: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
    donor: { bg: '#FFF0F7', text: '#9D174D', border: '#FBCFE8' },
    beneficiary: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px]">
      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">Security Console</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>RBAC credential controls and system audit trail</p>
      </div>

      {/* RBAC Controls */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-gray-800">RBAC Access Control</h3>
          <span className="text-gray-400 ml-auto" style={{ fontSize: '0.78rem' }}>Active credential modification</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['User', 'Username', 'Role Assignment', 'Last Login', 'Operational Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rs = roleColors[u.role] || roleColors.donor;
                return (
                  <tr key={u.id} style={{ background: u.status === 'revoked' ? '#FFF5F5' : i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                    <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.83rem', fontWeight: 600 }}>{u.name}</td>
                    <td className="px-4 py-3 text-gray-400" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{u.username}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full border capitalize" style={{ background: rs.bg, color: rs.text, borderColor: rs.border, fontSize: '0.72rem', fontWeight: 700 }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.78rem' }}>{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full border" style={{
                        background: u.status === 'active' ? '#F0FDF4' : '#FFF5F5',
                        color: u.status === 'active' ? '#15803D' : '#991B1B',
                        borderColor: u.status === 'active' ? '#BBF7D0' : '#FECACA',
                        fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        {u.status === 'active' ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2.5 py-1.5 rounded-lg border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleRevoke(u.id)}
                          className="px-2.5 py-1.5 rounded-lg border transition-all"
                          style={{
                            borderColor: u.status === 'active' ? '#FECACA' : '#BBF7D0',
                            color: u.status === 'active' ? '#991B1B' : '#15803D',
                            fontSize: '0.72rem', fontWeight: 500,
                          }}
                        >
                          {u.status === 'active' ? 'Revoke' : 'Reinstate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <ClipboardList className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-gray-800">Audit Trail Viewer</h3>
          <div className="ml-auto relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg outline-none bg-white"
              style={{ fontSize: '0.8rem' }}
              onFocus={e => (e.target.style.borderColor = '#EC4899')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['Log ID', 'Changed By', 'Audit Action', 'Target Table', 'Old Data Snapshot', 'New Data Overwrite', 'Timestamp'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const as_ = actionColors[log.auditAction] || { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
                return (
                  <tr key={log.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                    <td className="px-4 py-3" style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1E3A8A', fontFamily: 'monospace' }}>{log.logId}</td>
                    <td className="px-4 py-3 text-gray-700" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{log.changedBy}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full border" style={{ background: as_.bg, color: as_.text, borderColor: as_.border, fontSize: '0.7rem', fontWeight: 700 }}>
                        {log.auditAction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600" style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 600 }}>{log.targetTable}</span>
                    </td>
                    <td className="px-4 py-3" style={{ maxWidth: 180 }}>
                      <p className="text-gray-400 truncate" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }} title={log.oldData}>{log.oldData}</p>
                    </td>
                    <td className="px-4 py-3" style={{ maxWidth: 180 }}>
                      <p className="text-gray-600 truncate" style={{ fontSize: '0.72rem', fontFamily: 'monospace' }} title={log.newData}>{log.newData}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400" style={{ fontSize: '0.72rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400" style={{ fontSize: '0.875rem' }}>No audit logs match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
