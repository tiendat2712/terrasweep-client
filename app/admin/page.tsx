'use client';

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { PortalHeader } from '@/components/common/PortalHeader';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AuthModal } from '@/components/common/AuthModal';
import { INITIAL_USERS } from '@/data/mockData';
import { PlatformUser, Role } from '@/types';
import { Loader2 } from 'lucide-react';

function AdminPortalContent() {
  const router = useRouter();
  const {
    orders,
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useCart();

  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);

  const adminUser =
    currentUser?.role === 'admin'
      ? currentUser
      : INITIAL_USERS.find((u) => u.role === 'admin') || INITIAL_USERS[3];

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
  };

  const handleChangeUserRole = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900">
      {/* Dedicated Admin Portal Header */}
      <PortalHeader
        role="admin"
        portalTitle="Master Administrator"
        portalSubtitle="SYSTEM ROOT CONTROL CONSOLE"
        portalBadge="ROOT SUPERUSER"
        currentUser={adminUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchToStorefront={() => {
          const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
          setCurrentUser(customerUser);
          setActiveRole('customer');
          router.push('/');
        }}
      />

      {/* Main Admin Dashboard View with 7 Tabs */}
      <main className="flex-1 flex flex-col animate-in fade-in duration-300">
        <AdminDashboard
          users={users}
          onToggleUserStatus={handleToggleUserStatus}
          onChangeUserRole={handleChangeUserRole}
          totalOrdersCount={orders.length}
        />
      </main>

      {/* Auth Modal for Switching Accounts */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        currentRole="admin"
        onLogin={(user, role) => {
          setCurrentUser(user);
          setActiveRole(role);
          if (role !== 'admin') {
            router.push('/');
          }
        }}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <AdminPortalContent />
    </Suspense>
  );
}
