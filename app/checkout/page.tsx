'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { INITIAL_PRODUCTS, INITIAL_ADDRESSES } from '@/data/mockData';
import { CartItem, Product, AddressItem } from '@/types';
import { BrandLogo } from '@/components/common/BrandLogo';
import { OceanSelect } from '@/components/common/OceanSelect';
import { Footer } from '@/components/common/Footer';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Tag,
  Ticket,
  Coins,
  QrCode,
  Wallet,
  Building2,
  Sparkles,
  Lock,
  Clock,
  Phone,
  User,
  Plus,
  AlertCircle,
  Copy,
  FileText,
  CheckCheck,
  Loader2,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    createOrder,
    addresses,
    setAddresses,
    triggerToast,
    currentUser,
  } = useCart();

  // Buy Now params (if user clicked "Thanh toán ngay" directly from Product Detail)
  const buyNowProductId = searchParams.get('productId');
  const buyNowQuantity = parseInt(searchParams.get('quantity') || '1', 10);
  const buyNowVariant = searchParams.get('variant') || 'Tiêu chuẩn';

  // Checkout Items Resolution
  const checkoutItems: CartItem[] = useMemo(() => {
    if (buyNowProductId) {
      const p = INITIAL_PRODUCTS.find((item) => item.id === buyNowProductId);
      if (p) {
        return [
          {
            product: p,
            quantity: isNaN(buyNowQuantity) || buyNowQuantity <= 0 ? 1 : buyNowQuantity,
            selectedColor: buyNowVariant,
          },
        ];
      }
    }
    // Default to existing cart items
    return cartItems;
  }, [buyNowProductId, buyNowQuantity, buyNowVariant, cartItems]);

  // Delivery Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const def = addresses.find((a) => a.isDefault);
    return def ? def.id : addresses[0]?.id || 'addr-1';
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form State
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newCity, setNewCity] = useState('TP. Hồ Chí Minh');
  const [newDistrict, setNewDistrict] = useState('Quận 1');
  const [newWard, setNewWard] = useState('Phường Bến Nghé');
  const [newTag, setNewTag] = useState<'home' | 'office'>('home');

  // Active Selected Address Object
  const activeAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || addresses[0] || INITIAL_ADDRESSES[0];
  }, [addresses, selectedAddressId]);

  // Shipping Method State
  const [shippingCarrier, setShippingCarrier] = useState<'express' | 'standard' | 'economy'>('standard');
  const [deliveryTimeOption, setDeliveryTimeOption] = useState<'all_week' | 'office_hours'>('all_week');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Seller Note & VAT invoice
  const [merchantNote, setMerchantNote] = useState('');
  const [requestVAT, setRequestVAT] = useState(false);
  const [taxCompanyName, setTaxCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxCompanyAddress, setTaxCompanyAddress] = useState('');
  const [taxEmail, setTaxEmail] = useState('');

  // Voucher & Coins State
  const [voucherCodeInput, setVoucherCodeInput] = useState('FLASH50');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>('FLASH50');
  const [voucherDiscount, setVoucherDiscount] = useState<number>(50000);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [useCoins, setUseCoins] = useState(false);
  const coinBalance = 15000; // 15,000 Xu = 15,000 VND

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<
    'COD' | 'VietQR' | 'CyberCard' | 'MoMo' | 'PayLater'
  >('VietQR');

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('4532 8891 0023 9918');
  const [cardHolder, setCardHolder] = useState('NGUYEN VAN TUAN');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');

  // Copy helper
  const [copiedBankInfo, setCopiedBankInfo] = useState<string | null>(null);
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(type);
    triggerToast(
      language === 'vi' ? `Đã sao chép ${type}!` : `Copied ${type}!`,
      'success'
    );
    setTimeout(() => setCopiedBankInfo(null), 2500);
  };

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  // Price Calculations
  const rawSubtotal = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.product.flashPrice * item.quantity,
      0
    );
  }, [checkoutItems]);

  const baseShippingFee = useMemo(() => {
    if (shippingCarrier === 'express') return 45000;
    if (shippingCarrier === 'economy') return 15000;
    // Standard: Free if order > 500k
    return rawSubtotal >= 500000 ? 0 : 25000;
  }, [shippingCarrier, rawSubtotal]);

  const coinDiscountAmount = useCoins ? Math.min(coinBalance, rawSubtotal) : 0;
  const totalDiscount = (appliedVoucher ? voucherDiscount : 0) + coinDiscountAmount;
  const finalTotal = Math.max(0, rawSubtotal + baseShippingFee - totalDiscount);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  // Apply Voucher handler
  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voucherCodeInput.trim() || isApplyingVoucher) return;

    setIsApplyingVoucher(true);
    setTimeout(() => {
      setIsApplyingVoucher(false);
      const code = voucherCodeInput.trim().toUpperCase();
      if (code === 'FLASH50') {
        setAppliedVoucher('FLASH50');
        setVoucherDiscount(50000);
        triggerToast(
          language === 'vi' ? 'Áp dụng mã FLASH50: Giảm 50.000₫' : 'Applied FLASH50: 50,000₫ off',
          'success'
        );
      } else if (code === 'FREESHIP') {
        setAppliedVoucher('FREESHIP');
        setVoucherDiscount(25000);
        triggerToast(
          language === 'vi' ? 'Áp dụng mã FREESHIP: Giảm 25.000₫ vận chuyển' : 'Applied FREESHIP: 25,000₫ off shipping',
          'success'
        );
      } else if (code === 'TERRA10') {
        setAppliedVoucher('TERRA10');
        const tenPercent = Math.round(rawSubtotal * 0.1);
        setVoucherDiscount(Math.min(tenPercent, 100000));
        triggerToast(
          language === 'vi' ? 'Áp dụng mã TERRA10: Giảm 10% (tối đa 100.000₫)' : 'Applied TERRA10: 10% off',
          'success'
        );
      } else {
        triggerToast(
          language === 'vi' ? 'Mã voucher không hợp lệ hoặc đã hết hạn.' : 'Invalid or expired voucher code.',
          'info'
        );
      }
    }, 450);
  };

  // Add New Address
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim() || !newPhone.trim() || !newStreetAddress.trim()) {
      triggerToast(
        language === 'vi' ? 'Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ.' : 'Please fill all address fields.',
        'info'
      );
      return;
    }

    const fullAddrString = `${newStreetAddress.trim()}, ${newWard}, ${newDistrict}, ${newCity}`;
    const newAddrItem: AddressItem = {
      id: `addr-${Date.now()}`,
      recipientName: newRecipientName.trim(),
      phone: newPhone.trim(),
      address: fullAddrString,
      isDefault: false,
      tag: newTag,
    };

    setAddresses((prev) => [newAddrItem, ...prev]);
    setSelectedAddressId(newAddrItem.id);
    setIsAddingNewAddress(false);
    setIsAddressModalOpen(false);

    // Reset inputs
    setNewRecipientName('');
    setNewPhone('');
    setNewStreetAddress('');

    triggerToast(
      language === 'vi' ? 'Đã thêm địa chỉ giao hàng mới!' : 'Added new delivery address!',
      'success'
    );
  };

  // Submit Order
  const handlePlaceOrder = () => {
    if (checkoutItems.length === 0) {
      triggerToast(
        language === 'vi' ? 'Không có sản phẩm nào trong đơn hàng để thanh toán.' : 'No items to checkout.',
        'info'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Map paymentMethod to Order type
      const mappedMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay' | 'VietQR' | 'MoMo' | 'PayLater' =
        paymentMethod === 'VietQR'
          ? 'VietQR'
          : paymentMethod === 'MoMo'
          ? 'MoMo'
          : paymentMethod === 'PayLater'
          ? 'PayLater'
          : paymentMethod === 'COD'
          ? 'COD'
          : 'CyberCard';

      const orderId = createOrder({
        customerName: activeAddress.recipientName,
        customerPhone: activeAddress.phone,
        shippingAddress: activeAddress.address,
        paymentMethod: mappedMethod,
        shippingFee: baseShippingFee,
        discount: totalDiscount,
        items: checkoutItems,
      });

      // Clear from cart if checking out from cart
      if (!buyNowProductId) {
        clearCart();
      } else {
        removeFromCart(buyNowProductId);
      }

      setIsSubmitting(false);
      setCompletedOrderId(orderId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  // ===========================================================================
  // 1. ORDER SUCCESS CONFIRMATION VIEW
  // ===========================================================================
  if (completedOrderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        {/* Minimal Safe Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-sky-100/80 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <BrandLogo />
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'vi' ? 'Giao Dịch Đã Được Bảo Vệ' : 'Secured Transaction'}</span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16 flex-1 w-full">
          <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xl shadow-sky-500/5 p-6 sm:p-10 text-center relative overflow-hidden animate-in zoom-in-95 duration-400">
            {/* Soft Ambient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500" />

            {/* Glowing Success Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-emerald-100 shadow-md mb-6 animate-bounce">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-800">
              {language === 'vi' ? 'ĐẶT HÀNG THÀNH CÔNG' : 'ORDER CONFIRMED'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2 tracking-tight">
              {language === 'vi' ? 'Cảm Ơn Bạn Đã Mua Sắm Tại TerraSweep!' : 'Thank You For Your Order!'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed font-sans">
              {language === 'vi'
                ? 'Đơn hàng của bạn đã được tiếp nhận và thông báo trực tiếp đến Shop Flagship để tiến hành đóng gói, giao hỏa tốc.'
                : 'Your order has been placed and dispatched to the merchant for immediate packing.'}
            </p>

            {/* Order Receipt Card */}
            <div className="rounded-2xl bg-sky-50/40 border border-sky-100 p-5 sm:p-6 text-left space-y-3.5 mb-8">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100 text-xs">
                <span className="text-slate-500 font-medium">
                  {language === 'vi' ? 'Mã đơn hàng:' : 'Order ID:'}
                </span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-sky-200">
                  <span>#{completedOrderId}</span>
                  <button
                    onClick={() => handleCopy(completedOrderId, 'mã đơn hàng')}
                    className="hover:text-sky-900 cursor-pointer"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {language === 'vi' ? 'Người nhận:' : 'Recipient:'}
                </span>
                <span className="font-bold text-slate-900">
                  {activeAddress.recipientName} ({activeAddress.phone})
                </span>
              </div>

              <div className="flex items-start justify-between text-xs gap-4">
                <span className="text-slate-500 font-medium shrink-0">
                  {language === 'vi' ? 'Địa chỉ giao:' : 'Delivery address:'}
                </span>
                <span className="text-right text-slate-800 font-medium line-clamp-2">
                  {activeAddress.address}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {language === 'vi' ? 'Phương thức thanh toán:' : 'Payment method:'}
                </span>
                <span className="font-bold text-slate-900">
                  {paymentMethod === 'VietQR'
                    ? 'Chuyển khoản VietQR'
                    : paymentMethod === 'COD'
                    ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                    : paymentMethod === 'CyberCard'
                    ? 'Thẻ quốc tế (Visa/MasterCard)'
                    : paymentMethod === 'MoMo'
                    ? 'Ví điện tử MoMo'
                    : 'Trả góp SPayLater'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-sky-100">
                <span className="text-xs font-bold text-slate-700">
                  {language === 'vi' ? 'Tổng thanh toán:' : 'Total Amount Paid:'}
                </span>
                <span className="text-lg font-black text-sky-700 font-sans">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Estimated Delivery Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-sky-700 font-semibold mb-8">
              <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>
                {language === 'vi'
                  ? 'Dự kiến giao hàng: Ngày mai (Trước 18:00)'
                  : 'Estimated arrival: Tomorrow (Before 18:00)'}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href={`/orders?orderId=${completedOrderId}`}
                className="w-full sm:w-auto btn-ocean-primary px-8 py-3 rounded-full text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'vi' ? 'Theo Dõi Đơn Hàng Của Tôi' : 'Track My Order'}</span>
              </Link>

              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'vi' ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ===========================================================================
  // 2. CHECKOUT MAIN PAGE
  // ===========================================================================
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* CHECKOUT DEDICATED HEADER */}
      <header className="bg-white border-b border-sky-100/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <BrandLogo />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight hidden sm:block">
              {language === 'vi' ? 'Thanh Toán Đơn Hàng' : 'Secure Checkout'}
            </h1>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold">
                ✓
              </span>
              <span>{language === 'vi' ? 'Giỏ Hàng' : 'Bag'}</span>
            </Link>

            <span className="text-slate-300">➔</span>

            <div className="flex items-center gap-1.5 text-sky-700 font-bold">
              <span className="w-5 h-5 rounded-full btn-ocean-primary text-white flex items-center justify-center text-[11px]">
                2
              </span>
              <span>{language === 'vi' ? 'Thanh Toán' : 'Checkout'}</span>
            </div>

            <span className="text-slate-300">➔</span>

            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>{language === 'vi' ? 'Hoàn Tất' : 'Done'}</span>
            </div>
          </div>

          {/* SSL Encrypted Trust Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200/80">
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* CHECKOUT BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Quay lại giỏ hàng' : 'Back to shopping cart'}</span>
          </Link>
        </div>

        {checkoutItems.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-sky-100 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {language === 'vi' ? 'Không có sản phẩm nào để thanh toán' : 'No items selected for checkout'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'vi'
                ? 'Hãy quay lại giỏ hàng và tích chọn ít nhất 1 sản phẩm bạn muốn mua nhé.'
                : 'Please return to your cart and choose items to order.'}
            </p>
            <Link href="/cart" className="btn-ocean-primary px-6 py-2.5 rounded-full text-xs font-bold text-white inline-block">
              {language === 'vi' ? 'Xem Giỏ Hàng' : 'View Bag'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ================================================================= */}
            {/* LEFT COLUMN: SHIPPING INFO & PAYMENT FORM (7 COLS)               */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* 1. SHIPPING ADDRESS CARD */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs overflow-hidden">
                {/* Decorative Top Gradient Border */}
                <div className="h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500" />

                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span>{language === 'vi' ? 'Địa Chỉ Nhận Hàng' : 'Shipping Address'}</span>
                    </div>

                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
                    >
                      {language === 'vi' ? 'Thay đổi địa chỉ' : 'Change Address'}
                    </button>
                  </div>

                  {/* Active Address Display */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">
                        {activeAddress.recipientName}
                      </span>
                      <span className="font-mono text-slate-600 font-bold">
                        {activeAddress.phone}
                      </span>
                      {activeAddress.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {language === 'vi' ? 'MẶC ĐỊNH' : 'DEFAULT'}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                        {activeAddress.tag === 'office' ? 'Văn Phòng' : 'Nhà Riêng'}
                      </span>
                    </div>

                    <p className="text-slate-600 font-sans leading-relaxed pt-1">
                      {activeAddress.address}
                    </p>
                  </div>

                  {/* Delivery Preference & Shipper Note */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">
                        {language === 'vi' ? 'Thời gian giao hàng:' : 'Delivery Time:'}
                      </label>
                      <OceanSelect
                        value={deliveryTimeOption}
                        onChange={(val) => setDeliveryTimeOption(val as any)}
                        variant="rounded"
                        size="sm"
                        fullWidth
                        options={[
                          {
                            value: 'all_week',
                            label: language === 'vi' ? 'Tất cả các ngày trong tuần' : 'Any day of the week',
                          },
                          {
                            value: 'office_hours',
                            label: language === 'vi' ? 'Chỉ giao giờ hành chính (8h - 17h)' : 'Office hours only',
                          },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">
                        {language === 'vi' ? 'Ghi chú cho Shipper:' : 'Note for Driver:'}
                      </label>
                      <input
                        type="text"
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder={language === 'vi' ? 'VD: Gửi lễ tân tòa nhà, gọi trước khi đến...' : 'E.g. Leave with security...'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. ORDER ITEMS REVIEW */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                    <span>{language === 'vi' ? 'Sản Phẩm Trong Đơn Hàng' : 'Ordered Products'}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({checkoutItems.length} {language === 'vi' ? 'món' : 'items'})
                    </span>
                  </span>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    TerraSweep Flagship Official
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {checkoutItems.map((item) => (
                    <div key={item.product.id} className="py-3.5 flex items-center gap-3.5 sm:gap-4">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                            {item.selectedColor || 'Tiêu chuẩn'}
                          </span>
                          <span>•</span>
                          <span>{language === 'vi' ? 'Số lượng:' : 'Qty:'} <strong className="text-slate-900">{item.quantity}</strong></span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-sans font-bold text-xs sm:text-sm text-slate-900">
                          {formatVND(item.product.flashPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {formatVND(item.product.flashPrice)}/cái
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seller Note & VAT invoice */}
                <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      {language === 'vi' ? 'Lời nhắn cho Người Bán:' : 'Message to Merchant:'}
                    </label>
                    <input
                      type="text"
                      value={merchantNote}
                      onChange={(e) => setMerchantNote(e.target.value)}
                      placeholder={language === 'vi' ? 'Lưu ý cho shop về đóng gói sản phẩm...' : 'Packing instructions for store...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* VAT Invoice Request Toggle */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requestVAT}
                        onChange={(e) => setRequestVAT(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{language === 'vi' ? 'Yêu cầu xuất hóa đơn điện tử (VAT)' : 'Request Electronic VAT Invoice'}</span>
                      </span>
                    </label>

                    {requestVAT && (
                      <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={taxCompanyName}
                            onChange={(e) => setTaxCompanyName(e.target.value)}
                            placeholder="Tên công ty / Đơn vị"
                            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                          />
                          <input
                            type="text"
                            value={taxCode}
                            onChange={(e) => setTaxCode(e.target.value)}
                            placeholder="Mã số thuế (MST)"
                            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <input
                          type="text"
                          value={taxCompanyAddress}
                          onChange={(e) => setTaxCompanyAddress(e.target.value)}
                          placeholder="Địa chỉ trụ sở công ty"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                        />
                        <input
                          type="email"
                          value={taxEmail}
                          onChange={(e) => setTaxEmail(e.target.value)}
                          placeholder="Email nhận hóa đơn điện tử (.pdf & .xml)"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. SHIPPING METHOD SELECTION */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>{language === 'vi' ? 'Đơn Vị & Phương Thức Vận Chuyển' : 'Shipping Carrier Options'}</span>
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Đồng kiểm khi nhận' : 'Inspection on delivery'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Express 2H */}
                  <div
                    onClick={() => setShippingCarrier('express')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      shippingCarrier === 'express'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        <span>Hỏa Tốc 2H</span>
                      </span>
                      <span className="font-sans font-bold text-xs text-sky-700">45.000₫</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Giao trong 2 giờ qua GrabExpress / Shopee Xpress Instant.
                    </p>
                  </div>

                  {/* Option 2: Standard (Recommended) */}
                  <div
                    onClick={() => setShippingCarrier('standard')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      shippingCarrier === 'standard'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">
                        Nhanh (Standard)
                      </span>
                      <span className="font-sans font-bold text-xs text-sky-700">
                        {rawSubtotal >= 500000 ? 'MIỄN PHÍ' : '25.000₫'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Dự kiến giao ngày mai. Freeship cho đơn từ 500k.
                    </p>
                  </div>

                  {/* Option 3: Economy */}
                  <div
                    onClick={() => setShippingCarrier('economy')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      shippingCarrier === 'economy'
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">Tiết Kiệm</span>
                      <span className="font-sans font-bold text-xs text-sky-700">15.000₫</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Nhận hàng sau 3 - 5 ngày làm việc.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. PAYMENT METHOD SELECTION */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>{language === 'vi' ? 'Phương Thức Thanh Toán' : 'Payment Methods'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'vi' ? 'Chọn 1 phương thức thuận tiện nhất' : 'Select preferred option'}
                  </span>
                </div>

                {/* Method Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'VietQR', title: 'VietQR', desc: 'Chuyển khoản QR', icon: QrCode },
                    { id: 'COD', title: 'COD', desc: 'Tiền mặt khi nhận', icon: Wallet },
                    { id: 'CyberCard', title: 'Thẻ Visa/Master', desc: 'Thẻ quốc tế', icon: CreditCard },
                    { id: 'MoMo', title: 'Ví MoMo', desc: 'Ví điện tử', icon: Sparkles },
                    { id: 'PayLater', title: 'SPayLater', desc: '0% Lãi suất', icon: Clock },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer focus:outline-none ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/60 shadow-xs ring-1 ring-sky-400'
                            : 'border-slate-200 bg-white hover:border-sky-300'
                        }`}
                      >
                        <IconComp className={`w-5 h-5 mb-2 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                        <div>
                          <div className={`font-bold text-xs ${isSelected ? 'text-sky-900' : 'text-slate-800'}`}>
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {m.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* PAYMENT METHOD DETAILS ACCORDION CONTAINER */}
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-sky-50/30 border border-sky-100">
                  {/* VIETQR DYNAMIC PAYMENT */}
                  {paymentMethod === 'VietQR' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-sky-600" />
                          <span>Quét Mã VietQR Chuyển Khoản Tự Động (Khuyên dùng)</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Xác nhận tức thì 30s
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                        {/* Dynamic QR Display */}
                        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-sky-200 shadow-2xs">
                          <div className="w-36 h-36 rounded-xl bg-white p-2 border border-slate-100 flex items-center justify-center relative">
                            {/* Realistic Simulated Dynamic QR Code */}
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-lg p-2 flex flex-col justify-between text-[7.5px] font-mono text-white select-none">
                              <div className="flex justify-between">
                                <span className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center font-bold">QR</span>
                                <span className="w-6 h-6 border-2 border-white rounded-md"></span>
                              </div>
                              <div className="text-center font-bold tracking-widest text-sky-300">
                                TERRA-QR
                              </div>
                              <div className="flex justify-between">
                                <span className="w-6 h-6 border-2 border-white rounded-md"></span>
                                <span className="text-[6px] text-right">NAPAS247</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10.5px] font-bold text-slate-600 mt-2">
                            Quét bằng mọi ứng dụng ngân hàng
                          </span>
                        </div>

                        {/* Bank Details */}
                        <div className="sm:col-span-8 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                            <div>
                              <span className="text-[10.5px] text-slate-400 block">Ngân hàng thụ hưởng</span>
                              <span className="font-bold text-slate-900">Techcombank (TCB)</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                              Napas 247
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                            <div>
                              <span className="text-[10.5px] text-slate-400 block">Số tài khoản</span>
                              <span className="font-mono font-bold text-slate-900 text-sm">1903 8892 0012 34</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('19038892001234', 'số tài khoản')}
                              className="px-2.5 py-1 rounded-lg btn-ocean-primary text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedBankInfo === 'số tài khoản' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                            <div>
                              <span className="text-[10.5px] text-slate-400 block">Nội dung chuyển khoản</span>
                              <span className="font-mono font-bold text-sky-700">TS ORDER {activeAddress.phone.slice(-4)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(`TS ORDER ${activeAddress.phone.slice(-4)}`, 'nội dung CK')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedBankInfo === 'nội dung CK' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD (Cash On Delivery) */}
                  {paymentMethod === 'COD' && (
                    <div className="flex items-start gap-3 text-xs text-slate-700">
                      <Wallet className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          Thanh toán tiền mặt khi nhận hàng (COD)
                        </h4>
                        <p className="text-slate-500 leading-relaxed font-sans">
                          Bạn chỉ cần thanh toán đúng số tiền <strong>{formatVND(finalTotal)}</strong> cho nhân viên giao hàng khi nhận và đồng kiểm gói hàng thành công.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CREDIT / DEBIT CARD */}
                  {paymentMethod === 'CyberCard' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-sky-600" />
                          <span>Thông tin thẻ thanh toán Quốc Tế</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <span>VISA</span>
                          <span>•</span>
                          <span>MASTERCARD</span>
                          <span>•</span>
                          <span>JCB</span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-slate-500 text-[11px] mb-1">Số thẻ (16 chữ số)</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="block text-slate-500 text-[11px] mb-1">Tên in trên thẻ</label>
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono uppercase focus:outline-none focus:border-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[11px] mb-1">Hết hạn (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-center focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MOMO / E-WALLET */}
                  {paymentMethod === 'MoMo' && (
                    <div className="flex items-start gap-3 text-xs text-slate-700">
                      <Sparkles className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          Thanh toán một chạm qua Ví MoMo / ZaloPay
                        </h4>
                        <p className="text-slate-500 leading-relaxed font-sans">
                          Mở ứng dụng MoMo và quét mã QR để được tích điểm hoàn 5% TerraCoins vào tài khoản của bạn ngay sau khi đơn hàng thành công.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SPAYLATER / INSTALMENT */}
                  {paymentMethod === 'PayLater' && (
                    <div className="flex items-start gap-3 text-xs text-slate-700">
                      <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          Mua Trước Trả Sau - 0% Lãi Suất
                        </h4>
                        <p className="text-slate-500 leading-relaxed font-sans">
                          Kỳ thanh toán tiếp theo vào ngày 25 tháng sau. Không phát sinh chi phí phụ, duyệt hạn mức tự động dựa trên uy tín tài khoản của bạn.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: VOUCHER, COINS & ORDER TOTAL SUMMARY (5 COLS)       */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-28">

              {/* VOUCHER CARD */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-sky-600" />
                    <span>{language === 'vi' ? 'TerraSweep Voucher' : 'Coupons & Vouchers'}</span>
                  </span>
                  {appliedVoucher && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      -{formatVND(voucherDiscount)}
                    </span>
                  )}
                </div>

                <form onSubmit={handleApplyVoucher} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value)}
                    placeholder="MÃ GIẢM GIÁ (VD: FLASH50)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingVoucher || !voucherCodeInput.trim()}
                    className="px-4 py-2 rounded-xl btn-ocean-primary text-xs font-bold text-white shadow-2xs disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isApplyingVoucher ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (language === 'vi' ? 'Áp Dụng' : 'Apply')}
                  </button>
                </form>

                {/* Quick Voucher Chips */}
                <div className="flex items-center gap-2 flex-wrap text-[10.5px]">
                  <span className="text-slate-400 font-medium">{language === 'vi' ? 'Gợi ý:' : 'Try:'}</span>
                  {['FLASH50', 'FREESHIP', 'TERRA10'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setVoucherCodeInput(code);
                        if (appliedVoucher !== code) {
                          setAppliedVoucher(code);
                          setVoucherDiscount(code === 'FLASH50' ? 50000 : code === 'FREESHIP' ? 25000 : 80000);
                          triggerToast(language === 'vi' ? `Đã chọn mã ${code}` : `Selected ${code}`, 'success');
                        }
                      }}
                      className={`px-2 py-0.5 rounded-md border font-mono font-bold transition-colors cursor-pointer ${
                        appliedVoucher === code
                          ? 'bg-sky-50 border-sky-300 text-sky-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-sky-300'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>

                {/* TerraCoins Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="font-bold text-slate-800">TerraSweep Xu</span>
                      <span className="text-[11px] text-slate-400 block">
                        {language === 'vi' ? 'Dùng 15.000 Xu để giảm 15.000₫' : 'Redeem 15,000 Coins'}
                      </span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCoins}
                      onChange={(e) => setUseCoins(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-amber-600">-15.000₫</span>
                  </label>
                </div>
              </div>

              {/* TOTAL PAYMENT SUMMARY CARD */}
              <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-5 sm:p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
                  {language === 'vi' ? 'Tóm Tắt Đơn Hàng' : 'Payment Breakdown'}
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{language === 'vi' ? 'Tổng tiền hàng' : 'Merchandise Subtotal'}</span>
                    <span className="font-sans font-bold text-slate-800">{formatVND(rawSubtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>{language === 'vi' ? 'Phí vận chuyển' : 'Shipping Fee'}</span>
                    <span className="font-sans font-bold text-slate-800">{formatVND(baseShippingFee)}</span>
                  </div>

                  {appliedVoucher && (
                    <div className="flex items-center justify-between text-sky-700">
                      <span>Voucher giảm giá ({appliedVoucher})</span>
                      <span className="font-sans font-bold">-{formatVND(voucherDiscount)}</span>
                    </div>
                  )}

                  {useCoins && (
                    <div className="flex items-center justify-between text-amber-600">
                      <span>Dùng Xu tích lũy</span>
                      <span className="font-sans font-bold">-{formatVND(coinDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">
                        {language === 'vi' ? 'Tổng Thanh Toán' : 'Total Payment'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {language === 'vi' ? '(Đã bao gồm thuế VAT)' : '(Inclusive of VAT)'}
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-sky-700 font-sans tracking-tight">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* TerraProtect Buyer Assurance */}
                <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100/80 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-sky-800">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Cam kết bảo hộ TerraProtect</span>
                  </div>
                  <p className="leading-snug text-slate-500 font-sans">
                    Hoàn tiền 100% nếu sản phẩm lỗi hoặc không đúng mô tả. Đổi trả miễn phí trong 15 ngày.
                  </p>
                </div>

                {/* Primary Place Order CTA Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || checkoutItems.length === 0}
                  className="w-full py-4 rounded-full btn-ocean-primary text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{language === 'vi' ? 'ĐANG XỬ LÝ ĐẶT HÀNG...' : 'PROCESSING ORDER...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{language === 'vi' ? 'ĐẶT HÀNG NGAY' : 'PLACE ORDER'}</span>
                      <span>•</span>
                      <span className="font-sans font-bold">{formatVND(finalTotal)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* ======================================================================= */}
      {/* ADDRESS SELECTION / ADD NEW MODAL                                       */}
      {/* ======================================================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-sky-100 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{language === 'vi' ? 'Địa Chỉ Nhận Hàng Của Bạn' : 'Select Delivery Address'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setIsAddingNewAddress(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!isAddingNewAddress ? (
              <div className="space-y-3.5">
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {addresses.map((addr) => {
                    const isChosen = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                          isChosen
                            ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400'
                            : 'border-slate-200 bg-white hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{addr.recipientName}</span>
                            <span className="font-mono text-slate-500">{addr.phone}</span>
                          </div>
                          {addr.isDefault && (
                            <span className="px-2 py-0.2 rounded-full text-[9.5px] font-bold bg-sky-100 text-sky-800">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-snug">{addr.address}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'vi' ? 'Thêm Địa Chỉ Mới' : 'Add New Address'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="btn-ocean-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    {language === 'vi' ? 'Xác Nhận' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              /* ADD NEW ADDRESS FORM */
              <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Họ và tên người nhận</label>
                    <input
                      type="text"
                      required
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="0909 123 456"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tỉnh / Thành</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Quận / Huyện</label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phường / Xã</label>
                    <input
                      type="text"
                      value={newWard}
                      onChange={(e) => setNewWard(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                  <input
                    type="text"
                    required
                    value={newStreetAddress}
                    onChange={(e) => setNewStreetAddress(e.target.value)}
                    placeholder="Số 123 Đường Nguyễn Huệ..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="text-slate-600 font-semibold">Loại địa chỉ:</label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="addrTag"
                      checked={newTag === 'home'}
                      onChange={() => setNewTag('home')}
                      className="text-sky-600 accent-sky-600"
                    />
                    <span>Nhà Riêng</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="addrTag"
                      checked={newTag === 'office'}
                      onChange={() => setNewTag('office')}
                      className="text-sky-600 accent-sky-600"
                    />
                    <span>Văn Phòng</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="btn-ocean-primary px-5 py-2 rounded-full text-white font-bold cursor-pointer shadow-xs"
                  >
                    Lưu Địa Chỉ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT FOOTER */}
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-600 font-sans">Đang tải trang thanh toán an toàn...</p>
        </div>
      }
    >
      <CheckoutPageContent />
    </React.Suspense>
  );
}

