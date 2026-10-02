"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight, Calendar, Layers, ArrowRight } from "lucide-react";
import { Project } from "@/types";
import ProjectModal from "./ProjectModal";

interface ProjectsSectionProps {
  initialProjects: Project[];
}

// Interactive 3D Project Card Component with Parallax Depth and Dynamic Sheen
function Project3DCard({
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

    // Subtle & elegant 3D tilt calculation (-3.5 to +3.5 degrees)
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const shadowX = -rotate.y * 0.8;
  const shadowY = rotate.x * 0.8 + 8;

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(8px) scale3d(1.012, 1.012, 1.012)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)",
          boxShadow: isHovered
            ? `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 18px -4px rgba(237, 50, 55, 0.16), 0 6px 14px -3px rgba(15, 23, 42, 0.08)`
            : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.15s ease-out"
            : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
        className="group cursor-pointer rounded-[3px] bg-white border border-slate-200 hover:border-[#ed3237]/60 overflow-hidden flex flex-col justify-between shadow-sm relative select-none"
      >
        {/* Dynamic Light Sheen Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 70%)`,
          }}
        />

        {/* Image & Badges with 3D Depth */}
        <div style={{ transform: "translateZ(6px)", transformStyle: "preserve-3d" }}>
          <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Category Pill in Deep Blue */}
            <div
              className="absolute top-3 left-3 z-20"
              style={{
                transform: isHovered ? "translateZ(14px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#3e4095] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                {project.categoryName}
              </span>
            </div>

            {/* Expand icon hover */}
            <div
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-[3px] bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#ed3237] group-hover:text-white transition-all duration-300 shadow"
              style={{
                transform: isHovered ? "translateZ(14px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Location & Year at bottom of image */}
            <div
              className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white z-20"
              style={{
                transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="flex items-center gap-1 drop-shadow">
                <MapPin className="w-3.5 h-3.5 text-[#ed3237]" />
                <span className="truncate font-medium">{project.location}</span>
              </div>
              <div className="flex items-center gap-1 drop-shadow">
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                <span className="font-medium">{project.year}</span>
              </div>
            </div>
          </div>

          {/* Body Content with 3D Depth */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3" style={{ transform: "translateZ(8px)" }}>
            <div>
              <h3
                className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors line-clamp-2 leading-snug"
                style={{
                  transform: isHovered ? "translateZ(12px)" : "translateZ(0px)",
                  transition: "transform 0.2s ease-out",
                }}
              >
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                {project.description}
              </p>
            </div>

            <div
              className="pt-3 border-t border-dashed border-slate-200 space-y-1.5"
              style={{
                transform: isHovered ? "translateZ(8px)" : "translateZ(0px)",
                transition: "transform 0.2s ease-out",
              }}
            >
              {project.scale && (
                <div className="flex items-start gap-1.5 text-xs text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-[#3e4095] shrink-0 mt-0.5" />
                  <span className="line-clamp-1 font-medium">{project.scale}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-slate-500">Chủ đầu tư:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                  {project.client}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    { id: "all", label: "Tất Cả Công Trình" },
    { id: "ham", label: "Hầm Xuyên Núi" },
    { id: "cau-duong", label: "Cầu & Đường Bộ" },
    { id: "quoc-lo", label: "Quốc Lộ & Cao Tốc" },
    { id: "ha-tang", label: "Hạ Tầng Kỹ Thuật" },
  ];

  const filteredProjects =
    filter === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-6 sm:py-8 lg:py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Compact & Modern */}
        <div className="space-y-2 max-w-3xl mb-6 sm:mb-8 reveal-on-scroll">
          <div>
            <span className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
              DỰ ÁN TRỌNG ĐIỂM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            CÔNG TRÌNH TIÊU BIỂU
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Những dấu ấn kiên cố mang thương hiệu Trung Hải trên khắp các tuyến đường huyết mạch quốc gia.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-5 sm:pb-6 reveal-on-scroll delay-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === cat.id
                  ? "bg-[#ed3237] text-white shadow-md shadow-[#ed3237]/30 scale-102"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className={`reveal-scale delay-${((idx % 3) + 1) * 100}`}>
              <Project3DCard
                project={project}
                onClick={() => setActiveProject(project)}
              />
            </div>
          ))}
        </div>

        {/* Link to Dedicated Projects Page */}
        <div className="text-center pt-8 sm:pt-10 reveal-on-scroll">
          <Link
            href="/cong-trinh"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[3px] bg-slate-900 hover:bg-[#ed3237] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#ed3237]/25 group"
          >
            <span>Xem Toàn Bộ Danh Sách Công Trình</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
