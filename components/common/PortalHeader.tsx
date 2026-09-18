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
  portalTitle,
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
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-sky-100/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Left: Brand Logo + Portal Identifier */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <BrandLogo size="md" subtitle={portalTitle || portalSubtitle} theme="light" />

          <div className="hidden sm:flex items-center gap-2 pl-5 border-l border-slate-200">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
              {getRoleIcon()}
              {portalBadge}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher, Storefront Return Pill & Active User */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto justify-between sm:justify-end">
          {/* Language Switcher Pill [ VI | EN ] */}
          <div className="flex items-center rounded-full bg-slate-100 p-0.5 border border-slate-200 text-[10px] font-mono font-bold select-none">
            <button
              onClick={() => setLanguage('vi')}
              aria-pressed={language === 'vi'}
              aria-label="Tiếng Việt"
              className={`min-w-10 min-h-10 px-2 py-1 rounded-full transition-colors cursor-pointer ${
                language === 'vi'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              aria-label="English"
              className={`min-w-10 min-h-10 px-2 py-1 rounded-full transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-sky-700'
              }`}
            >
              EN
            </button>
          </div>

          {/* Return to storefront button */}
          <button
            onClick={onSwitchToStorefront}
            className="flex min-h-11 items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sm font-semibold text-sky-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Cửa hàng' : 'Storefront'}</span>
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
              aria-label={t('nav.switchAccount')}
              className="flex size-11 items-center justify-center rounded-full hover:bg-sky-100 text-slate-600 hover:text-sky-900 transition-colors cursor-pointer"
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
