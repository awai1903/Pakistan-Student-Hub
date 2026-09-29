import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';

interface AdsterraResponsiveBannerProps {
  className?: string;
  label?: string;
}

export const AdsterraResponsiveBanner: React.FC<AdsterraResponsiveBannerProps> = ({
  className = '',
  label = 'Sponsored Advertisement'
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Desktop Leaderboard: 728x90 (hidden on screens smaller than md) */}
      <div className="hidden md:block">
        <AdsterraBanner format="728x90" label={label} />
      </div>

      {/* Tablet Banner: 468x60 (visible on sm to md screens) */}
      <div className="hidden sm:block md:hidden">
        <AdsterraBanner format="468x60" label={label} />
      </div>

      {/* Mobile Banner: 320x50 (visible on mobile screens < sm) */}
      <div className="block sm:hidden">
        <AdsterraBanner format="320x50" label={label} />
      </div>
    </div>
  );
};
