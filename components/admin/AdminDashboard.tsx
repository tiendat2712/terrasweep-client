import React, { useState } from 'react';
import { PlatformUser, Role } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  ShieldCheck,
  Users,
  Activity,
  DollarSign,
  Server,
  Radio,
  Search,
  Loader2,
} from 'lucide-react';
import { RevenueTrendChart } from './charts/RevenueTrendChart';
import { OrderStatusDonutChart } from './charts/OrderStatusDonutChart';
import { LogisticsThroughputChart } from './charts/LogisticsThroughputChart';
import { OceanSelect } from '../common/OceanSelect';

interface AdminDashboardProps {
  users: PlatformUser[];
  onToggleUserStatus: (userId: string) => void;
  onChangeUserRole: (userId: string, newRole: Role) => void;
  totalOrdersCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  onToggleUserStatus,
  onChangeUserRole,
  totalOrdersCount,
}) => {
  const { t } = useLanguage();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const handleToggleUserStatusAsync = (userId: string) => {
    if (togglingUserId) return;
    setTogglingUserId(userId);
    setTimeout(() => {
      onToggleUserStatus(userId);
      setTogglingUserId(null);
    }, 550);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 bg-gradient-to-b from-white via-sky-50/25 to-white/95 rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0F172A]">{t('admin.title')}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                {t('admin.badge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              {t('admin.serverMeta')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-sky-50/60 border border-sky-200 text-xs font-sans font-semibold text-sky-950">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>{t('admin.telemetryLive')}</span>
        </div>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>{t('admin.kpiGmv')}</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            4.280.950.000₫
          </div>
          <span className="text-xs text-emerald-700 font-sans mt-1.5 block font-semibold">
            {t('admin.kpiGmvSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>{t('admin.kpiOrders')}</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            {totalOrdersCount + 18450} Đơn
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('admin.kpiOrdersSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>{t('admin.kpiUsers')}</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            {users.length + 12840} Users
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('admin.kpiUsersSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>{t('admin.kpiUptime')}</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans tracking-tight tabular-nums">
            99.98%
          </div>
          <span className="text-xs text-emerald-700 font-sans mt-1.5 block font-semibold">
            {t('admin.kpiUptimeSub')}
          </span>
        </DoubleBezelCard>
      </div>

      {/* Visual Analytics & Performance Telemetry Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueTrendChart />
          </div>
          <div className="lg:col-span-1">
            <OrderStatusDonutChart />
          </div>
        </div>

        <div>
          <LogisticsThroughputChart />
        </div>
      </div>

      {/* User Governance Table */}
      <div className="bg-gradient-to-b from-white via-sky-50/20 to-white/95 rounded-[32px] border border-sky-100/90 shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                {t('admin.userGovTitle')}
              </h3>
              <span className="md:hidden text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/80">
                {t('admin.scrollCue') || '← Cuộn ngang →'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t('admin.userGovSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchUserPlaceholder')}
                aria-label={t('admin.searchUserPlaceholder') || 'Tìm kiếm người dùng'}
                className="pl-8 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <OceanSelect
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              options={[
                { value: 'all', label: t('admin.filterAllRoles') },
                { value: 'customer', label: 'Customer (Buyer)' },
                { value: 'seller', label: 'Shop-Manager' },
                { value: 'shipper', label: 'Shipper PRO' },
                { value: 'admin', label: 'Administrator' },
              ]}
              variant="pill"
              align="right"
              className="font-mono font-bold"
            />
          </div>
        </div>

        <div className="relative group/table">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-5">{t('admin.colUser')}</th>
                  <th className="p-5">{t('admin.colCurrentRole')}</th>
                  <th className="p-5">{t('admin.colMetric')}</th>
                  <th className="p-5">{t('admin.colJoinDate')}</th>
                  <th className="p-5">{t('admin.colStatus')}</th>
                  <th className="p-5 text-right">{t('admin.colGovAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <OceanSelect
                        value={user.role}
                        onChange={(val) => onChangeUserRole(user.id, val as Role)}
                        options={[
                          { value: 'customer', label: 'Customer' },
                          { value: 'seller', label: 'Seller' },
                          { value: 'shipper', label: 'Shipper' },
                          { value: 'admin', label: 'Admin' },
                        ]}
                        size="sm"
                        variant="pill"
                        className="font-mono font-bold"
                      />
                    </td>

                    <td className="p-5 font-mono text-slate-700">
                      {user.metric}
                    </td>

                    <td className="p-5 font-mono text-slate-500 text-[11px]">
                      {user.joinDate}
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          user.status === 'verified'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleToggleUserStatusAsync(user.id)}
                        disabled={togglingUserId === user.id}
                        aria-busy={togglingUserId === user.id}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                          user.status === 'suspended'
                            ? 'btn-ocean-primary shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                        }`}
                      >
                        {togglingUserId === user.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>{user.status === 'suspended' ? t('admin.btnUnlock') : t('admin.btnLock')}</span>
                          </>
                        ) : (
                          <span>{user.status === 'suspended' ? t('admin.btnUnlock') : t('admin.btnLock')}</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right-edge scroll cue indicator for mobile devices */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/10 via-slate-900/5 to-transparent md:hidden" />
        </div>
      </div>
    </div>
  );
};
