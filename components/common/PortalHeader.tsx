import React from 'react';
import { Role, PlatformUser } from '@/types';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '@/i18n/LanguageContext';
import { Store, Truck, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

interface PortalHeaderProps {
  role: Role;
  portalTitle: string;
  portalSubtitle: string;
  portalBadge: string;
  portalBadgeColor?: string;
  currentUser: PlatformUser;
  onOpenAuthModal: () => void;
  onSwitchToStorefront: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  role,
  portalSubtitle,
  portalBadge,
  currentUser,
  onOpenAuthModal,
  onSwitchToStorefront,
}) => {
  const { t, language, setLanguage } = useLanguage();

  const getRoleIcon = () => {
    switch (role) {
      case 'seller':
        return <Store className="w-3.5 h-3.5" />;
      case 'shipper':
        return <Truck className="w-3.5 h-3.5" />;
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo + Portal Identifier */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <BrandLogo size="md" subtitle={portalSubtitle} theme="light" />

          <div className="hidden sm:flex items-center gap-2 pl-5 border-l border-zinc-200">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 bg-zinc-100 text-zinc-900 border border-zinc-200">
              {getRoleIcon()}
              {portalBadge}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher, Storefront Return Pill & Active User */}
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-end">
          {/* Language Switcher Pill [ VI | EN ] */}
          <div className="flex items-center rounded-full bg-zinc-100 p-0.5 border border-zinc-200 text-[10px] font-mono font-bold select-none">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                language === 'vi'
                  ? 'bg-[#0C0C0C] text-white shadow-xs'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0C0C0C] text-white shadow-xs'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              EN
            </button>
          </div>

          {/* Return to storefront button */}
          <button
            onClick={onSwitchToStorefront}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          {/* Active User Session */}
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-300"
            />

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {currentUser.email}
              </span>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              title={t('nav.switchAccount')}
            >
              <LogIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
