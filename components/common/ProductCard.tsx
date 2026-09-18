'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Heart, Star, Zap, Check } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  index?: number;
  isFavorited?: boolean;
  onSelect?: (product: Product) => void;
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
  showWishlist?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  isFavorited = false,
  onSelect,
  onToggleWishlist,
  showWishlist = true,
  className = '',
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const staggerDelay = (index % 6) * 50;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const discountPercent =
    product.discountPercent ||
    (product.originalPrice > product.flashPrice
      ? Math.round(((product.originalPrice - product.flashPrice) / product.originalPrice) * 100)
      : 0);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect?.(product)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
        transition:
          'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className={`group rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden select-none will-change-transform ${className}`}
    >
      {/* ===================================================================== */}
      {/* 1. PRODUCT IMAGE WITH SHOPEE-INSPIRED BADGES & SUBTLE OVERLAYS        */}
      {/* ===================================================================== */}
      <div className="relative aspect-square w-full bg-slate-50/60 overflow-hidden flex items-center justify-center p-2.5 sm:p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80';
          }}
        />

        {/* Shopee Badge 1: Top-Left Brand / Quality Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          {product.badge === 'Mall' ? (
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[8.5px] uppercase tracking-tight shadow-2xs font-sans">
              Mall
            </span>
          ) : product.isFlashSale ? (
            <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[8.5px] uppercase tracking-tight shadow-2xs font-sans flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>Flash</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[8.5px] uppercase tracking-tight shadow-2xs font-sans">
              {isVi ? 'Chính hãng' : 'Official'}
            </span>
          )}
        </div>

        {/* Shopee Badge 2: Top-Right Discount Ribbon */}
        {discountPercent > 0 && (
          <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-amber-500 to-amber-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-bl-lg shadow-2xs">
            -{discountPercent}%
          </div>
        )}

        {/* Shopee Badge 3: Bottom-Left Micro Voucher / Freeship Stamps */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-extrabold text-[8px] uppercase tracking-tighter shadow-2xs font-sans">
            VOUCHER XTRA
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/80 font-bold text-[8px] uppercase tracking-tighter shadow-2xs font-sans">
            FREESHIP
          </span>
        </div>

        {/* Wishlist Heart Button - Discrete & Floating */}
        {showWishlist && onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id, e);
            }}
            aria-label={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
            className={`absolute ${
              discountPercent > 0 ? 'top-8 right-2' : 'top-2 right-2'
            } z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200/80 hover:border-sky-300 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
              isFavorited
                ? 'opacity-100 text-rose-500'
                : 'opacity-70 group-hover:opacity-100 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. CARD METADATA BODY (NO BULKY BUTTON - SPACIOUS & BALANCED)         */}
      {/* ===================================================================== */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Title with 2-line clamp & optional inline favorite label */}
          <h3 className="text-xs sm:text-[13px] font-medium text-slate-800 line-clamp-2 min-h-[2.4rem] leading-snug group-hover:text-sky-600 transition-colors">
            <span className="inline-block px-1 py-0.2 mr-1 rounded bg-rose-500 text-white text-[8.5px] font-bold uppercase tracking-tight align-baseline font-sans">
              {isVi ? 'Yêu thích' : 'Fav'}
            </span>
            <span>{product.name}</span>
          </h3>

          {/* Shopee-style Micro Deal Pills */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 font-sans">
              {isVi ? 'Rẻ Vô Địch' : 'Best Price'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 font-sans">
              {isVi ? 'Hỏa Tốc 2H' : 'Fast 2H'}
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-auto pt-1">
          {/* Price & Sold Count Row (The Hero Data) */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-rose-600 font-mono tabular-nums tracking-tight">
                {formatVND(product.flashPrice)}
              </span>
              {product.originalPrice > product.flashPrice && (
                <span className="text-[10.5px] text-slate-400 line-through font-mono tabular-nums">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-sans tabular-nums whitespace-nowrap">
              {product.salesCount || (isVi ? '1.2k+ đã bán' : '1.2k+ sold')}
            </span>
          </div>

          {/* Micro Footer: Rating & Origin Location */}
          <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-2 border-t border-slate-100 font-sans">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 font-mono">
                {product.rating ? product.rating.toFixed(1) : '4.9'}
              </span>
              <span className="text-slate-400">
                ({product.reviewCount || 128})
              </span>
            </div>

            <span className="truncate max-w-[100px] text-slate-400">
              {product.specs?.['Xuất xứ'] || 'TP. Hồ Chí Minh'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
