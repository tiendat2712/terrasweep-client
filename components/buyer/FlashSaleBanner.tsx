import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

interface FlashSaleBannerProps {
  flashProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({
  flashProducts,
  onSelectProduct,
}) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 42,
    seconds: 14,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="services-section" className="my-10 space-y-8">
      {/* 1. EDITORIAL HERO HEADLINE */}
      <div className="space-y-3">
        {/* Subtle pill tag / kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#0C0C0C]" />
          <span>{t('hero.kicker')}</span>
        </div>

        {/* Big Editorial Headline with italic serif accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#0C0C0C] tracking-tight leading-tight">
              {t('hero.headlinePart1')} <br />
              <span className="font-serif italic font-normal tracking-normal text-zinc-900">
                {t('hero.headlineAccent')}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 max-w-xl mt-2 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Minimal Live Countdown Box */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200 shadow-xs self-start md:self-end">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#0C0C0C]" />
              <span className="text-[11px] uppercase tracking-wider font-mono">{t('hero.nextDrop')}</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-[#0C0C0C]">
              <span className="px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200">
                {formatNumber(timeLeft.hours)}h
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200">
                {formatNumber(timeLeft.minutes)}m
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200">
                {formatNumber(timeLeft.seconds)}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TWO LARGE BENTO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bento 1: Style Consulting */}
        <div className="group rounded-[28px] bg-white border border-zinc-200 p-6 shadow-xs hover:border-zinc-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 mb-5">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
              alt="Style Consulting"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 border border-zinc-200">
              {t('hero.styleConsultingBadge')}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0C0C0C]">{t('hero.styleConsultingTitle')}</h3>
              <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-[#0C0C0C] group-hover:text-white transition-colors flex items-center justify-center text-zinc-700">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              {t('hero.styleConsultingDesc')}
            </p>
          </div>
        </div>

        {/* Bento 2: Care & Cleaning */}
        <div className="group rounded-[28px] bg-white border border-zinc-200 p-6 shadow-xs hover:border-zinc-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 mb-5">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
              alt="Care & Cleaning"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 border border-zinc-200">
              {t('hero.careCleaningBadge')}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0C0C0C]">{t('hero.careCleaningTitle')}</h3>
              <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-[#0C0C0C] group-hover:text-white transition-colors flex items-center justify-center text-zinc-700">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              {t('hero.careCleaningDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
