import React, { useState } from 'react';
import { Product, Order } from '@/types';
import { DoubleBezelCard } from '../common/DoubleBezelCard';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Store,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  DollarSign,
  Clock,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { OceanSelect } from '../common/OceanSelect';

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onConfirmOrder: (orderId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddNewProduct: (product: Partial<Product>) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  onConfirmOrder,
  onUpdateStock,
  onAddNewProduct,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('250000');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdCategory, setNewProdCategory] = useState('Running');

  // Stats calculation
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.total, 128450000);
  const lowStockProducts = products.filter((p) => p.stock < 20);

  const handleConfirmOrderAsync = (orderId: string) => {
    if (confirmingOrderId) return;
    setConfirmingOrderId(orderId);
    setTimeout(() => {
      onConfirmOrder(orderId);
      setConfirmingOrderId(null);
    }, 600);
  };

  const handleUpdateStockAsync = (productId: string, newStock: number) => {
    if (updatingStockId) return;
    setUpdatingStockId(productId);
    setTimeout(() => {
      onUpdateStock(productId, newStock);
      setUpdatingStockId(null);
    }, 350);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || isSubmittingProduct) return;

    setIsSubmittingProduct(true);
    setTimeout(() => {
      onAddNewProduct({
        id: `prod-${Date.now()}`,
        name: newProdName,
        originalPrice: Number(newProdPrice) * 1.4,
        flashPrice: Number(newProdPrice),
        discountPercent: 28,
        stock: Number(newProdStock),
        category: newProdCategory,
        rating: 5.0,
        reviewCount: 1,
        salesCount: '0 đã bán',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        tags: ['New Arrival', 'Official Drop'],
        badge: 'Yêu thích+',
        description: 'Sản phẩm mới tuyển chọn bổ sung vào danh mục TerraSweep.',
        specs: { 'Bảo hành': '12 tháng chính hãng', 'Tình trạng': 'Mới 100% Fullbox' },
        sellerName: 'TerraSweep Official Flagship',
      });

      setNewProdName('');
      setIsSubmittingProduct(false);
      setShowAddModal(false);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Top Banner: Store Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 bg-gradient-to-b from-white via-sky-50/25 to-white/95 rounded-[32px] border border-sky-100/90 shadow-sm relative overflow-hidden ambient-glow-sky">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#0F172A]">{t('seller.title')}</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                {t('seller.badge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              {t('seller.storeMeta')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-ocean-primary flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('seller.addNewProduct')}</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiRevenue')}</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            {totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <span className="text-xs text-emerald-700 font-sans mt-1.5 block">
            {t('seller.kpiRevenueSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiPending')}</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight tabular-nums">
            {pendingOrders.length}
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('seller.kpiPendingSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiLowStock')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-amber-600 font-sans tracking-tight tabular-nums">
            {lowStockProducts.length} SKU
          </div>
          <span className="text-xs text-slate-500 font-sans mt-1.5 block">
            {t('seller.kpiLowStockSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiCompletionRate')}</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans tracking-tight tabular-nums">
            99.4%
          </div>
          <span className="text-xs text-emerald-700 font-sans mt-1.5 block">
            {t('seller.kpiCompletionRateSub')}
          </span>
        </DoubleBezelCard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'btn-ocean-primary'
              : 'bg-white text-slate-600 hover:text-sky-600 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          {t('seller.tabOrdersQueue', { count: orders.length })}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'btn-ocean-primary'
              : 'bg-white text-slate-600 hover:text-sky-600 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          {t('seller.tabInventory', { count: products.length })}
        </button>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-gradient-to-b from-white via-sky-50/20 to-white/95 rounded-[32px] border border-sky-100/90 overflow-hidden shadow-sm relative">
          <div className="p-6 border-b border-sky-100 flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t('seller.tableTitle')}
            </h3>
            <div className="flex items-center gap-2">
              <span className="md:hidden text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/80">
                {language === 'vi' ? '← Cuộn ngang →' : '← Scroll table →'}
              </span>
              <span className="text-xs text-sky-700 font-mono font-medium">{t('seller.realtimeSync')}</span>
            </div>
          </div>

          <div className="relative group/table">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
              <table className="w-full text-left text-xs min-w-[680px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-5">{t('seller.colOrderId')}</th>
                    <th className="p-5">{t('seller.colCustomer')}</th>
                    <th className="p-5">{t('seller.colItems')}</th>
                    <th className="p-5">{t('seller.colTotal')}</th>
                    <th className="p-5">{t('seller.colStatus')}</th>
                    <th className="p-5 text-right">{t('seller.colAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-5 font-mono font-bold text-sky-600">
                        #{order.id}
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="p-5 max-w-xs">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{order.shippingAddress}</div>
                        <span className="text-[10px] text-slate-500 font-mono">SĐT: {order.customerPhone}</span>
                      </td>

                      <td className="p-5">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-slate-700">
                              <span className="font-mono font-bold text-sky-700">{item.quantity}x</span>{' '}
                              {item.product.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-5 font-mono font-bold text-[#0F172A] text-sm">
                        {order.total.toLocaleString('vi-VN')}₫
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            order.status === 'pending'
                              ? 'bg-sky-600 text-white border-sky-600 animate-pulse'
                              : order.status === 'confirmed'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : order.status === 'shipping'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-5 text-right">
                        {order.status === 'pending' ? (
                          <button
                            onClick={() => handleConfirmOrderAsync(order.id)}
                            disabled={confirmingOrderId === order.id}
                            aria-busy={confirmingOrderId === order.id}
                            className="btn-ocean-primary px-4 py-2 rounded-full font-bold text-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          >
                            {confirmingOrderId === order.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span>{language === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
                              </>
                            ) : (
                              <span>{t('seller.btnConfirmPackage')}</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1.5">
                            <Check className="w-4 h-4" /> {t('seller.statusApproved')}
                          </span>
                        )}
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
      )}

      {/* TAB 2: INVENTORY & STOCK MATRIX */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-[28px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100/90 shadow-sm flex gap-4 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/10 transition-all relative overflow-hidden ambient-glow-sky"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-2xl object-contain bg-slate-50 shrink-0 p-2 border border-slate-200"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] truncate">{product.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{product.category}</span>
                  <div className="text-xs font-mono font-bold text-sky-600 mt-1.5">
                    {product.flashPrice.toLocaleString('vi-VN')}₫
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className={`text-[11px] font-mono font-bold ${
                    product.stock < 15 ? 'text-red-600' : 'text-slate-800'
                  }`}>
                    {t('seller.stockCount', { count: product.stock })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateStockAsync(product.id, Math.max(0, product.stock - 5))}
                      disabled={updatingStockId === product.id}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleUpdateStockAsync(product.id, product.stock + 10)}
                      disabled={updatingStockId === product.id}
                      className="px-2.5 py-1 rounded-full bg-sky-600 text-white hover:bg-sky-700 text-xs font-bold cursor-pointer shadow-xs shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {updatingStockId === product.id ? (
                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                      ) : (
                        '+10'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-lg rounded-[28px] bg-white border border-slate-200 p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => !isSubmittingProduct && setShowAddModal(false)}
              disabled={isSubmittingProduct}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{t('seller.modalTitle')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t('seller.modalSubtitle')}</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">{t('seller.formProdName')}</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. TerraRunner X2 Minimalist Edition"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{t('seller.formProdPrice')}</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{t('seller.formProdStock')}</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">{t('seller.formProdCategory')}</label>
                <OceanSelect
                  value={newProdCategory}
                  onChange={(val) => setNewProdCategory(val)}
                  options={[
                    { value: 'Running', label: t('catalog.catRunning') },
                    { value: 'Lifestyle', label: t('catalog.catLifestyle') },
                    { value: 'Basketball', label: t('catalog.catBasketball') },
                    { value: 'Outdoor', label: t('catalog.catOutdoor') },
                    { value: 'Cyber Audio', label: t('catalog.catAudio') },
                    { value: 'Smart Wearables', label: t('catalog.catWearables') },
                  ]}
                  variant="rounded"
                  className="w-full justify-between py-2.5 px-4 rounded-2xl bg-slate-50 border-slate-200"
                  menuClassName="w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmittingProduct}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('seller.btnCancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  aria-busy={isSubmittingProduct}
                  className="btn-ocean-primary px-6 py-2.5 rounded-full font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{language === 'vi' ? 'Đang lưu...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{t('seller.btnSaveProduct')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
