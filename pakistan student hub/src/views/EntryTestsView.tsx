import React, { useState } from 'react';
import { 
  Calendar, 
  ExternalLink, 
  FileText, 
  BookOpen 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface EntryTestsViewProps {
  onNavigateHome: () => void;
  selectedSlug?: string;
}

export const EntryTestsView: React.FC<EntryTestsViewProps> = ({ selectedSlug }) => {
  const tests = dataStore.getEntryTests();
  const [selectedTestId, setSelectedTestId] = useState<string>(
    selectedSlug ? tests.find((t) => t.slug === selectedSlug)?.id || tests[0]?.id : tests[0]?.id
  );

  const activeTest = tests.find((t) => t.id === selectedTestId) || tests[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Entry Tests' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Standardized Entry Tests in Pakistan
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Verified curricula, examination patterns, marking schemes, and registration portals for MDCAT (PMDC), ECAT (UET), NET (NUST), NAT & GAT (NTS), and USAT (HEC).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List of Tests (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Examination
          </h2>
          <div className="space-y-2">
            {tests.map((test) => {
              const isSelected = test.id === selectedTestId;
              return (
                <div
                  key={test.id}
                  onClick={() => setSelectedTestId(test.id)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    {test.organizer}
                  </div>
                  <h3 className={`mt-0.5 text-sm font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                    {test.test_name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="tabular-nums">
                      {test.next_test_date ? `Date: ${test.next_test_date}` : 'Cycle in announcement'}
                    </span>
                    <span className="font-medium text-emerald-800">View Pattern →</span>
                  </div>
                </div>
              );
            })}
          </div>
          <AdSlot placement="sidebar" />
        </div>

        {/* Right Active Test Details (8 cols) */}
        {activeTest && (
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-emerald-800 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                  Official Standardized Examination
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Supervised by {activeTest.organizer}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                {activeTest.test_name}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeTest.registration_info}
              </p>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <VerificationBadge
                  status={activeTest.verification_status}
                  sourceName={activeTest.source_name}
                  sourceUrl={activeTest.source_url}
                  lastVerifiedAt={activeTest.last_verified_at}
                />
                <a
                  href={activeTest.official_registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 shadow-2xs"
                >
                  <span>Official Registration Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Test Pattern & Scoring */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700" />
                <span>Test Pattern & Scoring Blueprint</span>
              </h3>
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-sm text-slate-800 font-medium leading-relaxed">
                {activeTest.test_pattern}
              </div>
            </div>

            {/* Syllabus & Curricular Scope */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />
                <span>Syllabus & Curricular Guidelines</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeTest.syllabus}
              </p>
            </div>

            {/* Eligibility Requirements */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Eligibility & Candidate Prerequisites</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeTest.eligibility}
              </p>
            </div>

            {/* Schedule & Key Dates */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-700" />
                <span>Schedule & Key Dates</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-slate-500">Upcoming Test Date:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                    {activeTest.next_test_date || 'Date will be announced via official gazette'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="text-slate-500">Registration Deadline:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                    {activeTest.registration_deadline || 'Registration not currently active'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {activeTest.important_dates}
              </p>
            </div>
          </div>
        )}
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
