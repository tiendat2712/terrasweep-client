'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Zap, ChevronLeft, ChevronRight, Flame, Clock, ShoppingBag, Check, Loader2 } from 'lucide-react';

interface FlashSaleSectionProps {
  flashProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  flashProducts,
  onSelectProduct,
  onAddToCart,
}) => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // High-precision countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 47,
    seconds: 57,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [flashProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleQuickAdd = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (loadingMap[prod.id]) return;
    if (onAddToCart) {
      setLoadingMap((prev) => ({ ...prev, [prod.id]: true }));
      setTimeout(() => {
        onAddToCart(prod);
        setLoadingMap((prev) => ({ ...prev, [prod.id]: false }));
        setAddedMap((prev) => ({ ...prev, [prod.id]: true }));
        setTimeout(() => {
          setAddedMap((prev) => ({ ...prev, [prod.id]: false }));
        }, 1400);
      }, 400);
    }
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full my-8 sm:my-12 relative transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative rounded-[32px] bg-gradient-to-br from-white via-sky-50/35 to-blue-50/20 border border-sky-200/80 p-6 sm:p-8 shadow-sm overflow-hidden ambient-glow-sky">
        {/* Subtle dynamic background glow spots */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Editorial Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-sky-100/70">
          <div className="space-y-2">
            {/* Pill Kicker with Live Radar Beacon (Oceanic Azure Edition) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-50 via-cyan-50/70 to-sky-100/50 border border-sky-200/90 text-sky-800 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
              </span>
              <Zap className="w-3 h-3 text-sky-500 fill-sky-500" />
              <span>{language === 'vi' ? 'ĐỢT XẢ KHO TRỰC TIẾP' : 'LIVE FLASH DROP'}</span>
            </div>

            {/* Editorial Headline with Soft Accent */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-sky-950 to-sky-900 bg-clip-text text-transparent">
                {language === 'vi' ? 'Flash Deals & ' : 'Limited Deals & '}
              </span>
              <span className="font-serif italic font-normal bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                {language === 'vi' ? 'Ưu Đãi Đặc Biệt' : 'Curated Drops'}
              </span>
            </h2>
          </div>

          {/* Minimalist Live Countdown & Controls */}
          <div className="flex items-center gap-4 self-start md:self-end flex-wrap">
            {/* Atmospheric Ocean Live Countdown */}
            <div className="flex items-center gap-2.5 p-1.5 px-3.5 rounded-2xl bg-sky-50/90 border border-sky-200/90 shadow-xs backdrop-blur-md select-none text-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span className="text-[10.5px] font-mono uppercase font-bold text-sky-800 mr-1 tracking-wider">
                {language === 'vi' ? 'KẾT THÚC SAU' : 'ENDS IN'}
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
                <span className="px-2.5 py-0.5 rounded-lg btn-ocean-primary shadow-xs">
                  {formatNumber(timeLeft.hours)}h
                </span>
                <span className="text-sky-500 font-bold animate-pulse">:</span>
                <span className="px-2.5 py-0.5 rounded-lg btn-ocean-primary shadow-xs">
                  {formatNumber(timeLeft.minutes)}m
                </span>
                <span className="text-sky-500 font-bold animate-pulse">:</span>
                <span className="px-2.5 py-0.5 rounded-lg btn-ocean-primary shadow-xs">
                  {formatNumber(timeLeft.seconds)}s
                </span>
              </div>
            </div>

            {/* Ocean Capsule Navigator with Scroll Progress */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 border border-sky-200/80 shadow-xs backdrop-blur-md">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? 'hover:btn-ocean-primary hover:text-white text-slate-700 active:scale-90 cursor-pointer shadow-2xs'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Interactive Progress Bar Pill */}
              <div className="hidden sm:flex items-center w-16 h-1.5 bg-sky-100/80 rounded-full overflow-hidden mx-1" title={`${Math.round(scrollProgress)}%`}>
                <div
                  className="h-full btn-ocean-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(15, scrollProgress)}%` }}
                />
              </div>

              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? 'hover:btn-ocean-primary hover:text-white text-slate-700 active:scale-90 cursor-pointer shadow-2xs'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Shopee-style "Xem tất cả >" link */}
            <a
              href="#collection-section"
              className="hidden sm:inline-flex text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors items-center gap-1 group/link select-none ml-1 cursor-pointer"
            >
              <span>{language === 'vi' ? 'Xem tất cả' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Carousel Container with Floating Edge Chevrons */}
        <div className="relative mt-6 group/carousel">
          {/* Floating Left Edge Chevron Button */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-sky-200 shadow-lg shadow-sky-950/10 text-slate-700 hover:btn-ocean-primary hover:text-white transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${
              canScrollLeft ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none scale-75'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Floating Right Edge Chevron Button */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-sky-200 shadow-lg shadow-sky-950/10 text-slate-700 hover:btn-ocean-primary hover:text-white transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${
              canScrollRight ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none scale-75'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Left gradient fade mask */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Right gradient fade mask */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`overflow-x-auto scrollbar-none scroll-smooth flex items-stretch gap-3.5 sm:gap-4 pb-3 pt-1 px-1 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {flashProducts.map((prod, index) => {
              const progress = prod.soldProgress || 75;
              const isLowStock = (prod.stock || 10) <= 5 || progress >= 90;
              const staggerDelay = (index % 6) * 45;

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  style={{
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
                  }}
                  className={`w-[155px] sm:w-[172px] md:w-[185px] shrink-0 group/card gloss-sweep-card rounded-[22px] bg-white/95 backdrop-blur-md border border-sky-100/90 p-2.5 sm:p-3 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative will-change-transform select-none ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-6 scale-[0.96]'
                  }`}
                >
                  {/* Top: Square Product Image with Shopee Badges */}
                  <div className="relative aspect-square w-full rounded-[16px] bg-gradient-to-b from-sky-50/40 via-white to-sky-50/20 border border-sky-100/60 overflow-hidden flex items-center justify-center p-2 group-hover/card:bg-sky-50/50 transition-colors">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-108 transition-transform duration-400 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Shopee Badge 1: Top-Left "Yêu thích+" or Mall tag */}
                    <div className="absolute top-0 left-0 pointer-events-none z-10">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-br-lg rounded-tl-[14px] btn-ocean-primary text-white text-[8px] font-sans font-bold uppercase tracking-tight shadow-xs border-b border-r border-sky-400/40">
                        {prod.badge || 'Yêu thích+'}
                      </span>
                    </div>

                    {/* Shopee Badge 2: Top-Right Discount % Sticker */}
                    {prod.discountPercent > 0 && (
                      <div className="absolute top-0 right-0 pointer-events-none z-10">
                        <div className="bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-bl-lg rounded-tr-[14px] shadow-xs font-sans tracking-tight flex items-center gap-0.5 border-b border-l border-amber-300/40">
                          <span className="text-[7.5px] font-bold text-amber-100">%</span>
                          <span>-{prod.discountPercent}%</span>
                        </div>
                      </div>
                    )}

                    {/* Shopee Badge 3: Bottom-Left Micro Voucher & Siêu Rẻ Badges - Bo Tròn Chuẩn Ocean */}
                    <div className="absolute bottom-1.5 left-1.5 pointer-events-none z-10 flex items-center gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-sans font-black text-[7.5px] uppercase tracking-tight shadow-xs border border-amber-300/80">
                        VOUCHER
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full btn-ocean-primary text-white font-sans font-black text-[7.5px] uppercase tracking-tight shadow-xs border border-sky-300/50">
                        SIÊU RẺ
                      </span>
                    </div>

                    {/* Floating Quick Add Icon Button (Hover reveal) */}
                    {onAddToCart && (
                      <button
                        onClick={(e) => handleQuickAdd(prod, e)}
                        disabled={loadingMap[prod.id]}
                        aria-busy={loadingMap[prod.id]}
                        className={`absolute bottom-1.5 right-1.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                          loadingMap[prod.id]
                            ? 'btn-ocean-primary text-white opacity-100 scale-100'
                            : addedMap[prod.id]
                            ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-300'
                            : 'btn-ocean-primary text-white opacity-0 group-hover/card:opacity-100 scale-90 group-hover/card:scale-100 hover:scale-110 active:scale-95 shadow-sky-500/25'
                        }`}
                        title={language === 'vi' ? 'Thêm nhanh vào giỏ' : 'Quick add to cart'}
                        aria-label="Quick Add"
                      >
                        {loadingMap[prod.id] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : addedMap[prod.id] ? (
                          <Check className="w-3.5 h-3.5 animate-in zoom-in-50" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* NO PRODUCT NAME AS EXPLICITLY REQUESTED */}

                  {/* Center: Price & Urgency Capsule (Ocean-Harmonized) */}
                  <div className="mt-2.5 space-y-1.5 text-center">
                    {/* Centered Bold Price with Ocean Rounded Flash Tag */}
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base sm:text-[17px] font-black text-rose-600 font-sans tracking-tight tabular-nums">
                        {formatVND(prod.flashPrice)}
                      </span>
                      <div className="inline-flex items-center justify-center text-rose-500 bg-rose-50 border border-rose-200/90 w-4.5 h-4.5 rounded-full shadow-2xs">
                        <Zap className="w-2.5 h-2.5 fill-rose-500" />
                      </div>
                    </div>

                    {/* Shopee-style Urgency Progress Capsule with Ocean Track & Fire Shimmer */}
                    <div className="relative w-full h-5 rounded-full bg-sky-100/70 border border-sky-200/80 overflow-hidden select-none flex items-center justify-center p-0.5 shadow-inner">
                      {/* Dynamic Progress Fill */}
                      <div
                        style={{ width: `${Math.max(16, progress)}%` }}
                        className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${
                          isLowStock
                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-xs'
                            : 'bg-gradient-to-r from-orange-500 via-rose-500 to-rose-600 shadow-xs'
                        }`}
                      >
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>

                      {/* Centered Urgency Text Overlay with Flame */}
                      <div className="relative z-10 flex items-center justify-center gap-1 px-1 text-[9px] sm:text-[9.5px] font-sans font-black uppercase tracking-wider text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        <Flame className="w-2.5 h-2.5 text-amber-200 fill-amber-200 animate-pulse shrink-0" />
                        <span className="truncate">
                          {isLowStock
                            ? language === 'vi'
                              ? `CHỈ CÒN ${prod.stock || 5}`
                              : `ONLY ${prod.stock || 5} LEFT`
                            : language === 'vi'
                            ? 'ĐANG BÁN CHẠY'
                            : 'HOT SALE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
