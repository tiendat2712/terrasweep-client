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
      className={`rounded-[24px] bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      <div className={`p-5 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
