'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CATEGORY_LIST } from '@/data/mockData';
import { CategoryItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { ChevronLeft, ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll reveal on viewport enter
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

  const handleCategoryClick = (cat: CategoryItem) => {
    onSelectCategory(cat.productCategory);
    const target = document.querySelector('#collection-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const row1 = CATEGORY_LIST.slice(0, 10);
  const row2 = CATEGORY_LIST.slice(10, 20);

  // Helper to mark hot/trending items for visual rhythm
  const getBadgeType = (index: number) => {
    if (index === 0 || index === 1) return 'HOT';
    if (index === 3 || index === 6) return 'POPULAR';
    return null;
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full my-8 sm:my-12 relative transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative rounded-[32px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 p-6 sm:p-8 shadow-sm overflow-hidden ambient-glow-sky">
        {/* Subtle decorative background blur spot */}
        <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-52 h-52 bg-sky-100/30 rounded-full blur-2xl pointer-events-none" />

        {/* Editorial Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sky-100/60">
          <div className="space-y-2">
            {/* Pill Kicker with subtle pulse */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none shadow-2xs">
              <LayoutGrid className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>{language === 'vi' ? 'HỆ THỐNG DANH MỤC' : 'DIRECTORY v3.0'}</span>
            </div>

            {/* Editorial Headline with Soft Ocean Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
              {language === 'vi' ? 'Danh Mục ' : 'Curated '}
              <span className="font-serif italic font-normal text-sky-700">
                {language === 'vi' ? 'Tuyển Chọn' : 'Collections'}
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
                  ? 'border-sky-200 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-600 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                  : 'border-slate-200 bg-slate-50/80 text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Previous categories"
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
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Horizontal Gradient Mask Overlays */}
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
            className="overflow-x-auto scrollbar-none scroll-smooth flex flex-col gap-6 py-2 px-1"
          >
            {/* Row 1 */}
            <div className="flex items-start gap-4 sm:gap-6 min-w-max">
              {row1.map((cat, idx) => {
                const isActive = selectedCategory === cat.productCategory;
                const badge = getBadgeType(idx);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center gap-3 w-[104px] sm:w-[122px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 focus:outline-none"
                  >
                    {/* Circle Image Wrapper with Spring Bounce & Soft Ring */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 p-2.5 ${
                          isActive
                            ? 'bg-sky-50 ring-4 ring-sky-500/40 border-2 border-sky-500 shadow-md shadow-sky-500/25 scale-105'
                            : 'bg-white/90 border border-sky-100 group-hover:border-sky-300 group-hover:ring-4 group-hover:ring-sky-100 group-hover:shadow-md group-hover:shadow-sky-500/15 group-hover:scale-108'
                        }`}
                      >
                        <img
                          src={cat.image}
                          alt={language === 'vi' ? cat.nameVi : cat.nameEn}
                          className="w-full h-full object-cover rounded-full mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-115 group-hover:rotate-3"
                          loading="lazy"
                        />
                      </div>

                      {/* Hot / Popular Micro Pill */}
                      {badge && (
                        <div
                          className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight shadow-2xs ${
                            badge === 'HOT'
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white animate-pulse'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {badge}
                        </div>
                      )}

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-600 ring-2 ring-white animate-pulse" />
                      )}
                    </div>

                    {/* Category Label */}
                    <span
                      className={`text-xs sm:text-[13px] leading-snug line-clamp-2 px-1 font-sans transition-all duration-200 ${
                        isActive
                          ? 'text-sky-700 font-bold'
                          : 'text-slate-600 font-medium group-hover:text-sky-600 group-hover:font-semibold'
                      }`}
                    >
                      {language === 'vi' ? cat.nameVi : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="flex items-start gap-4 sm:gap-6 min-w-max">
              {row2.map((cat, idx) => {
                const isActive = selectedCategory === cat.productCategory;
                const badge = getBadgeType(idx + 10);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center gap-3 w-[104px] sm:w-[122px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 focus:outline-none"
                  >
                    {/* Circle Image Wrapper */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 p-2.5 ${
                          isActive
                            ? 'bg-sky-50 ring-4 ring-sky-500/40 border-2 border-sky-500 shadow-md shadow-sky-500/25 scale-105'
                            : 'bg-white/90 border border-sky-100 group-hover:border-sky-300 group-hover:ring-4 group-hover:ring-sky-100 group-hover:shadow-md group-hover:shadow-sky-500/15 group-hover:scale-108'
                        }`}
                      >
                        <img
                          src={cat.image}
                          alt={language === 'vi' ? cat.nameVi : cat.nameEn}
                          className="w-full h-full object-cover rounded-full mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-115 group-hover:rotate-3"
                          loading="lazy"
                        />
                      </div>

                      {/* Micro Pill */}
                      {badge && (
                        <div
                          className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight shadow-2xs ${
                            badge === 'HOT'
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white animate-pulse'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {badge}
                        </div>
                      )}

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-600 ring-2 ring-white animate-pulse" />
                      )}
                    </div>

                    {/* Category Label */}
                    <span
                      className={`text-xs sm:text-[13px] leading-snug line-clamp-2 px-1 font-sans transition-all duration-200 ${
                        isActive
                          ? 'text-sky-700 font-bold'
                          : 'text-slate-600 font-medium group-hover:text-sky-600 group-hover:font-semibold'
                      }`}
                    >
                      {language === 'vi' ? cat.nameVi : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
