import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import { 
  AlertOctagon, 
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
import { API_BASE_URL } from '../config/api';
import { IncidentCategory } from '../types/incident';

export const IncidentCheckView: React.FC = () => {
  const { navigateTo } = useAppData();

  const [step, setStep] = useState<'category' | 'questions' | 'result'>('category');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('suspicious_message');

  // Form states
  const [senderChannel, setSenderChannel] = useState('SMS');
  const [hasFinancialDemand, setHasFinancialDemand] = useState(false);
  const [hasUrgencyDeadline, setHasUrgencyDeadline] = useState(true);
  const [hasLinkOrPhone, setHasLinkOrPhone] = useState(true);
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

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick heuristic for UI
    let calculatedRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' = 'LOW';
    if (hasUrgencyDeadline || hasFinancialDemand || hasLinkOrPhone) calculatedRisk = 'MEDIUM';
    if ((hasUrgencyDeadline && hasFinancialDemand) || (hasLinkOrPhone && hasFinancialDemand) || selectedCategory === 'otp_situation') {
      calculatedRisk = 'HIGH';
    }

    try {
      await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          senderChannel,
          hasFinancialDemand,
          hasUrgencyDeadline,
          hasLinkOrPhone,
          brandMimicked,
          situationText,
          riskLevel: calculatedRisk,
          recommendations: [
            'DO NOT click the link, download attachments, or share OTPs.',
            'Block the sender and report the message as spam within your app.',
            'If you already entered card details, contact your bank immediately to freeze the card.'
          ]
        })
      });
    } catch (e) {
      console.error(e);
    }

    setStep('result');
  };

  const handleReset = () => {
    setStep('category');
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
        <span className="font-mono text-[11px] font-semibold">Triage Only</span>
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
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className="p-5 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/50 hover:shadow-lg transition-all text-left flex items-start gap-4 group"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Which brand or authority did they claim to be? (Optional)
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brief description of what happened
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
              Generate Incident Diagnosis
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: STRUCTURED DIAGNOSIS RESULT */}
      {step === 'result' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 md:p-8 rounded-3xl bg-rose-50 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 text-rose-950 dark:text-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertOctagon className="w-6 h-6" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Triage Diagnosis: Elevated Threat Indicators</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              Probable Social Engineering / Phishing Attempt
            </h2>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Based on the interaction pattern ({senderChannel} channel, {hasUrgencyDeadline ? 'artificial urgency' : 'communication'}, and {hasFinancialDemand ? 'financial claims' : 'action requests'}), this scenario closely matches classic deceptive impersonation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>1. What May Have Happened?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                An attacker obtained your contact detail from a bulk data leak or random number generator. They are impersonating {brandMimicked || 'a trusted organization'} to induce panic before you have time to cross-check through official means.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>2. Why It May Be Suspicious?</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Legitimate organizations rarely impose immediate countdowns over chat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Direct phone callback numbers provided in SMS are frequently untraceable burner lines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Small payment demands (₹10 - ₹50) are used to extract full card numbers and CVVs.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>3. What To Check?</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Open your official installed app or visit the bookmarked website directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Look at the sender phone number: is it a random 10-digit mobile number instead of an authentic alphanumeric sender header?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Scan any included link with CyberProof Scanner before clicking.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-emerald-500/30 space-y-3 shadow-sm">
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
