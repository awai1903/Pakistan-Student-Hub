import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Bookmark, 
  ChevronRight 
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Province } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/ads/AdSlot';

interface UniversitiesViewProps {
  onSelectUniversity: (slug: string) => void;
  onNavigateHome: () => void;
}

export const UniversitiesView: React.FC<UniversitiesViewProps> = ({
  onSelectUniversity
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const universities = dataStore.getUniversities();

  const provinces: Province[] = [
    'Islamabad Capital Territory',
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Azad Jammu and Kashmir',
    'Gilgit-Baltistan'
  ];

  const cities = useMemo(() => {
    const set = new Set<string>();
    universities.forEach((u) => set.add(u.city));
    return Array.from(set).sort();
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        searchQuery === '' ||
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.short_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.programs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProvince =
        selectedProvince === 'all' || uni.province === selectedProvince;
      const matchesCity =
        selectedCity === 'all' || uni.city === selectedCity;
      const matchesSector =
        selectedSector === 'all' || uni.sector === selectedSector;
      const matchesType =
        selectedType === 'all' ||
        uni.university_type.toLowerCase().includes(selectedType.toLowerCase());

      return matchesSearch && matchesProvince && matchesCity && matchesSector && matchesType;
    });
  }, [universities, searchQuery, selectedProvince, selectedCity, selectedSector, selectedType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('all');
    setSelectedCity('all');
    setSelectedSector('all');
    setSelectedType('all');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Universities' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Pakistan Universities Directory
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
          Complete, verified roster of HEC-recognized public and private higher education institutions across all provinces. Includes official admission criteria, fee estimates, and degree programs.
        </p>
      </div>

      <AdSlot placement="header" />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, short name, or program..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Provinces / Territories</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Sectors</option>
              <option value="Public">Public (Government)</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-center">
            <button
              onClick={handleResetFilters}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Quick categories:</span>
          {['all', 'Engineering', 'Medical', 'Computing', 'General'].map((typeKey) => (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedType === typeKey
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {typeKey === 'all' ? 'All Fields' : typeKey}
            </button>
          ))}
          <span className="ml-auto text-slate-400 tabular-nums">
            Showing {filteredUniversities.length} of {universities.length} universities
          </span>
        </div>
      </div>

      {/* Grid of Universities */}
      {filteredUniversities.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No universities match your criteria</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing the province filter, or resetting all search options.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => {
            const isSaved = dataStore.isItemSaved(uni.id);
            return (
              <div
                key={uni.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={uni.cover_image}
                      alt={uni.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 rounded bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-xs font-semibold text-slate-800 shadow-xs">
                      {uni.sector} Sector
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dataStore.toggleSaveItem({
                          item_type: 'university',
                          item_id: uni.id,
                          title: uni.name,
                          subtitle: `${uni.city} · ${uni.sector}`
                        });
                      }}
                      className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-xs p-1.5 text-slate-700 hover:text-emerald-800 shadow-xs transition-colors"
                      title={isSaved ? 'Remove Bookmark' : 'Save University'}
                      aria-label="Save University"
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{uni.city}, {uni.province}</span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="tabular-nums">Est. {uni.established_year}</span>
                    </div>
                    <h2
                      onClick={() => onSelectUniversity(uni.slug)}
                      className="font-display text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {uni.name} {uni.short_name ? `(${uni.short_name})` : ''}
                    </h2>
                    <div className="mt-1 text-xs font-medium text-emerald-800">
                      {uni.recognition_status}
                    </div>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {uni.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Featured Degrees
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                        {uni.programs.slice(0, 3).map((prog, i) => (
                          <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[11px]">
                            {prog}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="text-[11px] text-slate-400 self-center">
                            +{uni.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <VerificationBadge status={uni.verification_status} showLink={false} />
                  <button
                    onClick={() => onSelectUniversity(uni.slug)}
                    className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                  >
                    <span>Full Profile</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdSlot placement="native" label="Featured University Campuses & Higher Ed Programs" />
      <AdSlot placement="footer" />
    </div>
  );
};
