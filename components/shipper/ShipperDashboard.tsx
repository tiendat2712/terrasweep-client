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
  AlertCircle,
  Loader2,
  Camera,
  Image as ImageIcon,
  MapPin,
  X,
  AlertTriangle,
  PhoneCall,
  FileCheck,
} from 'lucide-react';

interface ShipperDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    extraOrNote?: { podPhoto?: string; podTimestamp?: string; failReason?: string; rescheduledDate?: string } | string
  ) => void;
}

const POD_PHOTO_PRESETS = [
  {
    id: 'p1',
    label: 'Khách hàng nhận & kiểm tra hộp',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p2',
    label: 'Kiện hàng trước cửa nhà / Lễ tân',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p3',
    label: 'Ký nhận biên bản giao hàng',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
  },
];

const EXCEPTION_REASONS = [
  'Không liên lạc được người nhận (Gọi 3 lần thuê bao / không nghe)',
  'Khách hàng chủ động hẹn lại ca giao sau',
  'Địa chỉ nhận hàng chưa rõ ràng / Khu vực phong tỏa công trình',
  'Khách kiểm tra kiện hàng nhưng không đồng ý nhận (Từ chối nhận)',
  'Khách chưa chuẩn bị đủ tiền mặt thanh toán COD',
];

const RESCHEDULE_SHIFTS = [
  'Ca sáng mai (08:00 - 12:00)',
  'Ca chiều mai (14:00 - 18:00)',
  'Ca tối mai (18:30 - 21:00)',
  'Ca ngày mốt (08:00 - 17:00)',
];

export const ShipperDashboard: React.FC<ShipperDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const { t, language } = useLanguage();
  const [selectedOrderForScan, setSelectedOrderForScan] = useState<Order | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // PoD Modal State
  const [podModalOrder, setPodModalOrder] = useState<Order | null>(null);
  const [selectedPodPhoto, setSelectedPodPhoto] = useState<string>(POD_PHOTO_PRESETS[0].url);
  const [recipientSignature, setRecipientSignature] = useState('');
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  // Delivery Exception Modal State
  const [exceptionModalOrder, setExceptionModalOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState(EXCEPTION_REASONS[0]);
  const [selectedShift, setSelectedShift] = useState(RESCHEDULE_SHIFTS[0]);
  const [customExceptionNote, setCustomExceptionNote] = useState('');
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  // View Existing PoD Modal State
  const [viewingPodOrder, setViewingPodOrder] = useState<Order | null>(null);

  const activeDeliveries = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'picking' || o.status === 'shipping' || o.status === 'failed'
  );
  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  const handleUpdateStatusAsync = (
    orderId: string,
    newStatus: OrderStatus,
    extraOrNote?: { podPhoto?: string; podTimestamp?: string; failReason?: string; rescheduledDate?: string } | string
  ) => {
    if (updatingOrderId) return;
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      onUpdateOrderStatus(orderId, newStatus, extraOrNote);
      setUpdatingOrderId(null);
    }, 600);
  };

  const handleConfirmPod = () => {
    if (!podModalOrder) return;
    setIsSubmittingPod(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString('vi-VN');
      onUpdateOrderStatus(podModalOrder.id, 'delivered', {
        podPhoto: selectedPodPhoto,
        podTimestamp: `${now} (Ký nhận: ${recipientSignature || podModalOrder.customerName})`,
      });
      setIsSubmittingPod(false);
      setPodModalOrder(null);
      setRecipientSignature('');
    }, 700);
  };

  const handleConfirmException = () => {
    if (!exceptionModalOrder) return;
    setIsSubmittingException(true);
    setTimeout(() => {
      const fullReason = customExceptionNote
        ? `${selectedReason} - Ghi chú: ${customExceptionNote}`
        : selectedReason;
      onUpdateOrderStatus(exceptionModalOrder.id, 'failed', {
        failReason: fullReason,
        rescheduledDate: selectedShift,
      });
      setIsSubmittingException(false);
      setExceptionModalOrder(null);
      setCustomExceptionNote('');
    }, 700);
  };

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 bg-gradient-to-b from-white via-sky-50/25 to-white/95 rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0F172A]">{t('shipper.title')}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                {t('shipper.badge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              {t('shipper.carrierMeta')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-sky-50/60 border border-sky-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-sky-950 font-sans">
            {t('shipper.statusOnline')}
          </span>
        </div>
      </div>

      {/* Courier Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiDeliveriesToday')}</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            {activeDeliveries.length} Kiện
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('shipper.kpiDeliveriesSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiCodPending')}</span>
            <QrCode className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            464.000₫
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('shipper.kpiCodSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('shipper.kpiDeliveredToday')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans tracking-tight tabular-nums">
            {completedDeliveries.length} Đơn
          </div>
          <span className="text-xs text-emerald-700 font-sans mt-1.5 block">
            {t('shipper.kpiDeliveredSub')}
          </span>
        </DoubleBezelCard>
      </div>

      {/* Active Deliveries Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-600" />
            {t('shipper.routesTitle', { count: activeDeliveries.length })}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {t('shipper.routesMeta')}
          </span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="p-16 text-center bg-gradient-to-b from-white via-sky-50/20 to-white/95 rounded-[32px] border border-sky-100/90 text-slate-500 shadow-sm relative overflow-hidden ambient-glow-sky">
            <CheckCircle2 className="w-12 h-12 text-sky-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-900">{t('shipper.allCompletedTitle')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('shipper.allCompletedSubtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDeliveries.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 shadow-sm hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all space-y-5 relative overflow-hidden ambient-glow-sky"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-600">#{order.id}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{order.createdAt}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      order.status === 'shipping'
                        ? 'bg-sky-600 text-white border-sky-600 animate-pulse shadow-xs shadow-sky-500/25'
                        : order.status === 'failed'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}
                  >
                    {order.status === 'shipping'
                      ? t('shipper.statusOnDelivery')
                      : order.status === 'failed'
                      ? (language === 'vi' ? 'Giao thất bại • Hẹn lại' : 'Failed • Rescheduled')
                      : t('shipper.statusWaitingPickup')}
                  </span>
                </div>

                {/* Delivery Exception Alert if order failed previously */}
                {order.status === 'failed' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{order.rescheduledDate || (language === 'vi' ? 'Hẹn ca kế tiếp' : 'Rescheduled next shift')}</span>
                    </div>
                    <p className="text-[11px] text-amber-800 pl-6">
                      <span className="font-semibold">{language === 'vi' ? 'Lý do:' : 'Reason:'}</span> {order.failReason || (language === 'vi' ? 'Khách hẹn lại ca sau' : 'Customer requested reschedule')}
                    </p>
                  </div>
                )}

                {/* Waypoints */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 font-sans font-bold text-xs">
                      1
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('shipper.pickupPoint')}</span>
                      <p className="font-semibold text-slate-800">{t('shipper.pickupLocation')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full btn-ocean-primary text-white flex items-center justify-center shrink-0 font-sans font-bold text-xs shadow-xs shadow-sky-500/20">
                      2
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('shipper.deliveryPoint')}</span>
                      <p className="font-bold text-slate-900">{order.shippingAddress}</p>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        Khách: {order.customerName} • {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COD & PoD Status Badge */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">{t('shipper.codAmount')}</span>
                    <strong className="text-slate-900 font-sans font-extrabold text-base tracking-tight tabular-nums">
                      {order.total.toLocaleString('vi-VN')}₫
                    </strong>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-slate-400 text-[10px] block">{t('shipper.paymentType')}</span>
                    <span className="font-sans text-slate-800 font-bold">{order.paymentMethod}</span>
                    {order.podPhoto && (
                      <button
                        onClick={() => setViewingPodOrder(order)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 cursor-pointer"
                      >
                        <FileCheck className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Đã có PoD' : 'PoD Verified'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleStartScan(order)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{t('shipper.btnScanLaser')}</span>
                  </button>

                  {order.status === 'shipping' ? (
                    <button
                      onClick={() => {
                        setPodModalOrder(order);
                        setRecipientSignature(order.customerName);
                      }}
                      className="btn-ocean-primary flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{language === 'vi' ? 'Giao xong (PoD)' : 'Confirm PoD'}</span>
                    </button>
                  ) : order.status === 'failed' ? (
                    <button
                      onClick={() => handleUpdateStatusAsync(order.id, 'shipping', 'Bắt đầu tuyến giao lại cho khách')}
                      disabled={updatingOrderId === order.id}
                      aria-busy={updatingOrderId === order.id}
                      className="btn-ocean-primary flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs cursor-pointer disabled:opacity-60"
                    >
                      {updatingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{language === 'vi' ? 'Đang cập nhật...' : 'Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          <span>{language === 'vi' ? 'Giao lại ngay' : 'Retry Delivery'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatusAsync(order.id, 'shipping', 'Đã lấy kiện và bắt đầu tuyến giao')}
                      disabled={updatingOrderId === order.id}
                      aria-busy={updatingOrderId === order.id}
                      className="btn-ocean-primary flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updatingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{language === 'vi' ? 'Đang cập nhật...' : 'Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          <span>{t('shipper.btnStartDelivery')}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {order.status === 'shipping' && (
                  <div className="text-center pt-1">
                    <button
                      onClick={() => setExceptionModalOrder(order)}
                      className="text-[11px] text-slate-400 hover:text-red-600 flex items-center justify-center gap-1 mx-auto cursor-pointer transition-colors"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Báo sự cố giao hàng / Hẹn lại ca sau' : 'Report delivery issue / Reschedule'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Laser QR Scanner Modal */}
      {selectedOrderForScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-sm rounded-[28px] bg-white border border-slate-200 p-8 shadow-2xl text-center space-y-5">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center justify-center gap-2">
              <Scan className="w-5 h-5 animate-spin text-sky-600" />
              {t('shipper.modalScanTitle')}
            </h3>
            <p className="text-xs text-slate-400 font-mono">{t('shipper.modalScanMeta', { id: selectedOrderForScan.id })}</p>

            <div className="relative w-48 h-48 mx-auto rounded-2xl bg-slate-900 border-2 border-dashed border-sky-500/40 flex items-center justify-center overflow-hidden">
              <QrCode className="w-32 h-32 text-sky-400/20" />
              {isScanning && <div className="animate-laser" />}
              {scanSuccess && (
                <div className="absolute inset-0 bg-sky-950/95 flex flex-col items-center justify-center text-white animate-in zoom-in">
                  <CheckCircle2 className="w-12 h-12 text-sky-400 animate-bounce" />
                  <span className="text-xs font-bold font-mono mt-2">{t('shipper.modalScanSuccess')}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500">
              {isScanning
                ? t('shipper.modalScanning')
                : scanSuccess
                ? t('shipper.modalScanSuccess')
                : t('shipper.modalScanReady')}
            </p>

            <button
              onClick={() => setSelectedOrderForScan(null)}
              className="px-6 py-2 rounded-full bg-slate-100 text-xs text-slate-800 font-bold hover:bg-slate-200 cursor-pointer"
            >
              {t('shipper.btnCloseModal')}
            </button>
          </div>
        </div>
      )}

      {/* Proof of Delivery (PoD) Modal */}
      {podModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {language === 'vi' ? 'Bằng chứng Giao hàng (PoD)' : 'Proof of Delivery (PoD)'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Đơn #{podModalOrder.id} • {podModalOrder.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setPodModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Geotag Stamp */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-mono">GPS: 10.7769° N, 106.7009° E (Quận 1, TP. Hồ Chí Minh)</p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  Khớp tọa độ địa chỉ giao: {podModalOrder.shippingAddress}
                </p>
              </div>
            </div>

            {/* Photo Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{language === 'vi' ? 'Chọn ảnh bằng chứng đã giao:' : 'Select delivery photo proof:'}</span>
                <span className="text-[10px] text-slate-400">PoD Live Camera</span>
              </label>

              <div className="grid grid-cols-3 gap-3">
                {POD_PHOTO_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setSelectedPodPhoto(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 text-left group cursor-pointer ${
                      selectedPodPhoto === preset.url
                        ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <div className="p-1.5">
                      <p className="text-[10px] font-semibold text-slate-700 line-clamp-1">{preset.label}</p>
                    </div>
                    {selectedPodPhoto === preset.url && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Signature / Verification Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'vi' ? 'Tên người ký / nhận bưu phẩm:' : 'Recipient sign-off name:'}</span>
              </label>
              <input
                type="text"
                value={recipientSignature}
                onChange={(e) => setRecipientSignature(e.target.value)}
                placeholder={podModalOrder.customerName}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-400">
                {language === 'vi' ? 'Hệ thống tự động đóng dấu thời gian và tọa độ lên biên bản PoD.' : 'System will watermark GPS coordinates and timestamp to PoD slip.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPodModalOrder(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmPod}
                disabled={isSubmittingPod}
                className="btn-ocean-primary px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmittingPod ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'vi' ? 'Đang lưu PoD...' : 'Saving PoD...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'vi' ? 'Xác nhận giao & Lưu PoD' : 'Confirm & Save PoD'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Exception Modal */}
      {exceptionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {language === 'vi' ? 'Báo cáo Sự cố Giao hàng' : 'Delivery Exception Report'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Đơn #{exceptionModalOrder.id} • {exceptionModalOrder.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setExceptionModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Failure Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                {language === 'vi' ? 'Lý do giao không thành công:' : 'Reason for failed delivery:'}
              </label>
              <div className="space-y-2">
                {EXCEPTION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-red-500 bg-red-50/40 text-slate-900 font-semibold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exceptionReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="mt-0.5 text-red-600 focus:ring-red-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reschedule Shift */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'vi' ? 'Hẹn giao lại vào ca:' : 'Reschedule delivery shift:'}</span>
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
              >
                {RESCHEDULE_SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'vi' ? 'Ghi chú thêm từ Shipper (nếu có):' : 'Additional note from courier:'}
              </label>
              <input
                type="text"
                value={customExceptionNote}
                onChange={(e) => setCustomExceptionNote(e.target.value)}
                placeholder={language === 'vi' ? 'Ví dụ: Khách bảo đang đi công tác, giao lại sáng mai' : 'e.g., Customer is out of town until tomorrow'}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExceptionModalOrder(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmException}
                disabled={isSubmittingException}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2 shadow-xs"
              >
                {isSubmittingException ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{language === 'vi' ? 'Đang cập nhật...' : 'Updating...'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{language === 'vi' ? 'Lưu sự cố & Đổi lịch' : 'Save Exception & Reschedule'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View PoD Image Modal */}
      {viewingPodOrder && viewingPodOrder.podPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'vi' ? 'Ảnh Bằng Chứng Giao Hàng' : 'Proof of Delivery Photo'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">#{viewingPodOrder.id} • {viewingPodOrder.customerName}</p>
              </div>
              <button
                onClick={() => setViewingPodOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
              <img
                src={viewingPodOrder.podPhoto}
                alt="PoD Proof"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] p-2 rounded-xl text-left font-mono">
                <p>GPS: 10.7769° N, 106.7009° E (Q.1, TP.HCM)</p>
                <p className="text-slate-300 mt-0.5">Xác nhận: {viewingPodOrder.podTimestamp || 'Đã ký nhận'}</p>
              </div>
            </div>

            <button
              onClick={() => setViewingPodOrder(null)}
              className="w-full py-2 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              {language === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
