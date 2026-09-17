'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_PRODUCTS, TOP_SEARCH_ITEMS, INITIAL_USERS } from '@/data/mockData';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { Footer } from '@/components/common/Footer';
import {
  Star,
  Zap,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Sparkles,
  Truck,
  Flame,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.productId as string) || '';

  const { language, t } = useLanguage();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    handleLogin,
    activeRole,
    setActiveRole,
    triggerToast,
  } = useCart();

  // Find product from mock catalog
  const product: Product | undefined = useMemo(() => {
    const directMatch = INITIAL_PRODUCTS.find((p) => p.id === productId);
    if (directMatch) return directMatch;

    // Check top search items
    const topMatch = TOP_SEARCH_ITEMS.find((item) => item.id === productId);
    if (topMatch) {
      return {
        id: topMatch.id,
        name: language === 'vi' ? topMatch.nameVi : topMatch.nameEn,
        originalPrice: Math.round(topMatch.price * 1.3),
        flashPrice: topMatch.price,
        discountPercent: 25,
        rating: 4.9,
        reviewCount: 382,
        salesCount: topMatch.salesMonthly,
        stock: 18,
        category: topMatch.category,
        image: topMatch.image,
        tags: ['Trending', 'Top Seller'],
        badge: 'Mall',
        description:
          language === 'vi'
            ? 'Sản phẩm nằm trong top tìm kiếm xu hướng thịnh hành, được kiểm định chất lượng nghiêm ngặt bởi TerraSweep.'
            : 'Top trending curated piece verified for authenticity and precision craftsmanship by TerraSweep.',
        specs: {
          'Origin': 'Official Distribution',
          'Quality': 'Grade A+ Authentic',
          'Warranty': '12 Months Official',
        },
        sellerName: 'TerraSweep Official Flagship',
      };
    }

    // Fallback: match by partial ID or default to first product
    return INITIAL_PRODUCTS[0];
  }, [productId, language]);

  // Product interactivity state
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Pure White');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Keep active image in sync if product changes
  React.useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Color Swatches
  const colorOptions = useMemo(
    () => [
      { name: 'Pure White', hex: '#FFFFFF', border: 'border-slate-300' },
      { name: 'Cloud Grey', hex: '#E2E8F0', border: 'border-slate-300' },
      { name: 'Slate Fog', hex: '#CBD5E1', border: 'border-slate-400' },
      { name: 'Obsidian Black', hex: '#0F172A', border: 'border-slate-900' },
      { name: 'Ocean Azure', hex: '#0EA5E9', border: 'border-sky-400' },
    ],
    []
  );

  // Size Options (Adapt based on category)
  const sizeOptions = useMemo(() => {
    if (product?.category === 'Footwear' || product?.name.toLowerCase().includes('giày') || product?.name.toLowerCase().includes('runner')) {
      return ['39', '40', '41', '42', '43'];
    }
    return ['S', 'M', 'L', 'XL'];
  }, [product]);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  // Related products
  const relatedProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => p.id !== product?.id).slice(0, 4);
  }, [product]);

  // Handle Add to Cart with backend simulation & visual success micro-interaction
  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart(product, quantity, `${selectedSize} / ${selectedColor}`);
      setIsAddingToCart(false);
      setJustAddedToCart(true);
      setTimeout(() => {
        setJustAddedToCart(false);
      }, 1500);
    }, 450);
  };

  // Handle direct Buy Now action with async session initiation
  const handleBuyNow = () => {
    if (!product || isBuyingNow) return;
    setIsBuyingNow(true);
    setTimeout(() => {
      addToCart(product, quantity, `${selectedSize} / ${selectedColor}`);
      router.push('/cart');
    }, 550);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {language === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product Not Found'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {language === 'vi'
            ? 'Sản phẩm bạn đang tìm kiếm có thể đã hết hàng hoặc không tồn tại.'
            : 'The product you are looking for might be out of stock or does not exist.'}
        </p>
        <Link
          href="/"
          className="btn-ocean-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-sm"
        >
          {language === 'vi' ? '← Quay lại trang chủ' : '← Return to Storefront'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900">
      {/* Top Single-Tier Luxury Header */}
      <BuyerHeader
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => router.push('/cart')}
        onOpenTracking={() => {}}
        onSearch={() => {}}
        searchQuery=""
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchRole={(role) => setActiveRole(role)}
      />

      {/* Main Product Details View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation Bar */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 sm:mb-8 font-medium">
          <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/#collection-section" className="hover:text-sky-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Product Layout (1:1 with User Reference Images) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Large Hero Image Gallery & Assurance Seals                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Primary Image Showcase Container */}
            <div className="relative rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 p-8 sm:p-12 shadow-sm ambient-glow-sky flex items-center justify-center overflow-hidden aspect-4/3 sm:aspect-square group">
              {/* Dynamic Water Ambient Glow Spotlight */}
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Discount / Drop Badge (Top Left) */}
              {product.discountPercent > 0 && (
                <div className="absolute top-5 left-5 px-3 py-1 rounded-full btn-ocean-primary text-white font-mono font-bold text-[11px] uppercase tracking-wider shadow-xs z-10">
                  -{product.discountPercent}% OFF
                </div>
              )}

              {/* Wishlist Button (Top Right) */}
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  triggerToast(
                    !isWishlisted
                      ? language === 'vi'
                        ? 'Đã thêm vào danh sách yêu thích'
                        : 'Added to wishlist'
                      : language === 'vi'
                      ? 'Đã bỏ khỏi danh sách yêu thích'
                      : 'Removed from wishlist',
                    'info'
                  );
                }}
                aria-label={
                  isWishlisted
                    ? language === 'vi'
                      ? 'Bỏ sản phẩm khỏi danh sách yêu thích'
                      : 'Remove product from wishlist'
                    : language === 'vi'
                    ? 'Thêm sản phẩm vào danh sách yêu thích'
                    : 'Add product to wishlist'
                }
                className={`absolute top-5 right-5 w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm'
                    : 'bg-white/80 backdrop-blur-md border-sky-100 text-slate-400 hover:text-rose-500 hover:border-sky-200 shadow-2xs'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* High-Resolution Hero Product Image */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out select-none"
              />
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="grid grid-cols-4 gap-3">
              {[product.image, ...INITIAL_PRODUCTS.slice(1, 4).map((p) => p.image)].map(
                (thumbUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumbUrl)}
                    aria-label={language === 'vi' ? `Xem ảnh chi tiết ${idx + 1}` : `View product angle ${idx + 1}`}
                    className={`aspect-square rounded-2xl p-2.5 bg-white border transition-all cursor-pointer overflow-hidden flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      activeImage === thumbUrl
                        ? 'border-sky-500 ring-2 ring-sky-300/80 shadow-xs'
                        : 'border-sky-100/90 hover:border-sky-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                )
              )}
            </div>

            {/* 3 Pillar Trust Seals Under Image */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/80 border border-sky-100/80 flex flex-col items-center text-center shadow-2xs">
                <Zap className="w-4 h-4 text-sky-600 mb-1" />
                <span className="text-[10.5px] font-bold text-slate-800">
                  {language === 'vi' ? 'Hỏa Tốc 2H' : 'Express 2H'}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">TerraFleet</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-sky-100/80 flex flex-col items-center text-center shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[10.5px] font-bold text-slate-800">
                  {language === 'vi' ? '100% Authentic' : '100% Authentic'}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">Verified</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-sky-100/80 flex flex-col items-center text-center shadow-2xs">
                <RotateCcw className="w-4 h-4 text-sky-600 mb-1" />
                <span className="text-[10.5px] font-bold text-slate-800">
                  {language === 'vi' ? 'Đổi Trả 7 Ngày' : '7-Day Return'}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">Seamless</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Product Identity, Controls & Actions                        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col space-y-6 relative">
            
            {/* Header: Title, Reviews, Price & Rotating Emblem Seal */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Editorial Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>{product.category}</span>
                </div>

                {/* Big Editorial Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Star Rating & Social Proof */}
                <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-600">
                    ({product.reviewCount || 124} {language === 'vi' ? 'đánh giá' : 'Reviews'})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-500 font-medium">
                    {product.salesCount || '1.2k+ đã bán'}
                  </span>
                </div>

                {/* Price Display: Prominent VND Currency */}
                <div className="pt-2 flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight font-sans">
                    {formatVND(product.flashPrice)}
                  </span>
                  {product.originalPrice > product.flashPrice && (
                    <span className="text-base font-sans text-slate-500 line-through font-medium">
                      {formatVND(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full btn-ocean-primary text-white text-xs font-bold font-sans shadow-2xs">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Rotating Circular Brand Watermark Emblem (Exact Match with Image 1 & 2) */}
              <div className="hidden sm:flex relative w-24 h-24 shrink-0 items-center justify-center select-none pointer-events-none opacity-85">
                {/* Rotating SVG Circular Text */}
                <svg
                  className="w-full h-full animate-[spin_16s_linear_infinite] text-sky-800/40"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-mono font-bold tracking-[2.8px] uppercase fill-sky-800/60">
                    <textPath href="#circlePath">
                      TERRASWEEP • AUTHENTIC • LUXURY •
                    </textPath>
                  </text>
                </svg>
                {/* Center Glowing Icon Emblem */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-100 to-cyan-50 border border-sky-200 flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-sky-100/70" />

            {/* SELECT SIZE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'vi' ? 'CHỌN KÍCH THƯỚC' : 'SELECT SIZE'}
                </label>
                <a
                  href="#size-guide"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerToast(
                      language === 'vi'
                        ? 'Kích cỡ chuẩn quốc tế. Nên chọn đúng size thông thường.'
                        : 'True to size. Choose your standard size.',
                      'info'
                    );
                  }}
                  className="text-[11px] text-sky-600 hover:text-sky-800 underline font-medium"
                >
                  {language === 'vi' ? 'Bảng quy đổi size' : 'Size Guide'}
                </a>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-label={language === 'vi' ? `Chọn kích thước ${size}` : `Select size ${size}`}
                    className={`min-w-12 h-12 px-3 rounded-2xl border flex items-center justify-center font-bold text-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      selectedSize === size
                        ? 'btn-ocean-primary text-white shadow-md shadow-sky-500/20 scale-105 border-transparent'
                        : 'bg-white border-sky-100/90 text-slate-800 hover:border-sky-300 hover:bg-sky-50/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLORS SELECTION */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'vi' ? 'MÀU SẮC' : 'COLORS'}
                </label>
                <span className="text-xs text-slate-500 font-medium">({selectedColor})</span>
              </div>

              <div className="flex items-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={language === 'vi' ? `Chọn màu sắc ${c.name}` : `Select color ${c.name}`}
                    className={`w-7 h-7 rounded-full transition-all cursor-pointer relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      c.border
                    } ${
                      selectedColor === c.name
                        ? 'ring-2 ring-sky-500 ring-offset-2 scale-110 shadow-xs'
                        : 'hover:scale-110 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.hex === '#FFFFFF' || c.hex === '#E2E8F0'
                            ? 'bg-slate-900'
                            : 'bg-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY & ACTIONS ROW */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Pill Capsule */}
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    aria-label={language === 'vi' ? 'Giảm số lượng' : 'Decrease quantity'}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    aria-label={language === 'vi' ? 'Tăng số lượng' : 'Increase quantity'}
                  >
                    +
                  </button>
                </div>

                {/* Secondary CTA: Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  aria-busy={isAddingToCart}
                  aria-label={language === 'vi' ? 'Thêm sản phẩm vào giỏ hàng' : 'Add product to cart'}
                  className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    justAddedToCart
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-sky-400/90 bg-white hover:bg-sky-50 text-sky-700'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                      <span>{language === 'vi' ? 'Đang thêm...' : 'Adding...'}</span>
                    </>
                  ) : justAddedToCart ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50" />
                      <span>{language === 'vi' ? 'Đã thêm vào giỏ!' : 'Added to bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{language === 'vi' ? 'Thêm vào giỏ hàng' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Primary Instant Checkout Button */}
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                aria-busy={isBuyingNow}
                aria-label={language === 'vi' ? 'Thanh toán ngay sản phẩm này' : 'Buy it now with instant checkout'}
                className="w-full py-3.5 px-6 rounded-full btn-ocean-primary hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                {isBuyingNow ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'vi' ? 'ĐANG CHUYỂN TỚI THANH TOÁN...' : 'PROCEEDING TO CHECKOUT...'}</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{language === 'vi' ? 'Thanh toán ngay' : 'Buy It Now'}</span>
                    <span className="text-white/60">•</span>
                    <span className="font-sans text-white font-black tracking-normal">
                      {formatVND(product.flashPrice * quantity)}
                    </span>
                  </>
                )}
              </button>
            </div>

            <hr className="border-sky-100/70" />

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'vi' ? 'MÔ TẢ SẢN PHẨM' : 'DESCRIPTION'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {product.description ||
                  'Engineered for the modern minimalist. This piece features precision craftsmanship, responsive bio-foam cushioning, and an architectural silhouette that transitions seamlessly from active moments to contemporary settings.'}
              </p>
            </div>

            {/* SPECS LIST */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'vi' ? 'THÔNG SỐ KỸ THUẬT' : 'SPECIFICATIONS'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-white/70 border border-sky-100/70 flex items-center justify-between"
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-bold font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MERCHANT BADGE */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-transparent border border-sky-100/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{product.sellerName}</h4>
                  <p className="text-[10.5px] text-slate-500">
                    {language === 'vi' ? 'Nhà bán hàng chứng thực' : 'Verified Flagship Merchant'}
                  </p>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-full border border-sky-200">
                Mall Official
              </span>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RELATED CURATED PRODUCTS                                                  */}
        {/* ========================================================================= */}
        <section className="mt-16 sm:mt-24 pt-10 border-t border-sky-100/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'vi' ? 'Sản Phẩm Tương Tự' : 'You May Also Like'}
            </h2>
            <Link
              href="/#collection-section"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>{language === 'vi' ? 'Xem tất cả' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/${rel.id}`}
                className="group rounded-[24px] bg-white border border-sky-100/90 p-4 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                <div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-b from-slate-50/80 to-sky-50/20 border border-sky-50 overflow-hidden flex items-center justify-center p-3 mb-3 relative group-hover:bg-sky-50/40 transition-colors">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.discountPercent > 0 && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full btn-ocean-primary text-white font-bold text-[9.5px] shadow-xs">
                        -{rel.discountPercent}%
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                    {rel.name}
                  </h4>
                </div>
                <div className="mt-3 flex items-baseline justify-between pt-2.5 border-t border-sky-50">
                  <span className="font-extrabold text-sm text-sky-700 font-sans">
                    {formatVND(rel.flashPrice)}
                  </span>
                  {rel.originalPrice > rel.flashPrice && (
                    <span className="text-[11px] text-slate-400 line-through font-sans">
                      {formatVND(rel.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        onLogin={(user, role) => handleLogin(user, role)}
        currentRole={activeRole}
      />

      {/* Unified Atmospheric Ocean Footer */}
      <Footer />
    </div>
  );
}
