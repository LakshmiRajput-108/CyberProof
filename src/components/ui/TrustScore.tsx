import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';
import { RiskLevel, Scan } from '../../types/scan';

export const getTrustScore = (scan: Scan): number => {
  if (!scan.evidence?.length) {
    if (scan.risk_level === 'LOW') return 88;
    if (scan.risk_level === 'MEDIUM') return 70;
    if (scan.risk_level === 'HIGH') return 34;
    return 52;
  }

  let score = 60;
  for (const item of scan.evidence) {
    if (item.status === 'Verified') score += 8;
    else if (item.status === 'Observed') score += 3;
    else if (item.status === 'Unable to Verify') score -= 7;
    else score -= 4;

    if (item.importance === 'critical' && item.status !== 'Verified') score -= 3;
  }

  if (scan.risk_level === 'LOW') score += 10;
  if (scan.risk_level === 'HIGH') score -= 20;
  if (scan.risk_level === 'UNKNOWN') score -= 5;

  return Math.max(8, Math.min(96, Math.round(score)));
};

export const trustLabel = (score: number) => {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Caution';
  if (score >= 40) return 'High Risk';
  return 'Critical Risk';
};

const tone = (score: number) => {
  if (score >= 80) return { accent: '#2f8f89', track: 'rgba(47,143,137,.14)', icon: ShieldCheck };
  if (score >= 60) return { accent: '#b88935', track: 'rgba(184,137,53,.15)', icon: AlertTriangle };
  if (score >= 40) return { accent: '#c56a45', track: 'rgba(197,106,69,.14)', icon: ShieldAlert };
  return { accent: '#b94a4a', track: 'rgba(185,74,74,.14)', icon: ShieldAlert };
};

interface TrustScoreProps {
  scan?: Scan;
  score?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showStatus?: boolean;
  className?: string;
}

export const TrustScore: React.FC<TrustScoreProps> = ({
  scan,
  score: providedScore,
  size = 'md',
  showLabel = true,
  showStatus = true,
  className = '',
}) => {
  const score = providedScore ?? (scan ? getTrustScore(scan) : 0);
  const label = trustLabel(score);
  const { accent, track, icon: Icon } = tone(score);
  const sizes = {
    sm: { box: 58, text: 18, stroke: 7, label: '9px' },
    md: { box: 92, text: 27, stroke: 8, label: '10px' },
    lg: { box: 142, text: 40, stroke: 10, label: '11px' },
    xl: { box: 174, text: 50, stroke: 11, label: '12px' },
  }[size];

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (score / 100);

  return (
    <div className={`flex flex-col items-center ${className}`} aria-label={`Trust score ${score}, ${label}`}>
      <div className="relative" style={{ width: sizes.box, height: sizes.box }}>
        <svg width={sizes.box} height={sizes.box} viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke={track} strokeWidth={sizes.stroke} />
          <circle
            cx="50" cy="50" r={radius} fill="none" stroke={accent} strokeWidth={sizes.stroke}
            strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: 'var(--cp-ink)' }}>
          <span style={{ fontSize: sizes.text, lineHeight: 1, fontWeight: 850, letterSpacing: '-.04em' }}>{score}</span>
          {size !== 'sm' && <span className="mt-1 uppercase tracking-[.14em]" style={{ fontSize: '7px', color: 'var(--cp-stone)' }}>trust</span>}
        </div>
      </div>
      {showLabel && <span className="mt-2 uppercase tracking-[.14em] font-extrabold" style={{ fontSize: sizes.label, color: 'var(--cp-stone)' }}>Trust Score</span>}
      {showStatus && (
        <span className="mt-1 inline-flex items-center gap-1.5 font-bold" style={{ fontSize: sizes.label, color: accent }}>
          <Icon className="w-3 h-3" /> {label}
        </span>
      )}
    </div>
  );
};

export const riskToScore = (risk: RiskLevel) => ({ LOW: 88, MEDIUM: 68, HIGH: 34, UNKNOWN: 52 }[risk]);
