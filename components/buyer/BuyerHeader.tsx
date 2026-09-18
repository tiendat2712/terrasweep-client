'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { PlatformUser, Role } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Search,
  ShoppingCart,
  Truck,
  ChevronDown,
  ArrowUpRight,
  Store,
  ShieldCheck,
  LogOut,
  X,
  Menu,
  Sparkles,
  Package,
  User,
  Heart,
  CreditCard,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface BuyerHeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentUser?: PlatformUser;
  onOpenAuthModal: () => void;
  onSwitchRole: (role: Role) => void;
}

export const BuyerHeader: React.FC<BuyerHeaderProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenTracking,
  onSearch,
  searchQuery,
  currentUser,
  onOpenAuthModal,
  onSwitchRole,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { wishlistIds, cartBounceCount, wishlistBounceCount, cartItems } = useCart();
  const wishlistCount = wishlistIds?.length || 0;
  const effectiveCartCount = cartItems
    ? cartItems.reduce((sum, item) => {
        const rawQty = item?.quantity;
        let cleanQty = 1;
        if (typeof rawQty === 'number' && !isNaN(rawQty) && rawQty > 0) {
          cleanQty = Math.floor(rawQty);
        } else if (typeof rawQty === 'string') {
          const parsed = parseInt(rawQty, 10);
          cleanQty = !isNaN(parsed) && parsed > 0 ? parsed : 1;
        }
        return sum + cleanQty;
      }, 0)
    : (typeof cartItemCount === 'number' && !isNaN(cartItemCount) ? cartItemCount : 0);
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States for celebratory impact animations
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [showCartPlusOne, setShowCartPlusOne] = useState(false);
  const [isWishlistBouncing, setIsWishlistBouncing] = useState(false);
  const [showWishlistPlusOne, setShowWishlistPlusOne] = useState(false);

  // Trigger bounce on cart arrival
  const prevCartBounceRef = useRef(cartBounceCount);
  useEffect(() => {
    if (cartBounceCount > prevCartBounceRef.current) {
      setIsCartBouncing(true);
      setShowCartPlusOne(true);
      const timer1 = setTimeout(() => setIsCartBouncing(false), 580);
      const timer2 = setTimeout(() => setShowCartPlusOne(false), 850);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
    prevCartBounceRef.current = cartBounceCount;
  }, [cartBounceCount]);

  // Trigger bounce on wishlist arrival
  const prevWishlistBounceRef = useRef(wishlistBounceCount);
  useEffect(() => {
    if (wishlistBounceCount > prevWishlistBounceRef.current) {
      setIsWishlistBouncing(true);
      setShowWishlistPlusOne(true);
      const timer1 = setTimeout(() => setIsWishlistBouncing(false), 580);
      const timer2 = setTimeout(() => setShowWishlistPlusOne(false), 850);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
    prevWishlistBounceRef.current = wishlistBounceCount;
  }, [wishlistBounceCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click or escape
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu]);

  const handleNavClick = (hash?: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      if (!hash) {
        router.push('/');
      } else {
        router.push(`/${hash}`);
      }
      return;
    }
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTriggerSearch = () => {
    if (pathname !== '/') {
      router.push('/#collection-section');
    } else {
      handleNavClick('#collection-section');
    }
  };

  const trendingTags = [
    'TerraRunner X1',
    'VoidWalk Low',
    'Apex Drift',
    'AeroKnit Studio',
    language === 'vi' ? 'Áo Hoodie' : 'Heavy Hoodie',
    language === 'vi' ? 'Quần Cargo' : 'Cargo Pants',
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SINGLE-TIER LUXURY NAVBAR (STRICT 1:1 MATCH WITH REFERENCE IMAGE 1)   */}
      {/* ========================================================================= */}
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm'
            : 'bg-white/90 backdrop-blur-md border-b border-sky-100/70 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: TerraSweep Brand Identity Lockup (Integrated mark & wordmark) */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  if (onSearch) onSearch('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  if (onSearch) onSearch('');
                }
              }}
              className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none caret-transparent text-left outline-none focus:outline-none"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-100/80 shadow-2xs group-hover:border-sky-200 transition-colors pointer-events-none select-none">
                <img
                  src="/images/brand-logo.webp"
                  alt="TerraSweep"
                  draggable={false}
                  className="w-full h-full object-contain mix-blend-multiply scale-140 group-hover:scale-150 transition-transform duration-300 pointer-events-none select-none"
                />
              </div>
              <span className="text-[18px] sm:text-[24px] md:text-[26px] font-black tracking-[-0.03em] font-sans group-hover:opacity-90 transition-opacity whitespace-nowrap select-none caret-transparent">
                <span className="text-slate-900 select-none">Terra</span>
                <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-700 bg-clip-text text-transparent select-none">Sweep</span>
              </span>
            </Link>
          </div>

          {/* CENTER: 4 Editorial Navigation Links with Refined Proportions */}
          <nav className="hidden xl:flex items-center gap-1 sm:gap-1.5 lg:gap-2.5 xl:gap-4 shrink-0">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  if (onSearch) onSearch('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  if (onSearch) onSearch('');
                }
              }}
              className="px-3.5 py-1.5 rounded-full text-[13.5px] lg:text-[14px] xl:text-[14.5px] font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-100/70 active:bg-sky-50 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {t('nav.home')}
            </Link>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavClick('#about-section')}
              className="px-3.5 py-1.5 rounded-full text-[13.5px] lg:text-[14px] xl:text-[14.5px] font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-100/70 active:bg-sky-50 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {t('nav.aboutUs')}
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavClick('#why-us-section')}
              className="px-3.5 py-1.5 rounded-full text-[13.5px] lg:text-[14px] xl:text-[14.5px] font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-100/70 active:bg-sky-50 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {t('nav.whyUs')}
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavClick('#services-section')}
              className="px-3.5 py-1.5 rounded-full text-[13.5px] lg:text-[14px] xl:text-[14.5px] font-medium text-slate-600 hover:text-sky-600 hover:bg-slate-100/70 active:bg-sky-50 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {t('nav.ourServices')}
            </button>
          </nav>

          {/* RIGHT: Controls (Language Switcher, Search Icon, Cart, Capsule Login Button) */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            
            {/* [ VI | EN ] Language Switcher */}
            <div className="hidden sm:flex items-center rounded-full bg-slate-100 p-0.5 text-[10px] font-mono font-bold border border-slate-200 select-none">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setLanguage('vi')}
                aria-label={language === 'vi' ? 'Đang chọn Tiếng Việt' : 'Chuyển sang Tiếng Việt'}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  language === 'vi'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setLanguage('en')}
                aria-label={language === 'en' ? 'English selected' : 'Switch language to English'}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  language === 'en'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                EN
              </button>
            </div>

            {/* Customer Wishlist Heart Pill Button (Redirects to /wishlist) */}
            <Link
              id="header-wishlist-btn"
              href="/wishlist"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border bg-white flex items-center justify-center relative shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                isWishlistBouncing
                  ? 'animate-header-bounce border-rose-400 shadow-md shadow-rose-500/25 text-rose-500'
                  : 'border-slate-200 hover:border-rose-300 text-slate-800 hover:text-rose-500'
              }`}
              title={language === 'vi' ? 'Sản phẩm yêu thích' : 'My Wishlist'}
              aria-label={language === 'vi' ? `Sản phẩm yêu thích (${wishlistCount} mục)` : `Wishlist (${wishlistCount} items)`}
            >
              {/* Floating +1 Pop Badge Indicator */}
              {showWishlistPlusOne && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold shadow-sm border border-rose-300 animate-float-plus-one pointer-events-none z-30 whitespace-nowrap">
                  +1
                </span>
              )}

              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${
                  wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''
                } ${isWishlistBouncing ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span
                key={`wishlist-badge-${wishlistCount}`}
                className={`absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full text-[9px] font-mono font-bold tabular-nums flex items-center justify-center ring-2 ring-white select-none transition-transform ${
                  wishlistCount > 0
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs'
                } ${isWishlistBouncing ? 'animate-badge-pop' : ''}`}
              >
                {wishlistCount}
              </span>
            </Link>

            {/* Shopping Cart Pill Button (Redirects to /cart) */}
            <button
              id="header-cart-btn"
              type="button"
              suppressHydrationWarning
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else router.push('/cart');
              }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border bg-white flex items-center justify-center relative shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isCartBouncing
                  ? 'animate-header-bounce border-sky-400 shadow-sm text-sky-600'
                  : 'border-slate-200 hover:border-sky-500 text-slate-800 hover:text-sky-600'
              }`}
              title={t('cart.title')}
              aria-label={language === 'vi' ? `Giỏ hàng (${effectiveCartCount} sản phẩm)` : `Shopping Cart (${effectiveCartCount} items)`}
            >
              {/* Floating +1 Pop Badge Indicator */}
              {showCartPlusOne && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full btn-ocean-primary text-white text-[10px] font-mono font-bold shadow-sm border border-sky-300 animate-float-plus-one pointer-events-none z-30 whitespace-nowrap">
                  +1
                </span>
              )}

              <ShoppingCart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${
                  effectiveCartCount > 0 ? 'text-sky-600' : ''
                } ${isCartBouncing ? 'text-sky-600' : ''}`}
              />
              <span
                key={`cart-badge-${effectiveCartCount}`}
                className={`absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full text-[9px] font-mono font-bold tabular-nums flex items-center justify-center ring-2 ring-white select-none transition-transform ${
                  effectiveCartCount > 0
                    ? 'btn-ocean-primary text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs'
                } ${isCartBouncing ? 'animate-badge-pop' : ''}`}
              >
                {effectiveCartCount}
              </span>
            </button>

            {/* User Account OR Capsule Login Button-in-Button (Exact Match Image 1) */}
            {currentUser ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label={language === 'vi' ? 'Menu tài khoản người dùng' : 'User account menu'}
                  aria-expanded={showUserMenu}
                  className="h-10 w-10 sm:w-auto sm:h-11 justify-center sm:pl-3 sm:pr-3.5 rounded-full border border-sky-200 hover:border-sky-400 bg-white/95 backdrop-blur-md flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-800 shadow-2xs hover:shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-sky-200 ring-2 ring-sky-100"
                  />
                  <span className="hidden sm:block max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180 text-sky-600' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/98 backdrop-blur-xl border border-sky-100/90 shadow-xl shadow-sky-950/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ambient-glow-sky">
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-50/70 to-white mb-1 border border-sky-100/70">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 text-xs">{currentUser.name}</p>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                          {currentUser.role === 'customer' ? 'VIP Kim Cương' : currentUser.role.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Hồ Sơ & Sổ Địa Chỉ' : 'Profile & Addresses'}</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <Package className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Đơn Mua Của Tôi' : 'My Orders'}</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Tra Cứu Lộ Trình Vận Chuyển' : 'Track Shipments'}</span>
                    </Link>

                    <Link
                      href="/profile?tab=wallet"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Ví TerraPay & Thẻ' : 'TerraPay Wallet'}</span>
                    </Link>

                    <Link
                      href="/profile?tab=coins"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'vi' ? 'TerraCoins (Điểm danh +500)' : 'TerraCoins & VIP'}</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50/60 text-slate-700 hover:text-rose-600 flex items-center justify-between cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{language === 'vi' ? 'Sản Phẩm Yêu Thích' : 'My Wishlist'}</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <div className="my-1 border-t border-sky-100/80" />

                    <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('nav.switchPortal')}
                    </p>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        onSwitchRole('seller');
                        router.push('/seller');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <Store className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t('nav.sellerChannel')}</span>
                    </button>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        onSwitchRole('shipper');
                        router.push('/shipper');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t('nav.shipperChannel')}</span>
                    </button>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        onSwitchRole('admin');
                        router.push('/admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t('nav.adminChannel')}</span>
                    </button>
                    <div className="my-1 border-t border-sky-100/80" />
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        onOpenAuthModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t('nav.switchAccount')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="h-10 sm:h-11 pl-4 pr-1.5 sm:pr-2 rounded-full border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/40 flex items-center gap-2.5 transition-all shadow-2xs group cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                title={t('nav.login')}
              >
                <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight whitespace-nowrap">
                  {t('nav.login')}
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full btn-ocean-primary flex items-center justify-center group-hover:scale-105 transition-all shadow-2xs shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </Link>
            )}

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-sky-500 flex items-center justify-center text-slate-800 transition-all cursor-pointer"
              aria-label={language === 'vi' ? 'Mở menu điều hướng' : 'Toggle navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="xl:hidden border-t border-slate-200 bg-white px-6 py-5 space-y-5 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="sm:hidden flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
              <div className="flex gap-2">
                {(['vi', 'en'] as const).map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} aria-pressed={language === lang}
                    className={`min-h-11 min-w-11 rounded-xl px-3 text-sm font-semibold ${language === lang ? 'bg-sky-100 text-sky-900 ring-1 ring-sky-300' : 'bg-slate-50 text-slate-600'}`}>
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">TerraSweep Menu</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="text-xs font-bold text-slate-800 flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>{t('nav.trackOrder')}</span>
              </button>
            </div>

            <div className="flex flex-col space-y-1 text-base font-semibold text-slate-800">
              <Link
                href="/"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (pathname === '/') {
                    e.preventDefault();
                    if (onSearch) onSearch('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    if (onSearch) onSearch('');
                  }
                }}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{language === 'vi' ? 'Sản phẩm yêu thích' : 'My Wishlist'}</span>
                </span>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-mono font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-sky-600" />
                <span>{language === 'vi' ? 'Đơn Mua Của Tôi' : 'My Orders'}</span>
              </Link>
              <button
                onClick={() => handleNavClick('#about-section')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {t('nav.aboutUs')}
              </button>
              <button
                onClick={() => handleNavClick('#why-us-section')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {t('nav.whyUs')}
              </button>
              <button
                onClick={() => handleNavClick('#services-section')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {t('nav.ourServices')}
              </button>
              <button
                onClick={() => handleNavClick('#collection-section')}
                className="text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {t('nav.collection')}
              </button>
            </div>

            {/* Quick Role Switcher Mobile Card (Gói 3 Polish) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'vi' ? 'Chuyển Vai Trò Quản Trị' : 'Role Navigation'}</span>
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSwitchRole('seller');
                        router.push('/seller');
                  }}
                  className="p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 text-center text-xs font-bold text-sky-900 flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-95"
                >
                  <Store className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">{language === 'vi' ? 'Shop Bán' : 'Seller'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSwitchRole('shipper');
                        router.push('/shipper');
                  }}
                  className="p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 text-center text-xs font-bold text-sky-900 flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-95"
                >
                  <Truck className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">{language === 'vi' ? 'Shipper' : 'Courier'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSwitchRole('admin');
                        router.push('/admin');
                  }}
                  className="p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 text-center text-xs font-bold text-sky-900 flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px]">{language === 'vi' ? 'Quản Trị' : 'Admin'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'vi' ? 'Đổi Tài Khoản / Đăng Nhập' : 'Switch Account / Login'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. DEDICATED SPOTLIGHT MASTER SEARCH ROW (OCCUPIES SPOTLIGHT BELOW HEADER) */}
      {/* ========================================================================= */}
      <section
        id="spotlight-search-section"
        className="w-full bg-sky-50 border-b border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3.5">
          
          {/* Master Search Input Bar */}
          <div className="w-full flex items-center rounded-full bg-white border border-slate-300 hover:border-sky-400 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:shadow-md shadow-2xs pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 transition-all duration-200">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 mr-2.5 sm:mr-3 shrink-0" />
            
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTriggerSearch();
              }}
              placeholder={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchPlaceholder') || 'Tìm kiếm sản phẩm trên TerraSweep'}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="text-slate-500 hover:text-sky-600 p-1 mr-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full"
                aria-label={language === 'vi' ? 'Xóa từ khóa tìm kiếm' : 'Clear search query'}
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Ocean Blue Luminous Search Action Button */}
            <button
              onClick={handleTriggerSearch}
              aria-label={language === 'vi' ? 'Bắt đầu tìm kiếm' : 'Start search'}
              className="btn-ocean-primary rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'vi' ? 'Tìm kiếm' : 'Search'}</span>
            </button>
          </div>

          {/* Curated Trending Tags Row Directly Below Search */}
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center flex-wrap gap-2 text-xs text-slate-600 select-none pt-1">
            <span className="font-sans text-xs font-semibold text-zinc-700 flex items-center gap-1.5 shrink-0 pr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'vi' ? 'Xu hướng:' : 'Trending:'}</span>
            </span>

            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onSearch(tag);
                  handleTriggerSearch();
                }}
                className="px-3.5 py-1 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300 transition-all text-xs font-medium cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
