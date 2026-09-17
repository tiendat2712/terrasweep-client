import React from 'react';

interface DoubleBezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: 'none' | 'amber' | 'cyan' | 'violet';
  onClick?: () => void;
}

export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[24px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 overflow-hidden relative ambient-glow-sky ${className}`}
    >
      <div className={`p-5 relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
