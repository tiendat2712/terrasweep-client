import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { Truck, CheckCircle2, Clock, PackageCheck, MapPin, ShieldCheck, X } from 'lucide-react';
import { OceanSelect } from '@/components/common/OceanSelect';

interface OrderTrackingViewProps {
  orders: Order[];
  onClose?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  onClose,
}) => {
  const { t } = useLanguage();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="p-8 text-center bg-white rounded-[28px] border border-zinc-200 text-zinc-500">
        {t('tracking.noOrders')}
      </div>
    );
  }

  const stages: {
    key: OrderStatus;
    label: string;
    sub: string;
    icon: React.ReactNode;
  }[] = [
    { key: 'pending', label: t('tracking.stagePlaced'), sub: t('tracking.stagePlacedSub'), icon: <Clock className="w-4 h-4" /> },
    { key: 'confirmed', label: t('tracking.stageConfirmed'), sub: t('tracking.stageConfirmedSub'), icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'picking', label: t('tracking.stagePicking'), sub: t('tracking.stagePickingSub'), icon: <PackageCheck className="w-4 h-4" /> },
    { key: 'shipping', label: t('tracking.stageShipping'), sub: t('tracking.stageShippingSub'), icon: <Truck className="w-4 h-4" /> },
    { key: 'delivered', label: t('tracking.stageDelivered'), sub: t('tracking.stageDeliveredSub'), icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'picking', 'shipping', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(currentOrder.status);

  return (
    <div className="rounded-[32px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 shadow-sm p-6 md:p-10 my-8 relative overflow-hidden ambient-glow-sky">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {t('tracking.title')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mt-1">
            {t('tracking.orderNumber', { id: currentOrder.id })}
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            {t('tracking.placedAt', { time: currentOrder.createdAt, method: currentOrder.paymentMethod })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <OceanSelect
            value={currentOrder.id}
            onChange={(val) => setSelectedOrderId(val)}
            options={orders.map((o) => ({
              value: o.id,
              label: `Order #${o.id}`,
              badge: o.status.toUpperCase(),
            }))}
            variant="pill"
            align="right"
            className="font-mono"
          />

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="my-10">
        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
          {/* Progress Bar Track */}
          <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-sky-600 transition-all duration-500 shadow-xs shadow-sky-500/30"
              style={{
                width: `${Math.min(100, Math.max(0, (currentStepIndex / 4) * 100))}%`,
              }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={stage.key} className="flex md:flex-col items-center md:text-center gap-3.5 flex-1 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 ring-4 ring-sky-100 scale-105'
                      : isCompleted
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {stage.icon}
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold leading-tight ${
                      isCurrent || isCompleted ? 'text-[#0F172A]' : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stage.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left: Events */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-zinc-50 border border-zinc-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            {t('tracking.historyTitle')}
          </h3>

          <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
            {currentOrder.trackingEvents.map((event, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    event.completed ? 'bg-sky-600 shadow-xs shadow-sky-500/25' : 'bg-slate-300'
                  }`}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${event.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                    {event.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{event.location}</p>
                <p className="text-[11px] text-slate-400 italic mt-0.5">{event.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-4">
          {/* Driver Card */}
          <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{t('tracking.driverCardTitle')}</span>
                <h4 className="text-xs font-bold text-slate-900">
                  {currentOrder.shipperName || t('tracking.driverNamePlaceholder')}
                </h4>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 space-y-1.5 pt-3 border-t border-slate-200">
              <div><strong>{t('tracking.recipient')}</strong> {currentOrder.customerName} ({currentOrder.customerPhone})</div>
              <div><strong>{t('tracking.destination')}</strong> {currentOrder.shippingAddress}</div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">{t('tracking.packageSummary')}</h4>
            <div className="space-y-2">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate pr-2 text-slate-600">{item.quantity}x {item.product.name}</span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between text-xs font-bold">
              <span>{t('tracking.totalAmount')}</span>
              <span className="text-sm font-mono font-black text-sky-600">
                {currentOrder.total.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
