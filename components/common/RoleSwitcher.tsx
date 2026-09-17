import React, { useState } from 'react';
import { Role, PlatformUser } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { ShoppingBag, Store, Truck, ShieldCheck, LogIn, ChevronUp, ChevronDown, Layers } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  pendingSellerCount?: number;
  activeShipperCount?: number;
  currentUser?: PlatformUser;
  onOpenAuthModal?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  pendingSellerCount = 0,
  activeShipperCount = 0,
  onOpenAuthModal,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const roles: {
    id: Role;
    label: string;
    subLabel: string;
    icon: React.ReactNode;
    badge?: string | number;
  }[] = [
    {
      id: 'customer',
      label: t('roleSwitcher.customerLabel'),
      subLabel: t('roleSwitcher.customerSub'),
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'seller',
      label: t('roleSwitcher.sellerLabel'),
      subLabel: t('roleSwitcher.sellerSub'),
      icon: <Store className="w-4 h-4" />,
      badge: pendingSellerCount > 0 ? `${pendingSellerCount}` : undefined,
    },
    {
      id: 'shipper',
      label: t('roleSwitcher.shipperLabel'),
      subLabel: t('roleSwitcher.shipperSub'),
      icon: <Truck className="w-4 h-4" />,
      badge: activeShipperCount > 0 ? `${activeShipperCount}` : undefined,
    },
    {
      id: 'admin',
      label: t('roleSwitcher.adminLabel'),
      subLabel: t('roleSwitcher.adminSub'),
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Root',
    },
  ];

  const currentRoleInfo = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <aside aria-label="Role Switcher Dock" className="fixed bottom-6 left-6 z-50 select-none">
      {/* Expanded Dev Panel */}
      {isExpanded ? (
        <div className="rounded-3xl bg-white border border-zinc-200 shadow-2xl p-4 w-80 text-zinc-900 space-y-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#0C0C0C]" />
              <span>{t('roleSwitcher.title')}</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {t('roleSwitcher.instructions')}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {roles.map((item) => {
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onRoleChange(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-[#0C0C0C] bg-[#0C0C0C] text-white shadow-md'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-bold truncate text-[11px]">{item.label}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                    <span className={isActive ? 'text-zinc-300' : 'text-zinc-500'}>
                      {item.subLabel}
                    </span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="w-full py-2.5 rounded-full bg-[#0C0C0C] hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('roleSwitcher.openAuthModal')}</span>
            </button>
          )}
        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 shadow-xl text-xs font-semibold text-zinc-900 transition-all cursor-pointer group hover:scale-105"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-400 uppercase">{t('roleSwitcher.devMode')}</span>
          <span className="text-zinc-900 font-bold flex items-center gap-1.5">
            {currentRoleInfo.icon}
            {currentRoleInfo.label}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800" />
        </button>
      )}
    </aside>
  );
};
