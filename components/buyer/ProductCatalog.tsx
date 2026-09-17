import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Heart, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';

interface AnimatedProductCardProps {
  product: Product;
  index: number;
  isFavorited: boolean;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({
  product,
  index,
  isFavorited,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  t,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const priceUSD = Math.round(product.flashPrice / 25000);
  const originalPriceUSD = Math.round(product.originalPrice / 25000);
  const staggerDelay = (index % 3) * 110;

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(product)}
      style={{
        transitionDuration: '750ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className={`group rounded-[28px] bg-white border border-zinc-200 p-4 hover:border-zinc-400 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between cursor-pointer will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-9 scale-[0.96]'
      }`}
    >
      {/* Image Container with Ambient Subtle Tone & Zoom */}
      <div className="relative aspect-square w-full rounded-[24px] bg-[#F4F4F5] group-hover:bg-[#ECECED] overflow-hidden flex items-center justify-center p-6 transition-colors duration-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Top Drop Badge */}
        {product.isFlashSale && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0C0C0C]/90 backdrop-blur-md text-[9.5px] font-sans font-bold uppercase tracking-wider text-white shadow-xs">
            ⚡ Drop
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer"
          title="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-zinc-600 hover:text-black'
            }`}
          />
        </button>
      </div>

      {/* Product Metadata & CTA */}
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#0C0C0C] truncate font-sans group-hover:text-black transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-[#0C0C0C] font-mono">
                ${priceUSD}
              </span>
              {product.originalPrice > product.flashPrice && (
                <span className="text-xs text-zinc-400 line-through font-mono">
                  ${originalPriceUSD}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              {product.flashPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        {/* Full-width Elongated Pill "Add to Cart" Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full py-2.5 rounded-full bg-[#0C0C0C] hover:bg-zinc-800 text-white text-xs font-bold transition-all duration-300 shadow-xs hover:shadow-md flex items-center justify-center cursor-pointer active:scale-95 group-hover:bg-zinc-900"
        >
          {t('catalog.addToCart')}
        </button>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
  externalCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  searchQuery = '',
  externalCategory,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({
    'prod-1': true,
    'prod-3': true,
  });

  const [showPricePopover, setShowPricePopover] = useState(false);
  const [priceTier, setPriceTier] = useState<string>('all');

  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    onSelectCategory?.(catId);
  };

  const filterCategories = [
    { id: 'All', label: t('catalog.catAll') },
    { id: 'Footwear', label: language === 'vi' ? 'Giày Dép' : 'Footwear' },
    { id: 'Men Apparel', label: language === 'vi' ? 'Thời Trang' : 'Apparel' },
    { id: 'Cyber Audio', label: t('catalog.catAudio') },
    { id: 'Smart Wearables', label: t('catalog.catWearables') },
    { id: 'Gaming Gear', label: language === 'vi' ? 'Máy Tính & Gear' : 'Gaming Gear' },
    { id: 'Beauty', label: language === 'vi' ? 'Sắc Đẹp & Care' : 'Beauty & Care' },
    { id: 'Home & Living', label: language === 'vi' ? 'Nhà Cửa & Đời Sống' : 'Home & Living' },
  ];

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & sort logic
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (selectedCategory === 'Footwear' && (item.category.includes('Footwear') || item.category === 'Running' || item.category === 'Lifestyle')) ||
          (selectedCategory === 'Men Apparel' && (item.category.includes('Apparel') || item.category === 'Neo Apparel')) ||
          (selectedCategory === 'Home & Living' && (item.category.includes('Home') || item.category === 'Home Appliances')) ||
          (selectedCategory === 'Cyber Audio' && (item.category.includes('Audio') || item.category === 'Phones & Gadgets'));

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPriceTier = true;
    if (priceTier === 'under-300k') matchesPriceTier = item.flashPrice < 300000;
    else if (priceTier === '300k-1m') matchesPriceTier = item.flashPrice >= 300000 && item.flashPrice <= 1000000;
    else if (priceTier === '1m-3m') matchesPriceTier = item.flashPrice >= 1000000 && item.flashPrice <= 3000000;
    else if (priceTier === 'above-3m') matchesPriceTier = item.flashPrice > 3000000;

    const itemPriceUSD = Math.round(item.flashPrice / 25000);
    const matchesPrice = itemPriceUSD <= maxPrice;

    return matchesCategory && matchesSearch && matchesPriceTier && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.flashPrice - b.flashPrice;
    if (sortBy === 'price-desc') return b.flashPrice - a.flashPrice;
    return b.rating - a.rating;
  });

  return (
    <section id="collection-section" className="mt-10 sm:mt-14 mb-24">
      {/* 1. HORIZONTAL EDITORIAL FILTER & CONTROL TOOLBAR */}
      <div className="rounded-[28px] bg-white border border-zinc-200/80 p-5 sm:p-7 shadow-2xs space-y-5 mb-8">
        
        {/* TOP ROW: Title, Item Counter, Price & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0C0C0C] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#0C0C0C] tracking-tight font-sans">
                  {language === 'vi' ? 'Bộ Sưu Tập ' : 'Curated '}
                  <span className="font-serif italic font-normal text-zinc-600">
                    {language === 'vi' ? 'Sản Phẩm' : 'Collection'}
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-mono font-bold">
                  {filteredProducts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Price Popover Toggle & Sort Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Price Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowPricePopover(!showPricePopover)}
                className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none ${
                  priceTier !== 'all' || maxPrice < 500
                    ? 'bg-[#0C0C0C] text-white border-[#0C0C0C] shadow-2xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-black'
                }`}
              >
                <span>
                  {priceTier === 'under-300k'
                    ? '< 300k'
                    : priceTier === '300k-1m'
                    ? '300k - 1tr'
                    : priceTier === '1m-3m'
                    ? '1tr - 3tr'
                    : priceTier === 'above-3m'
                    ? '> 3tr'
                    : maxPrice < 500
                    ? `< $${maxPrice}`
                    : language === 'vi'
                    ? 'Mức giá'
                    : 'Price range'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPricePopover ? 'rotate-180' : ''}`} />
              </button>

              {/* Price Filter Floating Popover */}
              {showPricePopover && (
                <div className="absolute right-0 top-full mt-2 w-72 p-5 rounded-2xl bg-white border border-zinc-200 shadow-xl z-30 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider font-mono">
                      {language === 'vi' ? 'LỌC THEO GIÁ' : 'PRICE FILTER'}
                    </span>
                    {(priceTier !== 'all' || maxPrice < 500) && (
                      <button
                        onClick={() => {
                          setPriceTier('all');
                          setMaxPrice(500);
                        }}
                        className="text-[11px] text-zinc-500 hover:text-black font-semibold cursor-pointer underline"
                      >
                        {language === 'vi' ? 'Đặt lại' : 'Reset'}
                      </button>
                    )}
                  </div>

                  {/* Quick price presets */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {[
                      { id: 'all', labelVi: 'Tất cả mức giá', labelEn: 'All prices' },
                      { id: 'under-300k', labelVi: '< 300.000₫', labelEn: '< $15' },
                      { id: '300k-1m', labelVi: '300k - 1.000k', labelEn: '$15 - $40' },
                      { id: '1m-3m', labelVi: '1.000k - 3.000k', labelEn: '$40 - $120' },
                      { id: 'above-3m', labelVi: '> 3.000k', labelEn: '> $120' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => {
                          setPriceTier(tier.id);
                          if (tier.id === 'all') setMaxPrice(500);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                          priceTier === tier.id
                            ? 'bg-[#0C0C0C] text-white border-[#0C0C0C]'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {language === 'vi' ? tier.labelVi : tier.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Slider */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>{language === 'vi' ? 'Mức tối đa:' : 'Max:'}</span>
                      <span className="font-bold text-[#0C0C0C]">${maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#0C0C0C]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sort by Dropdown Pill */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-zinc-200 hover:border-black pl-3.5 pr-8 py-2 rounded-full text-xs font-semibold text-[#0C0C0C] cursor-pointer focus:outline-none transition-all shadow-2xs"
              >
                <option value="popularity">{t('catalog.sortPopularity')}</option>
                <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
                <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 pointer-events-none" />
            </div>

            {/* Reset All Filters Button */}
            {(selectedCategory !== 'All' || priceTier !== 'all' || maxPrice < 500) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceTier('all');
                  setMaxPrice(500);
                  onSelectCategory?.('All');
                }}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-black font-semibold underline cursor-pointer transition-colors"
              >
                {language === 'vi' ? 'Xóa lọc' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Horizontal Category Pills Row */}
        <div className="overflow-x-auto scrollbar-none scroll-smooth -mx-1 px-1">
          <div className="flex items-center gap-2 min-w-max">
            {filterCategories.map((cat) => {
              const isChecked = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isChecked
                      ? 'bg-[#0C0C0C] text-white shadow-2xs font-bold scale-102'
                      : 'bg-[#F8F8F8] text-zinc-600 border border-zinc-200/70 hover:border-zinc-400 hover:text-[#0C0C0C] hover:bg-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. FULL-WIDTH PRODUCT CARDS GRID (4 BALANCED COLUMNS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <AnimatedProductCard
            key={product.id}
            product={product}
            index={index}
            isFavorited={!!wishlist[product.id]}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
            onToggleWishlist={toggleWishlist}
            t={t}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[28px] border border-zinc-200 shadow-2xs">
          <SlidersHorizontal className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-zinc-800">{t('catalog.noProductsFound')}</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setPriceTier('all');
              setMaxPrice(500);
              onSelectCategory?.('All');
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#0C0C0C] text-white text-xs font-bold shadow-xs hover:bg-zinc-800 transition-all cursor-pointer"
          >
            {t('catalog.resetFilters')}
          </button>
        </div>
      )}
    </section>
  );
};
