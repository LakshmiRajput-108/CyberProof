import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Bell, Clock3, Search, ShieldAlert, Tag } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { API_BASE_URL } from '../config/api';
import { THREAT_AWARENESS_TOPICS } from '../services/mockData';

export interface ThreatPulse {
  id: string;
  topic: string;
  summary: string;
  status: string;
  severity?: string;
  indicatorsToWatch: string[];
  preventiveAction: string;
  lastUpdated: string;
}

const categoryFor = (topic: ThreatPulse) => {
  const t = topic.topic.toLowerCase();
  if (t.includes('bank') || t.includes('kyc') || t.includes('utility')) return 'Bank & Payments';
  if (t.includes('voice') || t.includes('family')) return 'AI & Identity';
  if (t.includes('arrest') || t.includes('police')) return 'Impersonation';
  if (t.includes('phishing') || t.includes('sms')) return 'Phishing';
  if (t.includes('e-commerce') || t.includes('clone')) return 'Shopping';
  return 'Safety';
};

const readTime = (topic: ThreatPulse) => `${Math.max(3, Math.min(8, Math.ceil((topic.summary.length + topic.indicatorsToWatch.join(' ').length) / 140)))} min read`;

export const ThreatPulseView: React.FC = () => {
  const { navigateTo } = useAppData();
  const [topics, setTopics] = useState<ThreatPulse[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ThreatPulse | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/threat-pulse`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Threat Radar API unavailable')))
      .then(data => {
        const next = Array.isArray(data) && data.length ? data : THREAT_AWARENESS_TOPICS;
        setTopics(next);
        setSelectedTopic(next[0] ?? null);
      })
      .catch(() => {
        setTopics(THREAT_AWARENESS_TOPICS);
        setSelectedTopic(THREAT_AWARENESS_TOPICS[0] ?? null);
      });
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(topics.map(categoryFor)))], [topics]);
  const filtered = useMemo(() => topics.filter(t => {
    const matchesCategory = activeCategory === 'All' || categoryFor(t) === activeCategory;
    const q = query.trim().toLowerCase();
    return matchesCategory && (!q || `${t.topic} ${t.summary}`.toLowerCase().includes(q));
  }), [topics, activeCategory, query]);

  const featured = filtered[0] ?? topics[0];
  const latest = filtered.slice(1);

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
          <ShieldAlert className="w-4 h-4" /> Threat Radar
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Scam alerts, trends & safety guides</h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-500 dark:text-slate-400">
              Practical threat briefings that explain what the scam looks like, the pressure tactics behind it, and what you can do before taking action.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard px-3 py-2 w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search threat guides" className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400" />
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(category => (
          <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold border transition ${activeCategory === category ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' : 'bg-white dark:bg-cyber-bg-darkCard text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'}`}>
            {category}
          </button>
        ))}
      </div>

      {featured && (
        <section className="grid lg:grid-cols-[1.45fr_0.55fr] gap-5">
          <article className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard shadow-sm">
            <div className="min-h-52 p-7 md:p-9 bg-gradient-to-br from-[#34626C] via-[#2a5159] to-[#1F3A40] text-white relative overflow-hidden">
              <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full border border-white/10" />
              <div className="absolute right-10 bottom-8 w-24 h-24 rounded-full bg-white/5" />
              <div className="relative max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">Featured briefing</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-400/15 text-rose-100 border border-rose-200/15">{featured.status}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">{featured.topic}</h2>
                <p className="text-sm text-white/80 leading-relaxed max-w-xl">{featured.summary}</p>
                <div className="flex items-center gap-4 text-xs text-white/65">
                  <span className="flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" /> {readTime(featured)}</span>
                  <span>{featured.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Tag className="w-3.5 h-3.5" /> {categoryFor(featured)}</div>
              <button onClick={() => setSelectedTopic(featured)} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400">Read briefing <ArrowUpRight className="w-4 h-4" /></button>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Bell className="w-4 h-4 text-teal-500" /> What to watch</div>
            <div className="mt-5 space-y-4">
              {(featured.indicatorsToWatch || []).slice(0, 3).map((item, i) => (
                <div key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />{item}
                </div>
              ))}
            </div>
            <button onClick={() => navigateTo('scan', { tab: 'url' })} className="mt-6 w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-sm font-bold">Check something suspicious</button>
          </aside>
        </section>
      )}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-slate-400">Latest</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">Latest scam briefings</h2>
          </div>
          <span className="text-xs text-slate-400">{filtered.length} briefings</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latest.map(topic => (
            <article key={topic.id} className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard p-5 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">{categoryFor(topic)}</span>
                <span className="text-[10px] text-slate-400">{readTime(topic)}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-white">{topic.topic}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{topic.summary}</p>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{topic.lastUpdated}</span>
                <button onClick={() => setSelectedTopic(topic)} className="text-xs font-bold text-teal-700 dark:text-teal-400 inline-flex items-center gap-1">Read <ArrowUpRight className="w-3.5 h-3.5" /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedTopic && (
        <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-cyber-bg-darkCard p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">Briefing reader · {categoryFor(selectedTopic)}</div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{selectedTopic.topic}</h2>
              <p className="mt-1 text-xs text-slate-400">{selectedTopic.lastUpdated} · {readTime(selectedTopic)}</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 p-5">
              <h3 className="font-bold text-slate-900 dark:text-white">What is happening?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedTopic.summary}</p>
            </div>
            <div className="rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 p-5">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">Red flags to notice</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">{selectedTopic.indicatorsToWatch.map((x, i) => <li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{x}</li>)}</ul>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 p-5">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300">What you can do</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedTopic.preventiveAction}</p>
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] p-5 text-sm text-slate-600 dark:text-slate-300">
        <strong className="text-slate-900 dark:text-white">CyberProof awareness note:</strong> Threat Radar is designed as an educational briefing feed. It does not claim to be a live global attack map; current entries should be date-stamped and sourced when connected to live reporting.
      </div>
    </div>
  );
};
