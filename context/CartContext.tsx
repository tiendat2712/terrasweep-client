'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PlatformUser, Role, Order, OrderStatus, TrackingEvent, AddressItem, MerchantKYCApplication, DisputeClaim } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_ADDRESSES, INITIAL_KYC_APPLICATIONS, INITIAL_DISPUTES } from '@/data/mockData';
import { useLanguage } from '@/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import { FlyToHeaderOverlay, FlyingParticleData } from '@/components/common/FlyToHeaderOverlay';

interface ToastState {
  text: string;
  type: 'success' | 'info';
  actionText?: string;
  onAction?: () => void;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantityOrOrigin?: number | React.MouseEvent | { x: number; y: number } | HTMLElement | null,
    variant?: string,
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay' | 'VietQR' | 'MoMo' | 'PayLater';
    shippingFee: number;
    discount: number;
    items?: CartItem[];
  }) => string;
  cancelOrder: (orderId: string, reason?: string) => void;
  reorder: (orderId: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    extra?: { podPhoto?: string; podTimestamp?: string; podRecipientSignature?: string; failReason?: string; rescheduledDate?: string } | string
  ) => void;
  addresses: AddressItem[];
  setAddresses: React.Dispatch<React.SetStateAction<AddressItem[]>>;
  addAddress: (addr: Omit<AddressItem, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  kycApplications: MerchantKYCApplication[];
  approveKyc: (id: string) => void;
  rejectKyc: (id: string, reason: string) => void;
  disputes: DisputeClaim[];
  resolveDispute: (id: string, resolution: 'refunded' | 'rejected', note?: string) => void;
  requestReturnRefund: (orderId: string, reason: string, amount: number, evidencePhoto?: string) => void;
  sellerChatSession: {
    isOpen: boolean;
    sellerName: string;
    sellerAvatar?: string;
    productContext?: { name: string; image: string; price: number };
    orderContext?: { id: string; total: number };
  } | null;
  openSellerChat: (
    sellerName: string,
    context?: {
      product?: { name: string; image: string; price: number };
      order?: { id: string; total: number };
    }
  ) => void;
  closeSellerChat: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  toastMessage: ToastState | null;
  setToastMessage: React.Dispatch<React.SetStateAction<ToastState | null>>;
  triggerToast: (
    text: string,
    type?: 'success' | 'info',
    actionText?: string,
    onAction?: () => void
  ) => void;
  currentUser: PlatformUser;
  setCurrentUser: (user: PlatformUser) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  handleLogin: (user: PlatformUser, role: Role) => void;
  wishlistIds: string[];
  toggleWishlist: (
    productId: string,
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null
  ) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveAllWishlistToCart: () => void;
  flyingParticles: FlyingParticleData[];
  triggerFlyEffect: (
    type: 'cart' | 'wishlist',
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null,
    image?: string,
    payload?: {
      cartPayload?: {
        product: Product;
        quantity: number;
        variant: string;
      };
      wishlistPayload?: {
        productId: string;
      };
    }
  ) => void;
  cartBounceCount: number;
  wishlistBounceCount: number;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<Role>('customer');
  const [currentUser, setCurrentUser] = useState<PlatformUser>(INITIAL_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedColor: 'M / Pure White',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    triggerToast(
      language === 'vi'
        ? `Đã đăng bán sản phẩm "${newProduct.name}" thành công!`
        : `Successfully published "${newProduct.name}"!`,
      'success'
    );
  };
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [kycApplications, setKycApplications] = useState<MerchantKYCApplication[]>(INITIAL_KYC_APPLICATIONS);
  const [disputes, setDisputes] = useState<DisputeClaim[]>(INITIAL_DISPUTES);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-1', 'prod-3']);
  const [flyingParticles, setFlyingParticles] = useState<FlyingParticleData[]>([]);
  const [cartBounceCount, setCartBounceCount] = useState(0);
  const [wishlistBounceCount, setWishlistBounceCount] = useState(0);
  const [sellerChatSession, setSellerChatSession] = useState<{
    isOpen: boolean;
    sellerName: string;
    sellerAvatar?: string;
    productContext?: { name: string; image: string; price: number };
    orderContext?: { id: string; total: number };
  } | null>(null);

  const commitAddToCart = (product: Product, quantity: number, variant: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const rawExistingQty = existing.quantity;
        let safeExistingQty = 1;
        if (typeof rawExistingQty === 'number' && !isNaN(rawExistingQty) && rawExistingQty > 0) {
          safeExistingQty = Math.floor(rawExistingQty);
        } else if (typeof rawExistingQty === 'string') {
          const parsed = parseInt(rawExistingQty, 10);
          safeExistingQty = !isNaN(parsed) && parsed > 0 ? parsed : 1;
        }

        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: safeExistingQty + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: variant,
        },
      ];
    });
  };

  const commitAddToWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) return prev;
      return [productId, ...prev];
    });
  };

  const triggerFlyEffect = (
    type: 'cart' | 'wishlist',
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null,
    image?: string,
    payload?: {
      cartPayload?: {
        product: Product;
        quantity: number;
        variant: string;
      };
      wishlistPayload?: {
        productId: string;
      };
    }
  ) => {
    if (typeof window === 'undefined') return;

    let startX = window.innerWidth / 2;
    // Default fallback to bottom area of viewport (near product cards)
    let startY = window.innerHeight * 0.75;

    if (origin) {
      if ('clientX' in origin && typeof origin.clientX === 'number' && origin.clientX > 0) {
        startX = origin.clientX;
        startY = origin.clientY;
      } else if ('x' in origin && typeof origin.x === 'number' && origin.x > 0) {
        startX = origin.x;
        startY = origin.y;
      } else if ('currentTarget' in (origin as any) && (origin as any).currentTarget?.getBoundingClientRect) {
        const rect = (origin as any).currentTarget.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if ('getBoundingClientRect' in origin && typeof (origin as HTMLElement).getBoundingClientRect === 'function') {
        const rect = (origin as HTMLElement).getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }
    } else {
      const evt = (window as any).event;
      if (evt && typeof evt.clientX === 'number' && evt.clientX > 0) {
        startX = evt.clientX;
        startY = evt.clientY;
      } else if (document.activeElement && typeof document.activeElement.getBoundingClientRect === 'function') {
        const rect = document.activeElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;
        }
      }
    }

    const targetId = type === 'cart' ? 'header-cart-btn' : 'header-wishlist-btn';
    const targetEl = document.getElementById(targetId);
    const containerRight = Math.min(window.innerWidth - 20, (window.innerWidth + 1280) / 2 - 32);
    let targetX = containerRight - (type === 'cart' ? 80 : 130);
    let targetY = 40;

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const newParticle: FlyingParticleData = {
      id: `particle-${Date.now()}-${Math.random()}`,
      type,
      startX,
      startY,
      targetX,
      targetY,
      image,
      cartPayload: payload?.cartPayload,
      wishlistPayload: payload?.wishlistPayload,
    };

    setFlyingParticles((prev) => [...prev, newParticle]);
  };

  const handleParticleComplete = (particle: FlyingParticleData) => {
    setFlyingParticles((prev) => prev.filter((p) => p.id !== particle.id));
    if (particle.type === 'cart') {
      if (particle.cartPayload) {
        commitAddToCart(
          particle.cartPayload.product,
          particle.cartPayload.quantity,
          particle.cartPayload.variant
        );
      }
      setCartBounceCount((c) => c + 1);
    } else {
      if (particle.wishlistPayload) {
        commitAddToWishlist(particle.wishlistPayload.productId);
      }
      setWishlistBounceCount((w) => w + 1);
    }
  };

  // Load cart, orders, addresses & wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('flashcart_cart_items');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitizedCart = parsed.map((item: any) => {
            const rawQty = item?.quantity;
            let cleanQty = 1;
            if (typeof rawQty === 'number' && !isNaN(rawQty) && rawQty > 0) {
              cleanQty = Math.floor(rawQty);
            } else if (typeof rawQty === 'string') {
              const parsedInt = parseInt(rawQty, 10);
              cleanQty = !isNaN(parsedInt) && parsedInt > 0 ? parsedInt : 1;
            }
            return {
              ...item,
              quantity: cleanQty,
            };
          });
          setCartItems(sanitizedCart);
        }
      }
      const savedOrders = localStorage.getItem('flashcart_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          setOrders(parsedOrders);
        }
      }
      const savedAddresses = localStorage.getItem('flashcart_addresses');
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        if (Array.isArray(parsedAddresses) && parsedAddresses.length > 0) {
          setAddresses(parsedAddresses);
        }
      }
      const savedWishlist = localStorage.getItem('flashcart_wishlist_ids');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlistIds(parsedWishlist);
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashcart_wishlist_ids', JSON.stringify(wishlistIds));
    } catch {
      // Ignore quota errors
    }
  }, [wishlistIds]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashcart_cart_items', JSON.stringify(cartItems));
    } catch {
      // Ignore quota errors
    }
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashcart_orders', JSON.stringify(orders));
    } catch {
      // Ignore quota errors
    }
  }, [orders]);

  // Sync addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashcart_addresses', JSON.stringify(addresses));
    } catch {
      // Ignore quota errors
    }
  }, [addresses]);

  const triggerToast = (
    text: string,
    type: 'success' | 'info' = 'success',
    actionText?: string,
    onAction?: () => void
  ) => {
    setToastMessage({ text, type, actionText, onAction });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const addToCart = (
    product: Product,
    quantityOrOrigin: number | React.MouseEvent | { x: number; y: number } | HTMLElement | null = 1,
    variant?: string,
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null
  ) => {
    let finalQuantity = 1;
    let finalOrigin: React.MouseEvent | { x: number; y: number } | HTMLElement | null = null;
    let finalVariant = 'Standard';

    if (typeof quantityOrOrigin === 'number') {
      finalQuantity = !isNaN(quantityOrOrigin) && quantityOrOrigin > 0 ? Math.floor(quantityOrOrigin) : 1;
      finalVariant = typeof variant === 'string' && variant ? variant : 'Standard';
      finalOrigin = origin || null;
    } else if (quantityOrOrigin && typeof quantityOrOrigin === 'object') {
      // Polymorphic: origin was passed as the 2nd argument!
      finalOrigin = quantityOrOrigin;
      finalQuantity = 1;
      finalVariant = typeof variant === 'string' && variant ? variant : 'Standard';
    } else {
      finalQuantity = 1;
      finalVariant = typeof variant === 'string' && variant ? variant : 'Standard';
      finalOrigin = origin || null;
    }

    // Hiệu ứng giỏ hàng bay lên header: Số lượng chỉ được cộng vào khi hạt bay đến đích ở Header
    triggerFlyEffect('cart', finalOrigin, product.image, {
      cartPayload: {
        product,
        quantity: finalQuantity,
        variant: finalVariant,
      },
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            return quantity > 0 ? { ...item, quantity } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay' | 'VietQR' | 'MoMo' | 'PayLater';
    shippingFee: number;
    discount: number;
    items?: CartItem[];
  }) => {
    const orderItems = orderData.items && orderData.items.length > 0 ? orderData.items : cartItems;
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.product.flashPrice * item.quantity,
      0
    );
    const newOrderId = `TS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: newOrderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: orderItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.flashPrice,
      })),
      subtotal,
      discount: orderData.discount,
      shippingFee: orderData.shippingFee,
      total: Math.max(0, subtotal - orderData.discount + orderData.shippingFee),
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      shipperName: 'Trần Văn Mạnh (Shipper PRO)',
      qrCode: `QR-FLASH-${newOrderId}`,
      trackingEvents: [
        {
          status: 'pending',
          title: language === 'vi' ? 'Đơn hàng đã đặt' : 'Order Placed',
          timestamp: language === 'vi' ? 'Vừa xong' : 'Just now',
          location: 'TerraSweep Hub',
          note:
            language === 'vi'
              ? 'Đang gửi thông báo chuẩn bị kiện hàng tới Shop Flagship'
              : 'Dispatching preparation notice to merchant flagship',
          completed: true,
        },
        {
          status: 'confirmed',
          title: language === 'vi' ? 'Shop xác nhận & đóng gói' : 'Merchant Packing',
          timestamp: language === 'vi' ? 'Chờ duyệt' : 'Pending',
          location: 'Kho TerraSweep Flagship',
          note:
            language === 'vi'
              ? 'Shop kiểm tra số lượng và đóng gói'
              : 'Merchant inspecting stock and packing box',
          completed: false,
        },
        {
          status: 'picking',
          title: language === 'vi' ? 'Bàn giao Shipper' : 'Handed Off to Courier',
          timestamp: language === 'vi' ? 'Chờ xử lý' : 'Pending',
          location: 'Kho trung chuyển',
          note:
            language === 'vi'
              ? 'Chờ shipper quét laser QR tiếp nhận'
              : 'Awaiting carrier laser scan QR handover',
          completed: false,
        },
        {
          status: 'shipping',
          title: language === 'vi' ? 'Đang vận chuyển' : 'In Transit',
          timestamp: language === 'vi' ? 'Chờ xử lý' : 'Pending',
          location: 'Tuyến đường giao',
          note:
            language === 'vi'
              ? 'Tài xế đang trên đường giao tới bạn'
              : 'Courier on route to destination',
          completed: false,
        },
        {
          status: 'delivered',
          title: language === 'vi' ? 'Hoàn thành giao hàng' : 'Order Delivered',
          timestamp: language === 'vi' ? 'Chờ xử lý' : 'Pending',
          location: orderData.shippingAddress,
          note:
            language === 'vi'
              ? 'Khách hàng nhận kiện hàng'
              : 'Recipient received parcel',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (orderData.items && orderData.items.length > 0) {
      const orderedIds = new Set(orderData.items.map((i) => i.product.id));
      setCartItems((prev) => prev.filter((i) => !orderedIds.has(i.product.id)));
    } else {
      clearCart();
    }

    triggerToast(
      language === 'vi'
        ? `Đã tạo đơn hàng #${newOrderId} thành công!`
        : `Order #${newOrderId} created successfully!`,
      'success',
      language === 'vi' ? 'Xem đơn hàng' : 'Track Order',
      () => {
        window.location.href = `/orders?orderId=${newOrderId}`;
      }
    );

    return newOrderId;
  };

  const addAddress = (addr: Omit<AddressItem, 'id'>) => {
    const newAddr: AddressItem = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => {
      const updated = addr.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
        : [...prev, newAddr];
      return updated;
    });
    triggerToast(
      language === 'vi' ? 'Đã lưu địa chỉ nhận hàng mới!' : 'New shipping address saved!',
      'success'
    );
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    triggerToast(
      language === 'vi' ? 'Đã xóa địa chỉ thành công!' : 'Address removed successfully!',
      'info'
    );
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    triggerToast(
      language === 'vi' ? 'Đã đặt làm địa chỉ giao hàng mặc định!' : 'Set as default delivery address!',
      'success'
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'cancelled' as OrderStatus,
            failReason: reason || (language === 'vi' ? 'Khách hàng yêu cầu hủy đơn' : 'Cancelled by customer'),
            trackingEvents: [
              ...ord.trackingEvents,
              {
                status: 'cancelled' as OrderStatus,
                title: language === 'vi' ? 'Đã hủy đơn hàng' : 'Order Cancelled',
                timestamp: language === 'vi' ? 'Vừa xong' : 'Just now',
                location: 'Hệ thống tự động',
                note: reason || (language === 'vi' ? 'Khách hàng xác nhận hủy đơn' : 'Customer confirmed cancellation'),
                completed: true,
              },
            ],
          };
        }
        return ord;
      })
    );
    triggerToast(
      language === 'vi' ? `Đã hủy đơn hàng #${orderId} thành công!` : `Order #${orderId} cancelled!`,
      'info'
    );
  };

  const reorder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    target.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.variant);
    });
    triggerToast(
      language === 'vi' ? `Đã thêm ${target.items.length} mặt hàng vào giỏ!` : `Added ${target.items.length} items to cart!`,
      'success',
      language === 'vi' ? 'Xem giỏ hàng' : 'View Cart',
      () => router.push('/cart')
    );
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    extra?: { podPhoto?: string; podTimestamp?: string; podRecipientSignature?: string; failReason?: string; rescheduledDate?: string } | string
  ) => {
    const extraObj = typeof extra === 'object' ? extra : undefined;
    const noteStr = typeof extra === 'string' ? extra : extraObj?.failReason || (extraObj?.podPhoto ? (language === 'vi' ? 'Đã chụp ảnh bằng chứng giao hàng (PoD)' : 'Proof of delivery photo saved') : '');

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newEvent: TrackingEvent = {
            status,
            title:
              status === 'confirmed'
                ? language === 'vi' ? 'Shop xác nhận đóng gói' : 'Merchant Packed'
                : status === 'picking'
                ? language === 'vi' ? 'Bàn giao Shipper' : 'Handed to Courier'
                : status === 'shipping'
                ? language === 'vi' ? 'Đang giao hàng' : 'Out for Delivery'
                : status === 'delivered'
                ? language === 'vi' ? 'Giao hàng thành công (PoD)' : 'Delivered with PoD'
                : status === 'failed'
                ? language === 'vi' ? 'Giao thất bại / Hẹn lại' : 'Delivery Failed / Rescheduled'
                : language === 'vi' ? 'Cập nhật trạng thái' : 'Status Updated',
            timestamp: language === 'vi' ? 'Vừa xong' : 'Just now',
            location: 'Tuyến giao hàng',
            note: noteStr,
            completed: true,
          };
          return {
            ...ord,
            status,
            podPhoto: extraObj?.podPhoto || ord.podPhoto,
            podTimestamp: extraObj?.podTimestamp || (extraObj?.podPhoto ? new Date().toLocaleTimeString('vi-VN') : ord.podTimestamp),
            podRecipientSignature: extraObj?.podRecipientSignature || ord.podRecipientSignature,
            failReason: extraObj?.failReason || ord.failReason,
            rescheduledDate: extraObj?.rescheduledDate || ord.rescheduledDate,
            trackingEvents: [...ord.trackingEvents, newEvent],
          };
        }
        return ord;
      })
    );
  };

  const approveKyc = (id: string) => {
    setKycApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' } : app))
    );
    triggerToast(
      language === 'vi' ? 'Đã phê duyệt giấy phép mở shop!' : 'Merchant KYC approved!',
      'success'
    );
  };

  const rejectKyc = (id: string, reason: string) => {
    setKycApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: 'rejected', rejectionReason: reason } : app
      )
    );
    triggerToast(
      language === 'vi' ? 'Đã từ chối hồ sơ đăng ký shop!' : 'Merchant KYC rejected!',
      'info'
    );
  };

  const resolveDispute = (
    id: string,
    resolution: 'refunded' | 'rejected',
    note?: string
  ) => {
    setDisputes((prev) =>
      prev.map((disp) =>
        disp.id === id
          ? {
              ...disp,
              status: resolution,
              resolutionNote: note || (resolution === 'refunded' ? 'Admin duyệt hoàn tiền 100%' : 'Bác khiếu nại'),
            }
          : disp
      )
    );
    triggerToast(
      language === 'vi'
        ? resolution === 'refunded'
          ? 'Đã duyệt hoàn tiền cho khách hàng!'
          : 'Đã bác bỏ khiếu nại của khách!'
        : resolution === 'refunded'
        ? 'Refund approved for customer!'
        : 'Dispute rejected!',
      'success'
    );
  };

  const requestReturnRefund = (
    orderId: string,
    reason: string,
    amount: number,
    evidencePhoto?: string
  ) => {
    // 1. Update Order status to 'returned' & append Return Tracking Events
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const returnEvents: TrackingEvent[] = [
          ...o.trackingEvents,
          {
            status: 'returned',
            title: language === 'vi' ? 'Yêu cầu trả hàng & hoàn tiền đã gửi' : 'Return Request Submitted',
            timestamp: language === 'vi' ? 'Vừa xong' : 'Just now',
            location: 'Hệ thống TerraSweep',
            note: language === 'vi' ? `Lý do: ${reason}. Số tiền hoàn: ${amount.toLocaleString('vi-VN')}₫` : `Reason: ${reason}`,
            completed: true,
          },
          {
            status: 'returned',
            title: language === 'vi' ? 'Shop tiếp nhận & duyệt lấy hàng' : 'Seller Approved Return',
            timestamp: language === 'vi' ? 'Đang xử lý' : 'In Progress',
            location: 'Kho Flagship Store',
            note: language === 'vi' ? 'Shipper sẽ đến lấy hàng hoàn trả tận nhà trong 24 giờ tới' : 'Carrier will pick up return package in 24h',
            completed: false,
          },
          {
            status: 'returned',
            title: language === 'vi' ? 'Hoàn tiền thành công' : 'Refund Processed',
            timestamp: language === 'vi' ? 'Chờ hoàn tất' : 'Pending',
            location: 'Ví điện tử / Tài khoản ngân hàng',
            note: language === 'vi' ? 'Tiền sẽ được cộng lại ngay sau khi kho nhận hàng' : 'Refund credited once item arrives at warehouse',
            completed: false,
          },
        ];
        return {
          ...o,
          status: 'returned',
          trackingEvents: returnEvents,
        };
      })
    );

    // 2. Add new DisputeClaim
    const targetOrder = orders.find((o) => o.id === orderId);
    const newDispute: DisputeClaim = {
      id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      customerName: targetOrder?.customerName || currentUser.name,
      sellerName: 'TerraSweep Flagship Store',
      amount,
      reason,
      status: 'pending',
      createdAt: language === 'vi' ? 'Vừa xong' : 'Just now',
      evidencePhoto: evidencePhoto || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      resolutionNote: language === 'vi' ? 'Đang chờ điều phối shipper thu hồi hàng' : 'Awaiting carrier return pickup',
    };
    setDisputes((prev) => [newDispute, ...prev]);

    triggerToast(
      language === 'vi'
        ? 'Đã gửi yêu cầu Trả hàng / Hoàn tiền thành công! Shop sẽ xử lý trong 24h.'
        : 'Return & refund request submitted successfully!',
      'success'
    );
  };

  const openSellerChat = (
    sellerName: string,
    context?: {
      product?: { name: string; image: string; price: number };
      order?: { id: string; total: number };
    }
  ) => {
    setSellerChatSession({
      isOpen: true,
      sellerName: sellerName || 'TerraSweep Flagship Store',
      sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      productContext: context?.product,
      orderContext: context?.order,
    });
  };

  const closeSellerChat = () => {
    setSellerChatSession((prev) => (prev ? { ...prev, isOpen: false } : null));
  };


  const handleLogin = (user: PlatformUser, targetRole: Role) => {
    setCurrentUser(user);
    setActiveRole(targetRole);

    triggerToast(
      language === 'vi'
        ? `Chào mừng ${user.name}! Đã chuyển hướng tới [${targetRole.toUpperCase()}].`
        : `Welcome ${user.name}! Redirected to [${targetRole.toUpperCase()}].`,
      'success'
    );
  };

  const toggleWishlist = (
    productId: string,
    origin?: React.MouseEvent | { x: number; y: number } | HTMLElement | null
  ) => {
    const inFlight = flyingParticles.some((p) => p.wishlistPayload?.productId === productId);
    const isPresent = wishlistIds.includes(productId) || inFlight;
    const targetProduct = INITIAL_PRODUCTS.find((p) => p.id === productId);

    if (isPresent) {
      // Hủy particle đang bay nếu có và xóa khỏi wishlist
      setFlyingParticles((prev) => prev.filter((p) => p.wishlistPayload?.productId !== productId));
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    } else {
      // Hiệu ứng trái tim bay lên header: Số lượng chỉ được cộng khi hạt bay đến đích ở Header
      triggerFlyEffect('wishlist', origin, targetProduct?.image, {
        wishlistPayload: { productId },
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return (
      wishlistIds.includes(productId) ||
      flyingParticles.some((p) => p.wishlistPayload?.productId === productId)
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    triggerToast(
      language === 'vi' ? 'Đã làm trống danh sách yêu thích' : 'Cleared all items from wishlist',
      'info'
    );
  };

  const moveAllWishlistToCart = () => {
    const inStockProducts = INITIAL_PRODUCTS.filter(
      (p) => wishlistIds.includes(p.id) && (p.stock || 0) > 0
    );

    if (inStockProducts.length === 0) {
      triggerToast(
        language === 'vi'
          ? 'Không có sản phẩm nào còn hàng để chuyển vào giỏ!'
          : 'No in-stock items available to move to cart!',
        'info'
      );
      return;
    }

    setCartItems((prev) => {
      const updated = [...prev];
      inStockProducts.forEach((prod) => {
        const idx = updated.findIndex((i) => i.product.id === prod.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({
            product: prod,
            quantity: 1,
            selectedColor: 'Standard',
          });
        }
      });
      return updated;
    });

    triggerToast(
      language === 'vi'
        ? `Đã chuyển ${inStockProducts.length} sản phẩm còn hàng vào giỏ hàng!`
        : `Added ${inStockProducts.length} in-stock items to cart!`,
      'success',
      language === 'vi' ? 'Xem giỏ hàng' : 'View Cart',
      () => router.push('/cart')
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        setOrders,
        createOrder,
        cancelOrder,
        reorder,
        updateOrderStatus,
        addresses,
        setAddresses,
        addAddress,
        removeAddress,
        setDefaultAddress,
        kycApplications,
        approveKyc,
        rejectKyc,
        disputes,
        resolveDispute,
        requestReturnRefund,
        sellerChatSession,
        openSellerChat,
        closeSellerChat,
        isCartOpen,
        setIsCartOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        toastMessage,
        setToastMessage,
        triggerToast,
        currentUser,
        setCurrentUser,
        activeRole,
        setActiveRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleLogin,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        moveAllWishlistToCart,
        flyingParticles,
        triggerFlyEffect,
        cartBounceCount,
        wishlistBounceCount,
        products,
        setProducts,
        addProduct,
      }}
    >
      {children}
      <FlyToHeaderOverlay
        particles={flyingParticles}
        onParticleComplete={handleParticleComplete}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
