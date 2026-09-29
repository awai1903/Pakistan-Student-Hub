import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Course } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';

export const CoursesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState(false);

  const courses = dataStore.getCourses();

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      c.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesFree = !freeOnly || c.is_free;

    return matchesSearch && matchesCategory && matchesFree;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Courses' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Subsidized & Free Skill Courses for Pakistani Students
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          National skill-building programs backed by HEC (Coursera DLIEI), Ministry of IT & Telecom (DigiSkills.pk 2.0), and Cisco Networking Academy. Genuine certification tracks with zero scam links.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course title, provider, or technical discipline..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Domains</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI">AI & Data Science</option>
              <option value="Freelancing">Freelancing & Marketing</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
              className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 h-4 w-4"
            />
            <span className="font-medium">100% Free Only</span>
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.map((crs) => (
          <div
            key={crs.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className={`font-semibold px-2 py-0.5 rounded ${
                  crs.is_free ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {crs.is_free ? '100% Free' : 'Subsidized License'}
                </span>
                <span>Level: {crs.level}</span>
              </div>

              <h2 className="font-display text-base font-bold text-slate-900 line-clamp-2">
                {crs.course_name}
              </h2>

              <p className="mt-1 text-xs font-semibold text-emerald-900">
                Provided by {crs.provider}
              </p>

              <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {crs.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div>Duration: <strong className="text-slate-800">{crs.duration}</strong></div>
                {crs.fee_info && (
                  <div>Fee Info: <span className="text-slate-700">{crs.fee_info}</span></div>
                )}
                <div>
                  Certificate: <strong className="text-slate-800">{crs.certificate_available ? 'Official Certificate Included' : 'No Certificate'}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={crs.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-800 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 shadow-2xs transition-colors"
              >
                <span>Enroll on Official Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <div className="mt-3">
                <VerificationBadge
                  status={crs.verification_status}
                  sourceName={crs.source_name}
                  sourceUrl={crs.source_url}
                  lastVerifiedAt={crs.last_verified_at}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
