import React from 'react';
import { Scan } from '../../types/scan';
import { getTrustScore } from '../ui/TrustScore';
import { TrendingUp } from 'lucide-react';

interface Props { scans: Scan[]; }

export const TrustJourneyChart: React.FC<Props> = ({ scans }) => {
  const chronological = [...scans].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const data = chronological.map(scan => ({
    score: getTrustScore(scan),
    date: new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }));

  if (data.length === 0) return null;

  const width = 760;
  const height = 250;
  const pad = { left: 44, right: 22, top: 22, bottom: 42 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (i:number) => pad.left + (data.length === 1 ? innerW / 2 : (i/(data.length-1))*innerW);
  const y = (v:number) => pad.top + ((100-v)/100)*innerH;
  const points = data.map((d,i)=>`${x(i)},${y(d.score)}`).join(' ');

  return (
    <section className="p-6 md:p-7 rounded-3xl border border-[var(--cp-line)] bg-[var(--cp-card)] shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--cp-teal)]" />
            <h2 className="text-base md:text-lg font-extrabold text-[var(--cp-ink)]">Trust Journey</h2>
          </div>
          <p className="text-[11px] text-[var(--cp-stone)] mt-1">How the derived trust score changed across recorded checks.</p>
        </div>
        {data.length < 2 && <span className="text-[9px] uppercase tracking-[.12em] text-[var(--cp-stone)]">Baseline only</span>}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[620px] w-full h-[230px]" role="img" aria-label="Trust score journey graph">
          {[0,25,50,75,100].map(v => (
            <g key={v}>
              <line x1={pad.left} x2={width-pad.right} y1={y(v)} y2={y(v)} stroke="var(--cp-line)" strokeWidth="1" />
              <text x="8" y={y(v)+4} fontSize="10" fill="var(--cp-stone)">{v}</text>
            </g>
          ))}
          <polyline points={points} fill="none" stroke="var(--cp-teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d,i) => (
            <g key={`${d.date}-${i}`}>
              <circle cx={x(i)} cy={y(d.score)} r="7" fill="var(--cp-card)" stroke="var(--cp-teal)" strokeWidth="3" />
              <text x={x(i)} y={y(d.score)-14} textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--cp-ink)">{d.score}</text>
              <text x={x(i)} y={height-14} textAnchor="middle" fontSize="10" fill="var(--cp-stone)">{d.date}</text>
            </g>
          ))}
        </svg>
      </div>
      {data.length < 2 && <p className="text-[10px] text-[var(--cp-stone)] mt-1">Run this website check again later to build a real journey from recorded snapshots.</p>}
    </section>
  );
};
