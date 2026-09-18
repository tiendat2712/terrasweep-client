'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TOP_SEARCH_ITEMS } from '@/data/mockData';
import { TopSearchItem, Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles, Crown, Flame, ArrowUpRight } from 'lucide-react';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
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

  const handleItemClick = (item: TopSearchItem) => {
    if (isDragging) return;
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

  // Distinctive jeweled rank styling (Harmonized Atmospheric Ocean Edition)
  const renderRankBadge = (rankNum: number) => {
    const rankStr = String(rankNum).padStart(2, '0');

    if (rankNum === 1) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-amber-500/25 ring-2 ring-amber-300/80 flex items-center gap-1 z-10">
          <Crown className="w-3 h-3 text-amber-100 fill-amber-200" />
          <span>#01 TOP</span>
        </div>
      );
    }

    if (rankNum === 2) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-sky-500/25 ring-2 ring-sky-300/80 flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3 text-sky-100" />
          <span>#02 TOP</span>
        </div>
      );
    }

    if (rankNum === 3) {
      return (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md shadow-teal-500/25 ring-2 ring-teal-200/80 flex items-center gap-1 z-10">
          <Flame className="w-3 h-3 text-teal-100 fill-teal-100" />
          <span>#03 TOP</span>
        </div>
      );
    }

    return (
      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-sky-50/95 border border-sky-200/90 backdrop-blur-md text-sky-800 text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-2xs z-10">
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
      <div className="relative rounded-[32px] bg-white border border-cyan-100/80 p-6 sm:p-8 shadow-sm overflow-hidden ambient-glow-sky">
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
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-sky-950 to-sky-900 bg-clip-text text-transparent">
                {language === 'vi' ? 'Tìm Kiếm ' : 'Most Coveted & '}
              </span>
              <span className="font-serif italic font-normal bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                {language === 'vi' ? 'Hàng Đầu' : 'Top Trends'}
              </span>
            </h2>
          </div>

          {/* Ocean Capsule Navigator with Scroll Progress */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 border border-cyan-200/80 shadow-xs backdrop-blur-md self-end sm:self-center">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'hover:btn-ocean-primary hover:text-white text-slate-700 active:scale-90 cursor-pointer shadow-2xs'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Previous trending items"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Interactive Progress Bar Pill */}
            <div className="hidden sm:flex items-center w-16 h-1.5 bg-cyan-100/80 rounded-full overflow-hidden mx-1" title={`${Math.round(scrollProgress)}%`}>
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
              aria-label="Next trending items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Floating Edge Chevrons */}
        <div className="relative mt-6 group/carousel">
          {/* Floating Left Edge Chevron Button */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-cyan-200 shadow-lg shadow-sky-950/10 text-slate-700 hover:btn-ocean-primary hover:text-white transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${
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
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-cyan-200 shadow-lg shadow-sky-950/10 text-slate-700 hover:btn-ocean-primary hover:text-white transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${
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
            className={`overflow-x-auto scrollbar-none scroll-smooth flex items-stretch gap-5 pb-3 pt-1 px-1 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {TOP_SEARCH_ITEMS.map((item, index) => {
              const rankNum = index + 1;
              const staggerDelay = (index % 6) * 55;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    transitionDuration: '650ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
                  }}
                  className={`w-[210px] sm:w-[230px] shrink-0 group gloss-sweep-card rounded-[24px] bg-white border border-cyan-100/90 p-4 hover:border-cyan-300 hover:shadow-[0_12px_28px_-6px_rgba(8,145,178,0.12)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between cursor-pointer relative will-change-transform ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-[0.96]'
                  }`}
                >
                  <div>
                    {/* Image Container with Luxury Floating Rank & Integrated Sales Ribbon */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-gradient-to-b from-cyan-50/25 via-white to-sky-50/15 border border-cyan-100/50 p-4 mb-3.5 overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:bg-cyan-50/40">
                      <img
                        src={item.image}
                        alt={language === 'vi' ? item.nameVi : item.nameEn}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80';
                        }}
                      />

                      {/* Jeweled Rank Badge */}
                      {renderRankBadge(rankNum)}

                      {/* Integrated Monthly Volume Ribbon on Bottom */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-md border border-cyan-200/80 text-sky-900 text-[9.5px] sm:text-[10px] font-sans font-bold px-2 py-1 rounded-full shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5 group-hover:border-cyan-400 group-hover:bg-white transition-colors tabular-nums">
                        <TrendingUp className="w-3 h-3 text-cyan-600" />
                        <span>
                          {language === 'vi'
                            ? `Bán ${item.salesMonthly}`
                            : `Sold ${item.salesMonthly}`}
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-cyan-700 transition-colors font-sans min-h-[2.5rem] mt-1">
                      {language === 'vi' ? item.nameVi : item.nameEn}
                    </h3>
                  </div>

                  {/* Price, Category Tag & Quick Explore Arrow */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm sm:text-base font-black font-sans text-sky-800 tracking-tight">
                        {formatVND(item.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-semibold text-slate-500 bg-sky-50/80 border border-sky-100/70 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-2xs">
                        <ArrowUpRight className="w-3.5 h-3.5" />
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
