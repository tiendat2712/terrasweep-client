'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { BarChart3, Globe, Zap, Clock, Truck, Activity } from 'lucide-react';

interface HourlyThroughput {
  hour: string;
  volume: number; // parcels
  isPeak?: boolean;
  activeTrucks: number;
  avgLatency: string;
}

const HOURLY_DATA: HourlyThroughput[] = [
  { hour: '06:00', volume: 1800, activeTrucks: 8, avgLatency: '18 phút' },
  { hour: '08:00', volume: 4200, activeTrucks: 14, avgLatency: '24 phút' },
  { hour: '10:00', volume: 5800, activeTrucks: 19, avgLatency: '28 phút' },
  { hour: '11:00', volume: 7400, isPeak: true, activeTrucks: 24, avgLatency: '35 phút' },
  { hour: '12:00', volume: 6100, activeTrucks: 20, avgLatency: '31 phút' },
  { hour: '14:00', volume: 5200, activeTrucks: 18, avgLatency: '26 phút' },
  { hour: '16:00', volume: 6800, activeTrucks: 22, avgLatency: '32 phút' },
  { hour: '18:00', volume: 8200, isPeak: true, activeTrucks: 26, avgLatency: '38 phút' },
  { hour: '20:00', volume: 6400, activeTrucks: 21, avgLatency: '30 phút' },
  { hour: '22:00', volume: 3100, activeTrucks: 12, avgLatency: '22 phút' },
];

export const LogisticsThroughputChart: React.FC = () => {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Geometry
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingTop = 28;
  const paddingBottom = 32;
  const paddingLeft = 45;
  const paddingRight = 20;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxCapacity = 10000; // 10k max scale for Y-axis

  // Y-axis grid increments
  const yTicks = [
    { value: 10000, label: '10k' },
    { value: 7500, label: '7.5k' },
    { value: 5000, label: '5.0k' },
    { value: 2500, label: '2.5k' },
    { value: 0, label: '0' },
  ];

  const slotWidth = chartWidth / HOURLY_DATA.length;
  const barWidth = 22; // Sleek, elegant column width

  const activeItem = hoveredIndex !== null ? HOURLY_DATA[hoveredIndex] : null;

  return (
    <div className="rounded-[32px] ocean-surface border border-sky-100/90 p-6 sm:p-8 shadow-sm space-y-7 relative overflow-hidden ambient-glow-sky">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shadow-sky-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight font-sans">
              {language === 'vi' ? 'Băng Thông Kho Vận & Lưu Lượng Điều Phối' : 'Logistics Throughput & Dispatch Flow'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {language === 'vi'
              ? 'Tần suất luân chuyển bưu kiện theo giờ và khả năng đáp ứng tại 3 trung tâm phân phối chính'
              : 'Hourly package routing velocity and processing capacity across primary distribution centers'}
          </p>
        </div>

        {/* Live Telemetry Pills */}
        <div className="flex items-center gap-2.5 select-none self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50/60 border border-sky-200 text-xs font-mono text-sky-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Live Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-600 text-white text-xs font-mono shadow-xs shadow-sky-500/25">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold">{language === 'vi' ? 'Đỉnh tải 18h: 8.2k kiện' : 'Peak 18h: 8.2k'}</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Area */}
      <div className="space-y-3">
        {/* Status Bar / Interactive Feedback Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-h-7 text-xs font-mono">
          {activeItem ? (
            <div className="flex items-center gap-2.5 animate-in fade-in duration-150">
              <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white font-bold text-[11px]">
                {activeItem.hour}
              </span>
              <span className="text-foreground font-bold text-sm">
                {activeItem.volume.toLocaleString()} <span className="text-slate-500 text-xs font-normal font-sans">{language === 'vi' ? 'kiện/giờ' : 'parcels/h'}</span>
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-600 text-xs">
                {Math.round((activeItem.volume / maxCapacity) * 100)}% {language === 'vi' ? 'tải định mức' : 'capacity'}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <Truck className="w-3 h-3 text-slate-500" /> {activeItem.activeTrucks} {language === 'vi' ? 'xe xuất bến' : 'trucks'}
              </span>
              {activeItem.isPeak && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  {language === 'vi' ? 'Đỉnh Tải' : 'Peak Hour'}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'vi' ? 'Rê chuột trên từng cột để xem chi tiết lưu lượng và số xe điều phối' : 'Hover over bars for hourly throughput telemetry'}</span>
            </div>
          )}

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-sans select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-600" />
              <span className="font-medium text-slate-700">{language === 'vi' ? 'Giờ cao điểm' : 'Peak Hours'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-200" />
              <span>{language === 'vi' ? 'Giờ thông thường' : 'Normal Hours'}</span>
            </span>
          </div>
        </div>

        {/* Vector SVG Chart Canvas */}
        <div className="w-full bg-sky-50/20 rounded-2xl border border-slate-100 p-2 sm:p-4 overflow-hidden relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Subtle Gradient for Standard Bars */}
              <linearGradient id="normalBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>

              {/* Gradient for Peak Bars */}
              <linearGradient id="peakBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>

              {/* Active Hover Glow */}
              <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" floodColor="#0284C7" />
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Scale */}
            {yTicks.map((tick) => {
              const y = paddingTop + chartHeight - (tick.value / maxCapacity) * chartHeight;
              return (
                <g key={tick.value} className="text-zinc-400">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke={tick.value === 0 ? '#D4D4D8' : '#E4E4E7'}
                    strokeWidth={tick.value === 0 ? 1.5 : 1}
                    strokeDasharray={tick.value === 0 ? '' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-slate-500 font-mono font-medium select-none"
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* Column Bars & Capacities */}
            {HOURLY_DATA.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const hasHover = hoveredIndex !== null;
              const isOther = hasHover && !isHovered;

              const barX = paddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
              const barH = (item.volume / maxCapacity) * chartHeight;
              const barY = paddingTop + chartHeight - barH;

              // Track background
              const trackH = chartHeight;
              const trackY = paddingTop;

              return (
                <g
                  key={item.hour}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{ opacity: isOther ? 0.35 : 1 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Invisible broad hitbox for effortless mouse interaction */}
                  <rect
                    x={paddingLeft + idx * slotWidth}
                    y={paddingTop - 15}
                    width={slotWidth}
                    height={chartHeight + 40}
                    fill="transparent"
                  />

                  {/* Subtle Background Track (100% capacity guide) */}
                  <rect
                    x={barX}
                    y={trackY}
                    width={barWidth}
                    height={trackH}
                    rx="4"
                    fill="#F4F4F5"
                  />

                  {/* Volume Column Bar */}
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barH}
                    rx="4"
                    fill={item.isPeak ? 'url(#peakBarGrad)' : isHovered ? '#0284C7' : 'url(#normalBarGrad)'}
                    filter={isHovered ? 'url(#barShadow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Peak Hour Sleek Pill Tag on Top of Bar (No clumsy loops) */}
                  {item.isPeak && (
                    <g transform={`translate(${barX + barWidth / 2}, ${barY - 14})`}>
                      <rect
                        x="-14"
                        y="0"
                        width="28"
                        height="11"
                        rx="3"
                        fill="#0284C7"
                      />
                      <text
                        x="0"
                        y="8"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="text-[7.5px] font-mono font-bold tracking-widest"
                      >
                        PEAK
                      </text>
                    </g>
                  )}

                  {/* Floating Hover Indicator on Bar */}
                  {isHovered && !item.isPeak && (
                    <circle
                      cx={barX + barWidth / 2}
                      cy={barY}
                      r="2.5"
                      fill="#0284C7"
                    />
                  )}

                  {/* X-Axis Hour Label */}
                  <text
                    x={barX + barWidth / 2}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    className={`text-[10px] sm:text-[11px] font-mono select-none transition-colors ${
                      isHovered || item.isPeak
                        ? 'fill-[#0F172A] font-bold'
                        : 'fill-slate-500 font-medium'
                    }`}
                  >
                    {item.hour.slice(0, 2)}h
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3 Telemetry Hub Monitors (Polished Luxury Hardware Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Hub 1: South Hub (Q.7) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition-all shadow-xs space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {language === 'vi' ? 'Hub Nam Sài Gòn (Q.7)' : 'South Hub (District 7)'}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">DC-SOUTH-01</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {language === 'vi' ? 'Ổn định' : 'Optimal'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-black text-foreground font-mono">
              4.800 <span className="text-xs font-normal text-slate-500 font-sans">{language === 'vi' ? 'kiện/h' : 'parcels/h'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600">74% {language === 'vi' ? 'tải' : 'load'}</span>
          </div>

          {/* Precision Track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: '74%' }} />
          </div>

          <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-500 font-mono border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> {language === 'vi' ? 'Xử lý: 14p/kiện' : '14m latency'}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-slate-500" /> 16 {language === 'vi' ? 'xe bến' : 'trucks'}
            </span>
          </div>
        </div>

        {/* Hub 2: East Hub (Thu Duc) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition-all shadow-xs space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {language === 'vi' ? 'Hub Đông TP (Thủ Đức)' : 'East Hub (Thu Duc City)'}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">DC-EAST-02</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {language === 'vi' ? 'Tải cao (82%)' : 'High Load'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-black text-foreground font-mono">
              6.200 <span className="text-xs font-normal text-slate-500 font-sans">{language === 'vi' ? 'kiện/h' : 'parcels/h'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800">82% {language === 'vi' ? 'tải' : 'load'}</span>
          </div>

          {/* Precision Track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: '82%' }} />
          </div>

          <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-500 font-mono border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> {language === 'vi' ? 'Xử lý: 18p/kiện' : '18m latency'}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-slate-500" /> 24 {language === 'vi' ? 'xe bến' : 'trucks'}
            </span>
          </div>
        </div>

        {/* Hub 3: Central Hub (Q.1) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 transition-all shadow-xs space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {language === 'vi' ? 'Hub Trung Tâm (Q.1)' : 'Central Hub (District 1)'}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">DC-METRO-03</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              {language === 'vi' ? 'Nội thành' : 'Express'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-black text-foreground font-mono">
              3.100 <span className="text-xs font-normal text-slate-500 font-sans">{language === 'vi' ? 'kiện/h' : 'parcels/h'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600">61% {language === 'vi' ? 'tải' : 'load'}</span>
          </div>

          {/* Precision Track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: '61%' }} />
          </div>

          <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-500 font-mono border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> {language === 'vi' ? 'Giao TB: 38 phút' : '38m delivery'}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-slate-500" /> 10 {language === 'vi' ? 'xe bến' : 'trucks'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
