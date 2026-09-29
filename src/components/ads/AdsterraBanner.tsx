import React from 'react';

export type AdsterraFormat =
  | '728x90'
  | '468x60'
  | '300x250'
  | '160x600'
  | '160x300'
  | '320x50';

interface AdConfig {
  key: string;
  width: number;
  height: number;
}

const AD_CONFIGS: Record<AdsterraFormat, AdConfig> = {
  '728x90': {
    key: '6517d33e79341f53a28f816ae77ba72c',
    width: 728,
    height: 90
  },
  '468x60': {
    key: 'c6f0f095e5050161212b7f57e9e6a986',
    width: 468,
    height: 60
  },
  '300x250': {
    key: 'd14bf6c78a4d100dabbfa66c9cbc9f41',
    width: 300,
    height: 250
  },
  '160x600': {
    key: '4ae7bf2ef3df286ba37710009ebb76d7',
    width: 160,
    height: 600
  },
  '160x300': {
    key: 'cde83fa01379b5f3721cad25a4688d22',
    width: 160,
    height: 300
  },
  '320x50': {
    key: '8ae87bfd81554f5c95cf4b6f572ab036',
    width: 320,
    height: 50
  }
};

interface AdsterraBannerProps {
  format: AdsterraFormat;
  className?: string;
  label?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  format,
  className = '',
  label = 'Sponsored Advertisement'
}) => {
  const config = AD_CONFIGS[format];
  if (!config) return null;

  const { key, width, height } = config;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { 
            width: 100%; 
            height: 100%; 
            background: transparent; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${key}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://chocolatefloweryron.com/${key}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
      {label && (
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}
      <div 
        className="relative flex items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/50 p-1 shadow-2xs transition-all hover:border-slate-300"
        style={{ width: `${width + 10}px`, minHeight: `${height + 10}px`, maxWidth: '100%' }}
      >
        <iframe
          title={`Adsterra ${format}`}
          srcDoc={htmlContent}
          width={width}
          height={height}
          scrolling="no"
          frameBorder="0"
          style={{
            border: 'none',
            overflow: 'hidden',
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100%'
          }}
        />
      </div>
    </div>
  );
};
