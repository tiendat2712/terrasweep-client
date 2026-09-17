'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TOP_SEARCH_ITEMS } from '@/data/mockData';
import { TopSearchItem, Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles, Crown, Flame } from 'lucide-react';

interface TopSearchesSectionProps {
  onSelectProduct?: (product: Product) => void;
  products?: Product[];
}

export const TopSearchesSection: React.FC<TopSearchesSectionProps> = ({
  onSelectProduct,
  products = [],
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
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -440 : 440;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const handleItemClick = (item: TopSearchItem) => {
    const matched = products.find(
      (p) =>
        p.id === item.productRefId ||
        p.name.toLowerCase().includes(item.nameVi.slice(0, 15).toLowerCase()) ||
        p.category.toLowerCase() === item.category.toLowerCase()
    );
    if (matched && onSelectProduct) {
      onSelectProduct(matched);
    } else {
      const target = document.querySelector('#collection-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Distinctive jeweled rank styling
  const renderRankBadge = (rankNum: number) => {
    const rankStr = String(rankNum).padStart(2, '0');

    if (rankNum === 1) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-amber-500/25 ring-2 ring-amber-300/80 flex items-center gap-1">
          <Crown className="w-3 h-3 text-amber-100 fill-amber-200" />
          <span>#01 TOP</span>
        </div>
      );
    }

    if (rankNum === 2) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-sky-500/25 ring-2 ring-sky-300/80 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-100" />
          <span>#02 TOP</span>
        </div>
      );
    }

    if (rankNum === 3) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-700 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-orange-500/25 ring-2 ring-orange-200/80 flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-200 fill-orange-200" />
          <span>#03 TOP</span>
        </div>
      );
    }

    return (
      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-800/85 backdrop-blur-sm text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-2xs">
        #{rankStr} TOP
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full my-8 sm:my-12 relative transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative rounded-[32px] bg-gradient-to-b from-white via-cyan-50/20 to-sky-50/15 border border-cyan-100/80 p-6 sm:p-8 shadow-sm overflow-hidden ambient-glow-sky">
        {/* Subtle decorative background spots */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-300/15 rounded-full blur-3xl pointer-events-none" />

        {/* Editorial Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-cyan-100/60">
          <div className="space-y-2">
            {/* Pill Kicker with Live Emerald Radar */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
              <span>{language === 'vi' ? 'DỮ LIỆU TÌM KIẾM TRỰC TIẾP' : 'REAL-TIME TELEMETRY'}</span>
            </div>

            {/* Editorial Headline with Soft Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
              {language === 'vi' ? 'Tìm Kiếm ' : 'Most Coveted & '}
              <span className="font-serif italic font-normal text-sky-700">
                {language === 'vi' ? 'Hàng Đầu' : 'Top Trends'}
              </span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-500 hover:bg-sky-600 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                  : 'border-slate-200 bg-slate-50/80 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Previous trending items"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-500 hover:bg-sky-600 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                  : 'border-slate-200 bg-slate-50/80 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Next trending items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
            {TOP_SEARCH_ITEMS.map((item, index) => {
              const rankNum = index + 1;
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-[190px] sm:w-[215px] shrink-0 group gloss-sweep-card rounded-[24px] bg-white border border-cyan-100/80 p-3.5 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
                >
                  <div>
                    {/* Image Container with Luxury Floating Rank & Sales Pill */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-slate-50 overflow-hidden flex items-center justify-center p-4 mb-3 transition-colors group-hover:bg-cyan-50/40">
                      <img
                        src={item.image}
                        alt={language === 'vi' ? item.nameVi : item.nameEn}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Jeweled Rank Badge */}
                      {renderRankBadge(rankNum)}

                      {/* Frosted Monthly Volume Badge on Bottom */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-cyan-200/80 text-sky-900 text-[9.5px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap flex items-center gap-1 group-hover:border-cyan-400 transition-colors">
                        <TrendingUp className="w-2.5 h-2.5 text-cyan-600" />
                        <span>
                          {language === 'vi'
                            ? `Bán ${item.salesMonthly}`
                            : `Sold ${item.salesMonthly}`}
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-cyan-700 transition-colors font-sans">
                      {language === 'vi' ? item.nameVi : item.nameEn}
                    </h3>
                  </div>

                  {/* Price & Category Tag */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {formatVND(item.price)}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
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
