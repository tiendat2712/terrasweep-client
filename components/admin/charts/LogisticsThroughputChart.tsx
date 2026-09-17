'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { BarChart3, Globe, Zap, Clock } from 'lucide-react';

interface HourlyThroughput {
  hour: string;
  volume: number; // parcels
  isPeak?: boolean;
}

const HOURLY_DATA: HourlyThroughput[] = [
  { hour: '06:00', volume: 1800 },
  { hour: '08:00', volume: 4200 },
  { hour: '10:00', volume: 5800 },
  { hour: '11:00', volume: 7400, isPeak: true },
  { hour: '12:00', volume: 6100 },
  { hour: '14:00', volume: 5200 },
  { hour: '16:00', volume: 6800 },
  { hour: '18:00', volume: 8200, isPeak: true },
  { hour: '20:00', volume: 6400 },
  { hour: '22:00', volume: 3100 },
];

export const LogisticsThroughputChart: React.FC = () => {
  const { language } = useLanguage();
  const [hoveredHour, setHoveredHour] = useState<HourlyThroughput | null>(null);

  const maxVolume = Math.max(...HOURLY_DATA.map((d) => d.volume));

  return (
    <div className="rounded-[28px] bg-white border border-zinc-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-[#0C0C0C] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#0C0C0C] tracking-tight font-sans">
              {language === 'vi' ? 'Băng Thông Kho Vận Theo Giờ' : 'Hourly Logistics Throughput'}
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-sans">
            {language === 'vi'
              ? 'Tần suất luân chuyển bưu kiện trong ngày qua 3 Hub trung chuyển chính'
              : 'Hourly package routing velocity across primary distribution centers'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-700 select-none self-start sm:self-auto">
          <Zap className="w-3.5 h-3.5 text-[#0C0C0C]" />
          <span>{language === 'vi' ? 'Đỉnh tải: 18:00 (8.2k kiện/h)' : 'Peak Hour: 18:00 (8.2k/h)'}</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="space-y-3">
        {/* Tooltip Info Banner */}
        <div className="h-6 flex items-center justify-between text-xs font-mono">
          {hoveredHour ? (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              <span className="font-bold text-[#0C0C0C]">Khung giờ {hoveredHour.hour}:</span>
              <span className="text-zinc-600 font-bold">{hoveredHour.volume.toLocaleString()} kiện/giờ</span>
              {hoveredHour.isPeak && (
                <span className="px-2 py-0.5 rounded-full bg-[#0C0C0C] text-white text-[9.5px] font-bold uppercase">
                  PEAK HOUR
                </span>
              )}
            </div>
          ) : (
            <span className="text-zinc-400 text-[11px]">
              {language === 'vi' ? 'Di chuột lên cột để xem chi tiết lưu lượng' : 'Hover over bars for hourly telemetry'}
            </span>
          )}

          <div className="flex items-center gap-3 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0C0C0C]" />
              {language === 'vi' ? 'Giờ cao điểm' : 'Peak Hours'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-zinc-300" />
              {language === 'vi' ? 'Tiêu chuẩn' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Bar Chart Grid */}
        <div className="h-44 sm:h-52 flex items-end gap-2 sm:gap-4 pt-4 border-b border-zinc-200/80">
          {HOURLY_DATA.map((item) => {
            const heightPercent = Math.round((item.volume / maxVolume) * 100);
            const isHovered = hoveredHour?.hour === item.hour;

            return (
              <div
                key={item.hour}
                onMouseEnter={() => setHoveredHour(item)}
                onMouseLeave={() => setHoveredHour(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                {/* Bar Column with Smooth Animation */}
                <div className="w-full max-w-[38px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 relative ${
                      item.isPeak
                        ? isHovered
                          ? 'bg-zinc-800 scale-105 shadow-md'
                          : 'bg-[#0C0C0C]'
                        : isHovered
                        ? 'bg-zinc-500 scale-105 shadow-sm'
                        : 'bg-zinc-200 group-hover:bg-zinc-400'
                    }`}
                  >
                    {/* Top indicator dot on peak */}
                    {item.isPeak && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white ring-1 ring-black" />
                    )}
                  </div>
                </div>

                {/* X Axis Label */}
                <span className={`text-[10px] sm:text-[11px] font-mono mt-2 transition-colors select-none ${
                  isHovered || item.isPeak ? 'font-bold text-[#0C0C0C]' : 'text-zinc-400'
                }`}>
                  {item.hour.slice(0, 2)}h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Hub Capacities Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-zinc-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0C0C0C] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-500" /> {language === 'vi' ? 'Hub Nam Sài Gòn (Q.7)' : 'South Hub (D7)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-600">74%</span>
          </div>
          <div className="w-full bg-zinc-200/70 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#0C0C0C] h-full rounded-full" style={{ width: '74%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>4.800 kiện/h</span>
            <span>Ổn định</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-zinc-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0C0C0C] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-500" /> {language === 'vi' ? 'Hub Đông TP (Thủ Đức)' : 'East Hub (Thu Duc)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-600">82%</span>
          </div>
          <div className="w-full bg-zinc-200/70 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#0C0C0C] h-full rounded-full" style={{ width: '82%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>6.200 kiện/h</span>
            <span>Tải cao</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-zinc-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0C0C0C] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-500" /> {language === 'vi' ? 'Hub Trung Tâm (Q.1)' : 'Central Hub (D1)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-600">61%</span>
          </div>
          <div className="w-full bg-zinc-200/70 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#0C0C0C] h-full rounded-full" style={{ width: '61%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
            <span>Giao trung bình: 38p</span>
            <span>Tối ưu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
