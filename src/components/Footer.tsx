"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUp, ChevronRight, ExternalLink } from "lucide-react";
import { CompanySettings } from "@/types";

interface FooterProps {
  settings: CompanySettings;
}

const DEFAULT_QUICK_LINKS = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu doanh nghiệp", href: "/gioi-thieu" },
  { name: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" },
  { name: "Công trình tiêu biểu", href: "/cong-trinh" },
  { name: "Tin tức & Sự kiện", href: "/tin-tuc" },
  { name: "Cơ hội tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ hợp tác", href: "/lien-he" },
];

const DEFAULT_PROJECT_LINKS = [
  { name: "Hầm Đèo Cả & Cổ Mã", href: "/#projects" },
  { name: "Hầm đường bộ Cù Mông", href: "/#projects" },
  { name: "Hầm Phước Tượng - Phú Gia", href: "/#projects" },
  { name: "Mở rộng QL1 Khánh Hòa", href: "/#projects" },
];

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const companyName = settings.footerCompanyName || settings.name || "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI";
  const logoUrl = settings.headerLogoUrl || "/logo.png";
  const description =
    settings.footerDescription ||
    "Đơn vị tiên phong thi công các công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các tuyến quốc lộ trọng điểm quốc gia.";
  const taxCode = settings.taxCode || "0312019045";
  const taxAuthority = settings.footerTaxAuthority || "Cấp bởi: Thuế cơ sở 1 Thành phố Hồ Chí Minh";
  const address = settings.footerAddress || settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh";
  const phone = settings.footerPhone || settings.phone || "0966.700.045";
  const hotline = settings.footerHotline || settings.hotline || "0966.700.045";
  const email = settings.footerEmail || settings.email || "info@trunghaico.vn";
  const copyright =
    settings.footerCopyright ||
    `© ${new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights reserved.`;
  const isoCertification = settings.footerIsoCertification || "Tiêu chuẩn ISO 9001:2015 & OHSAS 18001";

  // Small Map settings on bottom right corner (tương tự bên trang liên hệ)
  const showMap = settings.footerShowMap !== false && settings.footerShowMap !== "false";
  const mapTitle = settings.footerMapTitle || "Vị Trí Trụ Sở";
  const mapEmbedUrl =
    settings.footerMapEmbedUrl ||
    settings.googleMapsEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7093.4802225019375!2d106.7340018!3d10.7902063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175250025dd33df%3A0x79d9f143bf06960a!2zQ8O0bmcgdHkgQ1AgWMOieSBk4buxbmcgQ-G6p3UgxJHGsOG7nW5nIFRow6BuaCBQaMOhdA!5e1!3m2!1svi!2s!4v1791253228303!5m2!1svi!2s";
  const mapUrl = settings.footerMapUrl || settings.googleMapsUrl || "https://www.google.com/maps?cid=0x79d9f143bf06960a";
  const mapAddress = settings.footerMapAddress || settings.footerAddress || settings.address || "12-14 Đường D5, P. An Khánh, TP. Hồ Chí Minh";

  const quickLinks = useMemo(() => {
    if (settings.footerQuickLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerQuickLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_QUICK_LINKS;
  }, [settings.footerQuickLinksJson]);

  const projectLinks = useMemo(() => {
    if (settings.footerProjectsLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerProjectsLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_PROJECT_LINKS;
  }, [settings.footerProjectsLinksJson]);

  return (
    <footer className="bg-[#151f32] text-slate-200 border-t-2 border-[#3e4095] pt-14 sm:pt-16 pb-12 relative overflow-hidden">
      {/* Subtle ambient light gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3e4095]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3e4095]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 pb-12 border-b border-slate-700/70">
          {/* Brand info (3 cols if map shown, 4 cols if not) */}
          <div className={`${showMap ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
            <Link href="/" className="inline-block group">
              <div className="relative h-16 sm:h-[72px] w-32 sm:w-36 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logoUrl}
                  alt={companyName}
                  fill
                  className="object-contain object-left drop-shadow"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              <strong className="text-white block font-bold mb-1 text-[15px]">{companyName}</strong>
              {description}
            </p>
            <div className="pt-1 text-sm text-slate-300 space-y-1.5">
              <div>
                Mã số doanh nghiệp: <span className="text-white font-bold">{taxCode}</span>
              </div>
              <div className="text-slate-400 text-xs sm:text-sm">{taxAuthority}</div>
            </div>
          </div>

          {/* Quick Links (2 cols if map shown, 3 cols if not) */}
          <div className={`${showMap ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Liên Kết Nhanh</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {quickLinks.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link href={item.href || "/"} className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-[#3e4095]" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Projects (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Đại Công Trình</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {projectLinks.map((item: any, idx: number) => (
                <li key={idx}>
                  <Link href={item.href || "/#projects"} className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (2 cols if map shown, 3 cols if not) */}
          <div className={`${showMap ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Liên Hệ Trụ Sở</span>
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#3e4095] shrink-0 mt-1" />
                <span className="leading-snug">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#3e4095] shrink-0" />
                {phone && hotline && phone !== hotline ? (
                  <span className="font-semibold text-white">
                    <a href={`tel:${phone.replace(/[^0-9]/g, "")}`} className="hover:text-blue-300 transition-colors">
                      {phone}
                    </a>{" "}
                    /{" "}
                    <a href={`tel:${hotline.replace(/[^0-9]/g, "")}`} className="hover:text-blue-300 transition-colors">
                      {hotline}
                    </a>
                  </span>
                ) : (
                  <a
                    href={`tel:${(hotline || phone || "0966.700.045").replace(/[^0-9]/g, "")}`}
                    className="font-semibold text-white hover:text-blue-300 transition-colors"
                  >
                    {hotline || phone || "0966.700.045"}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#3e4095] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Small Map at the right corner (3 cols) */}
          {showMap && (
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                  <span>{mapTitle}</span>
                </h4>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f59e0b] hover:text-amber-400 hover:underline transition-colors shrink-0"
                    title="Mở Google Maps trong tab mới"
                  >
                    <span>Xem bản đồ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Map Iframe container */}
              <div className="relative w-full h-[145px] sm:h-[155px] rounded-[3px] overflow-hidden border border-slate-700/80 bg-slate-800 shadow-md group">
                <iframe
                  title={`Bản đồ trụ sở ${companyName}`}
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>

              {mapAddress && (
                <div className="flex items-start gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#3e4095] shrink-0 mt-0.5" />
                  <span className="leading-snug line-clamp-2">{mapAddress}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div>{copyright}</div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">{isoCertification}</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-[3px] bg-slate-800 hover:bg-[#3e4095] text-slate-300 hover:text-white border border-slate-700 transition-all shadow cursor-pointer"
              aria-label="Về đầu trang"
              title="Về đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Logo Blue Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white shadow-xl shadow-[#3e4095]/35 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Về đầu trang"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
}
