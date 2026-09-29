import React from 'react';
import { dataStore } from '../../lib/dataStore';

interface AdSlotProps {
  placement: 'header' | 'sidebar' | 'in_feed' | 'footer';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const adSettings = dataStore.getAdSettings();

  if (!adSettings.enabled) return null;

  // Check specific placement enabled state
  if (placement === 'header' && !adSettings.header_banner) return null;
  if (placement === 'sidebar' && !adSettings.sidebar_ad) return null;
  if (placement === 'in_feed' && !adSettings.in_feed_ad) return null;
  if (placement === 'footer' && !adSettings.footer_banner) return null;

  const visibilityClasses = `${
    adSettings.show_on_mobile ? 'block' : 'hidden'
  } ${adSettings.show_on_desktop ? 'md:block' : 'md:hidden'}`;

  return (
    <div
      className={`my-6 rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3 text-center ${visibilityClasses} ${className}`}
      aria-label="Advertisement container"
    >
      <div className="flex items-center justify-between pb-1.5 px-2 text-[11px] font-medium text-slate-400">
        <span className="uppercase tracking-wider">Sponsored Partner Advertisement</span>
        <span>Adsterra Verified Network</span>
      </div>

      <div className="flex min-h-[90px] items-center justify-center rounded border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-xs">
        {placement === 'sidebar' ? (
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold text-slate-700">Student Study Grants & EdTech Gear</span>
            <span className="text-[11px] text-slate-400">Partner promotion for verified college students in Pakistan</span>
            <span className="mt-2 inline-block rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
              Official Partner Ad
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="text-left">
              <p className="font-semibold text-slate-800">Laptops & Student Broadband Connectivity Bundles</p>
              <p className="text-[11px] text-slate-500">Government & university subsidized student schemes across Pakistan</p>
            </div>
            <span className="shrink-0 rounded bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-slate-800">
              Learn More
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
