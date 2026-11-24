import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const getRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
};

export const VoiceInputButton: React.FC<{
  onTranscript: (text: string) => void;
  className?: string;
}> = ({ onTranscript, className = '' }) => {
  const { language } = useLanguage();
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const start = () => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setMessage('Voice input is not supported in this browser.');
      return;
    }

    if (listening) {
      stop();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0]?.transcript || '')
        .join(' ')
        .trim();
      if (transcript) onTranscript(transcript);
    };
    recognition.onerror = event => {
      const messages: Record<string, string> = {
        'not-allowed': 'Microphone permission was denied.',
        'audio-capture': 'No microphone was found.',
        'no-speech': 'No speech was detected. Please try again.',
        network: 'Voice recognition is unavailable.',
      };
      setMessage(messages[event.error] || 'Voice recognition could not complete.');
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
      setMessage('');
    } catch {
      setMessage('Voice recognition could not start.');
      setListening(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={start}
        className={`cp-speech-button ${listening ? 'is-listening' : ''} ${className}`}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        title={listening ? 'Stop listening' : 'Dictate text'}
      >
        {listening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>
      {(listening || message) && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400" role="status">
          {listening ? 'Listening…' : message}
        </span>
      )}
    </span>
  );
};

export const ReadAloudButton: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const [speaking, setSpeaking] = useState(false);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const toggle = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    activeUtterance.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`cp-speech-button ${speaking ? 'is-speaking' : ''} ${className}`}
      aria-label={speaking ? 'Stop reading aloud' : 'Read this information aloud'}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      disabled={!('speechSynthesis' in window)}
    >
      {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};
