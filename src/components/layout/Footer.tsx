import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { ShieldCheck, Lock, EyeOff, Award, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useAppData();

  return (
    <footer className="cp-footer-shell py-14 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="cp-footer-intro cp-footer-intro-card">
          <div>
            <div className="cp-footer-brand-row">
              <div className="cp-footer-brand-mark"><ShieldCheck className="w-5 h-5" /></div>
              <h2>CyberProof</h2>
            </div>
            <p>
              CyberProof is a student-built digital safety and cybersecurity awareness platform designed to help people check suspicious links, messages, emails, QR destinations and scam situations before taking action.
            </p>
            <strong>Learn first. Check first. Stay safer online.</strong>
          </div>
          <div className="cp-footer-project-note">
            <span className="cp-kicker">STUDENT PROJECT</span>
            <p>Designed and developed from scratch by the student team behind CyberProof.</p>
          </div>
        </section>

        <div className="cp-footer-columns">
          <div>
            <h3>Tools</h3>
            <button onClick={() => navigateTo('scan')}>Website & URL Scanner</button>
            <button onClick={() => navigateTo('scan')}>Message & Email Analysis</button>
            <button onClick={() => navigateTo('scan')}>QR Safety Check</button>
            <button onClick={() => navigateTo('incident-check')}>Got Scammed? Recovery</button>
            <button onClick={() => navigateTo('watchlist')}>Site Intelligence</button>
            <button onClick={() => navigateTo('history')}>Security History</button>
          </div>
          <div>
            <h3>Learn</h3>
            <button onClick={() => navigateTo('learn')}>Phishing & Fake Links</button>
            <button onClick={() => navigateTo('learn')}>UPI & Payment Scams</button>
            <button onClick={() => navigateTo('learn')}>Digital Arrest Scams</button>
            <button onClick={() => navigateTo('learn')}>Job & Investment Scams</button>
            <button onClick={() => navigateTo('learn')}>OTP & QR Safety</button>
            <button onClick={() => navigateTo('threat-pulse')}>Threat Radar</button>
          </div>
          <div>
            <h3>CyberProof</h3>
            <button onClick={() => navigateTo('membership')}>Membership</button>
            <button onClick={() => navigateTo('extension-preview')}>CyberProof Guard</button>
            <button onClick={() => navigateTo('help-center')}>Help Center</button>
            <button onClick={() => navigateTo('profile')}>Profile & Privacy</button>
            <button onClick={() => navigateTo('developers')}>Project Credits</button>
            <button onClick={() => navigateTo('landing')}>About CyberProof</button>
          </div>
          <div>
            <h3>Trust & Safety</h3>
            <button onClick={() => navigateTo('help-center')}>Privacy & Data Safety</button>
            <button onClick={() => navigateTo('help-center')}>Security Guidelines</button>
            <button onClick={() => navigateTo('help-center')}>Responsible Use</button>
            <button onClick={() => navigateTo('help-center')}>Disclaimer</button>
            <button onClick={() => navigateTo('help-center')}>Official Reporting Resources</button>
            <button onClick={() => navigateTo('help-center')}>Accessibility</button>
          </div>
        </div>

        <section className="cp-footer-alerts">
          <div className="cp-footer-alert-copy">
            <div className="cp-footer-alert-icon"><Mail className="w-5 h-5" /></div>
            <div>
              <h3>Cyber safety updates</h3>
              <p>Stay informed about new scam patterns, safety guidance and CyberProof learning resources.</p>
            </div>
          </div>
          <form className="cp-footer-alert-form" onSubmit={(e) => { e.preventDefault(); }}>
            <input type="email" placeholder="you@example.com" aria-label="Email address" />
            <button type="submit">Get updates</button>
          </form>
          <p className="cp-footer-alert-note">For the college-project prototype, this form is a demo interface and does not subscribe an email.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0"><EyeOff className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">No Credential Collection</h4><p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Never enter passwords, OTPs, PINs or recovery codes into CyberProof analysis forms.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"><Lock className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">Explainable Checks</h4><p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">CyberProof presents the signals and evidence behind an assessment rather than hiding the reasoning.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0"><Award className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">Student-Built Project</h4><p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">CyberProof is designed and developed from scratch as a first-year CSD college micro-project.</p></div>
          </div>
        </div>

        <section className="cp-developer-footer-card" aria-label="CyberProof project credits">
          <div className="cp-developer-footer-heading">
            <div>
              <span className="cp-kicker">PROJECT CREDITS</span>
              <h2>Designed & Developed</h2>
              <p>CyberProof — Student Cybersecurity Awareness & Digital Safety Project</p>
            </div>
            <button onClick={() => navigateTo('developers')} className="cp-developer-view-btn">View Project Credits <ExternalLink className="inline w-3.5 h-3.5 ml-1" /></button>
          </div>
          <div className="cp-developer-footer-grid">
            <div className="cp-credit-person"><div className="cp-credit-avatar">LR</div><div><span className="cp-credit-label">Student Developer</span><strong>Lakshmi Rajput</strong><small>First Year • CSD Branch</small></div></div>
            <div className="cp-credit-person"><div className="cp-credit-avatar">DR</div><div><span className="cp-credit-label">Student Developer</span><strong>Deeya Rajpoot</strong><small>First Year • CSD Branch</small></div></div>
            <div className="cp-credit-person cp-credit-guide"><div className="cp-credit-avatar cp-credit-guide-avatar">RA</div><div><span className="cp-credit-label">Under the Guidance of</span><strong>Dr. Rohit Agarwal</strong><small>Assistant Professor</small></div></div>
          </div>
        </section>

        <div className="cp-footer-legal">
          <div className="cp-footer-legal-links">
            <button onClick={() => navigateTo('landing')}>Home</button>
            <button onClick={() => navigateTo('profile')}>Privacy</button>
            <button onClick={() => navigateTo('help-center')}>Terms</button>
            <button onClick={() => navigateTo('help-center')}>Disclaimer</button>
            <button onClick={() => navigateTo('help-center')}>Security</button>
            <button onClick={() => navigateTo('help-center')}>Accessibility</button>
          </div>
          <p>CyberProof is an educational project and does not replace official emergency, financial, law-enforcement or government reporting services.</p>
          <p>© {new Date().getFullYear()} CyberProof. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
