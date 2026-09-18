'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { OceanSelect } from '@/components/common/OceanSelect';
import { AuthModal } from '@/components/common/AuthModal';
import { OrderTrackingView } from '@/components/buyer/OrderTrackingView';
import { Footer } from '@/components/common/Footer';
import { Order, OrderStatus } from '@/types';
import { INITIAL_USERS } from '@/data/mockData';
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
  MessageSquare,
  Loader2,
} from 'lucide-react';

function MyOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('orderId');
  const { language } = useLanguage();
  const {
    cartItems,
    orders,
    cancelOrder,
    reorder,
    currentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    openSellerChat,
  } = useCart();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý, không muốn mua nữa');

  // Status mapping
  const statusTabs = [
    { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All' },
    { id: 'pending', label: language === 'vi' ? 'Chờ duyệt' : 'Pending' },
    { id: 'processing', label: language === 'vi' ? 'Đang chuẩn bị' : 'Processing' },
    { id: 'shipping', label: language === 'vi' ? 'Đang giao' : 'Shipping' },
    { id: 'delivered', label: language === 'vi' ? 'Đã giao' : 'Delivered' },
    { id: 'returned', label: language === 'vi' ? 'Trả hàng / Hoàn tiền' : 'Return & Refund' },
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
      if (activeTab === 'returned' && order.status !== 'returned') return false;
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
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            {language === 'vi' ? 'Đang Hoàn Hàng' : 'Returning'}
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
    <div className="min-h-screen bg-background text-slate-800 flex flex-col antialiased">
      {/* 1. Header */}
      <BuyerHeader
        cartItemCount={cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
        onOpenCart={() => router.push('/cart')}
        onSearch={() => router.push('/#collection-section')}
        searchQuery=""
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onSwitchRole={(role) => {
          setActiveRole(role);
          if (role !== 'customer') router.push('/');
        }}
        onOpenTracking={() => router.push('/orders')}
      />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {queryOrderId ? (
          /* ========================================================================= */
          /* DEDICATED FULL-PAGE ORDER TRACKING VIEW (Prioritize Full Page Navigation)  */
          /* ========================================================================= */
          <div className="animate-in fade-in duration-200">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-sky-600 transition-colors">
                {language === 'vi' ? 'Trang chủ' : 'Home'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/orders" className="hover:text-sky-600 transition-colors">
                {language === 'vi' ? 'Đơn mua của tôi' : 'My Orders'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold font-mono bg-sky-50 text-sky-900 px-2 py-0.5 rounded-md border border-sky-200">
                #{queryOrderId}
              </span>
            </nav>

            {/* Back Button & Navigation Bar */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-sky-100/80">
              <button
                type="button"
                onClick={() => router.push('/orders')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-white hover:bg-sky-50 text-xs font-bold text-sky-900 transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
                <span>{language === 'vi' ? 'Quay lại danh sách đơn hàng' : 'Back to Orders List'}</span>
              </button>

              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-sky-600 font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                <span>{language === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}</span>
              </Link>
            </div>

            {/* Dedicated Full-Page View */}
            <OrderTrackingView
              orders={orders}
              initialOrderId={queryOrderId}
              onClose={() => router.push('/orders')}
            />
          </div>
        ) : (
          /* ========================================================================= */
          /* STANDARD ORDER LIST VIEW                                                 */
          /* ========================================================================= */
          <div>
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
                filteredOrders.map((order, idx) => (
                  <div
                    key={order.id}
                    style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden animate-card-entrance"
                  >
                    {/* Order Top Bar */}
                    <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => router.push(`/orders?orderId=${order.id}`)}
                          className="font-mono font-bold text-xs text-sky-900 bg-white hover:bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1 hover:border-sky-400 group"
                          title={language === 'vi' ? 'Xem chi tiết & lộ trình vận chuyển' : 'View order & shipment details'}
                        >
                          <span className="font-mono tabular-nums">#{order.id}</span>
                          <ExternalLink className="w-3 h-3 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium font-mono tabular-nums">
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
                              <span className="font-mono tabular-nums">x{item.quantity}</span>
                            </div>
                            <p className="text-xs sm:text-sm font-mono font-bold tabular-nums text-sky-900 mt-1">
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
                        <span className="text-base sm:text-lg font-black font-mono tabular-nums text-slate-900">
                          {order.total.toLocaleString('vi-VN')}₫
                        </span>
                        {order.discount > 0 && (
                          <span className="text-[11px] text-emerald-600 font-semibold font-mono tabular-nums bg-emerald-50 px-2 py-0.5 rounded-md">
                            {language === 'vi' ? `Tiết kiệm ${order.discount.toLocaleString('vi-VN')}₫` : `Saved ${order.discount.toLocaleString('vi-VN')}₫`}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 flex-wrap justify-end">
                        {/* Live Chat with Merchant */}
                        <button
                          type="button"
                          onClick={() => {
                            openSellerChat('TerraSweep Flagship Store', {
                              order: { id: order.id, total: order.total },
                              product: order.items[0]?.product
                                ? {
                                    name: order.items[0].product.name,
                                    image: order.items[0].product.image,
                                    price: order.items[0].price,
                                  }
                                : undefined,
                            });
                          }}
                          className="px-3.5 py-2 rounded-full border border-sky-200 text-sky-700 bg-white hover:bg-sky-50 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                          <span>{language === 'vi' ? 'Liên hệ Shop' : 'Contact Seller'}</span>
                        </button>

                        {/* Return / Refund Action (When delivered) */}
                        {order.status === 'delivered' && (
                          <button
                            type="button"
                            onClick={() => router.push(`/orders?orderId=${order.id}`)}
                            className="px-3.5 py-2 rounded-full border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === 'vi' ? 'Trả hàng / Hoàn tiền' : 'Return / Refund'}</span>
                          </button>
                        )}

                        {/* Return Progress Action (When returned) */}
                        {order.status === 'returned' && (
                          <button
                            type="button"
                            onClick={() => router.push(`/orders?orderId=${order.id}`)}
                            className="px-3.5 py-2 rounded-full border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                            <span>{language === 'vi' ? 'Tiến độ hoàn tiền' : 'Refund Status'}</span>
                          </button>
                        )}

                        {/* View Timeline Tracking Button - Navigates to /orders?orderId=... */}
                        <button
                          type="button"
                          onClick={() => router.push(`/orders?orderId=${order.id}`)}
                          className="px-4 py-2 rounded-full border border-sky-200 text-sky-700 bg-sky-50/50 hover:bg-sky-100/70 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-500 hover:scale-105 active:scale-95 shadow-2xs"
                        >
                          <Truck className="w-3.5 h-3.5 text-sky-600" />
                          <span>{language === 'vi' ? 'Tra cứu lộ trình' : 'Track Order'}</span>
                        </button>

                        {/* Re-order Button */}
                        <button
                          type="button"
                          onClick={() => reorder(order.id)}
                          className="px-4 py-2 rounded-full btn-ocean-primary text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-sky-500/20 hover:scale-105 active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{language === 'vi' ? 'Mua lại' : 'Buy Again'}</span>
                        </button>

                        {/* Cancel Order Button (Only when pending) */}
                        {order.status === 'pending' && (
                          <button
                            type="button"
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
          </div>
        )}
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
              <OceanSelect
                value={cancelReason}
                onChange={(val) => setCancelReason(val)}
                variant="rounded"
                size="md"
                fullWidth
                options={[
                  {
                    value: 'Đổi ý, không muốn mua nữa',
                    label: language === 'vi' ? 'Đổi ý, không muốn mua nữa' : 'Changed mind, do not want to purchase',
                  },
                  {
                    value: 'Muốn thay đổi địa chỉ nhận hàng',
                    label: language === 'vi' ? 'Muốn thay đổi địa chỉ nhận hàng' : 'Want to update shipping address',
                  },
                  {
                    value: 'Tìm thấy giá tốt hơn ở nơi khác',
                    label: language === 'vi' ? 'Tìm thấy giá tốt hơn ở nơi khác' : 'Found a better price elsewhere',
                  },
                  {
                    value: 'Thời gian giao hàng dự kiến quá lâu',
                    label: language === 'vi' ? 'Thời gian giao hàng dự kiến quá lâu' : 'Estimated delivery time is too slow',
                  },
                  {
                    value: 'Khác',
                    label: language === 'vi' ? 'Lý do khác' : 'Other reasons',
                  },
                ]}
              />
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



      {/* 7. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        onLogin={(u, r) => handleLogin(u, r)}
        currentRole={activeRole}
      />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        </div>
      }
    >
      <MyOrdersContent />
    </Suspense>
  );
}
