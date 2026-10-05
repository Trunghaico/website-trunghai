import { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesPageClient from "@/components/ServicesPageClient";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSettings();

  return {
    title: `LĨNH VỰC HOẠT ĐỘNG | NĂNG LỰC TỔNG THẦU | ${settings.name}`,
    description:
      "Chuyên môn cốt lõi của Trung Hải JSC: Thi công hầm đường bộ xuyên núi (công nghệ NATM), đường cao tốc, cầu cạn kết cấu phức tạp, gia cố mái dốc taluy chống sạt trượt và hạ tầng kỹ thuật trọng điểm quốc gia.",
    keywords: [
      "lĩnh vực hoạt động Trung Hải",
      "thi công hầm đường bộ",
      "khoan hầm NATM",
      "thi công cao tốc Bắc Nam",
      "xây dựng cầu cạn",
      "gia cố mái ta luy",
      "xử lý sạt trượt",
      "Trung Hải JSC",
      "năng lực tổng thầu hạ tầng",
    ],
    alternates: {
      canonical: "https://trunghaico.vn/linh-vuc-hoat-dong",
    },
    openGraph: {
      title: `LĨNH VỰC HOẠT ĐỘNG | ${settings.name}`,
      description:
        "Làm chủ công nghệ đào hầm hiện đại, thi công đường cao tốc, cầu đường và các đại công trình hạ tầng giao thông huyết mạch quốc gia.",
      url: "https://trunghaico.vn/linh-vuc-hoat-dong",
      siteName: settings.name,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Lĩnh vực hoạt động Trung Hải JSC",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `LĨNH VỰC HOẠT ĐỘNG | ${settings.name}`,
      description:
        "Hạ tầng giao thông, hầm xuyên núi, cầu đường và giải pháp địa kỹ thuật cao cấp.",
      images: ["/logo.png"],
    },
  };
}

export default async function LinhVucHoatDongPage() {
  const settings = await db.getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://trunghaico.vn/linh-vuc-hoat-dong/#webpage",
        url: "https://trunghaico.vn/linh-vuc-hoat-dong",
        name: `LĨNH VỰC HOẠT ĐỘNG | ${settings.name}`,
        description:
          "Tổng thầu thi công hạ tầng giao thông, hầm đường bộ xuyên núi và kết cấu kỹ thuật phức tạp.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://trunghaico.vn/#website",
          url: "https://trunghaico.vn",
          name: "Trung Hải JSC",
        },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://trunghaico.vn/linh-vuc-hoat-dong/#breadcrumb",
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
            name: "Giới thiệu",
            item: "https://trunghaico.vn/gioi-thieu",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Lĩnh vực hoạt động",
            item: "https://trunghaico.vn/linh-vuc-hoat-dong",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        hotline={settings.hotline}
        phoneDisplay={settings.phone}
        address={settings.address}
        email={settings.email}
      />
      <ServicesPageClient settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
