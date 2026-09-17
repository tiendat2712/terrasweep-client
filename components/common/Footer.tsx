'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  ShieldCheck,
  Zap,
  RotateCcw,
  Headphones,
  Lock,
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  X,
  Send,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: language === 'vi' 
        ? 'Xin chào! Concierge TerraSweep luôn sẵn sàng hỗ trợ bạn 24/7. Bạn cần tư vấn về sản phẩm hay đơn hàng nào?'
        : 'Hello! TerraSweep Private Concierge is online 24/7. How may we assist you today?'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isBotTyping) return;
    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: language === 'vi'
            ? 'Cảm ơn bạn đã liên hệ! Chuyên viên Concierge TerraSweep đang tiếp nhận thông tin và sẽ phản hồi trong giây lát.'
            : 'Thank you for reaching out! A dedicated TerraSweep Concierge specialist is reviewing your request.'
        }
      ]);
    }, 850);
  };

  return (
    <footer className="mt-20 w-full bg-gradient-to-b from-transparent via-white/80 to-white/95 border-t border-sky-100/90 text-slate-700 relative">
      {/* ========================================================================= */}
      {/* 1. BRAND VALUE PILLARS (ATMOSPHERIC OCEAN GLASS CARDS - 1:1 WITH GUIDE)  */}
      {/* ========================================================================= */}
      <div id="why-us-section" className="w-full border-b border-sky-100/80 bg-gradient-to-b from-sky-50/40 via-sky-50/15 to-transparent backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex items-start gap-4 p-5 sm:p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm shadow-sky-500/5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors uppercase tracking-wider">{t('footer.flashDelivery')}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('footer.flashDeliverySub')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 sm:p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm shadow-sky-500/5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors uppercase tracking-wider">{t('footer.authentic')}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('footer.authenticSub')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 sm:p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm shadow-sky-500/5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors uppercase tracking-wider">{t('footer.returns')}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('footer.returnsSub')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 sm:p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/25 to-white/95 border border-sky-100/90 shadow-sm shadow-sky-500/5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors uppercase tracking-wider">{t('footer.concierge')}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('footer.conciergeSub')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STREAMLINED 4-COLUMN EDITORIAL DIRECTORY (LUXURY, POLISHED, NO SPAM)   */}
      {/* ========================================================================= */}
      <div id="about-section" className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            
            {/* Col 1: Brand Philosophy & Concierge Contact (Oceanic Glass Alignment) */}
            <div className="space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-100/80 shadow-2xs">
                    <img
                      src="/images/brand-logo.webp"
                      alt="TerraSweep"
                      className="w-full h-full object-contain mix-blend-multiply scale-140"
                    />
                  </div>
                  <h3 className="text-2xl sm:text-[26px] font-black tracking-[-0.03em] font-sans">
                    <span className="text-slate-900">Terra</span>
                    <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 bg-clip-text text-transparent">Sweep</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'vi'
                    ? 'Nền tảng thương mại điện tử chuyên biệt về sneakers hiệu năng cao và streetwear kiến trúc. Mọi sản phẩm đều được kiểm định 100% chính hãng trước khi xuất kho.'
                    : 'Curated high-performance footwear and architectural streetwear platform. Every single item undergoes rigorous authenticity verification before dispatch.'}
                </p>
              </div>

              <div className="pt-2 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 text-slate-900 font-semibold group cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200/70 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <span className="text-sky-950 font-bold group-hover:text-sky-600 transition-colors">1900 8899 (24/7 Hotline)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-7 h-7 rounded-lg bg-sky-50/60 border border-sky-100/80 text-sky-500 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <span>concierge@terrasweep.com</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-600 leading-snug">
                  <div className="w-7 h-7 rounded-lg bg-sky-50/60 border border-sky-100/80 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <span>Tầng 19, Tòa nhà Saigon Centre – Tháp 2, 67 Lê Lợi, Bến Nghé, Quận 1, TP. HCM</span>
                </div>
              </div>
            </div>

            {/* Col 2: Customer Care */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">
                {t('footer.customerCareTitle')}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.helpCenter')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.orderGuide')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.shippingDelivery')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.returnsRefund')}
                  </a>
                </li>
                <li>
                  <a href="#collection-section" className="hover:text-sky-600 transition-colors font-medium text-slate-800">
                    {language === 'vi' ? 'Hướng dẫn chọn size giày & quần áo' : 'Size & Fit Exploration Guide'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Ecosystem & Legal */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">
                {t('footer.aboutTitle')}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.aboutUs')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.sellWithUs')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.careers')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.terms')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.privacy')}
                  </a>
                </li>
                <li>
                  <a href="#about-section" className="hover:text-sky-600 transition-colors">
                    {t('footer.ipProtection')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Payment Methods & Authentic Compliance Seals */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 mb-3">
                  {t('footer.paymentMethodsTitle')}
                </h3>
                
                {/* Authentic Vector Payment Logos (Oceanic Framed Cards) */}
                <div className="grid grid-cols-3 gap-2">
                  {/* 1. Visa Official Vector */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center p-2 shadow-2xs transition-colors" title="Visa">
                    <svg className="h-3.5 w-auto" viewBox="0 0 50 16" fill="none">
                      <path d="M19.12 1.02L13.14 15.35H8.78L5.35 4.3C5.14 3.47 4.96 3.17 4.3 2.82C3.23 2.25 1.51 1.72 0 1.39L0.09 1.02H7.28C8.21 1.02 9.04 1.63 9.24 2.68L11.01 12.02L15.37 1.02H19.12ZM35.9 10.74C35.92 6.64 30.15 6.42 30.19 4.62C30.2 4.07 30.73 3.48 31.91 3.33C32.49 3.25 34.1 3.2 35.94 4.05L36.68 0.64C35.67 0.27 34.37 0 32.72 0C28.73 0 25.9 2.12 25.88 5.16C25.85 7.41 27.87 8.66 29.41 9.41C30.98 10.18 31.51 10.67 31.5 11.35C31.49 12.4 30.24 12.87 29.08 12.89C27.04 12.92 25.85 12.35 24.9 11.91L24.13 15.48C25.12 15.93 26.93 16.32 28.8 16.35C33.02 16.35 35.88 14.26 35.9 10.74ZM46.46 15.35H50.31L46.93 1.02H43.34C42.54 1.02 41.87 1.48 41.58 2.17L35.53 15.35H39.88L40.75 12.96H46.06L46.46 15.35ZM41.96 9.61L44.15 3.6L45.42 9.61H41.96ZM24.28 1.02L20.84 15.35H16.79L20.23 1.02H24.28Z" fill="#1434CB"/>
                    </svg>
                  </div>

                  {/* 2. Mastercard Official Vector */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center p-2 shadow-2xs transition-colors" title="Mastercard">
                    <svg className="h-5 w-auto" viewBox="0 0 36 22" fill="none">
                      <circle cx="11" cy="11" r="11" fill="#EB001B"/>
                      <circle cx="25" cy="11" r="11" fill="#F79E1B"/>
                      <path d="M18 3.56a10.96 10.96 0 0 1 4 7.44c0 2.87-1.1 5.49-2.9 7.44A10.96 10.96 0 0 1 18 18.44a10.96 10.96 0 0 1-1.1-7.44c0-2.87 1.1-5.49 2.9-7.44h.2z" fill="#FF5F00"/>
                    </svg>
                  </div>

                  {/* 3. JCB Official Brand Vector (Khớp chuẩn 100% Ảnh media_1789630956748.png) */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center p-1.5 shadow-2xs transition-colors" title="JCB Card">
                    <svg className="h-6 w-auto" viewBox="140 60 500 380" fill="none">
                      <rect x="145" y="62" width="490" height="375" rx="70" fill="#FFFFFF" />
                      <path d="m174.74 139.54c0.674-27.163 24.889-50.611 51.875-51.007 26.944-0.083 53.891-0.012 80.837-0.036-0.074 90.885 0.148 181.78-0.112 272.66-1.038 26.835-24.99 49.835-51.679 50.308-26.996 0.099-53.995 0.014-80.992 0.042v-113.45c26.223 6.194 53.722 8.832 80.473 4.721 15.993-2.574 33.488-10.424 38.902-27.014 3.986-14.191 1.742-29.126 2.334-43.691v-33.824h-46.297c-0.208 22.369 0.426 44.779-0.335 67.125-1.248 13.734-14.846 22.46-27.8 21.994-16.066 0.17-47.898-11.639-47.898-11.639-0.08-41.918 0.466-94.409 0.692-136.18z" fill="#003B77"/>
                      <path d="m324.72 211.89c-2.434 0.517-0.489-8.301-1.113-11.646 0.165-21.15-0.347-42.323 0.283-63.458 2.083-26.829 26.991-48.916 53.739-48.288h78.766c-0.073 90.884 0.147 181.78-0.111 272.66-1.039 26.834-24.992 49.833-51.681 50.308-26.997 0.1-53.997 0.015-80.997 0.043v-124.3c18.44 15.128 43.5 17.483 66.473 17.524 17.316-6e-3 34.534-2.674 51.35-6.67v-22.772c-18.953 9.446-41.232 15.446-62.243 10.019-14.655-3.65-25.294-17.812-25.056-32.937-1.699-15.728 7.524-32.335 22.981-37.011 19.189-6.008 40.107-1.413 58.096 6.397 3.854 2.019 7.765 4.521 6.222-1.921v-17.9c-30.084-7.156-62.101-9.792-92.329-2.004-8.749 2.469-17.271 6.212-24.38 11.958z" fill="#DA251D"/>
                      <path d="m498.86 256.54c11.684 0.253 23.437-0.516 35.076 0.4 11.787 2.199 14.629 20.043 4.156 25.888-7.141 3.851-15.633 1.433-23.379 2.113h-15.852l-1e-3 -28.401zm41.833-32.145c2.596 9.164-6.238 17.392-15.066 16.13h-26.767c0.185-8.642-0.368-18.021 0.271-26.208 10.725 0.301 21.549-0.616 32.21 0.479 4.581 1.151 8.414 4.917 9.352 9.599zm64.428-135.9c0.498 17.501 0.071 35.927 0.214 53.783-0.035 72.596 0.072 145.19-0.055 217.79-0.47 27.207-24.582 50.844-51.601 51.387-27.046 0.111-54.095 0.016-81.142 0.047v-109.75c29.47-0.154 58.959 0.307 88.417-0.232 13.667-0.859 28.632-9.875 29.27-24.914 1.61-15.103-12.632-25.551-26.152-27.201-5.198-0.135-5.044-1.516 0-2.117 12.892-2.787 23.02-16.133 19.226-29.499-3.236-14.058-18.772-19.499-31.697-19.472-26.351-0.18-52.709-0.026-79.062-0.077 0.172-20.489-0.354-41 0.286-61.474 2.087-26.716 26.806-48.747 53.447-48.27h78.849v-1e-3z" fill="#007934"/>
                    </svg>
                  </div>

                  {/* 4. Apple Pay Official Brand Vector (Sửa triệt để chữ P với vector chuẩn Apple) */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center px-2 py-1 shadow-2xs transition-colors" title="Apple Pay">
                    <svg className="h-4.5 w-auto" viewBox="10 12.5 37.5 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.5771 14.9265C17.1553 15.4313 16.4803 15.8294 15.8053 15.7725C15.7209 15.09 16.0513 14.3649 16.4381 13.9171C16.8599 13.3981 17.5982 13.0284 18.1959 13C18.2662 13.7109 17.992 14.4076 17.5771 14.9265ZM18.1888 15.9076C17.5942 15.873 17.0516 16.0884 16.6133 16.2624C16.3313 16.3744 16.0924 16.4692 15.9107 16.4692C15.7068 16.4692 15.4581 16.3693 15.1789 16.2571C14.813 16.1102 14.3947 15.9422 13.956 15.9502C12.9506 15.9645 12.0154 16.5403 11.5021 17.4573C10.4474 19.2915 11.2279 22.0071 12.2474 23.5C12.7467 24.2393 13.3443 25.0498 14.1318 25.0213C14.4783 25.0081 14.7275 24.9012 14.9854 24.7905C15.2823 24.6631 15.5908 24.5308 16.0724 24.5308C16.5374 24.5308 16.8324 24.6597 17.1155 24.7834C17.3847 24.9011 17.6433 25.014 18.0271 25.0071C18.8428 24.9929 19.356 24.2678 19.8553 23.5284C20.394 22.7349 20.6307 21.9605 20.6667 21.843L20.6709 21.8294C20.67 21.8285 20.6634 21.8254 20.6516 21.82C20.4715 21.7366 19.095 21.0995 19.0818 19.391C19.0686 17.957 20.1736 17.2304 20.3476 17.116C20.3582 17.109 20.3653 17.1043 20.3685 17.1019C19.6654 16.0498 18.5685 15.936 18.1888 15.9076ZM23.8349 24.9289V13.846H27.9482C30.0717 13.846 31.5553 15.3246 31.5553 17.4858C31.5553 19.6469 30.0435 21.1398 27.892 21.1398H25.5365V24.9289H23.8349ZM25.5365 15.2962H27.4982C28.9748 15.2962 29.8185 16.0924 29.8185 17.4929C29.8185 18.8934 28.9748 19.6967 27.4912 19.6967H25.5365V15.2962ZM37.1732 23.5995C36.7232 24.4668 35.7318 25.0142 34.6631 25.0142C33.081 25.0142 31.9771 24.0616 31.9771 22.6256C31.9771 21.2038 33.0459 20.3863 35.0217 20.2654L37.1451 20.1374V19.5261C37.1451 18.6232 36.5615 18.1327 35.5209 18.1327C34.6631 18.1327 34.0373 18.5806 33.9107 19.263H32.3779C32.4271 17.827 33.7631 16.782 35.5701 16.782C37.5177 16.782 38.7834 17.8128 38.7834 19.4123V24.9289H37.2084V23.5995H37.1732ZM35.1201 23.6991C34.2131 23.6991 33.6365 23.2583 33.6365 22.5829C33.6365 21.8863 34.192 21.481 35.2537 21.4171L37.1451 21.2962V21.9218C37.1451 22.9597 36.2732 23.6991 35.1201 23.6991ZM44.0076 25.3626C43.3256 27.3033 42.5451 27.9431 40.8857 27.9431C40.7592 27.9431 40.3373 27.9289 40.2388 27.9005V26.5711C40.3443 26.5853 40.6045 26.5995 40.7381 26.5995C41.4904 26.5995 41.9123 26.2796 42.1724 25.4479L42.3271 24.9573L39.4443 16.8886H41.2232L43.2271 23.436H43.2623L45.2662 16.8886H46.9959L44.0076 25.3626Z" fill="#0C0C0C"/>
                    </svg>
                  </div>

                  {/* 5. MoMo Official Brand Vector (Dạng ngang đồng bộ với khung thẻ) */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center px-2 py-1 shadow-2xs transition-colors" title="Ví MoMo">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-5.5 w-5.5 shrink-0" viewBox="0 0 100 100" fill="none">
                        <rect width="100" height="100" rx="20" fill="#A50064" />
                        <text x="50" y="44" fill="#FFFFFF" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="38" textAnchor="middle" letterSpacing="-2">mo</text>
                        <text x="50" y="76" fill="#FFFFFF" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="38" textAnchor="middle" letterSpacing="-2">mo</text>
                        <text x="50" y="90" fill="#FFFFFF" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="700" fontSize="7.5" textAnchor="middle" letterSpacing="0.4">mobile money</text>
                      </svg>
                      <span className="font-sans font-black text-xs text-[#A50064] tracking-tight leading-none select-none">
                        MoMo
                      </span>
                    </div>
                  </div>

                  {/* 6. COD (Cash on Delivery) Official Badge */}
                  <div className="h-10 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center justify-center px-2.5 py-1 shadow-2xs transition-colors" title="Thanh toán khi nhận hàng (COD)">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5.5 h-5.5 rounded-md bg-[#047857] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                      </div>
                      <span className="font-sans font-black text-xs text-[#0F172A] tracking-wider leading-none select-none">
                        COD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 mb-3">
                  {language === 'vi' ? 'Chứng nhận chính thức' : 'Official Certifications'}
                </h3>
                
                {/* 3 Authentic Compliance Seals (Clean, Premium, Trustworthy Palette) */}
                <div className="space-y-2">
                  {/* Seal 1: Đã Đăng Ký Bộ Công Thương (Official Ministry Blue) */}
                  <div className="px-3 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center gap-3 shadow-2xs transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-[#005BAA] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      ✓
                    </div>
                    <div className="leading-tight text-left">
                      <p className="text-[8.5px] font-sans font-bold text-[#005BAA] uppercase tracking-wider">
                        {language === 'vi' ? 'ĐÃ ĐĂNG KÝ' : 'OFFICIAL REGISTRY'}
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {language === 'vi' ? 'Bộ Công Thương' : 'Ministry of Industry & Trade'}
                      </p>
                    </div>
                  </div>

                  {/* Seal 2: 100% Chính Hãng (Trust Emerald) */}
                  <div className="px-3 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center gap-3 shadow-2xs transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="leading-tight text-left">
                      <p className="text-[8.5px] font-sans font-bold text-emerald-600 uppercase tracking-wider">
                        {language === 'vi' ? '100% CHÍNH HÃNG' : '100% GENUINE'}
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {language === 'vi' ? 'Nói không với hàng giả' : 'Zero Fake Guarantee'}
                      </p>
                    </div>
                  </div>

                  {/* Seal 3: PCI DSS Level 1 (Cybersecurity Slate / Navy) */}
                  <div className="px-3 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-sky-100/90 hover:border-sky-300 flex items-center gap-3 shadow-2xs transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-[#1E293B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="leading-tight text-left">
                      <p className="text-[8.5px] font-sans font-bold text-slate-600 uppercase tracking-wider">
                        PCI DSS LEVEL 1
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {language === 'vi' ? 'Bảo mật thanh toán quốc tế' : 'Global Payment Security'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM COPYRIGHT & REGION TELEMETRY BAR                                */}
      {/* ========================================================================= */}
      <div className="w-full bg-sky-50/35 border-t border-sky-100/80 py-6 pb-20 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <p className="text-center md:text-left leading-relaxed">
            © 2026 TerraSweep Vietnam Inc. {t('footer.businessLicense')}
          </p>

          {/* Links With Inline Bullet Connectors (Never Orphaned) */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-slate-600 text-xs">
            <a href="#about-section" className="hover:text-sky-600 transition-colors">{t('footer.policyPrivacy')}</a>
            <span className="text-sky-300">•</span>
            <a href="#about-section" className="hover:text-sky-600 transition-colors">{t('footer.policyOperating')}</a>
            <span className="text-sky-300">•</span>
            <a href="#about-section" className="hover:text-sky-600 transition-colors">{t('footer.policyShipping')}</a>
            <span className="text-sky-300">•</span>
            <a href="#about-section" className="hover:text-sky-600 transition-colors">{t('footer.policyReturnRefund')}</a>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('footer.operationalStatus')}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FLOATING CONCIERGE CHAT WIDGET [ 💬 Chat ]                             */}
      {/* ========================================================================= */}
      {mounted && (
        <div className="fixed bottom-6 right-6 z-40" suppressHydrationWarning>
          {!isChatOpen ? (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsChatOpen(true)}
              className="btn-ocean-primary flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-xs shadow-2xl cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white text-sky-600" />
              <span>{t('footer.chatWidgetLabel')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          ) : (
            <div className="w-80 sm:w-96 rounded-[28px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 ambient-glow-sky">
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold">TerraSweep Concierge</h4>
                    <p className="text-[10px] text-sky-200 font-mono">Online 24/7 Priority Support</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 h-64 overflow-y-auto space-y-3 bg-sky-50/30 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        m.sender === 'user'
                          ? 'btn-ocean-primary text-white rounded-br-none'
                          : 'bg-white border border-sky-100/80 text-slate-800 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-white border border-sky-100/80 text-slate-500 rounded-bl-none shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type your message...'}
                  className="flex-1 bg-slate-100 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={isBotTyping || !chatInput.trim()}
                  aria-busy={isBotTyping}
                  className="w-8 h-8 rounded-full btn-ocean-primary flex items-center justify-center shrink-0 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBotTyping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </footer>
  );
};
