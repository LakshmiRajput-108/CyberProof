import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Search, ShieldCheck, Sun, Moon, Monitor, History, UserRound, Volume2, Minus, Plus, Globe2, ChevronDown, Code2 } from 'lucide-react';

interface HeaderProps { onOpenMobileNav: () => void; }

const nav = [
  { id: 'landing', label: 'Home' },
  { id: 'scan', label: 'Scan & Analyse' },
  { id: 'watchlist', label: 'Site Intelligence' },
  { id: 'incident-check', label: 'Got Scammed?' },
  { id: 'threat-pulse', label: 'Threat Radar' },
  { id: 'learn', label: 'Learn' },
  { id: 'membership', label: 'Membership' },
  { id: 'help-center', label: 'Help Center' },
] as const;

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { activeView, navigateTo, scans } = useAppData();
  const { theme, setTheme } = useTheme();
  const [showTheme, setShowTheme] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [language, setLanguage] = useState('EN');
  const [showLang, setShowLang] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const changeFont = (next: number) => {
    const safe = Math.min(1.18, Math.max(0.9, next));
    setFontScale(safe);
    document.documentElement.style.fontSize = `${safe * 16}px`;
  };

  const submitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigateTo('scan', { tab: 'url' });
  };

  return (
    <header className="cp-topbar">
      <div className="cp-brand-wrap">
        <button className="cp-mobile-menu" onClick={onOpenMobileNav} aria-label="Open menu"><Menu className="w-5 h-5" /></button>
        <button onClick={() => navigateTo('landing')} className="cp-brand">
          <span className="cp-brand-mark"><ShieldCheck className="w-5 h-5" /></span>
          <span><strong>CYBERPROOF</strong><small>Digital Trust Engine</small></span>
        </button>
      </div>

      <div className="cp-header-main">
        <nav className="cp-desktop-nav" aria-label="Primary navigation">
          {nav.map(item => <button key={item.id} onClick={() => navigateTo(item.id)} className={activeView === item.id ? 'active' : ''}>{item.label}</button>)}
        </nav>
        <div className="cp-header-tools">
          <form onSubmit={submitQuick} className="cp-quick-search">
            <Search className="w-4 h-4" /><input value={quickInput} onChange={e => setQuickInput(e.target.value)} placeholder="Quick check URL" /><button type="submit">Check</button>
          </form>
          <button className="cp-tool-btn cp-history-btn" onClick={() => navigateTo('history')} title="Security History"><History className="w-4 h-4" /><span>History</span><b>{scans.length}</b></button>
          <div className="cp-tool-group">
            <button className="cp-tool-btn" onClick={() => setShowLang(v => !v)} title="Language"><Globe2 className="w-4 h-4" /><span>{language}</span><ChevronDown className="w-3 h-3" /></button>
            {showLang && <div className="cp-popover cp-lang-pop"><button onClick={() => { setLanguage('EN'); setShowLang(false); }}>English</button><button onClick={() => { setLanguage('HI'); setShowLang(false); }}>हिन्दी</button><button onClick={() => { setLanguage('MR'); setShowLang(false); }}>मराठी</button><button onClick={() => { setLanguage('TE'); setShowLang(false); }}>తెలుగు</button></div>}
          </div>
          <button className="cp-tool-btn cp-read-btn" title="Read Aloud"><Volume2 className="w-4 h-4" /><span>Read</span></button>
          <div className="cp-font-tools"><button onClick={() => changeFont(fontScale - .04)} title="Decrease text size"><Minus className="w-3.5 h-3.5" /></button><span>A</span><button onClick={() => changeFont(fontScale + .04)} title="Increase text size"><Plus className="w-3.5 h-3.5" /></button></div>
          <div className="cp-tool-group">
            <button className="cp-tool-btn cp-mode-btn" onClick={() => setShowTheme(v => !v)} title="Mode"><span className="cp-mode-icon">{theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'system' ? <Monitor className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</span><span>Mode</span><ChevronDown className="w-3 h-3" /></button>
            {showTheme && <div className="cp-popover cp-theme-pop"><button onClick={() => {setTheme('light');setShowTheme(false)}}><Sun className="w-4 h-4" />Light</button><button onClick={() => {setTheme('dark');setShowTheme(false)}}><Moon className="w-4 h-4" />Dark</button><button onClick={() => {setTheme('system');setShowTheme(false)}}><Monitor className="w-4 h-4" />System</button></div>}
          </div>
          <button className="cp-profile-btn" onClick={() => navigateTo('profile')} title="Profile"><UserRound className="w-4 h-4" /><span>Profile</span></button>
          <button className="cp-developer-icon-btn" onClick={() => navigateTo('developers')} title="Project credits" aria-label="Project credits"><Code2 className="w-4 h-4" /></button>
        </div>
      </div>
    </header>
  );
};
