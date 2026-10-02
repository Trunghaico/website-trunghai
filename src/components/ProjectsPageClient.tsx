"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Project, CompanySettings } from "@/types";
import ProjectModal from "@/components/ProjectModal";

interface ProjectsPageClientProps {
  initialProjects: Project[];
  settings: CompanySettings;
}

// 3D Tilt Card Component with Mouse Parallax & Dynamic Light Sheen
function Project3DItem({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth 3D tilt angle
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.18 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const shadowX = -rotate.y * 1.2;
  const shadowY = rotate.x * 1.2 + 10;

  return (
    <div
      style={{ perspective: "1200px" }}
      className={`h-full ${isHovered ? "z-30" : "z-10"}`}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`
            : "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)",
          boxShadow: isHovered
            ? `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 24px -4px rgba(237, 50, 55, 0.18), 0 10px 20px -3px rgba(15, 23, 42, 0.08)`
            : "0 1px 4px 0 rgba(0, 0, 0, 0.05)",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.15s ease-out"
            : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
        className="group cursor-pointer rounded-[3px] bg-white border border-slate-200 hover:border-[#ed3237]/60 overflow-hidden flex flex-col justify-between shadow-sm relative select-none h-full transition-colors"
      >
        {/* Dynamic Light Sheen Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 70%)`,
          }}
        />

        {/* Thumbnail Image Container with Parallax Depth */}
        <div style={{ transform: "translateZ(6px)", transformStyle: "preserve-3d" }}>
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Category Badge Floating in 3D */}
            <div
              className="absolute top-3 left-3 z-20"
              style={{
                transform: isHovered ? "translateZ(14px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <span className="px-2.5 py-1 rounded-[2px] bg-[#3e4095] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                {project.categoryName}
              </span>
            </div>

            {/* Featured / Value Badge */}
            {project.value && (
              <div
                className="absolute top-3 right-3 z-20"
                style={{
                  transform: isHovered ? "translateZ(14px)" : "translateZ(0px)",
                  transition: "transform 0.2s ease-out",
                }}
              >
                <span className="px-2.5 py-1 rounded-[2px] bg-slate-900/80 backdrop-blur-sm text-[#f59e0b] border border-amber-500/30 text-[11px] font-bold tracking-wide shadow">
                  {project.value}
                </span>
              </div>
            )}

            {/* Quick View Expand Icon Button */}
            <div
              className="absolute bottom-11 right-3 z-20 w-8 h-8 rounded-[3px] bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#ed3237] group-hover:text-white transition-all duration-300 shadow"
              style={{
                transform: isHovered ? "translateZ(14px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Location & Year at Bottom of Image */}
            <div
              className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white z-20"
              style={{
                transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="flex items-center gap-1.5 drop-shadow truncate pr-2">
                <MapPin className="w-3.5 h-3.5 text-[#ed3237] shrink-0" />
                <span className="truncate font-medium">{project.location}</span>
              </div>
              <div className="flex items-center gap-1 drop-shadow shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="font-medium text-slate-200">{project.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body with Detailed Technical Info */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors leading-snug line-clamp-2">
              {project.title}
            </h3>

            {/* Client */}
            {project.client && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium">Chủ đầu tư: <span className="text-slate-700">{project.client}</span></span>
              </div>
            )}

            {/* Technical Scale Box */}
            <div className="p-2.5 rounded-[2px] bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#3e4095] flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#3e4095]" />
                <span>Quy Mô Kỹ Thuật</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-slate-700 text-[11px] sm:text-xs">
                {project.scale}
              </p>
            </div>

            {/* Highlights Tag Pills */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.highlights.slice(0, 2).map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-red-50/80 text-[#ed3237] text-[10px] font-semibold"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate max-w-[200px]">{hl}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Trung Hải JSC</span>
            <span className="inline-flex items-center gap-1 text-[#ed3237] font-bold group-hover:translate-x-1 transition-transform">
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPageClient({
  initialProjects,
  settings,
}: ProjectsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "featured" | "newest">("default");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: initialProjects.length,
      ham: 0,
      "cau-duong": 0,
      "quoc-lo": 0,
      "ha-tang": 0,
    };
    initialProjects.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [initialProjects]);

  const categories = [
    { id: "all", label: "Tất Cả Dự Án", count: categoryCounts.all },
    { id: "ham", label: "Hầm Xuyên Núi", count: categoryCounts.ham },
    { id: "cau-duong", label: "Cầu & Đường Bộ", count: categoryCounts["cau-duong"] },
    { id: "quoc-lo", label: "Quốc Lộ & Cao Tốc", count: categoryCounts["quoc-lo"] },
    { id: "ha-tang", label: "Hạ Tầng Kỹ Thuật", count: categoryCounts["ha-tang"] },
  ];

  // Filter and sort logic
  const filteredProjects = useMemo(() => {
    let result = initialProjects.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.scale.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });

    if (sortBy === "featured") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => b.year.localeCompare(a.year));
    }

    return result;
  }, [initialProjects, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("default");
  };

  return (
    <div className="bg-white text-slate-800 pt-20 sm:pt-24 selection:bg-[#ed3237] selection:text-white">
      {/* 1. HERO BANNER WITH BLUEPRINT GRAPHIC & KEY STATS */}
      <section className="relative bg-[#111827] text-white py-14 sm:py-20 overflow-hidden border-b border-slate-800">
        {/* Subtle grid blueprint pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        {/* Ambient colored lighting glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3e4095]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#ed3237]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 reveal-on-scroll">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ed3237] font-semibold">Công trình & Dự án</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Header Description */}
            <div className="lg:col-span-8 space-y-4 reveal-fade-left">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[3px] bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HỒ SƠ NĂNG LỰC THI CÔNG</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.15]">
                TỔNG HỢP CÁC ĐẠI CÔNG TRÌNH & DỰ ÁN TRỌNG ĐIỂM
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl">
                Khẳng định vị thế tổng thầu tiên phong qua hàng loạt dự án hầm xuyên núi hiểm trở bậc nhất Việt Nam, các tuyến quốc lộ huyết mạch và công trình hạ tầng kỹ thuật đạt chuẩn mực an toàn quốc tế.
              </p>
            </div>

            {/* Right Side Metric Highlights Card */}
            <div className="lg:col-span-4 reveal-fade-right">
              <div className="p-5 sm:p-6 rounded-[3px] bg-[#182133]/90 border border-slate-700 backdrop-blur-md shadow-2xl space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] border-b border-slate-700/80 pb-2.5 flex items-center justify-between">
                  <span>THÀNH TỰU THI CÔNG</span>
                  <ShieldCheck className="w-4 h-4 text-[#ed3237]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-white">12+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Năm kinh nghiệm</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#ed3237]">380+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Công trình hoàn thành</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#3e4095] text-blue-400">30+ Km</div>
                    <div className="text-[11px] text-slate-400 font-medium">Hầm & cầu cạn</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#f59e0b]">5.000+</div>
                    <div className="text-[11px] text-slate-400 font-medium">Tỷ đồng gói thầu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROLS SECTION */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 sm:py-8 sticky top-16 z-30 shadow-sm backdrop-blur-md bg-slate-50/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên công trình, địa điểm, chủ đầu tư..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[3px] bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter by Category Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#ed3237] text-white shadow-md shadow-[#ed3237]/25"
                      : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      selectedCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#ed3237] shadow-sm cursor-pointer"
              >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="featured">Công trình tiêu biểu</option>
                <option value="newest">Năm thi công mới nhất</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicator */}
          <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị <span className="font-bold text-slate-900">{filteredProjects.length}</span> / {initialProjects.length} công trình
              {searchQuery && (
                <span className="ml-1 text-slate-600">
                  khớp với từ khóa &ldquo;<span className="text-[#ed3237] font-semibold">{searchQuery}</span>&rdquo;
                </span>
              )}
            </div>

            {(searchQuery || selectedCategory !== "all" || sortBy !== "default") && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[#ed3237] hover:underline font-semibold text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. MAIN PROJECTS GRID WITH 3D TILT ANIMATION */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`reveal-scale delay-${((idx % 3) + 1) * 100}`}
                >
                  <Project3DItem
                    project={project}
                    onClick={() => setActiveModalProject(project)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Không tìm thấy công trình phù hợp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Rất tiếc, không có dự án nào khớp với tiêu chí tìm kiếm hiện tại của bạn. Vui lòng thử tìm với từ khóa khác hoặc đặt lại bộ lọc.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-[#ed3237] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#ed3237]/25 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem Tất Cả Công Trình</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. CALL TO ACTION: READY FOR NEW MEGA PROJECTS */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(237,50,55,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                ĐỒNG HÀNH KIẾN TẠO TƯƠNG LAI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                SẴN SÀNG HỢP TÁC TRÊN MỌI CÔNG TRÌNH TRỌNG ĐIỂM
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Trung Hải cam kết mang đến giải pháp thi công tối ưu, thiết bị cơ giới hiện đại và đảm bảo tiến độ khắt khe nhất của từng dự án.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href={`tel:${settings.hotline.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[3px] bg-[#ed3237] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-lg shadow-[#ed3237]/30"
              >
                <Phone className="w-4 h-4 animate-phone-ring" />
                <span>Hotline: {settings.hotline}</span>
              </a>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[3px] bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider border border-slate-700 transition-all"
              >
                <span>Gửi Yêu Cầu Hợp Tác</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PROJECT DETAILS MODAL */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}
