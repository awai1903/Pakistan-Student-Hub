import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  className?: string;
  label?: string;
}

export const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({
  className = '',
  label = 'Recommended Opportunities & Partner Offers'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script already appended in this element
    const container = containerRef.current;
    container.innerHTML = '';

    const adDiv = document.createElement('div');
    adDiv.id = 'container-cfac7d816f5a4417f186a7d0140e8674';
    adDiv.style.minHeight = '140px';
    adDiv.style.width = '100%';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://chocolatefloweryron.com/cfac7d816f5a4417f186a7d0140e8674/invoke.js';

    container.appendChild(script);
    container.appendChild(adDiv);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={`my-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 text-[11px] font-medium text-slate-400">
        <span className="uppercase tracking-wider font-semibold text-slate-500">{label}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Adsterra Native</span>
      </div>

      <div ref={containerRef} className="w-full min-h-[140px] flex items-center justify-center overflow-hidden" />
    </div>
  );
};
