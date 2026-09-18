'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { Footer } from '@/components/common/Footer';
import { AddressItem } from '@/types';
import { INITIAL_USERS } from '@/data/mockData';
import {
  User,
  MapPin,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  Home,
  Building,
  Calendar,
  Mail,
  Phone,
  Edit3,
  Award,
  Sparkles,
  ChevronRight,
  Package,
  Clock,
  KeyRound,
  Bell,
  Lock,
  Wallet,
  Coins,
  Ticket,
  Check,
  Copy,
  Smartphone,
  Laptop,
  LogOut,
  ArrowUpRight,
  ArrowDownLeft,
  Crown,
  Gift,
  Zap,
  Loader2,
} from 'lucide-react';

type ProfileTab = 'general' | 'addresses' | 'wallet' | 'coins' | 'security';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as ProfileTab | null;
  const { language } = useLanguage();
  const {
    cartItems,
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    orders,
    addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    triggerToast,
    openSellerChat,
  } = useCart();

  const [activeTab, setActiveTab] = useState<ProfileTab>(() => {
    if (tabParam && ['general', 'addresses', 'wallet', 'coins', 'security'].includes(tabParam)) {
      return tabParam;
    }
    return 'general';
  });

  useEffect(() => {
    if (tabParam && ['general', 'addresses', 'wallet', 'coins', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Address form state
  const [newRecipientName, setNewRecipientName] = useState(currentUser.name || '');
  const [newPhone, setNewPhone] = useState('0901 234 567');
  const [newAddress, setNewAddress] = useState('');
  const [newTag, setNewTag] = useState<'home' | 'office'>('home');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Profile edit state
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [emailInput, setEmailInput] = useState(currentUser.email || '');
  const [phoneInput, setPhoneInput] = useState('0901 234 567');
  const [birthdayInput, setBirthdayInput] = useState('2000-08-15');
  const [genderInput, setGenderInput] = useState<'male' | 'female' | 'other'>('male');
  const [bioInput, setBioInput] = useState(
    language === 'vi'
      ? 'Khách hàng thân thiết TerraSweep. Đam mê sản phẩm công nghệ & thời trang tối giản.'
      : 'TerraSweep loyal member. Passionate about minimalism and curated lifestyle.'
  );

  // TerraCoins & Check-in state
  const [coinBalance, setCoinBalance] = useState(15000);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [streakDays, setStreakDays] = useState(5);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  // Wallet & Card state
  const [walletBalance, setWalletBalance] = useState(2850000);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [linkedCards, setLinkedCards] = useState([
    {
      id: 'card-1',
      bank: 'Vietcombank Priority',
      type: 'Visa Platinum',
      last4: '4242',
      exp: '08/28',
      isDefault: true,
      color: 'from-slate-900 to-sky-950',
    },
    {
      id: 'card-2',
      bank: 'Techcombank',
      type: 'Mastercard World',
      last4: '8899',
      exp: '11/27',
      isDefault: false,
      color: 'from-red-900 to-rose-950',
    },
  ]);

  // Security state
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 (Google Chrome 128)',
      location: 'Hà Nội, Việt Nam',
      ip: '113.190.24.18',
      isCurrent: true,
      lastActive: language === 'vi' ? 'Đang hoạt động' : 'Active now',
      type: 'laptop',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro Max (TerraSweep App)',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      ip: '14.161.32.90',
      isCurrent: false,
      lastActive: language === 'vi' ? '2 giờ trước' : '2 hours ago',
      type: 'phone',
    },
  ]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newRecipientName.trim() || !newPhone.trim()) {
      triggerToast(
        language === 'vi' ? 'Vui lòng nhập đầy đủ thông tin địa chỉ!' : 'Please fill all address fields!',
        'info'
      );
      return;
    }

    addAddress({
      recipientName: newRecipientName,
      phone: newPhone,
      address: newAddress,
      tag: newTag,
      isDefault: newIsDefault || addresses.length === 0,
    });

    setIsAddModalOpen(false);
    setNewAddress('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: nameInput,
      email: emailInput,
    });
    triggerToast(
      language === 'vi' ? 'Đã cập nhật hồ sơ cá nhân thành công!' : 'Profile updated successfully!',
      'success'
    );
  };

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;
    setCoinBalance((prev) => prev + 500);
    setStreakDays((prev) => prev + 1);
    setHasCheckedInToday(true);
    triggerToast(
      language === 'vi'
        ? 'Điểm danh thành công! Bạn nhận được +500 TerraCoins.'
        : 'Checked in! You earned +500 TerraCoins.',
      'success'
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    triggerToast(
      language === 'vi' ? `Đã sao chép mã ưu đãi: ${code}` : `Copied voucher code: ${code}`,
      'success'
    );
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || !newCardName.trim()) return;

    const last4 = newCardNumber.replace(/\s+/g, '').slice(-4) || '1234';
    setLinkedCards((prev) => [
      ...prev,
      {
        id: `card-${Date.now()}`,
        bank: 'Ngân hàng Quốc tế',
        type: 'Visa Signature',
        last4,
        exp: newCardExp || '12/29',
        isDefault: false,
        color: 'from-sky-900 to-indigo-950',
      },
    ]);
    setIsAddCardModalOpen(false);
    setNewCardNumber('');
    setNewCardName('');
    setNewCardExp('');
    triggerToast(
      language === 'vi' ? 'Đã liên kết thẻ thanh toán thành công!' : 'Card linked successfully!',
      'success'
    );
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    triggerToast(
      language === 'vi' ? 'Đã đăng xuất phiên đăng nhập trên thiết bị đã chọn.' : 'Revoked session on device.',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 flex flex-col antialiased">
      {/* 1. Navbar */}
      <BuyerHeader
        cartItemCount={cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
        onOpenCart={() => router.push('/cart')}
        onSearch={() => router.push('/#collection-section')}
        searchQuery=""
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onSwitchRole={(role) => {
          setActiveRole(role);
          if (role !== 'customer') router.push('/');
        }}
        onOpenTracking={() => router.push('/orders')}
      />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            {language === 'vi' ? 'Trang chủ' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            {language === 'vi' ? 'Tài Khoản & Trung Tâm Khách Hàng' : 'Customer Account Center'}
          </span>
        </nav>

        {/* ========================================================================= */}
        {/* HERO VIP DIAMOND LOCKUP BANNER (UI/UX PRO MAX)                            */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-white via-sky-50/30 to-sky-100/20 rounded-[32px] border border-sky-100/90 p-6 sm:p-8 shadow-xs mb-8 relative overflow-hidden ambient-glow-sky">
          {/* Subtle Background Accent */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-300/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative group cursor-pointer">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-4 ring-sky-200/80 transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => triggerToast(language === 'vi' ? 'Chọn ảnh đại diện mới' : 'Change avatar', 'info')}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs border-2 border-white hover:bg-sky-700 transition-all"
                  title="Cập nhật ảnh đại diện"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-xs">
                    <Crown className="w-3.5 h-3.5" />
                    <span>VIP Kim Cương</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KYC Đã Duyệt</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1.5 flex items-center justify-center sm:justify-start gap-3 font-mono flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {phoneInput}
                  </span>
                </p>

                {/* VIP Tier Progress Bar */}
                <div className="mt-4 max-w-md">
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-600">{language === 'vi' ? 'Tiến trình nâng cấp Crown Royal' : 'Crown Royal Progress'}</span>
                    <span className="text-sky-700 font-mono">78% (Đã tích lũy {totalSpent.toLocaleString('vi-VN')}₫)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500" style={{ width: '78%' }} />
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    {language === 'vi'
                      ? 'Chi tiêu thêm 3.250.000₫ trước 31/12 để thăng hạng Hoàng Gia với đặc quyền hoàn xu 10%.'
                      : 'Spend 3,250,000₫ more to unlock Crown Royal with 10% cashback.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex sm:flex-col gap-2.5 shrink-0">
              <Link
                href="/orders"
                className="px-4 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>{language === 'vi' ? 'Đơn Mua Của Tôi' : 'My Orders'}</span>
              </Link>
              <button
                type="button"
                onClick={() => openSellerChat('TerraSweep Flagship Store')}
                className="px-4 py-2.5 rounded-full btn-ocean-secondary text-sky-800 text-xs font-bold shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-sky-600" />
                <span>{language === 'vi' ? 'CSKH Flagship 24/7' : 'Support Chat'}</span>
              </button>
            </div>
          </div>

          {/* VIP Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-sky-100">
            {/* Total Spend */}
            <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'vi' ? 'TỔNG TÍCH LŨY' : 'TOTAL SPEND'}
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-slate-900 mt-0.5">
                {totalSpent.toLocaleString('vi-VN')}₫
              </p>
            </div>

            {/* Delivered Orders */}
            <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'vi' ? 'ĐƠN HOÀN TẤT' : 'COMPLETED ORDERS'}
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-emerald-600 mt-0.5">
                {completedOrders} {language === 'vi' ? 'đơn hàng' : 'orders'}
              </p>
            </div>

            {/* TerraCoins Balance */}
            <div
              onClick={() => setActiveTab('coins')}
              className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs cursor-pointer hover:border-sky-300 transition-all group"
            >
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'vi' ? 'VÍ TERRACOINS' : 'TERRACOINS'}</span>
                <Coins className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-amber-600 mt-0.5">
                {coinBalance.toLocaleString('vi-VN')} Xu
              </p>
            </div>

            {/* Vouchers */}
            <div
              onClick={() => setActiveTab('coins')}
              className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs cursor-pointer hover:border-sky-300 transition-all group"
            >
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'vi' ? 'VOUCHER KHẢ DỤNG' : 'VOUCHERS'}</span>
                <Ticket className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
              </span>
              <p className="text-base sm:text-lg font-black font-mono text-sky-700 mt-0.5">
                6 {language === 'vi' ? 'mã ưu đãi' : 'vouchers'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5 INTERACTIVE TABS HEADER                                                 */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 mb-6 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'general'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'vi' ? 'Hồ Sơ Cá Nhân' : 'Personal Info'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'vi' ? 'Sổ Địa Chỉ Nhận Hàng' : 'Address Book'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold text-slate-600">
              {addresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`pb-3.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'wallet'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{language === 'vi' ? 'Ví TerraPay & Thẻ' : 'Wallet & Cards'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coins')}
            className={`pb-3.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'coins'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{language === 'vi' ? 'TerraCoins & Ưu Đãi VIP' : 'Coins & VIP Perks'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3.5 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'security'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'vi' ? 'Bảo Mật & Thiết Bị' : 'Security & Devices'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: GENERAL PROFILE                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 max-w-2xl shadow-2xs">
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'vi' ? 'Thông Tin Hồ Sơ Cá Nhân' : 'Personal Profile Settings'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'vi'
                    ? 'Quản lý thông tin định danh và liên lạc của bạn trên toàn hệ sinh thái TerraSweep'
                    : 'Manage your personal identity and contact info across the platform'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'vi' ? 'Họ và tên:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'vi' ? 'Số điện thoại:' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Địa chỉ Email:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'vi' ? 'Ngày sinh:' : 'Date of Birth:'}
                  </label>
                  <input
                    type="date"
                    value={birthdayInput}
                    onChange={(e) => setBirthdayInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'vi' ? 'Giới tính:' : 'Gender:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as const).map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setGenderInput(gender)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          genderInput === gender
                            ? 'bg-sky-50 border-sky-400 text-sky-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {gender === 'male' ? (language === 'vi' ? 'Nam' : 'Male') : gender === 'female' ? (language === 'vi' ? 'Nữ' : 'Female') : (language === 'vi' ? 'Khác' : 'Other')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Giới thiệu bản thân:' : 'Short Bio:'}
                </label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Lưu Thay Đổi Hồ Sơ' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ADDRESS BOOK                                                       */}
        {/* ========================================================================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'vi' ? 'Danh Sách Địa Chỉ Nhận Hàng' : 'Delivery Addresses'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'vi'
                    ? 'Chọn địa chỉ mặc định để tự động điền nhanh khi thanh toán giỏ hàng'
                    : 'Set a default address for instant 1-click checkout'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'vi' ? 'Thêm Địa Chỉ Mới' : 'Add New Address'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-3xl border transition-all relative ${
                    addr.isDefault
                      ? 'bg-sky-50/40 border-sky-300 shadow-sm shadow-sky-500/5 ring-2 ring-sky-500/10'
                      : 'bg-white border-slate-200/90 hover:border-sky-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                        {addr.tag === 'office' ? <Building className="w-3.5 h-3.5 text-sky-600" /> : <Home className="w-3.5 h-3.5 text-sky-600" />}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{addr.recipientName}</h4>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                          {language === 'vi' ? 'Mặc định' : 'Default'}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title={language === 'vi' ? 'Xóa địa chỉ' : 'Delete address'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{addr.phone}</span>
                    </p>
                    <p className="flex items-start gap-1.5 text-slate-600 leading-relaxed mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{addr.address}</span>
                    </p>
                  </div>

                  {!addr.isDefault && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                      >
                        {language === 'vi' ? 'Đặt làm mặc định' : 'Set as Default'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WALLET & CARDS                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Wallet Balance Hero Card */}
            <div className="p-6 sm:p-7 rounded-3xl ocean-feature flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  <Wallet className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Ví Điện Tử TerraPay' : 'TerraPay Digital Wallet'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-mono mt-2">
                  {walletBalance.toLocaleString('vi-VN')} ₫
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'vi'
                    ? 'Hoàn tiền trả hàng và số dư mua sắm trực tuyến 1 chạm không cần nhập lại mã OTP.'
                    : 'Auto-refund destination and 1-tap fast checkout balance.'}
                </p>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setWalletBalance((prev) => prev + 500000);
                    triggerToast(language === 'vi' ? 'Nạp 500.000₫ vào ví thành công!' : 'Deposited 500,000₫ into wallet!', 'success');
                  }}
                  className="px-4 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Nạp Tiền' : 'Deposit'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast(language === 'vi' ? 'Yêu cầu rút tiền về ngân hàng đã được ghi nhận.' : 'Withdraw request sent.', 'info')}
                  className="px-4 py-2.5 rounded-full bg-white/70 hover:bg-white/20 text-slate-900 text-xs font-bold border border-white/20 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Rút Tiền' : 'Withdraw'}</span>
                </button>
              </div>
            </div>

            {/* Linked Cards Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'vi' ? 'Thẻ Ngân Hàng & Tín Dụng Liên Kết' : 'Linked Cards'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'vi' ? 'Bảo mật PCI DSS cấp độ 1 với công nghệ mã hóa tokenization' : 'PCI DSS Level 1 secured with tokenization'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full btn-ocean-secondary text-sky-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-sky-600" />
                  <span>{language === 'vi' ? 'Thêm Thẻ Mới' : 'Add Card'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {linkedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-5 rounded-3xl bg-gradient-to-br ${card.color} text-white shadow-md flex flex-col justify-between h-44 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider">{card.bank}</span>
                      <CreditCard className="w-5 h-5 text-white/80" />
                    </div>

                    <div className="font-mono text-sm tracking-widest my-auto">
                      •••• •••• •••• {card.last4}
                    </div>

                    <div className="flex items-end justify-between text-xs text-white/80">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-white/60">Card Holder</span>
                        <span className="font-bold">{currentUser.name.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-white/60">Expires</span>
                        <span className="font-mono font-bold">{card.exp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TERRACOINS & VIP PERKS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'coins' && (
          <div className="space-y-6">
            {/* Daily Check-in & Coins Showcase */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-sky-50 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>{language === 'vi' ? 'CHƯƠNG TRÌNH THÀNH VIÊN VIP' : 'VIP REWARDS PROGRAM'}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-amber-900">
                    {coinBalance.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-sm font-bold text-amber-700">TerraCoins (Xu)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'vi'
                    ? '1 Xu = 1 VNĐ. Bạn có thể dùng Xu để trừ thẳng vào tiền đơn hàng lúc thanh toán.'
                    : '1 Coin = 1 VND. Redeem directly as checkout cash discount.'}
                </p>
              </div>

              {/* Check-in Box */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs text-center w-full md:w-auto min-w-[220px]">
                <p className="text-xs font-bold text-slate-800">
                  {language === 'vi' ? `Chuỗi điểm danh: ${streakDays} ngày` : `Check-in Streak: ${streakDays} days`}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'vi' ? 'Điểm danh liên tục để nhận thưởng 2.000 Xu' : 'Streak 7 days to get +2,000 Xu'}
                </p>
                <button
                  type="button"
                  disabled={hasCheckedInToday}
                  onClick={handleDailyCheckIn}
                  className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    hasCheckedInToday
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                      : 'btn-ocean-primary text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {hasCheckedInToday
                    ? (language === 'vi' ? '✓ Đã Điểm Danh Hôm Nay' : '✓ Checked in Today')
                    : (language === 'vi' ? 'Điểm Danh Nhận +500 Xu' : 'Check In (+500 Coins)')}
                </button>
              </div>
            </div>

            {/* Exclusive VIP Vouchers List */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-sky-600" />
                <span>{language === 'vi' ? 'Kho Mã Giảm Giá Dành Riêng Cho Bạn' : 'Your Member Vouchers'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    code: 'TERRA50K',
                    title: 'Giảm 50.000₫ cho đơn từ 300.000₫',
                    exp: 'HSD: 30/10/2026',
                    tag: 'VIP Diamond',
                    tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
                  },
                  {
                    code: 'FREESHIP100',
                    title: 'Freeship 100% toàn quốc (tối đa 40k)',
                    exp: 'HSD: 15/10/2026',
                    tag: 'Toàn sàn',
                    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  },
                  {
                    code: 'CASHBACK10',
                    title: 'Hoàn 10% TerraCoins tối đa 100.000 Xu',
                    exp: 'HSD: 31/12/2026',
                    tag: 'Đặc quyền',
                    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
                  },
                ].map((v) => (
                  <div
                    key={v.code}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${v.tagColor}`}>
                          {v.tag}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{v.exp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{v.title}</h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-sky-900 bg-sky-50 px-2 py-1 rounded-md border border-sky-100">
                        {v.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedVoucher === v.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedVoucher === v.code ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY & LOGINS                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 max-w-2xl shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'vi' ? 'Bảo Mật Tài Khoản' : 'Account Security'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'vi'
                    ? 'Bảo vệ tài khoản và giám sát các lượt truy cập bất thường'
                    : 'Protect your login credentials and monitor active access'}
                </p>
              </div>

              {/* Password row */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-2xs">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{language === 'vi' ? 'Mật Khẩu Đăng Nhập' : 'Account Password'}</p>
                    <p className="text-[11px] text-slate-500">•••••••••••• ({language === 'vi' ? 'Cập nhật 15 ngày trước' : 'Updated 15 days ago'})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    triggerToast(
                      language === 'vi' ? 'Liên kết đổi mật khẩu đã gửi tới email!' : 'Password reset link sent to email!',
                      'info'
                    )
                  }
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-sky-500 text-xs font-semibold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đổi mật khẩu' : 'Change'}
                </button>
              </div>

              {/* 2FA row */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{language === 'vi' ? 'Xác Thực Hai Lớp (2FA OTP)' : 'Two-Factor Authentication'}</p>
                    <p className={`text-[11px] font-semibold ${is2FAEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {is2FAEnabled ? (language === 'vi' ? 'Đang bảo vệ kích hoạt' : 'Active & Protected') : (language === 'vi' ? 'Chưa kích hoạt' : 'Disabled')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIs2FAEnabled(!is2FAEnabled);
                    triggerToast(
                      !is2FAEnabled
                        ? (language === 'vi' ? 'Đã bật xác thực hai lớp 2FA!' : '2FA Enabled!')
                        : (language === 'vi' ? 'Đã tắt xác thực hai lớp 2FA.' : '2FA Disabled.'),
                      'info'
                    );
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    is2FAEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {is2FAEnabled ? (language === 'vi' ? 'Bật' : 'ON') : (language === 'vi' ? 'Tắt' : 'OFF')}
                </button>
              </div>
            </div>

            {/* Active Devices & Sessions Section */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 max-w-2xl shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'vi' ? 'Thiết Bị Đang Đăng Nhập' : 'Active Sessions'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'vi' ? 'Đăng xuất khỏi các thiết bị lạ để bảo vệ tài khoản' : 'Revoke untrusted sessions to maintain account safety'}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {activeSessions.map((sess) => (
                  <div key={sess.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        {sess.type === 'laptop' ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{sess.device}</h4>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              {language === 'vi' ? 'Hiện tại' : 'Current'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {sess.location} • IP: {sess.ip} • {sess.lastActive}
                        </p>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Đăng xuất thiết bị này"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD ADDRESS                                                        */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {language === 'vi' ? 'Thêm Địa Chỉ Nhận Hàng Mới' : 'Add New Delivery Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Họ tên người nhận:' : 'Recipient Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Số điện thoại liên hệ:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Địa chỉ giao hàng chi tiết:' : 'Detailed Address:'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder={language === 'vi' ? 'Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP' : 'Street address, ward, district, city'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Loại địa chỉ:' : 'Address Type:'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTag('home')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newTag === 'home'
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Nhà Riêng' : 'Home'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTag('office')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      newTag === 'office'
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Văn Phòng' : 'Office'}</span>
                  </button>
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-700">
                  {language === 'vi' ? 'Đặt làm địa chỉ nhận hàng mặc định' : 'Set as default delivery address'}
                </span>
              </label>

              <div className="mt-6 flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Lưu địa chỉ' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD LINKED CARD                                                    */}
      {/* ========================================================================= */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {language === 'vi' ? 'Liên Kết Thẻ Thanh Toán Mới' : 'Link New Payment Card'}
            </h3>

            <form onSubmit={handleAddCard} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Số thẻ (16 chữ số):' : 'Card Number:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• ••••"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Tên in trên thẻ (không dấu):' : 'Cardholder Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="NGUYEN VAN A"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'vi' ? 'Hạn thẻ (MM/YY):' : 'Expiry (MM/YY):'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CVV / CVC:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Xác nhận liên kết' : 'Confirm Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        onLogin={(u, r) => handleLogin(u, r)}
        currentRole={activeRole}
      />

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
