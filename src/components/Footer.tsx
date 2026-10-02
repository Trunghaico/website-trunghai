"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp, ChevronRight } from "lucide-react";
import { CompanySettings } from "@/types";

interface FooterProps {
  settings: CompanySettings;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#151f32] text-slate-200 border-t-2 border-[#ed3237] pt-14 sm:pt-16 pb-12 relative overflow-hidden">
      {/* Subtle ambient light gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3e4095]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ed3237]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-700/70">
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative h-12 w-64 max-w-full">
              <Image
                src="/logo.png"
                alt="Trung Hải JSC Logo"
                fill
                className="object-contain object-left drop-shadow"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              <strong className="text-white block font-bold mb-1 text-[15px]">{settings.name}</strong>
              Đơn vị tiên phong thi công các công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các tuyến quốc lộ trọng điểm quốc gia.
            </p>
            <div className="pt-1 text-sm text-slate-300 space-y-1.5">
              <div>
                Mã số doanh nghiệp: <span className="text-white font-bold">{settings.taxCode || "0310001821"}</span>
              </div>
              <div className="text-slate-400 text-xs sm:text-sm">Cấp bởi: Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh</div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ed3237]" />
              <span>Liên Kết Nhanh</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Giới thiệu doanh nghiệp</span>
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Lĩnh vực hoạt động</span>
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Công trình tiêu biểu</span>
                </Link>
              </li>
              <li>
                <Link href="/#news" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3.5 h-3.5 text-[#ed3237]" />
                  <span>Tin tức & Sự kiện</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Projects (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Đại Công Trình</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/#projects" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Hầm Đèo Cả & Cổ Mã</span>
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Hầm đường bộ Cù Mông</span>
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Hầm Phước Tượng - Phú Gia</span>
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Mở rộng QL1 Khánh Hòa</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ed3237]" />
              <span>Liên Hệ Trụ Sở</span>
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ed3237] shrink-0 mt-1" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ed3237] shrink-0" />
                <span className="font-semibold text-white">{settings.phone} / {settings.hotline}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ed3237] shrink-0" />
                <span className="text-slate-200">{settings.email}</span>
              </div>
            </div>

            {/* Portal access */}
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[3px] bg-slate-800/90 hover:bg-slate-700 border border-slate-600/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#ed3237]" />
                <span>Trang Quản Trị Hệ Thống (CMS)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div>
            © {new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">Tiêu chuẩn ISO 9001:2015 & OHSAS 18001</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-[3px] bg-slate-800 hover:bg-[#ed3237] text-slate-300 hover:text-white border border-slate-700 transition-all shadow"
              aria-label="Về đầu trang"
              title="Về đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Red-Blue Gradient Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-[3px] bg-gradient-to-r from-[#ed3237] to-[#3e4095] hover:opacity-95 text-white shadow-xl shadow-[#ed3237]/35 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Về đầu trang"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
}
