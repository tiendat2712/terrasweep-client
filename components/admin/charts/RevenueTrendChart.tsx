'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';

interface RevenueDataPoint {
  label: string;
  revenue: number; // in VND
  orders: number;
}

const DATA_7D: RevenueDataPoint[] = [
  { label: 'T2', revenue: 142000000, orders: 184 },
  { label: 'T3', revenue: 168000000, orders: 215 },
  { label: 'T4', revenue: 155000000, orders: 198 },
  { label: 'T5', revenue: 189000000, orders: 242 },
  { label: 'T6', revenue: 224000000, orders: 290 },
  { label: 'T7', revenue: 285000000, orders: 368 },
  { label: 'CN', revenue: 260000000, orders: 334 },
];

const DATA_30D: RevenueDataPoint[] = [
  { label: 'Tuần 1', revenue: 890000000, orders: 1140 },
  { label: 'Tuần 2', revenue: 980000000, orders: 1260 },
  { label: 'Tuần 3', revenue: 1150000000, orders: 1480 },
  { label: 'Tuần 4', revenue: 1260950000, orders: 1620 },
];

const DATA_12M: RevenueDataPoint[] = [
  { label: 'T1', revenue: 2400000000, orders: 3100 },
  { label: 'T2', revenue: 2100000000, orders: 2750 },
  { label: 'T3', revenue: 2800000000, orders: 3600 },
  { label: 'T4', revenue: 3100000000, orders: 3950 },
  { label: 'T5', revenue: 3450000000, orders: 4400 },
  { label: 'T6', revenue: 3200000000, orders: 4100 },
  { label: 'T7', revenue: 3650000000, orders: 4700 },
  { label: 'T8', revenue: 3900000000, orders: 5020 },
  { label: 'T9', revenue: 4280950000, orders: 5540 },
];

export const RevenueTrendChart: React.FC = () => {
  const { language } = useLanguage();
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '12M'>('7D');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData =
    timeframe === '7D' ? DATA_7D : timeframe === '30D' ? DATA_30D : DATA_12M;

  const maxRevenue = Math.max(...activeData.map((d) => d.revenue));
  const minRevenue = Math.min(...activeData.map((d) => d.revenue)) * 0.85;

  // Chart dimensions inside SVG viewBox (0 0 600 200)
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = activeData.map((item, idx) => {
    const x =
      paddingX +
      (idx / (activeData.length - 1 || 1)) * graphWidth;
    const y =
      svgHeight -
      paddingY -
      ((item.revenue - minRevenue) / (maxRevenue - minRevenue || 1)) * graphHeight;
    return { x, y, item };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x} ${svgHeight - paddingY} L ${points[0]?.x} ${svgHeight - paddingY} Z`;

  const formatVND = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(2) + ' tỷ ₫';
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(0) + ' tr ₫';
    }
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  const totalPeriodRevenue = activeData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodOrders = activeData.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="rounded-[32px] ocean-surface border border-sky-100/90 p-6 sm:p-7 shadow-sm space-y-6 relative overflow-hidden ambient-glow-sky">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight font-sans">
              {language === 'vi' ? 'Biểu Đồ Doanh Thu & Đơn Hàng' : 'Revenue & Order Flow'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {language === 'vi'
              ? 'Dòng tiền giao dịch GMV và lưu lượng đơn thực tế toàn hệ sinh thái'
              : 'Ecosystem GMV transaction volume & real-time order execution'}
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200 select-none self-start sm:self-auto">
          {(['7D', '30D', '12M'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTimeframe(mode);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                timeframe === mode
                  ? 'btn-ocean-primary font-bold'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              {mode === '7D'
                ? language === 'vi' ? '7 Ngày' : '7 Days'
                : mode === '30D'
                ? language === 'vi' ? '30 Ngày' : '30 Days'
                : language === 'vi' ? 'Năm Nay' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden">
        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 100 - 15}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full z-20 pointer-events-none p-2.5 rounded-xl bg-slate-950/95 text-white shadow-xl shadow-sky-950/40 border border-sky-500/40 text-left font-sans whitespace-nowrap animate-in fade-in zoom-in-95 backdrop-blur-md"
          >
            <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">
              {points[hoveredIndex].item.label}
            </div>
            <div className="text-xs font-black text-white font-mono tabular-nums mt-0.5">
              {formatVND(points[hoveredIndex].item.revenue)}
            </div>
            <div className="text-[10px] text-slate-300 font-mono tabular-nums mt-0.5">
              {points[hoveredIndex].item.orders} {language === 'vi' ? 'đơn hàng' : 'orders'}
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + ratio * graphHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Spline Curve Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Vertical Hairlines */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* Vertical Hairline on Hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={svgHeight - paddingY}
                    stroke="#94A3B8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  className={`transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'fill-white stroke-sky-600 stroke-[3px]'
                      : 'fill-sky-600 stroke-white stroke-[1.5px]'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Invisible hover touch target */}
                <rect
                  x={pt.x - 20}
                  y={paddingY}
                  width={40}
                  height={graphHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-500 font-medium select-none"
                >
                  {pt.item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary KPI Footnotes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100">
          <div className="text-[10px] font-mono uppercase text-sky-800 font-bold">
            {language === 'vi' ? 'TỔNG GMV GIAO DỊCH' : 'TOTAL GMV VOLUME'}
          </div>
          <div className="text-base font-black text-foreground font-mono mt-1">
            {formatVND(totalPeriodRevenue)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100">
          <div className="text-[10px] font-mono uppercase text-sky-800 font-bold">
            {language === 'vi' ? 'LƯỢNG ĐƠN HOÀN TẤT' : 'TOTAL COMPLETED ORDERS'}
          </div>
          <div className="text-base font-black text-foreground font-mono mt-1">
            {totalPeriodOrders.toLocaleString()} {language === 'vi' ? 'đơn' : 'orders'}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-zinc-200/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
              {language === 'vi' ? 'TĂNG TRƯỞNG KỲ' : 'PERIOD GROWTH'}
            </div>
            <div className="text-base font-black text-emerald-700 font-mono mt-1 flex items-center gap-1">
              +18.4%
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
            SLA 99.8%
          </div>
        </div>
      </div>
    </div>
  );
};
