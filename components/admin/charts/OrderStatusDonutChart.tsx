'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { PieChart, CheckCircle2, Truck, Package, Clock } from 'lucide-react';

interface OrderStatusSegment {
  id: string;
  labelVi: string;
  labelEn: string;
  percentage: number;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export const OrderStatusDonutChart: React.FC = () => {
  const { language } = useLanguage();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const segments: OrderStatusSegment[] = [
    {
      id: 'delivered',
      labelVi: 'Giao Thành Công',
      labelEn: 'Delivered',
      percentage: 68,
      count: 12546,
      color: '#0284C7', // Sky Blue 600
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'transit',
      labelVi: 'Đang Vận Chuyển',
      labelEn: 'In Transit',
      percentage: 18,
      count: 3321,
      color: '#0EA5E9', // Sky 500
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      id: 'processing',
      labelVi: 'Shop Đang Đóng Gói',
      labelEn: 'Merchant Packing',
      percentage: 10,
      count: 1845,
      color: '#38BDF8', // Sky 400
      icon: <Package className="w-3.5 h-3.5" />,
    },
    {
      id: 'pending',
      labelVi: 'Chờ Tiếp Nhận',
      labelEn: 'Pending Review',
      percentage: 4,
      count: 738,
      color: '#BAE6FD', // Sky 200
      icon: <Clock className="w-3.5 h-3.5" />,
    },
  ];

  // Circumference for r = 70
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  let accumulatedPercent = 0;

  return (
    <div className="rounded-[32px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden ambient-glow-sky flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight font-sans">
            {language === 'vi' ? 'Trạng Thái Đơn Hàng' : 'Fulfillment Status'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-sans">
          {language === 'vi'
            ? 'Phân bổ tiến độ chuỗi cung ứng logistics thời gian thực'
            : 'Real-time multi-tier fulfillment pipeline distribution'}
        </p>
      </div>

      {/* Donut Chart & Center Metric */}
      <div className="relative flex items-center justify-center py-2">
        <svg viewBox="0 0 180 180" className="w-44 h-44 sm:w-48 sm:h-48 transform -rotate-90 overflow-visible">
          {/* Base Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="16"
          />

          {/* Slices */}
          {segments.map((seg) => {
            const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += seg.percentage;
            const isHovered = hoveredSegment === seg.id;

            return (
              <circle
                key={seg.id}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? 20 : 16}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center Typography Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
          <span className="text-2xl font-black text-[#0F172A] font-mono tracking-tight">
            96.8%
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
            {language === 'vi' ? 'ĐÚNG HẸN' : 'ON-TIME SLA'}
          </span>
        </div>
      </div>

      {/* Legend & Count Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        {segments.map((seg) => {
          const isHovered = hoveredSegment === seg.id;
          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredSegment(seg.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                isHovered ? 'bg-sky-50/80 scale-[1.02]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className={`text-slate-700 ${isHovered ? 'font-bold text-[#0F172A]' : 'font-medium'}`}>
                  {language === 'vi' ? seg.labelVi : seg.labelEn}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-bold text-[#0F172A]">{seg.percentage}%</span>
                <span className="text-slate-500 font-medium">({seg.count.toLocaleString()})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
