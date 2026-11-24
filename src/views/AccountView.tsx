import React, { FormEvent, useState } from 'react';
import { ArrowRight, KeyRound, LogIn, LogOut, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

type AccountMode = 'login' | 'register';

export const AccountView: React.FC = () => {
  const { navigateTo } = useAppData();
  const { user, guest, loading, login, register, logout } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<AccountMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name.trim() || undefined);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not authenticate. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-sm text-slate-500">
        {t('account.loading')}
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('account.session')}</h1>
              <p className="text-xs text-slate-500">{t('account.signedIn')} {user.email}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-4 text-sm text-slate-600 dark:text-slate-300">
            <p><strong className="text-slate-900 dark:text-white">{t('account.name')}:</strong> {user.name || t('common.notSet')}</p>
            <p className="mt-1"><strong className="text-slate-900 dark:text-white">Recorded membership tier:</strong> {user.tier}</p>
            <p className="mt-1 text-xs">Premium entitlements remain unavailable until membership expiry can be verified.</p>
          </div>

          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Account history and watchlist are scoped to this account. Any guest session on this browser remains separate and is not merged.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigateTo('profile')}>
              {t('account.profile')}
            </Button>
            <Button variant="danger" onClick={() => {
              logout();
              navigateTo('landing');
            }} leftIcon={<LogOut className="w-4 h-4" />}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          CyberProof Account
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          {mode === 'login' ? t('account.welcome') : t('account.create')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in to keep your scans and watchlist associated with your account.
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`rounded-lg py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'}`}
          >
            {t('account.login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`rounded-lg py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500'}`}
          >
            {t('account.register')}
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="account-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('account.nameOptional')}
              </label>
              <input
                id="account-name"
                type="text"
                autoComplete="name"
                maxLength={80}
                value={name}
                onChange={event => setName(event.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          )}

          <div>
            <label htmlFor="account-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('account.email')}
            </label>
            <input
              id="account-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div>
            <label htmlFor="account-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('account.password')}
            </label>
            <input
              id="account-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            {mode === 'register' && (
              <p className="mt-1.5 text-[11px] text-slate-400">Use at least 8 characters.</p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={submitting}
            className="w-full"
            leftIcon={mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          >
            {mode === 'login' ? 'Log in' : 'Create account'}
          </Button>
        </form>

        <div className="border-t border-slate-100 dark:border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {guest ? 'Your guest session remains separate and can be restored after logout.' : 'You can scan URLs as a guest without an account.'}
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigateTo('scan')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Continue as guest
          </Button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <KeyRound className="w-3.5 h-3.5 shrink-0" />
          <span>Authentication is handled by the CyberProof account API.</span>
        </div>
      </div>
    </div>
  );
};
