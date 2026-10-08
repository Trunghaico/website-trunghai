import { db } from "@/lib/db";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import StatsCounter from "@/components/StatsCounter";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsSection from "@/components/NewsSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

// Revalidate data periodically or on request
export const revalidate = 0;

export default async function HomePage() {
  const [slides, projects, news, settings, partners] = await Promise.all([
    db.getSlides(),
    db.getProjects(),
    db.getNews(),
    db.getSettings(),
    db.getPartners(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ed3237] selection:text-white">
      {/* 1. Transparent-on-top Sticky Header */}
      <Header hotline={settings.hotline || settings.phone} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Mục đầu tiên của trang chủ: Image Slider */}
        <HeroSlider slides={slides} intervalSeconds={settings.slideInterval || 5} />

        {/* 3. Thống kê năng lực cốt lõi */}
        <StatsCounter />

        {/* 4. Giới thiệu doanh nghiệp */}
        <AboutSection />

        {/* 5. Lĩnh vực hoạt động */}
        <ServicesSection />

        {/* 6. Công trình / Dự án tiêu biểu */}
        <ProjectsSection initialProjects={projects} />

        {/* 7. Tin tức & Sự kiện */}
        <NewsSection initialNews={news} />

        {/* 8. Thẻ Đối tác chiến lược (tự động chạy ngang) */}
        <PartnersSection partners={partners} />
      </main>

      {/* 10. Chân trang đầy đủ thông tin pháp lý */}
      <Footer settings={settings} />
    </div>
  );
}
