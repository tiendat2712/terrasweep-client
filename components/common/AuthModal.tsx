import React, { useState } from 'react';
import { Role, PlatformUser } from '@/types';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  X,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: PlatformUser[];
  onLogin: (user: PlatformUser, targetRole: Role) => void;
  currentRole: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLogin,
  currentRole,
}) => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [redirectingMessage, setRedirectingMessage] = useState('');

  if (!isOpen) return null;

  const demoProfiles: {
    role: Role;
    title: string;
    description: string;
    icon: React.ReactNode;
    user: PlatformUser;
  }[] = [
    {
      role: 'customer',
      title: t('auth.customerTitle'),
      description: t('auth.customerDesc'),
      icon: <ShoppingBag className="w-4 h-4 text-sky-600" />,
      user: users.find((u) => u.role === 'customer') || users[0],
    },
    {
      role: 'seller',
      title: t('auth.sellerTitle'),
      description: t('auth.sellerDesc'),
      icon: <Store className="w-4 h-4 text-sky-600" />,
      user: users.find((u) => u.role === 'seller') || users[1],
    },
    {
      role: 'shipper',
      title: t('auth.shipperTitle'),
      description: t('auth.shipperDesc'),
      icon: <Truck className="w-4 h-4 text-sky-600" />,
      user: users.find((u) => u.role === 'shipper') || users[2],
    },
    {
      role: 'admin',
      title: t('auth.adminTitle'),
      description: t('auth.adminDesc'),
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />,
      user: users.find((u) => u.role === 'admin') || users[3],
    },
  ];

  const handleQuickLogin = (profileUser: PlatformUser, role: Role) => {
    setIsAuthenticating(true);
    setRedirectingMessage(t('auth.authenticating', { name: profileUser.name }));

    setTimeout(() => {
      onLogin(profileUser, role);
      setIsAuthenticating(false);
      onClose();
    }, 500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser =
      users.find((u) => u.role === selectedRole) || users[0];

    setIsAuthenticating(true);
    setRedirectingMessage(t('auth.authenticating', { name: selectedRole.toUpperCase() }));

    setTimeout(() => {
      onLogin(matchedUser, selectedRole);
      setIsAuthenticating(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-[32px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100 shadow-2xl overflow-hidden my-6 ambient-glow-sky"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo size="lg" showSubtitle theme="light" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              {t('auth.title')}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Authenticating Loading Feedback */}
          {isAuthenticating && (
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 text-center space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-center gap-2 text-sky-600 font-bold text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>{redirectingMessage}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {t('auth.redirectingSubtitle')}
              </p>
            </div>
          )}

          {/* 4 Demo Quick Login Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('auth.quickLoginTitle')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoProfiles.map((p) => (
                <button
                  key={p.role}
                  disabled={isAuthenticating}
                  onClick={() => handleQuickLogin(p.user, p.role)}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/10 text-left transition-all flex items-start gap-3.5 cursor-pointer group disabled:opacity-50"
                >
                  <img
                    src={p.user.avatar}
                    alt={p.user.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                        {p.icon}
                        {p.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-800 truncate block font-semibold mt-1">
                      {p.user.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block font-mono">
                      {p.user.email}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Login Form */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {t('auth.manualFormTitle')}
            </span>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{t('auth.targetRole')}</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold cursor-pointer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="customer">{t('auth.roleCustomer')}</option>
                    <option value="seller">{t('auth.roleSeller')}</option>
                    <option value="shipper">{t('auth.roleShipper')}</option>
                    <option value="admin">{t('auth.roleAdmin')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{t('auth.emailLabel')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@terrasweep.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{t('auth.passwordLabel')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs tracking-wider shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.005] active:scale-[0.99]"
              >
                <span>{t('auth.submitButton')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
