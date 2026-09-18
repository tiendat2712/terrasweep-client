'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { INITIAL_PRODUCTS, INITIAL_USERS } from '@/data/mockData';
import { CartItem, Product } from '@/types';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { Footer } from '@/components/common/Footer';
import { ProductCard } from '@/components/common/ProductCard';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  Ticket,
  ChevronRight,
  Store,
  Sparkles,
  Truck,
  Flame,
  Zap,
  Coins,
  MapPin,
  CreditCard,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from 'lucide-react';

function CartRecommendedProductCard({
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

export default function CartPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    createOrder,
    orders,
    currentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    triggerToast,
  } = useCart();

  // Cascade entrance animation for cart items
  const [itemsMounted, setItemsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setItemsMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Selection state: Set of selected product IDs
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => {
    return new Set(cartItems.map((item) => item.product.id));
  });

  // Keep selection in sync if items change
  React.useEffect(() => {
    setSelectedItemIds((prev) => {
      const next = new Set<string>();
      cartItems.forEach((item) => {
        if (prev.has(item.product.id)) {
          next.add(item.product.id);
        }
      });
      if (next.size === 0 && cartItems.length > 0 && prev.size === 0) {
        cartItems.forEach((item) => next.add(item.product.id));
      }
      return next;
    });
  }, [cartItems]);

  // Voucher State
  const [voucherCode, setVoucherCode] = useState('FLASH50');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>('FLASH50');
  const [discountAmount, setDiscountAmount] = useState<number>(50000);
  const [useCoins, setUseCoins] = useState<boolean>(false);

  // Delivery & Checkout state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [customerName, setCustomerName] = useState('Nguyễn Văn Tuấn');
  const [customerPhone, setCustomerPhone] = useState('0909 888 777');
  const [shippingAddress, setShippingAddress] = useState(
    'Số 88 Đường Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  );
  const [paymentMethod, setPaymentMethod] = useState<'FlashPay' | 'COD' | 'CyberCard'>('FlashPay');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  // Toggle single item selection
  const handleToggleItem = (productId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Toggle select all
  const isAllSelected = cartItems.length > 0 && selectedItemIds.size === cartItems.length;
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(cartItems.map((item) => item.product.id)));
    }
  };

  // Delete all selected items with async backend simulation
  const handleDeleteSelected = () => {
    if (selectedItemIds.size === 0 || isDeletingSelected) return;
    setIsDeletingSelected(true);
    setTimeout(() => {
      selectedItemIds.forEach((id) => {
        removeFromCart(id);
      });
      setSelectedItemIds(new Set());
      setIsDeletingSelected(false);
      triggerToast(
        language === 'vi'
          ? 'Đã xóa các sản phẩm được chọn khỏi giỏ hàng'
          : 'Removed selected items from shopping cart',
        'info'
      );
    }, 500);
  };

  // Apply Voucher with async backend verification simulation
  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voucherCode.trim() || isApplyingVoucher) return;
    setIsApplyingVoucher(true);
    setTimeout(() => {
      setIsApplyingVoucher(false);
      const code = voucherCode.trim().toUpperCase();
      if (code === 'FLASH50') {
        setAppliedVoucher('FLASH50');
        setDiscountAmount(50000);
        triggerToast(
          language === 'vi' ? 'Đã áp dụng mã FLASH50: Giảm 50.000₫' : 'Applied FLASH50: 50,000₫ discount',
          'success'
        );
      } else if (code === 'TERRA10') {
        setAppliedVoucher('TERRA10');
        setDiscountAmount(100000);
        triggerToast(
          language === 'vi' ? 'Đã áp dụng mã TERRA10: Giảm 100.000₫' : 'Applied TERRA10: 100,000₫ discount',
          'success'
        );
      } else {
        triggerToast(
          language === 'vi' ? 'Mã voucher không hợp lệ hoặc đã hết hạn.' : 'Invalid or expired voucher code.',
          'info'
        );
      }
    }, 600);
  };

  // Async wrapper for quantity updates
  const handleUpdateItemQuantity = (productId: string, newQty: number) => {
    if (updatingItemId) return;
    setUpdatingItemId(productId);
    updateQuantity(productId, newQty);
    setTimeout(() => {
      setUpdatingItemId(null);
    }, 250);
  };

  // Async wrapper for item removal
  const handleRemoveSingleItem = (productId: string) => {
    if (removingItemId) return;
    setRemovingItemId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingItemId(null);
    }, 350);
  };

  // Calculations based strictly on SELECTED items
  const selectedItems: CartItem[] = useMemo(() => {
    return cartItems.filter((item) => selectedItemIds.has(item.product.id));
  }, [cartItems, selectedItemIds]);

  const selectedCount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItems]);

  const rawSubtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.product.flashPrice * item.quantity,
      0
    );
  }, [selectedItems]);

  const originalSubtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.product.originalPrice * item.quantity,
      0
    );
  }, [selectedItems]);

  const coinDiscount = useCoins && selectedCount > 0 ? 10000 : 0;
  const voucherDiscount = appliedVoucher && selectedCount > 0 ? Math.min(discountAmount, rawSubtotal) : 0;
  const totalDiscount = voucherDiscount + coinDiscount;
  const shippingFee = selectedCount > 0 ? (rawSubtotal > 1000000 ? 0 : 25000) : 0;
  const finalTotal = Math.max(0, rawSubtotal - totalDiscount + shippingFee);
  const totalSavings = (originalSubtotal - rawSubtotal) + totalDiscount;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Proceed to Checkout Handler
  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) {
      triggerToast(
        language === 'vi'
          ? 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.'
          : 'Please select at least 1 product to checkout.',
        'info'
      );
      return;
    }

    setIsSubmittingOrder(true);
    setTimeout(() => {
      setIsSubmittingOrder(false);
      router.push('/checkout');
    }, 300);
  };


  // Recommended products: Combine mock data for "CÓ THỂ BẠN CŨNG THÍCH"
  const recommendedProducts = useMemo(() => {
    return [...INITIAL_PRODUCTS.slice(0, 6)];
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900">
      {/* 1. TOP SINGLE-TIER LUXURY NAVBAR */}
      <BuyerHeader
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => {}}
        onOpenTracking={() => router.push('/orders')}
        onSearch={() => router.push('/#collection-section')}
        searchQuery=""
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchRole={(role) => setActiveRole(role)}
      />

      {/* Main Cart Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {language === 'vi' ? 'Giỏ Hàng' : 'Shopping Cart'}
          </span>
          {cartItems.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-mono font-bold">
              {cartItems.length} {language === 'vi' ? 'mặt hàng' : 'items'}
            </span>
          )}
        </nav>

        {/* ORDER SUCCESS STATE */}
        {orderSuccessId && (
          <div className="mb-8 rounded-3xl bg-white border border-emerald-200/80 p-8 shadow-sm text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {language === 'vi' ? 'Đặt Hàng Thành Công!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              {language === 'vi'
                ? `Mã đơn hàng #${orderSuccessId} đã được tạo và gửi tới trung tâm xử lý Flagship. Bạn có thể theo dõi tiến độ giao hàng thời gian thực.`
                : `Order #${orderSuccessId} has been created and dispatched to the Flagship fulfillment hub. You can track courier progress live.`}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  const targetId = orderSuccessId;
                  setOrderSuccessId(null);
                  router.push(`/orders?orderId=${targetId}`);
                }}
                className="px-6 py-2.5 rounded-xl btn-ocean-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>{language === 'vi' ? 'Theo Dõi Đơn Hàng' : 'Track Order'}</span>
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white text-slate-800 text-xs font-bold transition-all shadow-2xs"
              >
                {language === 'vi' ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 1: EMPTY CART                                                        */}
        {/* ========================================================================= */}
        {cartItems.length === 0 && !orderSuccessId && (
          <div className="rounded-[36px] ocean-surface border border-sky-100/90 p-8 sm:p-14 text-center shadow-sm my-6 max-w-2xl mx-auto relative overflow-hidden ambient-glow-sky">
            {/* Ambient water glow spotlight */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-sky-400/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Luxury Glassmorphic Shopping Bag Icon */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-50 to-sky-100/60 text-sky-600 flex items-center justify-center mb-6 shadow-sm border border-sky-200/70 relative group">
                <ShoppingBag className="w-11 h-11 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-amber-500 border border-amber-200 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
                <span>{language === 'vi' ? 'Túi Đồ Trống' : 'Bag is Empty'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight font-sans">
                {language === 'vi' ? 'Chưa Có Sản Phẩm Trong Giỏ Hàng' : 'Your Shopping Bag is Currently Empty'}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
                {language === 'vi'
                  ? 'Khám phá hàng loạt thiết kế thời trang đường phố cao cấp, sneakers biểu tượng và flash sale hôm nay với ưu đãi chiết khấu tới 65%!'
                  : 'Explore curated contemporary drops, iconic runners, and exclusive flash deals today with member discounts up to 65% off!'}
              </p>

              {/* Quick Jump Category Chips */}
              <div className="flex items-center justify-center flex-wrap gap-2 mb-8 max-w-lg">
                {[
                  { label: '⚡ Flash Sale', href: '/#flash-sale' },
                  { label: language === 'vi' ? '👟 Sneakers' : '👟 Sneakers', href: '/#collection-section' },
                  { label: language === 'vi' ? '👕 Thời Trang Nam' : '👕 Apparel', href: '/#collection-section' },
                  { label: language === 'vi' ? '🎧 Cyber Audio' : '🎧 Audio', href: '/#collection-section' },
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
                <span>{language === 'vi' ? 'KHÁM PHÁ MUA SẮM NGAY' : 'EXPLORE COLLECTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 2: CART HAS ITEMS - SHOPEE 1:1 LAYOUT STRUCTURE                       */}
        {/* ========================================================================= */}
        {cartItems.length > 0 && (
          <div className="space-y-4">

            {/* 1. TABLE COLUMN HEADERS (Card Container 1:1 Shopee) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 rounded-2xl bg-white border border-sky-100/80 shadow-2xs text-xs font-semibold text-slate-500 items-center">
              <div className="col-span-6 flex items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                  aria-label="Select All"
                />
                <span className="font-bold text-slate-900">
                  {language === 'vi' ? 'Sản Phẩm' : 'Product'}
                </span>
              </div>
              <div className="col-span-2 text-center">
                {language === 'vi' ? 'Đơn Giá' : 'Unit Price'}
              </div>
              <div className="col-span-2 text-center">
                {language === 'vi' ? 'Số Lượng' : 'Quantity'}
              </div>
              <div className="col-span-1 text-center">
                {language === 'vi' ? 'Số Tiền' : 'Total'}
              </div>
              <div className="col-span-1 text-right">
                {language === 'vi' ? 'Thao Tác' : 'Action'}
              </div>
            </div>

            {/* 2. SHOP / MERCHANT GROUP CARD CONTAINER */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100/90 shadow-xs overflow-hidden">
              {/* Shop Header Row (1:1 with Reference Screenshot) */}
              <div className="px-5 sm:px-6 py-3.5 bg-gradient-to-r from-sky-50/50 via-white to-sky-50/30 border-b border-sky-100/70 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                    aria-label="Select Shop"
                  />
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200/80">
                      {language === 'vi' ? 'Mall Official' : 'Top Rated+'}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-sky-600" />
                      TerraSweep Official Flagship
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-sky-700 hover:text-sky-800 cursor-pointer font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Chat Ngay' : 'Chat with Merchant'}</span>
                </div>
              </div>

              {/* Product Rows */}
              <div className="divide-y divide-slate-100">
                {cartItems.map((item, index) => {
                  const isSelected = selectedItemIds.has(item.product.id);
                  const itemSubtotal = item.product.flashPrice * item.quantity;
                  const staggerDelay = Math.min(index * 75, 360);

                  return (
                    <div
                      key={item.product.id}
                      style={{
                        transitionDuration: '550ms',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: itemsMounted ? `${staggerDelay}ms` : '0ms',
                      }}
                      className={`p-4 sm:p-6 transition-all duration-500 will-change-transform ${
                        itemsMounted
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-8'
                      } ${isSelected ? 'bg-sky-50/15' : 'bg-white'}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Checkbox + Image + Title + Variant */}
                        <div className="md:col-span-6 flex items-start sm:items-center gap-3 sm:gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(item.product.id)}
                            className="w-4 h-4 mt-1 sm:mt-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600 shrink-0"
                            aria-label={`Select ${item.product.name}`}
                          />

                          {/* Thumbnail Image */}
                          <Link
                            href={`/${item.product.id}`}
                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-2 shrink-0 group hover:border-sky-300 transition-colors"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                            />
                          </Link>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/${item.product.id}`}
                              className="font-bold text-xs sm:text-sm text-slate-900 hover:text-sky-600 transition-colors line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>

                            {/* Flash Sale Countdown Notice */}
                            {item.product.isFlashSale && (
                              <div className="flex items-center gap-1 text-[11px] text-sky-700 font-medium mt-1">
                                <Zap className="w-3 h-3 fill-sky-500 text-sky-500" />
                                <span className="font-mono tabular-nums">{language === 'vi' ? 'Flash Sale kết thúc lúc 21:00:00' : 'Flash Sale ends at 21:00:00'}</span>
                              </div>
                            )}

                            {/* Classification / Variant Dropdown */}
                            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
                              <span className="text-slate-500 font-medium">{language === 'vi' ? 'Phân Loại:' : 'Variant:'}</span>
                              <span className="font-semibold text-slate-800">
                                {item.selectedColor || 'M / Pure White'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unit Price Column */}
                        <div className="md:col-span-2 flex md:flex-col items-baseline md:items-center justify-between md:justify-center text-xs">
                          <span className="md:hidden text-slate-500 font-medium">
                            {language === 'vi' ? 'Đơn giá:' : 'Unit price:'}
                          </span>
                          <div className="flex items-baseline gap-2 md:flex-col md:items-center">
                            {item.product.originalPrice > item.product.flashPrice && (
                              <span className="text-[11px] text-slate-500 line-through font-sans tabular-nums">
                                {formatVND(item.product.originalPrice)}
                              </span>
                            )}
                            <span className="font-sans font-bold text-slate-900 text-xs sm:text-sm tabular-nums">
                              {formatVND(item.product.flashPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls Stepper */}
                        <div className="md:col-span-2 flex md:flex-col items-center justify-between md:justify-center gap-1">
                          <div className="flex items-center rounded-lg border border-slate-200 bg-white text-xs font-sans shadow-2xs">
                            <button
                              onClick={() => handleUpdateItemQuantity(item.product.id, item.quantity - 1)}
                              disabled={updatingItemId === item.product.id}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:bg-sky-50 font-bold cursor-pointer transition-colors border-r border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:z-10"
                              title="Giảm"
                              aria-label={language === 'vi' ? 'Giảm số lượng' : 'Decrease quantity'}
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-bold text-slate-900 tabular-nums">
                              {updatingItemId === item.product.id ? (
                                <Loader2 className="w-3 h-3 animate-spin mx-auto text-sky-600" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleUpdateItemQuantity(item.product.id, item.quantity + 1)}
                              disabled={updatingItemId === item.product.id}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:bg-sky-50 font-bold cursor-pointer transition-colors border-l border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:z-10"
                              title="Tăng"
                              aria-label={language === 'vi' ? 'Tăng số lượng' : 'Increase quantity'}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans font-medium">
                            {language === 'vi' ? `Còn ${item.product.stock || 12} sản phẩm` : `${item.product.stock || 12} in stock`}
                          </span>
                        </div>

                        {/* Total Subtotal Column */}
                        <div className="md:col-span-1 flex md:flex-col items-baseline md:items-center justify-between md:justify-center text-xs">
                          <span className="md:hidden text-slate-500 font-medium">
                            {language === 'vi' ? 'Thành tiền:' : 'Subtotal:'}
                          </span>
                          <span className="font-sans font-extrabold text-sky-700 text-xs sm:text-sm tabular-nums">
                            {formatVND(itemSubtotal)}
                          </span>
                        </div>

                        {/* Actions Column */}
                        <div className="md:col-span-1 flex items-center justify-end gap-3 text-xs">
                          <button
                            onClick={() => handleRemoveSingleItem(item.product.id)}
                            disabled={removingItemId === item.product.id}
                            className="text-slate-500 hover:text-red-600 font-medium cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                            title={language === 'vi' ? 'Xóa sản phẩm' : 'Remove item'}
                          >
                            {removingItemId === item.product.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                            ) : null}
                            <span>{language === 'vi' ? 'Xóa' : 'Delete'}</span>
                          </button>
                          <Link
                            href="/#collection-section"
                            className="hidden lg:inline-block text-[11px] text-sky-600 hover:text-sky-800 transition-colors truncate"
                          >
                            {language === 'vi' ? 'Tìm tương tự' : 'Similar'}
                          </Link>
                        </div>
                      </div>

                      {/* Promo voucher note line below item (1:1 with reference image) */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 text-sky-700 font-medium">
                          <Ticket className="w-3.5 h-3.5 text-sky-600" />
                          <span>
                            {language === 'vi' ? 'Voucher giảm đến 50.000₫ cho đơn hàng này' : 'Voucher up to 50,000₫ available'}
                          </span>
                        </div>
                        <a
                          href="#voucher-section"
                          onClick={(e) => {
                            e.preventDefault();
                            setVoucherCode('FLASH50');
                            handleApplyVoucher();
                          }}
                          className="text-sky-600 hover:text-sky-800 font-semibold underline cursor-pointer"
                        >
                          {language === 'vi' ? 'Xem thêm voucher' : 'View more vouchers'}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. PLATFORM VOUCHERS & COINS SECTION (1:1 Reference Image 2) */}
            <div id="voucher-section" className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-4">
              {/* Row 1: Shopee / TerraSweep Voucher */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      TerraSweep Voucher
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {appliedVoucher
                        ? language === 'vi' ? `Đang áp dụng mã: ${appliedVoucher} (-${formatVND(discountAmount)})` : `Applied promo: ${appliedVoucher}`
                        : language === 'vi' ? 'Nhập mã giảm giá để nhận ưu đãi' : 'Enter discount voucher'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleApplyVoucher} className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    aria-label={language === 'vi' ? 'Mã giảm giá voucher' : 'Discount voucher code'}
                    placeholder="MÃ GIẢM GIÁ (VD: FLASH50)"
                    className="flex-1 sm:w-56 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingVoucher || !voucherCode.trim()}
                    aria-label={language === 'vi' ? 'Áp dụng mã giảm giá' : 'Apply voucher code'}
                    className="px-4 py-2 rounded-xl btn-ocean-primary text-xs font-bold cursor-pointer shrink-0 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[80px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    {isApplyingVoucher ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>{language === 'vi' ? 'Đang kiểm tra...' : 'Checking...'}</span>
                      </>
                    ) : (
                      <span>{language === 'vi' ? 'Áp Dụng' : 'Apply'}</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Row 2: Shopee Xu / TerraSweep Reward Coins */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">
                      {language === 'vi' ? 'TerraSweep Xu' : 'TerraSweep Coins'}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2 font-medium">
                      {language === 'vi' ? 'Dùng 10.000 Xu để giảm 10.000₫' : 'Redeem 10,000 Coins for 10,000₫ off'}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={(e) => setUseCoins(e.target.checked)}
                    disabled={selectedCount === 0}
                    aria-label={language === 'vi' ? 'Sử dụng 10.000 TerraSweep Xu' : 'Redeem 10,000 TerraSweep Coins'}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer disabled:opacity-50"
                  />
                  <span className="font-sans font-bold text-amber-600 tabular-nums">
                    -10.000₫
                  </span>
                </label>
              </div>
            </div>

            {/* 4. DELIVERY & PAYMENT INFORMATION CARD */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
                <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  {language === 'vi' ? 'Địa Chỉ Nhận Hàng & Thanh Toán' : 'Delivery & Payment Details'}
                </span>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline cursor-pointer"
                >
                  {isEditingAddress
                    ? (language === 'vi' ? 'Đóng' : 'Close')
                    : (language === 'vi' ? 'Thay đổi' : 'Edit')}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        {language === 'vi' ? 'Họ và tên' : 'Recipient Name'}:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}:
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {language === 'vi' ? 'Địa chỉ giao hàng chi tiết' : 'Detailed Address'}:
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{customerName}</span>{' '}
                    <span className="font-mono text-slate-500">({customerPhone})</span>
                    <p className="text-slate-500 mt-0.5">{shippingAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold">
                      {language === 'vi' ? 'Giao Nhanh 2H' : '2-Hour Express'}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                  {language === 'vi' ? 'Phương thức thanh toán:' : 'Payment Method:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['FlashPay', 'COD', 'CyberCard'] as const).map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'btn-ocean-primary text-white shadow-md shadow-sky-500/20 scale-[1.02]'
                            : 'bg-white/90 border border-sky-100 hover:border-sky-300 text-slate-700 hover:bg-sky-50/50 shadow-2xs'
                        }`}
                      >
                        {method === 'FlashPay' && <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />}
                        {method === 'COD' && <Truck className="w-3.5 h-3.5" />}
                        {method === 'CyberCard' && <CreditCard className="w-3.5 h-3.5" />}
                        <span>
                          {method === 'FlashPay' && 'FlashPay'}
                          {method === 'COD' && (language === 'vi' ? 'COD Tiền mặt' : 'Cash COD')}
                          {method === 'CyberCard' && 'Thẻ CyberCard'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. STICKY BOTTOM CHECKOUT ACTION BAR (Responsive Mobile Dock & Desktop Bar) */}
            <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-x sm:border border-sky-200/90 shadow-2xl rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 mt-6 mb-0 sm:mb-10 transition-all duration-300 ambient-glow-sky">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Left: Checkbox Select All + Delete + Wishlist */}
                <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-700 font-medium flex-wrap">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      aria-label={language === 'vi' ? `Chọn tất cả ${cartItems.length} sản phẩm` : `Select all ${cartItems.length} items`}
                      className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                    />
                    <span className="font-bold text-slate-900">
                      {language === 'vi' ? `Chọn Tất Cả (${cartItems.length})` : `Select All (${cartItems.length})`}
                    </span>
                  </label>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedItemIds.size === 0 || isDeletingSelected}
                    aria-label={language === 'vi' ? 'Xóa các sản phẩm đã chọn' : 'Delete selected items'}
                    className="text-slate-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md px-1"
                  >
                    {isDeletingSelected ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                        <span className="text-red-600">{language === 'vi' ? 'Đang xóa...' : 'Deleting...'}</span>
                      </>
                    ) : (
                      <span>{language === 'vi' ? 'Xóa' : 'Delete'}</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      triggerToast(
                        language === 'vi' ? 'Đã lưu các mục vào danh sách yêu thích' : 'Saved items to wishlist',
                        'success'
                      );
                    }}
                    className="text-slate-500 hover:text-sky-600 transition-colors cursor-pointer hidden sm:inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md px-1"
                  >
                    {language === 'vi' ? 'Lưu vào mục Đã thích' : 'Save to Wishlist'}
                  </button>
                </div>

                {/* Right: Subtotal + Savings + Purchase Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                  <div className="text-right flex items-center justify-between sm:flex-col sm:items-end">
                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="text-xs text-slate-500 font-medium">
                        {language === 'vi'
                          ? `Tổng (${selectedCount} món):`
                          : `Total (${selectedCount} items):`}
                      </span>
                      <span className="text-xl sm:text-3xl font-extrabold text-sky-700 font-sans tracking-tight">
                        {formatVND(finalTotal)}
                      </span>
                    </div>

                    {totalSavings > 0 && selectedCount > 0 && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold font-sans mt-0.5">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>
                          {language === 'vi'
                            ? `Tiết kiệm ${formatVND(totalSavings)}`
                            : `Saved ${formatVND(totalSavings)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={selectedCount === 0 || isSubmittingOrder}
                    aria-busy={isSubmittingOrder}
                    aria-label={language === 'vi' ? 'Mua hàng thanh toán đơn hàng' : 'Proceed to checkout'}
                    className="w-full sm:w-auto px-9 py-3.5 rounded-full btn-ocean-primary font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  >
                    {isSubmittingOrder ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span className="tracking-wide">
                          {language === 'vi' ? 'ĐANG KHỞI TẠO ĐƠN HÀNG...' : 'CREATING ORDER...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{language === 'vi' ? 'MUA HÀNG' : 'CHECKOUT'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. RECOMMENDED PRODUCTS: "CÓ THỂ BẠN CŨNG THÍCH" (1:1 with Reference)      */}
        {/* ========================================================================= */}
        <section className="mt-14 pt-8 border-t border-sky-100/80">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-100/80 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {language === 'vi' ? 'Có Thể Bạn Cũng Thích' : 'You May Also Like'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'Gợi ý sản phẩm thịnh hành dành riêng cho bạn' : 'Curated recommendations tailored for you'}
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
              <CartRecommendedProductCard
                key={rec.id}
                product={rec}
                index={recIndex}
                formatVND={formatVND}
              />
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
