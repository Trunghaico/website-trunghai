"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-10 sm:py-14 lg:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image with animated overlapping red experience card */}
          <div className="lg:col-span-6 relative pb-5 sm:pb-7 pr-4 sm:pr-6 group">
            {/* Image Box with zoom on hover */}
            <div className="relative rounded-[3px] overflow-hidden shadow-lg aspect-[16/11] w-full bg-slate-100 border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
                alt="Tập thể cán bộ công nhân viên Công ty Trung Hải"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
            </div>

            {/* Overlapping Solid Red Badge with Hover Float & Glow Animation */}
            <div className="absolute bottom-0 right-0 sm:-bottom-3 sm:-right-2 bg-red-600 text-white p-4 sm:p-6 rounded-[3px] shadow-xl shadow-red-600/30 min-w-[170px] sm:min-w-[200px] z-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-red-600/50 cursor-default">
              <div className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                12+
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mt-1.5 leading-snug">
                NĂM KIẾN TẠO GIÁ TRỊ BỀN VỮNG
              </div>
            </div>
          </div>

          {/* Right Column: Company Story with balanced compact spacing */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            {/* Tag Badge */}
            <div>
              <span className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-red-600 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-red-600/30">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>VỀ CHÚNG TÔI</span>
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
              CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI
            </h2>

            {/* Paragraph 1 */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Trung Hải là doanh nghiệp hoạt động chuyên sâu trong lĩnh vực thi công xây dựng công trình hạ tầng giao thông, hầm đường bộ xuyên núi và kết cấu kỹ thuật cao.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Với tôn chỉ <strong className="text-slate-900 font-bold">&quot;Uy Tín – Tiến Độ – Chất Lượng&quot;</strong>, chúng tôi tự hào sở hữu đội ngũ kỹ sư giàu kinh nghiệm, hệ thống máy móc thiết bị cơ giới hiện đại và năng lực thi công các dự án quy mô lớn đòi hỏi tiêu chuẩn kỹ thuật khắt khe.
            </p>

            {/* Vision & Mission 2-column Grid with Hover Shift & Border Thickening */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Tầm nhìn (Red border with hover animation) */}
              <div className="group/item border-l-2 hover:border-l-4 border-red-600 pl-4 py-1 space-y-1 hover:bg-slate-50/80 rounded-r-[3px] transition-all duration-300 hover:translate-x-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide group-hover/item:text-red-600 transition-colors">
                  TẦM NHÌN
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Trở thành tổng thầu xây lắp công trình giao thông uy tín hàng đầu khu vực phía Nam và cả nước.
                </p>
              </div>

              {/* Sứ mệnh (Amber/Orange border with hover animation) */}
              <div className="group/item border-l-2 hover:border-l-4 border-amber-500 pl-4 py-1 space-y-1 hover:bg-slate-50/80 rounded-r-[3px] transition-all duration-300 hover:translate-x-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide group-hover/item:text-amber-600 transition-colors">
                  SỨ MỆNH
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Kiến tạo những công trình kiên cố, an toàn, mang lại hiệu quả đầu tư tối ưu cho khách hàng.
                </p>
              </div>
            </div>

            {/* CTA Outline Button with Arrow animation */}
            <div className="pt-3">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-white rounded-[3px] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <span>TÌM HIỂU THÊM VỀ TRUNG HẢI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
