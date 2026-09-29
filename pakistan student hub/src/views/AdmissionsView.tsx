import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  ExternalLink, 
  Bookmark 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface AdmissionsViewProps {
  onNavigateHome: () => void;
  onSelectUniversity: (slug: string) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<string>('all');

  const admissions = dataStore.getAdmissions();

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesSearch =
        searchQuery === '' ||
        adm.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.campus.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || adm.status === selectedStatus;

      const matchesDegree =
        selectedDegree === 'all' ||
        adm.program_name.toLowerCase().includes(selectedDegree.toLowerCase());

      return matchesSearch && matchesStatus && matchesDegree;
    });
  }, [admissions, searchQuery, selectedStatus, selectedDegree]);

  const calculateDaysRemaining = (closingDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(closingDate);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Admissions' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          University Admissions in Pakistan
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Real-time, verified intake calendars for undergraduate, graduate, and engineering/medical faculties. All applications link directly to official university portals.
        </p>
      </div>

      <AdSlot placement="header" />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, program or campus..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Statuses (Open, Upcoming, Closed)</option>
              <option value="Open">Currently Open</option>
              <option value="Closing Soon">Closing Soon (Within 14 Days)</option>
              <option value="Upcoming">Upcoming Cycles</option>
              <option value="Closed">Closed / Past Deadlines</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Fields & Degrees</option>
              <option value="Engineering">Engineering</option>
              <option value="Computing">Computing / CS</option>
              <option value="MBBS">Medical / MBBS</option>
              <option value="Business">Business / BBA</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedDegree('all');
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Admissions List */}
      <div className="space-y-4">
        {filteredAdmissions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">No admissions found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your filters or search query to find open admission cycles.
            </p>
          </div>
        ) : (
          filteredAdmissions.map((adm) => {
            const daysRemaining = calculateDaysRemaining(adm.closing_date);
            const isSaved = dataStore.isItemSaved(adm.id);

            return (
              <div
                key={adm.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                        {adm.admission_type}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                        adm.status === 'Open'
                          ? 'bg-emerald-50 text-emerald-800'
                          : adm.status === 'Closing Soon'
                          ? 'bg-amber-100 text-amber-900'
                          : adm.status === 'Upcoming'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {adm.status}
                      </span>
                      {daysRemaining > 0 && daysRemaining <= 14 && (
                        <span className="text-xs font-bold text-amber-700 tabular-nums">
                          Closing in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      {adm.university_name}
                    </h2>
                    <p className="text-sm font-medium text-slate-700">
                      {adm.program_name}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Campus: <strong className="text-slate-700">{adm.campus}</strong></span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span>Processing Fee: <strong className="text-slate-700">{adm.application_fee}</strong></span>
                      {adm.entry_test_date && (
                        <>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span>Entry Test: <strong className="text-slate-700">{adm.entry_test_date}</strong></span>
                        </>
                      )}
                    </div>

                    <div className="pt-2 text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">Eligibility:</span> {adm.eligibility}
                    </div>

                    <div className="pt-1 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-slate-700">Required:</span>
                      {adm.required_documents.map((doc, idx) => (
                        <span key={idx} className="rounded bg-slate-50 px-2 py-0.5 text-slate-600 border border-slate-100">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Dates & CTA */}
                  <div className="lg:w-64 shrink-0 rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Opening Date:</span>
                        <strong className="text-slate-800 tabular-nums">{adm.opening_date}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Closing Deadline:</span>
                        <strong className="text-slate-900 tabular-nums font-bold">{adm.closing_date}</strong>
                      </div>
                      {adm.merit_list_date && (
                        <div className="flex justify-between">
                          <span>Merit List:</span>
                          <span className="text-slate-700 tabular-nums">{adm.merit_list_date}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <a
                        href={adm.official_application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => {
                          dataStore.toggleSaveItem({
                            item_type: 'admission',
                            item_id: adm.id,
                            title: `${adm.university_name} Admission`,
                            subtitle: adm.program_name,
                            deadline: adm.closing_date
                          });
                        }}
                        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                          isSaved
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-emerald-800' : ''}`} />
                        <span>{isSaved ? 'Saved to Dashboard' : 'Save Admission'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <VerificationBadge
                    status={adm.verification_status}
                    sourceName={adm.source_name}
                    sourceUrl={adm.source_url}
                    lastVerifiedAt={adm.last_verified_at}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdSlot placement="native" label="Sponsored Admissions & College Programs" />
      <AdSlot placement="footer" />
    </div>
  );
};
