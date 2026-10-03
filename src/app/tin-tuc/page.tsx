import { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsPageClient from "@/components/NewsPageClient";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSettings();

  return {
    title: `TIN TỨC & SỰ KIỆN DOANH NGHIỆP | ${settings.name}`,
    description:
      "Cập nhật những hoạt động nổi bật, tiến độ thi công các công trình trọng điểm, an toàn lao động và thông tin doanh nghiệp Trung Hải JSC.",
    keywords: [
      "Tin tức Trung Hải",
      "Sự kiện Trung Hải",
      "Tiến độ công trình",
      "An toàn lao động",
      "Tin dự án hạ tầng",
      "Tuyển dụng Trung Hải",
    ],
    openGraph: {
      title: `TIN TỨC & SỰ KIỆN DOANH NGHIỆP | ${settings.name}`,
      description:
        "Cập nhật thông tin mới nhất về các dự án thi công hầm đường bộ, cầu cạn và các chuyển động của Trung Hải JSC.",
      url: "https://trunghaico.vn/tin-tuc",
      siteName: settings.name,
      locale: "vi_VN",
      type: "website",
    },
    alternates: {
      canonical: "https://trunghaico.vn/tin-tuc",
    },
  };
}

export default async function NewsPage() {
  const [allNews, settings] = await Promise.all([
    db.getNews(),
    db.getSettings(),
  ]);

  // JSON-LD structured data for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://trunghaico.vn/tin-tuc/#webpage",
        "url": "https://trunghaico.vn/tin-tuc",
        "name": `Tin Tức & Sự Kiện | ${settings.name}`,
        "description": "Tin tức công trình và sự kiện doanh nghiệp Trung Hải",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://trunghaico.vn/#website",
          "name": settings.name,
          "url": "https://trunghaico.vn",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ed3237] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header hotline={settings.hotline || settings.phone} />
      <main className="flex-1">
        <NewsPageClient initialNews={allNews} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
