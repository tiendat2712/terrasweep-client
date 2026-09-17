'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Zap, ChevronLeft, ChevronRight, Flame, Clock, ArrowUpRight } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section className="w-full my-10 sm:my-14 relative">
      <div className="rounded-[28px] bg-white border border-zinc-200/80 p-6 sm:p-8 shadow-2xs transition-all">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-zinc-100">
          <div className="space-y-2">
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none">
              <Zap className="w-3 h-3 text-[#0C0C0C]" />
              <span>{language === 'vi' ? 'ĐỢT PHÁT HÀNH GIỚI HẠN' : 'ARCHIVAL FLASH DROP'}</span>
            </div>

            {/* Editorial Headline with Italic Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C0C0C] tracking-tight leading-tight">
              {language === 'vi' ? 'Flash Deals & ' : 'Limited Deals & '}
              <span className="font-serif italic font-normal text-zinc-600">
                {language === 'vi' ? 'Ưu Đãi Đặc Biệt' : 'Curated Drops'}
              </span>
            </h2>
          </div>

          {/* Minimalist Live Countdown & Controls */}
          <div className="flex items-center gap-4 self-start md:self-end flex-wrap">
            {/* Countdown Box */}
            <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 select-none">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] font-mono uppercase font-semibold text-zinc-500 mr-1">
                {language === 'vi' ? 'KẾT THÚC TRONG' : 'ENDS IN'}
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-xs text-white">
                <span className="px-2 py-0.5 rounded-lg bg-[#0C0C0C] shadow-2xs">
                  {formatNumber(timeLeft.hours)}h
                </span>
                <span className="text-zinc-400 font-bold">:</span>
                <span className="px-2 py-0.5 rounded-lg bg-[#0C0C0C] shadow-2xs">
                  {formatNumber(timeLeft.minutes)}m
                </span>
                <span className="text-zinc-400 font-bold">:</span>
                <span className="px-2 py-0.5 rounded-lg bg-[#0C0C0C] shadow-2xs">
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
                    ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
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
                    ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                }`}
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-6">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-none scroll-smooth flex items-stretch gap-5 pb-3"
          >
            {flashProducts.map((prod) => {
              const progress = prod.soldProgress || 75;
              const isLowStock = (prod.stock || 10) <= 5 || progress >= 90;

              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="w-[210px] sm:w-[230px] shrink-0 group rounded-[24px] bg-[#FAFAFA] border border-zinc-200/80 p-4 hover:border-[#0C0C0C] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Container with Luxury Badges */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-[#F0F0F0] overflow-hidden flex items-center justify-center p-4 mb-3.5 transition-colors group-hover:bg-[#EAEAEA]">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Drop Pill Badge on top-left */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0C0C0C]/90 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                        {prod.badge || 'OFFICIAL DROP'}
                      </div>

                      {/* Discount Pill on top-right */}
                      {prod.discountPercent > 0 && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 text-[#0C0C0C] border border-zinc-200/80 text-[10px] font-mono font-bold shadow-2xs">
                          -{prod.discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0C0C0C] line-clamp-2 leading-snug group-hover:opacity-85 transition-opacity font-sans">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Pricing and Stock Velocity Status */}
                  <div className="mt-4 space-y-2.5 pt-2 border-t border-zinc-100">
                    {/* Price Block */}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-base sm:text-lg font-black text-[#0C0C0C] font-sans tracking-tight">
                        {formatVND(prod.flashPrice)}
                      </span>
                      {prod.originalPrice > prod.flashPrice && (
                        <span className="text-xs text-zinc-400 line-through font-mono">
                          {formatVND(prod.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Velocity Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-zinc-200/80 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progress}%` }}
                          className="h-full rounded-full bg-[#0C0C0C] transition-all duration-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {isLowStock ? (
                          <span className="flex items-center gap-1 font-bold text-[#0C0C0C]">
                            <Flame className="w-3 h-3 text-[#0C0C0C]" />
                            {language === 'vi'
                              ? `CHỈ CÒN ${prod.stock || 5}`
                              : `ONLY ${prod.stock || 5} LEFT`}
                          </span>
                        ) : (
                          <span className="font-semibold text-zinc-600">
                            {language === 'vi' ? 'ĐANG BÁN CHẠY' : 'HIGH DEMAND'}
                          </span>
                        )}
                        <span>{progress}% {language === 'vi' ? 'ĐÃ BÁN' : 'CLAIMED'}</span>
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
