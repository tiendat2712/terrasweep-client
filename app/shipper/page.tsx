'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { PortalHeader } from '@/components/common/PortalHeader';
import { ShipperDashboard } from '@/components/shipper/ShipperDashboard';
import { AuthModal } from '@/components/common/AuthModal';
import { INITIAL_USERS } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

function ShipperPortalContent() {
  const router = useRouter();
  const {
    orders,
    updateOrderStatus,
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useCart();

  const shipperUser =
    currentUser?.role === 'shipper'
      ? currentUser
      : INITIAL_USERS.find((u) => u.role === 'shipper') || INITIAL_USERS[2];

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900">
      {/* Shipper Portal Dedicated Header */}
      <PortalHeader
        role="shipper"
        portalTitle={shipperUser.name}
        portalSubtitle="LOGISTICS & FLEET OPERATIONS"
        portalBadge="FLEET PRO"
        currentUser={shipperUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchToStorefront={() => {
          const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
          setCurrentUser(customerUser);
          setActiveRole('customer');
          router.push('/');
        }}
      />

      {/* Main Shipper Dashboard View with 6 Tabs */}
      <main className="flex-1 flex flex-col animate-in fade-in duration-300">
        <ShipperDashboard
          orders={orders}
          onUpdateOrderStatus={updateOrderStatus}
        />
      </main>

      {/* Auth Modal for Switching Accounts */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        currentRole="shipper"
        onLogin={(user, role) => {
          setCurrentUser(user);
          setActiveRole(role);
          if (role !== 'shipper') {
            router.push('/');
          }
        }}
      />
    </div>
  );
}

export default function ShipperPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <ShipperPortalContent />
    </Suspense>
  );
}
