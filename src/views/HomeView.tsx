import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  ExternalLink, 
  ChevronRight, 
  MapPin, 
  Clock,
  Navigation,
  Compass,
  X,
  Calculator,
  Award,
  Sparkles
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { AdSlot } from '../components/ads/AdSlot';
import { campusHeroImage } from '../data/verifiedSeedData';
import { 
  calculateDistanceKm, 
  formatDistance, 
  getUniversityCoordinates, 
  getCurrentUserLocation, 
  getClosestCity, 
  PAKISTAN_CITIES, 
  GeoCoordinates 
} from '../lib/geoUtils';

interface HomeViewProps {
  onNavigate: (tab: string, slug?: string) => void;
  openSearchModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, openSearchModal }) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [uniSearchQuery, setUniSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<GeoCoordinates | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const allUniversities = dataStore.getUniversities();
  const admissions = dataStore.getAdmissions().slice(0, 4);
  const scholarships = dataStore.getScholarships().slice(0, 4);
  const entryTests = dataStore.getEntryTests().slice(0, 4);
  const jobs = dataStore.getJobs().slice(0, 2);
  const internships = dataStore.getInternships().slice(0, 2);
  const news = dataStore.getNews().slice(0, 3);
  const upcomingDeadlines = dataStore.getUpcomingDeadlines().slice(0, 3);

  // Request browser GPS
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    try {
      const coords = await getCurrentUserLocation();
      setUserLocation(coords);
      const closestCity = getClosestCity(coords.latitude, coords.longitude);
      setLocationName(`${closestCity.name} (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°)`);
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      setLocationError(err.message || 'Unable to access GPS. Please pick your city from the dropdown below.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Choose Pakistani city manually
  const handleSelectCityLocation = (cityName: string) => {
    if (cityName === 'none') {
      setUserLocation(null);
      setLocationName('');
      return;
    }
    const city = PAKISTAN_CITIES[cityName];
    if (city) {
      setUserLocation({ latitude: city.latitude, longitude: city.longitude });
      setLocationName(city.name);
      setLocationError(null);
    }
  };

  const clearLocation = () => {
    setUserLocation(null);
    setLocationName('');
    setLocationError(null);
  };

  // Calculate distances & filter based on search
  const displayedUniversities = useMemo(() => {
    let list = allUniversities.map((uni) => {
      const coords = getUniversityCoordinates(uni.slug, uni.city, uni.latitude, uni.longitude);
      let dist: number | null = null;
      if (userLocation) {
        dist = calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          coords.latitude,
          coords.longitude
        );
      }
      return {
        ...uni,
        calculatedCoords: coords,
        distanceKm: dist
      };
    });

    if (uniSearchQuery.trim()) {
      const q = uniSearchQuery.toLowerCase();
      list = list.filter((uni) =>
        uni.name.toLowerCase().includes(q) ||
        uni.short_name?.toLowerCase().includes(q) ||
        uni.city.toLowerCase().includes(q) ||
        uni.province.toLowerCase().includes(q) ||
        uni.programs.some((p) => p.toLowerCase().includes(q))
      );
    }

    if (userLocation) {
      list.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return list.slice(0, 8);
  }, [allUniversities, userLocation, uniSearchQuery]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      openSearchModal();
    }
  };

  const calculateDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                <span>Verified Pakistani Education Registry · HEC & Government Portals</span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl" style={{ textWrap: 'balance' }}>
                Everything Pakistani Students Need in One Place
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Explore strictly verified university admissions, HEC need-based & international scholarships, entry test schedules (MDCAT, ECAT, NET), past papers, and genuine student job opportunities across Pakistan.
              </p>

              {/* Global Search Bar */}
              <div className="pt-2">
                <form 
                  onSubmit={handleHeroSearchSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-2 max-w-xl"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={quickSearch}
                      onChange={(e) => setQuickSearch(e.target.value)}
                      placeholder="Search universities, scholarships, admissions, tests..."
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                      onClick={openSearchModal}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={openSearchModal}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors whitespace-nowrap"
                  >
                    <span>Search Hub</span>
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </button>
                </form>

                {/* Popular Keywords */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Quick explore:</span>
                  <button onClick={() => onNavigate('scholarships')} className="hover:text-emerald-800 transition-colors font-medium text-indigo-700">♿ Disability Quota</button>
                  <span aria-hidden="true">·</span>
                  <button onClick={() => onNavigate('scholarships')} className="hover:text-emerald-800 transition-colors font-medium text-pink-700">👩 Scottish Girls Scholarships</button>
                  <span aria-hidden="true">·</span>
                  <button onClick={() => onNavigate('scholarships')} className="hover:text-emerald-800 transition-colors font-medium text-amber-700">🏆 Talent Hunt</button>
                  <span aria-hidden="true">·</span>
                  <button onClick={() => onNavigate('admissions')} className="hover:text-emerald-800 transition-colors">Fall 2026 Admissions</button>
                  <span aria-hidden="true">·</span>
                  <button onClick={() => onNavigate('universities')} className="hover:text-emerald-800 transition-colors font-medium text-emerald-800">All Pakistan Universities</button>
                </div>
              </div>

              {/* Factual Stats Proof Bar */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-slate-700">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">100%</div>
                  <div className="text-xs text-slate-500">Official Sources</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">PKR 0</div>
                  <div className="text-xs text-slate-500">Free Open Access</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">48h</div>
                  <div className="text-xs text-slate-500">Verification Cycle</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                <img
                  src={campusHeroImage}
                  alt="Pakistani university campus quad with students walking in natural morning sunlight"
                  className="h-80 w-full object-cover lg:h-[420px]"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="text-xs font-medium text-emerald-300">National Education Repository</div>
                  <p className="font-display text-lg font-bold text-white mt-0.5">Empowering Pakistan&apos;s Next Generation of Scholars</p>
                  <p className="text-xs text-slate-200 mt-1">Ground-truthed with HEC, PMDC, PEC, and provincial educational directorates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CRITICAL DEADLINE TICKER BANNER */}
      {upcomingDeadlines.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-700 shrink-0" />
                <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  Verified Opportunities Closing Soon
                </h2>
              </div>
              <button
                onClick={() => onNavigate('deadlines')}
                className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 flex items-center gap-1"
              >
                <span>View All Deadlines Calendar</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-amber-200/80 bg-white p-3.5 shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {item.category}
                    </span>
                    <span className="tabular-nums text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                      Closing in {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 tabular-nums">Deadline: {item.dateStr}</span>
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AD SLOT: Header Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="header" />
      </div>

      {/* FEATURE SPOTLIGHT: PAKISTANI AGGREGATE & MERIT CALCULATOR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-emerald-700/20 bg-linear-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Calculator className="h-44 w-44 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              New Student Tool: 2026 Admissions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pakistani University Aggregate & Merit Calculator
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Calculate your exact merit percentage for <strong>MDCAT (MBBS/BDS)</strong>, <strong>NUST NET</strong>, <strong>UET ECAT</strong>, <strong>FAST-NUCES</strong>, and <strong>COMSATS</strong>. Instantly see which universities and programs match your score against previous closing merits.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-emerald-200">
              <span className="bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50">PMDC 10-40-50</span>
              <span className="bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50">NUST 10-15-75</span>
              <span className="bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50">UET 25-45-30</span>
              <span className="bg-emerald-900/80 px-2.5 py-1 rounded-md border border-emerald-700/50">FAST 50-50</span>
            </div>
          </div>
          <div className="relative z-10 shrink-0">
            <button
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition-all shadow-md hover:scale-102 cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-emerald-800" />
              <span>Calculate My Aggregate</span>
              <ArrowRight className="h-4 w-4 text-emerald-800" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. LATEST ADMISSIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Latest Admissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified undergraduate & postgraduate admissions with direct official application portals.</p>
          </div>
          <button
            onClick={() => onNavigate('admissions')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Admissions</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {admissions.map((adm) => {
            const days = calculateDaysRemaining(adm.closing_date);
            return (
              <div
                key={adm.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-800">{adm.admission_type}</span>
                    {days > 0 ? (
                      <span className="tabular-nums font-medium text-amber-700">
                        Closing in {days} {days === 1 ? 'day' : 'days'}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Closed</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {adm.university_name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {adm.program_name}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div>Campus: <span className="text-slate-700">{adm.campus}</span></div>
                    <div>Application Fee: <span className="text-slate-700">{adm.application_fee}</span></div>
                    <div className="tabular-nums">Deadline: <span className="font-medium text-slate-800">{adm.closing_date}</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <VerificationBadge status={adm.verification_status} showLink={false} />
                  <a
                    href={adm.official_application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Apply Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SCHOLARSHIPS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Scholarships & Financial Aid</h2>
            <p className="text-xs text-slate-500 mt-0.5">Government of Pakistan, HEC need-based, and verified bilateral international opportunities.</p>
          </div>
          <button
            onClick={() => onNavigate('scholarships')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Browse All Scholarships</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map((sch) => (
            <div
              key={sch.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-1 gap-1">
                  <div className="flex items-center gap-1.5">
                    <span>{sch.study_level}</span>
                    {sch.category_tag && (
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] border border-indigo-100">
                        {sch.category_tag}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-emerald-800">{sch.funding_type}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {sch.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  Provided by {sch.provider}
                </p>
                {sch.target_quota && (
                  <div className="mt-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded inline-block">
                    🎯 Quota: {sch.target_quota}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                  {sch.description}
                </p>
                <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">Financial Benefits:</div>
                  <p className="text-slate-600 mt-0.5">{sch.financial_benefits}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 tabular-nums">
                  Deadline: <strong className="text-slate-800">{sch.deadline}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('scholarship-detail', sch.slug)}
                    className="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    Details
                  </button>
                  <a
                    href={sch.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Official Application</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AD SLOT: In-Feed */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="in_feed" />
      </div>

      {/* 5. UPCOMING ENTRY TESTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Upcoming Entry Tests</h2>
            <p className="text-xs text-slate-500 mt-0.5">National standardized admission assessments: MDCAT, ECAT, NET, NAT, GAT.</p>
          </div>
          <button
            onClick={() => onNavigate('entry-tests')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Tests</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entryTests.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Organized by {t.organizer}
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {t.test_name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {t.registration_info}
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  {t.next_test_date && (
                    <div>Test Date: <strong className="text-slate-900 tabular-nums">{t.next_test_date}</strong></div>
                  )}
                  {t.registration_deadline && (
                    <div>Reg. Deadline: <span className="text-slate-700 tabular-nums">{t.registration_deadline}</span></div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigate('entry-tests', t.slug)}
                  className="font-medium text-slate-700 hover:text-slate-900"
                >
                  Syllabus & Pattern
                </button>
                <a
                  href={t.official_registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  <span>Register</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADSTERRA ROW: 300x250 + Smartlink Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <AdSlot placement="rectangle_300x250" label="Sponsored Higher Education Offers" />
          <AdSlot placement="smartlink_card" />
        </div>
      </section>

      {/* 6. POPULAR & NEAREST UNIVERSITIES BY LOCATION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              HEC Recognized Universities & Nearest Campuses
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Search by name/program or find institutions closest to your location across all provinces.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('universities')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Explore All {allUniversities.length} Universities</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Location & Quick Search Filter Bar */}
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/70 p-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={uniSearchQuery}
                onChange={(e) => setUniSearchQuery(e.target.value)}
                placeholder="Search university by name, short code (NUST, LUMS, FAST), city or program..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-hidden"
              />
              {uniSearchQuery && (
                <button
                  onClick={() => setUniSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* GPS or City Picker */}
            <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-2">
              {!userLocation ? (
                <>
                  <button
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Navigation className={`h-3.5 w-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>{isDetectingLocation ? 'Locating...' : 'Use My GPS Location'}</span>
                  </button>

                  <select
                    onChange={(e) => handleSelectCityLocation(e.target.value)}
                    defaultValue=""
                    className="rounded-lg border border-slate-300 bg-white py-1.5 px-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="" disabled>Or choose city...</option>
                    {Object.keys(PAKISTAN_CITIES).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 border border-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-indigo-700" />
                    <span>Near: {locationName}</span>
                  </div>
                  <button
                    onClick={clearLocation}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 font-medium transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {locationError && (
            <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
              ⚠️ {locationError}
            </div>
          )}
        </div>

        {/* University Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedUniversities.map((uni) => (
            <div
              key={uni.id}
              onClick={() => onNavigate('university-detail', uni.slug)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={uni.cover_image}
                    alt={uni.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                    {uni.sector}
                  </div>

                  {uni.distanceKm !== null && (
                    <div className="absolute top-2.5 right-2.5 rounded-full bg-indigo-950/90 text-indigo-100 border border-indigo-400/50 px-2 py-0.5 text-[11px] font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                      <MapPin className="h-3 w-3 text-indigo-300" />
                      <span>{formatDistance(uni.distanceKm)} away</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{uni.city}, {uni.province}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {uni.name} {uni.short_name ? `(${uni.short_name})` : ''}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                    {uni.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {uni.programs.slice(0, 2).map((prog, idx) => (
                      <span key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {prog}
                      </span>
                    ))}
                    {uni.programs.length > 2 && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-400">
                        +{uni.programs.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {uni.admission_portal_url ? (
                    <a
                      href={uni.admission_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950"
                      title="Online Admission Portal"
                    >
                      <span>Apply Online</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 tabular-nums">Est. {uni.established_year}</span>
                  )}

                  <button
                    onClick={() => onNavigate('university-detail', uni.slug)}
                    className="font-medium text-emerald-800 hover:underline flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CAREERS & INTERNSHIPS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Internships Column */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">Student Internships</h2>
              <button
                onClick={() => onNavigate('internships')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                All Internships →
              </button>
            </div>
            <div className="space-y-3">
              {internships.map((intern) => (
                <div key={intern.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{intern.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span>{intern.company}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span>{intern.location}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="font-medium text-emerald-800">{intern.is_paid ? 'Paid' : 'Unpaid'}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">Deadline: {intern.deadline}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-600">Stipend: <strong className="text-slate-800">{intern.stipend || 'Competitive'}</strong></span>
                    <a
                      href={intern.official_application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Jobs Column */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">Graduate & Entry Jobs</h2>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
              >
                All Jobs →
              </button>
            </div>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{job.job_title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span>{job.company}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span>{job.location} ({job.remote_type})</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span>{job.job_type}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">Apply by: {job.closing_date}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-600">Compensation: <strong className="text-slate-800">{job.salary}</strong></span>
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      <span>Careers Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. LATEST EDUCATION NEWS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Education News & Official Circulars</h2>
            <p className="text-xs text-slate-500 mt-0.5">Factual policy updates, examination announcements, and higher education notifications.</p>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>All News</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-emerald-800">{item.category}</span>
                  <span className="tabular-nums">{item.publication_date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {item.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Source: <strong className="text-slate-800">{item.source_name}</strong></span>
                <button
                  onClick={() => onNavigate('news-detail', item.slug)}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  Read Summary →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AD SLOT: Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="footer" />
      </div>
    </div>
  );
};
