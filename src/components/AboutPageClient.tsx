"use client";

import { useState, useRef } from "react";
import { Eye, Target, Gem } from "lucide-react";
import { CompanySettings } from "@/types";

interface AboutPageClientProps {
  settings: CompanySettings;
}

// Reusable 8-Point Rosette Icon matching Image 1
function RosetteIcon({ color = "#ed3237" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      className="w-4 h-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 2l1.6 3.6 3.8-1.2-.4 4 3.7 1.5-2.5 3.1 2.5 3.1-3.7 1.5.4 4-3.8-1.2L12 22l-1.6-3.6-3.8 1.2.4-4-3.7-1.5 2.5-3.1-2.5-3.1 3.7-1.5-.4-4 3.8 1.2L12 2z" />
    </svg>
  );
}

// 3D Tilt Container with Mouse Parallax & Dynamic Light Glare
function TiltCard({
  children,
  className = "",
  maxTilt = 5,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
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

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.16 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const shadowX = -rotate.y * 1.1;
  const shadowY = rotate.x * 1.1 + 8;

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(10px) scale3d(1.015, 1.015, 1.015)`
            : "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)",
          boxShadow: isHovered
            ? `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 24px -4px rgba(237, 50, 55, 0.16), 0 12px 24px -4px rgba(15, 23, 42, 0.10)`
            : "0 2px 6px 0 rgba(0, 0, 0, 0.04)",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.15s ease-out"
            : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative transition-colors select-none ${className}`}
      >
        {/* Dynamic Light Sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-[inherit]"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)`,
          }}
        />
        {children}
      </div>
    </div>
  );
}

// Architectural & Mechanical Blueprint Graphic for Machinery Cards matching Image 4
function EquipmentBlueprint({
  item,
}: {
  item: {
    badge: string;
    overlayTitle: string;
    overlaySub: string;
    subText: string;
    title: string;
    desc: string;
    type: string;
  };
}) {
  return (
    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#111827]">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none" />

      {/* Silhouettes & SVGs based on equipment type */}
      {item.type === "crane" && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around px-2 opacity-30 pointer-events-none">
            <div className="w-10 h-28 bg-slate-600 rounded-t-sm" />
            <div className="w-12 h-32 bg-slate-500 rounded-t-sm" />
            <div className="w-8 h-20 bg-slate-600 rounded-t-sm" />
            <div className="w-14 h-26 bg-slate-500 rounded-t-sm" />
          </div>
          <div className="absolute top-2 right-4 w-44 h-44 opacity-50 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#f59e0b" className="w-full h-full stroke-[1.2]">
              <line x1="50" y1="5" x2="50" y2="95" strokeWidth="1.5" />
              <line x1="8" y1="24" x2="92" y2="24" strokeWidth="1.5" />
              <line x1="50" y1="5" x2="92" y2="24" />
              <line x1="50" y1="5" x2="8" y2="24" />
              <line x1="50" y1="24" x2="70" y2="50" strokeDasharray="2 2" />
              <circle cx="50" cy="24" r="3" fill="#ed3237" stroke="#fff" strokeWidth="1" />
            </svg>
          </div>
        </>
      )}

      {item.type === "pump" && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end px-4 gap-3 opacity-30 pointer-events-none">
            <div className="w-24 h-16 bg-slate-600 rounded-t-sm" />
            <div className="w-32 h-20 bg-slate-500 rounded-t-sm" />
            <div className="flex-1 h-12 bg-slate-600 rounded-t-sm" />
          </div>
          <div className="absolute top-2 right-2 w-48 h-44 opacity-55 pointer-events-none">
            <svg viewBox="0 0 120 100" fill="none" stroke="#f59e0b" className="w-full h-full stroke-[1.4]">
              <rect x="75" y="70" width="38" height="15" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="83" cy="85" r="4" fill="#334155" stroke="#f59e0b" />
              <circle cx="103" cy="85" r="4" fill="#334155" stroke="#f59e0b" />
              <line x1="82" y1="70" x2="60" y2="40" strokeWidth="2" stroke="#f59e0b" />
              <line x1="60" y1="40" x2="35" y2="18" strokeWidth="2" stroke="#f59e0b" />
              <line x1="35" y1="18" x2="10" y2="35" strokeWidth="1.8" stroke="#f59e0b" />
              <line x1="10" y1="35" x2="10" y2="65" strokeWidth="1.5" stroke="#ed3237" strokeDasharray="3 2" />
              <circle cx="82" cy="70" r="2.5" fill="#ed3237" />
              <circle cx="60" cy="40" r="2.5" fill="#f59e0b" />
              <circle cx="35" cy="18" r="2.5" fill="#f59e0b" />
            </svg>
          </div>
        </>
      )}

      {item.type === "workshop" && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-28 flex items-end justify-between px-3 opacity-30 pointer-events-none">
            <div className="w-16 h-24 bg-slate-600" />
            <div className="w-24 h-28 bg-slate-500" />
            <div className="w-20 h-20 bg-slate-600" />
          </div>
          <div className="absolute top-2 right-4 w-44 h-44 opacity-50 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#f59e0b" className="w-full h-full stroke-[1.2]">
              <polygon points="10,40 50,15 90,40" strokeWidth="1.8" />
              <line x1="10" y1="40" x2="90" y2="40" strokeWidth="1.5" />
              <line x1="50" y1="15" x2="50" y2="40" strokeWidth="1.2" />
              <line x1="30" y1="40" x2="50" y2="15" />
              <line x1="70" y1="40" x2="50" y2="15" />
              <line x1="15" y1="40" x2="15" y2="85" strokeWidth="2" />
              <line x1="85" y1="40" x2="85" y2="85" strokeWidth="2" />
              <circle cx="50" cy="15" r="3" fill="#ed3237" stroke="#fff" strokeWidth="1" />
            </svg>
          </div>
        </>
      )}

      {/* Red Category Badge matching Image 4 */}
      <div className="absolute top-3 left-3 z-20">
        <span className="px-2.5 py-0.5 rounded-[2px] bg-[#ed3237] text-white text-[11px] font-bold uppercase tracking-wider shadow">
          {item.badge}
        </span>
      </div>

      {/* Dark Blueprint Overlay Text Box matching Image 4 */}
      <div className="absolute bottom-3 left-3 right-3 z-20 p-3 rounded-[2px] bg-[#182133]/90 border-l-[3.5px] border-[#ed3237] backdrop-blur-sm space-y-0.5">
        <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
          {item.overlayTitle}
        </div>
        <div className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
          {item.overlaySub}
        </div>
        <div className="text-[9px] text-slate-400 truncate">
          {item.subText}
        </div>
      </div>

      {/* Subtle Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

export default function AboutPageClient({ settings }: AboutPageClientProps) {
  // Timeline Milestones matching Image 3
  const timelineMilestones = [
    {
      year: "2010",
      yearColor: "text-[#ed3237]",
      title: "Thành Lập Doanh Nghiệp",
      desc: "Khởi đầu với tên gọi Công ty CP Xây dựng TTNT Trung Hải, tập trung vào thiết kế thi công nội thất và hoàn thiện công trình dân dụng.",
    },
    {
      year: "2015",
      yearColor: "text-[#f59e0b]",
      title: "Mở Rộng Quy Mô Thi Công",
      desc: "Nâng cấp thành Công ty CP Đầu tư Xây lắp Trung Hải, chính thức tham gia thi công các dự án nhà cao tầng và hạ tầng kỹ thuật đô thị.",
    },
    {
      year: "2020",
      yearColor: "text-[#ed3237]",
      title: "Đầu Tư Nhà Xưởng Cơ Khí",
      desc: "Vận hành nhà máy chế tạo kết cấu thép và xưởng gia công cửa nhựa uPVC, vách kính mặt dựng công nghệ Đức, khép kín chuỗi giá trị xây lắp.",
    },
    {
      year: "2026",
      yearColor: "text-[#f59e0b]",
      title: "Chuyển Đổi Số & Bền Vững",
      desc: "Áp dụng công nghệ số hóa mô hình BIM, quản trị hiện đại, sẵn sàng đấu thầu và đảm nhận các siêu dự án công nghiệp & thương mại lớn.",
    },
  ];

  // Heavy Equipment & Facilities matching Image 4
  const machineryItems = [
    {
      badge: "CƠ GIỚI",
      overlayTitle: "Dàn Cẩu Tháp 8 - 16 Tấn",
      overlaySub: "12 CẨU THÁP TỰ NÂNG ĐỒNG BỘ",
      subText: "CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY LẮP TRUNG HẢI • ISO 9001:2015",
      title: "Cẩu Tháp & Vận Thăng Lồng Tải Trọng Lớn",
      desc: "Dàn 12 cẩu tháp tự nâng tải trọng 8 – 16 tấn cùng hệ thống vận thăng đôi đạt chuẩn kiểm định an toàn quốc gia.",
      type: "crane",
    },
    {
      badge: "THIẾT BỊ BÊ TÔNG",
      overlayTitle: "Trạm Bơm & Cốp Pha Nhôm",
      overlaySub: "XE BƠM CẦN 52M & VÁN KHUÔN ĐỒNG BỘ",
      subText: "TRUNG HẢI JSC • ISO 9001:2015",
      title: "Trạm Bơm & Cốp Pha Nhôm Nhập Khẩu",
      desc: "Xe bơm bê tông cần 52m, hệ ván khuôn cốp pha nhôm liền khối giúp bề mặt bê tông láng mịn không cần trát vữa dày.",
      type: "pump",
    },
    {
      badge: "NHÀ XƯỞNG",
      overlayTitle: "Xưởng Sản Xuất Kết Cấu Thép",
      overlaySub: "CÔNG SUẤT 5.000 TẤN THÉP/NĂM",
      subText: "CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY LẮP TRUNG HẢI • ISO 9001:2015",
      title: "Nhà Xưởng Chế Tạo Kết Cấu Thép",
      desc: "Dây chuyền cắt CNC plasma, máy hàn tự động dầm H và xưởng lắp ráp cấu kiện nhôm kính công suất 5.000 tấn thép/năm.",
      type: "workshop",
    },
  ];

  return (
    <div className="bg-white text-slate-800 pt-20 sm:pt-24 selection:bg-[#ed3237] selection:text-white">
      {/* 1. TỔNG QUAN DOANH NGHIỆP (PHẦN 1 - KHỚP 100% HÌNH 1) */}
      <section className="pt-6 sm:pt-10 pb-14 sm:pb-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge matching Image 1: TỔNG QUAN DOANH NGHIỆP */}
              <div>
                <span className="inline-block px-4 py-1.5 rounded-[3px] bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/25">
                  TỔNG QUAN DOANH NGHIỆP
                </span>
              </div>

              {/* Title matching Image 1 */}
              <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.2] uppercase">
                HƠN 15 NĂM ĐỒNG HÀNH KIẾN TẠO DIỆN MẠO ĐÔ THỊ
              </h1>

              {/* Paragraphs matching Image 1 */}
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                <p>
                  Công ty Cổ phần Đầu tư Xây lắp Trung Hải (tiền thân là Công ty Cổ phần Xây dựng TTNT Trung Hải) được thành lập và hoạt động với sứ mệnh trở thành đối tác tổng thầu tin cậy trong các dự án công trình dân dụng, hạ tầng kỹ thuật và công nghiệp.
                </p>
                <p>
                  Từ những ngày đầu khởi nghiệp với các công trình quy mô vừa, Trung Hải không ngừng tái đầu tư công nghệ, hoàn thiện hệ thống máy móc cơ giới hiện đại và bồi dưỡng nguồn nhân lực kỹ sư chất lượng cao. Đến nay, công ty đã thực hiện thành công hơn 380 công trình trên khắp cả nước, khẳng định vị thế thương hiệu xây dựng uy tín, chuyên nghiệp.
                </p>
              </div>

              {/* 2 Feature Cards matching Image 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Khối 1: PHÁP LÝ MINH BẠCH (Red border-l) */}
                <div className="border-l-[3.5px] border-[#ed3237] pl-3.5 py-1.5 space-y-1 bg-slate-50/70 rounded-r-[3px]">
                  <div className="flex items-center gap-2">
                    <RosetteIcon color="#ed3237" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                      PHÁP LÝ MINH BẠCH
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Mã số doanh nghiệp {settings.taxCode || "0310001821"}, đầy đủ chứng chỉ năng lực xây dựng Hạng I từ Bộ Xây Dựng.
                  </p>
                </div>

                {/* Khối 2: QUẢN LÝ TIÊU CHUẨN (Amber/Gold border-l matching Image 1) */}
                <div className="border-l-[3.5px] border-[#f59e0b] pl-3.5 py-1.5 space-y-1 bg-slate-50/70 rounded-r-[3px]">
                  <div className="flex items-center gap-2">
                    <RosetteIcon color="#f59e0b" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                      QUẢN LÝ TIÊU CHUẨN
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Áp dụng toàn diện hệ thống ISO 9001:2015 và an toàn vệ sinh lao động OHSAS 18001.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D High-Tech Graphic Card with Crane Blueprint & Floating 380+ Badge matching Image 1 */}
            <div className="lg:col-span-5 relative">
              <TiltCard className="rounded-[4px] overflow-hidden bg-[#111827] border border-slate-800 shadow-2xl">
                <div className="relative p-6 sm:p-8 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden">
                  {/* Subtle Grid blueprint background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 pointer-events-none" />

                  {/* Silhouettes of high-rise bars in varying heights */}
                  <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-around px-4 opacity-40 pointer-events-none">
                    <div className="w-12 h-36 bg-slate-700/60 rounded-t-sm" />
                    <div className="w-14 h-52 bg-slate-600/60 rounded-t-sm" />
                    <div className="w-12 h-28 bg-slate-700/60 rounded-t-sm" />
                    <div className="w-16 h-44 bg-slate-600/60 rounded-t-sm" />
                    <div className="w-10 h-20 bg-slate-700/60 rounded-t-sm" />
                  </div>

                  {/* Architectural Silhouette / Crane wireframe graphic matching screenshot */}
                  <div className="absolute top-4 right-4 w-52 h-52 opacity-40 pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-amber-400 w-full h-full stroke-[1.2]">
                      <line x1="50" y1="5" x2="50" y2="95" stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1="10" y1="25" x2="90" y2="25" stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1="50" y1="5" x2="90" y2="25" />
                      <line x1="50" y1="5" x2="10" y2="25" />
                      <circle cx="50" cy="25" r="3.5" fill="#ed3237" stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Top Red Badge matching Image 1: TRUNG HẢI XD */}
                  <div className="relative z-10" style={{ transform: "translateZ(14px)" }}>
                    <span className="inline-block px-3 py-1 rounded-[2px] bg-[#ed3237] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                      TRUNG HẢI XD
                    </span>
                  </div>

                  {/* Bottom Text Panel with Red Left Indicator matching Image 1 */}
                  <div
                    className="relative z-10 p-5 rounded-[3px] bg-[#182133]/90 border-l-4 border-[#ed3237] backdrop-blur-md space-y-1 mt-20"
                    style={{ transform: "translateZ(12px)" }}
                  >
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      Công Trình Thi Công Tiêu Biểu
                    </h3>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#ed3237]">
                      TỔNG THẦU THI CÔNG XÂY LẮP
                    </div>
                    <div className="text-[11px] text-slate-400 font-light pt-1">
                      CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY LẮP TRUNG HẢI • ISO 9001:2015
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Floating Solid Dark 3D Badge with 380+ Project Deliveries matching Image 1 */}
              <div
                className="absolute -bottom-6 right-2 sm:-right-4 z-20"
                style={{ perspective: "1000px" }}
              >
                <div className="p-4 sm:p-5 rounded-[3px] bg-[#0c1017] text-white border border-slate-800 border-b-4 border-b-[#ed3237] shadow-2xl shadow-black/80 min-w-[170px] sm:min-w-[190px] transition-transform duration-300 hover:scale-105">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-amber-400 drop-shadow">
                    380+
                  </div>
                  <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider mt-1 text-white leading-snug">
                    DỰ ÁN BÀN GIAO THÀNH CÔNG
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRIẾT LÝ PHÁT TRIỂN / TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI (PHẦN 2 - KHỚP HÌNH 2) */}
      <section className="py-14 sm:py-18 lg:py-20 bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header matching Image 2 */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-10 sm:mb-14">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-[2px] bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
                TRIẾT LÝ PHÁT TRIỂN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
              Kim chỉ nam soi sáng mọi quyết định và hành động của tập thể cán bộ công nhân viên Trung Hải.
            </p>
          </div>

          {/* 3 Pillars Grid with 3D Tilt Cards matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: TẦM NHÌN (Red Top Border) */}
            <TiltCard className="bg-white rounded-[3px] border border-slate-200 border-t-4 border-t-[#ed3237] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4" style={{ transform: "translateZ(10px)" }}>
                {/* Red Target/Eye Icon */}
                <div className="w-12 h-12 rounded-full bg-red-50 text-[#ed3237] flex items-center justify-center">
                  <Eye className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  TẦM NHÌN
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Trở thành một trong những tổng thầu xây lắp công trình dân dụng & công nghiệp hàng đầu khu vực miền Nam, tiên phong áp dụng kỹ thuật số BIM và vật liệu xây dựng bền vững, thân thiện với môi trường.
                </p>
              </div>
            </TiltCard>

            {/* Card 2: SỨ MỆNH (Amber/Gold Top Border matching Image 2) */}
            <TiltCard className="bg-white rounded-[3px] border border-slate-200 border-t-4 border-t-amber-500 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4" style={{ transform: "translateZ(10px)" }}>
                {/* Bullseye Icon in Amber */}
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Target className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  SỨ MỆNH
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Kiến tạo không gian sống và sản xuất an toàn, kiên cố; mang đến giá trị gia tăng vượt trội và tối ưu hóa ngân sách cho Chủ đầu tư; xây dựng môi trường làm việc chuyên nghiệp, nhân văn cho người lao động.
                </p>
              </div>
            </TiltCard>

            {/* Card 3: GIÁ TRỊ CỐT LÕI (Dark Slate Top Border matching Image 2) */}
            <TiltCard className="bg-white rounded-[3px] border border-slate-200 border-t-4 border-t-slate-900 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4" style={{ transform: "translateZ(10px)" }}>
                {/* Diamond Icon */}
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center">
                  <Gem className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  GIÁ TRỊ CỐT LÕI
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-normal">
                  <li className="leading-snug">
                    <strong className="text-slate-900 font-bold uppercase">UY TÍN:</strong> Giữ trọn chữ tín với đối tác.
                  </li>
                  <li className="leading-snug">
                    <strong className="text-slate-900 font-bold uppercase">TIẾN ĐỘ:</strong> Cam kết đúng hẹn từng hạng mục.
                  </li>
                  <li className="leading-snug">
                    <strong className="text-slate-900 font-bold uppercase">CHẤT LƯỢNG:</strong> Chuẩn mực kỹ thuật là sống còn.
                  </li>
                  <li className="leading-snug">
                    <strong className="text-slate-900 font-bold uppercase">AN TOÀN:</strong> Sinh mệnh con người là trên hết.
                  </li>
                </ul>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. DẤU ẤN PHÁT TRIỂN / CHẶNG ĐƯỜNG HÌNH THÀNH & LỚN MẠNH (PHẦN 3 - KHỚP HÌNH 3) */}
      <section className="py-14 sm:py-18 lg:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header matching Image 3 */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-10 sm:mb-14">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-[2px] bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
                DẤU ẤN PHÁT TRIỂN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              CHẶNG ĐƯỜNG HÌNH THÀNH & LỚN MẠNH
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
              Những cột mốc đáng tự hào đánh dấu sự chuyển mình mạnh mẽ của Trung Hải qua từng thời kỳ.
            </p>
          </div>

          {/* 4 Timeline Columns Grid matching Image 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {timelineMilestones.map((item, idx) => (
              <TiltCard
                key={idx}
                className="bg-white rounded-[3px] border border-slate-200 hover:border-[#ed3237]/50 p-6 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3" style={{ transform: "translateZ(10px)" }}>
                  <div className={`text-3xl sm:text-4xl font-black tracking-tight ${item.yearColor}`}>
                    {item.year}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NĂNG LỰC CƠ GIỚI / HỆ THỐNG TRANG THIẾT BỊ THI CÔNG HIỆN ĐẠI (PHẦN 4 - KHỚP HÌNH 4) */}
      <section className="py-14 sm:py-18 lg:py-20 bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header matching Image 4 */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-10 sm:mb-14">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-[2px] bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
                NĂNG LỰC CƠ GIỚI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              HỆ THỐNG TRANG THIẾT BỊ THI CÔNG HIỆN ĐẠI
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
              Trang bị đồng bộ máy móc chuyên dụng, giảm thiểu phụ thuộc bên ngoài và tối ưu tiến độ.
            </p>
          </div>

          {/* 3 Heavy Equipment Cards matching Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {machineryItems.map((item, idx) => (
              <TiltCard
                key={idx}
                className="bg-white rounded-[3px] border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm group cursor-pointer"
              >
                <div>
                  {/* Top Graphic Blueprint Banner matching Image 4 */}
                  <EquipmentBlueprint item={item} />

                  {/* Body Content below matching Image 4 */}
                  <div className="p-5 sm:p-6 space-y-2" style={{ transform: "translateZ(8px)" }}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
