import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { dataStore } from '../../lib/dataStore';

interface FooterProps {
  onNavigateTab: (tab: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const siteSettings = dataStore.getSiteSettings();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-base shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                Pakistan Student Hub
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs max-w-sm">
              {siteSettings.footer_text}
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Ground-truthed with official HEC, PMDC & PEC portals</span>
            </div>
          </div>

          {/* Col 3: Academic Directories */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Directories
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="/universities"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('universities'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Universities Directory
                </a>
              </li>
              <li>
                <a
                  href="/admissions"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('admissions'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Admissions Calendar
                </a>
              </li>
              <li>
                <a
                  href="/scholarships"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('scholarships'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Scholarships & Aid
                </a>
              </li>
              <li>
                <a
                  href="/entry-tests"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('entry-tests'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Entry Tests (MDCAT/ECAT)
                </a>
              </li>
              <li>
                <a
                  href="/compare"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('compare'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Compare Universities
                </a>
              </li>
              <li>
                <a
                  href="/calculator"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('calculator'); }}
                  className="hover:text-emerald-800 transition-colors font-medium text-emerald-700"
                >
                  Merit Calculator (MDCAT/NET/ECAT)
                </a>
              </li>
              <li>
                <a
                  href="/hostels"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('hostels'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Student Hostels & Accommodation
                </a>
              </li>
              <li>
                <a
                  href="/quiz"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('quiz'); }}
                  className="hover:text-emerald-800 transition-colors font-medium text-emerald-700"
                >
                  Entry Test MCQs Quiz (MDCAT/ECAT)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Career & Skills */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Opportunities
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="/internships"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('internships'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Student Internships
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('jobs'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Graduate Trainee Jobs
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('courses'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Free Online Courses
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('resources'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Past Papers & Syllabi
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('news'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Education News & Gazette
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Legal */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Platform & Integrity
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="/deadlines"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('deadlines'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Closing Deadlines Center
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('reviews'); }}
                  className="text-emerald-800 font-semibold hover:text-emerald-950 transition-colors flex items-center gap-1.5"
                >
                  <span>Reviews & Ideas</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] text-emerald-800 font-bold">New</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('about'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  About Us & Verification
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('contact'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Contact Support Desk
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('dashboard'); }}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Student Saved Items
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Pakistan Student Hub. Independent academic directory and verification engine.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/privacy-policy"
              onClick={(e) => { e.preventDefault(); onNavigateTab('privacy-policy'); }}
              className="hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/terms"
              onClick={(e) => { e.preventDefault(); onNavigateTab('terms'); }}
              className="hover:text-slate-600 transition-colors"
            >
              Terms of Service
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/disclaimer"
              onClick={(e) => { e.preventDefault(); onNavigateTab('disclaimer'); }}
              className="hover:text-slate-600 transition-colors"
            >
              Fair-Use Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
