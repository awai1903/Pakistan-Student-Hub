import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Bookmark 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface ScholarshipsViewProps {
  onSelectScholarship: (slug: string) => void;
  onNavigateHome: () => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({
  onSelectScholarship
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFunding, setSelectedFunding] = useState<string>('all');
  const [selectedCoverage, setSelectedCoverage] = useState<string>('all');

  const scholarships = dataStore.getScholarships();

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((sch) => {
      const matchesSearch =
        searchQuery === '' ||
        sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sch.target_quota && sch.target_quota.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        sch.category_tag === selectedCategory;

      const matchesLevel =
        selectedLevel === 'all' ||
        sch.study_level.toLowerCase().includes(selectedLevel.toLowerCase());

      const matchesFunding =
        selectedFunding === 'all' ||
        sch.funding_type.toLowerCase() === selectedFunding.toLowerCase();

      const matchesCoverage =
        selectedCoverage === 'all' ||
        sch.scholarship_coverage.toLowerCase() === selectedCoverage.toLowerCase();

      return matchesSearch && matchesCategory && matchesLevel && matchesFunding && matchesCoverage;
    });
  }, [scholarships, searchQuery, selectedCategory, selectedLevel, selectedFunding, selectedCoverage]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Scholarships' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Scholarships for Pakistani Students
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Verified directory of Higher Education Commission (HEC) need-based scholarships, provincial endowment funds (PEEF), British Council Scottish scholarships, and bilateral international awards (Fulbright).
        </p>
      </div>

      <AdSlot placement="header" />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        {/* Quick Category Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Specialized Scholarship Quotas & Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'Disability Quota', label: '♿ Disability Quota (معذور افراد)' },
              { id: 'Women & Girls', label: '👩 Scottish & Women / Girls' },
              { id: 'Talent & Sports', label: '🏆 Talent Hunt & Sports' },
              { id: 'Merit-Based', label: '🎓 Merit-Based' },
              { id: 'Need-Based', label: '🤝 Need-Based & Financial Aid' },
              { id: 'Provincial Endowment', label: '🏛️ Provincial (PEEF/BEEF/SEEF)' },
              { id: 'Minority Quota', label: '🕊️ Minority Quota' },
              { id: 'International', label: '🌐 International & Bilateral' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, provider, disability, Scottish, talent..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Study Levels</option>
              <option value="Undergraduate">Undergraduate (BS / Bachelor)</option>
              <option value="Masters">Master's / MS / MPhil</option>
              <option value="PhD">Postgraduate / PhD</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Funding Types</option>
              <option value="Fully Funded">Fully Funded</option>
              <option value="Need-Based">Need-Based Assistance</option>
              <option value="Merit-Based">Merit-Based Grant</option>
              <option value="Tuition Fee Waiver">Tuition Fee Waiver</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedFunding('all');
                setSelectedCoverage('all');
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Coverage Tabs */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Provider Type:</span>
          {['all', 'Government', 'International', 'University'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCoverage(c)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedCoverage === c
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'all' ? 'All Providers' : c}
            </button>
          ))}
          <span className="ml-auto text-slate-400 tabular-nums">
            Showing {filteredScholarships.length} of {scholarships.length} opportunities
          </span>
        </div>
      </div>

      {/* Grid of Scholarships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholarships.map((sch) => {
          const isSaved = dataStore.isItemSaved(sch.id);
          return (
            <div
              key={sch.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                      {sch.funding_type}
                    </span>
                    {sch.category_tag && (
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {sch.category_tag}
                      </span>
                    )}
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-medium">
                      {sch.study_level}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                      {sch.scholarship_coverage}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      dataStore.toggleSaveItem({
                        item_type: 'scholarship',
                        item_id: sch.id,
                        title: sch.title,
                        subtitle: `${sch.provider} · ${sch.funding_type}`,
                        deadline: sch.deadline
                      });
                    }}
                    className="rounded-full p-1.5 text-slate-400 hover:text-emerald-800 transition-colors"
                    title={isSaved ? 'Remove Bookmark' : 'Save Scholarship'}
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : ''}`} />
                  </button>
                </div>

                <h2
                  onClick={() => onSelectScholarship(sch.slug)}
                  className="font-display text-lg font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer mt-3"
                >
                  {sch.title}
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  Organized by {sch.provider}
                </p>
                {sch.target_quota && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                    <span>🎯 Quota: {sch.target_quota}</span>
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {sch.description}
                </p>
                <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-100 text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-slate-800">Coverage: </span>
                    <span className="text-slate-600">{sch.financial_benefits}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Academic Criteria: </span>
                    <span className="text-slate-600">{sch.academic_requirements}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 tabular-nums">
                  Application Deadline: <strong className="text-slate-900 font-bold">{sch.deadline}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectScholarship(sch.slug)}
                    className="font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Details & Eligibility
                  </button>
                  <a
                    href={sch.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-900 shadow-2xs"
                  >
                    <span>Apply Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-50">
                <VerificationBadge
                  status={sch.verification_status}
                  sourceName={sch.source_name}
                  sourceUrl={sch.source_url}
                  lastVerifiedAt={sch.last_verified_at}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <AdSlot placement="smartlink_card" />
        <AdSlot placement="native" label="Recommended Grants & Study Abroad Offers" />
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
