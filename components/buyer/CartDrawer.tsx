import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Loader2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay';
    shippingFee: number;
    discount: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const { t } = useLanguage();
  const [voucherCode, setVoucherCode] = useState('TERRA50');
  const [appliedDiscount, setAppliedDiscount] = useState(50000);
  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('express');
  const [customerName, setCustomerName] = useState('Phan Trịnh Tiến Đạt');
  const [customerPhone, setCustomerPhone] = useState('0988 777 666');
  const [shippingAddress, setShippingAddress] = useState('128 Minimalist Way, Q.1, TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState<'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay'>('ApplePay');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.flashPrice * item.quantity,
    0
  );
  const shippingFee = shippingMethod === 'express' ? 25000 : 0;
  const total = Math.max(0, subtotal - appliedDiscount + shippingFee);

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'TERRA50') {
      setAppliedDiscount(50000);
    } else if (voucherCode.toUpperCase() === 'STUDIO100') {
      setAppliedDiscount(100000);
    } else {
      setAppliedDiscount(20000);
    }
  };

  const router = useRouter();

  const handlePlaceOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
      router.push('/checkout');
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-md transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md ocean-surface border-l border-sky-100 shadow-2xl flex flex-col justify-between relative overflow-hidden ambient-glow-sky">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shadow-2xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{t('cart.title')}</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {t('cart.itemsCount', { count: cartItems.length })}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
                <p className="text-sm font-bold text-zinc-700">{t('cart.emptyTitle')}</p>
                <p className="text-xs text-zinc-400">{t('cart.emptySubtitle')}</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-white shrink-0 border border-zinc-200 p-1"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {t('cart.variant')}: {item.selectedColor || 'Standard'}
                    </span>
                    <div className="text-xs font-mono font-bold text-sky-600 mt-1">
                      {item.product.flashPrice.toLocaleString('vi-VN')}₫
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-2.5">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center rounded-full border border-slate-200 bg-white text-xs px-2 py-0.5 font-mono">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-1.5 text-slate-600 hover:text-sky-600 font-bold cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-2 font-bold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-1.5 text-slate-600 hover:text-sky-600 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <>
                {/* Minimal Voucher Box */}
                <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-sky-600" />
                      {t('cart.promoCode')}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono font-bold">
                      {t('cart.appliedDiscount', { amount: appliedDiscount.toLocaleString('vi-VN') })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder={t('cart.promoPlaceholder')}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 uppercase font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                    </input>
                    <button
                      onClick={handleApplyVoucher}
                      className="px-4 py-2 rounded-xl btn-ocean-primary text-xs font-bold cursor-pointer"
                    >
                      {t('common.apply')}
                    </button>
                  </div>
                </div>

                {/* Shipping Method Pills */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-foreground flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-sky-600" />
                    {t('cart.deliveryOption')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShippingMethod('express')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        shippingMethod === 'express'
                          ? 'border-sky-500 bg-sky-50/50 shadow-xs font-bold ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200'
                      }`}
                    >
                      <div className="font-bold text-xs text-foreground">{t('cart.expressDelivery')}</div>
                      <div className="text-[10px] text-sky-700 font-mono mt-0.5">25.000₫</div>
                    </button>
                    <button
                      onClick={() => setShippingMethod('standard')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-sky-500 bg-sky-50/50 shadow-xs font-bold ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200'
                      }`}
                    >
                      <div className="font-bold text-xs text-foreground">{t('cart.standardDelivery')}</div>
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5">{t('cart.standardFree')}</div>
                    </button>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <label className="font-bold text-foreground block">{t('cart.shippingInfoTitle')}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('cart.recipientName')}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={t('cart.shippingAddress')}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-mono tabular-nums text-slate-800">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t('cart.discount')}</span>
                  <span className="font-mono tabular-nums text-emerald-700">-{appliedDiscount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t('cart.shippingFee')}</span>
                  <span className="font-mono tabular-nums text-slate-800">+{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-slate-200">
                  <span>{t('cart.total')}</span>
                  <span className="text-lg font-mono font-black tabular-nums text-sky-600">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Elongated Ocean Blue Pill Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                aria-busy={isCheckingOut}
                className="w-full py-3.5 rounded-full btn-ocean-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t('cart.creatingOrder')}</span>
                  </div>
                ) : (
                  <>
                    <span>{t('cart.checkoutButton')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
