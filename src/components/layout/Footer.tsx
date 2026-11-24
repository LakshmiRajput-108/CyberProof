import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Github } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useAppData();
  const { t } = useLanguage();

  const links = [
    [t('nav.home'), 'landing'],
    [t('nav.privacy'), 'profile'],
    [t('nav.terms'), 'help-center'],
    [t('nav.disclaimer'), 'help-center'],
    [t('nav.security'), 'help-center'],
    [t('nav.accessibility'), 'help-center'],
  ] as const;

  return (
    <footer className="cp-footer-shell cp-footer-compact">
      <nav className="cp-footer-nav" aria-label="Footer navigation">
        {links.map(([label, view]) => (
          <button type="button" key={label} onClick={() => navigateTo(view)}>{label}</button>
        ))}
        <a
          href="https://github.com/LakshmiRajput-108/CyberProof"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CyberProof GitHub Repository"
          title="CyberProof GitHub Repository"
          className="cp-footer-github"
        >
          <Github className="w-4 h-4" />
        </a>
      </nav>
      <p className="cp-footer-credential">{t('footer.credential')}</p>
      <p className="cp-footer-disclaimer">{t('footer.disclaimer')}</p>
      <p className="cp-footer-copyright">© 2026 CyberProof. All rights reserved.</p>
    </footer>
  );
};
