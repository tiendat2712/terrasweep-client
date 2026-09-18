import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Heart, ChevronDown, Check, SlidersHorizontal, Loader2 } from 'lucide-react';
import { OceanSelect } from '@/components/common/OceanSelect';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/common/ProductCard';

interface AnimatedProductCardProps {
  product: Product;
  index: number;
  isFavorited: boolean;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product, quantityOrOrigin?: any, variant?: string, origin?: any) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  t?: (key: string, params?: Record<string, any>) => string;
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({
  product,
  index,
  isFavorited,
  onSelect,
  onToggleWishlist,
}) => {
  return (
    <ProductCard
      product={product}
      index={index}
      isFavorited={isFavorited}
      onSelect={onSelect}
      onToggleWishlist={onToggleWishlist}
    />
  );
};

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantityOrOrigin?: any, variant?: string, origin?: any) => void;
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
  const { wishlistIds, toggleWishlist: globalToggleWishlist } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');

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
    globalToggleWishlist(id, e);
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
      <div className="rounded-[32px] bg-white border border-sky-100/90 p-5 sm:p-7 shadow-sm space-y-5 mb-8 ambient-glow-sky relative">
        
        {/* TOP ROW: Title, Item Counter, Price & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full btn-ocean-primary text-white flex items-center justify-center shrink-0 shadow-xs shadow-sky-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight font-sans">
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
            {/* Price Range Filter Pill (Standardized OceanSelect Portal) */}
            <OceanSelect
              value={priceTier}
              onChange={(val) => {
                setPriceTier(val);
                if (val === 'all') setMaxPrice(500);
                else if (val === 'under-300k') setMaxPrice(15);
                else if (val === '300k-1m') setMaxPrice(50);
                else if (val === '1m-3m') setMaxPrice(150);
                else if (val === 'above-3m') setMaxPrice(500);
              }}
              options={[
                { value: 'all', label: language === 'vi' ? 'Khoảng giá' : 'Price range' },
                { value: 'under-300k', label: language === 'vi' ? 'Dưới 300.000₫' : '< 300k ₫' },
                { value: '300k-1m', label: language === 'vi' ? '300k - 1.000k' : '300k - 1M ₫' },
                { value: '1m-3m', label: language === 'vi' ? '1.000k - 3.000k' : '1M - 3M ₫' },
                { value: 'above-3m', label: language === 'vi' ? 'Trên 3.000.000₫' : '> 3M ₫' },
              ]}
              placeholder={language === 'vi' ? 'Khoảng giá' : 'Price range'}
              variant="pill"
              align="right"
              className="bg-white border-slate-200 hover:border-sky-400"
            />

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

      {/* 2. FULL-WIDTH PRODUCT CARDS GRID (SHOPEE DENSITY 2-5 COLUMNS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5">
        {filteredProducts.map((product, index) => (
          <AnimatedProductCard
            key={product.id}
            product={product}
            index={index}
            isFavorited={wishlistIds.includes(product.id)}
            onSelect={onSelectProduct}
            onAddToCart={onAddToCart}
            onToggleWishlist={toggleWishlist}
            t={t}
          />
        ))}
      </div>

      {/* Empty State (Upgraded Atmospheric Ocean with Quick Filters) */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-14 sm:py-20 rounded-[36px] ocean-surface border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky my-4">
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
              className="px-7 py-3 rounded-full btn-ocean-primary text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              {t('catalog.resetFilters')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
