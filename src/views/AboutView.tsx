import React, { useEffect } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Building2 
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updatePageSeo } from '../lib/seo';
import { AdSlot } from '../components/ads/AdSlot';

interface AboutViewProps {
  onNavigateTab: (tab: string, slug?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'About Us - Pakistan Student Hub',
      description: 'Learn about Pakistan Student Hub, our verification methodology, ground-truthed academic sources, and mission to empower Pakistani students.',
      canonicalPath: '/about'
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'About Us' }
        ]}
      />

      {/* Hero Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              About Pakistan Student Hub
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Independent academic directory and admission countdown verification engine for Pakistani students.
            </p>
          </div>
        </div>
      </div>

      {/* Core Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Verified Factual Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every closing date, merit criterion, fee structure, and syllabus is verified directly against official gazettes of HEC, PMDC, PEC, and university admissions directorates.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Equal Opportunity Access</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            From federal HEC scholarships to provincial quotas in Balochistan, KPK, Sindh, Punjab, AJK, and Gilgit-Baltistan, we bring legitimate opportunities to every student.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">Zero Commercial Bias</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We are completely independent. We do not sell admission seats, charge student application fees, or operate commercial coaching academies.
          </p>
        </div>
      </div>

      {/* Editorial & Verification Methodology */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Our Verification Methodology
        </h2>
        <div className="prose prose-slate text-xs text-slate-600 leading-relaxed space-y-4 max-w-none">
          <p>
            Higher education in Pakistan is dynamic, with hundreds of universities issuing admission circulars and revising deadlines across Spring, Summer, and Fall intake cycles. Pakistan Student Hub was created to resolve the fragmented, outdated, and misleading information that often causes students to miss critical application windows.
          </p>
          <p>
            Our dedicated academic research team and autonomous verification engine cross-reference official university registrars, HEC notifications, PMDC MDCAT directives, and foreign scholarship commissions (such as the British Council, Turkish Government, CSC China, and Fulbright USEFP).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>Direct linking to official university portals (never unverified third-party forms).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>Accurate countdown timers aligned with Pakistan Standard Time (PKT).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>Full coverage of specialized quotas (differently-abled, women in STEM, rural areas).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>Objective side-by-side institutional comparisons without artificial commercial scores.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ready to explore verified opportunities?</h3>
          <p className="text-xs text-slate-500">Discover currently open admissions, scholarships, and entrance exams across Pakistan.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('universities')}
            className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
          >
            Explore Universities
          </button>
          <button
            onClick={() => onNavigateTab('scholarships')}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Find Scholarships
          </button>
        </div>
      </div>

      <AdSlot placement="footer" />
    </div>
  );
};
