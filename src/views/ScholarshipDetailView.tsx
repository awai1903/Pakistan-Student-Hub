import React, { useEffect } from 'react';
import { 
  DollarSign, 
  FileText, 
  UserCheck, 
  ExternalLink, 
  Bookmark, 
  Building, 
  CheckCircle2 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { updatePageSeo } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

interface ScholarshipDetailViewProps {
  slug: string;
  onBack: () => void;
}

export const ScholarshipDetailView: React.FC<ScholarshipDetailViewProps> = ({ slug, onBack }) => {
  const scholarship = dataStore.getScholarshipBySlug(slug);

  useEffect(() => {
    if (scholarship) {
      updatePageSeo({
        title: `${scholarship.title} - Eligibility, Benefits & Deadline`,
        description: `Verified information on ${scholarship.title} by ${scholarship.provider}. Includes financial coverage, eligibility criteria, and official application process.`,
        canonicalPath: `/scholarships/${scholarship.slug}`
      });
    }
  }, [scholarship]);

  if (!scholarship) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Scholarship Record Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested scholarship does not exist or has passed archival thresholds.
        </p>
        <button
          onClick={onBack}
          className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Scholarships
        </button>
      </div>
    );
  }

  const isSaved = dataStore.isItemSaved(scholarship.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Scholarships', href: '/scholarships', onClick: onBack },
          { label: scholarship.title }
        ]}
      />

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-emerald-50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-emerald-800 border border-emerald-100">
            {scholarship.funding_type}
          </span>
          {scholarship.category_tag && (
            <span className="rounded bg-indigo-50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-indigo-800 border border-indigo-100">
              {scholarship.category_tag}
            </span>
          )}
          <span className="rounded bg-slate-100 px-2.5 py-0.5 text-slate-700 font-semibold">
            {scholarship.study_level}
          </span>
          <span className="rounded bg-slate-100 px-2.5 py-0.5 text-slate-700">
            {scholarship.scholarship_coverage}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {scholarship.title}
        </h1>

        <div className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span>Awarded & Administered by {scholarship.provider}</span>
        </div>

        {scholarship.target_quota && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <span>🎯 Eligible Quota: {scholarship.target_quota}</span>
          </div>
        )}

        {/* Verification and Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <VerificationBadge
            status={scholarship.verification_status}
            sourceName={scholarship.source_name}
            sourceUrl={scholarship.source_url}
            lastVerifiedAt={scholarship.last_verified_at}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                dataStore.toggleSaveItem({
                  item_type: 'scholarship',
                  item_id: scholarship.id,
                  title: scholarship.title,
                  subtitle: `${scholarship.provider} · ${scholarship.funding_type}`,
                  deadline: scholarship.deadline
                });
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors ${
                isSaved
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-emerald-800' : ''}`} />
              <span>{isSaved ? 'Saved to Profile' : 'Save Opportunity'}</span>
            </button>
            <a
              href={scholarship.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 shadow-2xs transition-colors"
            >
              <span>Official Application Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Scholarship Description</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-700" />
              <span>Financial Benefits & Award Coverage</span>
            </h2>
            <div className="rounded-lg bg-emerald-50/60 p-4 border border-emerald-100 text-sm text-emerald-950 leading-relaxed font-medium">
              {scholarship.financial_benefits}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Note: Stipends and grant disbursements are transferred directly through designated banking partner accounts upon periodic academic verification.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-700" />
              <span>Eligibility & Academic Prerequisites</span>
            </h2>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">Basic Eligibility:</strong>
                <p>{scholarship.eligibility}</p>
              </div>
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">Academic Requirements:</strong>
                <p>{scholarship.academic_requirements}</p>
              </div>
              {scholarship.age_limit && (
                <div>
                  <strong className="text-slate-900 font-semibold block mb-0.5">Age Limit:</strong>
                  <p>{scholarship.age_limit}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-700" />
              <span>Required Application Documents</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {scholarship.required_documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Application Submission Process</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {scholarship.application_process}
            </p>
          </div>
        </div>

        {/* Right Column: Deadlines & Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Important Key Dates
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Application Opening:</span>
                <strong className="text-slate-800 tabular-nums">{scholarship.opening_date}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-800 font-semibold">Final Closing Deadline:</span>
                <strong className="text-amber-950 font-bold tabular-nums text-sm">{scholarship.deadline}</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <a
                href={scholarship.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 py-3 text-xs font-semibold text-white hover:bg-emerald-900 shadow-2xs transition-colors"
              >
                <span>Proceed to Official Submission</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <AdSlot placement="sidebar" />
          <AdSlot placement="smartlink_card" />
          <div className="flex justify-center">
            <AdSlot placement="skyscraper_160x600" label="Sponsored Education Partner" />
          </div>
        </div>
      </div>
    </div>
  );
};
