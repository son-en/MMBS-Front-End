import { useState } from 'react';
import { Eye, EyeOff, Droplets, Lock, User } from 'lucide-react';
import type { User as UserType, UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const demoAccounts = [
  { username: 'admin_reyes', password: 'admin123', name: 'Admin Ana Reyes', role: 'admin' as UserRole },
  { username: 'nurse_delacruz', password: 'nurse123', name: 'Nurse Maria Dela Cruz', role: 'nurse' as UserRole },
  { username: 'donor_santos', password: 'donor123', name: 'Maria Santos', role: 'donor' as UserRole },
  { username: 'ben_reyes', password: 'ben123', name: 'Jose Reyes', role: 'beneficiary' as UserRole },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const account = demoAccounts.find(a => a.username === username && a.password === password);
      if (account) {
        onLogin({ id: account.username, name: account.name, role: account.role, username: account.username });
      } else {
        setError('Invalid username or password. Try a demo account below.');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#1E3A8A]" style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.03em' }}>LACTA BANK</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>Makati Milk Banking System · Access Control Gateway</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 600, fontSize: '1.25rem' }}>Welcome back</h2>
          <p className="text-gray-500 mb-6" style={{ fontSize: '0.875rem' }}>Sign in to your clinical workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all bg-white"
                  style={{
                    borderColor: username ? '#EC4899' : '#D1D5DB',
                    boxShadow: username ? '0 0 0 3px rgba(236,72,153,0.1)' : 'none',
                    fontSize: '0.9rem'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#EC4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)';
                  }}
                  onBlur={e => {
                    if (!username) {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none transition-all bg-white"
                  style={{
                    borderColor: password ? '#EC4899' : '#D1D5DB',
                    boxShadow: password ? '0 0 0 3px rgba(236,72,153,0.1)' : 'none',
                    fontSize: '0.9rem'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#EC4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)';
                  }}
                  onBlur={e => {
                    if (!password) {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700" style={{ fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isLoading || !username || !password ? '#9CA3AF' : '#1E3A8A',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.01em'
              }}
            >
              {isLoading ? 'Authenticating...' : 'Authenticate Session'}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-5 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-gray-500 mb-3 text-center" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Demo Accounts — click to auto-fill</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.username}
                onClick={() => handleDemoLogin(acc)}
                className="text-left px-3 py-2 rounded-lg border transition-all hover:border-[#EC4899] hover:bg-pink-50"
                style={{ borderColor: '#E5E7EB', fontSize: '0.75rem' }}
              >
                <div style={{ fontWeight: 600, color: '#1E3A8A' }}>{acc.role.charAt(0).toUpperCase() + acc.role.slice(1)}</div>
                <div className="text-gray-500">{acc.username}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 mt-4" style={{ fontSize: '0.75rem' }}>
          Makati City Health Department · Biovigilance System v2.0
        </p>
      </div>
    </div>
  );
}
