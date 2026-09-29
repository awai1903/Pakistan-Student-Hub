import React, { useState } from 'react';
import {
  Scale,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  CreditCard,
  BedDouble,
  Award,
  Globe,
  ExternalLink
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { University } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';

interface CompareViewProps {
  initialSlug?: string;
  onNavigateUniversity: (slug: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  initialSlug,
  onNavigateUniversity
}) => {
  const universities = dataStore.getUniversities();

  const [slugA, setSlugA] = useState<string>(
    initialSlug || universities[0]?.slug || ''
  );
  const [slugB, setSlugB] = useState<string>(
    universities[1]?.slug || universities[0]?.slug || ''
  );

  const uniA = dataStore.getUniversityBySlug(slugA);
  const uniB = dataStore.getUniversityBySlug(slugB);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Compare Universities' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Scale className="h-7 w-7 text-emerald-800" />
          <span>Factual University Comparison</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Side-by-side objective comparison of verified institutional attributes, admissions requirements, fee structures, and campus hostel facilities. No subjective scores or biased rankings.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select University A
            </label>
            <select
              value={slugA}
              onChange={(e) => setSlugA(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm font-semibold text-slate-900 focus:border-emerald-700 focus:outline-hidden"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.slug}>
                  {u.name} ({u.short_name || u.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select University B
            </label>
            <select
              value={slugB}
              onChange={(e) => setSlugB(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm font-semibold text-slate-900 focus:border-emerald-700 focus:outline-hidden"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.slug}>
                  {u.name} ({u.short_name || u.city})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Side-by-side Comparison Matrix */}
      {uniA && uniB && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          
          {/* Table Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50 p-6">
            <div className="space-y-1 pr-0 md:pr-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {uniA.sector} Institution
              </span>
              <h2 className="text-xl font-bold text-slate-900">{uniA.name}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{uniA.city}, {uniA.province}</span>
                <span className="text-slate-300">·</span>
                <span className="tabular-nums">Est. {uniA.established_year}</span>
              </div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 pl-0 md:pl-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {uniB.sector} Institution
              </span>
              <h2 className="text-xl font-bold text-slate-900">{uniB.name}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{uniB.city}, {uniB.province}</span>
                <span className="text-slate-300">·</span>
                <span className="tabular-nums">Est. {uniB.established_year}</span>
              </div>
            </div>
          </div>

          {/* Matrix Rows */}
          <div className="divide-y divide-slate-200 text-sm">
            
            {/* Row 1: Recognition & Accreditation */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Recognition & Accreditation
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5">
              <div className="pr-0 md:pr-4 text-xs font-medium text-slate-800">
                {uniA.recognition_status}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6 text-xs font-medium text-slate-800">
                {uniB.recognition_status}
              </div>
            </div>

            {/* Row 2: Admission Requirements & Entry Tests */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Admission Process & Entry Tests Required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 text-xs text-slate-700 leading-relaxed">
              <div className="pr-0 md:pr-4">
                {uniA.admission_information}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6">
                {uniB.admission_information}
              </div>
            </div>

            {/* Row 3: Tuition & Fee Structure */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Estimated Fee Structure
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 text-xs text-slate-700 leading-relaxed">
              <div className="pr-0 md:pr-4">
                {uniA.fee_information}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6">
                {uniB.fee_information}
              </div>
            </div>

            {/* Row 4: Hostel & Student Housing */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Hostel Accommodation Facilities
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 text-xs text-slate-700 leading-relaxed">
              <div className="pr-0 md:pr-4">
                {uniA.hostel_information}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6">
                {uniB.hostel_information}
              </div>
            </div>

            {/* Row 5: Scholarships & Financial Support */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Available Scholarships & Financial Assistance
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 text-xs text-slate-700 leading-relaxed">
              <div className="pr-0 md:pr-4">
                {uniA.scholarships}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6">
                {uniB.scholarships}
              </div>
            </div>

            {/* Row 6: Degree Offerings Sample */}
            <div className="p-4 bg-slate-100/50 font-semibold text-xs uppercase tracking-wider text-slate-500">
              Degree Offerings Sample
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 text-xs">
              <div className="pr-0 md:pr-4 flex flex-wrap gap-1.5">
                {uniA.programs.map((p, i) => (
                  <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-slate-800">
                    {p}
                  </span>
                ))}
              </div>
              <div className="pt-3 md:pt-0 pl-0 md:pl-6 flex flex-wrap gap-1.5">
                {uniB.programs.map((p, i) => (
                  <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-slate-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Row 7: Action Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 bg-slate-50">
              <div className="pr-0 md:pr-4 flex items-center justify-between">
                <button
                  onClick={() => onNavigateUniversity(uniA.slug)}
                  className="font-semibold text-emerald-800 hover:underline text-xs"
                >
                  View {uniA.short_name || 'University'} Details →
                </button>
                <a
                  href={uniA.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                >
                  <span>Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="pt-3 md:pt-0 pl-0 md:pl-6 flex items-center justify-between">
                <button
                  onClick={() => onNavigateUniversity(uniB.slug)}
                  className="font-semibold text-emerald-800 hover:underline text-xs"
                >
                  View {uniB.short_name || 'University'} Details →
                </button>
                <a
                  href={uniB.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                >
                  <span>Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
