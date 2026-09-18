import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Order, OrderStatus, ProductReview, ShopVoucher } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { OceanSelect } from '../common/OceanSelect';
import { useLanguage } from '@/i18n/LanguageContext';
import { INITIAL_REVIEWS, INITIAL_VOUCHERS, INITIAL_SELLER_CONVERSATIONS, SellerConversation } from '@/data/mockData';
import {
  Store,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  DollarSign,
  Clock,
  Check,
  X,
  Loader2,
  Printer,
  FileText,
  QrCode,
  CheckCircle2,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  MessageSquare,
  Send,
  Star,
  ThumbsUp,
  MessageCircle,
  Tag,
  Percent,
  Ticket,
  Wallet,
  CreditCard,
  ArrowUpRight,
  BarChart3,
  Users,
  ShoppingBag,
  Boxes,
  ShieldCheck,
  Copy,
  Sparkles,
  ChevronRight,
  Maximize2,
  MapPin,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onConfirmOrder: (orderId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddNewProduct: (product: Partial<Product>) => void;
}

export type SellerTab = 'products' | 'inventory' | 'orders' | 'qa' | 'chat' | 'revenue' | 'vouchers';

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  onConfirmOrder,
  onUpdateStock,
  onAddNewProduct,
}) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = useState<SellerTab>('products');
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  // Common Search & Toast State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // ==========================================
  // TAB 1: PRODUCTS STATE
  // ==========================================
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hiddenProductIds, setHiddenProductIds] = useState<string[]>([]);

  // ==========================================
  // TAB 2: INVENTORY STATE
  // ==========================================
  const [stockSearchKeyword, setStockSearchKeyword] = useState('');
  const [stockFilterLowOnly, setStockFilterLowOnly] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState('50');
  const [restockSupplier, setRestockSupplier] = useState('Tổng Kho TerraSweep Đồng Nai (Xưởng 02)');

  // ==========================================
  // TAB 3: ORDERS STATE
  // ==========================================
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<Order | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  // ==========================================
  // TAB 4: Q&A & REVIEWS STATE
  // ==========================================
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'all'>('all');
  const [replyInputText, setReplyInputText] = useState<{ [reviewId: string]: string }>({});

  // ==========================================
  // TAB 5: CHAT CRM STATE
  // ==========================================
  const [conversations, setConversations] = useState<SellerConversation[]>(INITIAL_SELLER_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(INITIAL_SELLER_CONVERSATIONS[0]?.id || 'conv-1');
  const [chatMessageInput, setChatMessageInput] = useState('');

  // ==========================================
  // TAB 6: REVENUE STATE
  // ==========================================
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('20000000');
  const [selectedBank, setSelectedBank] = useState('Vietcombank (0381000999888 - CN TP.HCM)');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  // ==========================================
  // TAB 7: VOUCHERS STATE
  // ==========================================
  const [vouchersList, setVouchersList] = useState<ShopVoucher[]>(INITIAL_VOUCHERS);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherType, setNewVoucherType] = useState<'fixed' | 'percentage' | 'shipping'>('fixed');
  const [newVoucherValue, setNewVoucherValue] = useState('50000');
  const [newVoucherMinOrder, setNewVoucherMinOrder] = useState('500000');
  const [newVoucherUsageLimit, setNewVoucherUsageLimit] = useState('200');

  // Trigger toast with auto dismiss
  const showToast = (message: string) => {
    setActionSuccessToast(message);
    setTimeout(() => setActionSuccessToast(null), 3200);
  };

  // =========================================================================
  // HANDLERS
  // =========================================================================

  // Product actions
  const handleToggleProductVisibility = (productId: string) => {
    if (hiddenProductIds.includes(productId)) {
      setHiddenProductIds(hiddenProductIds.filter((id) => id !== productId));
      showToast('Đã mở hiển thị sản phẩm trên gian hàng!');
    } else {
      setHiddenProductIds([...hiddenProductIds, productId]);
      showToast('Đã tạm ẩn sản phẩm khỏi kết quả tìm kiếm của khách hàng.');
    }
  };

  // Inventory actions
  const handleUpdateStockClick = (productId: string, newQty: number) => {
    if (newQty < 0 || updatingStockId === productId) return;
    setUpdatingStockId(productId);
    setTimeout(() => {
      onUpdateStock(productId, newQty);
      setUpdatingStockId(null);
      showToast(`Đã cập nhật tồn kho SKU #${productId} thành ${newQty} đôi!`);
    }, 300);
  };

  const handleConfirmRestock = () => {
    if (!restockProduct) return;
    const added = Number(restockAmount) || 0;
    const newTotal = restockProduct.stock + added;
    onUpdateStock(restockProduct.id, newTotal);
    showToast(`Đã nhập thêm ${added} đôi cho sản phẩm "${restockProduct.name}"! Tồn kho mới: ${newTotal}.`);
    setShowRestockModal(false);
    setRestockProduct(null);
  };

  // Order actions
  const handleConfirmOrder = (orderId: string) => {
    if (confirmingOrderId) return;
    setConfirmingOrderId(orderId);
    setTimeout(() => {
      onConfirmOrder(orderId);
      setConfirmingOrderId(null);
      showToast(`Đã xác nhận đơn hàng #${orderId}! Kiện hàng sẵn sàng in tem đóng gói.`);
    }, 500);
  };

  // Q&A / Review reply action
  const handleReplyReview = (reviewId: string) => {
    const text = replyInputText[reviewId];
    if (!text || !text.trim()) return;

    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              sellerResponse: {
                content: text.trim(),
                createdAt: 'Vừa xong',
              },
            }
          : r
      )
    );

    setReplyInputText((prev) => ({ ...prev, [reviewId]: '' }));
    showToast('Đã gửi phản hồi chính thức từ Shop tới khách hàng!');
  };

  // Chat message action
  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || conversations[0];
  }, [conversations, activeConversationId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessageInput.trim() || !currentConversation) return;

    const newMsgText = chatMessageInput.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'seller' as const,
      text: newMsgText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversation.id
          ? {
              ...c,
              lastMessage: newMsgText,
              lastTime: newMsg.time,
              unreadCount: 0,
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    setChatMessageInput('');

    // Simulate quick customer response after 1.5s
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversation.id
            ? {
                ...c,
                lastMessage: 'Dạ em cảm ơn shop nhiều ạ!',
                lastTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                messages: [
                  ...c.messages,
                  {
                    id: `msg-${Date.now() + 1}`,
                    sender: 'customer' as const,
                    text: 'Dạ em cảm ơn shop nhiều ạ! Em đã đặt luôn rồi ạ.',
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  },
                ],
              }
            : c
        )
      );
    }, 1500);
  };

  // Revenue withdrawal
  const handleConfirmWithdraw = () => {
    const amount = Number(withdrawAmount) || 0;
    if (amount <= 0) return;

    setIsProcessingWithdraw(true);
    setTimeout(() => {
      setWithdrawnTotal((prev) => prev + amount);
      setIsProcessingWithdraw(false);
      setShowWithdrawModal(false);
      showToast(`Đã tạo lệnh rút ${amount.toLocaleString('vi-VN')}₫ thành công về ${selectedBank}!`);
    }, 900);
  };

  // Voucher creation
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) return;

    const newVoucher: ShopVoucher = {
      id: `vouch-${Date.now()}`,
      code: newVoucherCode.trim().toUpperCase(),
      title: newVoucherTitle.trim() || `Ưu đãi voucher ${newVoucherCode.trim().toUpperCase()}`,
      discountType: newVoucherType,
      discountValue: Number(newVoucherValue) || 0,
      minOrderValue: Number(newVoucherMinOrder) || 0,
      maxUsage: Number(newVoucherUsageLimit) || 100,
      usedCount: 0,
      startDate: 'Hôm nay',
      endDate: '31/12/2026',
      status: 'active',
    };

    setVouchersList([newVoucher, ...vouchersList]);
    setShowAddVoucherModal(false);
    setNewVoucherCode('');
    setNewVoucherTitle('');
    showToast(`Đã kích hoạt và phát hành voucher "${newVoucher.code}" thành công!`);
  };

  // Data computations
  const lowStockCount = products.filter((p) => p.stock < 15).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.flashPrice * p.stock, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const grossRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.total, 148920000);
  const netProfit = Math.round(grossRevenue * 0.286);
  const availableBalance = Math.max(0, 58240000 - withdrawnTotal);

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

      {/* TOP HEADER: Store Banner & Overall Performance */}
      <div className="p-6 sm:p-8 ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
              <Store className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  TerraSweep Flagship Official
                </h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  FLAGSHIP MALL • 4.9★
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                {isVi ? 'Kênh Quản Trị Nhà Bán Hàng' : 'Enterprise Merchant Portal'} • {isVi ? 'Mã Đối Tác:' : 'Partner ID:'}{' '}
                <strong className="text-slate-700 font-mono">MERCHANT-VN-092</strong> • {isVi ? 'Tỷ lệ phản hồi chat:' : 'Chat response:'} 99%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/seller/products/new')}
              className="btn-ocean-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isVi ? '+ Đăng Bán Sản Phẩm Mới' : '+ Add New Product'}</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-sky-100/70">
          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>{isVi ? 'Doanh Thu Gộp' : 'Gross GMV'}</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
              {grossRevenue.toLocaleString('vi-VN')}₫
            </p>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              {isVi ? '+14.2% so với tháng trước' : '+14.2% vs last month'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>{isVi ? 'Đơn Chờ Xử Lý' : 'Pending Orders'}</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-900 mt-1 tabular-nums">
              {pendingOrdersCount} {isVi ? 'Đơn Hàng' : 'Orders'}
            </p>
            <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
              {isVi ? 'Cần xác nhận & đóng gói' : 'Awaiting packing & dispatch'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>{isVi ? 'Tổng Số Sản Phẩm' : 'Catalog Size'}</span>
              <Boxes className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
              {products.length} {isVi ? 'Sản Phẩm' : 'Products'}
            </p>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {lowStockCount > 0
                ? isVi
                  ? `⚠️ ${lowStockCount} sản phẩm sắp hết kho`
                  : `⚠️ ${lowStockCount} items low in stock`
                : isVi
                ? 'Tồn kho dồi dào'
                : 'Inventory well stocked'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-sky-100/70">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
              <span>{isVi ? 'Số Dư Khả Dụng' : 'Available Balance'}</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 tabular-nums">
              {availableBalance.toLocaleString('vi-VN')}₫
            </p>
            <button
              onClick={() => {
                setActiveTab('revenue');
                setShowWithdrawModal(true);
              }}
              className="text-[11px] text-emerald-700 font-bold hover:underline mt-0.5 flex items-center gap-1 cursor-pointer"
            >
              <span>{isVi ? 'Rút tiền về ngân hàng' : 'Request bank withdrawal'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7-TAB NAVIGATION BAR (CORE OF SELLER SPECIFICATION)                       */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-200 pb-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0" aria-label="Seller sections">
          
          {/* TAB 1: Quản lý sản phẩm */}
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            aria-pressed={activeTab === 'products'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>{isVi ? '1. Quản Lý Sản Phẩm' : '1. Product Catalog'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'products' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {products.length}
            </span>
          </button>

          {/* TAB 2: Quản lý kho */}
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            aria-pressed={activeTab === 'inventory'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isVi ? '2. Quản Lý Kho' : '2. Inventory & Stock'}</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* TAB 3: Quản lý đơn hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            aria-pressed={activeTab === 'orders'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isVi ? '3. Quản Lý Đơn Hàng' : '3. Orders Processing'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'orders' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {orders.length}
            </span>
          </button>

          {/* TAB 4: Trả lời Q&A */}
          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            aria-pressed={activeTab === 'qa'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'qa'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{isVi ? '4. Trả Lời Q&A' : '4. Q&A & Reviews'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'qa' ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {reviewsList.length}
            </span>
          </button>

          {/* TAB 5: Chat với khách hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            aria-pressed={activeTab === 'chat'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isVi ? '5. Chat Khách Hàng' : '5. Customer CRM'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>

          {/* TAB 6: Xem doanh thu */}
          <button
            type="button"
            onClick={() => setActiveTab('revenue')}
            aria-pressed={activeTab === 'revenue'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isVi ? '6. Xem Doanh Thu' : '6. Revenue Analytics'}</span>
          </button>

          {/* TAB 7: Tạo voucher */}
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            aria-pressed={activeTab === 'vouchers'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vouchers'
                ? 'bg-sky-100 text-sky-900 shadow-sm ring-1 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>{isVi ? '7. Tạo Voucher' : '7. Shop Vouchers'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'vouchers' ? 'bg-white text-sky-800' : 'bg-sky-50 text-sky-700'
            }`}>
              {vouchersList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT)                          */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SCREEN 1: QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT)                          */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (() => {
        const filteredProducts = products.filter((p) => {
          const matchSearch =
            p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            p.id.toLowerCase().includes(searchKeyword.toLowerCase());
          const matchCat =
            productCategoryFilter === 'all' ||
            p.category.toLowerCase().includes(productCategoryFilter.toLowerCase());
          return matchSearch && matchCat;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-sky-50/50 border border-sky-100">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder={isVi ? 'Tìm kiếm theo tên sản phẩm, SKU...' : 'Search products by name, SKU...'}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <OceanSelect
                  value={productCategoryFilter}
                  onChange={(val) => setProductCategoryFilter(val)}
                  variant="rounded"
                  size="sm"
                  options={[
                    { value: 'all', label: isVi ? 'Tất Cả Danh Mục' : 'All Categories' },
                    { value: 'Running', label: isVi ? 'Giày Chạy Bộ (Running)' : 'Running Shoes' },
                    { value: 'Lifestyle', label: isVi ? 'Phong Cách (Lifestyle)' : 'Lifestyle & Casual' },
                    { value: 'Basketball', label: isVi ? 'Bóng Rổ (Basketball)' : 'Basketball' },
                    { value: 'Streetwear', label: 'Streetwear' },
                  ]}
                />
              </div>

              <button
                type="button"
                onClick={() => router.push('/seller/products/new')}
                className="btn-ocean-primary px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'Thêm Sản Phẩm Mới' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Product Table View */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 text-slate-500 font-mono font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-3.5 px-4 min-w-[260px]">{isVi ? 'Sản Phẩm' : 'Product'}</th>
                      <th className="py-3.5 px-4 min-w-[130px]">{isVi ? 'Danh Mục' : 'Category'}</th>
                      <th className="py-3.5 px-4 text-right min-w-[120px]">{isVi ? 'Giá Gốc' : 'List Price'}</th>
                      <th className="py-3.5 px-4 text-right min-w-[130px]">{isVi ? 'Giá Flash Sale' : 'Sale Price'}</th>
                      <th className="py-3.5 px-4 text-center min-w-[110px]">{isVi ? 'Tồn Kho' : 'Stock'}</th>
                      <th className="py-3.5 px-4 text-center min-w-[90px]">{isVi ? 'Đã Bán' : 'Sold'}</th>
                      <th className="py-3.5 px-4 text-center min-w-[120px]">{isVi ? 'Trạng Thái' : 'Status'}</th>
                      <th className="py-3.5 px-4 text-center min-w-[110px]">{isVi ? 'Thao Tác' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                              <Boxes className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-800">
                              {isVi ? 'Không tìm thấy sản phẩm phù hợp' : 'No matching products found'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {isVi ? 'Thử thay đổi từ khóa hoặc bộ lọc danh mục' : 'Try adjusting your search or category filter'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const isHidden = hiddenProductIds.includes(prod.id);
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 truncate max-w-[200px]" title={prod.name}>
                                    {prod.name}
                                  </p>
                                  <span className="text-[10px] text-slate-400 font-mono tracking-tight">SKU: {prod.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs whitespace-nowrap">
                                {prod.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400 line-through whitespace-nowrap">
                              {prod.originalPrice.toLocaleString('vi-VN')}₫
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-sky-600 whitespace-nowrap">
                              {prod.flashPrice.toLocaleString('vi-VN')}₫
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono tabular-nums whitespace-nowrap ${
                                  prod.stock < 15
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {prod.stock < 15 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                <span>{prod.stock} {isVi ? 'sp' : 'items'}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-slate-700 whitespace-nowrap">
                              {prod.salesCount}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  isHidden
                                    ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isHidden ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                                <span>{isHidden ? (isVi ? 'Tạm Ẩn' : 'Hidden') : (isVi ? 'Đang Bán' : 'Active')}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductVisibility(prod.id)}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                    isHidden
                                      ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                  }`}
                                  title={isHidden ? (isVi ? 'Hiển thị lại sản phẩm' : 'Unhide product') : (isVi ? 'Tạm ẩn sản phẩm' : 'Hide product')}
                                >
                                  {isHidden ? <Eye className="w-3.5 h-3.5 text-sky-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRestockProduct(prod);
                                    setShowRestockModal(true);
                                  }}
                                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer"
                                  title={isVi ? 'Nhập thêm kho' : 'Restock inventory'}
                                >
                                  <Package className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2 font-mono">
                  <span>
                    {isVi
                      ? `Hiển thị ${filteredProducts.length} trên tổng số ${products.length} sản phẩm`
                      : `Showing ${filteredProducts.length} of ${products.length} products`}
                  </span>
                  {hiddenProductIds.length > 0 && (
                    <span className="text-slate-400">
                      • {hiddenProductIds.length} {isVi ? 'sản phẩm tạm ẩn' : 'hidden'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isVi ? 'Đang hoạt động' : 'Active'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{isVi ? 'Sắp hết hàng (<15 sp)' : 'Low stock (<15)'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 2: QUẢN LÝ KHO (INVENTORY & RESTOCK MANAGEMENT)                     */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (() => {
        const filteredInventory = products.filter((p) => {
          const matchSearch =
            p.name.toLowerCase().includes(stockSearchKeyword.toLowerCase()) ||
            p.id.toLowerCase().includes(stockSearchKeyword.toLowerCase());
          const matchLow = !stockFilterLowOnly || p.stock < 15;
          return matchSearch && matchLow;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {isVi ? 'Tổng Giá Trị Tồn Kho' : 'Total Inventory Valuation'}
                </span>
                <p className="text-2xl font-black text-slate-900 tabular-nums">
                  {totalStockValue.toLocaleString('vi-VN')}₫
                </p>
                <span className="text-xs text-slate-500">
                  {isVi ? 'Định giá theo giá bán niêm yết' : 'Calculated at catalog MSRP'}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600">
                  {isVi ? 'Cảnh Báo Hàng Sắp Hết (<15 sp)' : 'Low Stock Alerts (<15 items)'}
                </span>
                <p className="text-2xl font-black text-amber-600 tabular-nums">
                  {lowStockCount} {isVi ? 'Mã Hàng' : 'SKUs'}
                </p>
                <span className="text-xs text-amber-700">
                  {isVi ? 'Cần tạo phiếu nhập bổ sung' : 'Requires restock PO requisition'}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600">
                  {isVi ? 'Tỷ Lệ Sẵn Sàng Giao (In-Stock)' : 'Fulfillment Readiness'}
                </span>
                <p className="text-2xl font-black text-emerald-600 tabular-nums">96.8%</p>
                <span className="text-xs text-emerald-700">
                  {isVi ? 'Đạt chuẩn Flagship Mall' : 'Exceeds Flagship SLA standard'}
                </span>
              </div>
            </div>

            {/* Warehouse Shelf Control Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={stockSearchKeyword}
                    onChange={(e) => setStockSearchKeyword(e.target.value)}
                    placeholder={isVi ? 'Lọc SKU hoặc tên sản phẩm...' : 'Filter by SKU or product name...'}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs w-60 focus:outline-none focus:border-sky-500"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stockFilterLowOnly}
                      onChange={(e) => setStockFilterLowOnly(e.target.checked)}
                      className="rounded text-sky-600 cursor-pointer"
                    />
                    <span>{isVi ? 'Chỉ hiện hàng sắp hết (<15 sp)' : 'Show low stock only (<15 items)'}</span>
                  </label>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {isVi ? 'Kho: TerraSweep Central Hub Q.7' : 'Hub: TerraSweep Central Hub Dist. 7'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 text-slate-500 font-mono font-bold text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-3 px-4 min-w-[120px]">{isVi ? 'Mã SKU' : 'SKU'}</th>
                      <th className="py-3 px-4 min-w-[240px]">{isVi ? 'Tên Sản Phẩm' : 'Product Name'}</th>
                      <th className="py-3 px-4 min-w-[150px]">{isVi ? 'Vị Trí Kệ Kho' : 'Warehouse Bay'}</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">{isVi ? 'Tồn Hiện Tại' : 'On-Hand Stock'}</th>
                      <th className="py-3 px-4 text-center min-w-[130px]">{isVi ? 'Điều Chỉnh Nhanh' : 'Quick Adjust'}</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">{isVi ? 'Thao Tác' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                            <Package className="w-7 h-7 text-slate-300" />
                            <p className="text-xs font-semibold">
                              {isVi ? 'Không có sản phẩm nào khớp bộ lọc kho' : 'No inventory items match the current filter'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((prod, i) => (
                        <tr key={prod.id} className="hover:bg-slate-50/75 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-600 whitespace-nowrap">{prod.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="max-w-[240px] truncate" title={prod.name}>
                              {prod.name}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] whitespace-nowrap">
                              {isVi ? `Kệ A-${String(i + 1).padStart(2, '0')} (Tầng 2)` : `Bay A-${String(i + 1).padStart(2, '0')} (Level 2)`}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono tabular-nums whitespace-nowrap ${
                                prod.stock < 15 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {prod.stock < 15 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                              <span>{prod.stock} {isVi ? 'sp' : 'items'}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleUpdateStockClick(prod.id, Math.max(0, prod.stock - 1))}
                                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 font-mono text-center font-bold text-slate-900 tabular-nums">{prod.stock}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateStockClick(prod.id, prod.stock + 1)}
                                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setRestockProduct(prod);
                                setShowRestockModal(true);
                              }}
                              className="btn-ocean-primary px-3.5 py-1.5 rounded-full text-xs font-bold text-white cursor-pointer whitespace-nowrap flex items-center gap-1.5 mx-auto"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>{isVi ? 'Nhập Thêm' : 'Restock'}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 3: QUẢN LÝ ĐƠN HÀNG (ORDER PROCESSING)                             */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (() => {
        const filteredOrders = orders.filter((o) => orderStatusFilter === 'all' || o.status === orderStatusFilter);

        const statusTabs = [
          { key: 'all', label: isVi ? 'Tất Cả' : 'All', count: orders.length },
          { key: 'pending', label: isVi ? 'Chờ Xác Nhận' : 'Pending', count: orders.filter((o) => o.status === 'pending').length },
          { key: 'confirmed', label: isVi ? 'Đang Chuẩn Bị' : 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length },
          { key: 'shipping', label: isVi ? 'Đang Đi Giao' : 'Shipping', count: orders.filter((o) => o.status === 'shipping').length },
          { key: 'delivered', label: isVi ? 'Đã Giao Xong' : 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
          { key: 'failed', label: isVi ? 'Giao Thất Bại' : 'Failed', count: orders.filter((o) => o.status === 'failed').length },
          { key: 'cancelled', label: isVi ? 'Đã Hủy' : 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
        ];

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
              {statusTabs.map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setOrderStatusFilter(st.key as any)}
                  className={`px-4 py-2 rounded-2xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                    orderStatusFilter === st.key
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                      : 'bg-white text-slate-600 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <span>{st.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
                      orderStatusFilter === st.key ? 'bg-white text-sky-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-2xs">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">
                    {isVi ? 'Không có đơn hàng nào trong trạng thái này' : 'No orders in this status category'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isVi ? 'Các đơn hàng mới sẽ xuất hiện tại đây khi khách hàng đặt mua' : 'New orders will automatically appear here'}
                  </p>
                </div>
              ) : (
                filteredOrders.map((order, orderIdx) => (
                  <div
                    key={order.id}
                    style={{ animationDelay: `${Math.min(orderIdx * 50, 300)}ms` }}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-all space-y-4 animate-card-entrance"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-black text-sky-600 tabular-nums">#{order.id}</span>
                          <span className="text-xs text-slate-400 font-mono tabular-nums">• {order.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {isVi ? 'Khách hàng:' : 'Customer:'}{' '}
                          <strong className="text-slate-800">{order.customerName}</strong> • <span className="font-mono tabular-nums">{order.customerPhone}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200 font-mono tabular-nums tracking-wider">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={it.product.image}
                              alt={it.product.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{it.product.name}</p>
                              <span className="text-slate-500 text-[11px]">
                                {isVi ? 'Số lượng:' : 'Qty:'} {it.quantity} • {it.variant || (isVi ? 'Mặc định' : 'Default')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 sm:text-right text-xs">
                        <p className="text-slate-500">
                          {isVi ? 'Địa chỉ nhận:' : 'Delivery to:'}{' '}
                          <span className="font-medium text-slate-800">{order.shippingAddress}</span>
                        </p>
                        <p className="text-slate-500">
                          {isVi ? 'Thanh toán:' : 'Payment:'}{' '}
                          <strong className="text-slate-800">{order.paymentMethod}</strong>
                        </p>
                        <p className="text-sm font-black text-slate-900 font-mono tabular-nums pt-1">
                          {isVi ? 'Tổng thanh toán:' : 'Order Total:'}{' '}
                          <span className="text-sky-600 font-mono tabular-nums">{order.total.toLocaleString('vi-VN')}₫</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedSlipOrder(order)}
                        className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isVi ? 'In Phiếu Đóng Gói & Tem Vận Chuyển' : 'Print Packing Slip & Label'}</span>
                      </button>

                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmOrder(order.id)}
                          disabled={confirmingOrderId === order.id}
                          className="btn-ocean-primary px-5 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {confirmingOrderId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isVi ? 'Xác Nhận Đơn Này' : 'Confirm & Pack'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 4: TRẢ LỜI Q&A & ĐÁNH GIÁ (CUSTOMER REVIEWS & Q&A)                  */}
      {/* ========================================================================= */}
      {activeTab === 'qa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>{isVi ? 'Trung Tâm Quản Lý Nhận Xét & Trả Lời Khách Hàng (Q&A)' : 'Customer Reviews & Q&A Center'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isVi ? 'Điểm uy tín gian hàng:' : 'Store Reputation Score:'}{' '}
                <strong className="text-slate-800">4.9★ / 5.0★</strong> •{' '}
                {isVi ? '98.4% khách hàng đánh giá hài lòng' : '98.4% Customer Satisfaction Rate'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">{isVi ? 'Lọc theo sao:' : 'Rating:'}</span>
              {[5, 4, 3, 2, 1].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setReviewRatingFilter(reviewRatingFilter === st ? 'all' : st)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    reviewRatingFilter === st
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}★
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-5">
            {reviewsList
              .filter((r) => reviewRatingFilter === 'all' || r.rating === reviewRatingFilter)
              .map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs">{rev.userName}</p>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            {isVi ? 'Đã Mua Hàng' : 'Verified Buyer'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                          <span>• {rev.createdAt}</span>
                          <span>• {rev.variantText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.content}</p>

                  {/* Attached images */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-2">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Feedback"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  )}

                  {/* Existing Seller Response */}
                  {rev.sellerResponse ? (
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1 text-xs text-sky-950">
                      <p className="font-bold text-sky-900 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-sky-600" />
                        <span>{isVi ? 'Phản hồi chính thức của TerraSweep Flagship:' : 'Official Response from TerraSweep Flagship:'}</span>
                      </p>
                      <p className="text-slate-700 text-[11px] leading-relaxed">{rev.sellerResponse.content}</p>
                    </div>
                  ) : (
                    /* Seller Reply Box */
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        {isVi ? 'Phản hồi cho khách hàng này:' : 'Reply to customer review:'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInputText[rev.id] || ''}
                          onChange={(e) =>
                            setReplyInputText({ ...replyInputText, [rev.id]: e.target.value })
                          }
                          placeholder={isVi ? 'Dạ cảm ơn quý khách đã tin tưởng ủng hộ shop ạ...' : 'Thank you for your feedback...'}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleReplyReview(rev.id)}
                          className="btn-ocean-primary px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap"
                        >
                          {isVi ? 'Gửi Phản Hồi' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: CHAT VỚI KHÁCH HÀNG (CUSTOMER LIVE CHAT & CRM)                  */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden h-[620px] flex flex-col md:flex-row animate-in fade-in duration-200">
          
          {/* Col 1: Conversations List */}
          <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {isVi ? 'Hộp Thư Khách Hàng' : 'Customer Inbox'}
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isVi ? 'Tìm khách hàng...' : 'Search customers...'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-white'
                    }`}
                  >
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{conv.customerName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{conv.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2: Active Chat Messages */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentConversation?.customerAvatar}
                  alt="Customer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{currentConversation?.customerName}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isVi ? 'Đang trực tuyến' : 'Online now'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chat message bubbles */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background/50">
              {currentConversation?.messages.map((m) => {
                const isSeller = m.sender === 'seller';
                return (
                  <div
                    key={m.id}
                    className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        isSeller
                          ? 'bg-sky-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className={`text-[9px] block text-right font-mono ${isSeller ? 'text-sky-200' : 'text-slate-400'}`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick response suggestions */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
              {[
                isVi ? 'Dạ size 42 bên em còn sẵn hàng nha!' : 'Size 42 is currently available in stock!',
                isVi ? 'Đơn từ 300k được áp mã FREESHIPMAX ạ!' : 'Orders from 300k get FREESHIPMAX applied!',
                isVi ? 'Dạ shop gửi hàng ngay trong hôm nay nhé!' : 'We will dispatch your order today!',
              ].map((txt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setChatMessageInput(txt)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-sky-600 whitespace-nowrap cursor-pointer hover:border-sky-300"
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                placeholder={isVi ? 'Nhập tin nhắn tư vấn khách hàng...' : 'Type a message to customer...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="btn-ocean-primary p-2.5 rounded-xl text-white cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Col 3: Customer Context */}
          <div className="hidden lg:block w-72 border-l border-slate-200 p-4 space-y-4 bg-slate-50/30">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isVi ? 'Thông Tin Ngữ Cảnh' : 'Customer Context'}
            </h4>

            {currentConversation?.productContext && (
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  {isVi ? 'Sản Phẩm Đang Xem' : 'Currently Viewing'}
                </span>
                <img
                  src={currentConversation.productContext.image}
                  alt="Product"
                  className="w-full h-28 object-cover rounded-xl"
                />
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{currentConversation.productContext.name}</p>
                <p className="text-xs font-black text-sky-600 font-mono">
                  {currentConversation.productContext.price.toLocaleString('vi-VN')}₫
                </p>
              </div>
            )}

            {currentConversation?.orderContext && (
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  {isVi ? 'Đơn Hàng Gần Nhất' : 'Recent Order'}
                </span>
                <p className="font-mono font-bold text-sky-600">#{currentConversation.orderContext.id}</p>
                <p className="text-slate-600 font-mono">
                  {isVi ? 'Tổng:' : 'Total:'} {currentConversation.orderContext.total.toLocaleString('vi-VN')}₫
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: XEM DOANH THU (FINANCIAL ANALYTICS & P&L DASHBOARD)              */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SCREEN 6: XEM DOANH THU (FINANCIAL ANALYTICS & P&L DASHBOARD)              */}
      {/* ========================================================================= */}
      {activeTab === 'revenue' && (() => {
        const revenueChartData = [
          { dayVi: 'T2 (12/9)', dayEn: 'Mon (12/9)', val: 14200000, orders: 14, barHeight: '46.7%', x: 50, y: 107 },
          { dayVi: 'T3 (13/9)', dayEn: 'Tue (13/9)', val: 18500000, orders: 19, barHeight: '63.3%', x: 150, y: 83 },
          { dayVi: 'T4 (14/9)', dayEn: 'Wed (14/9)', val: 16800000, orders: 16, barHeight: '53.3%', x: 250, y: 93 },
          { dayVi: 'T5 (15/9)', dayEn: 'Thu (15/9)', val: 24500000, orders: 22, barHeight: '73.3%', x: 350, y: 50 },
          { dayVi: 'T6 (16/9)', dayEn: 'Fri (16/9)', val: 21200000, orders: 20, barHeight: '66.7%', x: 450, y: 68 },
          { dayVi: 'T7 (17/9)', dayEn: 'Sat (17/9)', val: 28900000, orders: 26, barHeight: '86.7%', x: 550, y: 26, isPeak: true },
          { dayVi: 'CN (Hôm nay)', dayEn: 'Sun (Today)', val: 19800000, orders: 18, barHeight: '60.0%', x: 650, y: 76 },
        ];

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Executive Atmospheric Ocean Balance Card */}
            <div className="relative overflow-hidden rounded-3xl ocean-feature p-7 sm:p-9 border border-sky-500/20">
              {/* Subtle background matrix texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-400/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isVi ? 'VÍ DOANH THU ĐỐI SOÁT SELLER' : 'MERCHANT CLEARANCE WALLET'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-sky-700 font-medium block">
                      {isVi ? 'Số Dư Khả Dụng Để Rút:' : 'Available Balance for Payout:'}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-mono tabular-nums text-sky-900 mt-1">
                      {availableBalance.toLocaleString('vi-VN')}₫
                    </h2>
                  </div>

                  <p className="text-xs text-sky-700 leading-relaxed">
                    {isVi
                      ? 'Doanh thu bán hàng ròng đã đối soát sau chiết khấu • Miễn phí rút tiền 24/7 về mọi ngân hàng nội địa (Chu kỳ đối soát T+1)'
                      : 'Net settled merchant sales after platform commission • Free 24/7 withdrawals to domestic banks (T+1 Auto-Clearance)'}
                  </p>

                  {/* 3 Balance Breakdown Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="px-3.5 py-1.5 rounded-xl bg-white/70 border border-sky-200 text-xs">
                      <span className="text-sky-700 text-[10px] block font-mono">
                        {isVi ? 'Chờ đối soát:' : 'Pending clearance:'}
                      </span>
                      <strong className="font-mono font-bold text-slate-900 tabular-nums">8.450.000₫</strong>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-white/70 border border-sky-200 text-xs">
                      <span className="text-emerald-700 text-[10px] block font-mono">
                        {isVi ? 'Đã rút thành công:' : 'Lifetime withdrawn:'}
                      </span>
                      <strong className="font-mono font-bold text-emerald-700 tabular-nums">
                        {(withdrawnTotal + 84360000).toLocaleString('vi-VN')}₫
                      </strong>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-white/70 border border-sky-200 text-xs">
                      <span className="text-sky-700 text-[10px] block font-mono">
                        {isVi ? 'Chu kỳ quyết toán:' : 'Settlement SLA:'}
                      </span>
                      <strong className="font-mono font-bold text-sky-700">T+1 Fast-Pay</strong>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="btn-ocean-primary px-6 py-3.5 rounded-2xl text-xs font-bold text-white shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isVi ? 'Yêu Cầu Rút Tiền Về Ngân Hàng' : 'Request Bank Withdrawal'}</span>
                    <ArrowUpRight className="w-4 h-4 text-sky-700" />
                  </button>

                  <span className="text-[11px] text-sky-700 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isVi ? 'Bảo mật PCI-DSS cấp 1' : 'PCI-DSS Tier 1 Encrypted'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* High-Precision Interactive 7-Day Revenue & Orders Combo Chart */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100/90 shadow-sm space-y-6">
              {/* Chart Header with Dual-Metric Legend */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-sky-600" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {isVi ? 'Biểu Đồ Kết Hợp Doanh Thu & Đơn Hàng (Combo Analytics)' : 'Revenue & Order Volume Combo Analytics'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isVi
                      ? 'Đường biểu diễn GMV Doanh thu thuần (₫) kết hợp cột thanh mảnh số lượng đơn hoàn tất (Đơn) 7 ngày qua'
                      : 'Dual-axis visual: Net GMV trendline coupled with slender bars for daily fulfilled order volume'}
                  </p>
                </div>

                {/* Dual Legend & Performance Chips */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {/* Line Legend */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 text-xs font-semibold shadow-2xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white shadow-xs" />
                      <span className="w-3.5 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" />
                    </span>
                    <span>{isVi ? 'Doanh Thu (Line)' : 'Revenue (Line)'}</span>
                  </div>

                  {/* Bar Legend */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold shadow-2xs">
                    <span className="w-2.5 h-3.5 rounded-sm bg-gradient-to-t from-sky-400 to-cyan-300 shadow-2xs" />
                    <span>{isVi ? 'Số Đơn Hàng (Bar)' : 'Order Volume (Bar)'}</span>
                  </div>

                  {/* Performance growth badge */}
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+18.5% {isVi ? 'Doanh thu' : 'GMV'}</span>
                  </span>
                </div>
              </div>

              {/* Combo Chart Visualization Area with Dual Y-Axes */}
              <div className="relative pt-4 select-none">
                {/* Dual Y-Axes Scale Labels */}
                {/* Left Y-Axis: Revenue (GMV) */}
                <div className="absolute left-0 top-4 bottom-14 flex flex-col justify-between text-[10px] font-mono font-semibold text-sky-700 pointer-events-none text-right w-9 z-20">
                  <span>30M</span>
                  <span>20M</span>
                  <span>10M</span>
                  <span>0M</span>
                </div>

                {/* Right Y-Axis: Order Volume */}
                <div className="absolute right-0 top-4 bottom-14 flex flex-col justify-between text-[10px] font-mono font-semibold text-slate-400 pointer-events-none text-left w-10 z-20">
                  <span>30 đơn</span>
                  <span>20 đơn</span>
                  <span>10 đơn</span>
                  <span>0 đơn</span>
                </div>

                {/* Central Plot Container */}
                <div className="relative h-64 mx-11 sm:mx-13">
                  {/* Horizontal Reference Guide Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-dashed border-slate-200/80 w-full" />
                    <div className="border-b border-dashed border-slate-200/80 w-full" />
                    <div className="border-b border-dashed border-slate-200/80 w-full" />
                    <div className="border-b border-slate-200 w-full" />
                  </div>

                  {/* SVG Spline Curve & Glowing Area Overlay (Layer 2) */}
                  <svg
                    viewBox="0 0 700 200"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                  >
                    <defs>
                      {/* Area Gradient Fill */}
                      <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
                        <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.00" />
                      </linearGradient>

                      {/* Stroke Line Gradient */}
                      <linearGradient id="revenueLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="40%" stopColor="#0ea5e9" />
                        <stop offset="80%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>

                      {/* Line Glow Filter */}
                      <filter id="revenueLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    {/* Area under the spline curve */}
                    <path
                      d="M 50 185 L 50 107 C 92 107, 108 83, 150 83 C 192 83, 208 93, 250 93 C 292 93, 308 50, 350 50 C 392 50, 408 68, 450 68 C 492 68, 508 26, 550 26 C 592 26, 608 76, 650 76 L 650 185 Z"
                      fill="url(#revenueAreaGrad)"
                    />

                    {/* Spline Path Line */}
                    <path
                      d="M 50 107 C 92 107, 108 83, 150 83 C 192 83, 208 93, 250 93 C 292 93, 308 50, 350 50 C 392 50, 408 68, 450 68 C 492 68, 508 26, 550 26 C 592 26, 608 76, 650 76"
                      fill="none"
                      stroke="url(#revenueLineGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#revenueLineGlow)"
                    />

                    {/* Circular Data Nodes on Spline */}
                    {revenueChartData.map((pt, idx) => {
                      const isHovered = hoveredChartIndex === idx;
                      return (
                        <g key={idx}>
                          {/* Pulsating Halo for Saturday Peak Day */}
                          {pt.isPeak && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="10"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              opacity="0.6"
                              className="animate-ping"
                            />
                          )}

                          {/* Outer ring */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 7.5 : pt.isPeak ? 6 : 4.5}
                            fill={pt.isPeak ? '#f59e0b' : '#ffffff'}
                            stroke={pt.isPeak ? '#b45309' : '#0284c7'}
                            strokeWidth={isHovered ? 3.5 : 2.5}
                            className="transition-all duration-200 drop-shadow-sm"
                          />

                          {/* Inner core */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 3 : 2}
                            fill={pt.isPeak ? '#ffffff' : '#0ea5e9'}
                            className="transition-all duration-200"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* 7 Columns Grid: Slender Bars + Interactive Trigger Zones (Layer 1 & 3) */}
                  <div className="grid grid-cols-7 h-full relative z-0">
                    {revenueChartData.map((item, i) => {
                      const isHovered = hoveredChartIndex === i;
                      const aov = Math.round(item.val / item.orders);

                      return (
                        <div
                          key={i}
                          className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                          onMouseEnter={() => setHoveredChartIndex(i)}
                          onMouseLeave={() => setHoveredChartIndex(null)}
                        >
                          {/* Peak day badge */}
                          {item.isPeak && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[9px] shadow-sm whitespace-nowrap flex items-center gap-1 z-30 animate-bounce">
                              <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                              <span>{isVi ? 'Kỷ Lục' : 'Peak'}</span>
                            </div>
                          )}

                          {/* Vertical Dashed Guide Crosshair on Hover */}
                          {isHovered && (
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0 border-l border-dashed border-sky-400/80 pointer-events-none z-15" />
                          )}

                          {/* Interactive Frosted-Glass Floating Tooltip */}
                          {isHovered && (
                            <div
                              className={`absolute -top-20 z-40 px-3.5 py-2.5 rounded-2xl bg-slate-950/95 text-white text-[11px] shadow-2xl backdrop-blur-md border border-sky-400/40 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${
                                i === 0
                                  ? 'left-0 translate-x-0'
                                  : i === 6
                                  ? 'right-0 translate-x-0 left-auto'
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            >
                              {/* Tooltip Day Title */}
                              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5 mb-1.5">
                                <span className="font-bold text-sky-300 flex items-center gap-1">
                                  {isVi ? item.dayVi : item.dayEn}
                                </span>
                                {item.isPeak && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    ✦ {isVi ? 'Đỉnh tuần' : 'Week Peak'}
                                  </span>
                                )}
                              </div>

                              {/* Tooltip Metrics */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                                    <span>{isVi ? 'Doanh thu thuần:' : 'Net GMV:'}</span>
                                  </span>
                                  <strong className="font-mono font-bold text-white tabular-nums">
                                    {item.val.toLocaleString('vi-VN')}₫
                                  </strong>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
                                    <span>{isVi ? 'Số đơn hoàn tất:' : 'Orders:'}</span>
                                  </span>
                                  <strong className="font-mono font-bold text-cyan-200 tabular-nums">
                                    {item.orders} {isVi ? 'đơn' : 'orders'}
                                  </strong>
                                </div>

                                <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10 text-[10px]">
                                  <span className="text-slate-400">{isVi ? 'Giá trị TB/đơn (AOV):' : 'Avg Order Value:'}</span>
                                  <strong className="font-mono text-emerald-300 tabular-nums">
                                    {aov.toLocaleString('vi-VN')}₫
                                  </strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Slender Capsule Bar Container (Reduced from fat rectangle to slender pill) */}
                          <div className="h-[88%] w-3 sm:w-3.5 md:w-4 rounded-full bg-slate-100/70 p-0.5 flex flex-col justify-end transition-all duration-300 group-hover:bg-sky-50 group-hover:shadow-xs">
                            <div
                              className={`w-full rounded-full transition-all duration-500 ${
                                item.isPeak
                                  ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 shadow-sm shadow-amber-400/30'
                                  : isHovered
                                  ? 'bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 shadow-md shadow-sky-500/30 scale-y-[1.02] origin-bottom'
                                  : 'bg-gradient-to-t from-sky-400/80 via-sky-300/80 to-cyan-200/80 group-hover:from-sky-500 group-hover:to-cyan-300'
                              }`}
                              style={{ height: item.barHeight }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-Axis Date & Dual-Value Labels */}
                <div className="grid grid-cols-7 mx-11 sm:mx-13 pt-3">
                  {revenueChartData.map((item, i) => {
                    const isHovered = hoveredChartIndex === i;
                    return (
                      <div key={i} className="text-center space-y-0.5">
                        <span
                          className={`text-[10px] sm:text-xs font-bold block transition-colors ${
                            item.isPeak
                              ? 'text-amber-600'
                              : isHovered
                              ? 'text-sky-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {isVi ? item.dayVi : item.dayEn}
                        </span>

                        {/* Revenue value (Line representation) */}
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-sky-600 tabular-nums block">
                          {(item.val / 1000000).toFixed(1)}M
                        </span>

                        {/* Orders count (Bar representation) */}
                        <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 tabular-nums block">
                          {item.orders} {isVi ? 'đơn' : 'ord'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Summary KPI Cards below chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100/70 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {isVi ? 'Tổng Doanh Thu 7 Ngày' : '7-Day Gross Volume'}
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono tabular-nums">143.900.000₫</p>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.5% {isVi ? 'so với chu kỳ trước' : 'vs previous cycle'}</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100/70 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {isVi ? 'Trung Bình Mỗi Ngày' : 'Daily Average GMV'}
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono tabular-nums">20.557.000₫</p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isVi ? 'Đạt 137% chỉ tiêu tuần' : '137% of weekly benchmark'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100/70 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {isVi ? 'Đơn Đã Giao Hoàn Tất' : 'Fulfilled Orders'}
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono tabular-nums">135 {isVi ? 'đơn' : 'orders'}</p>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isVi ? 'Tỷ lệ thành công 98.4%' : '98.4% Fulfillment SLA'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 7: TẠO VOUCHER (MARKETING & PROMOTIONS)                             */}
      {/* ========================================================================= */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-sky-50/50 border border-sky-100">
            <div>
              <h2 className="text-base font-black text-sky-950 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-sky-600" />
                <span>{isVi ? 'Quản Lý Mã Giảm Giá & Chiến Dịch Voucher Gian Hàng' : 'Shop Vouchers & Promotion Campaigns'}</span>
              </h2>
              <p className="text-xs text-sky-800 mt-0.5">
                {isVi
                  ? 'Kích cầu doanh số bằng các mã ưu đãi độc quyền của shop (Giảm phần trăm, giảm tiền mặt hoặc Freeship).'
                  : 'Boost conversion with store-exclusive promo codes (Percentage, Fixed amount, or Free shipping).'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddVoucherModal(true)}
              className="btn-ocean-primary px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isVi ? 'Tạo Voucher Mới' : 'Create New Voucher'}</span>
            </button>
          </div>

          {/* Vouchers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vouchersList.map((v) => {
              const isExpired = v.status === 'expired';
              return (
                <div
                  key={v.id}
                  className={`p-6 rounded-3xl bg-white border relative overflow-hidden transition-all space-y-4 ${
                    isExpired ? 'border-slate-200 opacity-60' : 'border-sky-100 shadow-2xs hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-mono font-black text-sm tracking-wider">
                        {v.code}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isExpired
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isExpired ? (isVi ? 'Đã Hết Hạn' : 'Expired') : (isVi ? 'Đang Hoạt Động' : 'Active')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">{v.title}</h4>
                    <p className="text-slate-500">
                      {isVi ? 'Đơn tối thiểu:' : 'Min order:'}{' '}
                      <strong className="text-slate-800 font-mono">{v.minOrderValue.toLocaleString('vi-VN')}₫</strong>
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {isVi ? 'Hiệu lực:' : 'Valid:'} {v.startDate} ➔ {v.endDate}
                    </p>
                  </div>

                  {/* Usage Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold font-mono">
                      <span>
                        {isVi
                          ? `Đã sử dụng: ${v.usedCount}/${v.maxUsage} lượt`
                          : `Redeemed: ${v.usedCount}/${v.maxUsage} uses`}
                      </span>
                      <span>{Math.round((v.usedCount / v.maxUsage) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${Math.min(100, (v.usedCount / v.maxUsage) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESTOCK INBOUND MODAL                                            */}
      {/* ========================================================================= */}
      {showRestockModal && restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isVi ? 'Tạo Phiếu Nhập Kho Bổ Sung' : 'Create Restock PO'}
              </h3>
              <button
                type="button"
                onClick={() => setShowRestockModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-xs">
              <p className="font-bold text-slate-900">{restockProduct.name}</p>
              <p className="text-slate-500 font-mono mt-0.5">
                {isVi ? `Tồn hiện tại: ${restockProduct.stock} sp` : `Current on-hand: ${restockProduct.stock} items`}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{isVi ? 'Số lượng nhập thêm (sp):' : 'Restock Quantity (items):'}</label>
                <input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{isVi ? 'Nguồn hàng / Nhà cung cấp:' : 'Inbound Origin / Supplier:'}</label>
                <input
                  type="text"
                  value={restockSupplier}
                  onChange={(e) => setRestockSupplier(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRestockModal(false)}
                className="px-4 py-2 rounded-full font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
              >
                {isVi ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRestock}
                className="btn-ocean-primary px-5 py-2 rounded-full font-bold text-white cursor-pointer text-xs"
              >
                {isVi ? 'Xác Nhận Nhập Kho' : 'Confirm Restock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PACKING SLIP & SHIPPING LABEL PRINT PREVIEW                       */}
      {/* ========================================================================= */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {isVi ? 'Phiếu Gửi Hàng & Tem Vận Chuyển' : 'Packing Slip & Shipping Label'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedSlipOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Slip Container */}
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-2xl space-y-3 font-mono text-xs bg-slate-50/50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">TERRASWEEP EXPRESS</span>
                <span className="font-bold text-sky-600">#{selectedSlipOrder.id}</span>
              </div>

              {/* Barcode representation */}
              <div className="text-center py-2 bg-white rounded-xl border border-slate-200">
                <div className="tracking-[6px] font-black text-lg text-slate-900">
                  ||||| |||| || |||||| ||| ||||
                </div>
                <span className="text-[10px] text-slate-500">
                  {isVi ? 'Mã vận đơn:' : 'Tracking Waybill:'} {selectedSlipOrder.id}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-700">
                <p>
                  <strong>{isVi ? 'Người gửi:' : 'Shipper:'}</strong> TerraSweep Flagship Mall (Q.7, TP.HCM)
                </p>
                <p>
                  <strong>{isVi ? 'Người nhận:' : 'Recipient:'}</strong> {selectedSlipOrder.customerName} ({selectedSlipOrder.customerPhone})
                </p>
                <p>
                  <strong>{isVi ? 'Địa chỉ:' : 'Address:'}</strong> {selectedSlipOrder.shippingAddress}
                </p>
                <p>
                  <strong>{isVi ? 'Tiền COD:' : 'COD Amount:'}</strong> {selectedSlipOrder.total.toLocaleString('vi-VN')}₫
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                {isVi ? 'Kiểm tra hàng nguyên đai nguyên kiện trước khi ký nhận.' : 'Inspect sealed box integrity before signing receipt.'}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast(isVi ? 'Đã gửi lệnh in phiếu gửi hàng tới máy in!' : 'Print command dispatched to local printer!');
                }}
                className="w-full btn-ocean-primary py-2.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isVi ? 'In Tem Ngay' : 'Print Shipping Label'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: WITHDRAWAL MODAL                                                 */}
      {/* ========================================================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {isVi ? 'Rút Tiền Về Ngân Hàng' : 'Merchant Bank Withdrawal'}
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700">
                {isVi ? 'Số dư khả dụng để rút:' : 'Available balance to withdraw:'}
              </span>
              <p className="text-xl font-black text-emerald-950 font-mono mt-0.5">
                {availableBalance.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {isVi ? 'Tài khoản nhận tiền:' : 'Beneficiary Account:'}
                </label>
                <OceanSelect
                  value={selectedBank}
                  onChange={(val) => setSelectedBank(val)}
                  variant="rounded"
                  size="md"
                  fullWidth
                  options={[
                    { value: 'Vietcombank (0381000999888 - CN TP.HCM)', label: 'Vietcombank (0381000999888 - CN TP.HCM)' },
                    { value: 'Techcombank (1903884210001 - CN Bến Nghé)', label: 'Techcombank (1903884210001 - CN Bến Nghé)' },
                    { value: 'MB Bank (08888999912 - CN Sài Gòn)', label: 'MB Bank (08888999912 - CN Sài Gòn)' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {isVi ? 'Số tiền muốn rút (₫):' : 'Withdrawal Amount (₫):'}
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmWithdraw}
              disabled={isProcessingWithdraw || Number(withdrawAmount) <= 0}
              className="w-full btn-ocean-primary py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingWithdraw ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{isVi ? 'Xác Nhận Rút Tiền Ngay' : 'Confirm Fast Withdrawal'}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CREATE VOUCHER MODAL                                             */}
      {/* ========================================================================= */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {isVi ? 'Tạo Mã Voucher Khuyến Mãi' : 'Create Shop Promo Voucher'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddVoucherModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {isVi ? 'Mã Voucher (Tự động viết hoa) *' : 'Voucher Code (Uppercase) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newVoucherCode}
                  onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                  placeholder={isVi ? 'Ví dụ: FLASH100K' : 'e.g. FLASH100K'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono font-bold tracking-wider focus:outline-none focus:border-sky-500 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{isVi ? 'Tiêu đề voucher' : 'Voucher Title'}</label>
                <input
                  type="text"
                  value={newVoucherTitle}
                  onChange={(e) => setNewVoucherTitle(e.target.value)}
                  placeholder={isVi ? 'Ví dụ: Giảm 50k cho đơn từ 500k' : 'e.g. 50k off for orders from 500k'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{isVi ? 'Loại ưu đãi' : 'Discount Type'}</label>
                  <OceanSelect
                    value={newVoucherType}
                    onChange={(val) => setNewVoucherType(val as any)}
                    variant="rounded"
                    size="md"
                    fullWidth
                    options={[
                      { value: 'fixed', label: isVi ? 'Giảm số tiền cố định (₫)' : 'Fixed Amount (₫)' },
                      { value: 'percentage', label: isVi ? 'Giảm theo %' : 'Percentage (%)' },
                      { value: 'shipping', label: isVi ? 'Miễn phí ship (Freeship)' : 'Free Shipping' },
                    ]}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{isVi ? 'Mức giảm' : 'Discount Amount'}</label>
                  <input
                    type="number"
                    value={newVoucherValue}
                    onChange={(e) => setNewVoucherValue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{isVi ? 'Đơn hàng tối thiểu (₫)' : 'Minimum Order (₫)'}</label>
                  <input
                    type="number"
                    value={newVoucherMinOrder}
                    onChange={(e) => setNewVoucherMinOrder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{isVi ? 'Giới hạn số lượng mã' : 'Usage Limit'}</label>
                  <input
                    type="number"
                    value={newVoucherUsageLimit}
                    onChange={(e) => setNewVoucherUsageLimit(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoucherModal(false)}
                  className="px-4 py-2 rounded-full font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-ocean-primary px-5 py-2 rounded-full font-bold text-white cursor-pointer"
                >
                  {isVi ? 'Kích Hoạt Voucher' : 'Activate Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
