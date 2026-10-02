"use client";

import { useState } from "react";
import Image from "next/image";
import { X, MapPin, Calendar, Building, DollarSign, Layers, CheckCircle2 } from "lucide-react";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [selectedImg, setSelectedImg] = useState<string>("");

  if (!project) return null;

  const currentImage = selectedImg || project.thumbnail;
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.thumbnail];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-4xl rounded-[3px] bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 my-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-[3px] bg-black/60 hover:bg-[#ed3237] text-white backdrop-blur-md transition-colors shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Visual Header */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-100">
            <Image
              src={currentImage}
              alt={project.title}
              fill
              className="object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
              <span className="inline-block px-2.5 py-0.5 rounded-[2px] bg-[#3e4095] text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow">
                {project.categoryName}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {gallery.length > 1 && (
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex gap-2.5 overflow-x-auto">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`relative w-18 h-12 rounded-[2px] overflow-hidden shrink-0 border-2 transition-all ${
                    currentImage === img
                      ? "border-[#ed3237] scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Project Details Content */}
          <div className="p-4 sm:p-6 space-y-5">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-[3px] bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Địa Điểm</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  {project.location}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Chủ Đầu Tư</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">
                  {project.client}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Thời Gian</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  {project.year}
                </div>
              </div>

              {project.value && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <DollarSign className="w-3.5 h-3.5 text-[#ed3237]" />
                    <span>Giá Trị Gói Thầu</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#ed3237]">
                    {project.value}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Scale */}
            {project.scale && (
              <div className="p-3.5 rounded-[3px] bg-[#3e4095]/5 border border-[#3e4095]/20 flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#3e4095] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase text-[#3e4095]">
                    Quy Mô Kỹ Thuật Công Trình
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 mt-1 font-medium">
                    {project.scale}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Mô Tả Hạng Mục Thi Công</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {project.description}
              </p>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Điểm Nổi Bật & Kỹ Thuật Ứng Dụng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-[3px] bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3e4095] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
