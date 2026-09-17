'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Zap, ChevronLeft, ChevronRight, Flame, Clock, ShoppingBag } from 'lucide-react';

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
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [flashProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
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
            {/* Pill Kicker with Live Radar Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <Zap className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>{language === 'vi' ? 'ĐỢT XẢ KHO TRỰC TIẾP' : 'LIVE FLASH DROP'}</span>
            </div>

            {/* Editorial Headline with Soft Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
              {language === 'vi' ? 'Flash Deals & ' : 'Limited Deals & '}
              <span className="font-serif italic font-normal text-sky-700">
                {language === 'vi' ? 'Ưu Đãi Đặc Biệt' : 'Curated Drops'}
              </span>
            </h2>
          </div>

          {/* Minimalist Live Countdown & Controls */}
          <div className="flex items-center gap-4 self-start md:self-end flex-wrap">
            {/* Digital LED Flip Split-Display Countdown */}
            <div className="flex items-center gap-2.5 p-1.5 px-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-inner backdrop-blur-md select-none text-white">
              <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase font-bold text-sky-200 mr-1 tracking-wider">
                {language === 'vi' ? 'KẾT THÚC SAU' : 'ENDS IN'}
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
                <span className="px-2 py-0.5 rounded-md bg-sky-600/90 border border-sky-400/40 shadow-xs">
                  {formatNumber(timeLeft.hours)}h
                </span>
                <span className="text-sky-300 font-bold animate-pulse">:</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-600/90 border border-sky-400/40 shadow-xs">
                  {formatNumber(timeLeft.minutes)}m
                </span>
                <span className="text-sky-300 font-bold animate-pulse">:</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-600/90 border border-sky-400/40 shadow-xs">
                  {formatNumber(timeLeft.seconds)}s
                </span>
              </div>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'border-sky-200 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-600 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                    : 'border-slate-200 bg-slate-50/80 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? 'border-sky-200 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-600 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                    : 'border-slate-200 bg-slate-50/80 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container with Edge Masks */}
        <div className="relative mt-6">
          {/* Left gradient fade mask */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-white via-white/85 to-transparent z-10 transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Right gradient fade mask */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-white via-white/85 to-transparent z-10 transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-none scroll-smooth flex items-stretch gap-5 pb-3 pt-1 px-1"
          >
            {flashProducts.map((prod) => {
              const progress = prod.soldProgress || 75;
              const isLowStock = (prod.stock || 10) <= 5 || progress >= 90;

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="w-[210px] sm:w-[230px] shrink-0 group gloss-sweep-card rounded-[24px] bg-white border border-sky-100/90 p-4 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
                >
                  <div>
                    {/* Image Container with Luxury Badges */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-slate-50 overflow-hidden flex items-center justify-center p-4 mb-3.5 transition-colors group-hover:bg-sky-50/40">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Drop Pill Badge on top-left */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-sky-600/90 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                        {prod.badge || 'OFFICIAL DROP'}
                      </div>

                      {/* Discount Pill on top-right */}
                      {prod.discountPercent > 0 && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] shadow-sm animate-pulse">
                          -{prod.discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors font-sans">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Pricing and Stock Velocity Status */}
                  <div className="mt-4 space-y-2.5 pt-2 border-t border-slate-100">
                    {/* Price Block */}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-base sm:text-lg font-black text-[#0F172A] font-sans tracking-tight">
                        {formatVND(prod.flashPrice)}
                      </span>
                      {prod.originalPrice > prod.flashPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {formatVND(prod.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Shimmer Velocity Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                        <div
                          style={{ width: `${progress}%` }}
                          className="h-full rounded-full shimmer-progress transition-all duration-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        {isLowStock ? (
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-bounce" />
                            {language === 'vi'
                              ? `CHỈ CÒN ${prod.stock || 5}`
                              : `ONLY ${prod.stock || 5} LEFT`}
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                            {language === 'vi' ? 'ĐANG BÁN CHẠY' : 'HIGH DEMAND'}
                          </span>
                        )}
                        <span className="font-semibold text-sky-700">{progress}% {language === 'vi' ? 'ĐÃ BÁN' : 'SOLD'}</span>
                      </div>
                    </div>

                    {/* Quick Add Action Button */}
                    {onAddToCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(prod);
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-200 hover:border-sky-600 font-sans font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                        aria-label="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Thêm nhanh' : 'Quick Add'}</span>
                      </button>
                    )}
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
