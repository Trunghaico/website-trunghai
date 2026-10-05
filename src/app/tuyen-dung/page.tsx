import { Metadata } from "next";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecruitmentPageClient from "@/components/RecruitmentPageClient";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSettings();

  return {
    title: `TUYỂN DỤNG NHÂN TÀI | CƠ HỘI NGHỀ NGHIỆP | ${settings.name}`,
    description:
      "Gia nhập đội ngũ Trung Hải JSC – Đơn vị thi công hạ tầng giao thông, hầm đường bộ, cầu cạn hàng đầu Việt Nam. Cơ hội nghề nghiệp với mức thu nhập cạnh tranh, thưởng tiến độ và chế độ đãi ngộ toàn diện.",
    keywords: [
      "Tuyển dụng Trung Hải",
      "Tuyển dụng kỹ sư cầu đường",
      "Tuyển kỹ sư công trình giao thông",
      "Tuyển chỉ huy trưởng công trình",
      "Tuyển kỹ sư trắc đạc",
      "Việc làm xây dựng hầm đường bộ",
      "Trung Hải JSC tuyển dụng",
    ],
    alternates: {
      canonical: "https://trunghaico.vn/tuyen-dung",
    },
    openGraph: {
      title: `CƠ HỘI NGHỀ NGHIỆP TẠI TRUNG HẢI JSC | ${settings.name}`,
      description:
        "Cơ hội phát triển nghề nghiệp cùng Trung Hải JSC trong các đại công trình hầm và hạ tầng giao thông trọng điểm quốc gia.",
      url: "https://trunghaico.vn/tuyen-dung",
      siteName: settings.name,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Tuyển dụng Trung Hải JSC",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `TUYỂN DỤNG NHÂN TÀI | ${settings.name}`,
      description:
        "Gia nhập đội ngũ kiến tạo những cung đường và đại công trình đất nước cùng Trung Hải JSC.",
      images: ["/logo.png"],
    },
  };
}

export default async function RecruitmentPage() {
  const [allJobs, settings] = await Promise.all([
    db.getJobs(),
    db.getSettings(),
  ]);

  // JSON-LD structured data for CollectionPage and JobPostings
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://trunghaico.vn/tuyen-dung/#webpage",
        "url": "https://trunghaico.vn/tuyen-dung",
        "name": `Cơ Hội Nghề Nghiệp & Tuyển Dụng | ${settings.name}`,
        "description":
          "Thông tin tuyển dụng kỹ sư cầu đường, chỉ huy trưởng và cán bộ kỹ thuật tại Trung Hải JSC",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://trunghaico.vn/#website",
          "name": settings.name,
          "url": "https://trunghaico.vn",
        },
      },
      ...allJobs
        .filter((j) => j.active)
        .map((job) => ({
          "@type": "JobPosting",
          "title": job.title,
          "description": job.description.join(". "),
          "datePosted": "2026-01-01",
          "validThrough": job.deadline,
          "employmentType":
            job.type === "Toàn thời gian" ? "FULL_TIME" : "CONTRACTOR",
          "hiringOrganization": {
            "@type": "Organization",
            "name": settings.name,
            "sameAs": "https://trunghaico.vn",
            "logo": "https://trunghaico.vn/logo.png",
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location,
              "addressCountry": "VN",
            },
          },
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "VND",
            "value": {
              "@type": "QuantitativeValue",
              "value": job.salary,
            },
          },
        })),
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
        <RecruitmentPageClient
          initialJobs={allJobs}
          settings={settings}
        />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
