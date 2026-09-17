import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Truck,
  QrCode,
  CheckCircle2,
  Clock,
  Scan,
  Navigation,
  AlertCircle
} from 'lucide-react';

interface ShipperDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    locationNote?: string
  ) => void;
}

export const ShipperDashboard: React.FC<ShipperDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const { t } = useLanguage();
  const [selectedOrderForScan, setSelectedOrderForScan] = useState<Order | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const activeDeliveries = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'picking' || o.status === 'shipping'
  );
  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  const handleStartScan = (order: Order) => {
    setSelectedOrderForScan(order);
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        if (order.status === 'confirmed' || order.status === 'picking') {
          onUpdateOrderStatus(order.id, 'shipping', 'Đã quét QR nhận hàng tại kho Bưu cục');
        } else if (order.status === 'shipping') {
          onUpdateOrderStatus(order.id, 'delivered', 'Đã giao thành công tận tay khách hàng');
        }
        setSelectedOrderForScan(null);
        setScanSuccess(false);
      }, 1000);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Top Banner: Courier Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 bg-white rounded-[28px] border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0C0C0C] flex items-center justify-center text-white">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0C0C0C]">{t('shipper.title')}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-900 border border-zinc-200">
                {t('shipper.badge')}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {t('shipper.carrierMeta')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-800">
            {t('shipper.statusOnline')}
          </span>
        </div>
      </div>

      {/* Courier Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <DoubleBezelCard>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiDeliveriesToday')}</span>
            <Clock className="w-4 h-4 text-[#0C0C0C]" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#0C0C0C] font-mono">
            {activeDeliveries.length} Kiện
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-1.5 block">
            {t('shipper.kpiDeliveriesSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiCodPending')}</span>
            <QrCode className="w-4 h-4 text-[#0C0C0C]" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#0C0C0C] font-mono">
            464.000₫
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-1.5 block">
            {t('shipper.kpiCodSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiDeliveredToday')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-700 font-mono">
            {completedDeliveries.length} Đơn
          </div>
          <span className="text-[11px] text-emerald-700 font-mono mt-1.5 block">
            {t('shipper.kpiDeliveredSub')}
          </span>
        </DoubleBezelCard>
      </div>

      {/* Active Deliveries Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#0C0C0C]" />
            {t('shipper.routesTitle', { count: activeDeliveries.length })}
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            {t('shipper.routesMeta')}
          </span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-[28px] border border-zinc-200 text-zinc-500 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-[#0C0C0C] mx-auto mb-3" />
            <p className="text-base font-bold text-zinc-900">{t('shipper.allCompletedTitle')}</p>
            <p className="text-xs text-zinc-400 mt-1">{t('shipper.allCompletedSubtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-[28px] bg-white border border-zinc-200 shadow-xs hover:border-black hover:shadow-md transition-all space-y-5"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#0C0C0C]">#{order.id}</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">{order.createdAt}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      order.status === 'shipping'
                        ? 'bg-[#0C0C0C] text-white border-black animate-pulse'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    {order.status === 'shipping' ? t('shipper.statusOnDelivery') : t('shipper.statusWaitingPickup')}
                  </span>
                </div>

                {/* Waypoints */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 font-mono font-bold text-[11px]">
                      1
                    </span>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">{t('shipper.pickupPoint')}</span>
                      <p className="font-semibold text-zinc-800">{t('shipper.pickupLocation')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0C0C0C] text-white flex items-center justify-center shrink-0 font-mono font-bold text-[11px]">
                      2
                    </span>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">{t('shipper.deliveryPoint')}</span>
                      <p className="font-bold text-zinc-900">{order.shippingAddress}</p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Khách: {order.customerName} • {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COD & Method */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 text-[10px] block">{t('shipper.codAmount')}</span>
                    <strong className="text-[#0C0C0C] font-mono text-sm">
                      {order.total.toLocaleString('vi-VN')}₫
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 text-[10px] block">{t('shipper.paymentType')}</span>
                    <span className="font-mono text-zinc-800 font-bold">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleStartScan(order)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{t('shipper.btnScanLaser')}</span>
                  </button>

                  {order.status === 'shipping' ? (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'delivered', 'Đã giao thành công tận tay')}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0C0C0C] hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('shipper.btnConfirmDelivered')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'shipping', 'Đã lấy kiện và bắt đầu tuyến giao')}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0C0C0C] hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Truck className="w-4 h-4" />
                      <span>{t('shipper.btnStartDelivery')}</span>
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'failed', 'Khách hẹn lại ca sau')}
                    className="text-[11px] text-zinc-400 hover:text-red-600 flex items-center justify-center gap-1 mx-auto"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {t('shipper.reportFailed')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Laser QR Scanner Modal */}
      {selectedOrderForScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[28px] bg-white border border-zinc-200 p-8 shadow-2xl text-center space-y-5">
            <h3 className="text-base font-bold text-[#0C0C0C] flex items-center justify-center gap-2">
              <Scan className="w-5 h-5 animate-spin" />
              {t('shipper.modalScanTitle')}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">{t('shipper.modalScanMeta', { id: selectedOrderForScan.id })}</p>

            <div className="relative w-48 h-48 mx-auto rounded-2xl bg-[#0C0C0C] border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden">
              <QrCode className="w-32 h-32 text-white/30" />
              {isScanning && <div className="animate-laser" />}
              {scanSuccess && (
                <div className="absolute inset-0 bg-[#0C0C0C]/90 flex flex-col items-center justify-center text-white animate-in zoom-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                  <span className="text-xs font-bold font-mono mt-2">{t('shipper.modalScanSuccess')}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-500">
              {isScanning
                ? t('shipper.modalScanning')
                : scanSuccess
                ? t('shipper.modalScanSuccess')
                : t('shipper.modalScanReady')}
            </p>

            <button
              onClick={() => setSelectedOrderForScan(null)}
              className="px-6 py-2 rounded-full bg-zinc-100 text-xs text-zinc-800 font-bold hover:bg-zinc-200"
            >
              {t('shipper.btnCloseModal')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
