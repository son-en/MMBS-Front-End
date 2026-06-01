import { useState } from 'react';
import { Settings, Plus, CheckCircle, XCircle, User } from 'lucide-react';
import { mockSystemUsers } from '../mockData';
import type { SystemUser, UserRole } from '../types';

const roleColors: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
  admin: { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE', label: 'Administrator' },
  nurse: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Nurse / Staff' },
  donor: { bg: '#FFF0F7', text: '#9D174D', border: '#FBCFE8', label: 'Donor' },
  beneficiary: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'Beneficiary' },
};

export function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', role: 'nurse' as UserRole });

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: SystemUser = {
      id: `u${users.length + 1}`,
      name: form.name,
      username: form.username,
      role: form.role,
      status: 'active',
      lastLogin: 'Never',
    };
    setUsers(prev => [...prev, newUser]);
    setForm({ name: '', username: '', role: 'nurse' });
    setShowAdd(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1100px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
        <div>
          <h1 className="text-[#1E3A8A]">User Account Management</h1>
          <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Manage system user accounts and role-based access</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-all w-full md:w-auto"
          style={{ background: '#EC4899', fontSize: '0.875rem', fontWeight: 600 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#DB2777')}
          onMouseLeave={e => (e.currentTarget.style.background = '#EC4899')}
        >
          <Plus className="w-4 h-4" /> Add User Account
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 mb-4 md:mb-5">
          <h3 className="text-gray-800 mb-4">New User Account</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1.5 text-gray-600" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" style={{ fontSize: '0.875rem' }} onFocus={e => (e.target.style.borderColor = '#EC4899')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
            <div>
              <label className="block mb-1.5 text-gray-600" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Username</label>
              <input required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" style={{ fontSize: '0.875rem' }} onFocus={e => (e.target.style.borderColor = '#EC4899')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
            <div>
              <label className="block mb-1.5 text-gray-600" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white" style={{ fontSize: '0.875rem' }}>
                <option value="nurse">Nurse / Staff</option>
                <option value="admin">Administrator</option>
                <option value="donor">Donor</option>
                <option value="beneficiary">Beneficiary</option>
              </select>
            </div>
            <div className="md:col-span-3 flex flex-col md:flex-row md:justify-end gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all order-2 md:order-1" style={{ fontSize: '0.82rem' }}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg text-white transition-all order-1 md:order-2" style={{ background: '#1E3A8A', fontSize: '0.82rem', fontWeight: 600 }}>Save to Database</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1E3A8A' }}>
                {['User', 'Username', 'Role', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const roleStyle = roleColors[u.role];
                return (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? '#FAFAFA' : 'white' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#1E3A8A]" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>{u.username}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full border" style={{ background: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border, fontSize: '0.72rem', fontWeight: 600 }}>
                        {roleStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500" style={{ fontSize: '0.8rem' }}>{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      {u.status === 'active'
                        ? <span className="flex items-center gap-1 text-green-600" style={{ fontSize: '0.78rem', fontWeight: 600 }}><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                        : <span className="flex items-center gap-1 text-red-500" style={{ fontSize: '0.78rem', fontWeight: 600 }}><XCircle className="w-3.5 h-3.5" /> Inactive</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="px-2.5 py-1.5 rounded-lg border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all" style={{ fontSize: '0.72rem', fontWeight: 500 }}>Edit</button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="px-2.5 py-1.5 rounded-lg border transition-all"
                          style={{ fontSize: '0.72rem', fontWeight: 500, borderColor: u.status === 'active' ? '#FECACA' : '#BBF7D0', color: u.status === 'active' ? '#991B1B' : '#15803D' }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack */}
        <div className="md:hidden divide-y divide-gray-100">
          {users.map(u => {
            const roleStyle = roleColors[u.role];
            return (
              <div key={u.id} className="px-4 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'monospace', marginTop: 2 }}>{u.username}</div>
                    </div>
                  </div>
                  {u.status === 'active'
                    ? <span className="flex items-center gap-1 text-green-600 flex-shrink-0" style={{ fontSize: '0.75rem', fontWeight: 600 }}><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                    : <span className="flex items-center gap-1 text-red-500 flex-shrink-0" style={{ fontSize: '0.75rem', fontWeight: 600 }}><XCircle className="w-3.5 h-3.5" /> Inactive</span>}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full border" style={{ background: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border, fontSize: '0.72rem', fontWeight: 600 }}>
                    {roleStyle.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Last login: {u.lastLogin}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Edit</button>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="flex-1 px-3 py-2 rounded-lg border transition-all"
                    style={{ fontSize: '0.8rem', fontWeight: 500, borderColor: u.status === 'active' ? '#FECACA' : '#BBF7D0', color: u.status === 'active' ? '#991B1B' : '#15803D' }}
                  >
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
