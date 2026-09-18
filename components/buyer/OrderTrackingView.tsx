import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { OceanSelect } from '../common/OceanSelect';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  MapPin,
  ShieldCheck,
  X,
  RotateCcw,
  MessageSquare,
  Phone,
  Camera,
  Wallet,
  Building,
  Building2,
  Copy,
  Check,
  Send,
  Sparkles,
  Navigation,
  Eye,
  FileCheck,
  AlertCircle,
  Bike,
  ArrowLeft,
} from 'lucide-react';

interface OrderTrackingViewProps {
  orders: Order[];
  onClose?: () => void;
  initialOrderId?: string;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  onClose,
  initialOrderId,
}) => {
  const { language, t } = useLanguage();
  const { openSellerChat, requestReturnRefund, triggerToast } = useCart();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || orders[0]?.id || ''
  );

  useEffect(() => {
    if (initialOrderId) {
      setSelectedOrderId(initialOrderId);
    }
  }, [initialOrderId]);

  // Quick Tracking Code Copy state
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Live Courier Instructions state
  const [courierNoteInput, setCourierNoteInput] = useState('');
  const [activeCourierNote, setActiveCourierNote] = useState<string | null>(null);

  // Proof of Delivery zoom modal
  const [isPodZoomOpen, setIsPodZoomOpen] = useState(false);

  // Return & Refund Modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Sản phẩm bị lỗi kỹ thuật / không hoạt động');
  const [returnNote, setReturnNote] = useState('');
  const [returnMethod, setReturnMethod] = useState<'wallet' | 'bank'>('wallet');

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="p-8 text-center bg-white rounded-[28px] border border-zinc-200 text-zinc-500">
        {t('tracking.noOrders')}
      </div>
    );
  }

  const isOrderReturned = currentOrder.status === 'returned';
  const isOrderDelivered = currentOrder.status === 'delivered';

  // Standard Order Stages
  const standardStages: {
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

  // Dedicated Return & Refund Stages
  const returnStages = [
    { key: 'request_sent', label: language === 'vi' ? 'Yêu Cầu Đã Gửi' : 'Request Sent', sub: language === 'vi' ? 'Đã tiếp nhận vào hệ thống' : 'Logged into system', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'seller_review', label: language === 'vi' ? 'Shop Phê Duyệt' : 'Seller Approved', sub: language === 'vi' ? 'Chấp thuận thu hồi hàng' : 'Return pickup approved', icon: <Clock className="w-4 h-4" /> },
    { key: 'carrier_pickup', label: language === 'vi' ? 'Shipper Thu Hồi' : 'Carrier Pickup', sub: language === 'vi' ? 'Lấy bưu phẩm tại nhà' : 'Doorstep parcel pickup', icon: <Truck className="w-4 h-4" /> },
    { key: 'refund_done', label: language === 'vi' ? 'Hoàn Tiền Hoàn Tất' : 'Refund Processed', sub: language === 'vi' ? 'Tiền chuyển về ví/ngân hàng' : 'Credited to account', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'picking', 'shipping', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(currentOrder.status);

  // Handle submit return request
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReasonText = `${returnReason}${returnNote.trim() ? ` - Chi tiết: ${returnNote.trim()}` : ''} (Hoàn về: ${returnMethod === 'wallet' ? 'Ví TerraPay' : 'Tài khoản ngân hàng'})`;
    const photo = currentOrder.items[0]?.product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';

    requestReturnRefund(currentOrder.id, finalReasonText, currentOrder.total, photo);
    setIsReturnModalOpen(false);
  };

  const trackingNumber = `TRK-${currentOrder.id.toUpperCase()}-VN`;

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    triggerToast(
      language === 'vi' ? `Đã sao chép mã vận đơn: ${trackingNumber}` : `Tracking code copied: ${trackingNumber}`,
      'success'
    );
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleSendCourierNote = (noteText: string) => {
    if (!noteText.trim()) return;
    setActiveCourierNote(noteText.trim());
    setCourierNoteInput('');
    triggerToast(
      language === 'vi'
        ? `Đã gửi chỉ dẫn: "${noteText.trim()}" đến bưu tá!`
        : `Instructions dispatched to courier!`,
      'success'
    );
  };

  return (
    <div className="rounded-[32px] ocean-surface border border-sky-100/90 shadow-sm p-6 md:p-10 my-4 relative overflow-hidden ambient-glow-sky">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOrderReturned ? 'bg-amber-500 animate-pulse' : 'bg-sky-600'}`} />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {isOrderReturned
                ? (language === 'vi' ? 'TIẾN TRÌNH TRẢ HÀNG & HOÀN TIỀN' : 'RETURN & REFUND PROGRESS')
                : t('tracking.title')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground mt-1">
            {t('tracking.orderNumber', { id: currentOrder.id })}
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            {t('tracking.placedAt', { time: currentOrder.createdAt, method: currentOrder.paymentMethod })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <OceanSelect
            value={currentOrder.id}
            onChange={(val) => {
              setSelectedOrderId(val);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('orderId', val);
                window.history.pushState({}, '', url.toString());
              }
            }}
            options={orders.map((o) => ({
              value: o.id,
              label: `Order #${o.id}`,
              badge: o.status === 'returned' ? (language === 'vi' ? 'HOÀN TRẢ' : 'RETURN') : o.status.toUpperCase(),
            }))}
            variant="pill"
            align="right"
            className="font-mono"
          />

          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Quay lại danh sách' : 'Back to Orders'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="my-10">
        {isOrderReturned ? (
          /* RETURN & REFUND 4-STAGE TIMELINE */
          <div>
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'vi' ? 'Đang trong quá trình hoàn trả bưu phẩm' : 'Return & Refund underway'}</span>
            </div>
            <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
              <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0">
                <div className="h-full bg-amber-500 transition-all duration-500 shadow-xs shadow-amber-500/30" style={{ width: '40%' }} />
              </div>

              {returnStages.map((stage, idx) => {
                const isCompleted = idx === 0;
                const isCurrent = idx === 1;

                return (
                  <div key={stage.key} className="flex md:flex-col items-center md:text-center gap-3.5 flex-1 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-4 ring-amber-100 scale-105'
                          : isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}
                    >
                      {stage.icon}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {stage.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{stage.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STANDARD SHIPMENT TIMELINE */
          <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
            <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -z-0">
              <div
                className="h-full bg-sky-600 transition-all duration-500 shadow-xs shadow-sky-500/30"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStepIndex / 4) * 100))}%`,
                }}
              />
            </div>

            {standardStages.map((stage, idx) => {
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
                        isCurrent || isCompleted ? 'text-foreground' : 'text-slate-400'
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
        )}
      </div>

      {/* Visual Live Ship Route & Delivery Hub Progress (Only for standard shipments) */}
      {!isOrderReturned && (
        <div className="mb-8 rounded-3xl bg-white/90 border border-sky-200/80 p-5 sm:p-6 shadow-sm shadow-sky-500/5 relative overflow-hidden">
          {/* Top Info Bar: Carrier, Tracking Code, Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100/80">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200/70 text-xs font-semibold text-sky-900">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>TerraSweep Express 2H Hỏa Tốc</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                <span className="text-slate-400 font-sans">{language === 'vi' ? 'Mã vận đơn:' : 'Tracking:'}</span>
                <span className="font-bold">{trackingNumber}</span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="text-slate-400 hover:text-sky-600 transition-colors ml-0.5 cursor-pointer"
                  title="Copy Tracking Number"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span className="font-semibold text-slate-800">
                {isOrderDelivered
                  ? (language === 'vi' ? 'Đã phát thành công tận tay người nhận' : 'Successfully delivered to recipient')
                  : currentOrder.status === 'shipping'
                  ? (language === 'vi' ? 'Dự kiến đến trước 18:00 hôm nay' : 'Estimated arrival today before 18:00')
                  : (language === 'vi' ? 'Dự kiến giao hàng trong 24h - 48h' : 'Estimated delivery within 24h - 48h')}
              </span>
            </div>
          </div>

          {/* Graphical Multi-Node Route Visualization */}
          <div className="py-6 px-1 sm:px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-gradient-to-r from-sky-300 via-sky-500 to-emerald-400 -z-0 rounded-full" />

              {/* Node 1: Warehouse */}
              <div className="flex md:flex-col items-center md:text-center gap-3 relative z-10 bg-white/70 md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-4 ring-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {language === 'vi' ? 'Điểm Xuất Phát' : 'Origin'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">Kho Flagship TerraSweep</h4>
                  <p className="text-[11px] text-slate-500">KCN Tân Bình, TP.HCM</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ {language === 'vi' ? 'Đã xuất kho' : 'Dispatched'}
                  </span>
                </div>
              </div>

              {/* Node 2: Sorting Hub */}
              <div className="flex md:flex-col items-center md:text-center gap-3 relative z-10 bg-white/70 md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-4 ring-white">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {language === 'vi' ? 'Trạm Trung Chuyển' : 'Sorting Hub'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">Hub Phân Phối Bưu Cục Q1</h4>
                  <p className="text-[11px] text-slate-500">{language === 'vi' ? 'Đã quét phân loại & chia tải' : 'Sorted & routed'}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ {language === 'vi' ? 'Đã chia tuyến' : 'Route assigned'}
                  </span>
                </div>
              </div>

              {/* Node 3: Shipper Bike */}
              <div className="flex md:flex-col items-center md:text-center gap-3 relative z-10 bg-sky-50/80 md:bg-sky-50/50 p-3 rounded-2xl border border-sky-200">
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl ${isOrderDelivered ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'} flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-sky-100`}>
                    <Bike className="w-6 h-6" />
                  </div>
                  {currentOrder.status === 'shipping' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-600" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-sky-600">
                    {language === 'vi' ? 'Bưu Tá Đang Giao' : 'Courier on Road'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                    {currentOrder.shipperName || 'Bưu tá Tô Văn Đạt'}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-mono font-medium">BSX: 59F1 - 892.44</p>
                  {currentOrder.status === 'shipping' ? (
                    <span className="inline-block mt-1 text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md animate-pulse">
                      {language === 'vi' ? 'Cách bạn ~1.4 km (6 phút)' : '1.4 km away (~6 mins)'}
                    </span>
                  ) : isOrderDelivered ? (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ✓ {language === 'vi' ? 'Đã phát thành công' : 'Completed'}
                    </span>
                  ) : (
                    <span className="inline-block mt-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {language === 'vi' ? 'Đang chuẩn bị nhận hàng' : 'Preparing parcel'}
                    </span>
                  )}
                </div>
              </div>

              {/* Node 4: Customer Destination */}
              <div className="flex md:flex-col items-center md:text-center gap-3 relative z-10 bg-white/70 md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-slate-100">
                <div className={`w-12 h-12 rounded-2xl ${isOrderDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-4 ring-white`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {language === 'vi' ? 'Điểm Đến' : 'Destination'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{language === 'vi' ? 'Địa Chỉ Của Bạn' : 'Your Address'}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 max-w-[180px] mx-auto">
                    {currentOrder.shippingAddress}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentOrder.customerName} ({currentOrder.customerPhone})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Instructions to Courier (When shipping) */}
          {currentOrder.status === 'shipping' && (
            <div className="mt-4 pt-4 border-t border-sky-100 flex flex-col gap-2.5 bg-gradient-to-r from-sky-50/50 to-white p-3.5 rounded-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                  {language === 'vi' ? 'Gửi chỉ dẫn nhanh khi Shipper đến:' : 'Quick delivery instructions for driver:'}
                </span>
                {activeCourierNote && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    {language === 'vi' ? `Đã ghi nhận: "${activeCourierNote}"` : `Noted: "${activeCourierNote}"`}
                  </span>
                )}
              </div>

              {/* Preset tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  'Gửi lễ tân / bảo vệ sảnh A',
                  'Gọi trước khi đến 5 phút',
                  'Để bưu kiện trước cửa nhà',
                  'Giao vào giờ nghỉ trưa',
                  'Nhờ người nhà nhận giúp',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSendCourierNote(tag)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-sky-100/70 border border-sky-200 text-slate-700 hover:text-sky-800 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Custom note form */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Nhập lời dặn thêm cho bưu tá...' : 'Add a note for driver...'}
                  value={courierNoteInput}
                  onChange={(e) => setCourierNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendCourierNote(courierNoteInput);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendCourierNote(courierNoteInput)}
                  className="px-3.5 py-1.5 rounded-xl btn-ocean-primary text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>{language === 'vi' ? 'Gửi' : 'Send'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Proof of Delivery (POD) Badge & Preview (When Delivered) */}
          {isOrderDelivered && (
            <div className="mt-4 pt-4 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80"
                  alt="Proof of Delivery"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shadow-2xs cursor-pointer hover:opacity-90"
                  onClick={() => setIsPodZoomOpen(true)}
                  title={language === 'vi' ? 'Bấm để phóng to ảnh bàn giao' : 'Click to zoom'}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <h5 className="text-xs font-bold text-emerald-950">
                      {language === 'vi' ? 'Biên Bản Bàn Giao Hàng Thành Công (e-POD)' : 'Proof of Delivery Confirmed'}
                    </h5>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {language === 'vi'
                      ? `Ký nhận: ${currentOrder.customerName} • Đã xác thực mã OTP giao hàng • ${currentOrder.createdAt} 14:32`
                      : `Received by: ${currentOrder.customerName} • OTP Verified`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPodZoomOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'vi' ? 'Xem Ảnh Bàn Giao' : 'View Delivery Photo'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left: Events & History */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-zinc-50 border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              {t('tracking.historyTitle')}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {currentOrder.trackingEvents.length} {language === 'vi' ? 'sự kiện' : 'events'}
            </span>
          </div>

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

          {/* RETURN / REFUND CALLOUT BANNER IF DELIVERED */}
          {isOrderDelivered && (
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    {language === 'vi' ? 'Bảo hiểm Đổi Trả Miễn Phí 15 Ngày' : '15-Day Free Return Guarantee'}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    {language === 'vi'
                      ? 'Hàng lỗi, không đúng mô tả hoặc không vừa ý? Bạn có thể gửi yêu cầu trả hàng ngay.'
                      : 'Not satisfied or wrong size? You can request a full return & refund.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(true)}
                className="shrink-0 px-4 py-2 rounded-xl btn-ocean-secondary text-sky-800 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'vi' ? 'Yêu Cầu Trả Hàng' : 'Request Return'}</span>
              </button>
            </div>
          )}

          {/* RETURN STATUS SUMMARY IF ALREADY RETURNED */}
          {isOrderReturned && (
            <div className="mt-6 pt-5 border-t border-slate-200 bg-sky-50/60 p-4 rounded-2xl border border-sky-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {language === 'vi' ? 'Bảo Vệ Người Mua TerraSweep' : 'TerraSweep Buyer Protection'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {language === 'vi' ? 'Đang Thu Hồi' : 'In Retrieval'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                {language === 'vi'
                  ? 'Bưu tá sẽ liên hệ thu hồi kiện hàng tại địa chỉ của bạn. Số tiền thanh toán sẽ hoàn lại 100% sau khi kho Flagship xác nhận nhận được bưu phẩm.'
                  : 'A carrier will arrive to collect the package. 100% of your payment will be refunded once received at the warehouse.'}
              </p>
            </div>
          )}
        </div>

        {/* Right: Info, Driver & Package Summary */}
        <div className="space-y-4">
          {/* Driver & Merchant Contact Card */}
          <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {t('tracking.driverCardTitle')}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {currentOrder.shipperName || t('tracking.driverNamePlaceholder')}
                  </h4>
                </div>
              </div>
              <a
                href="tel:19001234"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer"
                title={language === 'vi' ? 'Gọi điện cho Shipper' : 'Call Courier'}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1.5 pt-3 border-t border-slate-200">
              <div>
                <strong>{t('tracking.recipient')}</strong> {currentOrder.customerName} ({currentOrder.customerPhone})
              </div>
              <div>
                <strong>{t('tracking.destination')}</strong> {currentOrder.shippingAddress}
              </div>
            </div>

            {/* Merchant Live Chat Button */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  openSellerChat('TerraSweep Flagship Store', {
                    order: { id: currentOrder.id, total: currentOrder.total },
                    product: currentOrder.items[0]?.product
                      ? {
                          name: currentOrder.items[0].product.name,
                          image: currentOrder.items[0].product.image,
                          price: currentOrder.items[0].price,
                        }
                      : undefined,
                  });
                }}
                className="w-full py-2.5 rounded-xl btn-ocean-secondary text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>{language === 'vi' ? 'Chat Với Shop / Hỗ Trợ' : 'Chat with Seller'}</span>
              </button>
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

      {/* RETURN & REFUND MODAL DIALOG */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {language === 'vi' ? 'Yêu Cầu Trả Hàng & Hoàn Tiền' : 'Return & Refund Request'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {language === 'vi' ? `Đơn hàng #${currentOrder.id}` : `Order #${currentOrder.id}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="mt-4 space-y-4">
              {/* Product preview */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={currentOrder.items[0]?.product?.image || ''}
                  alt="Product"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-slate-900 truncate">{currentOrder.items[0]?.product?.name}</p>
                  <p className="text-slate-500 mt-0.5">
                    {currentOrder.items.length > 1
                      ? (language === 'vi' ? `Và ${currentOrder.items.length - 1} sản phẩm khác` : `And ${currentOrder.items.length - 1} other items`)
                      : `${currentOrder.items[0]?.quantity} sản phẩm`}
                  </p>
                </div>
                <span className="font-mono font-bold text-xs text-sky-900">
                  {currentOrder.total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Lý do yêu cầu trả hàng / hoàn tiền:' : 'Reason for Return:'}
                </label>
                <OceanSelect
                  value={returnReason}
                  onChange={(val) => setReturnReason(val)}
                  variant="rounded"
                  size="md"
                  fullWidth
                  options={[
                    {
                      value: 'Sản phẩm bị lỗi kỹ thuật / không hoạt động',
                      label: language === 'vi' ? 'Sản phẩm bị lỗi kỹ thuật / không hoạt động' : 'Technical defect / Malfunctioning',
                    },
                    {
                      value: 'Hàng giao sai mẫu / sai kích cỡ / sai màu',
                      label: language === 'vi' ? 'Hàng giao sai mẫu / sai kích cỡ / sai màu' : 'Wrong variant / Wrong size / Wrong color',
                    },
                    {
                      value: 'Bao bì bể vỡ, móp méo trong vận chuyển',
                      label: language === 'vi' ? 'Bao bì bể vỡ, móp méo trong vận chuyển' : 'Damaged / Crushed during shipment',
                    },
                    {
                      value: 'Hàng khác xa với hình ảnh và mô tả',
                      label: language === 'vi' ? 'Hàng khác xa với hình ảnh và mô tả' : 'Item does not match description',
                    },
                    {
                      value: 'Thiếu phụ kiện hoặc quà tặng kèm theo',
                      label: language === 'vi' ? 'Thiếu phụ kiện hoặc quà tặng kèm theo' : 'Missing accessories or free gifts',
                    },
                    {
                      value: 'Khác',
                      label: language === 'vi' ? 'Lý do khác' : 'Other reasons',
                    },
                  ]}
                />
              </div>

              {/* Note / Detail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Mô tả chi tiết tình trạng hàng:' : 'Detailed description:'}
                </label>
                <textarea
                  rows={2}
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder={language === 'vi' ? 'Nhập thêm chi tiết tình trạng để Shop duyệt nhanh hơn...' : 'Provide details...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Evidence Photo Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'vi' ? 'Bằng chứng hình ảnh / video bóc seal:' : 'Evidence Photo:'}</span>
                </label>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={currentOrder.items[0]?.product?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
                    alt="Evidence"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                  />
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">
                      {language === 'vi' ? 'Đã đính kèm ảnh bưu kiện nhận được' : 'Parcel photo attached'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'vi' ? 'Hỗ trợ định dạng JPG, PNG, MP4 tối đa 50MB' : 'JPG, PNG, MP4 up to 50MB'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Method Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'vi' ? 'Phương thức nhận tiền hoàn:' : 'Refund Destination:'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setReturnMethod('wallet')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnMethod === 'wallet'
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-900">Ví TerraPay</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      {language === 'vi' ? 'Hoàn tiền ngay tức thì' : 'Instant refund credit'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReturnMethod('bank')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      returnMethod === 'bank'
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-bold text-slate-900">Tài khoản Bank</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      {language === 'vi' ? 'Từ 1 - 3 ngày làm việc' : '1 - 3 business days'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Refund amount preview */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {language === 'vi' ? 'Tổng số tiền hoàn trả 100%:' : 'Total 100% Refund Amount:'}
                  </span>
                  <p className="text-xs text-emerald-800 font-bold">
                    {language === 'vi' ? 'Miễn phí cước vận chuyển chiều thu hồi' : 'Free return shipping'}
                  </p>
                </div>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-700">
                  {currentOrder.total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Hủy Bỏ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                >
                  {language === 'vi' ? 'Gửi Yêu Cầu Hoàn Tiền' : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof of Delivery Photo Zoom Modal */}
      {isPodZoomOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPodZoomOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'vi' ? 'Biên Bản Bàn Giao Hàng (e-POD)' : 'Proof of Delivery (e-POD)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {language === 'vi' ? `Đơn hàng #${currentOrder.id}` : `Order #${currentOrder.id}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPodZoomOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
                alt="POD Zoom"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-slate-200"
              />
              <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'vi' ? 'Người ký nhận:' : 'Recipient:'}</span>
                  <span className="font-bold text-slate-900">{currentOrder.customerName} ({currentOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'vi' ? 'Thời gian giao:' : 'Delivered at:'}</span>
                  <span className="font-mono">{currentOrder.createdAt} - 14:32:10 GMT+7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'vi' ? 'Bưu tá giao hàng:' : 'Courier:'}</span>
                  <span className="font-medium">{currentOrder.shipperName || 'Bưu tá Tô Văn Đạt (59F1-892.44)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'vi' ? 'Trạng thái đồng kiểm:' : 'Inspection check:'}</span>
                  <span className="text-emerald-700 font-bold">
                    ✓ {language === 'vi' ? 'Khách hàng đã kiểm tra nguyên seal kiện hàng' : 'Customer inspected intact package seal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPodZoomOpen(false)}
                className="px-6 py-2 rounded-full btn-ocean-primary text-white text-xs font-bold shadow-sm shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
