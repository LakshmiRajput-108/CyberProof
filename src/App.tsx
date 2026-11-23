
import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { Button } from './components/ui/Button';
import { useAuth } from './context/AuthContext';

// Views
import { LandingView } from './views/LandingView';
import { ScanView } from './views/ScanView';
import { DashboardView } from './views/DashboardView';
import { ResultView } from './views/ResultView';
import { HistoryView } from './views/HistoryView';
import { WebsiteDetailView } from './views/WebsiteDetailView';
import { WatchlistView } from './views/WatchlistView';
import { IncidentCheckView } from './views/IncidentCheckView';
import { ThreatPulseView } from './views/ThreatPulseView';
import { LearnView } from './views/LearnView';
import { MembershipView } from './views/MembershipView';
import { ExtensionPreviewView } from './views/ExtensionPreviewView';
import { ProfilePrivacyView } from './views/ProfilePrivacyView';
import { HelpCenterView } from './views/HelpCenterView';
import { DevelopersView } from './views/DevelopersView';
import { AccountView } from './views/AccountView';

const AppContent: React.FC = () => {
  const {
    activeView,
    navigateTo,
    guestSessionError,
    retryGuestSession,
  } = useAppData();
  const {
    loading: authLoading,
    guestLoading,
    sessionExpired,
    dismissSessionExpired,
    sessionVerificationError,
    retrySessionVerification,
  } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing': return <LandingView />;
      case 'scan': return <ScanView />;
      case 'dashboard': return <DashboardView />;
      case 'result': return <ResultView />;
      case 'history': return <HistoryView />;
      case 'website-detail': return <WebsiteDetailView />;
      case 'watchlist': return <WatchlistView />;
      case 'incident-check': return <IncidentCheckView />;
      case 'threat-pulse': return <ThreatPulseView />;
      case 'learn': return <LearnView />;
      case 'membership': return <MembershipView />;
      case 'extension-preview': return <ExtensionPreviewView />;
      case 'profile': return <ProfilePrivacyView />;
      case 'account': return <AccountView />;
      case 'help-center': return <HelpCenterView />;
      case 'developers': return <DevelopersView />;
      default: return <LandingView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--cp-bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-5 md:py-7">
          {sessionExpired && (
            <div role="alert" className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-sm text-amber-900 dark:text-amber-200">
              <p>Your member session expired. Sign in again to use member features; guest URL scanning remains available.</p>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => navigateTo('account')}>Sign in</Button>
                <Button size="sm" variant="ghost" onClick={dismissSessionExpired}>Dismiss</Button>
              </div>
            </div>
          )}
          {sessionVerificationError && (
            <div role="alert" className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-sm text-rose-800 dark:text-rose-200">
              <p>{sessionVerificationError}</p>
              <Button size="sm" isLoading={authLoading} onClick={retrySessionVerification}>Retry account check</Button>
            </div>
          )}
          {guestSessionError && activeView !== 'watchlist' && (
            <div role="alert" className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-sm text-rose-800 dark:text-rose-200">
              <p>{guestSessionError}</p>
              <Button size="sm" isLoading={guestLoading} onClick={() => void retryGuestSession()}>
                Retry guest session
              </Button>
            </div>
          )}
          {renderActiveView()}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <AppContent />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
