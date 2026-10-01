import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  Filter, 
  Search, 
  Star, 
  Users, 
  Zap, 
  Wifi, 
  Coffee, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/ads/AdSlot';
import { verifiedStudentHostels, StudentHostel } from '../data/hostelsData';

interface HostelsViewProps {
  onNavigateTab: (tab: string, slug?: string) => void;
}

export const HostelsView: React.FC<HostelsViewProps> = ({ onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');
  const [maxRent, setMaxRent] = useState<number>(35000);

  const filteredHostels = useMemo(() => {
    return verifiedStudentHostels.filter((hostel) => {
      // City filter
      if (selectedCity !== 'all' && hostel.city !== selectedCity) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'all' && hostel.gender !== selectedGender) {
        return false;
      }
      // Rent filter
      if (hostel.monthly_rent_min > maxRent) {
        return false;
      }
      // Room type filter
      if (selectedRoomType !== 'all' && !hostel.room_types.includes(selectedRoomType as any)) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = hostel.name.toLowerCase().includes(q);
        const matchesArea = hostel.area.toLowerCase().includes(q);
        const matchesUni = hostel.target_universities.some((u) => u.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesUni) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCity, selectedGender, selectedRoomType, maxRent]);

  const cities = ['all', 'Islamabad', 'Lahore', 'Karachi', 'Peshawar'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', onClick: () => onNavigateTab('home') },
            { label: 'Student Hostels & Accommodation' }
          ]}
        />
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="h-3.5 w-3.5" />
              Verified Outstation Student Housing
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              University Hostels & Student Accommodation Directory
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Safe, vetted private and university-partnered student hostels near <strong>NUST H-12</strong>, <strong>FAST Islamabad & Lahore</strong>, <strong>COMSATS</strong>, <strong>UET Lahore</strong>, and <strong>NED Karachi</strong> with verified rent, mess menus, and generator backup.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              Showing <strong>{filteredHostels.length}</strong> verified residences
            </span>
          </div>
        </div>
      </div>

      {/* Safety Advisory Banner for Outstation Students */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Student Verification Guarantee: </span>
            <span>All listings include physical inspection badges, security checks (CCTV/Guard), biometric logs, and official utility terms before publication. Never pay advance token money without visiting the premises.</span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-md border border-emerald-200">
          <span>Zero Commission Required</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university (e.g. NUST, FAST) or sector..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
            >
              <option value="all">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Peshawar">Peshawar</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
            >
              <option value="all">All Genders</option>
              <option value="Boys">Boys Hostel Only</option>
              <option value="Girls">Girls Hostel Only</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="md:col-span-2">
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
            >
              <option value="all">All Room Types</option>
              <option value="Single Room">Single Room</option>
              <option value="2-Seater">2-Seater (Shared)</option>
              <option value="3-Seater">3-Seater (Budget)</option>
            </select>
          </div>

          {/* Max Rent Slider */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span>Max Rent:</span>
              <span className="font-bold text-emerald-800">PKR {maxRent.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="12000"
              max="35000"
              step="1000"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-500 text-[11px]">Quick University Hubs:</span>
          {['NUST H-12', 'FAST Islamabad', 'COMSATS Park Road', 'UET Lahore', 'NED Karachi'].map((hub) => (
            <button
              key={hub}
              onClick={() => setSearchQuery(hub.split(' ')[0])}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Near {hub}
            </button>
          ))}
          {(searchQuery || selectedCity !== 'all' || selectedGender !== 'all' || selectedRoomType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setSelectedGender('all');
                setSelectedRoomType('all');
                setMaxRent(35000);
              }}
              className="ml-auto text-[11px] text-rose-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHostels.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <Building2 className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No student hostels found matching your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your rent budget slider or clearing specific city/room filters to view available accommodations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setSelectedGender('all');
                setSelectedRoomType('all');
                setMaxRent(35000);
              }}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-emerald-800 text-xs font-semibold text-white hover:bg-emerald-900"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredHostels.map((hostel) => (
            <div
              key={hostel.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      hostel.gender === 'Girls'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {hostel.gender} Hostel
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {hostel.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{hostel.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({hostel.reviews_count} reviews)</span>
                  </div>
                </div>

                {/* Name & Location */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{hostel.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>{hostel.area}</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-800 mt-0.5">
                    📍 {hostel.distance_to_campus}
                  </div>
                </div>

                {/* Target Universities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hostel.target_universities.map((uni) => (
                    <span key={uni} className="px-2 py-0.5 rounded bg-emerald-50 text-[11px] font-medium text-emerald-900 border border-emerald-100">
                      Ideal for {uni}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {hostel.overview}
                </p>

                {/* Amenities Grid */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-2 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Included Amenities:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                    {hostel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Types & Curfew */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400">Available: </span>
                    <span className="font-semibold text-slate-800">{hostel.room_types.join(' • ')}</span>
                  </div>
                  {hostel.curfew_time && (
                    <div className="text-[11px] text-slate-500">
                      Curfew: <strong className="text-slate-700">{hostel.curfew_time}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Price & Direct Contact CTAs */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Monthly Rent:</div>
                  <div className="text-base font-extrabold text-slate-900">
                    PKR {hostel.monthly_rent_min.toLocaleString()} – {hostel.monthly_rent_max.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    {hostel.mess_included ? '✓ Mess & Food included' : 'Separate Mess available'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${hostel.whatsapp}?text=${encodeURIComponent(`Assalam o Alaikum, I found ${hostel.name} on Pakistan Student Hub. Is accommodation available for the upcoming semester?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-900 shadow-2xs transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                  <a
                    href={`tel:${hostel.phone}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    title={`Call ${hostel.name}`}
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-600" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Advice for Outstation Students */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-emerald-700" />
          5 Essential Tips for Pakistani Students Renting Hostels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="block text-slate-900 mb-1">1. Inspect Generator & UPS Limits</strong>
            Confirm whether the hostel generator runs lights and fans during daytime load shedding or only night hours.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="block text-slate-900 mb-1">2. Sample the Mess Food First</strong>
            Eat a test dinner before paying the full month fee. Inquire about Sunday meal timings and water filtration.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="block text-slate-900 mb-1">3. Check Security Deposit Refund Terms</strong>
            Ensure the security deposit refund policy is written on your stamped voucher with standard 15-day notice period.
          </div>
        </div>
      </div>

      <div className="pt-2">
        <AdSlot placement="footer" />
      </div>
    </div>
  );
};
