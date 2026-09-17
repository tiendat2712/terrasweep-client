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

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0C0C0C]';
  const subtitleColor = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Seamless 3D Isometric Brand Logo */}
      <div className={`relative ${logoSize} flex items-center justify-center shrink-0 overflow-hidden`}>
        <img
          src="/images/brand-logo.webp"
          alt="TerraSweep Brand Logo"
          className="w-full h-full object-contain mix-blend-multiply scale-140 transition-transform duration-300 hover:scale-150"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`font-black ${textSize} ${textColor} tracking-tight`}>
            TerraSweep
          </span>
        </div>
        {(showSubtitle || subtitle) && (
          <span className={`text-[10px] ${subtitleColor} tracking-widest font-semibold uppercase font-mono`}>
            {subtitle || 'MINIMALIST LUXURY SYSTEM'}
          </span>
        )}
      </div>
    </div>
  );
};
