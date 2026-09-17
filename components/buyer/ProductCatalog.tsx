import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Heart, ChevronDown, Check, SlidersHorizontal, Loader2 } from 'lucide-react';
import { OceanSelect } from '@/components/common/OceanSelect';

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
  const { language } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleCardAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1200);
    }, 450);
  };

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
      className={`group gloss-sweep-card rounded-[28px] bg-white border border-sky-100/90 p-4 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/12 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-pointer will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-9 scale-[0.96]'
      }`}
    >
      {/* Image Container with Ambient Subtle Tone & Zoom */}
      <div className="relative aspect-square w-full rounded-[24px] bg-gradient-to-b from-sky-50/50 via-slate-50/70 to-sky-50/30 group-hover:bg-sky-50/70 overflow-hidden flex items-center justify-center p-6 transition-all duration-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />

        {/* Top Drop Badge */}
        {product.isFlashSale && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full btn-ocean-primary text-[9.5px] font-sans font-bold uppercase tracking-wider text-white shadow-xs">
            ⚡ Drop
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={(e) => onToggleWishlist(product.id, e)}
          aria-label={
            isFavorited
              ? (language === 'vi' ? 'Bỏ sản phẩm khỏi danh sách yêu thích' : 'Remove from wishlist')
              : (language === 'vi' ? 'Thêm sản phẩm vào danh sách yêu thích' : 'Add to wishlist')
          }
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          title="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-slate-500 hover:text-sky-600'
            }`}
          />
        </button>
      </div>

      {/* Product Metadata & CTA */}
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 truncate font-sans group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-900 font-mono">
                ${priceUSD}
              </span>
              {product.originalPrice > product.flashPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ${originalPriceUSD}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-medium">
              {product.flashPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        {/* Full-width Elongated Pill "Add to Cart" Button */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={handleCardAddToCart}
          disabled={isAdding}
          aria-busy={isAdding}
          aria-label={isAdded ? (language === 'vi' ? 'Đã thêm vào giỏ' : 'Added') : (language === 'vi' ? `Thêm ${product.name} vào giỏ hàng` : `Add ${product.name} to cart`)}
          className={`w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md active:scale-95 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
            isAdded
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'btn-ocean-primary hover:shadow-sky-500/25'
          }`}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>{t('catalog.adding') || 'Đang thêm...'}</span>
            </>
          ) : isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white animate-in zoom-in-50" />
              <span>{t('catalog.added') || 'Đã thêm!'}</span>
            </>
          ) : (
            <span>{t('catalog.addToCart')}</span>
          )}
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
      <div className="rounded-[32px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 p-5 sm:p-7 shadow-sm space-y-5 mb-8 ambient-glow-sky relative">
        
        {/* TOP ROW: Title, Item Counter, Price & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-sky-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight font-sans">
                  {language === 'vi' ? 'Bộ Sưu Tập ' : 'Curated '}
                  <span className="font-serif italic font-normal text-sky-800">
                    {language === 'vi' ? 'Sản Phẩm' : 'Collection'}
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-mono font-bold">
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
                type="button"
                suppressHydrationWarning
                onClick={() => setShowPricePopover(!showPricePopover)}
                aria-label={language === 'vi' ? 'Chọn bộ lọc khoảng giá' : 'Filter by price range'}
                className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  priceTier !== 'all' || maxPrice < 500
                    ? 'btn-ocean-primary shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-500'
                }`}
              >
                <span>
                  {priceTier === 'under-300k'
                    ? '< 300.000₫'
                    : priceTier === '300k-1m'
                    ? '300k - 1tr'
                    : priceTier === '1m-3m'
                    ? '1tr - 3tr'
                    : priceTier === 'above-3m'
                    ? '> 3tr'
                    : maxPrice < 500
                    ? `< ${(maxPrice * 20).toLocaleString('vi-VN')}k ₫`
                    : language === 'vi'
                    ? 'Mức giá'
                    : 'Price range'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showPricePopover ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {/* Price Filter Floating Popover */}
              {showPricePopover && (
                <div className="absolute right-0 top-full mt-2 w-72 p-5 rounded-2xl bg-white/98 backdrop-blur-xl border border-sky-100/90 shadow-xl shadow-sky-950/10 z-30 space-y-4 animate-in fade-in zoom-in-95 ambient-glow-sky">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      {language === 'vi' ? 'LỌC THEO GIÁ' : 'PRICE FILTER'}
                    </span>
                    {(priceTier !== 'all' || maxPrice < 500) && (
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          setPriceTier('all');
                          setMaxPrice(500);
                        }}
                        className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer underline"
                      >
                        {language === 'vi' ? 'Đặt lại' : 'Reset'}
                      </button>
                    )}
                  </div>

                  {/* Quick price presets */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {[
                      { id: 'all', labelVi: 'Tất cả mức giá', labelEn: 'All prices' },
                      { id: 'under-300k', labelVi: '< 300.000₫', labelEn: '< 300k ₫' },
                      { id: '300k-1m', labelVi: '300k - 1.000k', labelEn: '300k - 1M ₫' },
                      { id: '1m-3m', labelVi: '1.000k - 3.000k', labelEn: '1M - 3M ₫' },
                      { id: 'above-3m', labelVi: '> 3.000k', labelEn: '> 3M ₫' },
                    ].map((tier) => (
                      <button
                        type="button"
                        suppressHydrationWarning
                        key={tier.id}
                        onClick={() => {
                          setPriceTier(tier.id);
                          if (tier.id === 'all') setMaxPrice(500);
                        }}
                        className={`px-3 py-2 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                          priceTier === tier.id
                            ? 'btn-ocean-primary text-white shadow-2xs'
                            : 'bg-white text-slate-700 border-sky-100/80 hover:border-sky-300 hover:bg-sky-50/40'
                        }`}
                      >
                        {language === 'vi' ? tier.labelVi : tier.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Slider */}
                  <div className="space-y-2 pt-2 border-t border-sky-100/70">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                      <span>{language === 'vi' ? 'Mức tối đa:' : 'Max limit:'}</span>
                      <span className="font-bold text-sky-700">{(maxPrice * 20).toLocaleString('vi-VN')}k ₫</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={maxPrice}
                      aria-label={language === 'vi' ? 'Giới hạn mức giá tối đa' : 'Maximum price limit'}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sort by Dropdown Pill */}
            <OceanSelect
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={[
                { value: 'popularity', label: t('catalog.sortPopularity') },
                { value: 'price-asc', label: t('catalog.sortPriceAsc') },
                { value: 'price-desc', label: t('catalog.sortPriceDesc') },
              ]}
              variant="pill"
              align="right"
              className="bg-white border-slate-200 hover:border-sky-400"
            />

            {/* Clear Filters Button (When active) */}
            {(selectedCategory !== 'All' || priceTier !== 'all' || maxPrice < 500) && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceTier('all');
                  setMaxPrice(500);
                  onSelectCategory?.('All');
                }}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-sky-600 font-semibold underline cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md"
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
                  type="button"
                  suppressHydrationWarning
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  aria-label={language === 'vi' ? `Xem danh mục ${cat.label}` : `Browse category ${cat.label}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isChecked
                      ? 'btn-ocean-primary font-bold scale-102 shadow-xs'
                      : 'bg-white/80 text-slate-600 border border-sky-100 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50'
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

      {/* Empty State (Upgraded Atmospheric Ocean with Quick Filters) */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-14 sm:py-20 rounded-[36px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky my-4">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-50 to-sky-100/70 text-sky-600 flex items-center justify-center mb-5 shadow-xs border border-sky-200/80">
              <SlidersHorizontal className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
              <span>{language === 'vi' ? 'Không Tìm Thấy Kết Quả' : 'No Results Found'}</span>
            </div>

            <p className="text-sm font-bold text-slate-900 mb-1">
              {searchQuery
                ? (language === 'vi' ? `Không có sản phẩm nào khớp với "${searchQuery}"` : `No products matching "${searchQuery}"`)
                : t('catalog.noProductsFound')}
            </p>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {language === 'vi'
                ? 'Thử điều chỉnh lại bộ lọc khoảng giá hoặc bấm chọn nhanh danh mục gợi ý bên dưới.'
                : 'Try adjusting your price range or tap a suggested category below to continue browsing.'}
            </p>

            {/* Quick Recovery Filter Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceTier('all');
                  setMaxPrice(500);
                  onSelectCategory?.('All');
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-700 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                {language === 'vi' ? 'Tất Cả Sản Phẩm' : 'All Products'}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Footwear');
                  setPriceTier('all');
                  setMaxPrice(500);
                  onSelectCategory?.('Footwear');
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                {language === 'vi' ? '👟 Giày Dép' : '👟 Footwear'}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Men Apparel');
                  setPriceTier('all');
                  setMaxPrice(500);
                  onSelectCategory?.('Men Apparel');
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                {language === 'vi' ? '👕 Thời Trang' : '👕 Apparel'}
              </button>
              <button
                onClick={() => {
                  setPriceTier('under-300k');
                  setMaxPrice(500);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                {'< 300.000₫'}
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('All');
                setPriceTier('all');
                setMaxPrice(500);
                onSelectCategory?.('All');
              }}
              className="px-7 py-3 rounded-full btn-ocean-primary text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              {t('catalog.resetFilters')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
