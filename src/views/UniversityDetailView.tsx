import React, { useEffect } from 'react';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Award, 
  BedDouble, 
  CreditCard, 
  ExternalLink, 
  Bookmark, 
  Scale 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { updatePageSeo, generateUniversitySchema } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

interface UniversityDetailViewProps {
  slug: string;
  onBack: () => void;
  onNavigateCompare: (slug: string) => void;
}

export const UniversityDetailView: React.FC<UniversityDetailViewProps> = ({
  slug,
  onBack,
  onNavigateCompare
}) => {
  const university = dataStore.getUniversityBySlug(slug);

  useEffect(() => {
    if (university) {
      updatePageSeo({
        title: `${university.name} (${university.short_name || university.city}) - Admissions, Programs & Fees`,
        description: `Explore verified academic programs, HEC status, admission schedule, fee estimates, and hostel facilities for ${university.name}.`,
        canonicalPath: `/universities/${university.slug}`,
        structuredData: generateUniversitySchema(university)
      });
    }
  }, [university]);

  if (!university) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">University Record Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested university profile does not exist or has been archived.
        </p>
        <button
          onClick={onBack}
          className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const isSaved = dataStore.isItemSaved(university.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Universities', href: '/universities', onClick: onBack },
          { label: university.short_name || university.name }
        ]}
      />

      {/* Hero Header Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={university.cover_image}
            alt={university.name}
            className="h-full w-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded bg-emerald-800 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                {university.sector} University
              </span>
              <span className="rounded bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-xs text-white">
                Est. {university.established_year}
              </span>
              <span className="rounded bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-xs text-white">
                {university.province}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {university.name} {university.short_name ? `(${university.short_name})` : ''}
            </h1>
            <div className="mt-2 text-xs sm:text-sm text-emerald-300 font-medium">
              {university.recognition_status}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 text-xs">
          <VerificationBadge
            status={university.verification_status}
            sourceName={university.source_name}
            sourceUrl={university.source_url}
            lastVerifiedAt={university.last_verified_at}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateCompare(university.slug)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Scale className="h-3.5 w-3.5 text-slate-500" />
              <span>Compare</span>
            </button>
            <button
              onClick={() => {
                dataStore.toggleSaveItem({
                  item_type: 'university',
                  item_id: university.id,
                  title: university.name,
                  subtitle: `${university.city} · ${university.sector}`
                });
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium shadow-2xs transition-colors ${
                isSaved
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-emerald-800' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            {university.admission_portal_url && (
              <a
                href={university.admission_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-900 shadow-2xs transition-colors"
              >
                <span>Online Admission Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <span>Official Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Core Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Institutional Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {university.description}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
              <div>
                <span className="font-semibold text-slate-800">Primary Campus:</span>
                <p className="text-slate-600 mt-0.5">{university.address}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Sub-Campuses:</span>
                <p className="text-slate-600 mt-0.5">
                  {university.campus_locations.join(', ') || 'Single Main Campus'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-700" />
              <span>Faculties & Degree Programs</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Faculties & Constituent Schools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {university.faculties.map((fac, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 font-medium text-slate-800">
                      {fac}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Offered Undergraduate & Graduate Programs
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {university.programs.map((prog, idx) => (
                    <span key={idx} className="rounded-md bg-emerald-50 px-2.5 py-1 font-medium text-emerald-900 border border-emerald-100">
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-700" />
              <span>Admission Procedure & Criteria</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {university.admission_information}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-700" />
              <span>Fee Structure & Guidelines</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {university.fee_information}
            </p>
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200/80">
              Note: Exact semester dues are finalized per academic session by the university finance board. Always consult the official university fee schedule.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-emerald-700" />
              <span>Hostel & Accommodation</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {university.hostel_information}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-700" />
              <span>Financial Aid & Scholarships</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {university.scholarships}
            </p>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Contacts & Meta */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Official Contact Information
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Campus Address:</span>
                  <p className="mt-0.5 text-slate-600">{university.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Admissions Desk:</span>
                  <p className="mt-0.5 text-slate-600 tabular-nums">{university.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Official Email:</span>
                  <p className="mt-0.5 text-slate-600">{university.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Web Portal:</span>
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-0.5 text-emerald-800 hover:underline"
                  >
                    {university.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <a
                href={university.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>Verify Source at HEC Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <AdSlot placement="sidebar" />

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h3 className="text-sm font-bold text-emerald-950">Compare Universities</h3>
            <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
              Compare {university.short_name || university.name} side-by-side with other institutions on fees, entry tests, and hostel facilities.
            </p>
            <button
              onClick={() => onNavigateCompare(university.slug)}
              className="mt-3 w-full rounded-lg bg-emerald-800 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors"
            >
              Start Comparison →
            </button>
          </div>

          <div className="flex justify-center">
            <AdSlot placement="skyscraper_160x300" label="Sponsored Educational Gear" />
          </div>

          <AdSlot placement="smartlink_card" />
        </div>
      </div>
    </div>
  );
};
