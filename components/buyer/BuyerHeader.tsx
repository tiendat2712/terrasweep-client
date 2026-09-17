'use client';

import React, { useState, useRef } from 'react';
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
  Sparkles
} from 'lucide-react';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNavClick = (hash?: string) => {
    setIsMobileMenuOpen(false);
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
    handleNavClick('#collection-section');
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
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* 1. SINGLE-TIER LUXURY NAVBAR (STRICT 1:1 MATCH WITH REFERENCE IMAGE 1)   */}
      {/* ========================================================================= */}
      <header className="w-full bg-white/85 backdrop-blur-md border-b border-sky-100/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: TerraSweep Brand Identity Lockup (Integrated mark & wordmark) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                onSearch('');
                handleNavClick();
              }}
              className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left focus:outline-none"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/images/brand-logo.webp"
                  alt="TerraSweep"
                  className="w-full h-full object-contain mix-blend-multiply scale-140 group-hover:scale-150 transition-transform duration-300"
                />
              </div>
              <span className="text-[26px] sm:text-[28px] md:text-[30px] font-black tracking-[-0.03em] text-[#0F172A] font-sans group-hover:opacity-85 transition-opacity">
                TerraSweep
              </span>
            </button>
          </div>

          {/* CENTER: Exactly 4 Editorial Navigation Links (Exact Match With Image 1) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-11 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                onSearch('');
                handleNavClick();
              }}
              className="hover:text-sky-600 transition-colors cursor-pointer py-1"
            >
              {t('nav.home')}
            </button>

            <button
              onClick={() => handleNavClick('#about-section')}
              className="hover:text-sky-600 transition-colors cursor-pointer py-1"
            >
              {t('nav.aboutUs')}
            </button>

            <button
              onClick={() => handleNavClick('#why-us-section')}
              className="hover:text-sky-600 transition-colors cursor-pointer py-1"
            >
              {t('nav.whyUs')}
            </button>

            <button
              onClick={() => handleNavClick('#services-section')}
              className="hover:text-sky-600 transition-colors cursor-pointer py-1"
            >
              {t('nav.ourServices')}
            </button>
          </nav>

          {/* RIGHT: Controls (Language Switcher, Search Icon, Cart, Capsule Login Button) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* [ VI | EN ] Language Switcher */}
            <div className="flex items-center rounded-full bg-slate-100 p-0.5 text-[10px] font-mono font-bold border border-slate-200 select-none">
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

            {/* Shopping Cart Circular Button with Dynamic Badge */}
            <button
              onClick={onOpenCart}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 hover:border-sky-500 bg-white text-slate-800 hover:text-sky-600 flex items-center justify-center relative shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title={t('cart.title')}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full btn-ocean-primary text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account OR Capsule Login Button-in-Button (Exact Match Image 1) */}
            {currentUser && currentUser.role !== 'customer' ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="h-10 sm:h-11 pl-2 sm:pl-3 pr-3 sm:pr-3.5 rounded-full border border-zinc-300 hover:border-black bg-white flex items-center gap-2 cursor-pointer font-medium text-xs text-zinc-900 shadow-2xs transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-300"
                  />
                  <span className="max-w-[80px] sm:max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="font-bold text-zinc-900">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSwitchRole('seller');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>{t('nav.sellerChannel')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('shipper');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t('nav.shipperChannel')}</span>
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t('nav.adminChannel')}</span>
                    </button>
                    <div className="my-1 border-t border-zinc-100" />
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 text-red-600 flex items-center gap-2 cursor-pointer text-xs font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.switchAccount')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="h-10 sm:h-11 pl-4 pr-1.5 sm:pr-2 rounded-full border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/40 flex items-center gap-2.5 transition-all shadow-2xs group cursor-pointer active:scale-95"
                title={t('nav.login')}
              >
                <span className="text-xs sm:text-sm font-semibold text-[#0F172A] tracking-tight">
                  {t('nav.login')}
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full btn-ocean-primary flex items-center justify-center group-hover:scale-105 transition-all shadow-2xs">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>
            )}

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-slate-200 bg-white hover:border-sky-500 flex items-center justify-center text-slate-800 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">TerraSweep Menu</span>
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

            <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-800">
              <button
                onClick={() => {
                  onSearch('');
                  handleNavClick();
                }}
                className="text-left py-1 hover:text-sky-600 cursor-pointer"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => handleNavClick('#about-section')}
                className="text-left py-1 hover:text-sky-600 cursor-pointer"
              >
                {t('nav.aboutUs')}
              </button>
              <button
                onClick={() => handleNavClick('#why-us-section')}
                className="text-left py-1 hover:text-sky-600 cursor-pointer"
              >
                {t('nav.whyUs')}
              </button>
              <button
                onClick={() => handleNavClick('#services-section')}
                className="text-left py-1 hover:text-sky-600 cursor-pointer"
              >
                {t('nav.ourServices')}
              </button>
              <button
                onClick={() => handleNavClick('#collection-section')}
                className="text-left py-1 hover:text-sky-600 cursor-pointer"
              >
                {t('nav.collection')}
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
        className="w-full bg-[#F0F7FF]/50 border-b border-slate-200/80 py-6 sm:py-8 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3.5">
          
          {/* Master Search Input Bar */}
          <div className="w-full flex items-center rounded-full bg-white border border-slate-300 hover:border-sky-400 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:shadow-md shadow-2xs pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 transition-all duration-200">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2.5 sm:mr-3 shrink-0" />
            
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTriggerSearch();
              }}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="text-slate-400 hover:text-sky-600 p-1 mr-1 transition-colors cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Ocean Blue Luminous Search Action Button */}
            <button
              onClick={handleTriggerSearch}
              className="btn-ocean-primary rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'vi' ? 'Tìm kiếm' : 'Search'}</span>
            </button>
          </div>

          {/* Curated Trending Tags Row Directly Below Search */}
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center flex-wrap sm:flex-nowrap gap-2 text-xs text-zinc-600 select-none pt-1 overflow-x-auto no-scrollbar">
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
                className="px-3.5 py-1 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300 transition-all text-xs font-medium cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
