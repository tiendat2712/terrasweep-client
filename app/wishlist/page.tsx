'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { INITIAL_PRODUCTS, INITIAL_USERS } from '@/data/mockData';
import { Product } from '@/types';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { OceanSelect } from '@/components/common/OceanSelect';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/common/ProductCard';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Zap,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Share2,
  Eye,
  Check,
} from 'lucide-react';

interface WishlistProductCardProps {
  product: Product;
  index: number;
  isAdding: boolean;
  isAdded: boolean;
  language: 'vi' | 'en';
  formatVND: (val: number) => string;
  onNavigate: () => void;
  onToggleWishlist: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
}

function WishlistProductCard({
  product,
  index,
  isAdding,
  isAdded,
  language,
  formatVND,
  onNavigate,
  onToggleWishlist,
  onAddToCart,
}: WishlistProductCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const isInStock = (product.stock || 0) > 0;
  const staggerDelay = (index % 4) * 60;
  const discountPercent =
    product.discountPercent ||
    (product.originalPrice > product.flashPrice
      ? Math.round(((product.originalPrice - product.flashPrice) / product.originalPrice) * 100)
      : 0);

  return (
    <div
      ref={cardRef}
      onClick={onNavigate}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
        transition:
          'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className="group rounded-2xl bg-white border border-slate-200/85 hover:border-sky-300 hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden select-none will-change-transform"
    >
      {/* 1. Image Canvas Box with Discount Ribbon & Wishlist Remove */}
      <div className="aspect-square w-full rounded-t-2xl bg-slate-50/60 overflow-hidden flex items-center justify-center p-3 relative group-hover:bg-sky-50/40 transition-colors">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Right: Discount Ribbon */}
        {discountPercent > 0 && (
          <div className="absolute top-0 right-0 z-10 bg-gradient-to-l from-amber-500 to-amber-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-bl-lg shadow-2xs">
            -{discountPercent}%
          </div>
        )}

        {/* Top Left: Category Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[8.5px] uppercase tracking-tight shadow-2xs font-sans">
            {product.category || 'Official'}
          </span>
        </div>

        {/* Top Right: Remove From Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className={`absolute ${
            discountPercent > 0 ? 'top-8 right-2' : 'top-2 right-2'
          } w-7 h-7 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-2xs transition-transform active:scale-90 cursor-pointer z-20`}
          title={language === 'vi' ? 'Bỏ thích sản phẩm này' : 'Remove from wishlist'}
          aria-label={language === 'vi' ? 'Bỏ thích sản phẩm' : 'Remove item'}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </button>

        {/* Bottom Left: Micro Voucher Badge */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-extrabold text-[8px] uppercase tracking-tight shadow-2xs font-sans">
            VOUCHER XTRA
          </span>
        </div>
      </div>

      {/* 2. Metadata Body (Clean 2-line title, deals, price, stock) */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Stock & Availability Bar */}
          <div className="flex items-center justify-between gap-1 text-[10.5px] mb-1.5 font-sans">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200/70">
              TerraVerified
            </span>
            {isInStock ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{language === 'vi' ? `Còn ${product.stock || 12} sp` : `${product.stock || 12} in stock`}</span>
              </span>
            ) : (
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>{language === 'vi' ? 'Hết hàng' : 'Out of stock'}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-[13px] font-medium text-slate-800 line-clamp-2 min-h-[2.4rem] leading-snug group-hover:text-sky-600 transition-colors font-sans">
            {product.name}
          </h3>

          {/* Micro Deal Pills */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap font-sans">
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60">
              {language === 'vi' ? 'Rẻ Vô Địch' : 'Best Price'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
              {language === 'vi' ? 'Hỏa Tốc 2H' : 'Fast 2H'}
            </span>
          </div>
        </div>

        {/* Price & Sales Row */}
        <div className="space-y-2 mt-auto pt-1">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-rose-600 font-mono tabular-nums tracking-tight">
                {formatVND(product.flashPrice)}
              </span>
              {product.originalPrice > product.flashPrice && (
                <span className="text-[10.5px] text-slate-400 line-through font-mono tabular-nums">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-sans tabular-nums whitespace-nowrap">
              {product.salesCount || (language === 'vi' ? '1.2k+ đã bán' : '1.2k+ sold')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
  formatVND?: (val: number) => string;
}) {
  const router = useRouter();
  return (
    <ProductCard
      product={product}
      index={index}
      onSelect={(p) => router.push(`/${p.id}`)}
      showWishlist={false}
    />
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    cartItems,
    addToCart,
    wishlistIds,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    moveAllWishlistToCart,
    currentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    triggerToast,
  } = useCart();

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'on-sale'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'discount'>('recent');

  // Interactive Async Feedback State
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isMovingAll, setIsMovingAll] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Currency Formatter
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  // Resolve Products in Wishlist from master catalog
  const wishlistedProducts: Product[] = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  // Extract available categories from wishlisted products
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    wishlistedProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [wishlistedProducts]);

  // Statistics for the Summary Bar
  const inStockCount = useMemo(() => {
    return wishlistedProducts.filter((p) => (p.stock || 0) > 0).length;
  }, [wishlistedProducts]);

  const onSaleCount = useMemo(() => {
    return wishlistedProducts.filter((p) => (p.discountPercent || 0) > 0 || p.isFlashSale).length;
  }, [wishlistedProducts]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return wishlistedProducts
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = p.name.toLowerCase().includes(q);
          const catMatch = p.category?.toLowerCase().includes(q);
          const sellerMatch = p.sellerName?.toLowerCase().includes(q);
          if (!nameMatch && !catMatch && !sellerMatch) return false;
        }

        // Category Filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Stock / Deal Filter
        if (stockFilter === 'in-stock' && (p.stock || 0) <= 0) {
          return false;
        }
        if (stockFilter === 'on-sale' && (p.discountPercent || 0) <= 0 && !p.isFlashSale) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.flashPrice - b.flashPrice;
        if (sortBy === 'price-desc') return b.flashPrice - a.flashPrice;
        if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
        return 0; // 'recent' retains insertion order
      });
  }, [wishlistedProducts, searchQuery, selectedCategory, stockFilter, sortBy]);

  // Curated Recommendation Products (for bottom section or empty state)
  const recommendedProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => !wishlistIds.includes(p.id)).slice(0, 6);
  }, [wishlistIds]);

  // Single Item Add-To-Cart with Haptic Animation
  const handleAddSingleItem = (product: Product, e?: React.MouseEvent) => {
    if ((product.stock || 0) <= 0 || addingProductId === product.id) return;

    const origin = e ? { x: e.clientX, y: e.clientY } : undefined;
    setAddingProductId(product.id);
    setTimeout(() => {
      addToCart(product, 1, 'M / Pure White', origin);
      setAddingProductId(null);
      setAddedProductId(product.id);

      setTimeout(() => {
        setAddedProductId(null);
      }, 1500);
    }, 250);
  };

  // Move All In-Stock to Cart
  const handleMoveAllToCart = () => {
    if (inStockCount === 0 || isMovingAll) return;
    setIsMovingAll(true);
    setTimeout(() => {
      moveAllWishlistToCart();
      setIsMovingAll(false);
    }, 600);
  };

  // Clear All Confirmation
  const handleConfirmClear = () => {
    clearWishlist();
    setShowClearConfirmModal(false);
  };

  // Copy shareable link
  const handleShareWishlist = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      triggerToast(
        language === 'vi'
          ? 'Đã sao chép liên kết danh sách yêu thích vào clipboard!'
          : 'Copied wishlist link to clipboard!',
        'success'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. TOP SINGLE-TIER LUXURY NAVBAR */}
      <BuyerHeader
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => router.push('/cart')}
        onOpenTracking={() => router.push('/orders')}
        onSearch={() => router.push('/#collection-section')}
        searchQuery=""
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchRole={(role) => setActiveRole(role)}
      />

      {/* 2. MAIN WISHLIST CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {language === 'vi' ? 'Sản Phẩm Yêu Thích' : 'My Wishlist'}
          </span>
          {wishlistIds.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-mono font-bold border border-rose-200/80">
              {wishlistIds.length} {language === 'vi' ? 'mục đã lưu' : 'saved items'}
            </span>
          )}
        </nav>

        {/* 3. HERO SUMMARY CARD (Double-Bezel Atmospheric Ocean) */}
        <div className="relative rounded-[32px] bg-white border border-sky-100/90 p-6 sm:p-8 shadow-sm ambient-glow-sky mb-8 overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{language === 'vi' ? 'Bộ Sưu Tập Yêu Thích' : 'Curated Wishlist Hub'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {language === 'vi' ? 'Sản Phẩm Bạn Đã Thả Tim' : 'Your Saved & Liked Drops'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                {language === 'vi'
                  ? 'Theo dõi biến động giá sốc, tình trạng tồn kho tức thì và thanh toán nhanh chóng chỉ với 1 cú chạm.'
                  : 'Track real-time flash sales, stock availability, and checkout instantly with high-velocity 1-click controls.'}
              </p>
            </div>

            {/* Metric KPI Pills */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-sky-100/90 shadow-2xs text-center flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-sans tabular-nums">
                  {wishlistedProducts.length}
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {language === 'vi' ? 'Đã Lưu' : 'Saved'}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-sky-100/90 shadow-2xs text-center flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-sky-600 font-sans tabular-nums flex items-center gap-1">
                  <Zap className="w-4 h-4 text-sky-500 fill-sky-500" />
                  <span>{onSaleCount}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {language === 'vi' ? 'Giảm Sốc' : 'On Sale'}
                </span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-sky-100/90 shadow-2xs text-center flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-sans tabular-nums flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  <span>{inStockCount}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {language === 'vi' ? 'Sẵn Hàng' : 'In Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: WISHLIST HAS PRODUCTS                                             */}
        {/* ========================================================================= */}
        {wishlistedProducts.length > 0 && (
          <div className="space-y-6">
            
            {/* 4. INTERACTIVE TOOLBAR & CONTROLS */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100/90 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Left: Search & Filter Chips */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'vi' ? 'Tìm trong danh sách thích...' : 'Filter wishlist...'}
                    aria-label={language === 'vi' ? 'Tìm trong danh sách thích' : 'Filter wishlist'}
                    className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-50/80 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Stock Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: language === 'vi' ? 'Tất Cả' : 'All' },
                    { id: 'in-stock', label: language === 'vi' ? '⚡ Còn Hàng' : '⚡ In Stock' },
                    { id: 'on-sale', label: language === 'vi' ? '🔥 Giảm Giá' : '🔥 On Sale' },
                  ].map((filter) => {
                    const isActive = stockFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setStockFilter(filter.id as any)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                          isActive
                            ? 'btn-ocean-primary text-white shadow-xs'
                            : 'bg-white border border-sky-100/90 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Sort & Batch Actions */}
              <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Sort Dropdown Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                    {language === 'vi' ? 'Sắp xếp:' : 'Sort:'}
                  </span>
                  <OceanSelect
                    value={sortBy}
                    onChange={(val) => setSortBy(val as any)}
                    options={[
                      { value: 'recent', label: language === 'vi' ? 'Mới thêm gần đây' : 'Recently Added' },
                      { value: 'price-asc', label: language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High' },
                      { value: 'price-desc', label: language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low' },
                      { value: 'discount', label: language === 'vi' ? '% Giảm nhiều nhất' : 'Biggest Discount' },
                    ]}
                    variant="pill"
                    size="sm"
                    align="right"
                    className="bg-white border-slate-200"
                  />
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShareWishlist}
                  className="w-8 h-8 rounded-full border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title={language === 'vi' ? 'Chia sẻ danh sách' : 'Share wishlist'}
                  aria-label="Share wishlist"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                {/* Move All to Cart Action Button */}
                <button
                  onClick={handleMoveAllToCart}
                  disabled={inStockCount === 0 || isMovingAll}
                  aria-busy={isMovingAll}
                  aria-label={language === 'vi' ? 'Chuyển tất cả sản phẩm còn hàng vào giỏ hàng' : 'Move all in-stock items to cart'}
                  className="px-4 sm:px-5 py-2 rounded-full btn-ocean-primary text-white text-xs font-extrabold flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {isMovingAll ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>{language === 'vi' ? 'Đang chuyển...' : 'Adding all...'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? `Thêm Hết Vào Giỏ (${inStockCount})` : `Add All In-Stock (${inStockCount})`}</span>
                    </>
                  )}
                </button>

                {/* Clear All Button */}
                <button
                  onClick={() => setShowClearConfirmModal(true)}
                  className="px-3 py-2 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                  title={language === 'vi' ? 'Xóa toàn bộ danh sách yêu thích' : 'Clear all wishlist'}
                  aria-label="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline-block">{language === 'vi' ? 'Xóa hết' : 'Clear'}</span>
                </button>
              </div>
            </div>

            {/* Category Sub-Filters (if > 1 categories available) */}
            {availableCategories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs text-slate-500 font-semibold shrink-0">
                  {language === 'vi' ? 'Ngành hàng:' : 'Category:'}
                </span>
                {availableCategories.map((cat) => {
                  const count = cat === 'All'
                    ? wishlistedProducts.length
                    : wishlistedProducts.filter((p) => p.category === cat).length;
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-sky-100/80 text-sky-800 border border-sky-300 shadow-2xs font-bold'
                          : 'bg-white border border-slate-200/80 text-slate-600 hover:border-sky-200 hover:bg-sky-50/40'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="ml-1.5 opacity-60 text-[10px] font-mono font-bold">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 5. PRODUCT CARDS RESPONSIVE GRID */}
            {filteredProducts.length > 0 ? (
              <div
                key={`wishlist-grid-${selectedCategory}-${stockFilter}-${searchQuery}`}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <WishlistProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isAdding={addingProductId === product.id}
                    isAdded={addedProductId === product.id}
                    language={language}
                    formatVND={formatVND}
                    onNavigate={() => router.push(`/${product.id}`)}
                    onToggleWishlist={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id, e);
                    }}
                    onAddToCart={(e) => handleAddSingleItem(product, e)}
                  />
                ))}
              </div>
            ) : (
              /* No matches found from search/filter */
              <div className="rounded-[32px] bg-white border border-sky-100/90 p-10 text-center shadow-sm">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {language === 'vi' ? 'Không tìm thấy sản phẩm phù hợp' : 'No matching items found'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {language === 'vi' ? 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.' : 'Try changing your search terms or resetting filters.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setStockFilter('all');
                  }}
                  className="px-5 py-2 rounded-full border-2 border-sky-400/90 bg-white hover:bg-sky-50 text-sky-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Đặt lại bộ lọc' : 'Reset Filters'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 2: EMPTY WISHLIST STATE                                              */}
        {/* ========================================================================= */}
        {wishlistedProducts.length === 0 && (
          <div className="rounded-[36px] ocean-surface border border-sky-100/90 p-8 sm:p-14 text-center shadow-sm my-6 max-w-2xl mx-auto relative overflow-hidden ambient-glow-sky">
            {/* Ambient Water Spotlight */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Luxury Glassmorphic Heart Icon */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-50 via-sky-50 to-sky-100/60 text-rose-500 flex items-center justify-center mb-6 shadow-sm border border-rose-200/70 relative group">
                <Heart className="w-11 h-11 transition-transform group-hover:scale-110 duration-300 fill-rose-500/20 text-rose-500" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-amber-500 border border-amber-200 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
                <span>{language === 'vi' ? 'Danh Sách Trống' : 'Wishlist Empty'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight font-sans">
                {language === 'vi' ? 'Chưa Có Sản Phẩm Trong Danh Sách Thích' : 'Your Wishlist is Currently Empty'}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
                {language === 'vi'
                  ? 'Hãy chạm vào biểu tượng trái tim trên bất kỳ thiết kế sneakers hoặc trang phục nào bạn yêu thích để lưu trữ và đón nhận cảnh báo giảm giá!'
                  : 'Tap the heart icon on any sneaker or apparel drop to save it to your personal wishlist and track exclusive price cuts!'}
              </p>

              {/* Quick Jump Category Chips */}
              <div className="flex items-center justify-center flex-wrap gap-2 mb-8 max-w-lg">
                {[
                  { label: '⚡ Flash Sale 2H', href: '/#flash-sale' },
                  { label: '👟 Sneakers Đương Đại', href: '/#collection-section' },
                  { label: '🎧 Cyber Audio', href: '/#collection-section' },
                  { label: '👕 Thời Trang Nam', href: '/#collection-section' },
                ].map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50/80 border border-sky-100 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all shadow-2xs active:scale-95"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              {/* Primary High-End CTA */}
              <Link
                href="/#collection-section"
                className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-full btn-ocean-primary font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 active:scale-95 transition-all text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'vi' ? 'KHÁM PHÁ BỘ SƯU TẬP NGAY' : 'EXPLORE COLLECTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CURATED SUGGESTIONS SECTION: "CÓ THỂ BẠN CŨNG THÍCH"                    */}
        {/* ========================================================================= */}
        <section className="mt-16 pt-10 border-t border-sky-100/90">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-100/80 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {language === 'vi' ? 'Có Thể Bạn Cũng Thích' : 'Curated Just For You'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'Các mẫu thiết kế thịnh hành được cộng đồng yêu thích nhất' : 'Popular drops recommended by the TerraSweep community'}
                </p>
              </div>
            </div>

            <Link
              href="/#collection-section"
              className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 group transition-colors"
            >
              <span>{language === 'vi' ? 'Xem Tất Cả' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {recommendedProducts.map((rec, recIndex) => (
              <RecommendedProductCard
                key={rec.id}
                product={rec}
                index={recIndex}
                formatVND={formatVND}
              />
            ))}
          </div>
        </section>

      </main>

      {/* 7. CONFIRM CLEAR MODAL */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-sky-100 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1.5">
              {language === 'vi' ? 'Xác nhận xóa tất cả?' : 'Clear all wishlist items?'}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              {language === 'vi'
                ? `Hành động này sẽ xóa toàn bộ ${wishlistedProducts.length} sản phẩm khỏi danh sách yêu thích của bạn.`
                : `This action will remove all ${wishlistedProducts.length} saved items from your wishlist.`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
              >
                {language === 'vi' ? 'Xóa Hết' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. GLOBAL AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        onLogin={(user, role) => handleLogin(user, role)}
        currentRole={activeRole}
      />

      {/* 9. UNIFIED EDITORIAL FOOTER */}
      <Footer />
    </div>
  );
}
