import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

interface MessageScannerProps {
  onScan: (message: string, channel: string) => void;
  isLoading: boolean;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({ onScan, isLoading }) => {
  const [channel, setChannel] = useState('SMS');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onScan(message.trim(), channel);
  };

  const sampleMessages = [
    {
      label: 'Electricity Power Cut Smishing',
      channel: 'SMS',
      text: 'Dear Consumer, Your electricity power will be disconnected tonight at 9:30 PM from the main office because your previous month bill was not updated. Please call our power officer immediately at 98210-XXXXX.'
    },
    {
      label: 'Undelivered Courier Package',
      channel: 'WhatsApp',
      text: 'Your DHL parcel cannot be dispatched due to incomplete house number. Update your details within 12 hours here: https://dhl-express-redelivery.top/fix-address'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          SMS, WhatsApp, or Direct Message
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Check suspicious text messages for coercion tactics, fraudulent phone callback traps, and deceptive short links.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Messaging Channel
        </label>
        <div className="flex flex-wrap gap-2">
          {['SMS', 'WhatsApp', 'Telegram', 'Social Media DM'].map(c => (
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
        <label htmlFor="msg-text" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Message Text
        </label>
        <textarea
          id="msg-text"
          rows={4}
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Paste the suspicious text message here. (Do not paste your actual private verification code)."
          className="w-full p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Try sample:</span>
          {sampleMessages.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setChannel(s.channel);
                setMessage(s.text);
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
          leftIcon={<MessageSquare className="w-4 h-4" />}
        >
          Analyze Message
        </Button>
      </div>
    </form>
  );
};
