'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Layers, TrendingUp, Footprints, Flame, Trophy, Compass, ShieldCheck } from 'lucide-react';

interface CategoryShareItem {
  id: string;
  nameVi: string;
  nameEn: string;
  sharePercent: number;
  revenue: number; // in VND
  unitsSold: number;
  growth: string;
  colorGradient: string;
  icon: React.ReactNode;
}

const CATEGORY_DATA: CategoryShareItem[] = [
  {
    id: 'running',
    nameVi: 'Giày Chạy Bộ Chuyên Dụng (Running)',
    nameEn: 'Performance Running Shoes',
    sharePercent: 43.2,
    revenue: 1849000000,
    unitsSold: 7980,
    growth: '+28.4%',
    colorGradient: 'from-sky-500 to-sky-600',
    icon: <Footprints className="w-4 h-4 text-sky-600" />,
  },
  {
    id: 'lifestyle',
    nameVi: 'Lifestyle & Court Sneaker',
    nameEn: 'Lifestyle & Everyday Sneakers',
    sharePercent: 26.5,
    revenue: 1134500000,
    unitsSold: 4890,
    growth: '+14.2%',
    colorGradient: 'from-cyan-400 to-sky-500',
    icon: <Flame className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'basketball',
    nameVi: 'Bóng Rổ & Indoor Court',
    nameEn: 'Basketball & Court Footwear',
    sharePercent: 16.8,
    revenue: 719200000,
    unitsSold: 3100,
    growth: '+9.7%',
    colorGradient: 'from-blue-500 to-indigo-600',
    icon: <Trophy className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'trail',
    nameVi: 'Leo Núi & Trail Carbon',
    nameEn: 'Trail & Outdoor Carbon',
    sharePercent: 8.5,
    revenue: 363800000,
    unitsSold: 1560,
    growth: '+32.1%',
    colorGradient: 'from-teal-400 to-emerald-500',
    icon: <Compass className="w-4 h-4 text-teal-600" />,
  },
  {
    id: 'accessories',
    nameVi: 'Phụ Kiện Vận Động & Vớ Thể Thao',
    nameEn: 'Athletic Accessories & Socks',
    sharePercent: 5.0,
    revenue: 214450000,
    unitsSold: 920,
    growth: '+6.5%',
    colorGradient: 'from-slate-400 to-slate-500',
    icon: <ShieldCheck className="w-4 h-4 text-slate-600" />,
  },
];

export const CategoryMarketShareChart: React.FC = () => {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatVND = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(2) + ' tỷ ₫';
    }
    return (val / 1000000).toFixed(0) + ' triệu ₫';
  };

  return (
    <div className="rounded-[32px] ocean-surface border border-sky-100/90 p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden ambient-glow-sky">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight font-sans">
              {language === 'vi' ? 'Cơ Cấu Thị Phần Doanh Số Theo Ngành' : 'Category Revenue & Market Share'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {language === 'vi'
              ? 'Tỷ trọng đóng góp GMV và tốc độ tăng trưởng của 5 phân khúc mũi nhọn'
              : 'GMV contribution ratio and year-over-year momentum across core categories'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+21.8% GMV Overall</span>
        </div>
      </div>

      {/* Category Progress Bars List */}
      <div className="space-y-4">
        {CATEGORY_DATA.map((cat) => {
          const isHovered = hoveredId === cat.id;
          return (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'bg-sky-50/70 border border-sky-200 shadow-xs'
                  : 'bg-slate-50/60 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {/* Row 1: Icon, Name, Share %, Revenue */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">
                      {language === 'vi' ? cat.nameVi : cat.nameEn}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {cat.unitsSold.toLocaleString('vi-VN')} {language === 'vi' ? 'sản phẩm' : 'units'} • {cat.growth} YoY
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {formatVND(cat.revenue)}
                    </span>
                    <span className="text-xs font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-full font-mono">
                      {cat.sharePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.colorGradient} transition-all duration-500`}
                  style={{ width: `${cat.sharePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
