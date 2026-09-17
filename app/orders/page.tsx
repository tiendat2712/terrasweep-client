'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { OrderTrackingView } from '@/components/buyer/OrderTrackingView';
import { Footer } from '@/components/common/Footer';
import { Order, OrderStatus } from '@/types';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Receipt,
  FileText,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Store,
  Sparkles,
} from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    orders,
    cancelOrder,
    reorder,
    isTrackingOpen,
    setIsTrackingOpen,
    currentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
  } = useCart();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý, không muốn mua nữa');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Status mapping
  const statusTabs = [
    { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All' },
    { id: 'pending', label: language === 'vi' ? 'Chờ duyệt' : 'Pending' },
    { id: 'processing', label: language === 'vi' ? 'Đang chuẩn bị' : 'Processing' },
    { id: 'shipping', label: language === 'vi' ? 'Đang giao' : 'Shipping' },
    { id: 'delivered', label: language === 'vi' ? 'Đã giao' : 'Delivered' },
    { id: 'cancelled', label: language === 'vi' ? 'Đã hủy' : 'Cancelled' },
  ];

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'pending' && order.status !== 'pending') return false;
      if (activeTab === 'processing' && order.status !== 'confirmed' && order.status !== 'picking') return false;
      if (activeTab === 'shipping' && order.status !== 'shipping') return false;
      if (activeTab === 'delivered' && order.status !== 'delivered') return false;
      if (activeTab === 'cancelled' && order.status !== 'cancelled' && order.status !== 'failed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesItem = order.items.some((item) =>
          item.product.name.toLowerCase().includes(q)
        );
        return matchesId || matchesItem;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    cancelOrder(cancelModalOrder.id, cancelReason);
    setCancelModalOrder(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {language === 'vi' ? 'Chờ Shop Xác Nhận' : 'Awaiting Merchant'}
          </span>
        );
      case 'confirmed':
      case 'picking':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            {language === 'vi' ? 'Đang Đóng Gói / Xuất Kho' : 'Processing & Packing'}
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <Truck className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            {language === 'vi' ? 'Đang Giao Hỏa Tốc' : 'Out for Delivery'}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'vi' ? 'Giao Thành Công' : 'Delivered'}
          </span>
        );
      case 'cancelled':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            {language === 'vi' ? 'Đã Hủy Đơn' : 'Cancelled'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* 1. Header */}
      <BuyerHeader
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onSwitchRole={(role) => {
          setActiveRole(role);
          if (role !== 'customer') router.push('/');
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            {language === 'vi' ? 'Trang chủ' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            {language === 'vi' ? 'Đơn mua của tôi' : 'My Orders'}
          </span>
        </nav>

        {/* Page Title & Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {language === 'vi' ? 'Quản Lý Đơn Mua' : 'Order History & Tracking'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'vi'
                ? 'Theo dõi tiến trình vận chuyển, kiểm tra hóa đơn và lịch sử đơn hàng của bạn'
                : 'Monitor shipment progress, inspect invoices, and manage past orders'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm theo mã đơn hoặc tên sản phẩm...' : 'Search by ID or item name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* 3. Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-4 border-b border-slate-200/80 no-scrollbar">
          {statusTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'btn-ocean-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-sky-600 hover:bg-sky-50/60 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. Orders List */}
        <div className="mt-6 space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-sky-100 shadow-2xs max-w-lg mx-auto mt-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto text-sky-600 mb-4 shadow-inner">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'vi' ? 'Không tìm thấy đơn hàng nào' : 'No orders found'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {language === 'vi'
                  ? 'Bạn chưa có đơn hàng nào trong phân loại này hoặc từ khóa tìm kiếm không khớp.'
                  : 'You have no orders matching this filter category or search query.'}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-ocean-primary text-white text-xs font-semibold shadow-sm hover:scale-105 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'vi' ? 'Khám phá sản phẩm ngay' : 'Explore Catalog'}</span>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {order.createdAt}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items List */}
                <div className="divide-y divide-slate-100 px-5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-200/80 bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          {item.variant && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                              {item.variant}
                            </span>
                          )}
                          <span>x{item.quantity}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-mono font-bold text-sky-900 mt-1">
                          {item.price.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Address & Shipper Footnote if any */}
                <div className="px-5 py-3 bg-sky-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="text-slate-500 shrink-0">{language === 'vi' ? 'Giao đến:' : 'Deliver to:'}</span>
                    <span className="font-medium text-slate-800 truncate">{order.shippingAddress}</span>
                  </div>
                  {order.shipperName && (
                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-slate-600 font-medium">
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{order.shipperName}</span>
                    </div>
                  )}
                </div>

                {/* Order Total & Actions Footer */}
                <div className="px-5 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500">{language === 'vi' ? 'Tổng thanh toán:' : 'Total Amount:'}</span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-900">
                      {order.total.toLocaleString('vi-VN')}₫
                    </span>
                    {order.discount > 0 && (
                      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {language === 'vi' ? `Tiết kiệm ${order.discount.toLocaleString('vi-VN')}₫` : `Saved ${order.discount.toLocaleString('vi-VN')}₫`}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap justify-end">
                    {/* View Timeline Tracking Button */}
                    <button
                      onClick={() => {
                        setSelectedTrackingOrder(order);
                        setIsTrackingOpen(true);
                      }}
                      className="px-4 py-2 rounded-full border border-sky-200 text-sky-700 bg-sky-50/50 hover:bg-sky-100/70 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Tra cứu lộ trình' : 'Track Order'}</span>
                    </button>

                    {/* Re-order Button */}
                    <button
                      onClick={() => reorder(order.id)}
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Mua lại' : 'Buy Again'}</span>
                    </button>

                    {/* Cancel Order Button (Only when pending) */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => setCancelModalOrder(order)}
                        className="px-3 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer"
                      >
                        {language === 'vi' ? 'Hủy đơn' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 5. Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-center text-slate-900">
              {language === 'vi' ? 'Xác Nhận Hủy Đơn Hàng' : 'Confirm Order Cancellation'}
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              {language === 'vi'
                ? `Bạn có chắc muốn hủy đơn hàng #${cancelModalOrder.id}? Hành động này không thể hoàn tác.`
                : `Are you sure you want to cancel order #${cancelModalOrder.id}? This action cannot be undone.`}
            </p>

            {/* Cancel Reason Selector */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-slate-700">
                {language === 'vi' ? 'Lý do hủy đơn:' : 'Reason for cancellation:'}
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="Đổi ý, không muốn mua nữa">
                  {language === 'vi' ? 'Đổi ý, không muốn mua nữa' : 'Changed mind, do not want to purchase'}
                </option>
                <option value="Muốn thay đổi địa chỉ nhận hàng">
                  {language === 'vi' ? 'Muốn thay đổi địa chỉ nhận hàng' : 'Want to update shipping address'}
                </option>
                <option value="Tìm thấy giá tốt hơn ở nơi khác">
                  {language === 'vi' ? 'Tìm thấy giá tốt hơn ở nơi khác' : 'Found a better price elsewhere'}
                </option>
                <option value="Thời gian giao hàng dự kiến quá lâu">
                  {language === 'vi' ? 'Thời gian giao hàng dự kiến quá lâu' : 'Estimated delivery time is too slow'}
                </option>
                <option value="Khác">{language === 'vi' ? 'Lý do khác' : 'Other reasons'}</option>
              </select>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Không, giữ lại' : 'Keep Order'}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                {language === 'vi' ? 'Xác nhận hủy' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Order Tracking Drawer / Modal */}
      {isTrackingOpen && (
        <OrderTrackingView
          order={selectedTrackingOrder || orders[0]}
          onClose={() => {
            setIsTrackingOpen(false);
            setSelectedTrackingOrder(null);
          }}
        />
      )}

      {/* 7. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
      />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
