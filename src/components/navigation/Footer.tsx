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
                <button onClick={() => onNavigateTab('universities')} className="hover:text-emerald-800 transition-colors">
                  Universities Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('admissions')} className="hover:text-emerald-800 transition-colors">
                  Admissions Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('scholarships')} className="hover:text-emerald-800 transition-colors">
                  Scholarships & Aid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('entry-tests')} className="hover:text-emerald-800 transition-colors">
                  Entry Tests (MDCAT/ECAT)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('compare')} className="hover:text-emerald-800 transition-colors">
                  Compare Universities
                </button>
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
                <button onClick={() => onNavigateTab('internships')} className="hover:text-emerald-800 transition-colors">
                  Student Internships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('jobs')} className="hover:text-emerald-800 transition-colors">
                  Graduate Trainee Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('courses')} className="hover:text-emerald-800 transition-colors">
                  Free Online Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-emerald-800 transition-colors">
                  Past Papers & Syllabi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('news')} className="hover:text-emerald-800 transition-colors">
                  Education News & Gazette
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Admin */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Platform & Integrity
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('deadlines')} className="hover:text-emerald-800 transition-colors">
                  Closing Deadlines Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('reviews')} className="text-emerald-800 font-semibold hover:text-emerald-950 transition-colors flex items-center gap-1.5">
                  <span>Reviews & Feature Requests</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] text-emerald-800 font-bold">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-emerald-800 transition-colors">
                  Student Saved Items
                </button>
              </li>
              <li className="text-slate-400">
                Contact: <span className="text-slate-600">{siteSettings.contact_email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Pakistan Student Hub. Independent academic directory and verification engine.</p>
          <div className="flex items-center gap-4">
            <span>Fair-Use Education Information Policy</span>
            <span aria-hidden="true">·</span>
            <span>Non-Affiliated with Commercial Coaching Academies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
