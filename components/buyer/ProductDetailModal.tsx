import React, { useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { X, Star } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant: string) => void;
  onBuyNow: (product: Product, quantity: number, variant: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  if (!product) return null;

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Pure White', hex: '#FFFFFF', border: true },
    { name: 'Stone Grey', hex: '#D9D9D9', border: false },
    { name: 'Mist Blue', hex: '#E2E8F0', border: false },
    { name: 'Jet Black', hex: '#0C0C0C', border: false },
  ];

  const priceUSD = Math.round(product.flashPrice / 25000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-4xl rounded-[32px] bg-gradient-to-b from-white via-sky-50/20 to-white/95 border border-sky-100 shadow-2xl overflow-hidden my-6 ambient-glow-sky"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 relative z-10">
          {/* LEFT COLUMN: LARGE ROUNDED IMAGE CONTAINER */}
          <div className="relative aspect-square w-full rounded-[28px] bg-slate-50 border border-sky-100/60 overflow-hidden flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />

            {/* Discount Badge if applicable */}
            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-600 text-white shadow-xs shadow-sky-500/25">
                -{product.discountPercent}% OFF
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DETAILS & CONTROLS */}
          <div className="flex flex-col justify-between space-y-6 relative">
            {/* Top Product Header & Circular Watermark Badge */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
                    {product.name.split('-')[0].trim()}{' '}
                    <span className="font-serif italic font-normal text-sky-800">
                      X1
                    </span>
                  </h2>

                  {/* Rating Stars & Reviews Count */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <div className="flex items-center text-amber-500">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span>{t('detail.reviewsCount', { count: product.reviewCount || 124 })}</span>
                  </div>
                </div>

                {/* Circular Stamp / Watermark */}
                <div className="hidden sm:flex relative w-16 h-16 items-center justify-center text-[8px] font-mono uppercase tracking-widest text-slate-400 select-none">
                  <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text fill="currentColor" fontSize="10" letterSpacing="2">
                      <textPath href="#circlePath">
                        TERRASWEEP • TERRASWEEP •
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute text-xs text-sky-500">✦</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#0F172A] font-mono">
                  ${priceUSD}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({product.flashPrice.toLocaleString('vi-VN')}₫)
                </span>
              </div>
            </div>

            {/* SELECT SIZE */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                {t('detail.selectSize')}
              </label>
              <div className="flex items-center gap-2.5">
                {sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-xs shadow-sky-500/25'
                          : 'bg-white border border-slate-200 text-slate-800 hover:border-sky-400'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLORS */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                {t('detail.colors')}
              </label>
              <div className="flex items-center gap-3">
                {colors.map((c) => {
                  const isSelected = selectedColor === c.hex;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative ${
                        isSelected ? 'ring-2 ring-sky-500 ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {c.border && (
                        <div className="absolute inset-0 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY & ADD TO CART ROW */}
            <div className="flex items-center gap-4 pt-1">
              {/* [- 1 +] Quantity Pill */}
              <div className="flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-mono">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-slate-500 hover:text-sky-600 font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="px-3 font-bold text-[#0F172A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2 text-slate-500 hover:text-sky-600 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Elongated Ocean Blue Pill "Add to Cart" Button */}
              <button
                onClick={() => {
                  onAddToCart(product, quantity, `${selectedSize} / ${selectedColor}`);
                  onClose();
                }}
                className="flex-1 py-3 px-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold tracking-tight shadow-md shadow-sky-500/25 transition-all cursor-pointer text-center active:scale-95"
              >
                {t('detail.addToCart')}
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#0F172A] block">
                {t('detail.description')}
              </span>
              <p className="text-slate-500 leading-relaxed">
                {product.description || t('detail.defaultDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
