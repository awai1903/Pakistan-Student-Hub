import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Bookmark, 
  Building, 
  MapPin 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

interface JobsAndInternshipsViewProps {
  initialType?: 'jobs' | 'internships';
}

export const JobsAndInternshipsView: React.FC<JobsAndInternshipsViewProps> = ({
  initialType = 'internships'
}) => {
  const [activeTab, setActiveTab] = useState<'internships' | 'jobs'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [paidOnly, setPaidOnly] = useState(false);

  const jobs = dataStore.getJobs();
  const internships = dataStore.getInternships();

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPaid = !paidOnly || item.is_paid;
    return matchesSearch && matchesPaid;
  });

  const filteredJobs = jobs.filter((item) => {
    return (
      searchQuery === '' ||
      item.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: activeTab === 'internships' ? 'Student Internships' : 'Graduate Jobs' }]} />

      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {activeTab === 'internships' ? 'Verified Student Internships in Pakistan' : 'Graduate Trainee & Student Jobs'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
            Sourced directly from verified corporate career portals, public sector tech boards (PITB), and telecom apprenticeships (Jazz, Systems Ltd, Arbisoft). No fabricated job listings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 shrink-0">
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'internships'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Internships ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graduate Jobs ({jobs.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'internships' ? 'internships' : 'jobs'} by role, company, city, or skill...`}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
          {activeTab === 'internships' && (
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={paidOnly}
                onChange={(e) => setPaidOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 h-4 w-4"
              />
              <span className="font-medium">Paid Internships Only</span>
            </label>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-900 underline"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'internships' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInternships.map((intern) => {
            const isSaved = dataStore.isItemSaved(intern.id);
            return (
              <div
                key={intern.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2.5 py-0.5 rounded font-semibold ${
                        intern.is_paid
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {intern.is_paid ? 'Paid Internship' : 'Unpaid Internship'}
                      </span>
                      <span className="text-slate-500">Duration: {intern.duration}</span>
                    </div>
                    <button
                      onClick={() => {
                        dataStore.toggleSaveItem({
                          item_type: 'internship',
                          item_id: intern.id,
                          title: intern.title,
                          subtitle: `${intern.company} · ${intern.location}`,
                          deadline: intern.deadline
                        });
                      }}
                      className="rounded-full p-1 text-slate-400 hover:text-emerald-800"
                      title="Save Internship"
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : ''}`} />
                    </button>
                  </div>

                  <h2 className="font-display text-lg font-bold text-slate-900 mt-2">
                    {intern.title}
                  </h2>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>{intern.company}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{intern.location}</span>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 block mb-0.5">Eligibility:</strong>
                    {intern.eligibility}
                  </div>

                  {intern.stipend && (
                    <div className="mt-2 text-xs font-medium text-emerald-800">
                      Stipend: {intern.stipend}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {intern.skills.map((skill, i) => (
                      <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 tabular-nums">
                    Deadline: <strong className="text-slate-800">{intern.deadline}</strong>
                  </span>
                  <a
                    href={intern.official_application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-50">
                  <VerificationBadge
                    status={intern.verification_status}
                    sourceName={intern.source_name}
                    sourceUrl={intern.source_url}
                    lastVerifiedAt={intern.last_verified_at}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const isSaved = dataStore.isItemSaved(job.id);
            return (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded bg-slate-100 px-2.5 py-0.5 text-slate-800 font-semibold">
                        {job.job_type}
                      </span>
                      <span className="rounded bg-slate-100 px-2.5 py-0.5 text-slate-600">
                        {job.remote_type}
                      </span>
                      <span className="text-emerald-800 font-medium">
                        {job.experience}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        dataStore.toggleSaveItem({
                          item_type: 'job',
                          item_id: job.id,
                          title: job.job_title,
                          subtitle: `${job.company} · ${job.location}`,
                          deadline: job.closing_date
                        });
                      }}
                      className="rounded-full p-1 text-slate-400 hover:text-emerald-800"
                      title="Save Job"
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : ''}`} />
                    </button>
                  </div>

                  <h2 className="font-display text-lg font-bold text-slate-900 mt-2">
                    {job.job_title}
                  </h2>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>{job.company}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{job.location}</span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {job.salary && (
                    <div className="mt-2 text-xs font-medium text-slate-800">
                      Package: <span className="text-emerald-800 font-semibold">{job.salary}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 tabular-nums">
                    Closing Date: <strong className="text-slate-800">{job.closing_date}</strong>
                  </span>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Careers Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-50">
                  <VerificationBadge
                    status={job.verification_status}
                    sourceName={job.source_name}
                    sourceUrl={job.source_url}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdSlot placement="footer" />
    </div>
  );
};
