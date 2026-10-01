import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  Check,
  CalendarPlus,
  Download 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
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

  const getGoogleCalendarUrl = (item: typeof allDeadlines[0]) => {
    let dateStr = '';
    try {
      const d = new Date(item.dateStr);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
      }
    } catch (e) {}
    if (!dateStr) {
      const target = new Date();
      target.setDate(target.getDate() + item.daysRemaining);
      dateStr = target.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
    }
    const dates = `${dateStr}T090000Z/${dateStr}T170000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Closing Deadline: ' + item.title)}&dates=${dates}&details=${encodeURIComponent(item.subtitle + '\n\nOfficial Portal: ' + item.officialUrl + '\nVerified on Pakistan Student Hub')}&location=${encodeURIComponent(item.sourceName || 'Pakistan')}`;
  };

  const handleDownloadIcs = (item: typeof allDeadlines[0]) => {
    let dateStr = '';
    try {
      const d = new Date(item.dateStr);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
      }
    } catch (e) {}
    if (!dateStr) {
      const target = new Date();
      target.setDate(target.getDate() + item.daysRemaining);
      dateStr = target.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
    }
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pakistan Student Hub//Academic Deadlines//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Deadline: ${item.title}`,
      `DESCRIPTION:${item.subtitle}\\nPortal: ${item.officialUrl}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <button
              onClick={() => handleAddReminder(item)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              title="Add to my in-app deadline alerts"
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Saved</span>
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5 text-slate-500" />
                  <span>Alert Me</span>
                </>
              )}
            </button>
            <a
              href={getGoogleCalendarUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              title="Add to Google Calendar"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-emerald-600" />
              <span>G-Cal</span>
            </a>
            <button
              onClick={() => handleDownloadIcs(item)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              title="Download iCal (.ics) file for Apple Calendar or Outlook"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>.ICS</span>
            </button>
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-800 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 shadow-2xs"
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

      <div className="flex justify-center">
        <AdSlot placement="banner_468x60" label="Sponsored Educational Alerts" />
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
