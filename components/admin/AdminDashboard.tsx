import React, { useState } from 'react';
import { PlatformUser, Role } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Users,
  Activity,
  DollarSign,
  Server,
  Radio,
  Search,
  Loader2,
  Store,
  Scale,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Building2,
  CreditCard,
  X,
  Eye,
  FileCheck,
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
  const { t, language } = useLanguage();
  const { kycApplications, approveKyc, rejectKyc, disputes, resolveDispute } = useCart();

  // Navigation Sub-tabs
  const [adminTab, setAdminTab] = useState<'users' | 'kyc' | 'disputes'>('users');

  // User Governance State
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // KYC Management State
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectingKycId, setRejectingKycId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Dispute Management State
  const [disputeFilter, setDisputeFilter] = useState<'all' | 'pending' | 'refunded' | 'rejected'>('all');

  // Preview Document / Photo Modal State
  const [previewModal, setPreviewModal] = useState<{ title: string; image?: string; text?: string } | null>(null);

  const pendingKycCount = kycApplications.filter((k) => k.status === 'pending').length;
  const pendingDisputesCount = disputes.filter((d) => d.status === 'pending').length;

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

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-100 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'users'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quản Trị Người Dùng & Hạ Tầng' : 'User Governance & Metrics'}</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            adminTab === 'kyc'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{language === 'vi' ? 'Duyệt Hồ Sơ Gian Hàng (KYC)' : 'Merchant KYC Applications'}</span>
          {pendingKycCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-xs">
              {pendingKycCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            adminTab === 'disputes'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{language === 'vi' ? 'Khiếu Nại & Tranh Chấp' : 'Dispute & Claims Center'}</span>
          {pendingDisputesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-xs">
              {pendingDisputesCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: USERS & TELEMETRY */}
      {adminTab === 'users' && (
        <div className="space-y-8 animate-in fade-in">
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
      )}

      {/* TAB 2: MERCHANT KYC APPLICATION APPROVAL */}
      {adminTab === 'kyc' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-sky-600" />
                <span>{language === 'vi' ? 'Hồ Sơ Mở Gian Hàng (Merchant KYC)' : 'Merchant Registration Approvals'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'vi'
                  ? 'Thẩm định hồ sơ pháp lý, GPKD và tài khoản thụ hưởng trước khi cấp quyền kinh doanh'
                  : 'Verify business license, legal entity, and bank accounts before granting seller privileges'}
              </p>
            </div>

            {/* KYC Status Filter */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full text-xs font-bold">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setKycFilter(filter)}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    kycFilter === filter
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter === 'all'
                    ? (language === 'vi' ? 'Tất cả' : 'All')
                    : filter === 'pending'
                    ? (language === 'vi' ? `Chờ duyệt (${pendingKycCount})` : `Pending (${pendingKycCount})`)
                    : filter === 'approved'
                    ? (language === 'vi' ? 'Đã duyệt' : 'Approved')
                    : (language === 'vi' ? 'Từ chối' : 'Rejected')}
                </button>
              ))}
            </div>
          </div>

          {/* KYC List */}
          <div className="grid grid-cols-1 gap-4">
            {kycApplications
              .filter((k) => kycFilter === 'all' || k.status === kycFilter)
              .map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/15 to-white/95 border border-sky-100/90 shadow-sm hover:border-sky-300 transition-all space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold font-mono">
                        {app.shopName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{app.shopName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            {app.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Mã hồ sơ: #{app.id} • Nộp lúc: {app.submittedAt}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border self-start sm:self-auto ${
                        app.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                          : app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-700 border-red-300'
                      }`}
                    >
                      {app.status === 'pending'
                        ? (language === 'vi' ? 'Chờ kiểm duyệt' : 'Pending Review')
                        : app.status === 'approved'
                        ? (language === 'vi' ? 'Đã phê duyệt' : 'Approved')
                        : (language === 'vi' ? 'Đã từ chối' : 'Rejected')}
                    </span>
                  </div>

                  {/* KYC Details 3-Col Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'vi' ? 'Đại diện sở hữu' : 'Owner / Legal Rep'}</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.ownerName}</p>
                      <p className="text-slate-500">{app.phone} • {app.email}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'vi' ? 'Giấy phép ĐKKD' : 'Business License'}</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.businessLicense}</p>
                      <button
                        onClick={() =>
                          setPreviewModal({
                            title: `Giấy Phép Kinh Doanh - ${app.shopName}`,
                            text: `Số GPKD: ${app.businessLicense}\nNgười đại diện: ${app.ownerName}\nNgành nghề: ${app.category}\nCơ quan cấp: Sở Kế hoạch và Đầu tư\nTrạng thái hồ sơ: Hợp lệ theo xác thực cổng dịch vụ công.`,
                          })
                        }
                        className="text-[11px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Xem trích lục GPKD' : 'View license copy'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'vi' ? 'Tài khoản thụ hưởng' : 'Payout Account'}</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.bankAccount}</p>
                      <p className="text-slate-500">{app.bankName}</p>
                    </div>
                  </div>

                  {/* Rejection Notice if any */}
                  {app.status === 'rejected' && app.rejectionReason && (
                    <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{language === 'vi' ? 'Lý do từ chối:' : 'Rejection Reason:'} {app.rejectionReason}</span>
                    </div>
                  )}

                  {/* KYC Action Buttons */}
                  {app.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setRejectingKycId(app.id);
                          setRejectReasonInput('Giấy phép kinh doanh chưa công chứng hoặc thông tin thuế không trùng khớp');
                        }}
                        className="px-5 py-2 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
                      >
                        {language === 'vi' ? 'Từ chối hồ sơ' : 'Reject Application'}
                      </button>
                      <button
                        onClick={() => approveKyc(app.id)}
                        className="btn-ocean-primary px-6 py-2 rounded-full text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'vi' ? 'Phê duyệt mở shop' : 'Approve Merchant'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTE & CLAIMS ARBITRATION CENTER */}
      {adminTab === 'disputes' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-sky-600" />
                <span>{language === 'vi' ? 'Trung Tâm Xử Lý Tranh Chấp & Khiếu Nại' : 'Dispute & Claims Resolution'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'vi'
                  ? 'Thẩm định bằng chứng đối soát giữa Người mua và Shop. Quyết định hoàn tiền hoặc bảo vệ gian hàng'
                  : 'Arbitrate claims and evidence between Buyer and Seller. Issue refunds or uphold merchant fulfillment'}
              </p>
            </div>

            {/* Dispute Filter */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full text-xs font-bold">
              {(['all', 'pending', 'refunded', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDisputeFilter(filter)}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    disputeFilter === filter
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter === 'all'
                    ? (language === 'vi' ? 'Tất cả' : 'All')
                    : filter === 'pending'
                    ? (language === 'vi' ? `Chờ xử lý (${pendingDisputesCount})` : `Pending (${pendingDisputesCount})`)
                    : filter === 'refunded'
                    ? (language === 'vi' ? 'Đã hoàn tiền' : 'Refunded')
                    : (language === 'vi' ? 'Đã bác khiếu nại' : 'Rejected')}
                </button>
              ))}
            </div>
          </div>

          {/* Dispute List */}
          <div className="grid grid-cols-1 gap-5">
            {disputes
              .filter((d) => disputeFilter === 'all' || d.status === disputeFilter)
              .map((disp) => (
                <div
                  key={disp.id}
                  className="p-6 rounded-[28px] bg-gradient-to-b from-white via-sky-50/15 to-white/95 border border-sky-100/90 shadow-sm hover:border-sky-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sky-600 text-sm">#{disp.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-700">Đơn hàng #{disp.orderId}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Khởi tạo: {disp.createdAt}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border self-start sm:self-auto ${
                        disp.status === 'pending'
                          ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                          : disp.status === 'refunded'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {disp.status === 'pending'
                        ? (language === 'vi' ? 'Chờ phán quyết' : 'Pending Arbitration')
                        : disp.status === 'refunded'
                        ? (language === 'vi' ? 'Đã hoàn tiền 100%' : '100% Refunded')
                        : (language === 'vi' ? 'Đã bác khiếu nại' : 'Claim Dismissed')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
                    {/* Parties & Claim Amount */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {language === 'vi' ? 'Bên khiếu nại (Buyer)' : 'Claimant (Buyer)'}
                          </span>
                          <strong className="text-slate-900 text-sm">{disp.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {language === 'vi' ? 'Bị đơn (Merchant)' : 'Respondent (Shop)'}
                          </span>
                          <strong className="text-slate-900 text-sm">{disp.sellerName}</strong>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-1">
                        <span className="text-[10px] text-sky-800 font-bold uppercase block">
                          {language === 'vi' ? 'Lý do khiếu nại & Giá trị tranh chấp' : 'Claim Reason & Disputed Amount'}
                        </span>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{disp.reason}</p>
                          <span className="text-base font-black text-red-600 font-mono">
                            {disp.amount.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        {disp.resolutionNote && (
                          <p className="text-[11px] text-slate-500 pt-1 border-t border-sky-100">
                            <span className="font-semibold">{language === 'vi' ? 'Ghi chú giải trình:' : 'Resolution note:'}</span> {disp.resolutionNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Evidence Photo Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        {language === 'vi' ? 'Bằng chứng ảnh từ Khách hàng' : 'Evidence photo from Customer'}
                      </span>
                      {disp.evidencePhoto ? (
                        <div
                          onClick={() =>
                            setPreviewModal({
                              title: `Bằng chứng khiếu nại - Đơn #${disp.orderId}`,
                              image: disp.evidencePhoto,
                            })
                          }
                          className="relative rounded-2xl overflow-hidden border border-slate-200 group cursor-pointer h-28 bg-slate-100"
                        >
                          <img
                            src={disp.evidencePhoto}
                            alt="Evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-bold">
                            <Eye className="w-4 h-4" />
                            <span>{language === 'vi' ? 'Phóng to ảnh' : 'View Full Image'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-28 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                          {language === 'vi' ? 'Không có ảnh đính kèm' : 'No photo uploaded'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arbitration Actions */}
                  {disp.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() =>
                          resolveDispute(
                            disp.id,
                            'rejected',
                            'Bác khiếu nại do kiện hàng đã đồng kiểm nguyên vẹn tem niêm phong lúc giao'
                          )
                        }
                        className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        {language === 'vi' ? 'Bác khiếu nại (Bảo vệ Shop)' : 'Dismiss Claim'}
                      </button>
                      <button
                        onClick={() =>
                          resolveDispute(
                            disp.id,
                            'refunded',
                            'Admin phê duyệt hoàn tiền 100% về ví cho người mua'
                          )
                        }
                        className="btn-ocean-primary px-6 py-2 rounded-full text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'vi' ? 'Duyệt hoàn 100% tiền cho Khách' : 'Approve 100% Refund'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* KYC Rejection Modal */}
      {rejectingKycId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{language === 'vi' ? 'Từ Chối Hồ Sơ Mở Gian Hàng' : 'Reject Merchant KYC'}</span>
              </h3>
              <button
                onClick={() => setRejectingKycId(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {language === 'vi' ? 'Nhập lý do từ chối hồ sơ:' : 'Reason for rejection:'}
              </label>
              <textarea
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingKycId(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (rejectingKycId) {
                    rejectKyc(rejectingKycId, rejectReasonInput);
                    setRejectingKycId(null);
                  }
                }}
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-xs"
              >
                {language === 'vi' ? 'Xác nhận từ chối' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Document / Lightbox Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{previewModal.title}</h3>
              <button
                onClick={() => setPreviewModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewModal.image ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96">
                <img
                  src={previewModal.image}
                  alt={previewModal.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
                {previewModal.text}
              </div>
            )}

            <button
              onClick={() => setPreviewModal(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              {language === 'vi' ? 'Đóng cửa sổ' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
