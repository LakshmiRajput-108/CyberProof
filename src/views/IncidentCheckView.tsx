import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import { 
  MessageSquare, 
  Globe, 
  ShieldAlert, 
  CreditCard, 
  Lock, 
  ExternalLink, 
  ArrowRight, 
  RotateCcw,
  Check,
  EyeOff,
  Info
} from 'lucide-react';
import { IncidentCategory } from '../types/incident';
import { ReadAloudButton, VoiceInputButton } from '../components/accessibility/SpeechControls';

export const IncidentCheckView: React.FC = () => {
  const { navigateTo } = useAppData();

  const [step, setStep] = useState<'category' | 'questions' | 'result'>('category');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('suspicious_message');

  // Form states
  const [senderChannel, setSenderChannel] = useState('SMS');
  const [hasFinancialDemand, setHasFinancialDemand] = useState(false);
  const [hasUrgencyDeadline, setHasUrgencyDeadline] = useState(false);
  const [hasLinkOrPhone, setHasLinkOrPhone] = useState(false);
  const [brandMimicked, setBrandMimicked] = useState('');
  const [situationText, setSituationText] = useState('');

  const categories = [
    {
      id: 'suspicious_message' as IncidentCategory,
      title: 'Suspicious Text / Message',
      desc: 'SMS, WhatsApp, or chat claiming delivery delays, unpaid fines, or unexpected lottery wins.',
      icon: MessageSquare
    },
    {
      id: 'suspicious_website' as IncidentCategory,
      title: 'Suspicious Website',
      desc: 'A website asking for card details, showing fake virus warnings, or offering extreme discounts.',
      icon: Globe
    },
    {
      id: 'account_warning' as IncidentCategory,
      title: 'Account Warning / Freeze',
      desc: 'Urgent alerts claiming your bank, Netflix, Apple, or Google account will be deactivated.',
      icon: ShieldAlert
    },
    {
      id: 'payment_message' as IncidentCategory,
      title: 'Payment or Transfer Request',
      desc: 'Requests to scan a QR code to "receive money" or make an immediate payment via UPI.',
      icon: CreditCard
    },
    {
      id: 'otp_situation' as IncidentCategory,
      title: 'OTP / Verification Request',
      desc: 'A caller, buyer, or agent asking you to recite or forward an SMS verification code.',
      icon: Lock
    },
    {
      id: 'unexpected_link' as IncidentCategory,
      title: 'Unexpected Link',
      desc: 'A link received from an unfamiliar number or a friend whose account may have been hijacked.',
      icon: ExternalLink
    },
  ];

  const handleSelectCategory = (cat: IncidentCategory) => {
    setSelectedCategory(cat);
    setStep('questions');
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('result');
  };

  const handleReset = () => {
    setStep('category');
    setSelectedCategory('suspicious_message');
    setSenderChannel('SMS');
    setHasFinancialDemand(false);
    setHasUrgencyDeadline(false);
    setHasLinkOrPhone(false);
    setBrandMimicked('');
    setSituationText('');
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
          Guided Security Triage
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Got Scammed?
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Something doesn't feel right? Walk through our guided triage to understand what may have happened and how to react safely.
        </p>
      </div>

      {/* Strict Credential Callout */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span><strong>Privacy Rule:</strong> We will never ask for your passwords, OTP codes, card numbers, or PINs.</span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[11px] font-semibold"><span>Triage Only</span><ReadAloudButton text="Privacy Rule: We will never ask for your passwords, OTP codes, card numbers, or PINs." /></span>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 'category' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select the situation you encountered:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="relative">
                <button
                  onClick={() => handleSelectCategory(cat.id)}
                  className="w-full h-full p-5 pr-12 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/50 hover:shadow-lg transition-all text-left flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </button>
                <span className="absolute right-3 top-3"><ReadAloudButton text={`${cat.title}. ${cat.desc}`} /></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: QUESTIONS */}
      {step === 'questions' && (
        <form onSubmit={handleDiagnose} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Triage Questionnaire: {categories.find(c => c.id === selectedCategory)?.title}
            </h2>
            <button
              type="button"
              onClick={() => setStep('category')}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Change Category
            </button>
          </div>

          <div className="space-y-4">
            {/* Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Where did this interaction reach you?
              </label>
              <div className="flex flex-wrap gap-2">
                {['SMS', 'WhatsApp', 'Phone Call', 'Email', 'Web Browser Pop-up', 'Social Media'].map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSenderChannel(ch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      senderChannel === ch
                        ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 font-bold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox triggers */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUrgencyDeadline}
                  onChange={e => setHasUrgencyDeadline(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Did they impose a tight deadline? (e.g. "within 24 hours", "power will be cut tonight", "account locked in 2 hours")
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFinancialDemand}
                  onChange={e => setHasFinancialDemand(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Does it involve money, refunds, delivery fees, or utility bill updates?
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLinkOrPhone}
                  onChange={e => setHasLinkOrPhone(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Did they include a link to click, or instruct you to call a specific phone number?
                </span>
              </label>
            </div>

            {/* Brand mimicked */}
            <div>
              <label className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Which brand or authority did they claim to be? (Optional)</span>
                <VoiceInputButton onTranscript={text => setBrandMimicked(prev => prev.trim() ? `${prev.trim()} ${text}` : text)} />
              </label>
              <input
                type="text"
                value={brandMimicked}
                onChange={e => setBrandMimicked(e.target.value)}
                placeholder="e.g. State Bank of India, Netflix, India Post, Amazon, Electricity Board"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Freeform Context */}
            <div>
              <label className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Brief description of what happened</span>
                <VoiceInputButton onTranscript={text => setSituationText(prev => prev.trim() ? `${prev.trim()} ${text}` : text)} />
              </label>
              <textarea
                rows={3}
                value={situationText}
                onChange={e => setSituationText(e.target.value)}
                placeholder="e.g. Received a message saying my courier package was held back and I need to pay ₹25 to release it..."
                className="w-full p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep('category')}>
              Back
            </Button>
            <Button type="submit" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Safety Guidance
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: STRUCTURED DIAGNOSIS RESULT */}
      {step === 'result' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 space-y-3 relative">
            <span className="absolute right-4 top-4"><ReadAloudButton text="Incident analysis is unavailable. No risk assessment was generated and your answers were not submitted." /></span>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Info className="w-6 h-6" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Incident analysis unavailable</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              No risk assessment was generated
            </h2>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Your answers were not sent to the server or stored. This incident-analysis service is unavailable until it can safely associate submissions with the current account or guest session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm relative">
              <span className="absolute right-3 top-3"><ReadAloudButton text="No analysis was performed. Your questionnaire responses were not transmitted." /></span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>1. Submission status</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No tailored incident result is available. You can still follow the general safety steps below without sharing additional details.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm relative">
              <span className="absolute right-3 top-3"><ReadAloudButton text="The incident-analysis service is unavailable, so no risk level or personalized explanation was produced." /></span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>2. Why no diagnosis?</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>The current incident endpoint cannot safely keep records scoped to the current session.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>For your privacy, this page did not submit your questionnaire answers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>No risk level or personalized result has been invented.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm relative">
              <span className="absolute right-3 top-3"><ReadAloudButton text="For general safety, use an official app or a known bookmark to verify the request, and do not follow unexpected links." /></span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>3. General safety checks</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Contact the organization through its official app, website, or a known phone number.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Do not rely on contact details or links included in an unexpected message.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Never share passwords, card details, PINs, or verification codes.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-emerald-500/30 space-y-3 shadow-sm relative">
              <span className="absolute right-3 top-3"><ReadAloudButton text="Do not click unexpected links or share verification codes. If you shared financial details, contact your bank using an official channel." /></span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>4. What To Do Next?</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2 text-emerald-700 dark:text-emerald-400">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>DO NOT click the link, download attachments, or share OTPs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Block the sender and report the message as spam within your app.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>If you already entered card details, contact your bank immediately to freeze the card.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Start Another Check
            </Button>

            <Button variant="primary" size="sm" onClick={() => navigateTo('scan', { tab: 'url' })}>
              Scan the Link with CyberProof
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
