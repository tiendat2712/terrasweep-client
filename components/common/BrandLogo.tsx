import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  subtitle,
  theme = 'light',
}) => {
  const textSize =
    size === 'sm'
      ? 'text-lg tracking-tight'
      : size === 'lg'
      ? 'text-3xl sm:text-4xl tracking-tight'
      : 'text-2xl sm:text-[28px] tracking-tight';

  const logoSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10 sm:w-11 sm:h-11';

  const textColor = theme === 'dark' ? 'text-white' : 'text-foreground';
  const subtitleColor = theme === 'dark' ? 'text-sky-300' : 'text-sky-700';

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-default caret-transparent ${className}`}>
      {/* Seamless 3D Isometric Brand Logo with Ocean Glow Droplet Frame */}
      <div className={`relative ${logoSize} flex items-center justify-center shrink-0 overflow-hidden rounded-xl pointer-events-none select-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-100/80 shadow-2xs'}`}>
        <img
          src="/images/brand-logo.webp"
          alt="TerraSweep Brand Logo"
          draggable={false}
          className="w-full h-full object-contain mix-blend-multiply scale-140 transition-transform duration-300 pointer-events-none select-none"
        />
      </div>

      <div className="flex flex-col select-none caret-transparent">
        <div className="flex items-center select-none caret-transparent">
          {theme === 'dark' ? (
            <span className={`font-black ${textSize} text-white tracking-tight select-none caret-transparent`}>
              TerraSweep
            </span>
          ) : (
            <span className={`font-black ${textSize} tracking-tight select-none caret-transparent`}>
              <span className="text-slate-900 select-none">Terra</span>
              <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-700 bg-clip-text text-transparent select-none">Sweep</span>
            </span>
          )}
        </div>
        {(showSubtitle || subtitle) && (
          <span className={`text-[10px] ${subtitleColor} tracking-widest font-semibold uppercase font-mono select-none caret-transparent`}>
            {subtitle || 'MINIMALIST LUXURY SYSTEM'}
          </span>
        )}
      </div>
    </div>
  );
};
