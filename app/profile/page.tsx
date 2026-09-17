'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { Footer } from '@/components/common/Footer';
import { AddressItem } from '@/types';
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
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
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
  } = useCart();

  const [activeTab, setActiveTab] = useState<'addresses' | 'general' | 'security'>('addresses');
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* 1. Navbar */}
      <BuyerHeader
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
            {language === 'vi' ? 'Hồ sơ & Sổ địa chỉ' : 'Profile & Addresses'}
          </span>
        </nav>

        {/* Hero Profile Lockup Card */}
        <div className="bg-gradient-to-br from-white via-sky-50/20 to-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-md ring-4 ring-sky-100"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs border border-white">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                  Terra VIP Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-sky-100/80 max-w-lg">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{language === 'vi' ? 'Đơn Hàng' : 'Orders'}</p>
                  <p className="text-sm sm:text-base font-black font-mono text-slate-900 mt-0.5">{orders.length}</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{language === 'vi' ? 'Hoàn Tất' : 'Delivered'}</p>
                  <p className="text-sm sm:text-base font-black font-mono text-emerald-600 mt-0.5">{completedOrders}</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{language === 'vi' ? 'Tích Lũy' : 'Total Spend'}</p>
                  <p className="text-xs sm:text-sm font-black font-mono text-sky-900 mt-0.5 truncate">
                    {totalSpent.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex gap-2">
              <Link
                href="/orders"
                className="px-4 py-2 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đơn mua của tôi' : 'My Orders'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'vi' ? 'Sổ Địa Chỉ Giao Hàng' : 'Address Book'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
              {addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'general'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'vi' ? 'Thông Tin Cá Nhân' : 'Personal Info'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'vi' ? 'Bảo Mật & Đổi Mật Khẩu' : 'Security & Login'}</span>
          </button>
        </div>

        {/* 4. Tab 1: Address Book */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'vi' ? 'Địa Chỉ Nhận Hàng Của Bạn' : 'Delivery Addresses'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'vi'
                    ? 'Chọn địa chỉ mặc định để tự động điền nhanh khi thanh toán giỏ hàng'
                    : 'Set a default address for instant 1-click checkout'}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'vi' ? 'Thêm địa chỉ mới' : 'Add New Address'}</span>
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
                      onClick={() => removeAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
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

        {/* 5. Tab 2: General Profile Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 max-w-xl shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              {language === 'vi' ? 'Thông Tin Hồ Sơ Cá Nhân' : 'Personal Profile Settings'}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Họ và tên:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Địa chỉ Email:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Số điện thoại liên hệ:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. Tab 3: Security & Login */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 max-w-xl shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'vi' ? 'Bảo Mật Tài Khoản' : 'Security & Credentials'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'vi'
                  ? 'Quản lý mật khẩu và các lớp bảo vệ danh tính điện tử'
                  : 'Manage passwords and multi-factor authentication'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-2xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{language === 'vi' ? 'Mật Khẩu Đăng Nhập' : 'Account Password'}</p>
                  <p className="text-[11px] text-slate-500">•••••••••••• (Cập nhật 15 ngày trước)</p>
                </div>
              </div>
              <button
                onClick={() =>
                  triggerToast(
                    language === 'vi' ? 'Hệ thống đã gửi liên kết đổi mật khẩu tới email!' : 'Password reset link sent to your email!',
                    'info'
                  )
                }
                className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-sky-500 text-xs font-semibold text-slate-700 hover:text-sky-600 transition-colors"
              >
                {language === 'vi' ? 'Đổi mật khẩu' : 'Change'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{language === 'vi' ? 'Xác Thực 2 Lớp (2FA)' : 'Two-Factor Authentication'}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">{language === 'vi' ? 'Đang kích hoạt bảo vệ' : 'Active and Protected'}</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
            </div>
          </div>
        )}
      </main>

      {/* 7. Modal Add Address */}
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
                  {language === 'vi' ? 'Số điện thoại nhận hàng:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Địa chỉ chi tiết:' : 'Street Address:'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={language === 'vi' ? 'Số nhà, tên đường, tòa nhà, phường/xã, quận/huyện, tỉnh/thành phố' : 'House number, street, ward, district, city'}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Tag selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Loại địa chỉ:' : 'Address Type:'}
                </label>
                <div className="flex gap-3">
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

      {/* 8. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
      />

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
