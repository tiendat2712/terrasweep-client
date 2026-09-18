'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Filter, Eye, ShoppingCart, CreditCard, CheckCircle2, Award, ArrowDownRight, Sparkles } from 'lucide-react';

interface FunnelStep {
  id: string;
  stepNameVi: string;
  stepNameEn: string;
  count: number;
  overallPercent: number; // vs Step 1
  stepConversion: number; // vs previous step
  dropoffRate: number;
  color: string;
  icon: React.ReactNode;
  highlightNoteVi: string;
  highlightNoteEn: string;
}

const FUNNEL_STEPS: FunnelStep[] = [
  {
    id: 'views',
    stepNameVi: 'Lượt Khám Phá & Xem Sản Phẩm',
    stepNameEn: 'Product Page Views',
    count: 1450000,
    overallPercent: 100,
    stepConversion: 100,
    dropoffRate: 0,
    color: 'from-sky-400 to-sky-500',
    icon: <Eye className="w-4 h-4 text-sky-600" />,
    highlightNoteVi: 'Lượng truy cập hữu cơ từ chiến dịch Flash Sale & SEO',
    highlightNoteEn: 'Organic traffic from Flash Sale campaigns & SEO',
  },
  {
    id: 'cart',
    stepNameVi: 'Thêm Vào Giỏ Hàng',
    stepNameEn: 'Added to Cart',
    count: 384200,
    overallPercent: 26.5,
    stepConversion: 26.5,
    dropoffRate: 73.5,
    color: 'from-cyan-400 to-sky-500',
    icon: <ShoppingCart className="w-4 h-4 text-cyan-600" />,
    highlightNoteVi: 'Tỷ lệ thêm giỏ cao nhờ hiệu ứng tương tác 3D và chọn size tức thì',
    highlightNoteEn: 'High add-to-cart rate boosted by 3D shoe previews and size pickers',
  },
  {
    id: 'checkout',
    stepNameVi: 'Bắt Đầu Vào Thanh Toán',
    stepNameEn: 'Initiated Checkout',
    count: 128500,
    overallPercent: 8.9,
    stepConversion: 33.4,
    dropoffRate: 66.6,
    color: 'from-blue-400 to-indigo-500',
    icon: <CreditCard className="w-4 h-4 text-blue-600" />,
    highlightNoteVi: 'Khách hàng áp dụng mã Freeship & chọn phương thức VietQR/COD',
    highlightNoteEn: 'Customers apply Freeship coupons and select VietQR/COD payment',
  },
  {
    id: 'placed',
    stepNameVi: 'Đặt Hàng & Tạo Mã Vận Đơn',
    stepNameEn: 'Orders Placed',
    count: 89200,
    overallPercent: 6.2,
    stepConversion: 69.4,
    dropoffRate: 30.6,
    color: 'from-indigo-500 to-sky-600',
    icon: <CheckCircle2 className="w-4 h-4 text-indigo-600" />,
    highlightNoteVi: 'Tỷ lệ chốt đơn xuất sắc nhờ chính sách Đổi trả 7 ngày linh hoạt',
    highlightNoteEn: 'Strong checkout closure backed by 7-day hassle-free return policy',
  },
  {
    id: 'delivered',
    stepNameVi: 'Giao Thành Công & Đánh Giá',
    stepNameEn: 'Delivered & Reviewed',
    count: 85600,
    overallPercent: 5.9,
    stepConversion: 96.0,
    dropoffRate: 4.0,
    color: 'from-emerald-400 to-teal-500',
    icon: <Award className="w-4 h-4 text-emerald-600" />,
    highlightNoteVi: 'Tỷ lệ giao hoàn tất đạt 96.0% trên toàn bộ mạng lưới bưu tá Shipper PRO',
    highlightNoteEn: '96.0% final fulfillment rate across Shipper PRO fleet network',
  },
];

export const PlatformConversionFunnelChart: React.FC = () => {
  const { language } = useLanguage();
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="rounded-[32px] ocean-surface border border-sky-100/90 p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden ambient-glow-sky">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight font-sans">
              {language === 'vi' ? 'Phễu Chuyển Đổi Mua Sắm Toàn Sàn' : 'Platform E-Commerce Conversion Funnel'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {language === 'vi'
              ? 'Đo lường tỷ lệ giữ chân khách qua 5 mốc quyết định từ Lượt xem đến Giao hàng thành công'
              : 'End-to-end retention and dropoff telemetry from discovery to final delivery'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Avg. Conversion: 6.2%</span>
        </div>
      </div>

      {/* Funnel Pipeline Horizontal / Vertical Display */}
      <div className="space-y-3">
        {FUNNEL_STEPS.map((step, idx) => {
          const isHovered = hoveredStep === step.id;
          const widthPercent = Math.max(step.overallPercent, 12); // minimum width so text is visible

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'bg-sky-50/80 border border-sky-300 shadow-sm ring-2 ring-sky-200/50'
                  : 'bg-slate-50/50 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {/* Row 1: Step Number, Title, Count, Overall % */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs font-mono font-bold text-xs text-sky-700">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>{language === 'vi' ? step.stepNameVi : step.stepNameEn}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {language === 'vi' ? step.highlightNoteVi : step.highlightNoteEn}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-slate-900 font-mono block">
                    {formatNumber(step.count)}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[11px] font-mono">
                    <span className="font-bold text-sky-700">{step.overallPercent}%</span>
                    {idx > 0 && (
                      <span className="text-slate-400 text-[10px]">
                        ({step.stepConversion}% kế thừa)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar with Step Width */}
              <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Drop-off Cue between steps */}
              {idx < FUNNEL_STEPS.length - 1 && isHovered && (
                <div className="mt-2 pt-2 border-t border-sky-100/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-red-600 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    Tỷ lệ rơi rớt: -{FUNNEL_STEPS[idx + 1].dropoffRate}%
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Giữ chân bước tiếp theo: {FUNNEL_STEPS[idx + 1].stepConversion}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
