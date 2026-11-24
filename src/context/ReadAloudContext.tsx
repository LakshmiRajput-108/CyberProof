import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAppData } from './AppDataContext';
import { useLanguage } from './LanguageContext';

type ReadStatus = 'idle' | 'reading' | 'paused';

interface ReadAloudContextValue {
  status: ReadStatus;
  message: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  supported: boolean;
}

const ReadAloudContext = createContext<ReadAloudContextValue | undefined>(undefined);

const splitText = (text: string): string[] => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const chunks: string[] = [];
  let remaining = cleaned;
  while (remaining.length > 180) {
    let splitAt = remaining.slice(0, 181).search(/[\s.!?।!?;:]\S*$/);
    if (splitAt < 80) splitAt = remaining.lastIndexOf(' ', 180);
    if (splitAt < 40) splitAt = 180;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
};

export const ReadAloudProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeView } = useAppData();
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<ReadStatus>('idle');
  const [message, setMessage] = useState('');
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const activeRef = useRef(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    activeRef.current = false;
    chunksRef.current = [];
    indexRef.current = 0;
    if (supported) window.speechSynthesis.cancel();
    setStatus('idle');
  }, [supported]);

  const speakNext = useCallback(() => {
    if (!activeRef.current || indexRef.current >= chunksRef.current.length) {
      activeRef.current = false;
      setStatus('idle');
      return;
    }

    const locale = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const exact = voices.find(voice => voice.lang?.toLowerCase() === locale.toLowerCase());
    const prefix = voices.find(voice => voice.lang?.toLowerCase().startsWith(locale.split('-')[0]));
    const fallback = voices.find(voice => /^en(?:-|$)/i.test(voice.lang || '')) || voices[0];

    const utterance = new SpeechSynthesisUtterance(chunksRef.current[indexRef.current]);
    utterance.lang = exact?.lang || prefix?.lang || locale;
    if (exact || prefix || fallback) utterance.voice = exact || prefix || fallback || null;
    utterance.rate = 0.95;
    utterance.onend = () => {
      indexRef.current += 1;
      if (activeRef.current) speakNext();
      else setStatus('idle');
    };
    utterance.onerror = () => {
      activeRef.current = false;
      setStatus('idle');
      setMessage(t('speech.unsupported'));
    };
    window.speechSynthesis.speak(utterance);
  }, [language, t]);

  const start = useCallback(() => {
    if (!supported) {
      setMessage(t('speech.unsupported'));
      return;
    }
    if (status === 'reading' || status === 'paused') return;
    window.speechSynthesis.cancel();
    const main = document.querySelector('main');
    if (!main) {
      setMessage(t('speech.noText'));
      return;
    }
    const clone = main.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('header, nav, button, input, textarea, select, option, [aria-hidden="true"], [role="button"], video, audio, script, style').forEach(node => node.remove());
    const text = clone.innerText?.trim() || '';
    const chunks = splitText(text);
    if (!chunks.length) {
      setMessage(t('speech.noText'));
      return;
    }
    setMessage('');
    chunksRef.current = chunks;
    indexRef.current = 0;
    activeRef.current = true;
    setStatus('reading');
    speakNext();
  }, [supported, status, t, speakNext]);

  const pause = () => {
    if (!supported || status !== 'reading') return;
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const resume = () => {
    if (!supported || status !== 'paused') return;
    window.speechSynthesis.resume();
    setStatus('reading');
  };

  useEffect(() => { stop(); }, [activeView]);
  useEffect(() => { stop(); }, [language]);
  useEffect(() => () => {
    activeRef.current = false;
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return (
    <ReadAloudContext.Provider value={{ status, message, start, pause, resume, stop, supported }}>
      {children}
    </ReadAloudContext.Provider>
  );
};

export const useReadAloud = (): ReadAloudContextValue => {
  const context = useContext(ReadAloudContext);
  if (!context) throw new Error('useReadAloud must be used within a ReadAloudProvider');
  return context;
};
