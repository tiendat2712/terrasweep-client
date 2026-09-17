'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TOP_SEARCH_ITEMS } from '@/data/mockData';
import { TopSearchItem, Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TopSearchesSectionProps {
  onSelectProduct?: (product: Product) => void;
  products?: Product[];
}

export const TopSearchesSection: React.FC<TopSearchesSectionProps> = ({
  onSelectProduct,
  products = [],
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

  return (
    <section className="w-full my-10 sm:my-14 relative">
      <div className="rounded-[28px] bg-white border border-zinc-200/80 p-6 sm:p-8 shadow-2xs transition-all">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="space-y-2">
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10.5px] font-mono font-bold uppercase tracking-widest select-none">
              <TrendingUp className="w-3 h-3 text-[#0C0C0C]" />
              <span>{language === 'vi' ? 'XU HƯỚNG TÌM KIẾM' : 'SEARCH TELEMETRY'}</span>
            </div>

            {/* Editorial Headline with Italic Accent */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#0C0C0C] tracking-tight leading-tight">
              {language === 'vi' ? 'Tìm Kiếm ' : 'Most Coveted & '}
              <span className="font-serif italic font-normal text-zinc-600">
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
                  ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
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
                  ? 'border-zinc-300 bg-white text-zinc-800 hover:border-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white shadow-2xs hover:scale-105 active:scale-95'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
              }`}
              aria-label="Next trending items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-6">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-none scroll-smooth flex items-stretch gap-5 pb-3"
          >
            {TOP_SEARCH_ITEMS.map((item, index) => {
              const rank = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-[190px] sm:w-[215px] shrink-0 group rounded-[24px] bg-[#FAFAFA] border border-zinc-200/80 p-3.5 hover:border-[#0C0C0C] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Container with Luxury Floating Rank & Sales Pill */}
                    <div className="relative aspect-square w-full rounded-[20px] bg-[#F0F0F0] overflow-hidden flex items-center justify-center p-4 mb-3 transition-colors group-hover:bg-[#EAEAEA]">
                      <img
                        src={item.image}
                        alt={language === 'vi' ? item.nameVi : item.nameEn}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Monochromatic Rank Pill */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0C0C0C] text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                        #{rank} TOP
                      </div>

                      {/* Frosted Monthly Volume Badge on Bottom */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-zinc-200/80 text-[#0C0C0C] text-[9.5px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                        {language === 'vi'
                          ? `Bán ${item.salesMonthly}`
                          : `Sold ${item.salesMonthly}`}
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#0C0C0C] line-clamp-2 leading-snug group-hover:opacity-85 transition-opacity font-sans">
                      {language === 'vi' ? item.nameVi : item.nameEn}
                    </h3>
                  </div>

                  {/* Price Tag */}
                  <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0C0C0C]">
                      {formatVND(item.price)}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-zinc-400">
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
