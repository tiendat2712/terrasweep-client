'use client';

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { PortalHeader } from '@/components/common/PortalHeader';
import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { AuthModal } from '@/components/common/AuthModal';
import { INITIAL_USERS, INITIAL_PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

function SellerPortalContent() {
  const router = useRouter();
  const {
    orders,
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    products,
    setProducts,
    addProduct,
  } = useCart();

  const sellerUser =
    currentUser?.role === 'seller'
      ? currentUser
      : INITIAL_USERS.find((u) => u.role === 'seller') || INITIAL_USERS[1];

  const handleConfirmOrder = (orderId: string) => {
    // Handled in order workflow
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleAddNewProduct = (newProd: Partial<Product>) => {
    addProduct(newProd as Product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900">
      {/* Dedicated Seller Portal Header */}
      <PortalHeader
        role="seller"
        portalTitle="TerraSweep Flagship Official"
        portalSubtitle="MERCHANT CENTER CONSOLE"
        portalBadge="VERIFIED MERCHANT"
        currentUser={sellerUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchToStorefront={() => {
          const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
          setCurrentUser(customerUser);
          setActiveRole('customer');
          router.push('/');
        }}
      />

      {/* Main Seller Dashboard View with 7 Tabs */}
      <main className="flex-1 flex flex-col animate-in fade-in duration-300">
        <SellerDashboard
          products={products}
          orders={orders}
          onConfirmOrder={handleConfirmOrder}
          onUpdateStock={handleUpdateStock}
          onAddNewProduct={handleAddNewProduct}
        />
      </main>

      {/* Auth Modal for Switching Accounts */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        currentRole="seller"
        onLogin={(user, role) => {
          setCurrentUser(user);
          setActiveRole(role);
          if (role !== 'seller') {
            router.push('/');
          }
        }}
      />
    </div>
  );
}

export default function SellerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <SellerPortalContent />
    </Suspense>
  );
}
