import type { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutPageClient from "@/components/AboutPageClient";

export const revalidate = 0;

// 1. Chuẩn SEO Tối Ưu Toàn Diện (Metadata API Next.js)
export const metadata: Metadata = {
  title: "Giới Thiệu Doanh Nghiệp | CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
  description:
    "Hơn 15 năm hình thành và phát triển. Công ty Cổ phần Xây dựng và Đầu tư Trung Hải (Trung Hải JSC) là tổng thầu uy tín thi công hạ tầng giao thông, hầm đường bộ, dân dụng và công nghiệp hàng đầu Việt Nam.",
  keywords: [
    "giới thiệu Trung Hải",
    "Công ty Cổ phần Xây dựng và Đầu tư Trung Hải",
    "Trung Hải JSC",
    "hồ sơ năng lực Trung Hải",
    "nhà thầu thi công hạ tầng giao thông",
    "thi công hầm đường bộ",
    "xây lắp công nghiệp",
    "năng lực cơ giới xây dựng",
  ],
  alternates: {
    canonical: "https://trunghaico.vn/gioi-thieu",
  },
  openGraph: {
    title: "Giới Thiệu Doanh Nghiệp | TRUNG HẢI JSC",
    description:
      "Hơn 15 năm hình thành và phát triển, hoàn thành hơn 380 công trình trên toàn quốc. Đơn vị tiên phong thi công hạ tầng giao thông trọng điểm.",
    url: "https://trunghaico.vn/gioi-thieu",
    siteName: "Trung Hải JSC",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Công ty Cổ phần Xây dựng và Đầu tư Trung Hải",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới Thiệu Doanh Nghiệp | TRUNG HẢI JSC",
    description:
      "Hơn 15 năm kiến tạo diện mạo đô thị và hạ tầng giao thông trọng điểm quốc gia.",
    images: ["/logo.png"],
  },
};

export default async function GioiThieuPage() {
  const settings = await db.getSettings();

  // Structured Data Schema (JSON-LD) cho Google Search Engine
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://trunghaico.vn/gioi-thieu/#webpage",
        url: "https://trunghaico.vn/gioi-thieu",
        name: "Giới Thiệu Doanh Nghiệp | CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
        description:
          "Hơn 15 năm hình thành và phát triển của Công ty Cổ phần Xây dựng và Đầu tư Trung Hải.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://trunghaico.vn/#website",
          url: "https://trunghaico.vn",
          name: "Trung Hải JSC",
        },
        inLanguage: "vi-VN",
      },
      {
        "@type": "Organization",
        "@id": "https://trunghaico.vn/#organization",
        name: settings.name || "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
        url: "https://trunghaico.vn",
        logo: "https://trunghaico.vn/logo.png",
        taxID: settings.taxCode || "0310001821",
        telephone: settings.hotline || settings.phone || "0966.700.045",
        email: settings.email || "info@trunghaico.vn",
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
          addressCountry: "VN",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://trunghaico.vn/gioi-thieu/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: "https://trunghaico.vn",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Giới thiệu doanh nghiệp",
            item: "https://trunghaico.vn/gioi-thieu",
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data cho chuẩn SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ed3237] selection:text-white">
        {/* Header điều hướng */}
        <Header hotline={settings.hotline || settings.phone} />

        {/* Nội dung chính chuẩn Semantic */}
        <main className="flex-1">
          <AboutPageClient settings={settings} />
        </main>

        {/* Chân trang Footer */}
        <Footer settings={settings} />
      </div>
    </>
  );
}
