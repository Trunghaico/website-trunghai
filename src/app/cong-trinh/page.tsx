import { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectsPageClient from "@/components/ProjectsPageClient";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSettings();

  return {
    title: `CÔNG TRÌNH & DỰ ÁN TIÊU BIỂU | ${settings.name}`,
    description:
      "Danh mục toàn bộ các đại công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các dự án trọng điểm quốc gia do Trung Hải trực tiếp thi công.",
    keywords: [
      "Công trình Trung Hải",
      "Dự án hầm Đèo Cả",
      "Hầm Cù Mông",
      "Hầm Phước Tượng Phú Gia",
      "Xây dựng hạ tầng giao thông",
      "Tổng thầu xây lắp",
      "Hạ tầng kỹ thuật",
    ],
    openGraph: {
      title: `CÔNG TRÌNH & DỰ ÁN TIÊU BIỂU | ${settings.name}`,
      description:
        "Tổng hợp các công trình hầm đường bộ, cầu cạn và tuyến cao tốc huyết mạch quốc gia.",
      url: "https://trunghaico.vn/cong-trinh",
      siteName: "Trung Hải JSC",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Công trình tiêu biểu Trung Hải JSC",
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    alternates: {
      canonical: "https://trunghaico.vn/cong-trinh",
    },
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    db.getProjects(),
    db.getSettings(),
  ]);

  // JSON-LD structured data for CollectionPage and ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://trunghaico.vn/cong-trinh/#webpage",
        url: "https://trunghaico.vn/cong-trinh",
        name: `Công Trình & Dự Án Tiêu Biểu | ${settings.name}`,
        description:
          "Hồ sơ năng lực thi công các đại dự án hạ tầng giao thông trọng điểm.",
        breadcrumb: {
          "@type": "BreadcrumbList",
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
              name: "Công trình",
              item: "https://trunghaico.vn/cong-trinh",
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        itemListElement: projects.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.title,
          description: p.description,
          url: `https://trunghaico.vn/cong-trinh#${p.slug}`,
          image: p.thumbnail,
        })),
      },
    ],
  };

  return (
    <>
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ed3237] selection:text-white">
        {/* Navigation Header */}
        <Header hotline={settings.hotline || settings.phone} />

        {/* Main Content Area */}
        <main className="flex-1">
          <ProjectsPageClient initialProjects={projects} settings={settings} />
        </main>

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </>
  );
}
