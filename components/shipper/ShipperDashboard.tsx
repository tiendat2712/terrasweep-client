import React, { useState, useRef, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { OceanSelect } from '../common/OceanSelect';
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
  MapPin,
  X,
  AlertTriangle,
  PhoneCall,
  FileCheck,
  Send,
  MessageSquare,
  DollarSign,
  Wallet,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Eye,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Maximize2,
  PenTool,
} from 'lucide-react';

interface ShipperDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    extraOrNote?: { podPhoto?: string; podTimestamp?: string; failReason?: string; rescheduledDate?: string; podRecipientSignature?: string } | string
  ) => void;
}

export type ShipperTab = 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'failed' | 'cod';

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
  'Không liên lạc được người nhận (Đã gọi 3 cuộc không nhấc máy / thuê bao)',
  'Khách hàng chủ động hẹn lại ca giao sau (đang bận / đi vắng)',
  'Địa chỉ nhận hàng không rõ ràng / Khu vực hạn chế ra vào',
  'Khách kiểm tra hàng nhưng từ chối nhận (Bom hàng / Không đúng ý)',
  'Khách chưa chuẩn bị đủ tiền mặt thanh toán COD',
];

const RESCHEDULE_SHIFTS = [
  'Ca sáng mai (08:00 - 12:00)',
  'Ca chiều mai (14:00 - 18:00)',
  'Ca tối mai (18:30 - 21:00)',
  'Ca ngày mốt (08:00 - 17:00)',
];

const SMS_TEMPLATES = [
  {
    id: 's1',
    title: 'Sắp tới điểm giao (5-10 phút)',
    text: 'Chào quý khách, shipper TerraSweep đang trên đường tới giao kiện hàng trong 5-10 phút tới. Quý khách vui lòng để ý điện thoại nhé!',
  },
  {
    id: 's2',
    title: 'Đang đợi trước cửa / Sảnh lễ tân',
    text: 'Chào quý khách, shipper TerraSweep đang đứng tại sảnh / trước cửa nhà quý khách. Kính mời quý khách ra nhận bưu phẩm ạ!',
  },
  {
    id: 's3',
    title: 'Nhắc chuẩn bị tiền COD',
    text: 'Đơn hàng của quý khách có số tiền thu hộ COD. Quý khách vui lòng chuẩn bị tiền mặt hoặc mở sẵn app ngân hàng để quét mã VietQR nhé!',
  },
  {
    id: 's4',
    title: 'Đã gọi 2 lần nhưng chưa nghe máy',
    text: 'Chào quý khách, shipper TerraSweep đã liên hệ 2 lần nhưng quý khách chưa bắt máy. Quý khách nhận được tin nhắn vui lòng gọi lại giúp em nhé!',
  },
];

export const ShipperDashboard: React.FC<ShipperDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ShipperTab>('in_transit');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Batch Selection for Assigned Orders
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanningTargetOrder, setScanningTargetOrder] = useState<Order | null>(null);
  const [manualBarcodeInput, setManualBarcodeInput] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState(false);

  // Proof of Delivery (PoD) Modal State
  const [podModalOrder, setPodModalOrder] = useState<Order | null>(null);
  const [selectedPodPhoto, setSelectedPodPhoto] = useState<string>(POD_PHOTO_PRESETS[0].url);
  const [recipientSignature, setRecipientSignature] = useState('');
  const [recipientOtp, setRecipientOtp] = useState('');
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  // Canvas Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignatureDrawn, setHasSignatureDrawn] = useState(false);

  // Delivery Exception Modal State
  const [exceptionModalOrder, setExceptionModalOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState(EXCEPTION_REASONS[0]);
  const [selectedShift, setSelectedShift] = useState(RESCHEDULE_SHIFTS[0]);
  const [customExceptionNote, setCustomExceptionNote] = useState('');
  const [callAttempts, setCallAttempts] = useState<string[]>(['14:10', '14:25', '14:42']);
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  // Customer Contact Modal State
  const [contactModalOrder, setContactModalOrder] = useState<Order | null>(null);
  const [copiedSmsId, setCopiedSmsId] = useState<string | null>(null);

  // Reject Assignment Modal State
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Lệch tuyến đường phụ trách');

  // View PoD Modal State
  const [viewingPodOrder, setViewingPodOrder] = useState<Order | null>(null);

  // COD Remittance Modal State
  const [isCodRemitModalOpen, setIsCodRemitModalOpen] = useState(false);
  const [remitMethod, setRemitMethod] = useState<'vietqr' | 'counter'>('vietqr');
  const [isSubmittingRemit, setIsSubmittingRemit] = useState(false);
  const [remitSuccess, setRemitSuccess] = useState(false);
  const [remittedCodTotal, setRemittedCodTotal] = useState(0);

  // Auto hide toast
  useEffect(() => {
    if (actionSuccessToast) {
      const timer = setTimeout(() => setActionSuccessToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [actionSuccessToast]);

  // E-Signature Canvas handling
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignatureDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0284c7';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawn(false);
  };

  // Data segmentations for 6 screens
  // 1. Assigned pool: 'confirmed'
  const assignedOrders = orders.filter((o) => o.status === 'confirmed');
  // 2. Hub Pickup pool: 'picking' (or accepted by shipper)
  const pickupOrders = orders.filter((o) => o.status === 'picking');
  // 3. In Transit pool: 'shipping'
  const inTransitOrders = orders.filter((o) => o.status === 'shipping');
  // 4. Delivered pool: 'delivered'
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  // 5. Failed pool: 'failed'
  const failedOrders = orders.filter((o) => o.status === 'failed');
  // 6. COD Orders: All delivered orders with paymentMethod === 'COD'
  const codOrders = orders.filter((o) => o.paymentMethod === 'COD');
  const deliveredCodOrders = codOrders.filter((o) => o.status === 'delivered');
  const pendingCodTotal = deliveredCodOrders.reduce((acc, curr) => acc + curr.total, 0) - remittedCodTotal;
  const safeCodTotal = Math.max(0, pendingCodTotal);

  // Filtering by search or district
  const filterList = (list: Order[]) => {
    return list.filter((order) => {
      const matchText =
        order.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.shippingAddress.toLowerCase().includes(searchKeyword.toLowerCase());

      if (selectedDistrict === 'all') return matchText;
      return matchText && order.shippingAddress.toLowerCase().includes(selectedDistrict.toLowerCase());
    });
  };

  // Handlers
  const handleAcceptSingleOrder = (orderId: string) => {
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      onUpdateOrderStatus(orderId, 'picking', 'Tài xế đã tiếp nhận đơn phân công • Sẵn sàng lấy hàng tại Hub');
      setUpdatingOrderId(null);
      setActionSuccessToast(`Đã nhận đơn #${orderId}! Kiện hàng đã chuyển sang mục "Lấy Hàng Tại Hub".`);
    }, 500);
  };

  const handleBatchAcceptOrders = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => {
      onUpdateOrderStatus(id, 'picking', 'Tài xế nhận hàng loạt từ Hub trung chuyển');
    });
    setActionSuccessToast(`Đã nhận thành công ${selectedOrderIds.length} đơn hàng! Đang chuyển sang kho lấy hàng.`);
    setSelectedOrderIds([]);
    setActiveTab('pickup');
  };

  const handlePickupSingleOrder = (orderId: string) => {
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      onUpdateOrderStatus(orderId, 'shipping', 'Đã quét xuất kho bưu cục và bắt đầu tuyến giao');
      setUpdatingOrderId(null);
      setActionSuccessToast(`Đã lấy kiện #${orderId} ra khỏi kệ kho! Chuyển sang "Đang Giao Hàng".`);
    }, 600);
  };

  const handlePickupAllHubOrders = () => {
    if (pickupOrders.length === 0) return;
    pickupOrders.forEach((o) => {
      onUpdateOrderStatus(o.id, 'shipping', 'Đã kiểm đếm và nhận toàn bộ kiện hàng trong ca');
    });
    setActionSuccessToast(`Đã hoàn tất kiểm đếm ${pickupOrders.length} kiện hàng! Bắt đầu lộ trình giao hàng.`);
    setActiveTab('in_transit');
  };

  const handleOpenScanner = (order?: Order) => {
    setScanningTargetOrder(order || null);
    setIsScannerOpen(true);
    setIsScanningActive(true);
    setScanSuccessFeedback(false);

    // Simulate auto-scan after 2 seconds
    setTimeout(() => {
      setIsScanningActive(false);
      setScanSuccessFeedback(true);
      setTimeout(() => {
        if (order) {
          if (order.status === 'confirmed') {
            onUpdateOrderStatus(order.id, 'picking', 'Đã quét Laser nhận đơn tại trung tâm');
            setActionSuccessToast(`Đã quét xác nhận đơn #${order.id}!`);
          } else if (order.status === 'picking') {
            onUpdateOrderStatus(order.id, 'shipping', 'Đã quét Laser xuất kho Hub Tân Bình');
            setActionSuccessToast(`Đã quét xuất kho #${order.id}! Sẵn sàng giao.`);
          }
        }
        setIsScannerOpen(false);
        setScanSuccessFeedback(false);
      }, 900);
    }, 1800);
  };

  const handleConfirmPod = () => {
    if (!podModalOrder) return;
    setIsSubmittingPod(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      onUpdateOrderStatus(podModalOrder.id, 'delivered', {
        podPhoto: selectedPodPhoto,
        podTimestamp: `${now} Hôm nay (Ký nhận: ${recipientSignature || podModalOrder.customerName})`,
        podRecipientSignature: recipientSignature || podModalOrder.customerName,
      });
      setIsSubmittingPod(false);
      setActionSuccessToast(`Giao thành công đơn #${podModalOrder.id}! Đã lưu biên bản PoD và cập nhật tiền thu hộ.`);
      setPodModalOrder(null);
      setRecipientSignature('');
      setRecipientOtp('');
      clearSignature();
    }, 750);
  };

  const handleConfirmException = () => {
    if (!exceptionModalOrder) return;
    setIsSubmittingException(true);
    setTimeout(() => {
      const fullReason = customExceptionNote
        ? `${selectedReason} (Ghi chú: ${customExceptionNote})`
        : selectedReason;

      onUpdateOrderStatus(exceptionModalOrder.id, 'failed', {
        failReason: fullReason,
        rescheduledDate: selectedShift,
      });
      setIsSubmittingException(false);
      setActionSuccessToast(`Đã ghi nhận sự cố đơn #${exceptionModalOrder.id} • Dời lịch: ${selectedShift}`);
      setExceptionModalOrder(null);
      setCustomExceptionNote('');
    }, 700);
  };

  const handleConfirmCodRemittance = () => {
    setIsSubmittingRemit(true);
    setTimeout(() => {
      setRemittedCodTotal((prev) => prev + safeCodTotal);
      setIsSubmittingRemit(false);
      setRemitSuccess(true);
      setActionSuccessToast('Đối soát nộp tiền COD thành công! Biên lai điện tử đã được gửi về bưu cục.');
      setTimeout(() => {
        setIsCodRemitModalOpen(false);
        setRemitSuccess(false);
      }, 1500);
    }, 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSmsId(id);
    setTimeout(() => setCopiedSmsId(null), 2000);
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl ocean-feature shadow-sky-950/30 backdrop-blur-md border border-sky-500/30 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
            <span>{actionSuccessToast}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER: Courier Identity & Fleet Status */}
      <div className="p-6 sm:p-8 ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
              <Truck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Trần Văn Mạnh • <span className="text-sky-600 font-mono">FLEET-082</span>
                </h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  FLEET PRO 5.0★
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Tuyến phụ trách: <strong className="text-slate-700">Quận 1, Quận 3 & Bình Thạnh</strong> • Xe máy Honda SH (59-P1 888.88)
              </p>
            </div>
          </div>

          {/* Real-time Status Badge & Quick Laser Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CA TRỰC ĐANG BẬT (ONLINE)</span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenScanner()}
              className="btn-ocean-primary flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer hover:shadow-md transition-all"
            >
              <Scan className="w-4 h-4" />
              <span>Quét Laser Mã Vạch</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-sky-100/70">
          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>Đang Đi Giao</span>
              <Clock className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{inTransitOrders.length} Đơn</p>
            <span className="text-[11px] text-sky-600 font-medium mt-0.5 block">Hạn giao trước 17:30</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>Chờ Nhận & Lấy Hàng</span>
              <Layers className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{assignedOrders.length + pickupOrders.length} Đơn</p>
            <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">{assignedOrders.length} mới gán • {pickupOrders.length} tại Hub</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>Đã Giao Thành Công</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{deliveredOrders.length} Đơn</p>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Tỷ lệ thành công: 98.2%</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>Tiền COD Đang Giữ</span>
              <Wallet className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-2xl font-black text-sky-900 mt-1 tabular-nums">{safeCodTotal.toLocaleString('vi-VN')}₫</p>
            <button
              onClick={() => setActiveTab('cod')}
              aria-pressed={activeTab === 'cod'}
              className="text-[11px] text-sky-600 font-bold hover:underline mt-0.5 flex items-center gap-1 cursor-pointer"
            >
              <span>Nộp tiền đối soát</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6-TAB NAVIGATION BAR (CORE OF USER REQUEST)                               */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-200 pb-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0" aria-label="Shipper sections">
          
          {/* TAB 1: Xem đơn được assign */}
          <button
            type="button"
            onClick={() => setActiveTab('assigned')}
            aria-pressed={activeTab === 'assigned'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Đơn Được Gán</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'assigned' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {assignedOrders.length}
            </span>
          </button>

          {/* TAB 2: Nhận đơn & Lấy hàng tại Hub */}
          <button
            type="button"
            onClick={() => setActiveTab('pickup')}
            aria-pressed={activeTab === 'pickup'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pickup'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>2. Nhận Đơn & Lấy Hub</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'pickup' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {pickupOrders.length}
            </span>
          </button>

          {/* TAB 3: Đang giao */}
          <button
            type="button"
            onClick={() => setActiveTab('in_transit')}
            aria-pressed={activeTab === 'in_transit'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'in_transit'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>3. Đang Giao Hàng</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'in_transit' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {inTransitOrders.length}
            </span>
          </button>

          {/* TAB 4: Giao thành công & PoD */}
          <button
            type="button"
            onClick={() => setActiveTab('delivered')}
            aria-pressed={activeTab === 'delivered'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>4. Giao Thành Công</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'delivered' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {deliveredOrders.length}
            </span>
          </button>

          {/* TAB 5: Giao thất bại & Hẹn lại */}
          <button
            type="button"
            onClick={() => setActiveTab('failed')}
            aria-pressed={activeTab === 'failed'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'failed'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>5. Giao Thất Bại</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'failed' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {failedOrders.length}
            </span>
          </button>

          {/* TAB 6: Xác nhận COD & Đối soát */}
          <button
            type="button"
            onClick={() => setActiveTab('cod')}
            aria-pressed={activeTab === 'cod'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cod'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>6. Xác Nhận COD</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
              activeTab === 'cod' ? 'bg-white text-sky-800' : 'bg-sky-50 text-sky-700'
            }`}>
              {safeCodTotal > 0 ? `${(safeCodTotal / 1000).toFixed(0)}k` : '0₫'}
            </span>
          </button>
        </div>

        {/* Global Filter by District */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <OceanSelect
            value={selectedDistrict}
            onChange={(val) => setSelectedDistrict(val)}
            options={[
              { value: 'all', label: 'Mọi Khu Vực' },
              { value: 'Quận 1', label: 'Quận 1' },
              { value: 'Quận 3', label: 'Quận 3' },
              { value: 'Bình Thạnh', label: 'Bình Thạnh' },
              { value: 'Thủ Đức', label: 'TP. Thủ Đức' },
            ]}
            variant="rounded"
            size="sm"
            className="bg-white border-slate-200"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: XEM ĐƠN ĐƯỢC ASSIGN (ASSIGNED ORDERS POOL)                       */}
      {/* ========================================================================= */}
      {activeTab === 'assigned' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-sky-50/50 border border-sky-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                <span>Danh Sách Đơn Hàng Vừa Phân Công ({assignedOrders.length} kiện)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các đơn hàng đã được trung tâm điều phối dispatch. Bạn có thể nhận lẻ hoặc chọn nhiều đơn để gom tuyến một lần.
              </p>
            </div>

            {selectedOrderIds.length > 0 && (
              <button
                type="button"
                onClick={handleBatchAcceptOrders}
                className="btn-ocean-primary px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Nhận {selectedOrderIds.length} đơn đã chọn ➔ Đến Hub</span>
              </button>
            )}
          </div>

          {assignedOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Không có đơn hàng mới nào đang chờ phân công</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Hệ thống điều phối trung tâm sẽ tự động rung chuông và thông báo ngay khi có khách đặt hàng mới trong khu vực của bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filterList(assignedOrders).map((order, orderIdx) => {
                const isSelected = selectedOrderIds.includes(order.id);
                return (
                  <div
                    key={order.id}
                    style={{ animationDelay: `${Math.min(orderIdx * 50, 300)}ms` }}
                    className={`p-6 rounded-3xl bg-white border transition-all space-y-4 relative animate-card-entrance ${
                      isSelected
                        ? 'border-sky-500 shadow-md ring-2 ring-sky-400/20'
                        : 'border-slate-200 hover:border-sky-300 shadow-2xs'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderIds([...selectedOrderIds, order.id]);
                            } else {
                              setSelectedOrderIds(selectedOrderIds.filter((id) => id !== order.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-mono font-bold text-sky-600 tabular-nums">#{order.id}</span>
                          <span className="text-[11px] text-slate-400 block font-mono tabular-nums">{order.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          HỎA TỐC 2H
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          Chờ Nhận
                        </span>
                      </div>
                    </div>

                    {/* Route Specs */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                          A
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Điểm Lấy Hàng:</span>
                          <p className="font-semibold text-slate-800">Kho Flagship TerraSweep (KCN Tân Bình, TP.HCM)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                          B
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Điểm Giao Khách:</span>
                          <p className="font-bold text-slate-900">{order.shippingAddress}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Người nhận: <strong>{order.customerName}</strong> • SĐT: <span className="font-mono tabular-nums">{order.customerPhone}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Note & COD */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Số tiền cần thu COD:</span>
                        <p className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                          {order.paymentMethod === 'COD' ? `${order.total.toLocaleString('vi-VN')}₫` : '0₫ (Đã trả online)'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Cước phí tài xế nhận:</span>
                        <p className="text-xs font-bold text-emerald-600 font-mono">+28.500₫</p>
                      </div>
                    </div>

                    {order.deliveryNote && (
                      <p className="text-[11px] text-amber-800 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                        💬 <span className="font-semibold">Lời dặn của khách:</span> {order.deliveryNote}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRejectModalOrder(order)}
                        className="w-1/3 py-2.5 px-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        Từ Chối
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcceptSingleOrder(order.id)}
                        disabled={updatingOrderId === order.id}
                        className="w-2/3 btn-ocean-primary py-2.5 px-4 rounded-full text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {updatingOrderId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Nhận Đơn Này</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: NHẬN ĐƠN & LẤY HÀNG TẠI HUB (WAREHOUSE PICKUP & CHECK-IN)        */}
      {/* ========================================================================= */}
      {activeTab === 'pickup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Bưu Cục & Kho Hub Trung Chuyển Tân Bình</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vị trí nhận kiện: <strong className="text-slate-800">Kệ Phân Tuyến B-14 (Tuyến Quận 1 & Bình Thạnh)</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenScanner()}
                className="btn-ocean-primary px-4 py-2.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Quét Laser Kiểm Đếm</span>
              </button>

              {pickupOrders.length > 0 && (
                <button
                  type="button"
                  onClick={handlePickupAllHubOrders}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Lấy Tất Cả & Xuất Bến
                </button>
              )}
            </div>
          </div>

          {pickupOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-3">
              <Layers className="w-10 h-10 text-sky-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Không có kiện hàng nào đang chờ lấy tại Hub</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Bạn đã nhận đủ các kiện hàng vào balo hoặc các đơn mới vẫn đang nằm ở tab "Đơn Được Gán".
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('assigned')}
                className="px-5 py-2 rounded-full bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 cursor-pointer"
              >
                Xem tab Đơn Được Gán ➔
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-semibold">
                <span>Danh sách kiện hàng cần xuất kệ kho ({pickupOrders.length} kiện)</span>
                <span>Kiểm tra ngoại quan trước khi nhận</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pickupOrders.map((order, orderIdx) => (
                  <div
                    key={order.id}
                    style={{ animationDelay: `${Math.min(orderIdx * 50, 300)}ms` }}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 shadow-2xs space-y-4 animate-card-entrance"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-600 tabular-nums">#{order.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        Chờ Lấy Hàng
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-slate-500 line-clamp-2">{order.shippingAddress}</p>
                      <p className="text-[11px] font-mono tabular-nums text-slate-400">
                        Sản phẩm: {order.items.length} món • COD: <span className="font-mono tabular-nums">{order.total.toLocaleString('vi-VN')}₫</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Hộp nguyên vẹn, tem niêm phong còn tốt</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenScanner(order)}
                        className="w-1/2 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Quét Mã</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePickupSingleOrder(order.id)}
                        disabled={updatingOrderId === order.id}
                        className="w-1/2 btn-ocean-primary py-2 px-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {updatingOrderId === order.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5" />
                            <span>Lấy Kiện</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: ĐANG GIAO HÀNG (IN-TRANSIT & INTERACTIVE ROUTE)                   */}
      {/* ========================================================================= */}
      {activeTab === 'in_transit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Interactive Route Navigation Simulation Map */}
          <div className="p-6 rounded-3xl ocean-feature relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-sky-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <span>Lộ Trình Tuyến Giao Thông Minh (GPS Real-time)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-sky-700 font-mono mt-0.5">
                    Tọa độ hiện tại: 10.7769° N, 106.7009° E (Đường Nguyễn Thị Minh Khai)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-white/70 border border-sky-200 text-sky-700">
                  {inTransitOrders.length} Điểm Dừng Còn Lại
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                  ETA Dự Kiến: 16:45
                </span>
              </div>
            </div>

            {/* Visual Simulated Waypoints Line */}
            <div className="relative z-10 py-5">
              <div className="flex items-center justify-between relative">
                {/* Horizontal connection line */}
                <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400/30" />

                {/* Shipper Current Spot */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/50 ring-4 ring-sky-500/20">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 mt-1.5 font-mono">Vị trí tài xế</span>
                </div>

                {/* Waypoint 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs ring-4 ring-white/20">
                    1
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 mt-1.5">Bitexco Q.1 (~1.2 km)</span>
                </div>

                {/* Waypoint 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-white/20 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 mt-1.5">Võ Thị Sáu Q.3 (~2.4 km)</span>
                </div>

                {/* Waypoint 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-white/20 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 mt-1.5">Bình Thạnh (~4.1 km)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Deliveries List */}
          {inTransitOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Bạn đã hoàn tất mọi đơn hàng đang giao!</h3>
              <p className="text-xs text-slate-400">
                Hãy chuyển sang tab "Lấy Hàng Tại Hub" hoặc "Đơn Được Gán" để nhận thêm chuyến mới.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterList(inTransitOrders).map((order, idx) => (
                <div
                  key={order.id}
                  style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
                  className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden animate-card-entrance"
                >
                  {/* Order Top Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold font-mono tabular-nums">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-mono font-bold text-sky-600 tabular-nums">#{order.id}</span>
                        <span className="text-[11px] text-slate-400 block font-mono tabular-nums">{order.createdAt}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200 animate-pulse">
                      Đang Đi Giao
                    </span>
                  </div>

                  {/* Destination Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Địa chỉ giao:</span>
                        <p className="font-bold text-slate-900 text-sm">{order.shippingAddress}</p>
                        <p className="text-xs text-slate-600 font-sans mt-0.5">
                          Khách: <strong className="text-slate-800">{order.customerName}</strong> • <span className="font-mono tabular-nums">{order.customerPhone}</span>
                        </p>
                      </div>
                    </div>

                    {order.deliveryNote && (
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
                        <span className="font-bold">Chỉ dẫn:</span>
                        <span>{order.deliveryNote}</span>
                      </div>
                    )}
                  </div>

                  {/* COD & Payment Details */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tiền cần thu (COD):</span>
                      <strong className="text-slate-900 font-extrabold text-base tracking-tight font-mono tabular-nums">
                        {order.paymentMethod === 'COD' ? `${order.total.toLocaleString('vi-VN')}₫` : '0₫ (Đã thanh toán online)'}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Phương thức:</span>
                      <span className="font-bold text-slate-700">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Communication Bar: Call & Quick SMS */}
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Gọi Điện</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setContactModalOrder(order)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Mẫu SMS</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Chỉ Đường</span>
                    </a>
                  </div>

                  {/* Primary Actions: Giao thành công (PoD) or Giao thất bại */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPodModalOrder(order);
                        setRecipientSignature(order.customerName);
                      }}
                      className="btn-ocean-primary flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Giao Thành Công (PoD)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExceptionModalOrder(order)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs cursor-pointer transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Báo Sự Cố Giao Hàng</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: GIAO THÀNH CÔNG (DELIVERED & POD ARCHIVE)                        */}
      {/* ========================================================================= */}
      {activeTab === 'delivered' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-xs">
            <div>
              <h2 className="text-base font-black text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Kho Lưu Trữ Bằng Chứng Giao Hàng (PoD) — {deliveredOrders.length} Đơn Hoàn Tất</span>
              </h2>
              <p className="text-emerald-800 mt-0.5">
                Mọi bưu phẩm đã giao đều được lưu kèm chữ ký điện tử, ảnh hiện trường và dấu tọa độ thời gian thực.
              </p>
            </div>
          </div>

          {deliveredOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
              <p className="text-sm font-bold">Chưa có đơn nào hoàn tất trong ca hôm nay</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filterList(deliveredOrders).map((order, idx) => (
                <div
                  key={order.id}
                  style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs space-y-4 animate-card-entrance"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-600 tabular-nums">#{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Đã Giao Thành Công
                    </span>
                  </div>

                  {/* PoD Photo thumbnail */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-40 bg-slate-100">
                    <img
                      src={order.podPhoto || POD_PHOTO_PRESETS[0].url}
                      alt="PoD Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                      <div className="text-white text-[10px] font-mono">
                        <p className="font-bold">GPS: 10.7769° N, 106.7009° E</p>
                        <p className="text-slate-300">{order.podTimestamp || 'Đã đóng dấu PoD'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-slate-500 line-clamp-1">{order.shippingAddress}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Ký nhận: {order.podRecipientSignature || order.customerName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewingPodOrder(order)}
                    className="w-full py-2 rounded-full bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Xem Chi Tiết Biên Bản PoD</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: GIAO THẤT BẠI & HẸN LẠI (DELIVERY EXCEPTIONS)                    */}
      {/* ========================================================================= */}
      {activeTab === 'failed' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 text-xs">
            <h2 className="text-base font-black text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Xử Lý Sự Cố Giao Hàng & Hẹn Lại Tuyến Sau ({failedOrders.length} đơn)</span>
            </h2>
            <p className="text-rose-800 mt-0.5">
              Các đơn hàng giao chưa thành công cần có lý do rõ ràng, nhật ký 3 cuộc gọi đối soát và lịch hẹn ca kế tiếp trước khi hoàn kho.
            </p>
          </div>

          {failedOrders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Không có đơn hàng nào gặp sự cố trong ca làm việc!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filterList(failedOrders).map((order, idx) => (
                <div
                  key={order.id}
                  style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
                  className="p-6 rounded-3xl bg-white border border-rose-200 shadow-2xs space-y-4 animate-card-entrance"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-sky-600 tabular-nums">#{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Giao Thất Bại
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5 text-xs text-rose-900">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <Clock className="w-4 h-4 text-rose-600" />
                      <span>{order.rescheduledDate || 'Hẹn ca kế tiếp'}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 pl-6">
                      <span className="font-semibold">Lý do:</span> {order.failReason || 'Khách hàng hẹn ca sau'}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{order.customerName} • <span className="font-mono tabular-nums">{order.customerPhone}</span></p>
                    <p className="text-slate-500 line-clamp-2">{order.shippingAddress}</p>
                    <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                      COD: {order.total.toLocaleString('vi-VN')}₫ • Hình thức: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'shipping', 'Tài xế bấm giao lại lần 2 cho khách');
                        setActionSuccessToast(`Đã chuyển đơn #${order.id} trở lại mục Đang Giao Hàng!`);
                      }}
                      className="w-1/2 btn-ocean-primary py-2.5 px-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Giao Lại Ngay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'returned', 'Đóng gói chuyển hoàn về kho bưu cục');
                        setActionSuccessToast(`Đã chuyển hoàn đơn #${order.id} về bưu cục trung tâm!`);
                      }}
                      className="w-1/2 py-2.5 px-3 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Hoàn Về Bưu Cục</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: XÁC NHẬN COD & ĐỐI SOÁT (COD CASHIER & REMITTANCE)                */}
      {/* ========================================================================= */}
      {activeTab === 'cod' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* COD Wallet Main Card */}
          <div className="p-6 sm:p-8 rounded-3xl ocean-feature relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  VÍ THU HỘ TIỀN MẶT COD (CASH ESCROW)
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 tabular-nums">
                  {safeCodTotal.toLocaleString('vi-VN')}₫
                </h2>
                <p className="text-xs text-sky-700">
                  Số tiền mặt thu hộ đang giữ trong ca • Hạn mức an toàn cho phép: <strong>5.000.000₫</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCodRemitModalOpen(true)}
                  disabled={safeCodTotal === 0}
                  className="btn-ocean-primary px-6 py-3 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Nộp Tiền Đối Soát Ngay</span>
                </button>
              </div>
            </div>

            {/* Safety Progress Bar */}
            <div className="mt-6 pt-5 border-t border-sky-200 space-y-2 relative z-10">
              <div className="flex items-center justify-between text-xs text-sky-700">
                <span>Mức độ giữ tiền mặt trong túi:</span>
                <span className="font-mono font-bold">{((safeCodTotal / 5000000) * 100).toFixed(0)}% (An toàn)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (safeCodTotal / 5000000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* COD Orders Ledger Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Bảng Kê Chi Tiết Đơn Hàng Thu Hộ COD ({deliveredCodOrders.length} đơn)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Phiên đối soát: CA-HOM-NAY</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-2">
                    <th className="py-2.5 px-3">Mã Vận Đơn</th>
                    <th className="py-2.5 px-3">Khách Hàng</th>
                    <th className="py-2.5 px-3">Địa Chỉ Giao</th>
                    <th className="py-2.5 px-3 text-right">Tiền Thu Hộ COD</th>
                    <th className="py-2.5 px-3 text-center">Trạng Thái Nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveredCodOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-sky-600">#{order.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{order.customerName}</td>
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{order.shippingAddress}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900 tabular-nums font-mono">
                        {order.total.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Chờ Nộp Bưu Cục
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: LASER BARCODE / QR SCANNER MODAL                                 */}
      {/* ========================================================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white border border-slate-200 p-7 shadow-2xl text-center space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scan className="w-4 h-4 text-sky-600 animate-spin" />
                <span>Máy Quét Laser Mã Vạch Quang Học</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              {scanningTargetOrder ? `Kiểm đếm kiện: #${scanningTargetOrder.id}` : 'Hướng camera vào tem mã vạch trên kiện hàng'}
            </p>

            {/* Laser Frame */}
            <div className="relative w-52 h-52 mx-auto rounded-3xl bg-slate-950 border-2 border-dashed border-sky-400/50 flex items-center justify-center overflow-hidden shadow-inner">
              <QrCode className="w-32 h-32 text-sky-400/20" />
              {isScanningActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce duration-700" />
              )}
              {scanSuccessFeedback && (
                <div className="absolute inset-0 bg-sky-950/95 flex flex-col items-center justify-center text-white animate-in zoom-in">
                  <CheckCircle2 className="w-12 h-12 text-sky-400 animate-bounce" />
                  <span className="text-xs font-bold font-mono mt-2">ĐÃ QUÉT THÀNH CÔNG!</span>
                </div>
              )}
            </div>

            {/* Manual barcode fallback input */}
            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={manualBarcodeInput}
                onChange={(e) => setManualBarcodeInput(e.target.value)}
                placeholder="Hoặc nhập mã vận đơn (vd: TS-98427)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-center focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualBarcodeInput.trim()) {
                    setActionSuccessToast(`Đã ghi nhận mã: ${manualBarcodeInput.trim()}!`);
                    setIsScannerOpen(false);
                    setManualBarcodeInput('');
                  }
                }}
                className="w-full btn-ocean-primary py-2 rounded-full text-xs font-bold text-white cursor-pointer"
              >
                Xác Nhận Mã Thủ Công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROOF OF DELIVERY (POD) WITH DIGITAL SIGNATURE CANVAS             */}
      {/* ========================================================================= */}
      {podModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Biên Bản Bàn Giao Điện Tử (PoD)</h3>
                  <p className="text-xs text-slate-400 font-mono">Đơn #{podModalOrder.id} • {podModalOrder.customerName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPodModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Geotag GPS Watermark Info */}
            <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-mono">GPS: 10.7769° N, 106.7009° E (Đóng dấu tự động)</p>
                <p className="text-[11px] text-sky-700 mt-0.5">Địa chỉ: {podModalOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Photo Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>1. Chọn ảnh bằng chứng giao hàng (PoD):</span>
                <span className="text-[10px] text-slate-400">Live Camera Ready</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {POD_PHOTO_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setSelectedPodPhoto(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 text-left cursor-pointer ${
                      selectedPodPhoto === preset.url
                        ? 'border-sky-600 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-20 object-cover rounded-xl" />
                    <div className="p-1">
                      <p className="text-[10px] font-semibold text-slate-700 line-clamp-1">{preset.label}</p>
                    </div>
                    {selectedPodPhoto === preset.url && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* E-Signature Canvas */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" />
                  <span>2. Chữ ký điện tử của khách hàng:</span>
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                >
                  Xóa ký lại
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-28 bg-white rounded-xl touch-none cursor-crosshair"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Khách hàng ký trực tiếp bằng ngón tay hoặc chuột vào khung trắng trên
              </p>
            </div>

            {/* Recipient Full Name & OTP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Tên người nhận thực tế:</label>
                <input
                  type="text"
                  value={recipientSignature}
                  onChange={(e) => setRecipientSignature(e.target.value)}
                  placeholder={podModalOrder.customerName}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Mã OTP xác thực (nếu có):</label>
                <input
                  type="text"
                  maxLength={4}
                  value={recipientOtp}
                  onChange={(e) => setRecipientOtp(e.target.value)}
                  placeholder="Ví dụ: 8842"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-center tracking-widest focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPodModalOrder(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmPod}
                disabled={isSubmittingPod}
                className="btn-ocean-primary px-6 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmittingPod ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang lưu PoD...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận & Lưu Biên Bản PoD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELIVERY EXCEPTION & CALL ATTEMPT TRACKER                         */}
      {/* ========================================================================= */}
      {exceptionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Báo Cáo Sự Cố Giao Hàng</h3>
                  <p className="text-xs text-slate-400 font-mono">Đơn #{exceptionModalOrder.id} • {exceptionModalOrder.customerName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExceptionModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Call Attempt Verification */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-amber-700" />
                  <span>Quy định đối soát: 3 cuộc gọi cách nhau 10-15 phút</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">✓ Đã đủ 3 lần gọi</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {callAttempts.map((time, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white border border-amber-200 text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">Cuộc gọi {i + 1}</span>
                    <span className="font-mono font-bold text-slate-800">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Lý do giao chưa thành công:</label>
              <div className="space-y-2">
                {EXCEPTION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-rose-500 bg-rose-50/50 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exceptionReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reschedule shift */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Hẹn giao lại vào ca:</span>
              </label>
              <OceanSelect
                value={selectedShift}
                onChange={(val) => setSelectedShift(val)}
                options={RESCHEDULE_SHIFTS.map((shift) => ({ value: shift, label: shift }))}
                variant="rounded"
                fullWidth
                className="bg-white border-slate-200"
              />
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Ghi chú thêm của Shipper:</label>
              <input
                type="text"
                value={customExceptionNote}
                onChange={(e) => setCustomExceptionNote(e.target.value)}
                placeholder="Ví dụ: Khách bảo đi họp đột xuất, hẹn 8h30 sáng mai"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExceptionModalOrder(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmException}
                disabled={isSubmittingException}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmittingException ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lưu Sự Cố & Đổi Ca Hẹn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CUSTOMER CONTACT & QUICK SMS TEMPLATES                           */}
      {/* ========================================================================= */}
      {contactModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Liên Hệ Nhanh Cho Khách Hàng</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {contactModalOrder.customerName} • {contactModalOrder.customerPhone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">Chọn mẫu tin nhắn gửi nhanh:</label>
              {SMS_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tpl.title}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(tpl.text, tpl.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                    >
                      {copiedSmsId === tpl.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSmsId === tpl.id ? 'Đã sao chép' : 'Sao chép SMS'}</span>
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{tpl.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={`sms:${contactModalOrder.customerPhone}`}
                className="w-full btn-ocean-primary py-2.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mở Trình Nhắn Tin Điện Thoại</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REJECT ORDER ASSIGNMENT                                          */}
      {/* ========================================================================= */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Từ Chối Nhận Đơn #{rejectModalOrder.id}</h3>
            <p className="text-xs text-slate-500">
              Vui lòng chọn lý do từ chối để hệ thống tự động tái phân công cho tài xế khác trong khu vực:
            </p>

            <OceanSelect
              value={rejectReason}
              onChange={(val) => setRejectReason(val)}
              variant="rounded"
              size="md"
              fullWidth
              options={[
                { value: 'Lệch tuyến đường phụ trách', label: 'Lệch tuyến đường phụ trách' },
                { value: 'Xe chở đã đầy tải trọng', label: 'Xe chở đã đầy tải trọng' },
                { value: 'Gần hết ca trực', label: 'Gần hết ca trực' },
                { value: 'Sự cố kỹ thuật phương tiện', label: 'Sự cố kỹ thuật phương tiện' },
              ]}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionSuccessToast(`Đã từ chối đơn #${rejectModalOrder.id}! Đơn đã được chuyển về kho điều phối.`);
                  setRejectModalOrder(null);
                }}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: COD REMITTANCE (VIETQR DYNAMIC & HUB CASHIER)                     */}
      {/* ========================================================================= */}
      {isCodRemitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-black text-slate-900">Nộp Tiền Đối Soát COD</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCodRemitModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Method switch */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100">
              <button
                type="button"
                onClick={() => setRemitMethod('vietqr')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  remitMethod === 'vietqr' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Chuyển Khoản VietQR
              </button>
              <button
                type="button"
                onClick={() => setRemitMethod('counter')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  remitMethod === 'counter' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Nộp Quầy Bưu Cục
              </button>
            </div>

            {remitMethod === 'vietqr' ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-700">Tổng số tiền cần chuyển nộp:</span>
                  <p className="text-2xl font-black text-sky-950 font-mono tabular-nums">
                    {safeCodTotal.toLocaleString('vi-VN')}₫
                  </p>
                </div>

                {/* Simulated dynamic VietQR Code */}
                <div className="w-48 h-48 mx-auto rounded-2xl bg-white border-2 border-sky-200 p-2 flex flex-col items-center justify-center shadow-md relative">
                  <QrCode className="w-36 h-36 text-sky-950" />
                  <span className="text-[9px] font-bold text-sky-700 font-mono mt-1">VIETQR NAPAS247 DYNAMIC</span>
                </div>

                <div className="text-left text-xs bg-slate-50 p-3 rounded-2xl space-y-1.5 text-slate-700 font-mono">
                  <p>Tài khoản nhận: <strong className="text-slate-900">0381000999888 (Vietcombank)</strong></p>
                  <p>Tên thụ hưởng: <strong className="text-slate-900">TERRASWEEP LOGISTICS CO</strong></p>
                  <p>Nội dung: <strong className="text-sky-600">NOP COD FLEET082 MANH_TV</strong></p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-500">
                  Đưa mã vạch phiếu bàn giao này cho thủ quỹ bưu cục quét để nộp tiền mặt trực tiếp:
                </p>

                <div className="p-4 rounded-2xl ocean-feature border border-sky-500/30 font-mono space-y-2 shadow-lg shadow-sky-950/20">
                  <p className="text-[10px] text-slate-400">PHIẾU BÀN GIAO TIỀN MẶT BƯU CỤC</p>
                  <div className="h-14 flex items-center justify-center tracking-widest text-2xl font-black border-y border-white/20">
                    ||||| |||| || |||||| ||| ||||
                  </div>
                  <p className="text-xs font-bold text-sky-700 font-mono tabular-nums">TS-REMIT-88421-COD</p>
                  <p className="text-xs font-bold font-mono tabular-nums">Số tiền: {safeCodTotal.toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
            )}

            {/* Confirmation button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmCodRemittance}
                disabled={isSubmittingRemit || safeCodTotal === 0}
                className="w-full btn-ocean-primary py-3 rounded-full text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRemit ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang xác nhận đối soát...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Đã Nộp Đầy Đủ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: VIEW EXISTING POD MODAL                                          */}
      {/* ========================================================================= */}
      {viewingPodOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Chi Tiết Bằng Chứng Giao Hàng</h3>
                <p className="text-[11px] text-slate-400 font-mono">#{viewingPodOrder.id} • {viewingPodOrder.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingPodOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
              <img
                src={viewingPodOrder.podPhoto || POD_PHOTO_PRESETS[0].url}
                alt="PoD Proof"
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-sm text-white text-[10px] p-2.5 rounded-xl text-left font-mono">
                <p className="font-bold">GPS: 10.7769° N, 106.7009° E (Q.1, TP.HCM)</p>
                <p className="text-slate-300 mt-0.5">Xác nhận: {viewingPodOrder.podTimestamp || 'Đã ký nhận'}</p>
                <p className="text-sky-300 mt-0.5">Ký tên: {viewingPodOrder.podRecipientSignature || viewingPodOrder.customerName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingPodOrder(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
