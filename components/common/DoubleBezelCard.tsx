import React from 'react';

interface DoubleBezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glow?: 'none' | 'amber' | 'cyan' | 'violet';
  onClick?: () => void;
}

export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  title,
  subtitle,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[24px] ocean-surface border border-sky-100/90 shadow-sm hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 overflow-hidden relative ambient-glow-sky ${className}`}
    >
      <div className={`p-5 relative z-10 ${innerClassName}`}>
        {title && (
          <div className="mb-5 flex items-start gap-3 border-b border-sky-100 pb-4">
            {icon && <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">{icon}</span>}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              {subtitle && <p className="mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
