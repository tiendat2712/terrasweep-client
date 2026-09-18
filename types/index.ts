export type Role = 'customer' | 'seller' | 'shipper' | 'admin';

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface ProductSizeVariant {
  id: string;
  size: string; // e.g. "39", "40", "41", "42", "43", "44", "S", "M"...
  sku: string;
  price: number;
  flashPrice: number;
  stock: number;
  image: string; // Specific photo for this size/color variant
  warehouseBay?: string;
  isActive: boolean;
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
  sizeVariants?: ProductSizeVariant[];
  galleryImages?: string[];
  brand?: string;
  weightGrams?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedOption?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'picking' | 'shipping' | 'delivered' | 'failed' | 'cancelled' | 'returned';

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
    variant?: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay' | 'VietQR' | 'MoMo' | 'PayLater';
  trackingEvents: TrackingEvent[];
  shipperId?: string;
  shipperName?: string;
  qrCode?: string;
  createdAt: string;
  deliveryNote?: string;
  podPhoto?: string;
  podTimestamp?: string;
  podRecipientSignature?: string;
  failReason?: string;
  rescheduledDate?: string;
}

export interface ReviewReply {
  id: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  isSeller?: boolean;
  likes?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  createdAt: string;
  variantText?: string;
  content: string;
  images?: string[];
  likes: number;
  isVerifiedPurchase: boolean;
  sellerResponse?: {
    content: string;
    createdAt: string;
  };
  replies?: ReviewReply[];
}


export interface AddressItem {
  id: string;
  recipientName: string;
  phone: string;
  address: string;
  isDefault: boolean;
  tag?: 'home' | 'office';
}

export interface MerchantKYCApplication {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessLicense: string;
  category: string;
  bankAccount: string;
  bankName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}

export interface DisputeClaim {
  id: string;
  orderId: string;
  customerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'refunded' | 'rejected';
  createdAt: string;
  evidencePhoto?: string;
  resolutionNote?: string;
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

export interface ShopVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  minOrderValue: number;
  maxUsage: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'paused';
}

export interface SellerAccount {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  productCount: number;
  totalRevenue: number;
  rating: number;
  penaltyPoints: number; // 0-15 điểm sao quả tạ
  commissionRate: number; // e.g. 5 for 5%
  status: 'active' | 'under_review' | 'restricted' | 'suspended';
  settlementBalance: number;
  joinedAt: string;
  verifiedBadge: boolean;
  avatar: string;
}

export interface PlatformVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  platformBudget: number; // Ngân sách sàn tài trợ (VND)
  disbursedBudget: number; // Đã giải ngân (VND)
  maxUsage: number;
  usedCount: number;
  sponsorType: 'platform_100' | 'co_funded';
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired';
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: 'LOCK_USER' | 'UNLOCK_USER' | 'APPROVE_SELLER' | 'REJECT_SELLER' | 'CREATE_VOUCHER' | 'PAUSE_VOUCHER' | 'UPDATE_COMMISSION' | 'ROLE_CHANGE';
  actionLabel: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress: string;
  device: string;
  severity: 'info' | 'warning' | 'critical';
  diffSnapshot?: string;
}

export interface AccountSuspensionRecord {
  id: string;
  targetId: string;
  targetName: string;
  targetEmail: string;
  targetRole: Role;
  reason: string;
  duration: '7_days' | '30_days' | 'permanent';
  suspendedAt: string;
  suspendedBy: string;
  status: 'active_ban' | 'appealing' | 'restored';
  notes: string;
}


