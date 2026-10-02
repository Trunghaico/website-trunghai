"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp } from "lucide-react";
import { CompanySettings } from "@/types";

interface FooterProps {
  settings: CompanySettings;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative h-12 w-44">
              <Image
                src="/logo.png"
                alt="Trung Hải JSC Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              <strong className="text-white block mb-1">{settings.name}</strong>
              Đơn vị tiên phong thi công các công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các tuyến quốc lộ trọng điểm quốc gia.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div>Mã số doanh nghiệp: <span className="text-slate-200 font-semibold">{settings.taxCode}</span></div>
              <div>Cấp bởi: Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh</div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#home" className="hover:text-orange-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-orange-400 transition-colors">
                  Giới thiệu doanh nghiệp
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-orange-400 transition-colors">
                  Lĩnh vực hoạt động
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-orange-400 transition-colors">
                  Công trình tiêu biểu
                </Link>
              </li>
              <li>
                <Link href="#news" className="hover:text-orange-400 transition-colors">
                  Tin tức & Sự kiện
                </Link>
              </li>
              <li>
                <Link href="#recruitment" className="hover:text-orange-400 transition-colors">
                  Cơ hội việc làm
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Projects (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Đại Công Trình
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#projects" className="hover:text-orange-400 transition-colors">
                  Hầm Đèo Cả & Cổ Mã
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-orange-400 transition-colors">
                  Hầm đường bộ Cù Mông
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-orange-400 transition-colors">
                  Hầm Phước Tượng - Phú Gia
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-orange-400 transition-colors">
                  Mở rộng QL1 Khánh Hòa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Liên Hệ Trụ Sở
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-300">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300 font-semibold">{settings.phone} / {settings.hotline}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-slate-300">{settings.email}</span>
              </div>
            </div>

            {/* Portal access */}
            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Trang Quản Trị Hệ Thống (CMS)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">Tiêu chuẩn ISO 9001:2015 & OHSAS 18001</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-slate-900 hover:bg-orange-600 text-slate-400 hover:text-white border border-slate-800 transition-all"
              aria-label="Về đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Red Back to Top Button as shown in screenshot */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 p-2.5 rounded-[3px] bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Về đầu trang"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
}
