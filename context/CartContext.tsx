'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PlatformUser, Role, Order, OrderStatus, TrackingEvent, AddressItem, MerchantKYCApplication, DisputeClaim } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_ADDRESSES, INITIAL_KYC_APPLICATIONS, INITIAL_DISPUTES } from '@/data/mockData';
import { useLanguage } from '@/i18n/LanguageContext';
import { useRouter } from 'next/navigation';

interface ToastState {
  text: string;
  type: 'success' | 'info';
  actionText?: string;
  onAction?: () => void;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay';
    shippingFee: number;
    discount: number;
    items?: CartItem[];
  }) => string;
  cancelOrder: (orderId: string, reason?: string) => void;
  reorder: (orderId: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    extra?: { podPhoto?: string; failReason?: string; rescheduledDate?: string }
  ) => void;
  addresses: AddressItem[];
  addAddress: (addr: Omit<AddressItem, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  kycApplications: MerchantKYCApplication[];
  approveKyc: (id: string) => void;
  rejectKyc: (id: string, reason: string) => void;
  disputes: DisputeClaim[];
  resolveDispute: (id: string, resolution: 'refunded' | 'rejected', note?: string) => void;
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
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [kycApplications, setKycApplications] = useState<MerchantKYCApplication[]>(INITIAL_KYC_APPLICATIONS);
  const [disputes, setDisputes] = useState<DisputeClaim[]>(INITIAL_DISPUTES);

  // Load cart, orders & addresses from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('flashcart_cart_items');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
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
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

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

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: variant || 'Standard',
        },
      ];
    });

    triggerToast(
      language === 'vi'
        ? `Đã thêm "${product.name.slice(0, 30)}..." vào giỏ hàng`
        : `Added "${product.name.slice(0, 30)}..." to shopping bag`,
      'success',
      language === 'vi' ? 'Xem Giỏ Hàng' : 'View Cart',
      () => router.push('/cart')
    );
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
    paymentMethod: 'FlashPay' | 'COD' | 'CyberCard' | 'ApplePay';
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
      () => setIsTrackingOpen(true)
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
    extra?: { podPhoto?: string; failReason?: string; rescheduledDate?: string }
  ) => {
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
            note: extra?.failReason || (extra?.podPhoto ? (language === 'vi' ? 'Đã chụp ảnh bằng chứng giao hàng' : 'Proof of delivery photo saved') : ''),
            completed: true,
          };
          return {
            ...ord,
            status,
            podPhoto: extra?.podPhoto || ord.podPhoto,
            podTimestamp: extra?.podPhoto ? new Date().toLocaleTimeString('vi-VN') : ord.podTimestamp,
            failReason: extra?.failReason || ord.failReason,
            rescheduledDate: extra?.rescheduledDate || ord.rescheduledDate,
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
        addAddress,
        removeAddress,
        setDefaultAddress,
        kycApplications,
        approveKyc,
        rejectKyc,
        disputes,
        resolveDispute,
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
      }}
    >
      {children}
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
