import React from 'react';
import { ExternalLink, Sparkles, Award } from 'lucide-react';

export const ADSTERRA_SMARTLINK_URL = 'https://chocolatefloweryron.com/egdrv9zhh1?key=93669e5cff831045c4bbdd4e1f9b0892';

interface SmartlinkProps {
  className?: string;
  variant?: 'top-banner' | 'card' | 'badge';
  title?: string;
}

export const AdsterraSmartlink: React.FC<SmartlinkProps> = ({
  className = '',
  variant = 'top-banner',
  title
}) => {
  if (variant === 'top-banner') {
    return (
      <aside aria-label="Sponsored Partner Notification" className={`w-full bg-linear-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white py-2 px-4 text-xs shadow-xs ${className}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              <Sparkles className="h-3 w-3" />
            </span>
            <p className="font-medium text-slate-100">
              {title || 'Exclusive Higher Education Grants, Study Abroad Offers & Student Bundles'}
            </p>
          </div>

          <a
            href={ADSTERRA_SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1 font-semibold text-slate-950 text-[11px] hover:bg-emerald-300 transition-colors shadow-2xs shrink-0"
          >
            <span>Explore Opportunities</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </aside>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50/40 p-5 shadow-2xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-xs">
            <Award className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Sponsored Partner
              </span>
              <span className="text-[11px] text-slate-500">Adsterra Smartlink</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              {title || 'International Scholarships, Study Visas & Higher Education Grants'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover fully-funded partner scholarships, student exchange fellowships, and education loan concessions available for Pakistani students.
            </p>

            <div className="pt-2">
              <a
                href={ADSTERRA_SMARTLINK_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
              >
                <span>View Direct Offers</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Badge / Button
  return (
    <a
      href={ADSTERRA_SMARTLINK_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 text-xs shadow-2xs transition-colors ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>{title || 'Sponsored Grants'}</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  );
};
