import React, { useState } from 'react';
import { 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface NewsViewProps {
  selectedSlug?: string;
}

export const NewsView: React.FC<NewsViewProps> = ({ selectedSlug }) => {
  const newsList = dataStore.getNews();
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(selectedSlug || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeArticle = activeArticleSlug
    ? newsList.find((n) => n.slug === activeArticleSlug)
    : null;

  const filteredNews = newsList.filter((n) => {
    return selectedCategory === 'all' || n.category === selectedCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs
        items={
          activeArticle
            ? [
                { label: 'Education News', onClick: () => setActiveArticleSlug(null) },
                { label: activeArticle.title }
              ]
            : [{ label: 'Education News' }]
        }
      />

      {activeArticle ? (
        /* Full Article View */
        <div className="mx-auto max-w-4xl space-y-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <button
            onClick={() => setActiveArticleSlug(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            ← Back to all circulars
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-emerald-50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-emerald-800">
              {activeArticle.category}
            </span>
            <span className="text-slate-500 tabular-nums">
              Published: {activeArticle.publication_date}
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-600">
              By {activeArticle.author}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
            {activeArticle.title}
          </h1>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 italic leading-relaxed">
            &ldquo;{activeArticle.summary}&rdquo;
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed space-y-4 pt-2">
            <p>{activeArticle.content}</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <VerificationBadge
              status={activeArticle.verification_status}
              sourceName={activeArticle.source_name}
              sourceUrl={activeArticle.source_url}
            />
            <a
              href={activeArticle.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              <span>Read Original Official Notice</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* News List View */
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Pakistan Higher Education News & Gazette Circulars
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
              Factual, source-attributed summaries of notifications from Higher Education Commission (HEC), PMDC, provincial boards, and national testing agencies. No clickbait or unsubstantiated rumours.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            {['all', 'HEC Policy', 'Entry Tests', 'Scholarships', 'Admissions'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-3 py-1 font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Notices' : cat}
              </button>
            ))}
          </div>

          {/* News Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticleSlug(item.slug)}
                className="group cursor-pointer flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="tabular-nums">{item.publication_date}</span>
                  </div>
                  <h2 className="font-display text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Source: <strong className="text-slate-800">{item.source_name}</strong></span>
                  <span className="font-semibold text-emerald-800 group-hover:underline inline-flex items-center gap-0.5">
                    <span>Summary</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot placement="footer" />
    </div>
  );
};
