import { LayoutDashboard, Users, Milk, FlaskConical, Package, UserCheck, Mail, BarChart3, ClipboardList, Settings, LogOut, ChevronRight, User, TestTube2, Shield, Droplets, ClipboardCheck } from 'lucide-react';
import type { User as UserType, UserRole } from '../types';

export type Screen =
  | 'dashboard'
  | 'donor-management'
  | 'donor-screening'
  | 'milk-collection'
  | 'lab-results'
  | 'pasteurization-board'
  | 'inventory'
  | 'beneficiary-portal'
  | 'email-communications'
  | 'analytics'
  | 'user-management'
  | 'audit-logs'
  | 'donor-self-portal'
  | 'beneficiary-self-portal';

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { id: 'donor-management', label: 'Donor Records', icon: Users, roles: ['admin', 'nurse'] },
  { id: 'donor-screening', label: 'Donor Screening', icon: ClipboardCheck, roles: ['admin', 'nurse'] },
  { id: 'milk-collection', label: 'Intake Station', icon: Milk, roles: ['admin', 'nurse'] },
  { id: 'lab-results', label: 'Lab Results Panel', icon: TestTube2, roles: ['admin', 'nurse'] },
  { id: 'pasteurization-board', label: 'Pasteurization Manager', icon: FlaskConical, roles: ['admin', 'nurse'] },
  { id: 'inventory', label: 'Inventory Board', icon: Package, roles: ['admin', 'nurse'] },
  { id: 'beneficiary-portal', label: 'Dispensing Portal', icon: UserCheck, roles: ['admin', 'nurse'] },
  { id: 'email-communications', label: 'Email Communications', icon: Mail, roles: ['admin', 'nurse'] },
  { id: 'analytics', label: 'System Report Engine', icon: BarChart3, roles: ['admin'] },
  { id: 'user-management', label: 'User Management Console', icon: Settings, roles: ['admin'] },
  { id: 'audit-logs', label: 'Security Console', icon: Shield, roles: ['admin'] },
  { id: 'donor-self-portal', label: 'My Donor Profile', icon: User, roles: ['donor'] },
  { id: 'beneficiary-self-portal', label: 'Milk Availability', icon: Package, roles: ['beneficiary'] },
];

interface SidebarProps {
  currentUser: UserType;
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const roleColors: Record<UserRole, { bg: string; text: string; label: string }> = {
  admin: { bg: '#EFF6FF', text: '#1E3A8A', label: 'Administrator' },
  nurse: { bg: '#F0FDF4', text: '#15803D', label: 'Nurse / Staff' },
  donor: { bg: '#FFF0FB', text: '#9D174D', label: 'Donor' },
  beneficiary: { bg: '#FFF7ED', text: '#C2410C', label: 'Beneficiary' },
};

export function Sidebar({ currentUser, activeScreen, onNavigate, onLogout }: SidebarProps) {
  const visibleItems = navItems.filter(item => item.roles.includes(currentUser.role));
  const roleStyle = roleColors[currentUser.role];

  return (
    <div className="flex flex-col h-full" style={{ width: 260, background: '#1E3A8A', minHeight: '100vh' }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white" style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>LACTA BANK</div>
            <div className="text-blue-200" style={{ fontSize: '0.62rem', lineHeight: 1.2 }}>Makati Milk Banking System</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EC4899] flex items-center justify-center text-white" style={{ fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
            {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="min-w-0">
            <div className="text-white truncate" style={{ fontWeight: 600, fontSize: '0.8rem' }}>{currentUser.name}</div>
            <span className="inline-block px-2 py-0.5 rounded-full mt-0.5" style={{ background: roleStyle.bg, color: roleStyle.text, fontSize: '0.65rem', fontWeight: 600 }}>
              {roleStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                style={{
                  background: isActive ? '#EC4899' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <LogOut className="w-4 h-4" />
          <span style={{ fontSize: '0.82rem' }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
