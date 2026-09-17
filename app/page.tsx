'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, Product, Order, CartItem, PlatformUser, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '@/data/mockData';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';

// Common Components
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { PortalHeader } from '@/components/common/PortalHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { Footer } from '@/components/common/Footer';

// Buyer Components
import { BuyerHeader } from '@/components/buyer/BuyerHeader';
import { FlashSaleBanner } from '@/components/buyer/FlashSaleBanner';
import { CategorySection } from '@/components/buyer/CategorySection';
import { FlashSaleSection } from '@/components/buyer/FlashSaleSection';
import { TopSearchesSection } from '@/components/buyer/TopSearchesSection';
import { ProductCatalog } from '@/components/buyer/ProductCatalog';
import { OrderTrackingView } from '@/components/buyer/OrderTrackingView';

// Role Dashboards
import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { ShipperDashboard } from '@/components/shipper/ShipperDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

import { ArrowRight, Check } from 'lucide-react';

export default function FlashCartHome() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    orders,
    setOrders,
    createOrder,
    isTrackingOpen,
    setIsTrackingOpen,
    toastMessage,
    setToastMessage,
    triggerToast,
    currentUser,
    setCurrentUser,
    handleLogin,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useCart();

  // Shared Core State (Reactive across all 4 roles)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);

  const [searchQuery, setSearchQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<string>('All');

  const handleSelectProduct = (product: Product) => {
    router.push(`/${product.id}`);
  };

  // 2. SELLER ACTIONS
  const handleConfirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = o.trackingEvents.map((evt) =>
            evt.status === 'confirmed'
              ? { ...evt, timestamp: language === 'vi' ? 'Vừa xong' : 'Just now', completed: true }
              : evt
          );
          return {
            ...o,
            status: 'confirmed',
            trackingEvents: updatedEvents,
          };
        }
        return o;
      })
    );

    triggerToast(
      language === 'vi'
        ? `Đã xác nhận đơn #${orderId}! Kiện hàng sẵn sàng cho Shipper.`
        : `Confirmed order #${orderId}! Parcel ready for courier pickup.`,
      'success',
      'Shipper PRO',
      () => {
        const shipperUser = users.find((u) => u.role === 'shipper') || users[2];
        setCurrentUser(shipperUser);
        setActiveRole('shipper');
      }
    );
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    triggerToast(
      language === 'vi' ? 'Đã cập nhật số lượng tồn kho thành công.' : 'Inventory stock updated successfully.',
      'info'
    );
  };

  const handleAddNewProduct = (productData: Partial<Product>) => {
    const fullProduct: Product = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name || 'Sản phẩm mới',
      originalPrice: productData.originalPrice || 500000,
      flashPrice: productData.flashPrice || 350000,
      discountPercent: productData.discountPercent || 30,
      rating: 5.0,
      reviewCount: 0,
      salesCount: language === 'vi' ? '0 đã bán' : '0 sold',
      stock: productData.stock || 20,
      category: productData.category || 'Running',
      image:
        productData.image ||
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      tags: ['New Arrival'],
      description: productData.description || 'Mô tả chi tiết sản phẩm.',
      specs: { 'Bảo hành': '12 tháng' },
      sellerName: 'TerraSweep Official Flagship',
      isFlashSale: true,
      soldProgress: 0,
    };

    setProducts([fullProduct, ...products]);
    triggerToast(
      language === 'vi'
        ? `Đã thêm sản phẩm "${fullProduct.name}" vào cửa hàng!`
        : `Added product "${fullProduct.name}" to storefront!`,
      'success'
    );
  };

  // 3. SHIPPER ACTIONS
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    extraOrNote?: { podPhoto?: string; podTimestamp?: string; failReason?: string; rescheduledDate?: string } | string
  ) => {
    const extraObj = typeof extraOrNote === 'object' ? extraOrNote : undefined;
    const noteStr = typeof extraOrNote === 'string' ? extraOrNote : extraObj?.failReason || (extraObj?.podPhoto ? (language === 'vi' ? 'Đã chụp ảnh xác nhận PoD' : 'Proof of delivery photo verified') : undefined);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = o.trackingEvents.map((evt) => {
            if (evt.status === newStatus) {
              return {
                ...evt,
                timestamp: language === 'vi' ? 'Vừa xong' : 'Just now',
                note: noteStr || evt.note,
                completed: true,
              };
            }
            return evt;
          });
          return {
            ...o,
            status: newStatus,
            shipperId: 'ship-01',
            shipperName: 'Trần Văn Mạnh (Fleet Pro)',
            podPhoto: extraObj?.podPhoto || o.podPhoto,
            podTimestamp: extraObj?.podTimestamp || (extraObj?.podPhoto ? new Date().toLocaleTimeString('vi-VN') : o.podTimestamp),
            failReason: extraObj?.failReason || o.failReason,
            rescheduledDate: extraObj?.rescheduledDate || o.rescheduledDate,
            trackingEvents: updatedEvents,
          };
        }
        return o;
      })
    );

    triggerToast(
      language === 'vi'
        ? `Đã cập nhật đơn #${orderId} sang [${newStatus.toUpperCase()}].`
        : `Updated order #${orderId} status to [${newStatus.toUpperCase()}].`,
      'success',
      language === 'vi' ? 'Xem Timeline' : 'View Timeline',
      () => {
        const customerUser = users.find((u) => u.role === 'customer') || users[0];
        setCurrentUser(customerUser);
        setActiveRole('customer');
        setIsTrackingOpen(true);
      }
    );
  };

  // 4. ADMIN ACTIONS
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === 'suspended' ? 'active' : 'suspended',
            }
          : u
      )
    );
    triggerToast(
      language === 'vi' ? 'Đã thay đổi trạng thái tài khoản người dùng.' : 'User account access status updated.',
      'info'
    );
  };

  const handleChangeUserRole = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    triggerToast(
      language === 'vi'
        ? `Đã cập nhật vai trò người dùng sang [${newRole}].`
        : `Updated user assigned role to [${newRole}].`,
      'info'
    );
  };

  // Counts for Switcher Badges
  const pendingSellerOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const activeShipperDeliveriesCount = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'shipping'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#0F172A] selection:bg-sky-500 selection:text-white">
      {/* 1. DISCREET COLLAPSIBLE DEV ROLE SWITCHER */}
      <RoleSwitcher
        currentRole={activeRole}
        onRoleChange={(role) => {
          const matched = users.find((u) => u.role === role);
          if (matched) setCurrentUser(matched);
          setActiveRole(role);
        }}
        pendingSellerCount={pendingSellerOrdersCount}
        activeShipperCount={activeShipperDeliveriesCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Reactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5">
          <div className="p-4 rounded-full bg-slate-900 text-white shadow-2xl shadow-sky-950/20 border border-slate-700/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="font-semibold text-white truncate max-w-xs">{toastMessage.text}</p>
            </div>

            {toastMessage.actionText && toastMessage.onAction && (
              <button
                onClick={() => {
                  toastMessage.onAction?.();
                  setToastMessage(null);
                }}
                className="px-4 py-1.5 rounded-full bg-sky-600 text-white font-bold text-[11px] hover:bg-sky-500 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs shadow-sky-500/25"
              >
                {toastMessage.actionText}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. ROLE-BASED CONDITIONAL VIEWS */}

      {/* ROLE 1: CUSTOMER / BUYER VIEW */}
      {activeRole === 'customer' && (
        <main className="flex-1 flex flex-col animate-in fade-in duration-300">
          {/* Authentic TerraSweep Single-Tier Navbar with Language Switcher */}
          <BuyerHeader
            cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            onOpenCart={() => router.push('/cart')}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchRole={(role) => {
              const matched = users.find((u) => u.role === role);
              if (matched) setCurrentUser(matched);
              setActiveRole(role);
            }}
          />

          <div className="max-w-7xl mx-auto px-6 w-full flex-1">
            {/* Live Order Tracking Timeline */}
            {isTrackingOpen && (
              <OrderTrackingView
                orders={orders}
                onClose={() => setIsTrackingOpen(false)}
              />
            )}

            {/* Editorial Services & Curated Drops Hero */}
            <FlashSaleBanner
              flashProducts={products.filter((p) => p.isFlashSale)}
              onSelectProduct={handleSelectProduct}
            />

            {/* 1. Shopee-style 2-Row Category Directory */}
            <CategorySection
              onSelectCategory={(cat) => setCatalogCategory(cat)}
              selectedCategory={catalogCategory}
            />

            {/* 2. Shopee-style Interactive Flash Sale Section with Countdown & Flame Velocity */}
            <FlashSaleSection
              flashProducts={products.filter((p) => p.isFlashSale)}
              onSelectProduct={handleSelectProduct}
              onAddToCart={addToCart}
            />

            {/* 3. Shopee-style Top Trending Searches with Ranking & Monthly Sales */}
            <TopSearchesSection
              products={products}
              onSelectProduct={handleSelectProduct}
            />

            {/* 4. TerraSweep 2-Column Collection & Sidebar Filters */}
            <ProductCatalog
              products={products}
              onSelectProduct={handleSelectProduct}
              onAddToCart={addToCart}
              searchQuery={searchQuery}
              externalCategory={catalogCategory}
              onSelectCategory={setCatalogCategory}
            />
          </div>
        </main>
      )}

      {/* ROLE 2: SHOP-MANAGER (SELLER) DASHBOARD */}
      {activeRole === 'seller' && (
        <main className="flex-1 flex flex-col animate-in fade-in duration-300">
          {/* Dedicated Seller Portal Header */}
          <PortalHeader
            role="seller"
            portalTitle="TerraSweep Flagship"
            portalSubtitle="MERCHANT CENTER & BRAND STOREFRONT"
            portalBadge="OFFICIAL STORE"
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchToStorefront={() => {
              const customerUser = users.find((u) => u.role === 'customer') || users[0];
              setCurrentUser(customerUser);
              setActiveRole('customer');
            }}
          />

          <SellerDashboard
            products={products}
            orders={orders}
            onConfirmOrder={handleConfirmOrder}
            onUpdateStock={handleUpdateStock}
            onAddNewProduct={handleAddNewProduct}
          />
        </main>
      )}

      {/* ROLE 3: SHIPPER (DELIVERY PARTNER) INTERFACE */}
      {activeRole === 'shipper' && (
        <main className="flex-1 flex flex-col animate-in fade-in duration-300">
          {/* Dedicated Shipper Portal Header */}
          <PortalHeader
            role="shipper"
            portalTitle="Trần Văn Mạnh"
            portalSubtitle="LOGISTICS & FLEET OPERATIONS"
            portalBadge="FLEET PRO"
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchToStorefront={() => {
              const customerUser = users.find((u) => u.role === 'customer') || users[0];
              setCurrentUser(customerUser);
              setActiveRole('customer');
            }}
          />

          <ShipperDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </main>
      )}

      {/* ROLE 4: ADMIN (SYSTEM ADMINISTRATOR) CONSOLE */}
      {activeRole === 'admin' && (
        <main className="flex-1 flex flex-col animate-in fade-in duration-300">
          {/* Dedicated Admin Portal Header */}
          <PortalHeader
            role="admin"
            portalTitle="Master Administrator"
            portalSubtitle="SYSTEM ROOT CONTROL CONSOLE"
            portalBadge="ROOT SUPERUSER"
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchToStorefront={() => {
              const customerUser = users.find((u) => u.role === 'customer') || users[0];
              setCurrentUser(customerUser);
              setActiveRole('customer');
            }}
          />

          <AdminDashboard
            users={users}
            onToggleUserStatus={handleToggleUserStatus}
            onChangeUserRole={handleChangeUserRole}
            totalOrdersCount={orders.length}
          />
        </main>
      )}

      {/* 3. DYNAMIC AUTH / LOGIN MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
        currentRole={activeRole}
      />

      {/* 4. EDITORIAL LUXURY FOOTER */}
      <Footer />
    </div>
  );
}
