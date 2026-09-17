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
  X
} from 'lucide-react';

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

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
    setShowAddModal(false);
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
            <p className="text-xs text-slate-500 font-mono mt-1">
              {t('seller.storeMeta')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs shadow-sky-500/25 transition-colors cursor-pointer"
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
          <div className="mt-3 text-2xl font-black text-[#0F172A] font-mono">
            {totalRevenue.toLocaleString('vi-VN')}₫
          </div>
          <span className="text-[11px] text-emerald-700 font-mono mt-1.5 block">
            {t('seller.kpiRevenueSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiPending')}</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#0F172A] font-mono">
            {pendingOrders.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1.5 block">
            {t('seller.kpiPendingSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiLowStock')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-amber-700 font-mono">
            {lowStockProducts.length} SKU
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1.5 block">
            {t('seller.kpiLowStockSub')}
          </span>
        </DoubleBezelCard>

        <DoubleBezelCard>
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{t('seller.kpiCompletionRate')}</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#0F172A] font-mono">
            99.4%
          </div>
          <span className="text-[11px] text-emerald-700 font-mono mt-1.5 block">
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
              ? 'bg-sky-600 text-white shadow-xs shadow-sky-500/25'
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
              ? 'bg-sky-600 text-white shadow-xs shadow-sky-500/25'
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
          <div className="p-6 border-b border-sky-100 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t('seller.tableTitle')}
            </h3>
            <span className="text-xs text-sky-700 font-mono font-medium">{t('seller.realtimeSync')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {order.createdAt}
                      </span>
                    </td>

                    <td className="p-5 max-w-xs">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{order.shippingAddress}</div>
                      <span className="text-[10px] text-slate-400 font-mono">SĐT: {order.customerPhone}</span>
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
                      <span className="block text-[10px] text-slate-400 font-normal">
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
                          onClick={() => onConfirmOrder(order.id)}
                          className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs shadow-sky-500/25 transition-colors cursor-pointer"
                        >
                          {t('seller.btnConfirmPackage')}
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
                      onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 5))}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => onUpdateStock(product.id, product.stock + 10)}
                      className="px-2.5 py-1 rounded-full bg-sky-600 text-white hover:bg-sky-700 text-xs font-bold cursor-pointer shadow-xs shadow-sky-500/20"
                    >
                      +10
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[28px] bg-white border border-slate-200 p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
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
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Running">{t('catalog.catRunning')}</option>
                  <option value="Lifestyle">{t('catalog.catLifestyle')}</option>
                  <option value="Basketball">{t('catalog.catBasketball')}</option>
                  <option value="Outdoor">{t('catalog.catOutdoor')}</option>
                  <option value="Cyber Audio">{t('catalog.catAudio')}</option>
                  <option value="Smart Wearables">{t('catalog.catWearables')}</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  {t('seller.btnCancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-700 cursor-pointer shadow-xs shadow-sky-500/25"
                >
                  {t('seller.btnSaveProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
