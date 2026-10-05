"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building,
  Layers,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  X,
  ChevronLeft,
  Award,
} from "lucide-react";
import { Project, CompanySettings } from "@/types";
import ShareButtons from "@/components/ShareButtons";

interface ProjectDetailViewProps {
  project: Project;
  relatedProjects: Project[];
  settings: CompanySettings;
}

export default function ProjectDetailView({
  project,
  relatedProjects,
  settings,
}: ProjectDetailViewProps) {
  const allImages = [
    project.thumbnail,
    ...(project.gallery || []).filter((img) => img !== project.thumbnail),
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentUrl = `https://trunghaico.vn/cong-trinh/${project.slug}`;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-28 sm:pt-32 pb-20 selection:bg-[#ed3237] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <Link
                href="/"
                className="text-slate-600 hover:text-[#ed3237] transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li>
              <Link
                href="/cong-trinh"
                className="text-slate-600 hover:text-[#ed3237] transition-colors"
              >
                Công trình tiêu biểu
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-[#ed3237] font-semibold truncate max-w-[240px] sm:max-w-md">
              {project.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/cong-trinh"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#ed3237] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục công trình</span>
          </Link>
        </div>

        {/* 2 Columns Grid: Main Article (8 cols) + Related Projects Column (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-white rounded-[3px] border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Header Section */}
            <header className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-[3px] bg-[#3e4095] text-white text-xs font-bold uppercase tracking-wider shadow-2xs">
                  {project.categoryName}
                </span>
                {project.value && (
                  <span className="px-3 py-1 rounded-[3px] bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    {project.value}
                  </span>
                )}
                {project.featured && (
                  <span className="px-2.5 py-1 rounded-[3px] bg-red-50 text-[#ed3237] border border-red-200 text-xs font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Dự án trọng điểm</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-snug tracking-tight">
                {project.title}
              </h1>

              {/* Quick Meta Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-[3px] border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ed3237] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Địa điểm</span>
                    <span className="font-semibold text-slate-800">{project.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#3e4095] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Thời gian thi công</span>
                    <span className="font-semibold text-slate-800">{project.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Chủ đầu tư</span>
                    <span className="font-semibold text-slate-800 truncate block max-w-full">
                      {project.client}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Photo Hero */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 md:h-[460px] w-full rounded-[3px] overflow-hidden bg-slate-100 group">
                <Image
                  src={allImages[selectedImageIndex] || project.thumbnail}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover cursor-pointer transition-transform duration-500 group-hover:scale-102"
                  onClick={() => openLightbox(selectedImageIndex)}
                />
                <button
                  type="button"
                  onClick={() => openLightbox(selectedImageIndex)}
                  className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-[#ed3237] text-white rounded-[3px] backdrop-blur-sm transition-colors cursor-pointer"
                  title="Xem ảnh phóng to"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Gallery Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-[3px] overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-[#ed3237] ring-2 ring-red-200"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Ảnh ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Scale Box */}
            <div className="p-4 sm:p-5 rounded-[3px] bg-gradient-to-r from-red-50/80 via-white to-red-50/50 border-l-4 border-l-[#ed3237] border-y border-r border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3e4095] mb-1.5">
                <Layers className="w-4 h-4 text-[#ed3237]" />
                <span>Quy mô & Thông số kỹ thuật chủ đạo</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                {project.scale}
              </p>
            </div>

            {/* Detailed Article Description */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-l-3 border-[#3e4095] pl-3">
                Tổng Quan & Bối Cảnh Thực Hiện Dự Án
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3 font-normal">
                <p>{project.description}</p>
                <p>
                  Trong suốt quá trình triển khai, Công ty Cổ phần Xây dựng và Đầu tư Trung Hải (Trung Hải JSC) đã huy động toàn bộ nguồn lực cơ giới hiện đại, đội ngũ kỹ sư dày dạn kinh nghiệm và áp dụng các giải pháp thi công tiên tiến nhất nhằm bảo đảm tiến độ, an toàn lao động tuyệt đối và chất lượng công trình đạt chuẩn mực quốc gia.
                </p>
              </div>
            </div>

            {/* Social Share Strip */}
            <div className="pt-4 border-t border-slate-100">
              <ShareButtons title={project.title} url={currentUrl} />
            </div>

            {/* Bottom Back Button */}
            <div className="pt-2">
              <Link
                href="/cong-trinh"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ed3237] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh mục tất cả công trình</span>
              </Link>
            </div>
          </article>

          {/* Right Column: Công Trình Tiêu Biểu Khác (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-[3px] border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ed3237]" />
                  <span>Công Trình Tiêu Biểu Khác</span>
                </h3>
                <Link
                  href="/cong-trinh"
                  className="text-xs text-[#ed3237] hover:underline font-bold shrink-0"
                >
                  Xem tất cả
                </Link>
              </div>

              {relatedProjects.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">Chưa có công trình liên quan khác.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {relatedProjects.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/cong-trinh/${rel.slug}`}
                      className="group flex items-start gap-3 py-3.5 first:pt-1 last:pb-1 hover:bg-slate-50/80 -mx-2 px-2 rounded-[3px] transition-colors"
                    >
                      <div className="relative w-20 h-16 rounded-[3px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={rel.thumbnail}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-106 transition-transform duration-500"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-[10px] text-[#3e4095] font-extrabold uppercase tracking-wider block truncate">
                          {rel.categoryName}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ed3237] line-clamp-2 leading-snug transition-colors">
                          {rel.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {rel.year} • {rel.location}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Image Viewing */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[selectedImageIndex]}
              alt={project.title}
              fill
              className="object-contain"
            />

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 p-2 bg-black/50 hover:bg-[#ed3237] text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 p-2 bg-black/50 hover:bg-[#ed3237] text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
