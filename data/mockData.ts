import {
  Product,
  Order,
  PlatformUser,
  CategoryItem,
  TopSearchItem,
  AddressItem,
  MerchantKYCApplication,
  DisputeClaim,
  ProductReview,
  ShopVoucher,
  SellerAccount,
  PlatformVoucher,
  AdminAuditLog,
  AccountSuspensionRecord,
} from '@/types';

export const CATEGORY_LIST: CategoryItem[] = [
  // Hàng 1
  {
    id: 'cat-men-fashion',
    nameVi: 'Thời Trang Nam',
    nameEn: "Men's Fashion",
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Men Apparel',
  },
  {
    id: 'cat-phones',
    nameVi: 'Điện Thoại & Phụ Kiện',
    nameEn: 'Phones & Accessories',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Phones & Gadgets',
  },
  {
    id: 'cat-electronics',
    nameVi: 'Thiết Bị Điện Tử',
    nameEn: 'Consumer Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Cyber Audio',
  },
  {
    id: 'cat-computers',
    nameVi: 'Máy Tính & Laptop',
    nameEn: 'Computers & Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Gaming Gear',
  },
  {
    id: 'cat-cameras',
    nameVi: 'Máy Ảnh & Máy Quay Phim',
    nameEn: 'Cameras & Camcorders',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Cameras & Video',
  },
  {
    id: 'cat-watches',
    nameVi: 'Đồng Hồ',
    nameEn: 'Watches & Timepieces',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Smart Wearables',
  },
  {
    id: 'cat-men-shoes',
    nameVi: 'Giày Dép Nam',
    nameEn: "Men's Footwear",
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Footwear',
  },
  {
    id: 'cat-home-appliances',
    nameVi: 'Thiết Bị Điện Gia Dụng',
    nameEn: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Home Appliances',
  },
  {
    id: 'cat-sports',
    nameVi: 'Thể Thao & Du Lịch',
    nameEn: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Sports & Outdoors',
  },
  {
    id: 'cat-automotive',
    nameVi: 'Ô Tô & Xe Máy & Xe Đạp',
    nameEn: 'Automotive & Bikes',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Mobility',
  },

  // Hàng 2
  {
    id: 'cat-women-fashion',
    nameVi: 'Thời Trang Nữ',
    nameEn: "Women's Fashion",
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Women Apparel',
  },
  {
    id: 'cat-mother-baby',
    nameVi: 'Mẹ & Bé',
    nameEn: 'Mother & Baby',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Baby & Kids',
  },
  {
    id: 'cat-home-living',
    nameVi: 'Nhà Cửa & Đời Sống',
    nameEn: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Home & Living',
  },
  {
    id: 'cat-beauty',
    nameVi: 'Sắc Đẹp',
    nameEn: 'Beauty & Skincare',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Beauty',
  },
  {
    id: 'cat-health',
    nameVi: 'Sức Khỏe',
    nameEn: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Health & Care',
  },
  {
    id: 'cat-women-shoes',
    nameVi: 'Giày Dép Nữ',
    nameEn: "Women's Footwear",
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Women Footwear',
  },
  {
    id: 'cat-women-bags',
    nameVi: 'Túi Ví Nữ',
    nameEn: "Women's Bags & Wallets",
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Bags & Wallets',
  },
  {
    id: 'cat-jewelry',
    nameVi: 'Phụ Kiện & Trang Sức Nữ',
    nameEn: 'Jewelry & Accessories',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Jewelry',
  },
  {
    id: 'cat-groceries',
    nameVi: 'Bách Hóa Online',
    nameEn: 'Groceries & Mart',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Groceries',
  },
  {
    id: 'cat-books',
    nameVi: 'Nhà Sách Online',
    nameEn: 'Books & Stationery',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=240&auto=format&fit=crop&q=80',
    productCategory: 'Books',
  },
];

export const TOP_SEARCH_ITEMS: TopSearchItem[] = [
  {
    id: 'top-1',
    nameVi: "Nước Tẩy Trang L'Oreal Paris 3 In 1 Micellar Water",
    nameEn: "L'Oreal Paris 3-in-1 Micellar Water 400ml",
    salesMonthly: '177k+ / tháng',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    price: 169000,
    category: 'Beauty',
  },
  {
    id: 'top-2',
    nameVi: 'Giấy Vệ Sinh Cuộn MyAn Cao Cấp Lốc 10 Cuộn',
    nameEn: 'Premium MyAn Toilet Paper Rolls 10-Pack',
    salesMonthly: '171k+ / tháng',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&auto=format&fit=crop&q=80',
    price: 58000,
    category: 'Home & Living',
  },
  {
    id: 'top-3',
    nameVi: 'Mi Giả 3D Lụa Tự Nhiên Ami Eyelashes Cao Cấp',
    nameEn: 'Ami Premium 3D Natural Silk Eyelashes',
    salesMonthly: '148k+ / tháng',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&auto=format&fit=crop&q=80',
    price: 39000,
    category: 'Beauty',
  },
  {
    id: 'top-4',
    nameVi: 'Sữa Rửa Mặt Tạo Bọt CeraVe Foaming Cleanser 236ml',
    nameEn: 'CeraVe Foaming Facial Cleanser 236ml',
    salesMonthly: '139k+ / tháng',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    price: 320000,
    category: 'Beauty',
  },
  {
    id: 'top-5',
    nameVi: 'Quạt Mini Cầm Tay Tích Điện Pin 4000mAh Siêu Mát',
    nameEn: 'Portable Handheld Rechargeable Mini Fan 4000mAh',
    salesMonthly: '133k+ / tháng',
    image: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=500&auto=format&fit=crop&q=80',
    price: 89000,
    category: 'Home Appliances',
  },
  {
    id: 'top-6',
    nameVi: 'Quần Lót Nữ Cotton Kháng Khuẩn Không Viền Cao Cấp',
    nameEn: 'Seamless Antibacterial Women Cotton Briefs',
    salesMonthly: '119k+ / tháng',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=80',
    price: 28000,
    category: 'Women Apparel',
  },
  {
    id: 'top-7',
    nameVi: 'Cáp Sạc Nhanh C-to-Lightning Baseus 20W Chống Đứt',
    nameEn: 'Baseus 20W Fast Charging Cable C-to-Lightning',
    salesMonthly: '112k+ / tháng',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    price: 54500,
    category: 'Phones & Gadgets',
  },
  {
    id: 'top-8',
    nameVi: 'Cây Lau Nhà Tự Vắt Bông San Hô 45CM Kèm Bông Thay',
    nameEn: 'Self-Wringing 45CM Microfiber Flat Floor Mop',
    salesMonthly: '98k+ / tháng',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80',
    price: 199000,
    category: 'Home & Living',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- FLASH SALE HOT DROPS (SHOPEE STYLE ELEVATED) ---
  {
    id: 'prod-fs1',
    name: 'HONOR CHOICE Earbuds X7e - Tai Nghe Bluetooth Khử Ồn ANC, Pin 40H',
    originalPrice: 998000,
    flashPrice: 549000,
    discountPercent: 45,
    rating: 4.9,
    reviewCount: 2840,
    salesCount: '12k+ đã bán',
    stock: 5,
    category: 'Cyber Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    tags: ['Super Brand Day', 'ANC 40dB', 'Mall'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 95,
    description: 'Tai nghe Bluetooth True Wireless chống ồn chủ động kép 40dB, chất âm Hi-Res Audio, thời lượng pin 40 tiếng liên tục.',
    specs: {
      'Bluetooth': 'v5.3 Low-Latency',
      'Pin': '7h tai nghe + 33h hộp sạc',
      'Kháng nước': 'IPX5 Chuẩn Thể Thao',
    },
    sellerName: 'Honor Official Store',
  },
  {
    id: 'prod-fs2',
    name: 'Dép Quai Ngang Đi Trong Nhà Bánh Mì Siêu Êm Chân - EVA Đúc Nguyên Khối',
    originalPrice: 178000,
    flashPrice: 78200,
    discountPercent: 56,
    rating: 4.8,
    reviewCount: 9420,
    salesCount: '34k+ đã bán',
    stock: 140,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80',
    tags: ['EVA Đúc', 'Chống Trượt', 'Mall'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 88,
    description: 'Dép bánh mì chất liệu nhựa EVA siêu êm mềm nhẹ, chống trượt nước phòng tắm, bền bỉ nâng niu bàn chân.',
    specs: {
      'Chất liệu': 'EVA đúc nguyên khối',
      'Độ dày đế': '3.5 cm',
      'Trọng lượng': '180g / chiếc',
    },
    sellerName: 'Footwear Flagship Store',
  },
  {
    id: 'prod-fs3',
    name: 'Tai Nghe Thể Thao Dẫn Truyền Khí EDIFIER XT66 Pro - Màn Hình LED Kép, Bluetooth 5.4',
    originalPrice: 270000,
    flashPrice: 199000,
    discountPercent: 26,
    rating: 4.7,
    reviewCount: 1530,
    salesCount: '8.1k đã bán',
    stock: 62,
    category: 'Cyber Audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    tags: ['Air Conduction', 'Màn LED', 'Mall'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 72,
    description: 'Tai nghe dẫn truyền khí không nhét tai cực thoáng, vành tai silicon mềm không gây đau tai khi tập gym chạy bộ.',
    specs: {
      'Bluetooth': 'v5.4 Ultra Stable',
      'Màn hình': 'LED Digital Pin Kép',
      'Thời lượng': '48 giờ tổng hợp',
    },
    sellerName: 'Edifier Official Mall',
  },
  {
    id: 'prod-fs4',
    name: 'Súng Massage Cầm Tay 4 Đầu Chuyên Biệt - Giảm Căng Cơ 6 Cấp Độ Rung Sâu',
    originalPrice: 450000,
    flashPrice: 185000,
    discountPercent: 59,
    rating: 4.9,
    reviewCount: 3200,
    salesCount: '19k+ đã bán',
    stock: 48,
    category: 'Health & Care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    tags: ['Deep Tissue', '4 Đầu Phụ Kiện', 'Yêu thích+'],
    badge: 'Yêu thích+',
    isFlashSale: true,
    soldProgress: 84,
    description: 'Súng massage cơ bắp mini động cơ không chổi than mạnh mẽ, 6 tốc độ tác động sâu vào các mô cơ giảm đau mỏi tức thì.',
    specs: {
      'Tốc độ rung': '1800 - 3200 RPM',
      'Đầu massage': '4 đầu tháo rời đa năng',
      'Cổng sạc': 'Type-C tiện dụng',
    },
    sellerName: 'CarePro Health Official',
  },
  {
    id: 'prod-fs5',
    name: 'Cây Lau Nhà Tự Vắt Thông Minh Bản Rộng 45CM - Kèm 2 Bông Lau San Hô Microfiber',
    originalPrice: 450000,
    flashPrice: 199000,
    discountPercent: 56,
    rating: 4.8,
    reviewCount: 5120,
    salesCount: '27k+ đã bán',
    stock: 35,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
    tags: ['Bản Rộng 45cm', 'Tự Vắt Khô', 'Mall'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 91,
    description: 'Cây lau nhà phẳng khổ lớn 45cm cơ chế tự gạt vắt kiệt nước chỉ với một thao tác đẩy kéo, xoay linh hoạt 360 độ.',
    specs: {
      'Kích thước bàn lau': '45 x 12 cm',
      'Cán dài': '135 cm thép không gỉ',
      'Khăn lau': 'Sợi Microfiber cao cấp',
    },
    sellerName: 'Shopee Home Flagship',
  },
  {
    id: 'prod-fs6',
    name: 'Cáp Sạc Nhanh 100W Baseus Pudding Series Type-C to Type-C - Dây Bện Chống Đứt',
    originalPrice: 101000,
    flashPrice: 54500,
    discountPercent: 46,
    rating: 5.0,
    reviewCount: 14200,
    salesCount: '65k+ đã bán',
    stock: 80,
    category: 'Phones & Gadgets',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    tags: ['100W PD', 'E-Marker Chip', 'Mall'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 79,
    description: 'Cáp sạc nhanh 100W hỗ trợ giao thức sạc PD chuẩn cho Laptop MacBook, iPad và Smartphone Android.',
    specs: {
      'Công suất tối đa': '100W (20V/5A)',
      'Tốc độ truyền dữ liệu': '480 Mbps',
      'Chiều dài': '1.2 mét',
    },
    sellerName: 'Baseus Official Mall',
  },
  {
    id: 'prod-1',
    name: 'X15 Gaming TWS Earbuds - Đèn Led Cyber Neon, Pin 36H, Khử Ồn ANC',
    originalPrice: 380000,
    flashPrice: 145000,
    discountPercent: 62,
    rating: 4.9,
    reviewCount: 3420,
    salesCount: '10k+ đã bán',
    stock: 45,
    category: 'Cyber Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    tags: ['Flash Deal', 'Gaming ANC', 'Cyber Light'],
    badge: 'Yêu thích+',
    isFlashSale: true,
    soldProgress: 88,
    description: 'Tai nghe Bluetooth phong cách Cyberpunk không độ trễ Gaming Mode 45ms. Hỗ trợ màng loa sinh học 13mm cho âm bass cực căng.',
    specs: {
      'Bluetooth': 'v5.3 Low-Latency',
      'Pin': '6h tai nghe + 30h hộp sạc',
      'Kháng nước': 'IPX5 Chuẩn Thể Thao',
      'Đèn LED': 'RGB Breathing Effect'
    },
    sellerName: 'Flash Official Store'
  },
  {
    id: 'prod-2',
    name: 'Đồng Hồ Thông Minh Quantum Watch Ultra Gen 3 - Khung Titanium, Màn AMOLED 2.1"',
    originalPrice: 1850000,
    flashPrice: 650000,
    discountPercent: 65,
    rating: 4.8,
    reviewCount: 1890,
    salesCount: '4.8k đã bán',
    stock: 28,
    category: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    tags: ['Voucher Xtra', 'Titanium Case', 'ECG Sensor'],
    badge: 'Rẻ Vô Địch',
    isFlashSale: true,
    soldProgress: 75,
    description: 'Smartwatch siêu bền đạt chuẩn quân đội, đo nồng độ SpO2, nhịp tim liên tục 24/7 và hơn 120 chế độ luyện tập thể thao.',
    specs: {
      'Màn hình': '2.1" Super AMOLED 60Hz',
      'Thời lượng pin': '14 ngày sử dụng tiêu chuẩn',
      'Chống nước': '5ATM (Lặn biển 50m)',
      'Chất liệu': 'Hợp kim Titanium cấp hàng không'
    },
    sellerName: 'Nexus Tech Flagship'
  },
  {
    id: 'prod-3',
    name: 'Bàn Phím Cơ Cơ Khí CyberDeck 75% - Keycap Trong Suốt PBT, Hotswap RGB',
    originalPrice: 1200000,
    flashPrice: 489000,
    discountPercent: 59,
    rating: 5.0,
    reviewCount: 920,
    salesCount: '2.1k đã bán',
    stock: 14,
    category: 'Gaming Gear',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    tags: ['Hot Swap', 'Gasket Mount', 'Custom Sound'],
    badge: 'Mall',
    isFlashSale: true,
    soldProgress: 92,
    description: 'Bàn phím cơ cao cấp cấu trúc Gasket Mount êm ái, switch Silent Ice Crystal được lube sẵn từ nhà máy.',
    specs: {
      'Layout': '75% (82 phím + Núm xoay Metal)',
      'Kết nối': '3 Chế độ (Type-C / 2.4Ghz / BT 5.0)',
      'Trọng lượng': '980g'
    },
    sellerName: 'CyberGear Lab'
  },
  {
    id: 'prod-4',
    name: 'Đèn Bàn Neon Ambient Light Bar - Cảm Ứng Âm Thanh RGBIC, App Sync Wi-Fi',
    originalPrice: 420000,
    flashPrice: 189000,
    discountPercent: 55,
    rating: 4.7,
    reviewCount: 760,
    salesCount: '5.2k đã bán',
    stock: 60,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    tags: ['Rhythm Sync', 'Smart Home', 'RGBIC'],
    badge: 'Flash Voucher',
    isFlashSale: true,
    soldProgress: 64,
    description: 'Thanh đèn LED thông minh đồng bộ nhịp điệu âm nhạc, decor bàn làm việc setup streaming đỉnh cao.',
    specs: {
      'Công nghệ': 'RGBIC hiển thị đa màu cùng lúc',
      'Cổng nguồn': 'USB Type-C 5V/2A',
      'Điều khiển': 'Tuya Smart App / Remote RF'
    },
    sellerName: 'GlowStation Official'
  },
  {
    id: 'prod-5',
    name: 'Kính Thực Tế Ảo Neural Visor AR/VR Lite - Thấu Kính Pancake 4K, Trọng Lượng Siêu Nhẹ',
    originalPrice: 4500000,
    flashPrice: 2450000,
    discountPercent: 45,
    rating: 4.9,
    reviewCount: 310,
    salesCount: '620 đã bán',
    stock: 9,
    category: 'Cyber Vision',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80',
    tags: ['4K Pancake', 'Spatial Audio', '120Hz'],
    badge: 'Yêu thích+',
    isFlashSale: false,
    soldProgress: 45,
    description: 'Thiết bị kính không gian tích hợp cảm biến theo dõi mắt và cử chỉ bàn tay không cần tay cầm.',
    specs: {
      'Độ phân giải': 'Dual 3840 x 2160 Micro-OLED',
      'FOV': '110 độ góc nhìn rộng',
      'Trọng lượng': 'Chỉ 210g'
    },
    sellerName: 'HoloDimension Global'
  },
  {
    id: 'prod-6',
    name: 'Củ Sạc Nhanh FlashCharge GaN 100W - 4 Cổng Type-C PD3.0, Kích Thước Bỏ Túi',
    originalPrice: 650000,
    flashPrice: 279000,
    discountPercent: 57,
    rating: 4.9,
    reviewCount: 4120,
    salesCount: '15k+ đã bán',
    stock: 120,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    tags: ['GaN V', '100W Max', 'Cold Charge'],
    badge: 'Rẻ Vô Địch',
    isFlashSale: true,
    soldProgress: 95,
    description: 'Công nghệ bán dẫn Gallium Nitride thế hệ thứ 5 giúp tỏa nhiệt cực thấp, sạc cùng lúc MacBook, iPhone và iPad.',
    specs: {
      'Công suất': 'Tối đa 100W PPS/PD 3.0',
      'Cổng ra': '3x USB-C + 1x USB-A',
      'Bảo vệ': 'Tự ngắt khi đầy, chống đoản mạch'
    },
    sellerName: 'Flash Official Store'
  },
  {
    id: 'prod-7',
    name: 'Áo Khoác CyberTech Chống Nước Phản Quang Nano - Khóa Zip Nam Châm Fidlock',
    originalPrice: 950000,
    flashPrice: 420000,
    discountPercent: 56,
    rating: 4.8,
    reviewCount: 540,
    salesCount: '1.4k đã bán',
    stock: 35,
    category: 'Neo Apparel',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    tags: ['GoreTex Tech', 'Fidlock Magnetic', 'Reflective'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 50,
    description: 'Chất liệu vải Nano 3 lớp chống bão gió và trượt nước tuyệt đối, chi tiết phản quang neon nổi bật trong bóng tối.',
    specs: {
      'Chất liệu': '3L Ripstop Tech-Fiber',
      'Khóa': 'Nam châm Fidlock Quick-Release',
      'Túi': '4 túi bí mật kháng nước'
    },
    sellerName: 'UrbanNeo Apparel'
  },
  {
    id: 'prod-8',
    name: 'Đế Sạc Không Dây Từ Tính MagFlash 3-in-1 Floating Stand - Hợp Kim Nhôm CNC',
    originalPrice: 790000,
    flashPrice: 329000,
    discountPercent: 58,
    rating: 4.9,
    reviewCount: 1650,
    salesCount: '6.7k đã bán',
    stock: 50,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    tags: ['MagSafe 15W', 'Floating Stand', 'CNC Aluminum'],
    badge: 'Yêu thích',
    isFlashSale: true,
    soldProgress: 82,
    description: 'Thiết kế lơ lửng không gian tối giản, sạc đồng thời Điện thoại, Tai nghe và Đồng hồ chỉ với 1 dây cáp duy nhất.',
    specs: {
      'Lực hút': 'Nam châm N52 cường độ cao',
      'Góc xoay': 'Xoay 360 độ ngang/dọc linh hoạt',
      'Màu sắc': 'Space Gray / Cyber Silver'
    },
    sellerName: 'Flash Official Store'
  },
  {
    id: 'prod-9',
    name: 'TerraRunner X1 High-Top Sneaker - Khung Điêu Khắc Đệm Khí Không Trọng Lực',
    originalPrice: 3800000,
    flashPrice: 2450000,
    discountPercent: 35,
    rating: 5.0,
    reviewCount: 780,
    salesCount: '3.2k đã bán',
    stock: 22,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Nubuck Leather', 'Air Pods', 'Drop 01'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 45,
    description: 'Sneaker cao cấp kiến trúc tương lai, da nubuck thuộc thảo mộc từ Ý kết hợp đế đệm khí TPU đàn hồi hấp thụ xung chấn 98%.',
    specs: {
      'Thân giày': 'Full-Grain Italian Nubuck',
      'Đế ngoài': 'Lớp cao su đúc nguyên khối',
      'Trọng lượng': '395g',
    },
    sellerName: 'TerraSweep Official Flagship',
  },
  {
    id: 'prod-10',
    name: 'VoidWalk Low Noir - Giày Sneaker Tối Giản Vải Cordura Chống Rách Đen Nhám',
    originalPrice: 2900000,
    flashPrice: 1950000,
    discountPercent: 32,
    rating: 4.9,
    reviewCount: 920,
    salesCount: '4.5k đã bán',
    stock: 30,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80',
    tags: ['Cordura Tech', 'Minimalist Black', 'Waterproof'],
    badge: 'Yêu thích+',
    isFlashSale: false,
    soldProgress: 60,
    description: 'Dòng giày tối giản thuần đen chống nước, bề mặt phủ Nano kháng khuẩn và lót bọt nhớ memory foam siêu êm ái.',
    specs: {
      'Chất liệu': 'Cordura 1000D Ballistic',
      'Lót giày': 'OrthoLite Eco Lớp Kép',
      'Xuất xứ': 'Sản xuất thủ công tiêu chuẩn EU',
    },
    sellerName: 'TerraSweep Official Flagship',
  },
  {
    id: 'prod-11',
    name: 'Apex Drift Track Runner - Đế Gai Vibram Địa Hình, Khóa Vặn BOA Tự Động',
    originalPrice: 3950000,
    flashPrice: 2680000,
    discountPercent: 32,
    rating: 4.9,
    reviewCount: 640,
    salesCount: '1.9k đã bán',
    stock: 15,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    tags: ['Vibram Megagrip', 'BOA Fit System', 'Carbon Plate'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 70,
    description: 'Giày chạy bộ việt dã đỉnh cao trang bị đĩa đệm Carbon trợ lực bước chạy và đế ngoài cao su gai Vibram Megagrip bám dính mọi bề mặt.',
    specs: {
      'Đế ngoài': 'Vibram Megagrip 5mm Lugs',
      'Hệ thống dây': 'BOA Li2 Dial Dual-Zone',
      'Tấm đệm': 'Full-length Carbon Fiber Plate',
    },
    sellerName: 'TerraSweep Official Flagship',
  },
  {
    id: 'prod-12',
    name: 'Áo Hoodie Heavyweight Architectural Drop - Cotton Pháp Định Lượng 450GSM',
    originalPrice: 1100000,
    flashPrice: 590000,
    discountPercent: 46,
    rating: 4.8,
    reviewCount: 1450,
    salesCount: '7.8k đã bán',
    stock: 55,
    category: 'Men Apparel',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    tags: ['French Terry 450GSM', 'Boxy Fit', 'Yêu thích+'],
    badge: 'Yêu thích+',
    isFlashSale: false,
    soldProgress: 68,
    description: 'Áo hoodie phom dáng rộng Boxy Fit kiến trúc, vải dệt bông chải kỹ định lượng cao giữ phom đứng dáng suốt cả ngày.',
    specs: {
      'Chất liệu': '100% Organic French Terry Cotton',
      'Định lượng': '450 GSM Heavyweight',
      'Chi tiết': 'Bo chun co giãn gân dày dặn',
    },
    sellerName: 'UrbanNeo Apparel',
  },
  {
    id: 'prod-13',
    name: 'Quần Dài Minimalist Cargo Pocket - Khóa Kéo Chống Nước YKK Aquaguard',
    originalPrice: 950000,
    flashPrice: 480000,
    discountPercent: 49,
    rating: 4.9,
    reviewCount: 1120,
    salesCount: '5.4k đã bán',
    stock: 42,
    category: 'Men Apparel',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    tags: ['YKK Aquaguard', 'Ergonomic Cut', 'Stretch Ripstop'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 55,
    description: 'Quần túi hộp phom suông tối giản với các túi giấu đường may tinh tế, chất vải Ripstop chống xé giãn nhẹ 4 chiều.',
    specs: {
      'Chất liệu': 'Cotton-Nylon Blend Co giãn 4 chiều',
      'Khóa kéo': 'YKK Aquaguard Matte Black',
      'Ống quần': 'Tích hợp dây rút điều chỉnh dáng',
    },
    sellerName: 'UrbanNeo Apparel',
  },
  {
    id: 'prod-14',
    name: 'Túi Đeo Chéo Da Thuần Chay Terra Arc - Thiết Kế Điêu Khắc Tối Giản',
    originalPrice: 1450000,
    flashPrice: 790000,
    discountPercent: 45,
    rating: 4.9,
    reviewCount: 880,
    salesCount: '2.6k đã bán',
    stock: 18,
    category: 'Bags & Wallets',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegan Leather', 'Sculptural Form', 'Mall'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 80,
    description: 'Túi xách phom hình học điêu khắc chế tác từ da thực vật cao cấp chống trầy xước, khóa kim loại mạ crom sáng bóng.',
    specs: {
      'Chất liệu': 'Eco Vegan Microfiber Leather',
      'Kích thước': '24 x 16 x 8 cm',
      'Dây đeo': 'Dây da điều chỉnh độ dài linh hoạt',
    },
    sellerName: 'TerraSweep Official Flagship',
  },
  {
    id: 'prod-15',
    name: 'Đồng Hồ Cơ Nam Skeleton Horizon Ultra - Kính Sapphire Khung Thép 316L',
    originalPrice: 5200000,
    flashPrice: 3150000,
    discountPercent: 39,
    rating: 5.0,
    reviewCount: 420,
    salesCount: '1.1k đã bán',
    stock: 12,
    category: 'Smart Wearables',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
    tags: ['Miyota Automatic', 'Sapphire Crystal', '5ATM'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 65,
    description: 'Đồng hồ cơ lộ máy toàn phần phô diễn chuyển động bánh đà tinh xảo, kính Sapphire nguyên khối chống trầy tuyệt đối.',
    specs: {
      'Bộ máy': 'Automatic 21 chân kính tự động',
      'Kính': 'Sapphire Crystal tráng chống lóa',
      'Kháng nước': '50M / 5 ATM',
    },
    sellerName: 'Nexus Tech Flagship',
  },
  {
    id: 'prod-16',
    name: 'Sữa Dưỡng Ẩm Phục Hồi Hàng Rào Bảo Vệ Da CeraVe Daily Moisturizing 236ml',
    originalPrice: 390000,
    flashPrice: 285000,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 15400,
    salesCount: '45k+ đã bán',
    stock: 200,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228722-d0b5d9213197?w=600&auto=format&fit=crop&q=80',
    tags: ['3 Essential Ceramides', 'Hyaluronic Acid', 'Mall'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 85,
    description: 'Sữa dưỡng ẩm chứa 3 loại Ceramides thiết yếu và Hyaluronic Acid giúp phục hồi hàng rào ẩm tự nhiên của da.',
    specs: {
      'Dung tích': '236ml',
      'Loại da': 'Mọi loại da kể cả da nhạy cảm',
      'Công nghệ': 'MVE Delivery Technology giải phóng dưỡng chất suốt 24h',
    },
    sellerName: 'Beauty Care Official',
  },
  {
    id: 'prod-17',
    name: 'Nước Tẩy Trang L\'Oreal Paris Micellar Water 3 In 1 Tươi Mát Cho Da Dầu 400ml',
    originalPrice: 229000,
    flashPrice: 169000,
    discountPercent: 26,
    rating: 4.9,
    reviewCount: 38900,
    salesCount: '177k+ đã bán',
    stock: 350,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['Micellar Technology', 'Kiềm Dầu', 'Mall'],
    badge: 'Mall',
    isFlashSale: false,
    soldProgress: 98,
    description: 'Nước tẩy trang làm sạch sâu cặn trang điểm và dầu nhờn, không cồn không gây khô ráp hay kích ứng da.',
    specs: {
      'Dung tích': '400ml',
      'Thành phần': 'Công nghệ Micellar Water & Khoáng chất từ Pháp',
      'Hạn sử dụng': '3 năm kể từ ngày sản xuất',
    },
    sellerName: 'L\'Oreal Paris Official Mall',
  },
  {
    id: 'prod-18',
    name: 'Quạt Cầm Tay Mini Pin 4000mAh Tích Hợp Đèn LED - Động Cơ Không Chổi Than Siêu Êm',
    originalPrice: 159000,
    flashPrice: 89000,
    discountPercent: 44,
    rating: 4.8,
    reviewCount: 18200,
    salesCount: '133k+ đã bán',
    stock: 120,
    category: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=600&auto=format&fit=crop&q=80',
    tags: ['Pin 4000mAh', '3 Cấp Gió', 'Yêu thích+'],
    badge: 'Yêu thích+',
    isFlashSale: false,
    soldProgress: 90,
    description: 'Quạt mini nhỏ gọn tiện bỏ túi đi học đi làm, thời lượng pin liên tục lên đến 16 tiếng với 3 cấp độ gió mát lạnh.',
    specs: {
      'Dung lượng pin': '4000mAh Lithium Ion',
      'Cổng sạc': 'Type-C hỗ trợ sạc nhanh',
      'Trọng lượng': '145g',
    },
    sellerName: 'SmartHome Gadgets Store',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FC-98421',
    customerName: 'Nguyễn Thành Nam',
    customerPhone: '0984***219',
    shippingAddress: 'Toà Nhà Bitexco, Q.1, TP. Hồ Chí Minh',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        price: 145000
      },
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 1,
        price: 279000
      }
    ],
    subtotal: 424000,
    discount: 50000,
    shippingFee: 18000,
    total: 392000,
    status: 'shipping',
    paymentMethod: 'FlashPay',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Flash Express)',
    qrCode: 'FC-98421-QR-SECURE',
    createdAt: '10:24 - Hôm nay',
    deliveryNote: 'Giao giờ hành chính, gọi trước 10 phút',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '10:24 AM',
        location: 'FlashCart Hệ Thống',
        note: 'Đơn hàng được khởi tạo thành công qua FlashPay',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Shop đã xác nhận',
        timestamp: '10:35 AM',
        location: 'Kho Tổng Flash Official Store (Q.7)',
        note: 'Người bán đã chuẩn bị đóng gói kiện hàng',
        completed: true
      },
      {
        status: 'picking',
        title: 'Đã xuất kho & Bàn giao Shipper',
        timestamp: '11:15 AM',
        location: 'Bưu cục Flash Express Tân Thuận',
        note: 'Shipper Trần Văn Mạnh đã nhận hàng',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang giao tới bạn',
        timestamp: '11:45 AM',
        location: 'Khu vực Quận 1 (Cách bạn 1.8km)',
        note: 'Shipper đang di chuyển bằng xe chuyên dụng',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Giao hàng thành công',
        timestamp: 'Dự kiến: 12:15 PM',
        location: 'Toà Nhà Bitexco, Q.1',
        note: 'Khách hàng ký nhận và kiểm tra kiện hàng',
        completed: false
      }
    ]
  },
  {
    id: 'FC-98422',
    customerName: 'Lê Hoàng Yến',
    customerPhone: '0912***884',
    shippingAddress: 'Landmark 81, P.22, Bình Thạnh, TP.HCM',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        price: 650000
      }
    ],
    subtotal: 650000,
    discount: 30000,
    shippingFee: 0,
    total: 620000,
    status: 'pending',
    paymentMethod: 'CyberCard',
    createdAt: '11:10 - Hôm nay',
    deliveryNote: 'Gửi lễ tân toà nhà nếu vắng mặt',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Chờ người bán xác nhận',
        timestamp: '11:10 AM',
        location: 'FlashCart Hub',
        note: 'Đang gửi thông báo chuẩn bị hàng tới Người Bán',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Xác nhận đơn',
        timestamp: 'Chờ xử lý',
        location: 'Nexus Tech Store',
        note: 'Shop chuẩn bị đóng gói',
        completed: false
      },
      {
        status: 'picking',
        title: 'Bàn giao vận chuyển',
        timestamp: 'Chờ xử lý',
        location: 'Kho trung chuyển',
        note: 'Chờ shipper tiếp nhận',
        completed: false
      },
      {
        status: 'shipping',
        title: 'Vận chuyển',
        timestamp: 'Chờ xử lý',
        location: 'Tuyến giao hàng',
        note: 'Đang trên đường giao',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Hoàn thành',
        timestamp: 'Chờ xử lý',
        location: 'Địa chỉ nhận',
        note: 'Giao thành công',
        completed: false
      }
    ]
  },
  {
    id: 'FC-98418',
    customerName: 'Phan Trọng Đạt',
    customerPhone: '0977***631',
    shippingAddress: 'Khu Công Nghệ Cao, TP. Thủ Đức',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        price: 489000
      }
    ],
    subtotal: 489000,
    discount: 40000,
    shippingFee: 15000,
    total: 464000,
    status: 'delivered',
    paymentMethod: 'COD',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Flash Express)',
    createdAt: 'Hôm qua, 15:40',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '15:40 PM',
        location: 'FlashCart Hệ Thống',
        note: 'Đặt hàng thành công',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Shop xác nhận',
        timestamp: '16:00 PM',
        location: 'CyberGear Lab',
        note: 'Đã đóng gói hoàn tất',
        completed: true
      },
      {
        status: 'picking',
        title: 'Lấy hàng thành công',
        timestamp: '16:30 PM',
        location: 'Kho Thủ Đức',
        note: 'Đã bàn giao cho shipper',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang vận chuyển',
        timestamp: '17:00 PM',
        location: 'Đường D1, Khu CNC',
        note: 'Shipper đã liên hệ khách',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Giao hàng thành công',
        timestamp: '17:25 PM',
        location: 'Khu CNC Thủ Đức',
        note: 'Đã thanh toán COD 464.000₫ đầy đủ',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98425',
    customerName: 'Nguyễn Thành Long',
    customerPhone: '0903***771',
    shippingAddress: 'Số 45 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM',
    items: [
      {
        product: INITIAL_PRODUCTS[3] || INITIAL_PRODUCTS[0],
        quantity: 1,
        price: 890000,
        variant: 'Size 42 / Midnight Black'
      }
    ],
    subtotal: 890000,
    discount: 50000,
    shippingFee: 0,
    total: 840000,
    status: 'confirmed',
    paymentMethod: 'ApplePay',
    createdAt: '14:20 - Hôm nay',
    deliveryNote: 'Gọi trước khi giao 15 phút',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '14:20 PM',
        location: 'TerraSweep Hub',
        note: 'Đã thanh toán thành công qua Apple Pay',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Shop đã xác nhận',
        timestamp: '14:40 PM',
        location: 'Kho TerraSweep Flagship',
        note: 'Shop đang tiến hành đóng gói niêm phong',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98426',
    customerName: 'Đặng Minh Triết',
    customerPhone: '0938***299',
    shippingAddress: 'Tòa nhà Landmark Plus, 208 Nguyễn Hữu Cảnh, Bình Thạnh',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        price: 549000,
        variant: 'M / Pure White'
      }
    ],
    subtotal: 1098000,
    discount: 100000,
    shippingFee: 20000,
    total: 1018000,
    status: 'cancelled',
    paymentMethod: 'FlashPay',
    createdAt: '10:05 - Hôm qua',
    deliveryNote: 'Khách yêu cầu hủy đơn vì thay đổi địa chỉ công tác',
    failReason: 'Khách hàng hủy đơn trước khi xuất kho',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '10:05 AM',
        location: 'TerraSweep Hub',
        note: 'Đơn hàng tạo thành công',
        completed: true
      },
      {
        status: 'cancelled',
        title: 'Đơn hàng đã hủy',
        timestamp: '10:30 AM',
        location: 'Hệ thống tự động',
        note: 'Đã hoàn tiền 100% về tài khoản FlashPay của khách',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98427',
    customerName: 'Hoàng Quốc Bảo',
    customerPhone: '0918***552',
    shippingAddress: 'Tòa nhà Deutsches Haus, 33 Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        price: 750000,
        variant: 'Size 41 / Pearl White'
      }
    ],
    subtotal: 750000,
    discount: 0,
    shippingFee: 22000,
    total: 772000,
    status: 'confirmed',
    paymentMethod: 'COD',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Fleet Pro)',
    createdAt: '13:50 - Hôm nay',
    deliveryNote: 'Giao giờ hành chính, gửi quầy lễ tân tầng G',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã tạo',
        timestamp: '13:50 PM',
        location: 'TerraSweep Hub',
        note: 'Đơn hàng COD chờ điều phối',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Đã phân công Shipper',
        timestamp: '14:05 PM',
        location: 'Kho Flagship Q.7',
        note: 'Đã chỉ định tài xế Trần Văn Mạnh tiếp nhận',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98428',
    customerName: 'Trần Thảo My',
    customerPhone: '0972***410',
    shippingAddress: 'Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        price: 640000,
        variant: 'Size 38 / Sky Horizon'
      }
    ],
    subtotal: 640000,
    discount: 50000,
    shippingFee: 18000,
    total: 608000,
    status: 'failed',
    paymentMethod: 'COD',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Fleet Pro)',
    createdAt: 'Hôm qua, 16:30',
    deliveryNote: 'Khách hẹn giao lại ca sáng mai vì đang ở công ty',
    failReason: 'Khách hàng chủ động hẹn lại ca giao sau (đã gọi 3 cuộc đối soát)',
    rescheduledDate: 'Ca sáng mai (08:00 - 12:00)',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '16:30 PM',
        location: 'TerraSweep Hub',
        note: 'Đơn hàng tạo thành công',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang giao hàng',
        timestamp: '17:15 PM',
        location: 'Khu vực Bình Thạnh',
        note: 'Shipper đã liên hệ khách',
        completed: true
      },
      {
        status: 'failed',
        title: 'Giao không thành công • Đã đổi lịch',
        timestamp: '17:45 PM',
        location: 'Vinhomes Central Park',
        note: 'Khách yêu cầu dời sang sáng mai lúc 9h',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98429',
    customerName: 'Phạm Minh Quân',
    customerPhone: '0908***192',
    shippingAddress: '124 Võ Thị Sáu, Phường 8, Quận 3, TP.HCM',
    items: [
      {
        product: INITIAL_PRODUCTS[4] || INITIAL_PRODUCTS[0],
        quantity: 1,
        price: 920000,
        variant: 'Size 43 / Obsidian'
      }
    ],
    subtotal: 920000,
    discount: 40000,
    shippingFee: 20000,
    total: 900000,
    status: 'shipping',
    paymentMethod: 'COD',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Fleet Pro)',
    createdAt: '11:15 - Hôm nay',
    deliveryNote: 'Bấm chuông cổng số 2, gọi trước 5 phút',
    trackingEvents: [
      {
        status: 'pending',
        title: 'Đơn hàng đã đặt',
        timestamp: '11:15 AM',
        location: 'TerraSweep Hub',
        note: 'Đã duyệt đơn',
        completed: true
      },
      {
        status: 'picking',
        title: 'Đã lấy kiện tại kho',
        timestamp: '12:00 PM',
        location: 'Hub Tân Bình',
        note: 'Kiểm đếm nguyên đai nguyên kiện',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang di chuyển tới điểm giao',
        timestamp: '12:45 PM',
        location: 'Quận 3 (Cách bạn 1.2 km)',
        note: 'Dự kiến đến trong 10 phút',
        completed: true
      }
    ]
  },
  {
    id: 'TS-98430',
    customerName: 'Lê Thùy Dung',
    customerPhone: '0933***808',
    shippingAddress: 'Masteri Thảo Điền, 159 Xa Lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        price: 450000,
        variant: 'Size 37 / Minimal Cream'
      }
    ],
    subtotal: 450000,
    discount: 0,
    shippingFee: 15000,
    total: 465000,
    status: 'delivered',
    paymentMethod: 'COD',
    shipperId: 'ship-01',
    shipperName: 'Trần Văn Mạnh (Fleet Pro)',
    podPhoto: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    podTimestamp: '10:15 Hôm nay (Ký nhận: Lê Thùy Dung)',
    podRecipientSignature: 'Lê Thùy Dung',
    createdAt: '08:30 - Hôm nay',
    deliveryNote: 'Khách kiểm tra hộp trước khi thanh toán COD',
    trackingEvents: [
      {
        status: 'delivered',
        title: 'Giao hàng thành công',
        timestamp: '10:15 AM',
        location: 'Masteri Thảo Điền',
        note: 'Đã thu tiền COD 465.000₫ và lưu PoD',
        completed: true
      }
    ]
  }
];

export const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Phan Trịnh Tiến Đạt',
    email: 'tiendat.dev@flashcart.ai',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'verified',
    joinDate: '15/01/2026',
    metric: '18 đơn hàng đã nhận'
  },
  {
    id: 'usr-2',
    name: 'Flash Official Store',
    email: 'merchant.official@flashcart.ai',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'verified',
    joinDate: '01/10/2025',
    metric: 'Doanh thu: 2.840.000.000₫'
  },
  {
    id: 'usr-3',
    name: 'Trần Văn Mạnh (Shipper PRO)',
    email: 'manh.express@flashcart.ai',
    role: 'shipper',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinDate: '12/11/2025',
    metric: 'Đã hoàn thành: 1.482 chuyến (4.9★)'
  },
  {
    id: 'usr-4',
    name: 'Master Administrator',
    email: 'root.admin@flashcart.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'verified',
    joinDate: '01/08/2025',
    metric: 'Quyền: Root SuperUser'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Gợi Ý', icon: 'Sparkles' },
  { id: 'flash', name: '⚡ Flash Sale Hot', icon: 'Zap' },
  { id: 'Cyber Audio', name: 'Cyber Audio', icon: 'Headphones' },
  { id: 'Smart Wearables', name: 'Thiết Bị Đeo', icon: 'Watch' },
  { id: 'Gaming Gear', name: 'Gaming Gear', icon: 'Gamepad2' },
  { id: 'Smart Home', name: 'Nhà Thông Minh', icon: 'Home' },
  { id: 'Accessories', name: 'Phụ Kiện Sạc GaN', icon: 'BatteryCharging' },
  { id: 'Neo Apparel', name: 'Thời Trang Cyber', icon: 'Shirt' }
];

export const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    recipientName: 'Phan Trịnh Tiến Đạt',
    phone: '0901 234 567',
    address: 'Căn hộ A12-08, Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    isDefault: true,
    tag: 'home'
  },
  {
    id: 'addr-2',
    recipientName: 'Tiến Đạt (Terra Tech Lab)',
    phone: '0988 765 432',
    address: 'Tầng 19, Tòa nhà Saigon Centre Tower 2, 67 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: false,
    tag: 'office'
  }
];

export const INITIAL_KYC_APPLICATIONS: MerchantKYCApplication[] = [
  {
    id: 'KYC-8821',
    shopName: 'AeroKnit Atelier Flagship',
    ownerName: 'Vũ Hải Đăng',
    email: 'contact@aeroknit.design',
    phone: '0938 112 334',
    businessLicense: '0317892011 (Sở KH&ĐT TP.HCM cấp)',
    category: 'Footwear & Streetwear',
    bankAccount: '19038291083018 (Techcombank)',
    bankName: 'Techcombank Chi Nhánh Tân Định',
    status: 'pending',
    submittedAt: 'Hôm nay, 09:30'
  },
  {
    id: 'KYC-8819',
    shopName: 'CyberAudio Acoustics VN',
    ownerName: 'Trịnh Thúy Vy',
    email: 'support@cyberaudio.vn',
    phone: '0912 889 900',
    businessLicense: '0108920192 (Sở KH&ĐT Hà Nội cấp)',
    category: 'Cyber Audio & Gadgets',
    bankAccount: '0071000982736 (Vietcombank)',
    bankName: 'Vietcombank Chi Nhánh Bến Thành',
    status: 'pending',
    submittedAt: 'Hôm qua, 16:15'
  },
  {
    id: 'KYC-8810',
    shopName: 'VoidWalk Sneaker Lab',
    ownerName: 'Hoàng Quốc Tuấn',
    email: 'lab@voidwalk.com',
    phone: '0909 332 119',
    businessLicense: '0316782910 (Sở KH&ĐT TP.HCM cấp)',
    category: 'Footwear',
    bankAccount: '1029384756 (MB Bank)',
    bankName: 'MB Bank Chi Nhánh Quận 7',
    status: 'approved',
    submittedAt: '12/05/2026'
  }
];

export const INITIAL_DISPUTES: DisputeClaim[] = [
  {
    id: 'DISP-1042',
    orderId: 'FC-98421',
    customerName: 'Nguyễn Văn An',
    sellerName: 'TerraSweep Flagship Store',
    amount: 1490000,
    reason: 'Sản phẩm trầy xước đế khi mở hộp đồng kiểm',
    status: 'pending',
    createdAt: 'Hôm nay, 11:20',
    evidencePhoto: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Khách hàng yêu cầu đổi mới đôi khác đúng mã màu'
  },
  {
    id: 'DISP-1039',
    orderId: 'FC-98418',
    customerName: 'Trần Thị Mai',
    sellerName: 'Honor Official Store',
    amount: 549000,
    reason: 'Hộp tai nghe bị rách seal niêm phong',
    status: 'refunded',
    createdAt: 'Hôm qua, 14:05',
    evidencePhoto: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    resolutionNote: 'Admin đã duyệt hoàn 100% tiền về ví khách hàng'
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'prod-1',
    userName: 'Nguyễn Tuấn Anh',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    createdAt: '16/09/2026',
    variantText: 'Size 42 / Pure White',
    content: 'Giày đi cực kỳ êm chân, đế foam đàn hồi rất nảy khi chạy bộ sáng sớm! Form ôm chân vừa vặn đúng size chuẩn thông thường. Đóng gói 2 lớp hộp cẩn thận không móp méo chút nào, có cả túi chống ẩm và thẻ bảo hành chính hãng. Giao hàng 2H siêu tốc cực kỳ ưng ý.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 34,
    isVerifiedPurchase: true,
    sellerResponse: {
      content: 'Dạ TerraSweep Flagship chân thành cảm ơn bạn Tuấn Anh đã tin tưởng và dành tặng đánh giá 5 sao cho shop ạ! Chúc bạn luôn có những bước chạy thật êm ái và tràn đầy năng lượng cùng Terra Glide nhé ạ!',
      createdAt: '16/09/2026'
    },
    replies: [
      {
        id: 'rep-1',
        userName: 'Trần Văn Hùng',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        content: 'Bác ơi chân bè mang có bị kích 2 bên hông không ạ?',
        createdAt: '16/09/2026',
        likes: 3,
      },
      {
        id: 'rep-2',
        userName: 'Nguyễn Tuấn Anh',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        content: 'Không hề nha bạn ơi, mũi giày vải dệt co giãn nhẹ nên chân bè đi vẫn rất thoải mái nhé!',
        createdAt: '16/09/2026',
        likes: 5,
      }
    ]
  },
  {
    id: 'rev-102',
    productId: 'prod-1',
    userName: 'Lê Thị Thu Trang',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    createdAt: '14/09/2026',
    variantText: 'Size 39 / Pure White',
    content: 'Chất lượng giày vượt xa mong đợi trong tầm giá này luôn. Màu trắng ngà rất sang và dễ phối đồ từ quần jean đến váy thể thao. Đế chống trượt tốt, đi cả ngày ở văn phòng không bị mỏi gót. Mọi người nên mua đúng size nha!',
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 21,
    isVerifiedPurchase: true,
    replies: [
      {
        id: 'rep-3',
        userName: 'Hoàng Minh Châu',
        content: 'Đế có bị trơn khi đi trời mưa gạch hoa không chị ơi?',
        createdAt: '15/09/2026',
        likes: 1,
      },
      {
        id: 'rep-4',
        userName: 'Lê Thị Thu Trang',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        content: 'Đế cao su rãnh gai sâu bám đường tốt lắm em, chị đi mưa mấy bận rồi yên tâm nha!',
        createdAt: '15/09/2026',
        likes: 4,
      }
    ]
  },
  {
    id: 'rev-103',
    productId: 'prod-1',
    userName: 'Trần Hoàng Long',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    rating: 4,
    createdAt: '10/09/2026',
    variantText: 'Size 41 / Pure White',
    content: 'Giày rất nhẹ và thoáng khí, đường may chỉn chu không có chỉ thừa. Trừ 1 sao vì hộp bên ngoài bị móp nhẹ góc do shipper lúc trời mưa, nhưng bên trong giày bọc xốp chống sốc nên không bị ảnh hưởng gì. Vẫn cho shop 4 sao khích lệ.',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 12,
    isVerifiedPurchase: true,
    sellerResponse: {
      content: 'Chào bạn Long, TerraSweep rất tiếc về sự cố hộp ngoài bị ảnh hưởng do thời tiết khi giao hàng. Shop đã ghi nhận và làm việc lại với đội ngũ vận chuyển để gia cố màng bọc chống nước tốt hơn. Cảm ơn phản hồi quý báu của bạn!',
      createdAt: '11/09/2026'
    }
  },
  {
    id: 'rev-104',
    productId: 'prod-1',
    userName: 'Vũ Đức Minh',
    rating: 5,
    createdAt: '08/09/2026',
    variantText: 'Size 43 / Pure White',
    content: 'Đã mua đôi thứ 2 của hãng này. Đệm lót rất dày dặn, hỗ trợ vòm bàn chân tốt. Ai hay bị đau gót chân khi đi bộ nhiều thì nên sắm một đôi này, rất đáng tiền!',
    likes: 8,
    isVerifiedPurchase: true
  },
  {
    id: 'rev-105',
    productId: 'prod-2',
    userName: 'Phạm Thanh Hà',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    createdAt: '15/09/2026',
    variantText: 'Titanium Grey / 45mm',
    content: 'Đồng hồ thiết kế khung titanium cực kỳ đầm tay và nam tính. Màn hình AMOLED siêu sáng, ra nắng gắt vẫn nhìn rõ mồn một. Pin dùng được gần 10 ngày mới phải sạc lại. Rất hài lòng!',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 27,
    isVerifiedPurchase: true,
    sellerResponse: {
      content: 'Nexus Tech cảm ơn bạn Hà đã tin tưởng sản phẩm ạ! Bộ phận CSKH luôn sẵn sàng hỗ trợ bạn kích hoạt bảo hành điện tử 24 tháng nhé ạ.',
      createdAt: '15/09/2026'
    }
  },
  {
    id: 'rev-106',
    productId: 'prod-3',
    userName: 'Đặng Quốc Huy',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    createdAt: '12/09/2026',
    variantText: 'Ice Crystal Switch / White',
    content: 'Bàn phím gõ êm như nhung, cấu trúc gasket mount triệt tiêu tiếng vang rỗng hoàn toàn. Led RGB có nhiều chế độ đẹp mắt. Keycap PBT dầy dặn không bị bóng mờ theo thời gian.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
    ],
    likes: 19,
    isVerifiedPurchase: true
  }
];

export const INITIAL_VOUCHERS: ShopVoucher[] = [
  {
    id: 'vouch-1',
    code: 'TERRA50K',
    title: 'Giảm 50.000₫ cho đơn hàng từ 500.000₫',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderValue: 500000,
    maxUsage: 200,
    usedCount: 78,
    startDate: '01/09/2026',
    endDate: '30/09/2026',
    status: 'active',
  },
  {
    id: 'vouch-2',
    code: 'VIPRUNNER15',
    title: 'Ưu đãi 15% cho dòng giày chạy bộ Terra Glide',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 800000,
    maxUsage: 100,
    usedCount: 42,
    startDate: '10/09/2026',
    endDate: '25/09/2026',
    status: 'active',
  },
  {
    id: 'vouch-3',
    code: 'FREESHIPMAX',
    title: 'Miễn phí vận chuyển toàn quốc đơn từ 300.000₫',
    discountType: 'shipping',
    discountValue: 30000,
    minOrderValue: 300000,
    maxUsage: 500,
    usedCount: 231,
    startDate: '01/09/2026',
    endDate: '15/10/2026',
    status: 'active',
  },
  {
    id: 'vouch-4',
    code: 'FLASHWELCOME',
    title: 'Chào mừng khách hàng mới giảm 100.000₫',
    discountType: 'fixed',
    discountValue: 100000,
    minOrderValue: 1000000,
    maxUsage: 50,
    usedCount: 50,
    startDate: '01/08/2026',
    endDate: '31/08/2026',
    status: 'expired',
  },
];

export interface SellerConversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  productContext?: {
    name: string;
    image: string;
    price: number;
  };
  orderContext?: {
    id: string;
    total: number;
    status: string;
  };
  messages: {
    id: string;
    sender: 'customer' | 'seller';
    text: string;
    time: string;
    image?: string;
  }[];
}

export const INITIAL_SELLER_CONVERSATIONS: SellerConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Nguyễn Thành Nam',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    lastMessage: 'Dạ shop ơi, em muốn hỏi size 42 còn hàng không ạ?',
    lastTime: '10:45',
    unreadCount: 1,
    productContext: {
      name: 'TerraRunner X1 Ultralight',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      price: 1250000,
    },
    orderContext: {
      id: 'FC-98421',
      total: 392000,
      status: 'shipping',
    },
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Chào shop, mẫu TerraRunner X1 này form giày chuẩn hay form nhỏ vậy ạ?',
        time: '10:40',
      },
      {
        id: 'm2',
        sender: 'seller',
        text: 'Chào bạn! Mẫu này form chuẩn xuất khẩu nhé bạn ơi, bạn cứ đặt đúng size giày bình thường hay đi là vừa vặn êm chân nha!',
        time: '10:42',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Dạ shop ơi, em muốn hỏi size 42 còn hàng không ạ?',
        time: '10:45',
      },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Lê Hoàng Yến',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    lastMessage: 'Cảm ơn shop nhiều, mình vừa đặt đơn xong rồi!',
    lastTime: '09:15',
    unreadCount: 0,
    productContext: {
      name: 'VoidWalk Low Carbon Edition',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      price: 1450000,
    },
    messages: [
      {
        id: 'm4',
        sender: 'customer',
        text: 'Shop có áp dụng mã FREESHIPMAX cho đơn này được không?',
        time: '09:05',
      },
      {
        id: 'm5',
        sender: 'seller',
        text: 'Được bạn nhé, đơn từ 300k là áp mã FREESHIPMAX giảm 30k cước vận chuyển thoải mái ạ!',
        time: '09:10',
      },
      {
        id: 'm6',
        sender: 'customer',
        text: 'Cảm ơn shop nhiều, mình vừa đặt đơn xong rồi!',
        time: '09:15',
      },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Trần Thảo My',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    lastMessage: 'Em muốn đổi giờ nhận sang buổi tối được không shop?',
    lastTime: 'Hôm qua',
    unreadCount: 0,
    orderContext: {
      id: 'TS-98428',
      total: 608000,
      status: 'failed',
    },
    messages: [
      {
        id: 'm7',
        sender: 'customer',
        text: 'Em muốn đổi giờ nhận sang buổi tối được không shop?',
        time: 'Hôm qua, 17:30',
      },
      {
        id: 'm8',
        sender: 'seller',
        text: 'Dạ được ạ, shop đã liên hệ bưu tá đổi lịch sang ca sáng mai hoặc tối mai giao lại cho bạn rồi nhé!',
        time: 'Hôm qua, 17:40',
      },
    ],
  },
];

export const INITIAL_SELLERS: SellerAccount[] = [
  {
    id: 'shp-1',
    shopName: 'TerraSweep Flagship Official',
    ownerName: 'Võ Hoàng Quân',
    email: 'merchant.official@flashcart.ai',
    phone: '0903 888 999',
    category: 'Running & High-Performance Footwear',
    productCount: 18,
    totalRevenue: 2840000000,
    rating: 4.9,
    penaltyPoints: 0,
    commissionRate: 5.0,
    status: 'active',
    settlementBalance: 58240000,
    joinedAt: '01/10/2025',
    verifiedBadge: true,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'shp-2',
    shopName: 'Nike Heritage Hub VN',
    ownerName: 'Lê Minh Tuấn',
    email: 'nike.heritage@vietretail.vn',
    phone: '0918 223 344',
    category: 'Lifestyle & Court Sneakers',
    productCount: 42,
    totalRevenue: 1650000000,
    rating: 4.8,
    penaltyPoints: 2,
    commissionRate: 6.5,
    status: 'active',
    settlementBalance: 34100000,
    joinedAt: '15/11/2025',
    verifiedBadge: true,
    avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'shp-3',
    shopName: 'Streetwear Matrix Lab',
    ownerName: 'Đặng Quốc Bảo',
    email: 'contact@streetwearmatrix.io',
    phone: '0977 445 566',
    category: 'Cyber Streetwear & Accessories',
    productCount: 29,
    totalRevenue: 890000000,
    rating: 4.6,
    penaltyPoints: 4,
    commissionRate: 7.0,
    status: 'restricted',
    settlementBalance: 12500000,
    joinedAt: '20/12/2025',
    verifiedBadge: false,
    avatar: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'shp-4',
    shopName: 'Apex Speed Athletics',
    ownerName: 'Nguyễn Thị Hương',
    email: 'huong.apex@gmail.com',
    phone: '0934 112 233',
    category: 'Trail Running & Carbon Shoes',
    productCount: 15,
    totalRevenue: 540000000,
    rating: 4.9,
    penaltyPoints: 0,
    commissionRate: 5.0,
    status: 'active',
    settlementBalance: 19800000,
    joinedAt: '05/01/2026',
    verifiedBadge: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'shp-5',
    shopName: 'Fake Sneaker Clearance (Vi Phạm)',
    ownerName: 'Trần Gia Hưng',
    email: 'sneaker.giare@yahoo.com',
    phone: '0981 999 111',
    category: 'Giày thể thao',
    productCount: 6,
    totalRevenue: 48000000,
    rating: 2.3,
    penaltyPoints: 15,
    commissionRate: 10.0,
    status: 'suspended',
    settlementBalance: 0,
    joinedAt: '10/02/2026',
    verifiedBadge: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_PLATFORM_VOUCHERS: PlatformVoucher[] = [
  {
    id: 'pv-1',
    code: 'TERRASHIPFREE',
    title: 'Miễn Phí Vận Chuyển Toàn Sàn TerraSweep',
    discountType: 'shipping',
    discountValue: 35000,
    minOrderValue: 250000,
    platformBudget: 150000000,
    disbursedBudget: 68500000,
    maxUsage: 5000,
    usedCount: 2280,
    sponsorType: 'platform_100',
    startDate: '01/03/2026',
    endDate: '31/03/2026',
    status: 'active',
  },
  {
    id: 'pv-2',
    code: 'CYBERMEGA100K',
    title: 'Đại Tiệc Flash Sale - Giảm 100K Đơn Từ 800K',
    discountType: 'fixed',
    discountValue: 100000,
    minOrderValue: 800000,
    platformBudget: 200000000,
    disbursedBudget: 84000000,
    maxUsage: 2000,
    usedCount: 840,
    sponsorType: 'platform_100',
    startDate: '10/03/2026',
    endDate: '25/03/2026',
    status: 'active',
  },
  {
    id: 'pv-3',
    code: 'WELCOME2026',
    title: 'Ưu Đãi Khách Hàng Mới - Giảm 15% Đơn Đầu Tiên',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 300000,
    maxDiscount: 150000,
    platformBudget: 100000000,
    disbursedBudget: 29900000,
    maxUsage: 3000,
    usedCount: 890,
    sponsorType: 'platform_100',
    startDate: '01/01/2026',
    endDate: '30/06/2026',
    status: 'active',
  },
  {
    id: 'pv-4',
    code: 'FLASHVIP50K',
    title: 'Đồng Tài Trợ Seller - Giảm 50K Hàng Hiệu',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderValue: 500000,
    platformBudget: 50000000,
    disbursedBudget: 50000000,
    maxUsage: 1000,
    usedCount: 1000,
    sponsorType: 'co_funded',
    startDate: '01/02/2026',
    endDate: '28/02/2026',
    status: 'expired',
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '18/03/2026 13:12:45',
    adminName: 'Master Administrator',
    adminEmail: 'root.admin@flashcart.ai',
    action: 'LOCK_USER',
    actionLabel: 'Khóa tài khoản người dùng',
    targetEntity: 'Shop Fake Sneaker Clearance (#shp-5)',
    targetId: 'shp-5',
    details: 'Áp dụng lệnh khóa vĩnh viễn do tích lũy 15 điểm Sao Quả Tạ và phát hiện bán hàng giả.',
    ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
    device: 'Chrome 128 / macOS Sequoia',
    severity: 'critical',
    diffSnapshot: '{"status": "active" ➔ "suspended", "penaltyPoints": 15, "banDuration": "permanent"}',
  },
  {
    id: 'log-102',
    timestamp: '18/03/2026 11:35:10',
    adminName: 'Master Administrator',
    adminEmail: 'root.admin@flashcart.ai',
    action: 'APPROVE_SELLER',
    actionLabel: 'Phê duyệt hồ sơ mở shop (KYC)',
    targetEntity: 'Apex Speed Athletics (#kyc-02)',
    targetId: 'kyc-02',
    details: 'Đã xác minh GPKD 0317894561 và tài khoản Techcombank chính chủ. Cấp quyền kinh doanh.',
    ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
    device: 'Chrome 128 / macOS Sequoia',
    severity: 'info',
    diffSnapshot: '{"kycStatus": "pending" ➔ "approved", "role": "customer" ➔ "seller"}',
  },
  {
    id: 'log-103',
    timestamp: '17/03/2026 16:40:22',
    adminName: 'Master Administrator',
    adminEmail: 'root.admin@flashcart.ai',
    action: 'CREATE_VOUCHER',
    actionLabel: 'Phát hành Voucher sàn mới',
    targetEntity: 'TERRASHIPFREE (Ngân sách 150.000.000₫)',
    targetId: 'pv-1',
    details: 'Khởi tạo chiến dịch Freeship toàn sàn tháng 03/2026, hỗ trợ tối đa 35k cho đơn từ 250k.',
    ipAddress: '118.69.182.50 (Hà Nội)',
    device: 'Safari 18 / macOS Sonoma',
    severity: 'info',
    diffSnapshot: '{"budget": 150000000, "code": "TERRASHIPFREE", "discount": 35000}',
  },
  {
    id: 'log-104',
    timestamp: '16/03/2026 09:15:00',
    adminName: 'Master Administrator',
    adminEmail: 'root.admin@flashcart.ai',
    action: 'UPDATE_COMMISSION',
    actionLabel: 'Điều chỉnh phí hoa hồng sàn',
    targetEntity: 'Streetwear Matrix Lab (#shp-3)',
    targetId: 'shp-3',
    details: 'Tăng mức phí hoa hồng sàn từ 5.0% lên 7.0% do có tỷ lệ khiếu nại phát sinh 4.2%.',
    ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
    device: 'Chrome 128 / macOS Sequoia',
    severity: 'warning',
    diffSnapshot: '{"commissionRate": 5.0 ➔ 7.0, "reason": "High complaint ratio"}',
  },
  {
    id: 'log-105',
    timestamp: '15/03/2026 14:28:19',
    adminName: 'Master Administrator',
    adminEmail: 'root.admin@flashcart.ai',
    action: 'UNLOCK_USER',
    actionLabel: 'Mở khóa khôi phục tài khoản',
    targetEntity: 'User Nguyễn Văn An (usr-9)',
    targetId: 'usr-9',
    details: 'Khách hàng hoàn tất xác thực sinh trắc học CCCD gắn chip sau nghi vấn đăng nhập bất thường.',
    ipAddress: '14.161.42.112 (TP. Hồ Chí Minh)',
    device: 'Chrome 128 / macOS Sequoia',
    severity: 'info',
    diffSnapshot: '{"status": "suspended" ➔ "active", "restoredReason": "KYC biometric verified"}',
  },
];

export const INITIAL_SUSPENSIONS: AccountSuspensionRecord[] = [
  {
    id: 'ban-01',
    targetId: 'shp-5',
    targetName: 'Fake Sneaker Clearance (Shop Bị Cấm)',
    targetEmail: 'sneaker.giare@yahoo.com',
    targetRole: 'seller',
    reason: 'Kinh doanh hàng giả, hàng nhái nhãn hiệu Nike & adidas; tích lũy 15 điểm Sao Quả Tạ.',
    duration: 'permanent',
    suspendedAt: '18/03/2026 13:12',
    suspendedBy: 'Master Administrator',
    status: 'active_ban',
    notes: 'Đã niêm phong gian hàng và chuyển hồ sơ sang bộ phận pháp chế.',
  },
  {
    id: 'ban-02',
    targetId: 'usr-buyer-88',
    targetName: 'Vũ Đức Thịnh',
    targetEmail: 'thinh.vuduc.spam@gmail.com',
    targetRole: 'customer',
    reason: 'Lạm dụng công cụ tự động hóa (Bot script) để cày mã giảm giá Freeship và gom hàng.',
    duration: '30_days',
    suspendedAt: '14/03/2026 08:30',
    suspendedBy: 'Master Administrator',
    status: 'active_ban',
    notes: 'Tạm khóa 30 ngày để hủy các đơn hàng ảo và thu hồi voucher bất chính.',
  },
  {
    id: 'ban-03',
    targetId: 'usr-shipper-41',
    targetName: 'Hoàng Văn Lực (Tài xế vi phạm)',
    targetEmail: 'luc.hoang@express-courier.vn',
    targetRole: 'shipper',
    reason: 'Chậm nộp đối soát tiền mặt COD quá hạn định mức trên 10 triệu đồng liên tiếp 3 ngày.',
    duration: '7_days',
    suspendedAt: '16/03/2026 19:45',
    suspendedBy: 'Master Administrator',
    status: 'appealing',
    notes: 'Đang xem xét đơn kháng cáo do gặp sự cố kỹ thuật ứng dụng ngân hàng khi chuyển VietQR.',
  },
];



