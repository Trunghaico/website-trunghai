import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ScrollObserver from "@/components/ScrollObserver";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI | TRUNG HAI JSC",
  description:
    "Nhà thầu hàng đầu Việt Nam về thi công hạ tầng giao thông, hầm đường bộ qua Đèo Cả, Cù Mông, Phước Tượng - Phú Gia, Quốc lộ 1 và các công trình giao thông trọng điểm.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
    description: "Nhà thầu tiên phong trong xây dựng công trình giao thông trọng điểm quốc gia.",
    url: "https://trunghaico.vn",
    siteName: "Trung Hải JSC",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${roboto.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#ed3237] selection:text-white">
        <ScrollObserver />
        {children}
      </body>
    </html>
  );
}
