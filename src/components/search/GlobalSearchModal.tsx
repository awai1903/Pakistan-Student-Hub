import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  GraduationCap,
  Award,
  FileCheck,
  Briefcase,
  BookOpen,
  Newspaper,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { dataStore } from '../../lib/dataStore';
import { VerificationBadge } from '../common/VerificationBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (type: string, id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = dataStore.searchAll(query);
  const totalCount =
    results.universities.length +
    results.admissions.length +
    results.scholarships.length +
    results.entryTests.length +
    results.jobs.length +
    results.internships.length +
    results.courses.length +
    results.news.length;

  const filters = [
    { id: 'all', label: 'All Results' },
    { id: 'universities', label: `Universities (${results.universities.length})` },
    { id: 'admissions', label: `Admissions (${results.admissions.length})` },
    { id: 'scholarships', label: `Scholarships (${results.scholarships.length})` },
    { id: 'tests', label: `Entry Tests (${results.entryTests.length})` },
    { id: 'careers', label: `Jobs & Internships (${results.jobs.length + results.internships.length})` }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 sm:pt-24 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Global Opportunity Search"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search universities, scholarships, admissions, tests, or cities..."
            className="w-full border-none bg-transparent px-3 text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            Esc
          </button>
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/80 px-4 py-2 text-xs">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Scroll Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-700">Quick Search Suggestions</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                {['NUST Islamabad', 'BS Computer Science', 'MDCAT 2026', 'HEC Need-Based', 'LUMS Admissions', 'Lahore Internships'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalCount === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              <p className="font-semibold text-slate-700">No verified results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs">Try searching by university abbreviation (NUST, QAU, FAST), city (Islamabad, Lahore), or degree program.</p>
            </div>
          ) : (
            <>
              {/* Group: Universities */}
              {(activeFilter === 'all' || activeFilter === 'universities') && results.universities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-emerald-700" />
                    <span>Universities ({results.universities.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {results.universities.map((uni) => (
                      <div
                        key={uni.id}
                        onClick={() => {
                          onSelectEntity('university', uni.slug);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                            {uni.name} {uni.short_name ? `(${uni.short_name})` : ''}
                          </h4>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>{uni.city}, {uni.province}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>{uni.sector} Sector</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>Est. {uni.established_year}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Admissions */}
              {(activeFilter === 'all' || activeFilter === 'admissions') && results.admissions.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-700" />
                    <span>Admissions ({results.admissions.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {results.admissions.map((adm) => (
                      <div
                        key={adm.id}
                        onClick={() => {
                          onSelectEntity('admission', adm.id);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                              {adm.university_name} – {adm.admission_type}
                            </h4>
                            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              {adm.status}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>{adm.program_name}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span className="tabular-nums">Closing: {adm.closing_date}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Scholarships */}
              {(activeFilter === 'all' || activeFilter === 'scholarships') && results.scholarships.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-700" />
                    <span>Scholarships ({results.scholarships.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {results.scholarships.map((sch) => (
                      <div
                        key={sch.id}
                        onClick={() => {
                          onSelectEntity('scholarship', sch.slug);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                            {sch.title}
                          </h4>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>{sch.provider}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>{sch.funding_type}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span className="tabular-nums">Deadline: {sch.deadline}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Entry Tests */}
              {(activeFilter === 'all' || activeFilter === 'tests') && results.entryTests.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-emerald-700" />
                    <span>Entry Tests ({results.entryTests.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {results.entryTests.map((test) => (
                      <div
                        key={test.id}
                        onClick={() => {
                          onSelectEntity('entry-test', test.slug);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                            {test.test_name} ({test.slug.toUpperCase()})
                          </h4>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>Organized by {test.organizer}</span>
                            {test.next_test_date && (
                              <>
                                <span className="mx-1.5 text-slate-300">·</span>
                                <span className="tabular-nums">Next Date: {test.next_test_date}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Careers (Jobs & Internships) */}
              {(activeFilter === 'all' || activeFilter === 'careers') && (results.jobs.length > 0 || results.internships.length > 0) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-emerald-700" />
                    <span>Jobs & Internships ({results.jobs.length + results.internships.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {results.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => {
                          onSelectEntity('job', job.id);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                            {job.job_title} · {job.company}
                          </h4>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>{job.location} ({job.remote_type})</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>{job.job_type}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                    {results.internships.map((intern) => (
                      <div
                        key={intern.id}
                        onClick={() => {
                          onSelectEntity('internship', intern.id);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                            {intern.title} · {intern.company}
                          </h4>
                          <div className="mt-0.5 text-xs text-slate-500">
                            <span>{intern.location}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>{intern.duration}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span>{intern.is_paid ? 'Paid' : 'Unpaid'}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-right text-[11px] text-slate-400">
          Search index ground-truthed against official Pakistani regulatory records
        </div>
      </div>
    </div>
  );
};
