import React, { useState, useEffect } from 'react';
import { LearnArticle, LEARN_ARTICLES } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { 
  Clock, 
  Award, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

import { API_BASE_URL } from '../config/api';

export const LearnView: React.FC = () => {
  const { navigateTo } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<LearnArticle | null>(null);
  const [articles, setArticles] = useState<LearnArticle[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/learn`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Learn API unavailable')))
      .then(data => setArticles(Array.isArray(data) && data.length ? data : LEARN_ARTICLES))
      .catch(() => setArticles(LEARN_ARTICLES));
  }, []);

  const categories = ['All', 'Phishing', 'QR Safety', 'OTP Safety', 'URLs', 'Shopping', 'Account Security'];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {activeArticle ? (
        /* Full Article Reader */
        <div className="space-y-6">
          <button
            onClick={() => setActiveArticle(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Learning Guides</span>
          </button>

          <article className="p-6 md:p-10 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="space-y-3 border-b border-slate-100 dark:border-white/5 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
                <span className="text-xs text-slate-400 font-mono">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {activeArticle.difficulty}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeArticle.title}
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeArticle.summary}
              </p>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways Callout */}
            <div className="p-6 rounded-2xl bg-teal-500/[0.04] border border-teal-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Essential Safe Habits (Key Takeaways)</span>
              </h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                {activeArticle.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-white/5">
              <Button variant="outline" size="sm" onClick={() => setActiveArticle(null)}>
                Done Reading
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigateTo('scan')}>
                Try CyberProof Scanner
              </Button>
            </div>
          </article>
        </div>
      ) : (
        /* Articles Directory */
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Educational Knowledge Base
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              CyberProof Learning Hub
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Understand the mechanics of digital deception without confusing cybersecurity jargon. Clear explanations for everyday safety.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-teal-600 dark:text-teal-400 font-bold">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
