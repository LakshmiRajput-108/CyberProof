import React, { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import {
  AlertTriangle, ShieldCheck, ShieldAlert, Phone, Globe, Lock, ExternalLink,
  Search, ScanLine, LifeBuoy, Puzzle, Accessibility, Languages, CreditCard,
  ChevronDown, BookOpenCheck
} from 'lucide-react';

type HelpCategory = {
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
};

const categories: HelpCategory[] = [
  { title: 'Account & Privacy', description: 'Profile, privacy, data handling and account questions.', icon: <Lock />, keywords: ['account', 'privacy', 'data', 'profile'] },
  { title: 'Scan & Analysis', description: 'How URL, message, email, QR and other checks work.', icon: <ScanLine />, keywords: ['scan', 'analysis', 'url', 'message', 'email', 'qr'] },
  { title: 'Scam Recovery', description: 'What to do after clicking, sharing information or losing money.', icon: <LifeBuoy />, keywords: ['scam', 'recovery', 'fraud', 'money', 'payment'] },
  { title: 'Browser Extension', description: 'CyberProof Guard setup, checks and extension guidance.', icon: <Puzzle />, keywords: ['extension', 'guard', 'browser'] },
  { title: 'Accessibility', description: 'Read Aloud, text size, keyboard and accessible use.', icon: <Accessibility />, keywords: ['accessibility', 'read aloud', 'font', 'keyboard'] },
  { title: 'Language', description: 'English, Hindi, Marathi and Telugu language support.', icon: <Languages />, keywords: ['language', 'english', 'hindi', 'marathi', 'telugu'] },
  { title: 'Membership', description: 'Free and Premium features, billing and student access.', icon: <CreditCard />, keywords: ['membership', 'premium', 'free', 'billing'] },
];

const faqs = [
  ['Should I enter my OTP or PIN into CyberProof?', 'No. CyberProof analysis forms should never be used for passwords, OTPs, PINs or recovery codes.'],
  ['What should I do after a suspicious payment?', 'Contact your bank or payment provider through an official channel, preserve transaction evidence, and use the appropriate official cyber-fraud reporting route.'],
  ['Can CyberProof guarantee that a website is safe?', 'No. A CyberProof result is an analysis and safety aid, not a guarantee. Always consider context and verify important requests independently.'],
  ['How do I use Help Center resources?', 'Search for a topic above or choose a category. For an active incident, follow the immediate safety checklist and use official reporting resources.'],
];

export const HelpCenterView: React.FC = () => {
  const { navigateTo } = useAppData();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    );
  }, [query]);

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs font-semibold">
          <BookOpenCheck className="w-3.5 h-3.5" />
          CyberProof Help Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">How can we help?</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Find quick answers about scanning, privacy, scam recovery, CyberProof Guard, accessibility and membership.
        </p>
        <div className="max-w-2xl mx-auto relative pt-2">
          <Search className="absolute left-4 top-5 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Help Center..."
            aria-label="Search Help Center"
            className="w-full h-14 pl-12 pr-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500/60 shadow-sm"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map(category => (
          <button
            key={category.title}
            onClick={() => setQuery(category.title)}
            className="text-left p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/50 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-4">
              {React.cloneElement(category.icon as React.ReactElement, { className: 'w-5 h-5' })}
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{category.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{category.description}</p>
          </button>
        ))}
      </section>

      {filteredCategories.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-slate-400">
          No Help Center category matches “{query}”. Try scan, privacy, recovery, extension or membership.
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-7 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-300">Common questions</span>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Quick answers</h2>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="divide-y divide-slate-200 dark:divide-white/10">
            {faqs.map(([question, answer], index) => (
              <div key={question}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-4 flex items-center justify-between gap-4 text-left text-sm font-semibold text-slate-900 dark:text-white"
                >
                  <span>{question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && <p className="pb-4 pr-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{answer}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-7 rounded-3xl bg-rose-500/[0.06] dark:bg-rose-500/[0.07] border border-rose-500/20 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4"><ShieldAlert className="w-5 h-5" /></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Need help right now?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">If you think you have been scammed, stop communicating with the suspected scammer and use the guided recovery flow.</p>
          <Button className="mt-5" onClick={() => navigateTo('incident-check')}>Open Got Scammed?</Button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-300">Official resources</span>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">When you need official reporting</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">CyberProof guides you to the appropriate official resource; it does not replace government, bank or law-enforcement services.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { org: 'National Cyber Crime Reporting Portal', purpose: 'Report cyber crimes and frauds officially.', link: 'https://cybercrime.gov.in/', when: 'Use when you have been a victim of financial fraud or cybercrime.' },
            { org: 'CERT-In', purpose: 'Official cybersecurity guidance and incident reporting.', link: 'https://www.cert-in.org.in/', when: 'Use for cybersecurity advisories and relevant incident guidance.' },
            { org: 'Cyber Fraud Helpline — 1930', purpose: 'National cybercrime financial-fraud reporting number.', link: 'tel:1930', when: 'Call immediately if you have lost money to cyber fraud.' },
            { org: 'RBI Kehta Hai', purpose: 'Banking fraud awareness and secure banking practices.', link: 'https://rbikehtahai.rbi.org.in/', when: 'Use for official banking safety guidance and customer awareness.' },
          ].map(resource => (
            <div key={resource.org} className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Official Resource</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">{resource.org}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{resource.purpose}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2"><strong>When to use:</strong> {resource.when}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.open(resource.link, '_blank', 'noopener,noreferrer')} rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>Visit Official Site</Button>
            </div>
          ))}
        </div>
      </section>

      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 text-center">
        <strong>Disclaimer:</strong> CyberProof provides educational safety guidance and analysis. It does not replace official emergency, financial, law-enforcement or government reporting services.
      </div>
    </div>
  );
};
