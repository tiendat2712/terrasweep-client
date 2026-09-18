'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  X,
  Send,
  Store,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Check,
  CheckCheck,
  Camera,
  Smile,
  Minimize2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  timestamp: string;
  productCard?: {
    name: string;
    image: string;
    price: number;
  };
}

const FAQ_PROMPTS_VI = [
  'Sản phẩm này còn sẵn hàng không shop?',
  'Bao lâu thì giao tới nơi ở TP.HCM?',
  'Shop có hỗ trợ đổi trả nếu không vừa size không?',
  'Sản phẩm có đầy đủ hộp và bảo hành chính hãng không?',
];

const FAQ_PROMPTS_EN = [
  'Is this item currently in stock?',
  'How long does shipping take to my address?',
  'Can I exchange if the size does not fit?',
  'Does this item include full warranty and official box?',
];

export function SellerLiveChatModal() {
  const { language } = useLanguage();
  const { sellerChatSession, closeSellerChat, currentUser } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages when session opens
  useEffect(() => {
    if (sellerChatSession?.isOpen) {
      setIsMinimized(false);
      const sellerName = sellerChatSession.sellerName || 'TerraSweep Flagship Store';
      const greeting: ChatMessage = {
        id: 'msg-init-1',
        sender: 'seller',
        text:
          language === 'vi'
            ? `Dạ chào bạn ${currentUser?.name || ''}! ${sellerName} rất vui được hỗ trợ bạn. Bạn đang quan tâm đến sản phẩm nào hoặc cần shop tư vấn gì cứ nhắn shop ngay nhé ạ!`
            : `Hello ${currentUser?.name || ''}! Welcome to ${sellerName}. How may we assist you with your shopping today?`,
        timestamp: 'Vừa xong',
      };

      if (sellerChatSession.productContext) {
        const productIntro: ChatMessage = {
          id: 'msg-init-2',
          sender: 'user',
          text:
            language === 'vi'
              ? `Tôi đang quan tâm đến sản phẩm này:`
              : `I have a question regarding this product:`,
          timestamp: 'Vừa xong',
          productCard: sellerChatSession.productContext,
        };
        setMessages([greeting, productIntro]);
      } else if (sellerChatSession.orderContext) {
        const orderIntro: ChatMessage = {
          id: 'msg-init-2',
          sender: 'user',
          text:
            language === 'vi'
              ? `Tôi muốn hỏi về tiến độ đơn hàng #${sellerChatSession.orderContext.id}`
              : `I would like an update on order #${sellerChatSession.orderContext.id}`,
          timestamp: 'Vừa xong',
        };
        setMessages([greeting, orderIntro]);
      } else {
        setMessages([greeting]);
      }
    }
  }, [sellerChatSession?.isOpen, sellerChatSession?.sellerName]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSellerTyping]);

  if (!sellerChatSession?.isOpen) return null;

  const sellerName = sellerChatSession.sellerName || 'TerraSweep Flagship Store';
  const faqs = language === 'vi' ? FAQ_PROMPTS_VI : FAQ_PROMPTS_EN;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isSellerTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Simulate smart merchant response
    setIsSellerTyping(true);
    setTimeout(() => {
      let replyText =
        language === 'vi'
          ? 'Dạ shop đã nhận được tin nhắn! Sản phẩm này là hàng chính hãng 100%, có bảo hành 12 tháng và hỗ trợ đổi size miễn phí trong 15 ngày bạn nhé!'
          : 'Thank you for reaching out! This product is 100% genuine with official warranty and free 15-day exchange.';

      const lower = text.toLowerCase();
      if (lower.includes('size') || lower.includes('cỡ')) {
        replyText =
          language === 'vi'
            ? 'Dạ mẫu này form chuẩn quốc tế ạ. Bạn đi size thông thường bao nhiêu cứ chọn đúng size đó nhé, hoặc bạn cho shop xin số đo để shop tư vấn chuẩn xác nhất nha!'
            : 'This model fits true to size. You can order your regular shoe or apparel size.';
      } else if (lower.includes('giao') || lower.includes('bao lâu') || lower.includes('ship')) {
        replyText =
          language === 'vi'
            ? 'Dạ đơn hàng tại nội thành TP.HCM và Hà Nội shop có hỗ trợ Hỏa Tốc nhận trong 2 giờ ạ. Giao tiêu chuẩn toàn quốc từ 1 - 2 ngày là bạn nhận được nha!'
            : 'We offer 2-Hour Express in major cities, or 1-2 business days for standard delivery nationwide.';
      } else if (lower.includes('đổi') || lower.includes('trả') || lower.includes('hoàn')) {
        replyText =
          language === 'vi'
            ? 'Dạ bên shop có chính sách TerraProtect: Đổi trả miễn phí trong 15 ngày nếu sản phẩm lỗi hoặc không vừa size. Bạn chỉ cần tạo yêu cầu hoàn trả ngay trên web là shipper đến tận nhà lấy ạ!'
            : 'We support hassle-free 15-day returns with home pickup. You can request return anytime in Order Tracking.';
      }

      const sellerMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sellerMsg]);
      setIsSellerTyping(false);
    }, 1000);
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isMinimized ? (
        /* Minimized Pill */
        <button
          onClick={() => setIsMinimized(false)}
          className="btn-ocean-primary px-5 py-3 rounded-full text-white shadow-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-all text-xs font-bold"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <MessageCircle className="w-4 h-4" />
          <span>{sellerName}</span>
        </button>
      ) : (
        /* Expanded Live Chat Window */
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-3xl border border-sky-200/90 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white text-sky-700 flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                <Store className="w-4 h-4 text-sky-600" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm truncate leading-tight">
                    {sellerName}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/20 text-white">
                    Mall
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-sky-100 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>{language === 'vi' ? 'Đang online • Phản hồi 5p' : 'Online • Replies in 5m'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closeSellerChat}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Pin (If Product Inquired) */}
          {sellerChatSession.productContext && (
            <div className="px-3.5 py-2 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={sellerChatSession.productContext.image}
                  alt="Context"
                  className="w-8 h-8 rounded-lg object-contain bg-white border border-sky-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[11px] text-slate-900 truncate">
                    {sellerChatSession.productContext.name}
                  </p>
                  <p className="font-mono text-[10px] font-bold text-sky-700">
                    {formatVND(sellerChatSession.productContext.price)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-sky-600 bg-white px-2 py-0.5 rounded-md border border-sky-200 shrink-0 font-semibold">
                Đang xem
              </span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      isUser
                        ? 'btn-ocean-primary text-white rounded-br-xs shadow-2xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <p className="leading-relaxed font-sans">{m.text}</p>

                    {/* Attached Mini Product Card */}
                    {m.productCard && (
                      <div className="mt-2 p-2 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2 text-left">
                        <img
                          src={m.productCard.image}
                          alt="thumb"
                          className="w-10 h-10 rounded-lg object-contain bg-white shrink-0"
                        />
                        <div className="min-w-0 text-white">
                          <p className="font-bold text-[11px] truncate">{m.productCard.name}</p>
                          <p className="font-mono font-bold text-[10px] text-sky-100">
                            {formatVND(m.productCard.price)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono px-1">
                    <span>{m.timestamp}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-sky-500" />}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isSellerTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                  Shop
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {faqs.map((faq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(faq)}
                className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[10.5px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {faq}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'vi' ? 'Nhập tin nhắn cho người bán...' : 'Write message to seller...'
              }
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isSellerTyping}
              className="w-9 h-9 rounded-xl btn-ocean-primary text-white flex items-center justify-center shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer active:scale-90 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
