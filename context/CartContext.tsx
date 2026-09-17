'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PlatformUser, Role, Order, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from '@/data/mockData';
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

  // Load cart & orders from localStorage on mount
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
