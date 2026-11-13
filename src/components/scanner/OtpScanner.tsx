import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ShieldAlert, AlertTriangle, ArrowRight, Sparkles, Lock } from 'lucide-react';

interface OtpScannerProps {
  onScan: (description: string, channel: string) => void;
  isLoading: boolean;
}

export const OtpScanner: React.FC<OtpScannerProps> = ({ onScan, isLoading }) => {
  const [channel, setChannel] = useState('Phone Call');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onScan(description.trim(), channel);
  };

  const sampleScenarios = [
    {
      label: 'Bank Fraud Officer Call',
      channel: 'Phone Call',
      desc: 'A person called claiming to be from my bank fraud team. They said someone in another state is trying to withdraw money from my account right now, and I must read out the 6-digit SMS code they just triggered to cancel the theft.'
    },
    {
      label: 'Marketplace Buyer QR / OTP',
      channel: 'WhatsApp',
      desc: 'A buyer on an online marketplace says they want to send me money for my used bicycle. They sent a QR code and told me to enter my UPI PIN / read the confirmation code to "receive the payment credit".'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Strict Privacy Callout */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-sm">CRITICAL PRIVACY RULE: NEVER ENTER YOUR ACTUAL OTP OR PIN</p>
          <p className="leading-relaxed">
            CyberProof will NEVER ask you for your numerical OTP, password, ATM PIN, or CVV. Describe only the conversation or circumstance. An OTP is meant strictly for you alone to submit directly into trusted official apps.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          How did this interaction occur?
        </label>
        <div className="flex flex-wrap gap-2">
          {['Phone Call', 'WhatsApp', 'SMS / Text', 'Website Form', 'In-Person'].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                channel === c
                  ? 'bg-teal-500/15 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="otp-situation-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Describe the situation (Who is asking and what are they saying?)
        </label>
        <textarea
          id="otp-situation-desc"
          rows={4}
          required
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Someone claiming to be customer service asked me to read a code to confirm a delivery, or someone said they will send money if I approve a request..."
          className="w-full p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Samples:</span>
          {sampleScenarios.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setChannel(s.channel);
                setDescription(s.desc);
              }}
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
          leftIcon={<Lock className="w-4 h-4" />}
        >
          Evaluate Situation Risk
        </Button>
      </div>
    </form>
  );
};
