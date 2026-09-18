'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { PortalHeader } from '@/components/common/PortalHeader';
import { AuthModal } from '@/components/common/AuthModal';
import { OceanSelect } from '@/components/common/OceanSelect';
import { DoubleBezelCard } from '@/components/common/DoubleBezelCard';
import { Product, ProductSizeVariant } from '@/types';
import { INITIAL_USERS } from '@/data/mockData';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Eye,
  Check,
  AlertCircle,
  RefreshCw,
  Layers,
  Boxes,
  Tag,
  DollarSign,
  ShieldCheck,
  Truck,
  BarChart3,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Package,
  ArrowRight,
  Info,
  Sliders,
  CheckSquare,
  Square,
  Palette,
} from 'lucide-react';

// Preset sample photo library for easy image assignment to size variants
const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Xanh Ocean Cyan (Mẫu Chính)',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    color: '#0284c7',
  },
  {
    name: 'Đen Onyx Shadow (Góc Nghiêng)',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    color: '#1e293b',
  },
  {
    name: 'Trắng Cloud White (Cận Cảnh)',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    color: '#e2e8f0',
  },
  {
    name: 'Cam Neon Sunset (Đế Giày)',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    color: '#f97316',
  },
  {
    name: 'Xám Titan Urban (Mặt Bên)',
    url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80',
    color: '#64748b',
  },
  {
    name: 'Xanh Navy Classic (Góc Trên)',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    color: '#1e3a8a',
  },
  {
    name: 'Đỏ Crimson Flare (Chi Tiết Logo)',
    url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    color: '#dc2626',
  },
  {
    name: 'Trắng Phối Bạc (Góc Đứng)',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    color: '#cbd5e1',
  },
];

const SIZE_PRESETS = [
  {
    id: 'men-shoes',
    labelVi: 'Giày Nam Chuẩn (39 - 44)',
    labelEn: 'Men Shoes (39 - 44)',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'women-shoes',
    labelVi: 'Giày Nữ Chuẩn (35 - 40)',
    labelEn: 'Women Shoes (35 - 40)',
    sizes: ['35', '36', '37', '38', '39', '40'],
  },
  {
    id: 'unisex-shoes',
    labelVi: 'Full Dải Sneaker (36 - 45)',
    labelEn: 'Unisex Full Range (36 - 45)',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'apparel',
    labelVi: 'Quần Áo Thể Thao (S - 3XL)',
    labelEn: 'Sportswear (S - 3XL)',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  },
  {
    id: 'free-size',
    labelVi: 'Phụ Kiện / FreeSize',
    labelEn: 'Accessories / FreeSize',
    sizes: ['FreeSize', 'OneSize'],
  },
];

function NewProductPageContent() {
  const router = useRouter();
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const {
    currentUser,
    setCurrentUser,
    activeRole,
    setActiveRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    addProduct,
  } = useCart();

  const sellerUser =
    currentUser?.role === 'seller'
      ? currentUser
      : INITIAL_USERS.find((u) => u.role === 'seller') || INITIAL_USERS[1];

  // --------------------------------------------------------------------------
  // BASIC INFO FORM STATE
  // --------------------------------------------------------------------------
  const [productName, setProductName] = useState('Giày Chạy Bộ TerraSweep Carbon X2 High-Performance');
  const [category, setCategory] = useState('Running');
  const [brand, setBrand] = useState('TerraSweep Flagship Official');
  const [baseSku, setBaseSku] = useState('TS-CARB-2026');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState(
    'Được trang bị đĩa sợi carbon nguyên khối toàn chiều dài kết hợp đế giữa bọt khí siêu đàn hồi TerraFoam Bio-Bounce. Trọng lượng siêu nhẹ chỉ 198g, hỗ trợ tối đa cho các cự ly chạy 10km, 21km và Marathon.'
  );
  const [material, setMaterial] = useState('Vải dệt FlyWeave thoáng khí + Sợi Carbon');
  const [origin, setOrigin] = useState('Việt Nam');
  const [warranty, setWarranty] = useState('12 tháng chính hãng (keo, chỉ, đệm khí)');
  const [weightGrams, setWeightGrams] = useState(650);
  const [pkgLength, setPkgLength] = useState(32);
  const [pkgWidth, setPkgWidth] = useState(22);
  const [pkgHeight, setPkgHeight] = useState(12);

  // --------------------------------------------------------------------------
  // MULTI-SIZE VARIANT MATRIX STATE (THE KEY USER REQUIREMENT)
  // --------------------------------------------------------------------------
  const [variants, setVariants] = useState<ProductSizeVariant[]>([
    {
      id: 'var-39',
      size: '39',
      sku: 'TS-CARB-39',
      price: 1350000,
      flashPrice: 950000,
      stock: 25,
      warehouseBay: 'KỆ-A1-01',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      id: 'var-40',
      size: '40',
      sku: 'TS-CARB-40',
      price: 1350000,
      flashPrice: 950000,
      stock: 45,
      warehouseBay: 'KỆ-A1-02',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      id: 'var-41',
      size: '41',
      sku: 'TS-CARB-41',
      price: 1350000,
      flashPrice: 950000,
      stock: 60,
      warehouseBay: 'KỆ-A1-03',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      id: 'var-42',
      size: '42',
      sku: 'TS-CARB-42',
      price: 1350000,
      flashPrice: 950000,
      stock: 35,
      warehouseBay: 'KỆ-A1-04',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      id: 'var-43',
      size: '43',
      sku: 'TS-CARB-43',
      price: 1350000,
      flashPrice: 950000,
      stock: 20,
      warehouseBay: 'KỆ-A1-05',
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80',
      isActive: true,
    },
  ]);

  // Selected size for live interactive preview
  const [previewSelectedVariantId, setPreviewSelectedVariantId] = useState<string>('var-39');

  // Custom size input
  const [customSizeText, setCustomSizeText] = useState('');

  // Batch Apply Toolbar state
  const [batchPrice, setBatchPrice] = useState('1350000');
  const [batchFlashPrice, setBatchFlashPrice] = useState('950000');
  const [batchStock, setBatchStock] = useState('30');
  const [batchWarehouseBay, setBatchWarehouseBay] = useState('KỆ-A1');
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  // Image Selector Modal/Drawer state
  const [photoPickerTargetVariantId, setPhotoPickerTargetVariantId] = useState<string | null>(null);

  // Status & Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // COMPUTED STATS
  // --------------------------------------------------------------------------
  const activeVariants = useMemo(() => variants.filter((v) => v.isActive), [variants]);

  const totalStockCount = useMemo(
    () => activeVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
    [activeVariants]
  );

  const priceRange = useMemo(() => {
    if (activeVariants.length === 0) return { min: 0, max: 0 };
    const prices = activeVariants.map((v) => Number(v.flashPrice) || Number(v.price) || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [activeVariants]);

  // The active variant currently being previewed in the right column
  const activePreviewVariant = useMemo(() => {
    return (
      variants.find((v) => v.id === previewSelectedVariantId) ||
      variants[0] || {
        id: 'fallback',
        size: '39',
        sku: 'TS-PREVIEW',
        price: 1350000,
        flashPrice: 950000,
        stock: 30,
        image: coverImage,
        warehouseBay: 'KỆ-A1',
        isActive: true,
      }
    );
  }, [variants, previewSelectedVariantId, coverImage]);

  // --------------------------------------------------------------------------
  // HANDLERS FOR MULTI-SIZE MATRIX
  // --------------------------------------------------------------------------
  const handleApplyPreset = (sizes: string[]) => {
    const newVariants: ProductSizeVariant[] = sizes.map((sz, index) => {
      // Keep existing variant data if already present
      const existing = variants.find((v) => v.size.toLowerCase() === sz.toLowerCase());
      if (existing) return existing;

      // Assign an attractive default photo from our curated preset images
      const presetImg = SAMPLE_PRESET_IMAGES[index % SAMPLE_PRESET_IMAGES.length].url;

      return {
        id: `var-${sz}-${Date.now()}-${index}`,
        size: sz,
        sku: `${baseSku || 'SKU'}-${sz}`,
        price: Number(batchPrice) || 1250000,
        flashPrice: Number(batchFlashPrice) || 890000,
        stock: Number(batchStock) || 25,
        warehouseBay: `KỆ-A1-0${index + 1}`,
        image: presetImg,
        isActive: true,
      };
    });

    setVariants(newVariants);
    if (newVariants.length > 0) {
      setPreviewSelectedVariantId(newVariants[0].id);
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customSizeText.trim().toUpperCase();
    if (!clean) return;

    if (variants.some((v) => v.size.toUpperCase() === clean)) {
      setValidationError(`Size "${clean}" đã tồn tại trong danh sách!`);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    const nextIndex = variants.length + 1;
    const assignedImage = SAMPLE_PRESET_IMAGES[(nextIndex - 1) % SAMPLE_PRESET_IMAGES.length].url;

    const newVar: ProductSizeVariant = {
      id: `var-${clean}-${Date.now()}`,
      size: clean,
      sku: `${baseSku || 'SKU'}-${clean}`,
      price: Number(batchPrice) || 1250000,
      flashPrice: Number(batchFlashPrice) || 890000,
      stock: Number(batchStock) || 20,
      warehouseBay: `KỆ-A1-0${nextIndex}`,
      image: assignedImage,
      isActive: true,
    };

    setVariants((prev) => [...prev, newVar]);
    setPreviewSelectedVariantId(newVar.id);
    setCustomSizeText('');
  };

  const handleUpdateVariantField = <K extends keyof ProductSizeVariant>(
    variantId: string,
    field: K,
    value: ProductSizeVariant[K]
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const handleDeleteVariant = (variantId: string) => {
    if (variants.length <= 1) {
      setValidationError('Sản phẩm cần có ít nhất 1 biến thể size để mở bán!');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    const remaining = variants.filter((v) => v.id !== variantId);
    setVariants(remaining);
    if (previewSelectedVariantId === variantId && remaining.length > 0) {
      setPreviewSelectedVariantId(remaining[0].id);
    }
  };

  const handleDuplicateVariant = (variant: ProductSizeVariant) => {
    const copySize = `${variant.size}-Copy`;
    const newVar: ProductSizeVariant = {
      ...variant,
      id: `var-${Date.now()}`,
      size: copySize,
      sku: `${variant.sku}-CP`,
    };
    setVariants((prev) => [...prev, newVar]);
  };

  // Batch apply values to either selected variants or all variants
  const handleApplyBatchValues = () => {
    const targetIds =
      selectedVariantIds.length > 0 ? selectedVariantIds : variants.map((v) => v.id);

    setVariants((prev) =>
      prev.map((v) => {
        if (!targetIds.includes(v.id)) return v;
        return {
          ...v,
          price: batchPrice ? Number(batchPrice) : v.price,
          flashPrice: batchFlashPrice ? Number(batchFlashPrice) : v.flashPrice,
          stock: batchStock ? Number(batchStock) : v.stock,
          warehouseBay: batchWarehouseBay ? batchWarehouseBay : v.warehouseBay,
        };
      })
    );

    setValidationError(null);
    setSubmitSuccessMessage(
      `Đã đồng bộ giá & tồn kho thành công cho ${targetIds.length} kích cỡ!`
    );
    setTimeout(() => setSubmitSuccessMessage(null), 3500);
  };

  const toggleSelectAll = () => {
    if (selectedVariantIds.length === variants.length) {
      setSelectedVariantIds([]);
    } else {
      setSelectedVariantIds(variants.map((v) => v.id));
    }
  };

  const toggleSelectVariant = (id: string) => {
    setSelectedVariantIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // --------------------------------------------------------------------------
  // FORM SUBMISSION (CREATE PRODUCT & REDIRECT)
  // --------------------------------------------------------------------------
  const handleSubmitProduct = (status: 'published' | 'draft' = 'published') => {
    if (!productName.trim()) {
      setValidationError('Vui lòng nhập Tên Sản Phẩm hợp lệ!');
      return;
    }

    if (variants.length === 0) {
      setValidationError('Vui lòng thêm ít nhất 1 biến thể size!');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    // Compute main pricing from variants
    const mainPrice = Number(variants[0]?.price) || 1250000;
    const mainFlashPrice = Number(variants[0]?.flashPrice) || 890000;
    const discountPercent = Math.max(
      0,
      Math.round(((mainPrice - mainFlashPrice) / mainPrice) * 100)
    );

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      originalPrice: mainPrice,
      flashPrice: mainFlashPrice,
      discountPercent: discountPercent,
      stock: totalStockCount,
      category: category,
      rating: 5.0,
      reviewCount: 0,
      salesCount: '0 đã bán',
      image: coverImage || variants[0]?.image || SAMPLE_PRESET_IMAGES[0].url,
      tags: ['New Arrival', category, 'Mall Official', 'Multi-Size Matrix'],
      badge: 'Mall',
      isFlashSale: true,
      soldProgress: 0,
      description: description,
      specs: {
        'Thương hiệu': brand,
        'Chất liệu': material,
        'Xuất xứ': origin,
        'Bảo hành': warranty,
        'Trọng lượng đóng gói': `${weightGrams}g`,
        'Kích thước hộp': `${pkgLength}x${pkgWidth}x${pkgHeight} cm`,
        'Biến thể kích cỡ': variants.map((v) => v.size).join(', '),
      },
      sellerName: brand,
      sizeVariants: variants,
      galleryImages: [
        coverImage,
        ...variants.map((v) => v.image).filter((img, idx, arr) => arr.indexOf(img) === idx),
      ],
      brand: brand,
      weightGrams: weightGrams,
    };

    setTimeout(() => {
      // Add product into CartContext global state
      addProduct(newProduct);

      setIsSubmitting(false);
      setSubmitSuccessMessage(
        status === 'published'
          ? `Đã đăng bán sản phẩm "${newProduct.name}" thành công với ${variants.length} biến thể size riêng biệt!`
          : `Đã lưu bản nháp sản phẩm "${newProduct.name}"!`
      );

      // Redirect back to seller dashboard according to rule
      setTimeout(() => {
        router.push('/seller');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 font-sans pb-24">
      {/* Top Portal Header */}
      <PortalHeader
        role="seller"
        portalTitle="TerraSweep Flagship Official"
        portalSubtitle="MERCHANT CENTER CONSOLE"
        portalBadge="VERIFIED MERCHANT"
        currentUser={sellerUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchToStorefront={() => {
          const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
          setCurrentUser(customerUser);
          setActiveRole('customer');
          router.push('/');
        }}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Breadcrumb Bar & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
              <button
                type="button"
                onClick={() => router.push('/seller')}
                className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer text-slate-500"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Kênh Bán Hàng' : 'Seller Portal'}</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span>{isVi ? 'Quản Lý Sản Phẩm' : 'Product Catalog'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60 font-semibold">
                {isVi ? 'Đăng Bán Đa Biến Thể Size & Ảnh' : 'Multi-Size & Image Matrix'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <span>{isVi ? 'Đăng Bán Sản Phẩm Mới' : 'Add New Product (Multi-Size)'}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-sky-100/80 text-sky-700 font-bold border border-sky-200">
                {isVi ? 'Ma Trận Size Độc Lập' : 'Size Matrix Active'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              {isVi
                ? 'Thiết lập danh mục sản phẩm có nhiều kích cỡ (38, 39, 40, 41, 42, 43, v.v.), gán ảnh thực tế cho từng size, định giá Flash Sale riêng biệt và phân bổ vị trí lưu kho tại Hub.'
                : 'Configure products with multiple sizes and distinct images per size variant, custom SKU pricing, and warehouse shelf coordinates.'}
            </p>
          </div>

          {/* Sticky Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => router.push('/seller')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isVi ? 'Hủy & Quay Lại' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmitProduct('draft')}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50/80 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isVi ? 'Lưu Bản Nháp' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmitProduct('published')}
              disabled={isSubmitting}
              className="btn-ocean-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isVi ? 'Đang Đăng Bán...' : 'Publishing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isVi ? 'Xuất Bản Ngay' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Toast Notifications */}
        {validationError && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs font-bold text-rose-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {submitSuccessMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{submitSuccessMessage}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* ================================================================= */}
          {/* LEFT COLUMN: MAIN SPECIFICATION FORMS & SIZE MATRIX (8 COLS)     */}
          {/* ================================================================= */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* CARD 1: BASIC INFORMATION */}
            <DoubleBezelCard
              title={isVi ? '1. Thông Tin Cơ Bản & Nhận Diện' : '1. Basic Information & Brand'}
              subtitle={isVi ? 'Tên sản phẩm, thương hiệu và định danh danh mục' : 'Product name, brand, category'}
              icon={<Tag className="w-4 h-4 text-sky-600" />}
            >
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>{isVi ? 'Tên sản phẩm chính thức *' : 'Official Product Name *'}</span>
                      <span className="text-[10px] text-slate-400">({productName.length}/120 ký tự)</span>
                    </label>
                    <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      SEO Tối Ưu
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={
                      isVi
                        ? 'Ví dụ: Giày Chạy Bộ Nam Terra Carbon X2 Đệm Khí Phản Lực...'
                        : 'e.g. Terra Carbon X2 High-Performance Running Shoes...'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      {isVi ? 'Danh mục ngành hàng' : 'Category'}
                    </label>
                    <OceanSelect
                      value={category}
                      onChange={(val) => setCategory(val)}
                      variant="rounded"
                      size="md"
                      fullWidth
                      options={[
                        { value: 'Running', label: isVi ? 'Giày Chạy Bộ (Running)' : 'Running Shoes' },
                        { value: 'Lifestyle', label: isVi ? 'Sneaker Thời Trang' : 'Lifestyle Sneakers' },
                        { value: 'Basketball', label: isVi ? 'Giày Bóng Rổ' : 'Basketball Shoes' },
                        { value: 'Streetwear', label: isVi ? 'Streetwear & Giày Vải' : 'Streetwear & Canvas' },
                        { value: 'Training', label: isVi ? 'Tập Gym & Fitness' : 'Training & Gym' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      {isVi ? 'Thương hiệu sản phẩm' : 'Brand Name'}
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="TerraSweep Flagship Official"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      {isVi ? 'Mã SKU gốc (Model Code)' : 'Base Model SKU'}
                    </label>
                    <input
                      type="text"
                      value={baseSku}
                      onChange={(e) => setBaseSku(e.target.value)}
                      placeholder="TS-CARB-2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Mô tả tóm tắt tính năng & công nghệ' : 'Product Description & Highlights'}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      isVi
                        ? 'Chi tiết công nghệ đệm khí, trọng lượng, chất liệu thân giày, độ bám đế...'
                        : 'Describe key cushioning features, upper materials, outsole grip...'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 bg-white leading-relaxed"
                  />
                </div>
              </div>
            </DoubleBezelCard>

            {/* CARD 2: MULTI-SIZE VARIANT MATRIX & PHOTOS (THE CORE NEW CAPABILITY) */}
            <DoubleBezelCard
              title={isVi ? '2. Ma Trận Kích Cỡ & Ảnh Từng Size (Multi-Size Matrix)' : '2. Multi-Size & Variant Photos Matrix'}
              subtitle={
                isVi
                  ? 'Thêm đồng thời nhiều size (39, 40, 41...), gắn ảnh đại diện riêng cho từng size và quản lý giá bán'
                  : 'Manage multiple sizes with individual photos, stock, and SKU barcodes'
              }
              icon={<Boxes className="w-4 h-4 text-sky-600" />}
            >
              <div className="space-y-5 text-xs">
                {/* 2.1 Quick Preset Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>{isVi ? 'Bộ Chọn Nhanh Kích Cỡ Mẫu:' : 'Quick Size Range Presets:'}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isVi ? 'Bấm vào để nạp nhanh danh sách size' : 'Click to populate sizes'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.sizes)}
                        className="px-3 py-1.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 hover:border-sky-400 text-sky-800 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-sky-600" />
                        <span>{isVi ? preset.labelVi : preset.labelEn}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-sky-100 rounded-md text-sky-700 font-mono">
                          {preset.sizes.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2.2 Add Custom Size Bar */}
                <form
                  onSubmit={handleAddCustomSize}
                  className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <span className="font-bold text-slate-700 shrink-0">
                    {isVi ? 'Thêm Size Tự Chọn:' : 'Add Custom Size:'}
                  </span>
                  <input
                    type="text"
                    value={customSizeText}
                    onChange={(e) => setCustomSizeText(e.target.value)}
                    placeholder={isVi ? 'Nhập size (VD: 38.5, 46, XXL...)' : 'e.g. 42.5, 46, XXL'}
                    className="w-48 px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold text-xs focus:outline-none focus:border-sky-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="btn-ocean-primary flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-bold cursor-pointer hover:shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isVi ? '+ Thêm Size Này' : '+ Add Size'}</span>
                  </button>
                  <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline">
                    {isVi ? 'Đang có' : 'Currently'} <strong className="text-slate-800 font-mono">{variants.length}</strong> {isVi ? 'biến thể size' : 'variants'}
                  </span>
                </form>

                {/* 2.3 Batch Apply Toolbar (Thao tác đồng loạt trên các size) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/80 via-white to-sky-50/80 border border-sky-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-sky-600" />
                      <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                        {isVi ? 'Thanh Công Cụ Thiết Lập Đồng Loạt (Batch Apply)' : 'Bulk Edit & Price Sync Toolbar'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {selectedVariantIds.length > 0
                        ? `${isVi ? 'Đang chọn' : 'Selected'} ${selectedVariantIds.length} size`
                        : `${isVi ? 'Áp dụng cho tất cả' : 'Applies to all'} ${variants.length} size`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">
                        {isVi ? 'Giá Niêm Yết (₫)' : 'Catalog Price (₫)'}
                      </span>
                      <input
                        type="number"
                        value={batchPrice}
                        onChange={(e) => setBatchPrice(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">
                        {isVi ? 'Giá Flash Sale (₫)' : 'Flash Sale Price (₫)'}
                      </span>
                      <input
                        type="number"
                        value={batchFlashPrice}
                        onChange={(e) => setBatchFlashPrice(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-sky-300 bg-white font-mono font-bold text-xs text-sky-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">
                        {isVi ? 'Tồn Kho Mỗi Size' : 'Stock Per Size'}
                      </span>
                      <input
                        type="number"
                        value={batchStock}
                        onChange={(e) => setBatchStock(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">
                        {isVi ? 'Kệ Hub Lưu Trữ' : 'Shelf Bay'}
                      </span>
                      <input
                        type="text"
                        value={batchWarehouseBay}
                        onChange={(e) => setBatchWarehouseBay(e.target.value)}
                        placeholder="KỆ-A1"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      {selectedVariantIds.length === variants.length ? (
                        <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>
                        {selectedVariantIds.length === variants.length
                          ? isVi ? 'Bỏ chọn tất cả' : 'Deselect all'
                          : isVi ? 'Chọn tất cả size' : 'Select all sizes'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyBatchValues}
                      className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Áp Dụng Đồng Loạt' : 'Apply to Selected'}</span>
                    </button>
                  </div>
                </div>

                {/* 2.4 Multi-Size Variant Matrix Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 w-8 text-center">#</th>
                        <th className="py-3 px-4 min-w-[90px]">{isVi ? 'Kích Cỡ' : 'Size'}</th>
                        <th className="py-3 px-4 min-w-[200px]">{isVi ? 'Ảnh Riêng Từng Size' : 'Variant Photo'}</th>
                        <th className="py-3 px-4 min-w-[130px]">{isVi ? 'Mã SKU' : 'SKU Code'}</th>
                        <th className="py-3 px-4 min-w-[130px]">{isVi ? 'Giá Niêm Yết' : 'Catalog Price'}</th>
                        <th className="py-3 px-4 min-w-[140px]">{isVi ? 'Giá Flash Sale' : 'Flash Price'}</th>
                        <th className="py-3 px-4 min-w-[90px] text-center">{isVi ? 'Tồn Kho' : 'Stock'}</th>
                        <th className="py-3 px-4 min-w-[110px]">{isVi ? 'Vị Trí Kệ' : 'Shelf Bay'}</th>
                        <th className="py-3 px-3 min-w-[70px] text-center">{isVi ? 'Xóa' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {variants.map((v, idx) => {
                        const isSelected = selectedVariantIds.includes(v.id);
                        const isPreviewing = previewSelectedVariantId === v.id;
                        const discount = Math.round(
                          ((Number(v.price) - Number(v.flashPrice)) / Number(v.price)) * 100
                        );

                        return (
                          <tr
                            key={v.id}
                            className={`transition-colors ${
                              isPreviewing
                                ? 'bg-sky-50/60 ring-1 ring-inset ring-sky-300'
                                : isSelected
                                ? 'bg-slate-50'
                                : 'hover:bg-slate-50/60'
                            }`}
                          >
                            {/* Checkbox select */}
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectVariant(v.id)}
                                className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                              />
                            </td>

                            {/* Size badge & preview trigger */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewSelectedVariantId(v.id)}
                                  className={`w-9 h-9 rounded-xl font-mono font-black text-xs flex items-center justify-center border transition-all cursor-pointer ${
                                    isPreviewing
                                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                      : 'bg-white text-slate-800 border-slate-300 hover:border-sky-400'
                                  }`}
                                  title={isVi ? 'Xem thử ảnh size này' : 'Preview this size photo'}
                                >
                                  {v.size}
                                </button>
                                {isPreviewing && (
                                  <span className="text-[9px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded uppercase">
                                    Live
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Individual photo for this size */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="relative group shrink-0">
                                  <img
                                    src={v.image || coverImage}
                                    alt={`Size ${v.size}`}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs bg-slate-100 group-hover:opacity-90 transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setPhotoPickerTargetVariantId(v.id)}
                                    className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-all cursor-pointer"
                                    title={isVi ? 'Đổi ảnh size này' : 'Change photo'}
                                  >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                  <input
                                    type="text"
                                    value={v.image}
                                    onChange={(e) => handleUpdateVariantField(v.id, 'image', e.target.value)}
                                    placeholder="URL ảnh riêng của size..."
                                    className="w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                                  />
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setPhotoPickerTargetVariantId(v.id)}
                                      className="text-[10px] text-sky-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <Palette className="w-3 h-3" />
                                      <span>{isVi ? 'Chọn ảnh mẫu' : 'Pick sample'}</span>
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateVariantField(v.id, 'image', coverImage)}
                                      className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer"
                                    >
                                      {isVi ? 'Dùng ảnh bìa' : 'Use cover'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* SKU Code */}
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => handleUpdateVariantField(v.id, 'sku', e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-mono font-bold text-slate-700 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                              />
                            </td>

                            {/* Catalog Price */}
                            <td className="py-3 px-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) =>
                                    handleUpdateVariantField(v.id, 'price', Number(e.target.value))
                                  }
                                  className="w-full px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 bg-white pr-6"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                                  ₫
                                </span>
                              </div>
                            </td>

                            {/* Flash Sale Price */}
                            <td className="py-3 px-4">
                              <div className="space-y-0.5">
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={v.flashPrice}
                                    onChange={(e) =>
                                      handleUpdateVariantField(v.id, 'flashPrice', Number(e.target.value))
                                    }
                                    className="w-full px-2.5 py-1 text-xs font-mono font-bold text-sky-600 rounded-lg border border-sky-300 focus:outline-none focus:border-sky-500 bg-white pr-6"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-sky-500 font-bold">
                                    ₫
                                  </span>
                                </div>
                                {discount > 0 && (
                                  <span className="text-[10px] text-amber-600 font-bold block">
                                    Giảm {discount}%
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Stock */}
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) =>
                                  handleUpdateVariantField(v.id, 'stock', Number(e.target.value))
                                }
                                className="w-16 mx-auto px-2 py-1 text-xs font-mono font-bold text-center rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                              />
                            </td>

                            {/* Warehouse Bay */}
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={v.warehouseBay || ''}
                                onChange={(e) =>
                                  handleUpdateVariantField(v.id, 'warehouseBay', e.target.value)
                                }
                                placeholder="KỆ-A1"
                                className="w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 bg-white uppercase"
                              />
                            </td>

                            {/* Actions: Duplicate & Delete */}
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateVariant(v)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                                  title={isVi ? 'Nhân bản size này' : 'Duplicate size'}
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVariant(v.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title={isVi ? 'Xóa size này' : 'Delete size'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quick Add Custom Size Link */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    {isVi
                      ? '* Mẹo: Mỗi size có thể có một ảnh màu sắc hoặc góc chụp khác nhau để khách hàng xem chi tiết từng size.'
                      : '* Tip: Each size can have a unique angle or colorway photo.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextSize = String(Number(variants[variants.length - 1]?.size || 43) + 1);
                      setCustomSizeText(nextSize);
                    }}
                    className="font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Đề xuất size tiếp theo' : 'Suggest next size'}</span>
                  </button>
                </div>
              </div>
            </DoubleBezelCard>

            {/* CARD 3: MASTER COVER & GALLERY MEDIA */}
            <DoubleBezelCard
              title={isVi ? '3. Ảnh Bìa & Thư Viện Tổng Thể' : '3. Master Cover & Gallery Photos'}
              subtitle={
                isVi
                  ? 'Ảnh đại diện chính hiển thị trên trang chủ tìm kiếm và thư viện sản phẩm'
                  : 'Main storefront thumbnail and overview gallery'
              }
              icon={<ImageIcon className="w-4 h-4 text-sky-600" />}
            >
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Ảnh Bìa Đại Diện Chính (Master Cover URL) *' : 'Master Cover Image URL *'}
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs bg-slate-50 shrink-0"
                    />
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-2">
                    {isVi ? 'Kho Ảnh Mẫu Sẵn Có (Bấm để chọn làm ảnh bìa):' : 'Sample Photos Library:'}
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {SAMPLE_PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCoverImage(img.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 aspect-square transition-all cursor-pointer ${
                          coverImage === img.url
                            ? 'border-sky-600 ring-2 ring-sky-300'
                            : 'border-slate-200 hover:border-sky-400'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {coverImage === img.url && (
                          <div className="absolute inset-0 bg-sky-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DoubleBezelCard>

            {/* CARD 4: LOGISTICS & PACKAGING SPECS */}
            <DoubleBezelCard
              title={isVi ? '4. Vận Chuyển & Kích Thước Đóng Gói Hub' : '4. Logistics & Hub Packaging'}
              subtitle={isVi ? 'Thông số dùng để tính cước vận chuyển chuẩn xác' : 'Accurate shipping fee specs'}
              icon={<Truck className="w-4 h-4 text-sky-600" />}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Trọng lượng (gram)' : 'Weight (grams)'}
                  </label>
                  <input
                    type="number"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Dài (cm)' : 'Length (cm)'}
                  </label>
                  <input
                    type="number"
                    value={pkgLength}
                    onChange={(e) => setPkgLength(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Rộng (cm)' : 'Width (cm)'}
                  </label>
                  <input
                    type="number"
                    value={pkgWidth}
                    onChange={(e) => setPkgWidth(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Cao (cm)' : 'Height (cm)'}
                  </label>
                  <input
                    type="number"
                    value={pkgHeight}
                    onChange={(e) => setPkgHeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Xuất xứ nguồn gốc' : 'Country of Origin'}
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    {isVi ? 'Chính sách bảo hành' : 'Warranty Policy'}
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
              </div>
            </DoubleBezelCard>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: STICKY INTERACTIVE LIVE PREVIEW & INVENTORY (4 COLS)*/}
          {/* ================================================================= */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* LIVE INTERACTIVE SHOPPER PREVIEW CARD */}
              <div className="p-5 rounded-[28px] bg-white border border-sky-200 shadow-lg space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {isVi ? 'Xem Thử Trực Quan Khách Xem' : 'Live Interactive Shopper Preview'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Real-Time
                  </span>
                </div>

                {/* Hero preview image dynamically driven by selected size */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-inner group">
                  <img
                    src={activePreviewVariant.image || coverImage}
                    alt={productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dynamic Size Indicator Badge */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3 h-3 text-sky-400" />
                    <span>
                      {isVi ? 'Ảnh của' : 'Photo of'}: <strong>Size {activePreviewVariant.size}</strong>
                    </span>
                  </div>

                  {/* Discount percent badge */}
                  {Number(activePreviewVariant.price) > Number(activePreviewVariant.flashPrice) && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-md font-mono">
                      -
                      {Math.round(
                        ((Number(activePreviewVariant.price) - Number(activePreviewVariant.flashPrice)) /
                          Number(activePreviewVariant.price)) *
                          100
                      )}
                      %
                    </div>
                  )}

                  {/* Shelf Bay locator badge */}
                  <div className="absolute bottom-3 right-3 bg-sky-950/70 backdrop-blur-md text-sky-300 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-sky-400/30">
                    {activePreviewVariant.warehouseBay || 'KỆ-A1'}
                  </div>
                </div>

                {/* Product Name & Brand */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                    {brand}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 line-clamp-2 mt-0.5">
                    {productName || (isVi ? 'Tên sản phẩm chưa nhập...' : 'Untitled Product...')}
                  </h3>
                </div>

                {/* Dynamic Price for Active Size */}
                <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
                  <span className="text-xl font-black text-rose-600 font-mono tabular-nums">
                    {(Number(activePreviewVariant.flashPrice) || 0).toLocaleString('vi-VN')}₫
                  </span>
                  {Number(activePreviewVariant.price) > Number(activePreviewVariant.flashPrice) && (
                    <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                      {(Number(activePreviewVariant.price) || 0).toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* INTERACTIVE SIZE SELECTOR PILLS: Clicking switches photo live! */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">
                      {isVi ? 'Chọn Size để đổi ảnh xem thử:' : 'Click Size to preview its photo:'}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {isVi ? 'Kho:' : 'Stock:'}{' '}
                      <strong className="text-slate-800">{activePreviewVariant.stock}</strong> đôi
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {variants.map((v) => {
                      const isSelected = v.id === previewSelectedVariantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setPreviewSelectedVariantId(v.id)}
                          className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs scale-105 ring-2 ring-sky-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{v.size}</span>
                          {v.image && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-sky-500'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Inventory Summary Box */}
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isVi ? 'Tổng số size:' : 'Total Sizes:'}</span>
                    <span className="font-mono font-black text-slate-900">
                      {variants.length} {isVi ? 'kích cỡ' : 'sizes'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isVi ? 'Tổng lượng tồn kho:' : 'Total Inventory:'}</span>
                    <span className="font-mono font-black text-emerald-600">
                      {totalStockCount} {isVi ? 'sản phẩm' : 'units'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isVi ? 'Dải giá bán:' : 'Price Range:'}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {priceRange.min.toLocaleString('vi-VN')}₫
                      {priceRange.max !== priceRange.min &&
                        ` - ${priceRange.max.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                </div>

                {/* Big Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSubmitProduct('published')}
                    disabled={isSubmitting}
                    className="w-full btn-ocean-primary py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isVi ? 'Đang Xuất Bản...' : 'Publishing...'}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isVi ? 'Xuất Bản Sản Phẩm Ngay' : 'Publish Product Now'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/seller')}
                    className="w-full py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    {isVi ? 'Quay Lại Kênh Bán Hàng' : 'Return to Seller Portal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* SAMPLE PHOTO PICKER MODAL                                             */}
      {/* ===================================================================== */}
      {photoPickerTargetVariantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isVi ? 'Chọn Ảnh Mẫu Cho Size' : 'Select Photo for Size'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isVi
                    ? 'Bấm vào một bức ảnh bên dưới để gán riêng cho kích cỡ này'
                    : 'Click a photo to assign to this variant'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPickerTargetVariantId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {SAMPLE_PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleUpdateVariantField(photoPickerTargetVariantId, 'image', img.url);
                    setPreviewSelectedVariantId(photoPickerTargetVariantId);
                    setPhotoPickerTargetVariantId(null);
                  }}
                  className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-500 hover:ring-2 hover:ring-sky-200 text-left transition-all cursor-pointer bg-white"
                >
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{img.name}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPhotoPickerTargetVariantId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for Switching Accounts if Needed */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={INITIAL_USERS}
        currentRole="seller"
        onLogin={(user, role) => {
          setCurrentUser(user);
          setActiveRole(role);
          if (role !== 'seller') {
            router.push('/');
          }
        }}
      />
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-600" />
            <p className="text-xs font-bold text-slate-500">Đang tải trang tạo sản phẩm...</p>
          </div>
        </div>
      }
    >
      <NewProductPageContent />
    </Suspense>
  );
}
