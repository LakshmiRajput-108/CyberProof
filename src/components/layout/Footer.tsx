import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useAppData();

  const links = [
    ['Home', 'landing'],
    ['Privacy', 'profile'],
    ['Terms', 'help-center'],
    ['Disclaimer', 'help-center'],
    ['Security', 'help-center'],
    ['Accessibility', 'help-center'],
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
      <p className="cp-footer-credential">Designed and developed by the CyberProof student team.</p>
      <p className="cp-footer-disclaimer">CyberProof is an educational project and does not replace official emergency, financial, law-enforcement or government reporting services.</p>
      <p className="cp-footer-copyright">© 2026 CyberProof. All rights reserved.</p>
    </footer>
  );
};
