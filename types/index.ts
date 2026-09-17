export type Role = 'customer' | 'seller' | 'shipper' | 'admin';

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  flashPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  salesCount: string;
  stock: number;
  category: string;
  image: string;
  tags: string[];
  badge?: 'Yêu thích' | 'Yêu thích+' | 'Rẻ Vô Địch' | 'Flash Voucher' | 'Mall' | 'Cyber Pick';
  isFlashSale?: boolean;
  soldProgress?: number; // e.g. 85 for 85%
  description: string;
  specs: { [key: string]: string };
  sellerName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedOption?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'picking' | 'shipping' | 'delivered' | 'failed';

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  timestamp: string;
  location: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay';
  trackingEvents: TrackingEvent[];
  shipperId?: string;
  shipperName?: string;
  qrCode?: string;
  createdAt: string;
  deliveryNote?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'active' | 'suspended' | 'verified';
  joinDate: string;
  metric: string; // e.g. "32 đơn đã mua" or "Doanh thu $42,500"
}

export interface CategoryItem {
  id: string;
  nameVi: string;
  nameEn: string;
  image: string;
  productCategory: string;
}

export interface TopSearchItem {
  id: string;
  nameVi: string;
  nameEn: string;
  salesMonthly: string;
  image: string;
  price: number;
  category: string;
  productRefId?: string;
}
