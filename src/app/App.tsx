import { useState } from 'react';
import { Droplets, Menu, X } from 'lucide-react';
import type { User, ScreeningApplication } from './types';
import { mockScreeningApplications } from './mockData';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar, type Screen } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { DonorManagement } from './components/DonorManagement';
import { DonorScreening } from './components/DonorScreening';
import { MilkCollection } from './components/MilkCollection';
import { LabResultsPanel } from './components/LabResultsPanel';
import { PasteurizationBoard } from './components/PasteurizationBoard';
import { InventoryDashboard } from './components/InventoryDashboard';
import { BeneficiaryPortal } from './components/BeneficiaryPortal';
import { EmailCommunications } from './components/EmailCommunications';
import { AdminAnalytics } from './components/AdminAnalytics';
import { UserManagement } from './components/UserManagement';
import { AuditLogs } from './components/AuditLogs';
import { DonorSelfPortal } from './components/DonorSelfPortal';
import { BeneficiarySelfPortal } from './components/BeneficiarySelfPortal';
import { DonorRegistrationForm } from './components/DonorRegistrationForm';
import { BeneficiaryRegistrationForm } from './components/BeneficiaryRegistrationForm';
import { MobileBottomNav } from './components/MobileBottomNav';

type PublicView = 'landing' | 'staff-login' | 'donor-form' | 'beneficiary-form';

const defaultScreen: Record<User['role'], Screen> = {
  admin: 'dashboard',
  nurse: 'donor-management',
  donor: 'donor-self-portal',
  beneficiary: 'beneficiary-self-portal',
};

const screenLabels: Record<Screen, string> = {
  'dashboard': 'Dashboard',
  'donor-management': 'Donor Records',
  'donor-screening': 'Donor Screening & Verification',
  'milk-collection': 'Intake Station',
  'lab-results': 'Lab Results Panel',
  'pasteurization-board': 'Pasteurization Manager',
  'inventory': 'Inventory Board',
  'beneficiary-portal': 'Dispensing Portal',
  'email-communications': 'Email Communications',
  'analytics': 'System Report Engine',
  'user-management': 'User Management Console',
  'audit-logs': 'Security Console',
  'donor-self-portal': 'My Donor Profile',
  'beneficiary-self-portal': 'My Beneficiary Portal',
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [publicView, setPublicView] = useState<PublicView>('landing');
  const [screeningApplications, setScreeningApplications] = useState<ScreeningApplication[]>(mockScreeningApplications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUpdateScreening = (id: string, patch: Partial<ScreeningApplication>) => {
    setScreeningApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const handleSubmitDonorApplication = (app: ScreeningApplication) => {
    setScreeningApplications(prev => [app, ...prev]);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveScreen(defaultScreen[user.role]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('dashboard');
    setPublicView('landing');
  };

  // Public views (before login)
  if (!currentUser) {
    if (publicView === 'landing') {
      return (
        <LandingPage
          onNavigateToStaffPortal={() => setPublicView('staff-login')}
          onNavigateToDonorForm={() => setPublicView('donor-form')}
          onNavigateToBeneficiaryForm={() => setPublicView('beneficiary-form')}
        />
      );
    }

    if (publicView === 'staff-login') {
      return (
        <div>
          <button
            onClick={() => setPublicView('landing')}
            className="absolute top-4 left-4 text-gray-600 hover:text-[#EC4899] flex items-center gap-2 font-medium z-10"
          >
            ← Back to Home
          </button>
          <LoginScreen onLogin={handleLogin} />
        </div>
      );
    }

    if (publicView === 'donor-form') {
      return <DonorRegistrationForm onBackToHome={() => setPublicView('landing')} onSubmitApplication={handleSubmitDonorApplication} />;
    }

    if (publicView === 'beneficiary-form') {
      return <BeneficiaryRegistrationForm onBackToHome={() => setPublicView('landing')} />;
    }
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <DashboardOverview />;
      case 'donor-management': return <DonorManagement />;
      case 'donor-screening': return <DonorScreening applications={screeningApplications} onUpdate={handleUpdateScreening} currentUserName={currentUser?.name ?? 'Staff'} />;
      case 'milk-collection': return <MilkCollection screeningApplications={screeningApplications} />;
      case 'lab-results': return <LabResultsPanel />;
      case 'pasteurization-board': return <PasteurizationBoard />;
      case 'inventory': return <InventoryDashboard />;
      case 'beneficiary-portal': return <BeneficiaryPortal />;
      case 'email-communications': return <EmailCommunications />;
      case 'analytics': return <AdminAnalytics />;
      case 'user-management': return <UserManagement />;
      case 'audit-logs': return <AuditLogs />;
      case 'donor-self-portal': return <DonorSelfPortal currentUser={currentUser} />;
      case 'beneficiary-self-portal': return <BeneficiarySelfPortal currentUser={currentUser} />;
      default: return <DashboardOverview />;
    }
  };

  const handleMobileNavigate = (screen: Screen) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden md:flex flex-shrink-0 overflow-y-auto" style={{ width: 260 }}>
        <Sidebar
          currentUser={currentUser}
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className="md:hidden fixed top-0 left-0 h-full z-50 overflow-y-auto transition-transform duration-300"
        style={{
          width: 280,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar
          currentUser={currentUser}
          activeScreen={activeScreen}
          onNavigate={handleMobileNavigate}
          onLogout={() => { setMobileMenuOpen(false); handleLogout(); }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg mr-1"
              style={{ background: '#F1F5F9' }}
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#1E3A8A]" /> : <Menu className="w-5 h-5 text-[#1E3A8A]" />}
            </button>

            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
                <Droplets className="w-3 h-3 text-white" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.01em' }}>LACTA BANK</span>
            </div>
            <span className="hidden md:inline text-gray-300 mx-1">/</span>
            <span className="hidden md:inline text-gray-400" style={{ fontSize: '0.78rem' }}>Makati Milk Banking System</span>
            <span className="hidden md:inline text-gray-300 mx-1">/</span>
            <span className="hidden md:inline text-[#1E3A8A]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              {screenLabels[activeScreen]}
            </span>
            {/* Mobile current screen label */}
            <span className="md:hidden text-[#1E3A8A]" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              {screenLabels[activeScreen]}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block text-right">
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1F2937' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>
                {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'nurse' ? 'Nurse / Staff' : currentUser.role === 'donor' ? 'Donor' : 'Beneficiary'}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EC4899] flex items-center justify-center text-white" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
          </div>
        </div>

        {/* Page Content — add bottom padding on mobile for bottom nav */}
        <div className="min-h-[calc(100vh-53px)] pb-[72px] md:pb-0">
          {renderScreen()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeScreen={activeScreen}
        onNavigate={handleMobileNavigate}
        role={currentUser.role}
      />
    </div>
  );
}
