import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

// Views
import { LandingView } from './views/LandingView';
import { ScanView } from './views/ScanView';
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

const AppContent: React.FC = () => {
  const { activeView } = useAppData();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'scan':
        return <ScanView />;
      case 'result':
        return <ResultView />;
      case 'history':
        return <HistoryView />;
      case 'website-detail':
        return <WebsiteDetailView />;
      case 'watchlist':
        return <WatchlistView />;
      case 'incident-check':
        return <IncidentCheckView />;
      case 'threat-pulse':
        return <ThreatPulseView />;
      case 'learn':
        return <LearnView />;
      case 'membership':
        return <MembershipView />;
      case 'extension-preview':
        return <ExtensionPreviewView />;
      case 'profile':
        return <ProfilePrivacyView />;
      case 'help-center':
        return <HelpCenterView />;
      case 'developers':
        return <DevelopersView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--cp-bg)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-5 md:py-7">
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
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default App;
