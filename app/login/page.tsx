'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { INITIAL_USERS } from '@/data/mockData';
import { PlatformUser, Role } from '@/types';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Store,
  Truck,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { handleLogin } = useCart();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [email, setEmail] = useState('tiendat.dev@flashcart.ai');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDirectLoginRole, setActiveDirectLoginRole] = useState<Role | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 4 Core Role Presets for Demo Evaluation
  const rolePresets = [
    {
      role: 'customer' as Role,
      titleVi: 'Khách Hàng',
      titleEn: 'Customer',
      user: INITIAL_USERS[0],
      icon: User,
    },
    {
      role: 'seller' as Role,
      titleVi: 'Shop Bán',
      titleEn: 'Merchant',
      user: INITIAL_USERS[1],
      icon: Store,
    },
    {
      role: 'shipper' as Role,
      titleVi: 'Shipper',
      titleEn: 'Courier',
      user: INITIAL_USERS[2],
      icon: Truck,
    },
    {
      role: 'admin' as Role,
      titleVi: 'Quản Trị',
      titleEn: 'Admin',
      user: INITIAL_USERS[3],
      icon: ShieldCheck,
    },
  ];

  const handleSelectPreset = (presetUser: PlatformUser, role: Role) => {
    setEmail(presetUser.email);
    setPassword('demopass123');
    setSelectedRole(role);
    setErrorMessage('');
  };

  const handleDirectDemoLogin = (presetUser: PlatformUser, role: Role) => {
    setIsLoading(true);
    setActiveDirectLoginRole(role);
    setSuccessMessage(
      language === 'vi'
        ? `Đang xác thực quyền [${presetUser.name}]...`
        : `Authenticating as [${presetUser.name}]...`
    );

    setTimeout(() => {
      handleLogin(presetUser, role);
      router.push('/');
    }, 600);
  };

  const handleSocialLogin = (provider: 'x' | 'apple' | 'google') => {
    setIsLoading(true);
    const providerName =
      provider === 'x' ? 'X (Twitter)' : provider === 'apple' ? 'Apple ID' : 'Google Account';
    setSuccessMessage(
      language === 'vi'
        ? `Đang kết nối bảo mật qua ${providerName}...`
        : `Authenticating via ${providerName}...`
    );

    setTimeout(() => {
      handleLogin(INITIAL_USERS[0], 'customer');
      router.push('/');
    }, 650);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage(language === 'vi' ? 'Vui lòng nhập địa chỉ email.' : 'Please enter your email.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMessage(
        language === 'vi'
          ? 'Mật khẩu phải chứa ít nhất 6 ký tự.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const matched = INITIAL_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const targetUser: PlatformUser = matched || {
        id: `usr-${Date.now()}`,
        name: fullName.trim() || email.split('@')[0],
        email: email.trim(),
        role: selectedRole,
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'verified',
        joinDate: new Date().toLocaleDateString('vi-VN'),
        metric: 'Thành viên mới',
      };

      setSuccessMessage(
        language === 'vi'
          ? `Đăng nhập thành công! Đang chuyển hướng...`
          : `Login successful! Redirecting...`
      );

      handleLogin(targetUser, targetUser.role);

      setTimeout(() => {
        router.push('/');
      }, 500);
    }, 700);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-transparent overflow-x-hidden selection:bg-sky-500 selection:text-white font-sans">
      {/* 1. CRYSTAL-CLEAR PANORAMIC ARTWORK WITH 4-CORNER OCEAN BLUR & MIST */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div
          className="absolute inset-0 bg-bottom bg-no-repeat bg-cover pointer-events-none select-none z-0"
          style={{
            backgroundImage: `url('/images/login-coastal-bg.jpg')`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: `
              radial-gradient(ellipse 45% 35% at 0% 0%, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.02) 40%, transparent 80%),
              radial-gradient(ellipse 45% 35% at 100% 0%, rgba(56, 189, 248, 0.06) 0%, rgba(14, 165, 233, 0.015) 40%, transparent 80%),
              radial-gradient(ellipse 45% 35% at 0% 100%, rgba(14, 165, 233, 0.09) 0%, rgba(2, 132, 199, 0.02) 40%, transparent 80%),
              radial-gradient(ellipse 45% 35% at 100% 100%, rgba(56, 189, 248, 0.06) 0%, rgba(14, 165, 233, 0.015) 40%, transparent 80%)
            `,
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* MINIMALIST TOP NAV BAR (BACK | BRAND LOGO | SUPPORT & LANGUAGE)           */}
      {/* ========================================================================= */}
      <header className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between relative z-20">
        {/* Left: Back Link */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors cursor-pointer group select-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{language === 'vi' ? 'Trang chủ' : 'Back'}</span>
        </Link>

        {/* Center: Brand Logo Lockup */}
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-default select-none caret-transparent group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100/70 border border-sky-200/80 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-sky-300 transition-all pointer-events-none select-none">
            <img
              src="/images/brand-logo.webp"
              alt="TerraSweep"
              draggable={false}
              className="w-full h-full object-contain mix-blend-multiply scale-140 group-hover:scale-150 transition-transform duration-300 pointer-events-none select-none"
            />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-[-0.03em] font-sans select-none caret-transparent">
            <span className="text-slate-900 select-none">Terra</span>
            <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 bg-clip-text text-transparent select-none">
              Sweep
            </span>
          </span>
        </Link>

        {/* Right: Language Pill & Contact Support */}
        <div className="flex items-center gap-3">
          {/* [ VI | EN ] Switcher */}
          <div className="flex items-center rounded-full bg-white/80 backdrop-blur-xs p-0.5 text-[10px] font-mono font-bold border border-sky-100 shadow-2xs select-none">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'vi'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="mailto:support@terrasweep.com"
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors hidden sm:inline-block cursor-pointer"
          >
            {language === 'vi' ? 'Hỗ trợ' : 'Contact support'}
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTERED FLOATING AUTH CARD (ELEGANT EDITORIAL FORM)                    */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-950/8 rounded-[32px] p-7 sm:p-9 transition-all relative z-10">
          {/* Headline & Subtitle (Serif luxury touch matching reference) */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {activeTab === 'login'
                ? language === 'vi'
                  ? 'Đăng nhập TerraSweep'
                  : 'Log in to TerraSweep'
                : language === 'vi'
                ? 'Tạo tài khoản TerraSweep'
                : 'Create your account'}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-sans">
              {activeTab === 'login'
                ? language === 'vi'
                  ? 'Hệ sinh thái thương mại đương đại cao cấp'
                  : 'Your curated luxury shopping experience begins here'
                : language === 'vi'
                ? 'Trải nghiệm mua sắm và quản lý đa phân hệ'
                : 'Join thousands of buyers, merchants, and couriers'}
            </p>
          </div>

          {/* Social Logins: 3 Equal Pill Buttons [ 𝕏 |  | G ] */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-6">
            {/* X / Twitter */}
            <button
              type="button"
              onClick={() => handleSocialLogin('x')}
              className="h-11 rounded-xl border border-sky-100/90 hover:border-sky-300 bg-white/80 hover:bg-sky-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group focus-visible:ring-2 focus-visible:ring-sky-400"
              title="X (Twitter)"
              aria-label="Continue with X"
            >
              <svg
                className="w-4 h-4 text-slate-900 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="h-11 rounded-xl border border-sky-100/90 hover:border-sky-300 bg-white/80 hover:bg-sky-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group focus-visible:ring-2 focus-visible:ring-sky-400"
              title="Apple ID"
              aria-label="Continue with Apple"
            >
              <svg
                className="w-4.5 h-4.5 text-slate-900 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.93-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.73 1.01.08 2.02-.49 2.64-1.24z" />
              </svg>
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="h-11 rounded-xl border border-sky-100/90 hover:border-sky-300 bg-white/80 hover:bg-sky-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group focus-visible:ring-2 focus-visible:ring-sky-400"
              title="Google Account"
              aria-label="Continue with Google"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>
          </div>

          {/* Minimalist Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-100/90" />
            </div>
            <span className="relative bg-white/90 px-3 text-xs text-slate-400 font-medium font-sans">
              {language === 'vi' ? 'hoặc' : 'or'}
            </span>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Họ và tên' : 'Full name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'Alex Mercer'}
                  className="w-full h-11 px-3.5 rounded-xl border border-sky-100/90 bg-white/95 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 transition-all font-sans"
                />
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {language === 'vi' ? 'Địa chỉ email' : 'Email address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-sky-100/90 bg-white/95 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 transition-all font-sans"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {language === 'vi' ? 'Mật khẩu' : 'Password'}
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setPassword('demopass123')}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                  >
                    {language === 'vi' ? 'Điền mẫu' : 'Fill demo'}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-sky-100/90 bg-white/95 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button: Studio Ghibli Soft Watercolor Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full h-12 mt-5 rounded-full btn-ocean-primary font-bold text-sm tracking-wide active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{language === 'vi' ? 'Đang xác thực...' : 'Authenticating...'}</span>
                </div>
              ) : (
                <span>
                  {activeTab === 'login'
                    ? language === 'vi'
                      ? 'Tiếp tục với Email'
                      : 'Continue with Email'
                    : language === 'vi'
                    ? 'Tạo tài khoản'
                    : 'Create Account'}
                </span>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-5 text-center text-xs text-slate-600">
            {activeTab === 'login' ? (
              <span>
                {language === 'vi' ? 'Chưa có tài khoản? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className="font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đăng ký ngay' : 'Sign up'}
                </button>
              </span>
            ) : (
              <span>
                {language === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đăng nhập' : 'Log in'}
                </button>
              </span>
            )}
          </div>

          {/* Discreet 1-Click Role Presets for Demo Testing */}
          <div className="mt-6 pt-5 border-t border-sky-100/90 text-center">
            <span className="text-[10.5px] text-sky-800/70 font-mono uppercase tracking-wider block mb-2.5 font-bold">
              {language === 'vi' ? '⚡ Tài khoản mẫu thử nghiệm (1-Click)' : '⚡ Instant Demo Role Access'}
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {rolePresets.map((preset) => {
                const isCurrent = email.toLowerCase() === preset.user.email.toLowerCase();
                const Icon = preset.icon;

                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset.user, preset.role)}
                    onDoubleClick={() => handleDirectDemoLogin(preset.user, preset.role)}
                    className={`py-2 px-1.5 rounded-xl text-[10.5px] font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-50 text-sky-950 font-bold shadow-xs'
                        : 'border-sky-100/80 bg-white/80 hover:bg-sky-50/70 text-slate-700 hover:text-sky-800 hover:border-sky-300 shadow-2xs'
                    }`}
                    title={`${
                      language === 'vi'
                        ? 'Click để điền, click đúp để đăng nhập ngay:'
                        : 'Click to fill, double click to sign in as:'
                    } ${preset.user.name}`}
                  >
                    <Icon className="w-3.5 h-3.5 text-sky-700 group-hover:text-sky-900" />
                    <span className="truncate w-full text-center">
                      {language === 'vi' ? preset.titleVi : preset.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. MINIMAL FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-5 text-center text-xs text-slate-400 font-sans relative z-10">
        © 2026 TerraSweep Inc. All rights reserved. Atmospheric Ocean Design System.
      </footer>
    </div>
  );
}
