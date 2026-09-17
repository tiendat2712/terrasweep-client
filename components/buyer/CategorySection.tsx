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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const scrollAmount = direction === 'left' ? -420 : 420;
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

  return (
    <section className="w-full my-10 sm:my-14 relative">
      <div className="rounded-[28px] bg-white border border-zinc-200/80 p-6 sm:p-8 shadow-2xs transition-all">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="space-y-2">
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none">
              <LayoutGrid className="w-3 h-3 text-[#0C0C0C]" />
              <span>{language === 'vi' ? 'HỆ THỐNG DANH MỤC' : 'DIRECTORY v3.0'}</span>
            </div>

            {/* Editorial Headline with Italic Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C0C0C] tracking-tight leading-tight">
              {language === 'vi' ? 'Danh Mục ' : 'Curated '}
              <span className="font-serif italic font-normal text-zinc-600">
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
                  ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
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
                  ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
              }`}
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with 2 Balanced Rows */}
        <div className="relative mt-6">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-none scroll-smooth flex flex-col gap-5 pb-2"
          >
            {/* Row 1 */}
            <div className="flex items-start gap-4 sm:gap-6 min-w-max">
              {row1.map((cat) => {
                const isActive = selectedCategory === cat.productCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center gap-3 w-[104px] sm:w-[120px] text-center cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 p-2 ${
                        isActive
                          ? 'bg-white ring-2 ring-[#0C0C0C] shadow-md scale-105'
                          : 'bg-[#F4F4F5] border border-zinc-200/80 group-hover:border-[#0C0C0C] group-hover:bg-white group-hover:shadow-sm group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={language === 'vi' ? cat.nameVi : cat.nameEn}
                        className="w-full h-full object-cover rounded-full mix-blend-multiply"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={`text-xs sm:text-[13px] leading-snug line-clamp-2 px-1 font-sans transition-colors ${
                        isActive
                          ? 'text-[#0C0C0C] font-bold'
                          : 'text-zinc-600 font-medium group-hover:text-[#0C0C0C]'
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
              {row2.map((cat) => {
                const isActive = selectedCategory === cat.productCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center gap-3 w-[104px] sm:w-[120px] text-center cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 p-2 ${
                        isActive
                          ? 'bg-white ring-2 ring-[#0C0C0C] shadow-md scale-105'
                          : 'bg-[#F4F4F5] border border-zinc-200/80 group-hover:border-[#0C0C0C] group-hover:bg-white group-hover:shadow-sm group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={language === 'vi' ? cat.nameVi : cat.nameEn}
                        className="w-full h-full object-cover rounded-full mix-blend-multiply"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={`text-xs sm:text-[13px] leading-snug line-clamp-2 px-1 font-sans transition-colors ${
                        isActive
                          ? 'text-[#0C0C0C] font-bold'
                          : 'text-zinc-600 font-medium group-hover:text-[#0C0C0C]'
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
