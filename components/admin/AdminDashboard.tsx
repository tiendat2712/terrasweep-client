'use client';

import React, { useState } from 'react';
import { PlatformUser, Role, SellerAccount, PlatformVoucher, AdminAuditLog, AccountSuspensionRecord } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { OceanSelect } from '../common/OceanSelect';
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
  BarChart3,
  Lock,
  Unlock,
  Ticket,
  ClipboardList,
  Plus,
  TrendingUp,
  Percent,
  AlertOctagon,
  ShieldAlert,
  Sliders,
  Globe,
  Smartphone,
  Calendar,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RevenueTrendChart } from './charts/RevenueTrendChart';
import { OrderStatusDonutChart } from './charts/OrderStatusDonutChart';
import { LogisticsThroughputChart } from './charts/LogisticsThroughputChart';
import { CategoryMarketShareChart } from './charts/CategoryMarketShareChart';
import { PlatformConversionFunnelChart } from './charts/PlatformConversionFunnelChart';
import {
  INITIAL_SELLERS,
  INITIAL_PLATFORM_VOUCHERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUSPENSIONS,
} from '@/data/mockData';

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
  const { kycApplications, approveKyc, rejectKyc, triggerToast } = useCart();

  // Navigation Sub-tabs (7 Tabs)
  const [adminTab, setAdminTab] = useState<
    'dashboard' | 'users' | 'sellers' | 'kyc' | 'suspensions' | 'vouchers' | 'audit'
  >('dashboard');

  // State Datasets
  const [sellers, setSellers] = useState<SellerAccount[]>(INITIAL_SELLERS);
  const [platformVouchers, setPlatformVouchers] = useState<PlatformVoucher[]>(INITIAL_PLATFORM_VOUCHERS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [suspensions, setSuspensions] = useState<AccountSuspensionRecord[]>(INITIAL_SUSPENSIONS);

  // Tab 2: User Governance Filter
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<PlatformUser | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // Tab 3: Seller Governance State
  const [sellerSearchQuery, setSellerSearchQuery] = useState('');
  const [editingCommissionSeller, setEditingCommissionSeller] = useState<SellerAccount | null>(null);
  const [newCommissionInput, setNewCommissionInput] = useState<number>(5.0);

  // Tab 4: KYC State
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectingKycId, setRejectingKycId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [previewModal, setPreviewModal] = useState<{ title: string; image?: string; text?: string } | null>(null);

  // Tab 5: Account Suspension Modal State
  const [isCreateBanModalOpen, setIsCreateBanModalOpen] = useState(false);
  const [banTargetId, setBanTargetId] = useState('');
  const [banReason, setBanReason] = useState('Kinh doanh hàng không rõ nguồn gốc, vi phạm bản quyền thương hiệu');
  const [banDuration, setBanDuration] = useState<'7_days' | '30_days' | 'permanent'>('30_days');
  const [banNotes, setBanNotes] = useState('');

  // Tab 6: Voucher Modal State
  const [isCreateVoucherModalOpen, setIsCreateVoucherModalOpen] = useState(false);
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherType, setNewVoucherType] = useState<'shipping' | 'fixed' | 'percentage'>('shipping');
  const [newVoucherValue, setNewVoucherValue] = useState(30000);
  const [newVoucherMinSpend, setNewVoucherMinSpend] = useState(200000);
  const [newVoucherBudget, setNewVoucherBudget] = useState(100000000);
  const [newVoucherMaxUsage, setNewVoucherMaxUsage] = useState(3000);

  // Tab 7: Audit Log Inspection State
  const [auditFilterSeverity, setAuditFilterSeverity] = useState<string>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<AdminAuditLog | null>(null);

  const pendingKycCount = kycApplications.filter((k) => k.status === 'pending').length;

  // Handlers
  const handleToggleUserStatusAsync = (userId: string) => {
    if (togglingUserId) return;
    setTogglingUserId(userId);
    setTimeout(() => {
      onToggleUserStatus(userId);
      setTogglingUserId(null);

      // Append to audit log
      const targetUser = users.find((u) => u.id === userId);
      const isSuspending = targetUser?.status !== 'suspended';
      const newLog: AdminAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        adminName: 'Master Administrator',
        adminEmail: 'root.admin@flashcart.ai',
        action: isSuspending ? 'LOCK_USER' : 'UNLOCK_USER',
        actionLabel: isSuspending ? 'Khóa tài khoản người dùng' : 'Mở khóa người dùng',
        targetEntity: `${targetUser?.name || 'User'} (${userId})`,
        targetId: userId,
        details: isSuspending ? 'Khóa tài khoản do vi phạm điều khoản' : 'Mở khóa tài khoản',
        ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
        device: 'Chrome 128 / macOS Sequoia',
        severity: isSuspending ? 'warning' : 'info',
        diffSnapshot: JSON.stringify({ userId, prevStatus: targetUser?.status, newStatus: isSuspending ? 'suspended' : 'active' }, null, 2),
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }, 500);
  };

  const handleSaveCommission = () => {
    if (!editingCommissionSeller) return;
    const oldRate = editingCommissionSeller.commissionRate;
    setSellers((prev) =>
      prev.map((s) =>
        s.id === editingCommissionSeller.id ? { ...s, commissionRate: newCommissionInput } : s
      )
    );

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      adminName: 'Master Administrator',
      adminEmail: 'root.admin@flashcart.ai',
      action: 'UPDATE_COMMISSION',
      actionLabel: 'Điều chỉnh phí hoa hồng sàn',
      targetEntity: `${editingCommissionSeller.shopName} (${editingCommissionSeller.id})`,
      targetId: editingCommissionSeller.id,
      details: `Thay đổi mức phí sàn từ ${oldRate}% sang ${newCommissionInput}%`,
      ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
      device: 'Chrome 128 / macOS Sequoia',
      severity: 'warning',
      diffSnapshot: JSON.stringify({ shopId: editingCommissionSeller.id, oldRate, newRate: newCommissionInput }, null, 2),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerToast(
      language === 'vi'
        ? `Đã cập nhật mức phí sàn của "${editingCommissionSeller.shopName}" thành ${newCommissionInput}%!`
        : `Updated commission fee rate for "${editingCommissionSeller.shopName}" to ${newCommissionInput}%!`,
      'success'
    );
    setEditingCommissionSeller(null);
  };

  const handleCreateBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTargetId) {
      alert('Vui lòng chọn tài khoản cần áp dụng lệnh khóa!');
      return;
    }

    const targetUser = users.find((u) => u.id === banTargetId);
    const targetSeller = sellers.find((s) => s.id === banTargetId);

    const targetName = targetUser?.name || targetSeller?.shopName || 'Người dùng';
    const targetEmail = targetUser?.email || targetSeller?.email || 'N/A';
    const targetRole: Role = targetSeller ? 'seller' : (targetUser?.role || 'customer');

    const newBanRecord: AccountSuspensionRecord = {
      id: `ban-${Date.now()}`,
      targetId: banTargetId,
      targetName,
      targetEmail,
      targetRole,
      reason: banReason,
      duration: banDuration,
      suspendedAt: new Date().toLocaleString('vi-VN'),
      suspendedBy: 'Master Administrator',
      status: 'active_ban',
      notes: banNotes || 'Áp dụng theo quyết định phòng Kiểm soát Rủi ro & Pháp chế.',
    };

    setSuspensions((prev) => [newBanRecord, ...prev]);

    // Update target status in user/seller lists
    if (targetUser) {
      onToggleUserStatus(banTargetId);
    }
    if (targetSeller) {
      setSellers((prev) =>
        prev.map((s) => (s.id === banTargetId ? { ...s, status: 'suspended' } : s))
      );
    }

    // Add audit log
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      adminName: 'Master Administrator',
      adminEmail: 'root.admin@flashcart.ai',
      action: 'LOCK_USER',
      actionLabel: 'Áp dụng lệnh khóa tài khoản vi phạm',
      targetEntity: `${targetName} (${banTargetId})`,
      targetId: banTargetId,
      details: `Khóa ${banDuration === 'permanent' ? 'vĩnh viễn' : banDuration}: ${banReason}`,
      ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
      device: 'Chrome 128 / macOS Sequoia',
      severity: 'critical',
      diffSnapshot: JSON.stringify(newBanRecord, null, 2),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerToast(
      language === 'vi'
        ? `Đã áp dụng lệnh khóa tài khoản cho ${targetName}!`
        : `Account suspension applied to ${targetName}!`,
      'info'
    );
    setIsCreateBanModalOpen(false);
    setBanNotes('');
  };

  const handleRestoreAccount = (recordId: string) => {
    const record = suspensions.find((r) => r.id === recordId);
    if (!record) return;

    setSuspensions((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'restored' } : r))
    );

    // Restore user/seller status
    if (record.targetRole === 'seller') {
      setSellers((prev) =>
        prev.map((s) => (s.id === record.targetId ? { ...s, status: 'active' } : s))
      );
    } else {
      const user = users.find((u) => u.id === record.targetId);
      if (user && user.status === 'suspended') {
        onToggleUserStatus(record.targetId);
      }
    }

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      adminName: 'Master Administrator',
      adminEmail: 'root.admin@flashcart.ai',
      action: 'UNLOCK_USER',
      actionLabel: 'Mở khóa phục hồi tài khoản',
      targetEntity: `${record.targetName} (${record.targetId})`,
      targetId: record.targetId,
      details: 'Khôi phục quyền hoạt động sau khi xét duyệt hồ sơ giải trình.',
      ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
      device: 'Chrome 128 / macOS Sequoia',
      severity: 'info',
      diffSnapshot: JSON.stringify({ recordId, restoredAt: new Date().toISOString() }, null, 2),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerToast(
      language === 'vi' ? `Đã mở khóa khôi phục cho ${record.targetName}!` : `Restored access for ${record.targetName}!`,
      'success'
    );
  };

  const handleToggleVoucherStatus = (voucherId: string) => {
    setPlatformVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          const nextStatus = v.status === 'active' ? 'paused' : 'active';
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  const handleCreatePlatformVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) {
      alert('Vui lòng nhập mã Voucher!');
      return;
    }

    const code = newVoucherCode.trim().toUpperCase();
    const newV: PlatformVoucher = {
      id: `pv-${Date.now()}`,
      code,
      title: newVoucherTitle.trim() || `Ưu đãi toàn sàn ${code}`,
      discountType: newVoucherType,
      discountValue: Number(newVoucherValue),
      minOrderValue: Number(newVoucherMinSpend),
      platformBudget: Number(newVoucherBudget),
      disbursedBudget: 0,
      maxUsage: Number(newVoucherMaxUsage),
      usedCount: 0,
      sponsorType: 'platform_100',
      startDate: new Date().toLocaleDateString('vi-VN'),
      endDate: '31/12/2026',
      status: 'active',
    };

    setPlatformVouchers((prev) => [newV, ...prev]);

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      adminName: 'Master Administrator',
      adminEmail: 'root.admin@flashcart.ai',
      action: 'CREATE_VOUCHER',
      actionLabel: 'Phát hành Voucher sàn mới',
      targetEntity: `${code} (Ngân sách ${Number(newVoucherBudget).toLocaleString('vi-VN')}₫)`,
      targetId: newV.id,
      details: `Khởi tạo chiến dịch Mega Voucher toàn sàn do TerraSweep tài trợ 100%.`,
      ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
      device: 'Chrome 128 / macOS Sequoia',
      severity: 'info',
      diffSnapshot: JSON.stringify(newV, null, 2),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerToast(
      language === 'vi'
        ? `Đã phát hành Voucher sàn "${code}" với ngân sách ${(newVoucherBudget / 1000000).toFixed(0)} triệu ₫!`
        : `Launched platform voucher "${code}"!`,
      'success'
    );

    setIsCreateVoucherModalOpen(false);
    setNewVoucherCode('');
    setNewVoucherTitle('');
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 sm:p-8 ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex items-start sm:items-center gap-3 sm:gap-5 min-w-0 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-800">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-foreground">{t('admin.title')}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                ROOT SUPERUSER
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Giám sát GMV toàn sàn, telemetry chuỗi cung ứng, phân quyền và kiểm soát rủi ro an ninh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-sky-50/60 border border-sky-200 text-xs font-sans font-semibold text-sky-950">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Hệ thống hoạt động ổn định • 99.98% SLA</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs (7 Tabs) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-200 pb-3" aria-label="Admin sections">
        <button
          onClick={() => setAdminTab('dashboard')}
          aria-pressed={adminTab === 'dashboard'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'dashboard'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Toàn Cảnh</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          aria-pressed={adminTab === 'users'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'users'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản Lý User ({users.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sellers')}
          aria-pressed={adminTab === 'sellers'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'sellers'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Quản Lý Seller ({sellers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          aria-pressed={adminTab === 'kyc'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
            adminTab === 'kyc'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Duyệt Seller (KYC)</span>
          {pendingKycCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-xs">
              {pendingKycCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('suspensions')}
          aria-pressed={adminTab === 'suspensions'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
            adminTab === 'suspensions'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Khóa Tài Khoản ({suspensions.filter((s) => s.status === 'active_ban').length})</span>
        </button>

        <button
          onClick={() => setAdminTab('vouchers')}
          aria-pressed={adminTab === 'vouchers'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'vouchers'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Voucher Toàn Sàn ({platformVouchers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          aria-pressed={adminTab === 'audit'}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'audit'
              ? 'btn-ocean-primary shadow-sm'
              : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Theo Dõi Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DASHBOARD TOÀN CẢNH & 5 ĐỒ THỊ TRỰC QUAN CAO CẤP */}
      {/* ========================================================================= */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* 4 Top KPI Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <DoubleBezelCard>
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Tổng GMV Toàn Sàn</span>
                <DollarSign className="w-4 h-4 text-sky-600" />
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
                4.280.950.000₫
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-sans mt-1.5 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% so với cùng kỳ tháng trước</span>
              </div>
            </DoubleBezelCard>

            <DoubleBezelCard>
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Tổng Đơn Vận Chuyển</span>
                <Activity className="w-4 h-4 text-sky-600" />
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
                {(totalOrdersCount + 18450).toLocaleString('vi-VN')} Đơn
              </div>
              <span className="text-xs text-slate-500 font-sans mt-1.5 block">
                99.2% tỷ lệ hoàn tất giao hàng thành công
              </span>
            </DoubleBezelCard>

            <DoubleBezelCard>
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Tài Khoản Hoạt Động</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
                {(users.length + 12840).toLocaleString('vi-VN')} Users
              </div>
              <span className="text-xs text-emerald-700 font-sans mt-1.5 block font-semibold">
                +342 tài khoản đăng ký mới hôm nay
              </span>
            </DoubleBezelCard>

            <DoubleBezelCard>
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Chỉ Số SLA & Uptime</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans tracking-tight tabular-nums">
                99.98%
              </div>
              <span className="text-xs text-slate-500 font-sans mt-1.5 block">
                Độ trễ API: 14ms • 0 sự cố hạ tầng
              </span>
            </DoubleBezelCard>
          </div>

          {/* Row 1 Charts: GMV Trend + Order Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueTrendChart />
            </div>
            <div className="lg:col-span-1">
              <OrderStatusDonutChart />
            </div>
          </div>

          {/* Row 2 Chart: Hourly Logistics Throughput */}
          <div>
            <LogisticsThroughputChart />
          </div>

          {/* Row 3 Charts: Category Market Share + Platform Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CategoryMarketShareChart />
            </div>
            <div>
              <PlatformConversionFunnelChart />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUẢN LÝ USER */}
      {/* ========================================================================= */}
      {adminTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm overflow-hidden relative">
            <div className="p-6 border-b border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  <span>Danh Sách Quản Trị Người Dùng & Phân Quyền</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kiểm soát tài khoản, thay đổi quyền truy cập role và xem dữ liệu tiêu dùng của người dùng
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Tìm tên hoặc email..."
                    className="pl-8 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-full md:w-48"
                  />
                </div>

                <OceanSelect
                  value={userRoleFilter}
                  onChange={(val) => setUserRoleFilter(val)}
                  options={[
                    { value: 'all', label: 'Tất cả Role' },
                    { value: 'customer', label: 'Customer (Khách)' },
                    { value: 'seller', label: 'Seller (Người bán)' },
                    { value: 'shipper', label: 'Shipper PRO' },
                    { value: 'admin', label: 'Admin (Quản trị)' },
                  ]}
                  variant="pill"
                  size="sm"
                  className="font-mono font-bold"
                />

                <OceanSelect
                  value={userStatusFilter}
                  onChange={(val) => setUserStatusFilter(val)}
                  options={[
                    { value: 'all', label: 'Tất cả trạng thái' },
                    { value: 'active', label: 'Hoạt động (Active)' },
                    { value: 'verified', label: 'Đã xác thực (Verified)' },
                    { value: 'suspended', label: 'Bị tạm khóa (Suspended)' },
                  ]}
                  variant="pill"
                  size="sm"
                  className="font-mono font-bold"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-5">Người Dùng</th>
                    <th className="p-5">Vai Trò (Role)</th>
                    <th className="p-5">Chỉ Số Giao Dịch</th>
                    <th className="p-5">Ngày Gia Nhập</th>
                    <th className="p-5">Trạng Thái</th>
                    <th className="p-5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter((u) => {
                      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                      const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
                      const matchesSearch =
                        !userSearchQuery ||
                        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
                      return matchesRole && matchesStatus && matchesSearch;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {user.status === 'verified' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</div>
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

                        <td className="p-5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedUserDetail(user)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            Hồ sơ
                          </button>

                          <button
                            onClick={() => handleToggleUserStatusAsync(user.id)}
                            disabled={togglingUserId === user.id}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border inline-flex items-center gap-1.5 disabled:opacity-60 ${
                              user.status === 'suspended'
                                ? 'btn-ocean-primary shadow-xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                            }`}
                          >
                            {togglingUserId === user.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : user.status === 'suspended' ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Mở khóa</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Khóa</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: QUẢN LÝ SELLER */}
      {/* ========================================================================= */}
      {adminTab === 'sellers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-sky-600" />
                  <span>Danh Bạ Gian Hàng & Quản Trị Phí Hoa Hồng Sàn</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Giám sát doanh số từng shop, điểm phạt Sao Quả Tạ vi phạm và điều chỉnh % phí sàn
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sellerSearchQuery}
                  onChange={(e) => setSellerSearchQuery(e.target.value)}
                  placeholder="Tìm tên shop hoặc chủ shop..."
                  className="w-full pl-8 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200">
              <table className="w-full text-left text-xs min-w-[860px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-5">Gian Hàng</th>
                    <th className="p-5">Chủ Gian Hàng</th>
                    <th className="p-5">Sản Phẩm & Doanh Số</th>
                    <th className="p-5">Đánh Giá</th>
                    <th className="p-5">Sao Quả Tạ</th>
                    <th className="p-5">Phí Sàn</th>
                    <th className="p-5">Trạng Thái</th>
                    <th className="p-5 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellers
                    .filter((s) =>
                      !sellerSearchQuery ||
                      s.shopName.toLowerCase().includes(sellerSearchQuery.toLowerCase()) ||
                      s.ownerName.toLowerCase().includes(sellerSearchQuery.toLowerCase())
                    )
                    .map((seller) => (
                      <tr key={seller.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={seller.avatar}
                              alt={seller.shopName}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                                <span>{seller.shopName}</span>
                                {seller.verifiedBadge && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-sky-100 text-sky-700">
                                    MALL
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                {seller.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="font-bold text-slate-900">{seller.ownerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{seller.phone}</div>
                        </td>

                        <td className="p-5 font-mono">
                          <div className="font-bold text-slate-900">
                            {seller.totalRevenue.toLocaleString('vi-VN')}₫
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {seller.productCount} sản phẩm niêm yết
                          </div>
                        </td>

                        <td className="p-5 font-mono">
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            ★ {seller.rating}
                          </span>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              seller.penaltyPoints === 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : seller.penaltyPoints < 5
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                            }`}
                          >
                            {seller.penaltyPoints}/15 Điểm
                          </span>
                        </td>

                        <td className="p-5 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sky-700 text-sm">
                              {seller.commissionRate}%
                            </span>
                            <button
                              onClick={() => {
                                setEditingCommissionSeller(seller);
                                setNewCommissionInput(seller.commissionRate);
                              }}
                              className="text-[10px] text-slate-500 hover:text-sky-600 font-bold underline cursor-pointer"
                            >
                              Sửa
                            </button>
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                              seller.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : seller.status === 'restricted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {seller.status}
                          </span>
                        </td>

                        <td className="p-5 text-right">
                          <button
                            onClick={() => {
                              setBanTargetId(seller.id);
                              setBanReason('Vi phạm tỷ lệ đơn hủy cao hoặc có dấu hiệu bán hàng không chính hãng');
                              setIsCreateBanModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                          >
                            Xử phạt
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DUYỆT SELLER (MERCHANT KYC) */}
      {/* ========================================================================= */}
      {adminTab === 'kyc' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <span>Thẩm Định Hồ Sơ Mở Gian Hàng (Merchant KYC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kiểm tra giấy phép ĐKKD, căn cước công dân và tài khoản thụ hưởng trước khi cấp quyền bán hàng
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
                    ? 'Tất cả'
                    : filter === 'pending'
                    ? `Chờ duyệt (${pendingKycCount})`
                    : filter === 'approved'
                    ? 'Đã duyệt'
                    : 'Đã từ chối'}
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
                  className="p-6 rounded-[28px] ocean-surface border border-sky-100/90 shadow-sm hover:border-sky-300 transition-all space-y-4 relative overflow-hidden"
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
                        ? 'Chờ kiểm duyệt'
                        : app.status === 'approved'
                        ? 'Đã phê duyệt'
                        : 'Đã từ chối'}
                    </span>
                  </div>

                  {/* KYC Details 3-Col Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-600" />
                        <span>Đại diện pháp lý</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.ownerName}</p>
                      <p className="text-slate-500">{app.phone} • {app.email}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Giấy phép ĐKKD</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.businessLicense}</p>
                      <button
                        onClick={() =>
                          setPreviewModal({
                            title: `Giấy Phép Kinh Doanh - ${app.shopName}`,
                            text: `Số GPKD: ${app.businessLicense}\nNgười đại diện: ${app.ownerName}\nNgành nghề: ${app.category}\nCơ quan cấp: Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh\nTrạng thái hồ sơ: Hợp lệ theo xác thực cổng dịch vụ công quốc gia.`,
                          })
                        }
                        className="text-[11px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Xem trích lục GPKD</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>Tài khoản thụ hưởng Payout</span>
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{app.bankAccount}</p>
                      <p className="text-slate-500">{app.bankName}</p>
                    </div>
                  </div>

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
                        Từ chối hồ sơ
                      </button>
                      <button
                        onClick={() => {
                          approveKyc(app.id);
                          const newLog: AdminAuditLog = {
                            id: `log-${Date.now()}`,
                            timestamp: new Date().toLocaleString('vi-VN'),
                            adminName: 'Master Administrator',
                            adminEmail: 'root.admin@flashcart.ai',
                            action: 'APPROVE_SELLER',
                            actionLabel: 'Phê duyệt hồ sơ mở shop (KYC)',
                            targetEntity: `${app.shopName} (#${app.id})`,
                            targetId: app.id,
                            details: `Đã xác thực GPKD ${app.businessLicense}. Cấp quyền kinh doanh Seller.`,
                            ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
                            device: 'Chrome 128 / macOS Sequoia',
                            severity: 'info',
                          };
                          setAuditLogs((prev) => [newLog, ...prev]);
                        }}
                        className="btn-ocean-primary px-6 py-2 rounded-full text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Phê duyệt mở shop</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KHÓA TÀI KHOẢN & XỬ LÝ VI PHẠM */}
      {/* ========================================================================= */}
      {adminTab === 'suspensions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Quản Trị Khóa Tài Khoản & Chế Tài Vi Phạm</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Áp dụng lệnh khóa tạm thời hoặc vĩnh viễn với các tài khoản gian lận, bán hàng giả hoặc spam
              </p>
            </div>

            <button
              onClick={() => setIsCreateBanModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Tạo Lệnh Khóa Tài Khoản Mới</span>
            </button>
          </div>

          {/* 3 Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-red-800 font-bold block">Tài khoản đang bị khóa</span>
                <span className="text-xl font-black text-red-950 font-mono">
                  {suspensions.filter((s) => s.status === 'active_ban').length} Tài khoản
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-amber-800 font-bold block">Đơn đang gửi kháng cáo</span>
                <span className="text-xl font-black text-amber-950 font-mono">
                  {suspensions.filter((s) => s.status === 'appealing').length} Đơn
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-800 font-bold block">Đã mở khóa phục hồi</span>
                <span className="text-xl font-black text-emerald-950 font-mono">
                  {suspensions.filter((s) => s.status === 'restored').length} Tài khoản
                </span>
              </div>
            </div>
          </div>

          {/* Suspensions Table */}
          <div className="ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200">
              <table className="w-full text-left text-xs min-w-[780px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-5">Đối Tượng Bị Khóa</th>
                    <th className="p-5">Vai Trò</th>
                    <th className="p-5">Lý Do Vi Phạm</th>
                    <th className="p-5">Thời Hạn Khóa</th>
                    <th className="p-5">Thời Điểm & Người Khóa</th>
                    <th className="p-5">Trạng Thái</th>
                    <th className="p-5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suspensions.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-slate-900 text-sm">{item.targetName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.targetEmail}</div>
                      </td>

                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700">
                          {item.targetRole}
                        </span>
                      </td>

                      <td className="p-5 max-w-xs">
                        <p className="text-slate-800 font-medium text-xs line-clamp-2">{item.reason}</p>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {item.notes}
                        </span>
                      </td>

                      <td className="p-5 font-mono font-bold">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] ${
                            item.duration === 'permanent'
                              ? 'bg-red-100 text-red-800 font-black'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.duration === 'permanent'
                            ? 'Vĩnh viễn (Permanent)'
                            : item.duration === '30_days'
                            ? '30 Ngày'
                            : '7 Ngày'}
                        </span>
                      </td>

                      <td className="p-5 font-mono text-[11px] text-slate-500">
                        <div>{item.suspendedAt}</div>
                        <div className="text-slate-400">{item.suspendedBy}</div>
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            item.status === 'active_ban'
                              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                              : item.status === 'appealing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {item.status === 'active_ban'
                            ? 'Đang bị khóa'
                            : item.status === 'appealing'
                            ? 'Đang kháng cáo'
                            : 'Đã phục hồi'}
                        </span>
                      </td>

                      <td className="p-5 text-right">
                        {item.status !== 'restored' && (
                          <button
                            onClick={() => handleRestoreAccount(item.id)}
                            className="btn-ocean-primary px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Mở khóa phục hồi</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: QUẢN LÝ VOUCHER TOÀN HỆ THỐNG */}
      {/* ========================================================================= */}
      {adminTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-sky-600" />
                <span>Quản Trị Chiến Dịch Voucher & Ngân Sách Khuyến Mãi Toàn Sàn</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Phát hành mã Freeship toàn sàn, trợ giá Mega Campaign và đo lường ROI kích cầu GMV
              </p>
            </div>

            <button
              onClick={() => setIsCreateVoucherModalOpen(true)}
              className="btn-ocean-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Voucher Toàn Sàn Mới</span>
            </button>
          </div>

          {/* 3 Budget Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <DoubleBezelCard>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Tổng Ngân Sách Sàn Phê Duyệt
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-2">
                500.000.000₫
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 block">
                Phân bổ cho Q1/2026
              </span>
            </DoubleBezelCard>

            <DoubleBezelCard>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Ngân Sách Đã Giải Ngân (Burn Rate)
              </span>
              <div className="text-2xl font-black text-sky-600 font-mono mt-2">
                182.400.000₫
              </div>
              <span className="text-xs text-sky-700 font-mono mt-1 block">
                Đạt 36.5% hạn mức giải ngân an toàn
              </span>
            </DoubleBezelCard>

            <DoubleBezelCard>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Doanh Thu GMV Kích Cầu (ROI)
              </span>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-2">
                1.280.000.000₫
              </div>
              <span className="text-xs text-emerald-700 font-mono mt-1 block">
                Hiệu suất ROI đạt 7.0x ngân sách bỏ ra
              </span>
            </DoubleBezelCard>
          </div>

          {/* Vouchers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {platformVouchers.map((v) => {
              const usagePercent = Math.min(100, Math.round((v.usedCount / v.maxUsage) * 100));
              const budgetPercent = Math.min(100, Math.round((v.disbursedBudget / v.platformBudget) * 100));

              return (
                <div
                  key={v.id}
                  className={`p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden space-y-4 ${
                    v.status === 'active'
                      ? 'ocean-surface border-sky-100/90 shadow-sm hover:border-sky-300'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-sky-600 text-white font-mono font-black text-xs tracking-wider">
                          {v.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-700">
                          {v.sponsorType === 'platform_100' ? 'SÀN TÀI TRỢ 100%' : 'ĐỒNG TÀI TRỢ'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-2">{v.title}</h4>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        v.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : v.status === 'paused'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  {/* Conditions */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mức giảm</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {v.discountType === 'percentage'
                          ? `Giảm ${v.discountValue}%`
                          : `Giảm ${v.discountValue.toLocaleString('vi-VN')}₫`}
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Đơn tối thiểu</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {v.minOrderValue.toLocaleString('vi-VN')}₫
                      </strong>
                    </div>
                  </div>

                  {/* Progress bars: Usage & Budget */}
                  <div className="space-y-2 text-[11px] font-mono">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span>Lượt dùng: {v.usedCount} / {v.maxUsage}</span>
                        <span className="font-bold text-sky-700">{usagePercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${usagePercent}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span>
                          Ngân sách: {(v.disbursedBudget / 1000000).toFixed(1)}M / {(v.platformBudget / 1000000).toFixed(1)}M ₫
                        </span>
                        <span className="font-bold text-emerald-700">{budgetPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${budgetPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Hạn dùng: {v.startDate} ➔ {v.endDate}
                    </span>

                    <button
                      onClick={() => handleToggleVoucherStatus(v.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                        v.status === 'active'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'btn-ocean-primary shadow-xs'
                      }`}
                    >
                      {v.status === 'active' ? 'Tạm dừng voucher' : 'Kích hoạt lại'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: THEO DÕI AUDIT LOG */}
      {/* ========================================================================= */}
      {adminTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-600" />
                <span>Nhật Ký Kiểm Toán An Ninh Bất Biến (Security Audit Trail)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ghi nhận mọi thao tác quản trị viên với mốc thời gian, IP mạng, thiết bị truy cập và đối tượng bị tác động
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  placeholder="Tìm hành động, đối tượng, IP..."
                  className="pl-8 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-48 sm:w-64"
                />
              </div>

              <OceanSelect
                value={auditFilterSeverity}
                onChange={(val) => setAuditFilterSeverity(val)}
                options={[
                  { value: 'all', label: 'Tất cả mức độ rủi ro' },
                  { value: 'info', label: 'Thông thường (INFO)' },
                  { value: 'warning', label: 'Cảnh báo (WARNING)' },
                  { value: 'critical', label: 'Nghiêm trọng (CRITICAL)' },
                ]}
                variant="pill"
                size="sm"
                className="font-mono font-bold"
              />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="ocean-surface rounded-[32px] border border-sky-100/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200">
              <table className="w-full text-left text-xs min-w-[820px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-5">Thời Gian</th>
                    <th className="p-5">Quản Trị Viên</th>
                    <th className="p-5">Hành Động</th>
                    <th className="p-5">Đối Tượng Tác Động</th>
                    <th className="p-5">Chi Tiết Thao Tác</th>
                    <th className="p-5">Địa Chỉ IP & Thiết Bị</th>
                    <th className="p-5 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs
                    .filter((log) => {
                      const matchesSeverity =
                        auditFilterSeverity === 'all' || log.severity === auditFilterSeverity;
                      const matchesSearch =
                        !auditSearchQuery ||
                        log.actionLabel.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                        log.targetEntity.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                        log.ipAddress.toLowerCase().includes(auditSearchQuery.toLowerCase());
                      return matchesSeverity && matchesSearch;
                    })
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="p-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        <td className="p-5">
                          <div className="font-bold text-slate-900">{log.adminName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.adminEmail}</div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border inline-block ${
                              log.severity === 'critical'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : log.severity === 'warning'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                            }`}
                          >
                            {log.actionLabel}
                          </span>
                        </td>

                        <td className="p-5 font-mono font-bold text-slate-800">
                          {log.targetEntity}
                        </td>

                        <td className="p-5 max-w-xs text-slate-600">
                          {log.details}
                        </td>

                        <td className="p-5 font-mono text-[11px] text-slate-400">
                          <div>{log.ipAddress}</div>
                          <div className="text-[10px] text-slate-400">{log.device}</div>
                        </td>

                        <td className="p-5 text-right">
                          <button
                            onClick={() => setSelectedAuditLog(log)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
                          >
                            Diff Snapshot
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Modal Điều Chỉnh Phí Sàn Hoa Hồng % */}
      {editingCommissionSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>Điều Chỉnh Phí Sàn Hoa Hồng (Commission Rate)</span>
              </h3>
              <button
                onClick={() => setEditingCommissionSeller(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{editingCommissionSeller.shopName}</p>
              <p className="text-slate-500 mt-0.5">Mức phí hiện tại: {editingCommissionSeller.commissionRate}%</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nhập mức phí hoa hồng sàn mới (%):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={newCommissionInput}
                  onChange={(e) => setNewCommissionInput(parseFloat(e.target.value) || 5.0)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Định mức chuẩn của hệ thống: 5.0% cho phân khúc Giày thể thao chính hãng.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingCommissionSeller(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCommission}
                className="btn-ocean-primary px-5 py-2 rounded-full text-xs font-bold shadow-xs cursor-pointer"
              >
                Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Tạo Lệnh Khóa Tài Khoản */}
      {isCreateBanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateBan}
            className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>Tạo Quyết Định Khóa Tài Khoản Vi Phạm</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateBanModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Chọn Tài Khoản Cần Khóa:
                </label>
                <OceanSelect
                  value={banTargetId}
                  onChange={(val) => setBanTargetId(val)}
                  variant="rounded"
                  size="md"
                  fullWidth
                  placeholder="-- Chọn User hoặc Shop --"
                  options={[
                    { value: '', label: '-- Chọn User hoặc Shop --' },
                    ...sellers.map((s) => ({
                      value: s.id,
                      label: `[SHOP] ${s.shopName} - ${s.ownerName}`,
                      group: 'Danh sách Shop',
                    })),
                    ...users.map((u) => ({
                      value: u.id,
                      label: `[${u.role.toUpperCase()}] ${u.name} - ${u.email}`,
                      group: 'Danh sách Người Dùng',
                    })),
                  ]}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Lý Do Xử Phạt Vi Phạm:
                </label>
                <OceanSelect
                  value={banReason}
                  onChange={(val) => setBanReason(val)}
                  variant="rounded"
                  size="md"
                  fullWidth
                  options={[
                    {
                      value: 'Kinh doanh hàng không rõ nguồn gốc, vi phạm bản quyền thương hiệu',
                      label: 'Bán hàng giả / hàng nhái thương hiệu (Điểm Sao Quả Tạ 15)',
                    },
                    {
                      value: 'Lạm dụng công cụ tự động (Bot script) cày voucher sàn & trục lợi',
                      label: 'Gian lận voucher, spam bot đặt đơn ảo',
                    },
                    {
                      value: 'Spam đánh giá giả mạo, vu khống đối thủ cạnh tranh',
                      label: 'Đánh giá ảo, vi phạm quy tắc cộng đồng',
                    },
                    {
                      value: 'Tỷ lệ hủy đơn hàng bất thường vượt quá 20%',
                      label: 'Tỷ lệ hủy đơn quá cao, không chuẩn bị hàng đúng hạn',
                    },
                    {
                      value: 'Chậm nộp tiền mặt COD đối soát quá thời hạn quy định',
                      label: 'Shipper giữ tiền COD quá hạn quy định',
                    },
                  ]}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Thời Hạn Áp Dụng:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '7_days', label: '7 Ngày' },
                    { id: '30_days', label: '30 Ngày' },
                    { id: 'permanent', label: 'Vĩnh Viễn (Ban)' },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setBanDuration(dur.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        banDuration === dur.id
                          ? 'bg-red-50 text-red-700 border-red-400 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ghi Chú Nội Bộ Kiểm Toán:
                </label>
                <textarea
                  rows={2}
                  value={banNotes}
                  onChange={(e) => setBanNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho biên bản kiểm toán an ninh..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateBanModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs cursor-pointer"
              >
                Ban Hành Lệnh Khóa
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal Tạo Voucher Toàn Sàn */}
      {isCreateVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreatePlatformVoucher}
            className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-sky-600" />
                <span>Phát Hành Mega Voucher Toàn Sàn Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateVoucherModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã Voucher (Code):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: FREESHIPMAX"
                    value={newVoucherCode}
                    onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Ưu Đãi:</label>
                  <OceanSelect
                    value={newVoucherType}
                    onChange={(val) => setNewVoucherType(val as any)}
                    variant="rounded"
                    size="md"
                    fullWidth
                    options={[
                      { value: 'shipping', label: 'Miễn phí vận chuyển (Freeship)' },
                      { value: 'fixed', label: 'Giảm tiền mặt cố định (₫)' },
                      { value: 'percentage', label: 'Giảm theo tỷ lệ (%)' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu Đề Ưu Đãi:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Siêu Sale Giày Sneaker - Giảm 50K Toàn Sàn"
                  value={newVoucherTitle}
                  onChange={(e) => setNewVoucherTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Giá Trị Giảm {newVoucherType === 'percentage' ? '(%)' : '(₫)'}:
                  </label>
                  <input
                    type="number"
                    required
                    value={newVoucherValue}
                    onChange={(e) => setNewVoucherValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đơn Tối Thiểu (₫):</label>
                  <input
                    type="number"
                    required
                    value={newVoucherMinSpend}
                    onChange={(e) => setNewVoucherMinSpend(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngân Sách Sàn Cấp (₫):</label>
                  <input
                    type="number"
                    required
                    value={newVoucherBudget}
                    onChange={(e) => setNewVoucherBudget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lượt Dùng Tối Đa:</label>
                  <input
                    type="number"
                    required
                    value={newVoucherMaxUsage}
                    onChange={(e) => setNewVoucherMaxUsage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateVoucherModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-ocean-primary px-6 py-2 rounded-full text-xs font-bold shadow-xs cursor-pointer"
              >
                Kích Hoạt Voucher Sàn
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Modal Chi Tiết Audit Log Snapshot */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-sky-600" />
                <span>Chi Tiết Nhật Ký Kiểm Toán An Ninh #{selectedAuditLog.id}</span>
              </h3>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-500">
                  <strong className="text-slate-900">Quản trị viên:</strong> {selectedAuditLog.adminName} ({selectedAuditLog.adminEmail})
                </p>
                <p className="text-slate-500">
                  <strong className="text-slate-900">Thời gian:</strong> {selectedAuditLog.timestamp}
                </p>
                <p className="text-slate-500">
                  <strong className="text-slate-900">IP & Thiết bị:</strong> {selectedAuditLog.ipAddress} • {selectedAuditLog.device}
                </p>
                <p className="text-slate-500">
                  <strong className="text-slate-900">Hành động:</strong> {selectedAuditLog.actionLabel}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Dữ Liệu Thay Đổi (Diff Snapshot JSON):
                </label>
                <pre className="p-3.5 rounded-2xl ocean-feature border border-sky-500/30 text-sky-700 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed shadow-inner">
                  {selectedAuditLog.diffSnapshot || JSON.stringify(selectedAuditLog, null, 2)}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedAuditLog(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

      {/* 5. Modal Chi Tiết Hồ Sơ User */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Thông Tin Hồ Sơ Người Dùng</span>
              </h3>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedUserDetail.avatar}
                alt={selectedUserDetail.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedUserDetail.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedUserDetail.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-100 text-sky-700">
                    Role: {selectedUserDetail.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
                    {selectedUserDetail.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Chỉ số tài khoản:</span>
                <p className="text-slate-900 font-mono font-bold mt-0.5">{selectedUserDetail.metric}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ngày đăng ký tham gia:</span>
                <p className="text-slate-900 font-mono mt-0.5">{selectedUserDetail.joinDate}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetail(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      )}

      {/* 6. Preview Document Modal */}
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
              {previewModal.text}
            </div>

            <button
              onClick={() => setPreviewModal(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
