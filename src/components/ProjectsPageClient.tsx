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
  CheckCircle2,
  Layers,
  ArrowRight,
  RotateCcw,
  Home,
  Mountain,
  Route,
  Milestone,
  HardHat,
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
    { id: "all", label: "Tất cả", icon: Layers, count: categoryCounts.all },
    { id: "ham", label: "Hầm xuyên núi", icon: Mountain, count: categoryCounts.ham },
    { id: "cau-duong", label: "Cầu & Đường bộ", icon: Route, count: categoryCounts["cau-duong"] },
    { id: "quoc-lo", label: "Quốc lộ & Cao tốc", icon: Milestone, count: categoryCounts["quoc-lo"] },
    { id: "ha-tang", label: "Hạ tầng kỹ thuật", icon: HardHat, count: categoryCounts["ha-tang"] },
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
    <div className="bg-slate-50/60 min-h-screen text-slate-800 pt-20 sm:pt-24 selection:bg-[#ed3237] selection:text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. TOP BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <h1 className="sr-only">Công trình & Dự án - Trung Hải JSC</h1>
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="flex items-center gap-1 text-slate-600 hover:text-[#ed3237] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-[#ed3237] font-semibold">Công trình & Dự án</li>
          </ol>
        </nav>

        {/* 2. TWO-COLUMN LAYOUT: LEFT SIDEBAR (3 COLS) + RIGHT PROJECTS (9 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[3px] border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-5">
              {/* Search Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tìm kiếm dự án
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên, địa điểm, chủ đầu tư..."
                    className="w-full pl-8 pr-7 py-2 rounded-[3px] bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237]/20 transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-1 cursor-pointer"
                      title="Xóa tìm kiếm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Danh mục thi công
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {categories.length} mục
                  </span>
                </div>

                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const Icon = cat.icon;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-[3px] text-xs font-bold transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "bg-[#ed3237] text-white shadow-xs"
                            : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? "text-white" : "text-slate-500 group-hover:text-[#ed3237]"
                            }`}
                          />
                          <span className="truncate">{cat.label}</span>
                        </div>

                        <span
                          className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold shrink-0 ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sắp xếp hiển thị
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 rounded-[3px] bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#ed3237] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="default">Mặc định</option>
                    <option value="featured">Công trình tiêu biểu</option>
                    <option value="newest">Năm hoàn thành mới nhất</option>
                  </select>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Reset Filter Button */}
              {(searchQuery || selectedCategory !== "all" || sortBy !== "default") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2 px-3 rounded-[3px] bg-red-50 hover:bg-red-100 border border-red-200 text-[#ed3237] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT CONTENT: PROJECTS GRID */}
          <main className="lg:col-span-9 space-y-5">
            {/* Top Bar above grid: Result Summary */}
            <div className="bg-white rounded-[3px] border border-slate-200 px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Hiển thị <strong className="text-slate-900 font-bold">{filteredProjects.length}</strong> / {initialProjects.length} công trình
                </span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-red-50 text-[#ed3237] font-semibold border border-red-200 text-[11px]">
                    {categories.find((c) => c.id === selectedCategory)?.label}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className="hover:text-red-800 ml-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px]">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-slate-900 ml-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              {(searchQuery || selectedCategory !== "all" || sortBy !== "default") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#ed3237] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
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
              <div className="text-center py-16 px-4 bg-white rounded-[3px] border border-slate-200 space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Không tìm thấy công trình phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Không có dự án nào khớp với tiêu chí tìm kiếm hoặc chuyên mục hiện tại của bạn.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-[#ed3237] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#ed3237]/25 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xem Tất Cả Công Trình</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* INTERACTIVE PROJECT DETAILS MODAL */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}
