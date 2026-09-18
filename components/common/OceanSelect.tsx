'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface OceanSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  group?: string;
}

export interface OceanSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: OceanSelectOption[];
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'rounded';
  icon?: React.ReactNode;
  disabled?: boolean;
  align?: 'left' | 'right';
  fullWidth?: boolean;
  id?: string;
  'aria-label'?: string;
}

export const OceanSelect: React.FC<OceanSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  menuClassName = '',
  size = 'md',
  variant = 'pill',
  icon,
  disabled = false,
  align = 'left',
  fullWidth = false,
  id,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placement: 'bottom' | 'top';
  }>({
    top: 0,
    left: 0,
    width: 0,
    placement: 'bottom',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Compute position relative to viewport
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const estimatedMenuHeight = Math.min(options.length * 42 + 20, 260);
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const placement: 'bottom' | 'top' =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';

    const menuWidth = Math.max(rect.width, 180);
    let left = align === 'right' ? rect.right - menuWidth : rect.left;

    // Boundary protections
    if (left + menuWidth > viewportWidth - 12) {
      left = viewportWidth - menuWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    const top = placement === 'bottom' ? rect.bottom + 6 : rect.top - 6;

    setCoords({
      top,
      left,
      width: menuWidth,
      placement,
    });
  }, [align, options.length]);

  const toggleOpen = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click or Escape, update on resize/scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  const isFullWidth = fullWidth || className.includes('w-full');
  const sizeClasses =
    size === 'sm'
      ? 'text-xs py-1.5 px-3 min-h-[34px]'
      : size === 'lg'
      ? 'text-xs sm:text-sm py-2.5 px-4 min-h-[44px]'
      : 'text-xs py-2 px-3.5 min-h-[38px]';
  const radiusClasses = variant === 'pill' ? 'rounded-full' : 'rounded-xl';

  return (
    <>
      <div className={`relative text-left ${isFullWidth ? 'w-full block' : 'inline-block'}`} id={id}>
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={toggleOpen}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || selectedOption?.label || placeholder}
          className={`flex items-center justify-between gap-2.5 bg-white/95 backdrop-blur-md border border-sky-100/90 hover:border-sky-300 text-slate-800 font-semibold shadow-2xs transition-all cursor-pointer select-none ${
            isFullWidth ? 'w-full' : ''
          } ${sizeClasses} ${radiusClasses} ${
            isOpen ? 'border-sky-500 ring-2 ring-sky-200/70 shadow-xs' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
          <span className="flex items-center gap-2 truncate">
            {icon || selectedOption?.icon}
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-600' : ''
            }`}
          />
        </button>
      </div>

      {/* Floating Menu rendered via Portal into document.body to prevent parent container clipping/stretching */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              top: coords.placement === 'bottom' ? `${coords.top}px` : undefined,
              bottom:
                coords.placement === 'top'
                  ? `${window.innerHeight - coords.top}px`
                  : undefined,
              left: `${coords.left}px`,
              minWidth: `${coords.width}px`,
              maxWidth: `${Math.max(coords.width, 360)}px`,
              zIndex: 99999,
            }}
            className={`max-h-72 overflow-y-auto rounded-2xl bg-white/98 backdrop-blur-xl border border-sky-100/90 shadow-2xl shadow-sky-950/15 p-1.5 animate-in fade-in zoom-in-95 duration-150 ambient-glow-sky [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none ${menuClassName}`}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              const prevOption = idx > 0 ? options[idx - 1] : null;
              const isNewGroup = option.group && (!prevOption || prevOption.group !== option.group);
              return (
                <React.Fragment key={option.value || idx}>
                  {isNewGroup && (
                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                      {option.group}
                    </div>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-sky-50/60 hover:text-sky-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon}
                      <span className="truncate">{option.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {option.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-sky-100 text-sky-800">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                    </div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};
