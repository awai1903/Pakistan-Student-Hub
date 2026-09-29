import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import { AdsterraResponsiveBanner } from './AdsterraResponsiveBanner';
import { AdsterraNativeBanner } from './AdsterraNativeBanner';
import { AdsterraSmartlink } from './AdsterraSmartlink';

export type AdSlotPlacement = 
  | 'header' 
  | 'sidebar' 
  | 'in_feed' 
  | 'footer'
  | 'rectangle_300x250'
  | 'skyscraper_160x600'
  | 'skyscraper_160x300'
  | 'banner_728x90'
  | 'banner_468x60'
  | 'banner_320x50'
  | 'native'
  | 'smartlink_card';

interface AdSlotProps {
  placement: AdSlotPlacement;
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ 
  placement, 
  className = '',
  label
}) => {
  switch (placement) {
    case 'header':
    case 'footer':
    case 'banner_728x90':
      return <AdsterraResponsiveBanner className={className} label={label} />;

    case 'sidebar':
    case 'rectangle_300x250':
      return <AdsterraBanner format="300x250" className={className} label={label} />;

    case 'skyscraper_160x600':
      return <AdsterraBanner format="160x600" className={className} label={label} />;

    case 'skyscraper_160x300':
      return <AdsterraBanner format="160x300" className={className} label={label} />;

    case 'banner_468x60':
      return <AdsterraBanner format="468x60" className={className} label={label} />;

    case 'banner_320x50':
      return <AdsterraBanner format="320x50" className={className} label={label} />;

    case 'in_feed':
    case 'native':
      return <AdsterraNativeBanner className={className} label={label} />;

    case 'smartlink_card':
      return <AdsterraSmartlink variant="card" className={className} />;

    default:
      return <AdsterraResponsiveBanner className={className} label={label} />;
  }
};
