import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

interface EmailScannerProps {
  onScan: (sender: string, subject: string, body: string) => void;
  isLoading: boolean;
}

export const EmailScanner: React.FC<EmailScannerProps> = ({ onScan, isLoading }) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !subject.trim()) return;
    onScan(sender, subject, body);
  };

  const sampleEmails = [
    {
      label: 'Tax Refund Phish',
      sender: 'service-refund@internal-tax-gov.xyz',
      subject: 'URGENT: Outstanding refund ready for deposit (24 hrs left)',
      body: 'Your pending tax rebate of $428.50 is waiting. Click here to confirm your banking credentials immediately or the payment will lapse.'
    },
    {
      label: 'Legitimate Order Receipt',
      sender: 'orders@books-direct.com',
      subject: 'Your order #48921 has shipped',
      body: 'Thank you for your purchase. Your paperback books have departed our fulfillment facility via standard ground transit.'
    }
  ];

  const loadSample = (s: typeof sampleEmails[0]) => {
    setSender(s.sender);
    setSubject(s.subject);
    setBody(s.body);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          Suspicious Email Inspection
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Paste text and sender address from any suspicious email. CyberProof inspects urgency indicators, domain alignment, and hidden coercion tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email-sender" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Sender Address (From)
          </label>
          <input
            id="email-sender"
            type="text"
            value={sender}
            onChange={e => setSender(e.target.value)}
            placeholder="e.g. security-team@account-alert.xyz"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>

        <div>
          <label htmlFor="email-subject" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Subject Line
          </label>
          <input
            id="email-subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Immediate action required: account frozen"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email-body" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email Body Content
        </label>
        <textarea
          id="email-body"
          rows={4}
          required
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Paste the email message body here. (Never include your private passwords or actual banking OTPs)."
          className="w-full p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Samples:</span>
          {sampleEmails.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => loadSample(s)}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >
              {s.label}
            </button>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          leftIcon={<Mail className="w-4 h-4" />}
        >
          Analyze Email Signals
        </Button>
      </div>
    </form>
  );
};
