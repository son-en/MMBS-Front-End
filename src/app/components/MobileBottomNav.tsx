import { LayoutDashboard, Milk, FlaskConical, ClipboardCheck, User, Package } from 'lucide-react';
import type { UserRole } from '../types';
import type { Screen } from './Sidebar';

interface MobileBottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  role: UserRole;
}

const staffItems = [
  { id: 'dashboard' as Screen, label: 'Home', icon: LayoutDashboard },
  { id: 'milk-collection' as Screen, label: 'Intake', icon: Milk },
  { id: 'pasteurization-board' as Screen, label: 'Process', icon: FlaskConical },
  { id: 'donor-screening' as Screen, label: 'Queue', icon: ClipboardCheck },
];

const donorItems = [
  { id: 'donor-self-portal' as Screen, label: 'My Profile', icon: User },
];

const beneficiaryItems = [
  { id: 'beneficiary-self-portal' as Screen, label: 'Availability', icon: Package },
];

export function MobileBottomNav({ activeScreen, onNavigate, role }: MobileBottomNavProps) {
  const items =
    role === 'admin' || role === 'nurse'
      ? staffItems
      : role === 'donor'
      ? donorItems
      : beneficiaryItems;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-gray-100 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all"
            style={{ minHeight: 56 }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl transition-all"
              style={{ background: isActive ? '#EC4899' : 'transparent' }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? 'white' : '#9CA3AF' }}
              />
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#EC4899' : '#9CA3AF',
                letterSpacing: '0.01em',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
