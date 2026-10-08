"use client";

import React from "react";
import Image from "next/image";
import { Partner } from "@/types";

interface PartnerItem {
  id: string;
  name: string;
  website?: string;
  renderLogo: () => React.ReactNode;
}

// Danh sách logo đối tác vector mẫu phóng to rõ ràng (chỉ hiển thị biểu tượng logo, không kèm chữ)
const defaultVectorLogos: PartnerItem[] = [
  {
    id: "novaland",
    name: "NOVALAND",
    renderLogo: () => (
      <svg className="w-24 sm:w-30 lg:w-36 h-12 sm:h-16 lg:h-18 text-[#00529b]" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="15" height="3" rx="1.5" />
        <rect x="2" y="10.5" width="20" height="3" rx="1.5" />
        <rect x="2" y="17" width="12" height="3" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "vsip",
    name: "VSIP GROUP",
    renderLogo: () => (
      <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-full border-3 border-[#008852] flex items-center justify-center text-[#008852]">
        <svg className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ),
  },
  {
    id: "hoaphat",
    name: "HÒA PHÁT",
    renderLogo: () => (
      <svg className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="#b91c1c" strokeWidth="2.2" fill="#fef2f2" />
        <polygon points="12,6 17,9 17,15 12,18 7,15 7,9" fill="#1e3a8a" />
      </svg>
    ),
  },
  {
    id: "namlong",
    name: "NAM LONG",
    renderLogo: () => (
      <svg className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 text-[#ea5b0c]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 18h4.5l3.5-7.5L15.5 18H20L12 2z" />
        <circle cx="12" cy="20.5" r="1.5" />
      </svg>
    ),
  },
  {
    id: "khangdien",
    name: "KHANG ĐIỀN",
    renderLogo: () => (
      <svg className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 text-[#003e85]" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7.5" height="18" rx="1" />
        <rect x="13.5" y="7" width="7.5" height="14" rx="1" />
        <circle cx="6.7" cy="7" r="1" fill="white" />
        <circle cx="6.7" cy="11" r="1" fill="white" />
        <circle cx="6.7" cy="15" r="1" fill="white" />
        <circle cx="17.2" cy="11" r="1" fill="white" />
        <circle cx="17.2" cy="15" r="1" fill="white" />
      </svg>
    ),
  },
  {
    id: "phuminh",
    name: "PHU MINH GROUP",
    renderLogo: () => (
      <svg className="w-16 sm:w-20 lg:w-22 h-14 sm:h-16 lg:h-18" viewBox="0 0 24 24" fill="none">
        <path d="M4 20L12 5L20 20" stroke="#ed3237" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 20L12 11L16 20" stroke="#004e9a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "deoca",
    name: "TẬP ĐOÀN ĐÈO CẢ",
    renderLogo: () => (
      <svg className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18" viewBox="0 0 24 24" fill="none">
        <path d="M3 19V9a9 9 0 0 1 18 0v10" stroke="#ed3237" strokeWidth="2.5" />
        <path d="M7 19v-6a5 5 0 0 1 10 0v6" stroke="#3e4095" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: "vinaconex",
    name: "VINACONEX",
    renderLogo: () => (
      <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-xl bg-[#ea580c] flex items-center justify-center text-white font-black text-2xl sm:text-3xl lg:text-4xl shadow-xs">
        V
      </div>
    ),
  },
  {
    id: "cienco4",
    name: "CIENCO 4",
    renderLogo: () => (
      <svg className="w-16 sm:w-20 lg:w-22 h-14 sm:h-16 lg:h-18 text-[#0284c7]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "vietinbank",
    name: "VIETINBANK",
    renderLogo: () => (
      <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-full bg-[#1e40af] flex items-center justify-center text-white font-black text-2xl sm:text-3xl lg:text-4xl shadow-xs">
        V
      </div>
    ),
  },
  {
    id: "bidv",
    name: "BIDV",
    renderLogo: () => (
      <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-xl bg-[#047857] flex items-center justify-center text-white font-black text-2xl sm:text-3xl lg:text-4xl shadow-xs">
        B
      </div>
    ),
  },
  {
    id: "coteccons",
    name: "COTECCONS",
    renderLogo: () => (
      <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-full border-3 border-[#e11d48] flex items-center justify-center text-[#e11d48] font-black text-2xl sm:text-3xl lg:text-4xl">
        C
      </div>
    ),
  },
];

interface PartnersSectionProps {
  partners?: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  // Lọc các đối tác đang bật active !== false từ database
  const activeDbPartners = partners
    ? partners.filter((p) => p.active !== false).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    : [];

  // Nếu đã truyền prop partners từ database mà danh sách rỗng (đã bị xóa hết), ẩn luôn phần đối tác
  if (partners !== undefined && activeDbPartners.length === 0) {
    return null;
  }

  // Tạo danh sách hiển thị CHỈ CÓ LOGO (căn giữa, vừa vặn cân đối)
  const displayItems =
    activeDbPartners.length > 0
      ? activeDbPartners.map((p) => ({
          id: p.id,
          name: p.name,
          website: p.website,
          renderLogo: () => (
            <div className="relative w-36 sm:w-44 lg:w-48 h-16 sm:h-20 lg:h-22 max-w-[92%] flex items-center justify-center">
              <Image
                src={p.logo}
                alt={p.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 180px, 220px"
              />
            </div>
          ),
        }))
      : defaultVectorLogos;

  // Nhân đôi mảng để tạo vòng lặp vô tận (infinite marquee) chạy ngang mượt mà
  const duplicatedPartners = [...displayItems, ...displayItems];

  return (
    <section id="partners" className="py-14 sm:py-18 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header căn giữa theo mẫu thiết kế */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 reveal-on-scroll">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-[3px] bg-[#ed3237] text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider shadow-sm">
              ĐỐI TÁC TIN CẬY
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
            CHỦ ĐẦU TƯ &amp; ĐỐI TÁC CHIẾN LƯỢC
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Đồng hành cùng các tập đoàn bất động sản và doanh nghiệp đầu ngành uy tín tại Việt Nam.
          </p>
        </div>

        {/* Khung chứa các thẻ logo chạy ngang vô tận */}
        <div className="relative overflow-hidden group">
          {/* Lớp phủ mờ 2 mép trái và phải giúp các logo xuất hiện và biến mất mượt mà */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Dải logo tự động chuyển động ngang liên tục */}
          <div className="flex overflow-hidden select-none py-4 sm:py-6">
            <div className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee-infinite">
              {duplicatedPartners.map((partner, index) => {
                const CardWrapper = partner.website ? "a" : "div";
                const wrapperProps = partner.website
                  ? {
                      href: partner.website,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {};

                return (
                  <CardWrapper
                    key={`${partner.id}-${index}`}
                    {...wrapperProps}
                    title={partner.name}
                    className="shrink-0 h-24 sm:h-28 lg:h-32 min-w-[170px] sm:min-w-[200px] lg:min-w-[220px] px-4 sm:px-6 bg-white border-2 border-slate-300 hover:border-[#ed3237] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center cursor-pointer group/card no-underline"
                  >
                    <div className="transition-transform duration-300 group-hover/card:scale-105 flex items-center justify-center w-full h-full">
                      {partner.renderLogo()}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
