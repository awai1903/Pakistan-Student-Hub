import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Bookmark, 
  ChevronRight,
  ExternalLink,
  Navigation,
  Compass,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { Province, University } from '../types';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/ads/AdSlot';
import { 
  calculateDistanceKm, 
  formatDistance, 
  getUniversityCoordinates, 
  getCurrentUserLocation, 
  getClosestCity,
  PAKISTAN_CITIES,
  GeoCoordinates
} from '../lib/geoUtils';

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

  // Location-based Search States
  const [userLocation, setUserLocation] = useState<GeoCoordinates | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 means any distance
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);

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

  // Request browser GPS location
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    try {
      const coords = await getCurrentUserLocation();
      setUserLocation(coords);
      const closestCity = getClosestCity(coords.latitude, coords.longitude);
      setLocationName(`${closestCity.name} (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°)`);
      setSortByDistance(true);
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      setLocationError(err.message || 'Unable to access your GPS position. Please pick your city below.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Set manual city location
  const handleSelectCityLocation = (cityName: string) => {
    if (cityName === 'none') {
      setUserLocation(null);
      setLocationName('');
      setSortByDistance(false);
      return;
    }
    const city = PAKISTAN_CITIES[cityName];
    if (city) {
      setUserLocation({ latitude: city.latitude, longitude: city.longitude });
      setLocationName(city.name);
      setSortByDistance(true);
      setLocationError(null);
    }
  };

  const clearLocationFilter = () => {
    setUserLocation(null);
    setLocationName('');
    setMaxDistanceKm(0);
    setSortByDistance(false);
    setLocationError(null);
  };

  // Compute distance for each university and filter/sort
  const universitiesWithDistance = useMemo(() => {
    return universities.map((uni) => {
      const coords = getUniversityCoordinates(uni.slug, uni.city, uni.latitude, uni.longitude);
      let distanceKm: number | null = null;
      if (userLocation) {
        distanceKm = calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          coords.latitude,
          coords.longitude
        );
      }
      return {
        ...uni,
        calculatedCoords: coords,
        distanceKm
      };
    });
  }, [universities, userLocation]);

  const filteredUniversities = useMemo(() => {
    let result = universitiesWithDistance.filter((uni) => {
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

      const matchesDistance =
        maxDistanceKm === 0 ||
        (uni.distanceKm !== null && uni.distanceKm <= maxDistanceKm);

      return matchesSearch && matchesProvince && matchesCity && matchesSector && matchesType && matchesDistance;
    });

    if (sortByDistance && userLocation) {
      result.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return result;
  }, [
    universitiesWithDistance,
    searchQuery,
    selectedProvince,
    selectedCity,
    selectedSector,
    selectedType,
    maxDistanceKm,
    sortByDistance,
    userLocation
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('all');
    setSelectedCity('all');
    setSelectedSector('all');
    setSelectedType('all');
    clearLocationFilter();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Universities' }]} />

      <div className="border-b border-slate-200 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pakistan Universities Directory
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-3xl">
            Complete, verified roster of HEC-recognized public and private higher education institutions across all provinces. Search by name, programs, or find nearest universities to your current location.
          </p>
        </div>

        {/* Quick Result Counter */}
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-900">
          Showing {filteredUniversities.length} Universities
        </div>
      </div>

      <AdSlot placement="header" />

      {/* Location & GPS Proximity Finder Card */}
      <div className="rounded-xl border border-indigo-200 bg-linear-to-r from-indigo-50/70 via-white to-blue-50/70 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Find Nearest Universities by Location (مقام کے لحاظ سے قریبی یونیورسٹیز)
              </h2>
              <p className="text-xs text-slate-600">
                {userLocation ? (
                  <span className="text-indigo-800 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Active Location: {locationName}</span>
                  </span>
                ) : (
                  'Use your browser GPS or choose your Pakistani city to calculate exact distances.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!userLocation ? (
              <>
                <button
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className={`h-3.5 w-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Detecting GPS...' : 'Use My Current Location'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">or</span>
                  <select
                    onChange={(e) => handleSelectCityLocation(e.target.value)}
                    defaultValue=""
                    className="rounded-lg border border-slate-300 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="" disabled>Select your city...</option>
                    {Object.keys(PAKISTAN_CITIES).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="rounded-lg border border-indigo-300 bg-white py-1.5 px-3 text-xs font-medium text-indigo-900 focus:border-indigo-600 focus:outline-hidden shadow-2xs"
                >
                  <option value={0}>Any Distance</option>
                  <option value={15}>Within 15 km (Local)</option>
                  <option value={35}>Within 35 km (Metro Area)</option>
                  <option value={75}>Within 75 km</option>
                  <option value={150}>Within 150 km</option>
                  <option value={300}>Within 300 km</option>
                </select>

                <button
                  onClick={() => setSortByDistance(!sortByDistance)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    sortByDistance
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sortByDistance ? '✓ Sorted: Nearest First' : 'Sort Nearest First'}
                </button>

                <button
                  onClick={clearLocationFilter}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 font-medium transition-colors"
                  title="Clear location filter"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear Location</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {locationError && (
          <div className="mt-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
            ⚠️ {locationError}
          </div>
        )}
      </div>

      {/* Main Search and Advanced Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, short name (NUST, LUMS, FAST), program (CS, MBBS)..."
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
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500">Popular Focus:</span>
          {['Engineering', 'Medical', 'Computing', 'Business', 'General', 'Agriculture'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedType === type
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* University Directory Grid */}
      {filteredUniversities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-base font-bold text-slate-900">No Universities Found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            No higher education institutions match your active filters or radius criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => {
            const isSaved = dataStore.isItemSaved(uni.id);

            return (
              <div
                key={uni.id}
                onClick={() => onSelectUniversity(uni.slug)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  {/* Card Cover Header */}
                  <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={uni.cover_image}
                      alt={uni.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
                    
                    {/* Sector Badge */}
                    <span className={`absolute top-3 left-3 rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase shadow-xs ${
                      uni.sector === 'Public' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-amber-600 text-white'
                    }`}>
                      {uni.sector}
                    </span>

                    {/* Distance Badge if Location active */}
                    {uni.distanceKm !== null && (
                      <span className="absolute top-3 right-3 rounded-full bg-indigo-900/90 text-indigo-100 border border-indigo-400/40 px-2.5 py-0.5 text-[11px] font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                        <MapPin className="h-3 w-3 text-indigo-300" />
                        <span>{formatDistance(uni.distanceKm)} away</span>
                      </span>
                    )}

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold">{uni.city}, {uni.province}</span>
                      <span>Est. {uni.established_year}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {uni.name}
                        </h2>
                        {uni.short_name && (
                          <span className="text-xs font-semibold text-slate-500">
                            ({uni.short_name})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dataStore.toggleSaveItem({
                            item_id: uni.id,
                            item_type: 'university',
                            title: uni.name,
                            subtitle: `${uni.city} · ${uni.sector} Sector`
                          });
                        }}
                        className={`rounded-lg p-1.5 transition-colors ${
                          isSaved ? 'text-emerald-800 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save University'}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-emerald-800' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {uni.description}
                    </p>

                    {/* Key Degree Programs Highlights */}
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Offered Programs
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {uni.programs.slice(0, 3).map((prog, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            {prog}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                            +{uni.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="bg-slate-50/70 p-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <VerificationBadge status={uni.verification_status} showLink={false} />

                  <div className="flex items-center gap-2">
                    {/* Google Maps Directions */}
                    {uni.calculatedCoords && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${uni.calculatedCoords.latitude},${uni.calculatedCoords.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors"
                        title="Open in Google Maps"
                      >
                        <Navigation className="h-2.5 w-2.5 text-slate-500" />
                        <span>Map</span>
                      </a>
                    )}

                    {uni.admission_portal_url && (
                      <a
                        href={uni.admission_portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Open Online Admission Portal"
                      >
                        <span>Admission Portal</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}

                    <button
                      onClick={() => onSelectUniversity(uni.slug)}
                      className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
