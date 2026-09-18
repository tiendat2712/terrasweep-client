import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { SellerLiveChatModal } from "@/components/buyer/SellerLiveChatModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["vietnamese", "latin"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#dff2f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://terrasweep.com"),
  title: {
    default: "TerraSweep — Hệ Thống Mua Sắm & Thương Mại Điện Tử Đương Đại",
    template: "%s | TerraSweep",
  },
  description:
    "TerraSweep - Hệ sinh thái thương mại điện tử đương đại cao cấp với trải nghiệm mua sắm tinh tế, Live Flash Sale trực tiếp, giao hàng siêu tốc 2H SLA và hệ thống quản trị 4 phân hệ toàn diện (Người Mua, Shop Bán, Shipper, Quản Trị Viên).",
  applicationName: "TerraSweep",
  keywords: [
    "TerraSweep",
    "thương mại điện tử",
    "mua sắm trực tuyến",
    "e-commerce",
    "flash sale",
    "sneakers",
    "thời trang cao cấp",
    "luxury fashion",
    "giao hàng siêu tốc",
    "shipper",
    "merchant portal",
    "admin dashboard",
  ],
  authors: [{ name: "TerraSweep Engineering Team" }],
  creator: "TerraSweep",
  publisher: "TerraSweep",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "TerraSweep — Minimalist Luxury E-Commerce Ecosystem",
    description:
      "Nền tảng thương mại điện tử đương đại cao cấp tích hợp đa phân hệ Người Mua, Kênh Người Bán, Cổng Vận Chuyển và Quản Trị Viên.",
    url: "https://terrasweep.com",
    siteName: "TerraSweep",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "TerraSweep E-Commerce Platform Preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraSweep — Minimalist Luxury E-Commerce",
    description:
      "Nền tảng thương mại điện tử đương đại cao cấp với trải nghiệm mua sắm mượt mà, Flash Sale trực tiếp và giao hàng siêu tốc.",
    images: ["/images/og-image.png"],
    creator: "@terrasweep",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground selection:bg-sky-500 selection:text-white"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <CartProvider>
            {children}
            <SellerLiveChatModal />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
