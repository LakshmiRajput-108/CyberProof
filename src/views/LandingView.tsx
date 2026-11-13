import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import {
  ArrowRight, ShieldCheck, Search, QrCode, Mail, MessageSquare,
  Phone, LockKeyhole, AlertTriangle, Play, BookOpen, Siren,
  CreditCard, BriefcaseBusiness, BadgeAlert, CheckCircle2,
  Chrome, LifeBuoy, ExternalLink, ChevronRight
} from 'lucide-react';

const scams = [
  { title: 'Digital arrest & fake officials', text: 'A caller claims to be police or an agency and creates fear, urgency or a fake video-call setup.', icon: Siren },
  { title: 'UPI & payment fraud', text: 'Fake payment requests, QR tricks and messages designed to make you approve or send money.', icon: CreditCard },
  { title: 'Fake jobs & task scams', text: 'A promising job or easy-income offer turns into deposits, fees or repeated payment demands.', icon: BriefcaseBusiness },
  { title: 'AI voice & deepfake scams', text: 'Synthetic voices, videos or familiar identities can be used to make an unusual request feel real.', icon: BadgeAlert },
];

const rules = [
  ['01', 'Pause under pressure', 'Urgency is a reason to slow down, not a reason to act faster.'],
  ['02', 'Verify the person', 'Use a trusted contact route to confirm who is actually asking.'],
  ['03', 'Inspect links & QR codes', 'Check the destination before opening, signing in or paying.'],
  ['04', 'Never share OTPs', 'Authentication codes, PINs and passwords stay private.'],
  ['05', 'Keep devices updated', 'Use current software, browsers and security updates.'],
  ['06', 'Save evidence & report', 'Keep screenshots, messages and transaction details when something goes wrong.'],
];

const checks = [
  { title: 'Website / URL', text: 'Check a site before you trust it.', icon: Search, tab: 'url' },
  { title: 'QR Code', text: 'See where a QR code really leads.', icon: QrCode, tab: 'qr' },
  { title: 'Email', text: 'Inspect suspicious emails and requests.', icon: Mail, tab: 'email' },
  { title: 'Message / SMS', text: 'Check links, urgency and payment traps.', icon: MessageSquare, tab: 'message' },
  { title: 'Caller', text: 'Triage a suspicious call scenario.', icon: Phone, tab: 'otp-situation' },
  { title: 'OTP Request', text: 'Understand a verification-code situation.', icon: LockKeyhole, tab: 'otp-situation' },
];

export const LandingView: React.FC = () => {
  const { navigateTo } = useAppData();

  const goScan = (tab = 'url') => navigateTo('scan', { tab });

  return (
    <div className="cp-home">
      {/* HERO */}
      <section className="cp-hero">
        <div className="cp-hero-copy">
          <span className="cp-kicker">DIGITAL SAFETY & AWARENESS</span>
          <h1>Before you trust,<br /><span>check.</span></h1>
          <p>
            CyberProof helps you check suspicious websites, messages, emails, QR codes and other digital interactions — then explains what to do next.
          </p>
          <div className="cp-hero-actions">
            <Button variant="primary" size="lg" onClick={() => goScan()} rightIcon={<ArrowRight className="w-5 h-5" />}>Check something</Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('cp-awareness')?.scrollIntoView({ behavior: 'smooth' })}>Learn how scams work</Button>
          </div>
          <div className="cp-hero-trust">
            <span><ShieldCheck className="w-4 h-4" /> Explainable checks</span>
            <span><LockKeyhole className="w-4 h-4" /> No passwords or OTPs</span>
            <span><CheckCircle2 className="w-4 h-4" /> Practical next steps</span>
          </div>
        </div>

        <div className="cp-hero-visual">
          <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1500&q=85" alt="Person using a phone for a digital safety check" />
          <div className="cp-hero-overlay" />
          <div className="cp-floating-card cp-floating-top">
            <div className="cp-mini-icon"><ShieldCheck className="w-5 h-5" /></div>
            <div><strong>Protection check</strong><span>Explainable evidence</span></div>
          </div>
          <div className="cp-floating-card cp-floating-bottom">
            <span className="cp-score-ring">78</span>
            <div><strong>Trust signal</strong><span>Review before you act</span></div>
          </div>
        </div>
      </section>

      {/* CHECK ANYTHING */}
      <section className="cp-section cp-check-section">
        <div className="cp-section-head">
          <div><span className="cp-kicker">01 / CHECK ANYTHING</span><h2>Something looks wrong?<br /><span>Check it before you act.</span></h2></div>
          <p>Choose what you received. CyberProof takes you to the right analysis flow without asking for sensitive authentication secrets.</p>
        </div>
        <div className="cp-check-grid">
          {checks.map(item => {
            const Icon = item.icon;
            return <button key={item.title} onClick={() => goScan(item.tab)} className="cp-check-card">
              <span className="cp-check-icon"><Icon className="w-6 h-6" /></span>
              <span><strong>{item.title}</strong><small>{item.text}</small></span>
              <ChevronRight className="w-5 h-5 cp-arrow" />
            </button>;
          })}
        </div>
      </section>

      {/* AWARENESS */}
      <section id="cp-awareness" className="cp-section">
        <div className="cp-section-head">
          <div><span className="cp-kicker">02 / FRAUD AWARENESS</span><h2>How are people<br /><span>being tricked?</span></h2></div>
          <p>Scams often change their story, but the pressure pattern is familiar. Learn the setup so the next message feels easier to question.</p>
        </div>
        <div className="cp-scam-grid">
          {scams.map(item => {
            const Icon = item.icon;
            return <article key={item.title} className="cp-scam-card">
              <div className="cp-scam-image"><img src={`https://images.unsplash.com/photo-${item.title.startsWith('Digital') ? '1556742049-0cfed4f6a45d' : item.title.startsWith('UPI') ? '1563013544-824ae1b704d3' : item.title.startsWith('Fake') ? '1521737711867-7b4c8f5f7f2f' : '1550751827-4bd374c3f58b'}?auto=format&fit=crop&w=900&q=80`} alt="" /><div /></div>
              <div className="cp-scam-content"><span className="cp-scam-icon"><Icon className="w-5 h-5" /></span><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => navigateTo('learn')} >Learn the red flags <ArrowRight className="w-4 h-4" /></button></div>
            </article>;
          })}
        </div>
      </section>

      {/* FROM AWARENESS TO PROTECTION */}
      <section className="cp-section cp-pathways">
        <div className="cp-section-head">
          <div><span className="cp-kicker">03 / FROM AWARENESS → PROTECTION</span><h2>Know what happened.<br /><span>Know what to do next.</span></h2></div>
          <p>Every awareness step connects to a CyberProof action — check, understand, recover or keep learning.</p>
        </div>
        <div className="cp-pathway-grid">
          <article className="cp-pathway-featured">
            <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1300&q=85" alt="Cyber safety and digital analysis" />
            <div className="cp-pathway-overlay" />
            <div className="cp-pathway-copy"><span>01 • VERIFY</span><h3>Pre-click protection</h3><p>Check a suspicious URL, QR destination, email or message before you interact.</p><button onClick={() => goScan()}>Open CyberProof analysis <ArrowRight className="w-4 h-4" /></button></div>
          </article>
          <button className="cp-pathway-card" onClick={() => navigateTo('incident-check')}><span>02 • RESPOND</span><h3>Got Scammed?</h3><p>If something already happened, move from confusion to a guided recovery path.</p><b>Start recovery <ArrowRight className="w-4 h-4" /></b></button>
          <button className="cp-pathway-card" onClick={() => navigateTo('threat-pulse')}><span>03 • MONITOR</span><h3>Threat Radar</h3><p>See scam patterns, awareness topics and recent threat information in one place.</p><b>Open Threat Radar <ArrowRight className="w-4 h-4" /></b></button>
        </div>
      </section>

      {/* RULES */}
      <section className="cp-section cp-rules">
        <div className="cp-section-head"><div><span className="cp-kicker">04 / RULES & GUIDELINES</span><h2>Six habits that<br /><span>stop common scams.</span></h2></div><p>Keep these simple checkpoints in mind before clicking, sharing, paying, installing or approving.</p></div>
        <div className="cp-rules-layout">
          <div className="cp-rules-photo"><img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1100&q=85" alt="People discussing a digital safety situation" /><div className="cp-rule-label"><small>CYBERPROOF DAILY GUIDE</small><strong>Pause.<br />Check.<br />Protect.</strong></div></div>
          <div className="cp-rules-list">{rules.map(([n,t,d]) => <div className="cp-rule" key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>
        </div>
      </section>

      {/* SAFETY JOURNEY */}
      <section className="cp-section cp-journey-section">
        <div className="cp-section-head"><div><span className="cp-kicker">05 / YOUR SAFETY JOURNEY</span><h2>From doubt<br /><span>to a safer decision.</span></h2></div><p>Notice the signal. Learn the pattern. Check it. Then decide what to do.</p></div>
        <div className="cp-journey"><div><span>01</span><strong>NOTICE</strong><p>Something feels unusual.</p></div><i /><div><span>02</span><strong>LEARN</strong><p>Recognise the scam pattern.</p></div><i /><div><span>03</span><strong>CHECK</strong><p>Use CyberProof to verify.</p></div><i /><div><span>04</span><strong>ACT</strong><p>Proceed, block or report.</p></div></div>
      </section>

      {/* VIDEOS */}
      <section className="cp-section cp-video-section">
        <div className="cp-section-head"><div><span className="cp-kicker">06 / CYBER CRIME MEDIA GALLERY</span><h2>Watch. Learn.<br /><span>Recognise the pattern.</span></h2></div><p>CyberProof keeps awareness close to the tools. These are original CyberProof awareness explainers included with the project.</p></div>
        <div className="cp-video-grid">
          {[
            ['videos/digital-arrest-awareness.mp4','Digital arrest scams'],
            ['videos/fake-police-video-call.mp4','Fake police video calls'],
            ['videos/family-money-scam.mp4','Family emergency money scams'],
            ['videos/ai-deepfake-scam-awareness.mp4','AI & deepfake scams'],
          ].map(([src,title]) => <article className="cp-video-card" key={src}><div className="cp-video-frame"><video controls preload="metadata"><source src={src} type="video/mp4" />Your browser does not support video.</video><span><Play className="w-4 h-4" /> CyberProof awareness</span></div><div><h3>{title}</h3><p>Short practical awareness explainer.</p></div></article>)}
        </div>
      </section>

      {/* LEARN + RECOVERY */}
      <section className="cp-section cp-bottom-grid">
        <button onClick={() => navigateTo('learn')} className="cp-bottom-card cp-learn-card"><div><BookOpen className="w-7 h-7" /><span>LEARN HUB</span><h2>Practice spotting<br />the red flags.</h2><p>Phishing, UPI fraud, job scams, fake customer care, romance scams and more.</p></div><ArrowRight className="w-5 h-5" /></button>
        <button onClick={() => navigateTo('incident-check')} className="cp-bottom-card cp-recovery-card"><div><LifeBuoy className="w-7 h-7" /><span>ALREADY INTERACTED?</span><h2>Got Scammed?</h2><p>Stop, secure, preserve evidence and follow the next safe steps.</p></div><ArrowRight className="w-5 h-5" /></button>
      </section>

      {/* EXTENSION */}
      <section className="cp-section cp-extension">
        <div className="cp-extension-copy"><span className="cp-kicker">07 / CYBERPROOF GUARD</span><h2>Protection that<br /><span>travels with you.</span></h2><p>Premium members can use the CyberProof Guard browser extension to check websites and messages without repeatedly opening the main site.</p><div className="flex flex-wrap gap-3"><Button variant="primary" onClick={() => navigateTo('extension-preview')} rightIcon={<ArrowRight className="w-4 h-4" />}>Preview Guard</Button><Button variant="outline" onClick={() => navigateTo('membership')}>See membership</Button></div></div><div className="cp-extension-visual"><Chrome className="w-8 h-8" /><strong>CyberProof Guard</strong><span>Quick check • Message check • Website check</span><div className="cp-extension-status"><ShieldCheck className="w-4 h-4" /> Protection preview</div></div>
      </section>

      {/* OFFICIAL REPORTING CTA */}
      <section className="cp-report-strip"><div><span className="cp-kicker">WHEN YOU NEED OFFICIAL REPORTING</span><h2>CyberProof helps you understand the situation.<br />Use the appropriate official reporting route when needed.</h2></div><a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">Open National Cyber Crime Reporting Portal <ExternalLink className="w-4 h-4" /></a></section>
    </div>
  );
};
