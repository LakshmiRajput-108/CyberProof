import React, { useRef, useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Search, ShieldCheck, Sun, Moon, Monitor, History, UserRound, Volume2, Minus, Plus, Globe2, ChevronDown, Code2 } from 'lucide-react';
import { VoiceInputButton } from '../accessibility/SpeechControls';
import { useLanguage, Language, languageNames } from '../../context/LanguageContext';
import { useReadAloud } from '../../context/ReadAloudContext';

interface HeaderProps { onOpenMobileNav: () => void; }

const nav = [
  { id: 'landing', labelKey: 'nav.home' },
  { id: 'scan', labelKey: 'nav.scan' },
  { id: 'dashboard', labelKey: 'nav.dashboard' },
  { id: 'watchlist', labelKey: 'nav.watchlist' },
  { id: 'incident-check', labelKey: 'nav.scammed' },
  { id: 'threat-pulse', labelKey: 'nav.threat' },
  { id: 'learn', labelKey: 'nav.learn' },
  { id: 'membership', labelKey: 'nav.membership' },
  { id: 'help-center', labelKey: 'nav.help' },
] as const;

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { activeView, navigateTo, scans } = useAppData();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, languageName } = useLanguage();
  const readAloud = useReadAloud();
  const [showTheme, setShowTheme] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [showLang, setShowLang] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const quickSearchSequence = useRef(0);

  const changeFont = (next: number) => {
    const safe = Math.min(1.18, Math.max(0.9, next));
    setFontScale(safe);
    document.documentElement.style.fontSize = `${safe * 16}px`;
  };

  const submitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    quickSearchSequence.current += 1;
    navigateTo('scan', {
      tab: 'url',
      url: quickInput.trim(),
      urlRequestId: quickSearchSequence.current,
    });
  };

  return (
    <header className="cp-topbar">
      <div className="cp-brand-wrap">
        <button className="cp-mobile-menu" onClick={onOpenMobileNav} aria-label={t('header.openMenu')}><Menu className="w-5 h-5" /></button>
        <button onClick={() => navigateTo('landing')} className="cp-brand">
          <span className="cp-brand-mark"><ShieldCheck className="w-5 h-5" /></span>
          <span><strong>CYBERPROOF</strong><small>{t('header.brandTag')}</small></span>
        </button>
      </div>

      <div className="cp-header-main">
        <nav className="cp-desktop-nav" aria-label="Primary navigation">
          {nav.map(item => <button key={item.id} onClick={() => navigateTo(item.id)} className={activeView === item.id ? 'active' : ''}>{t(item.labelKey)}</button>)}
        </nav>
        <div className="cp-header-tools">
          <form onSubmit={submitQuick} className="cp-quick-search">
            <Search className="w-4 h-4" /><input value={quickInput} onChange={e => setQuickInput(e.target.value)} placeholder={t('header.quickPlaceholder')} /><VoiceInputButton onTranscript={text => setQuickInput(prev => prev.trim() ? `${prev.trim()} ${text}` : text)} /><button type="submit">{t('header.check')}</button>
          </form>
          <button className="cp-tool-btn cp-history-btn" onClick={() => navigateTo('history')} title={t('history.title')}><History className="w-4 h-4" /><span>{t('nav.history')}</span><b>{scans.length}</b></button>
          <div className="cp-tool-group">
            <button className="cp-tool-btn" onClick={() => setShowLang(v => !v)} title={t('header.language')}><Globe2 className="w-4 h-4" /><span>{language.toUpperCase()}</span><ChevronDown className="w-3 h-3" /></button>
            {showLang && <div className="cp-popover cp-lang-pop">
              {(['en','hi','mr','te'] as Language[]).map(code => <button key={code} onClick={() => { setLanguage(code); setShowLang(false); }} lang={code}>{languageNames[code]}</button>)}
            </div>}
          </div>
          <div className="cp-read-controls">
            <button
              className="cp-tool-btn cp-read-btn"
              title="Read Aloud"
              onClick={readAloud.status === 'idle' ? readAloud.start : readAloud.stop}
              disabled={!readAloud.supported}
            >
              <Volume2 className="w-4 h-4" />
              <span>{readAloud.status === 'idle' ? t('header.read') : t('header.stop')}</span>
            </button>
            {readAloud.status !== 'idle' && (
              <>
                {readAloud.status === 'reading'
                  ? <button className="cp-read-control" onClick={readAloud.pause} title={t('header.pause')}>{t('header.pause')}</button>
                  : <button className="cp-read-control" onClick={readAloud.resume} title={t('header.resume')}>{t('header.resume')}</button>}
              </>
            )}
          </div>
          {readAloud.message && <span className="cp-read-message" role="status">{readAloud.message}</span>}
          <div className="cp-font-tools"><button onClick={() => changeFont(fontScale - .04)} title="Decrease text size"><Minus className="w-3.5 h-3.5" /></button><span>A</span><button onClick={() => changeFont(fontScale + .04)} title="Increase text size"><Plus className="w-3.5 h-3.5" /></button></div>
          <div className="cp-tool-group">
            <button className="cp-tool-btn cp-mode-btn" onClick={() => setShowTheme(v => !v)} title={t('header.mode')}><span className="cp-mode-icon">{theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'system' ? <Monitor className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</span><span>{t('header.mode')}</span><ChevronDown className="w-3 h-3" /></button>
            {showTheme && <div className="cp-popover cp-theme-pop"><button onClick={() => {setTheme('light');setShowTheme(false)}}><Sun className="w-4 h-4" />{t('header.light')}</button><button onClick={() => {setTheme('dark');setShowTheme(false)}}><Moon className="w-4 h-4" />{t('header.dark')}</button><button onClick={() => {setTheme('system');setShowTheme(false)}}><Monitor className="w-4 h-4" />{t('header.system')}</button></div>}
          </div>
          <button className="cp-profile-btn" onClick={() => navigateTo('account')} title={user ? t('nav.account') : t('nav.signin')}><UserRound className="w-4 h-4" /><span>{user ? t('nav.account') : t('nav.signin')}</span></button>
          <button className="cp-developer-icon-btn" onClick={() => navigateTo('developers')} title="Project credits" aria-label="Project credits"><Code2 className="w-4 h-4" /></button>
        </div>
      </div>
    </header>
  );
};
