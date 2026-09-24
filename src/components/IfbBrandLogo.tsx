import React from 'react';

interface IfbBrandLogoProps {
  variant?: 'full' | 'mark' | 'badge';
  color?: string;
  className?: string;
  height?: number | string;
  theme?: 'dark' | 'light';
}

/**
 * Official IFB Automotive Pvt Ltd Brand Asset Component
 * Uses the uploaded official IFB logo, mark, and alpha assets.
 */
export const IfbBrandLogo: React.FC<IfbBrandLogoProps> = ({
  variant = 'mark',
  className = '',
  height,
  theme = 'light'
}) => {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <img
          src="/ifb-logo.png"
          alt="IFB Automotive Pvt Ltd"
          className="h-auto object-contain max-w-full"
          style={{ height: height || 54 }}
          onError={(e) => {
            // Fallback to SVG if needed
            (e.currentTarget as HTMLImageElement).src = '/ifb-logo.svg';
          }}
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-white border border-[#E9EDEF] shadow-2xs flex items-center justify-center p-1.5 flex-shrink-0 select-none overflow-hidden ${className}`}
      >
        <img
          src="/ifb-logo-mark-alpha.png"
          alt="IFB Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/ifb-logo-mark-alpha.svg';
          }}
        />
      </div>
    );
  }

  // Variant: mark (standalone IFB logo mark)
  const logoSrc =
    theme === 'dark' ? '/ifb-logo-mark-alpha.png' : '/ifb-logo-mark.png';

  return (
    <img
      src={logoSrc}
      alt="IFB Logomark"
      className={`object-contain select-none ${
        theme === 'dark' ? 'invert opacity-90' : ''
      } ${className}`}
      style={{ height: height || 28 }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/ifb-logo-mark.svg';
      }}
    />
  );
};
