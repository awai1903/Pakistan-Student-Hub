import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Check
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface DeadlinesViewProps {
  onNavigateHome: () => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [reminderAdded, setReminderAdded] = useState<string | null>(null);

  const allDeadlines = dataStore.getUpcomingDeadlines();

  const filtered = allDeadlines.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category.toLowerCase() === filterCategory.toLowerCase();
  });

  // Group into: Today/Tomorrow, This Week (<=7 days), This Month (<=30 days), Later
  const todayOrTomorrow = filtered.filter((d) => d.daysRemaining <= 1);
  const thisWeek = filtered.filter((d) => d.daysRemaining > 1 && d.daysRemaining <= 7);
  const thisMonth = filtered.filter((d) => d.daysRemaining > 7 && d.daysRemaining <= 30);
  const later = filtered.filter((d) => d.daysRemaining > 30);

  const handleAddReminder = (item: typeof allDeadlines[0]) => {
    dataStore.addReminder({
      title: item.title,
      deadline_date: item.dateStr,
      category: item.category,
      link_url: item.officialUrl,
      notes: item.subtitle
    });
    setReminderAdded(item.id);
    setTimeout(() => setReminderAdded(null), 2500);
  };

  const renderDeadlineCard = (item: typeof allDeadlines[0]) => {
    const isAdded = reminderAdded === item.id;
    return (
      <div
        key={item.id}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {item.category}
            </span>
            <span className="text-slate-500 tabular-nums">
              Exact Date: <strong className="text-slate-800">{item.dateStr}</strong>
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
          <p className="text-xs text-slate-600">{item.subtitle}</p>

          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Verified Source: <strong className="text-slate-700">{item.sourceName}</strong></span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-right">
            <span className={`text-xs font-bold tabular-nums px-2.5 py-1 rounded ${
              item.daysRemaining <= 3
                ? 'bg-rose-100 text-rose-900 font-bold'
                : item.daysRemaining <= 7
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-100 text-slate-800'
            }`}>
              {item.daysRemaining === 0
                ? 'Closes Today'
                : item.daysRemaining === 1
                ? 'Closes Tomorrow'
                : `Closing in ${item.daysRemaining} days`}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => handleAddReminder(item)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              title="Add to my deadline alerts"
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Added</span>
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5 text-slate-500" />
                  <span>Alert Me</span>
                </>
              )}
            </button>

            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 shadow-2xs"
            >
              <span>Portal</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Deadlines Calendar' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Clock className="h-7 w-7 text-emerald-800" />
          <span>Verified Opportunities Closing Calendar</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Centralized chronological deadline engine for Pakistani student opportunities. Countdowns are only computed for verifiable, official closing dates published by universities, HEC, or testing directorates.
        </p>
      </div>

      {/* Adsterra Leaderboard Banner */}
      <AdSlot placement="header" />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs">
        <span className="text-slate-500 font-medium">Filter Category:</span>
        {['all', 'Admission', 'Scholarship', 'Entry Test', 'Internship'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Opportunities' : cat}
          </button>
        ))}
      </div>

      {/* Group 1: Today & Tomorrow */}
      {todayOrTomorrow.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>Today & Tomorrow ({todayOrTomorrow.length})</span>
          </h2>
          <div className="space-y-3">
            {todayOrTomorrow.map(renderDeadlineCard)}
          </div>
        </section>
      )}

      {/* Group 2: This Week */}
      {thisWeek.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Closing This Week ({thisWeek.length})</span>
          </h2>
          <div className="space-y-3">
            {thisWeek.map(renderDeadlineCard)}
          </div>
        </section>
      )}

      {/* Group 3: This Month */}
      {thisMonth.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>Closing Later This Month ({thisMonth.length})</span>
          </h2>
          <div className="space-y-3">
            {thisMonth.map(renderDeadlineCard)}
          </div>
        </section>
      )}

      {/* Group 4: Later */}
      {later.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Subsequent Deadlines ({later.length})</span>
          </h2>
          <div className="space-y-3">
            {later.map(renderDeadlineCard)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-sm font-semibold text-slate-700">No active deadlines in this category</h3>
          <p className="mt-1 text-xs text-slate-500">All opportunities in this category are either completed or upcoming session announcements are pending.</p>
        </div>
      )}

      {/* Adsterra 468x60 Banner (31478642) */}
      <div className="flex justify-center">
        <AdSlot placement="banner_468x60" label="Sponsored Educational Alerts" />
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
