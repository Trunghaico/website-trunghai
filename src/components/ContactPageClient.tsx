"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Home,
  ChevronRight,
  Navigation,
  FileText,
  Briefcase,
  Wrench,
  Users,
} from "lucide-react";
import { CompanySettings } from "@/types";

interface ContactPageClientProps {
  settings: CompanySettings;
}

export default function ContactPageClient({ settings }: ContactPageClientProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2500);
  };

  const address =
    settings.address ||
    "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh";
  const hotline = settings.hotline || settings.phone || "0966.700.045";
  const email = settings.email || "info@trunghaico.vn";
  const taxCode = settings.taxCode || "0312019045";
  const companyName =
    settings.name || "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI";

  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7093.4802225019375!2d106.7340018!3d10.7902063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175250025dd33df%3A0x79d9f143bf06960a!2zQ8O0bmcgdHkgQ1AgWMOieSBk4buxbmcgQ-G6p3UgxJHGsOG7nW5nIFRow6BuaCBQaMOhdA!5e1!3m2!1svi!2s!4v1791253228303!5m2!1svi!2s";
  const googleMapsUrl =
    "https://www.google.com/maps?cid=0x79d9f143bf06960a";

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-28 sm:pt-32 pb-20 selection:bg-[#ed3237] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
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
            <li className="text-[#ed3237] font-semibold">Liên hệ</li>
          </ol>
        </nav>

        {/* Company Overview Highlight Card */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[3px] bg-slate-50 border border-slate-200 p-2 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt={companyName}
                  width={72}
                  height={72}
                  className="object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-[3px] bg-red-50 text-[#ed3237]">
                  {settings.shortName || "TRUNG HAI JSC"}
                </span>
                <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                  {companyName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {settings.slogan ||
                    "Tiên phong kiến tạo những công trình giao thông huyết mạch"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(taxCode, "taxCode")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                title="Sao chép mã số thuế"
              >
                {copiedItem === "taxCode" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã chép MST</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>MST: {taxCode}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">
                Năm Thành Lập
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                2012
              </div>
            </div>
            <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">
                Kinh Nghiệm
              </div>
              <div className="text-base sm:text-lg font-black text-[#ed3237] mt-1">
                15+ Năm
              </div>
            </div>
            <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">
                Công Trình Bàn Giao
              </div>
              <div className="text-base sm:text-lg font-black text-[#3e4095] mt-1">
                380+
              </div>
            </div>
            <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">
                Hệ Thống Tiêu Chuẩn
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                ISO 9001:2015
              </div>
            </div>
          </div>
        </div>

        {/* 4 Detailed Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Trụ sở chính */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-red-50 text-[#ed3237] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                Trụ Sở Chính
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mb-4">
                {address}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(address, "address")}
                className="flex-1 py-1.5 px-2.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedItem === "address" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-[3px] bg-red-50 hover:bg-red-100 text-[#ed3237] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Mở chỉ đường trên Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ đường</span>
              </a>
            </div>
          </div>

          {/* Card 2: Hotline & Điện thoại */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-red-50 text-[#ed3237] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                Điện Thoại / Hotline
              </h3>
              <div className="text-base font-black text-slate-900 mb-1">
                {hotline}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                Hỗ trợ tư vấn thi công hạ tầng, báo giá và giải đáp thông tin đối
                tác.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${hotline.replace(/[^0-9]/g, "")}`}
                className="flex-1 py-1.5 px-2.5 rounded-[3px] bg-gradient-to-r from-[#ed3237] to-[#3e4095] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi ngay</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(hotline, "phone")}
                className="py-1.5 px-2.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors"
                title="Sao chép số điện thoại"
              >
                {copiedItem === "phone" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Thư điện tử (Email) */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-red-50 text-[#ed3237] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                Hộp Thư Điện Tử
              </h3>
              <div className="text-xs sm:text-[13px] font-bold text-slate-900 break-all mb-1">
                {email}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                Tiếp nhận hồ sơ dự thầu, văn bản pháp lý và liên hệ hợp tác
                thương mại.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="flex-1 py-1.5 px-2.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Gửi Email</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(email, "email")}
                className="py-1.5 px-2.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-colors"
                title="Sao chép email"
              >
                {copiedItem === "email" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Card 4: Giờ làm việc */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-red-50 text-[#ed3237] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                Thời Gian Làm Việc
              </h3>
              <div className="text-xs sm:text-[13px] font-bold text-slate-800 mb-1">
                Thứ 2 – Thứ 7: 08:00 – 17:30
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                Chủ Nhật & các ngày lễ tết nghỉ theo quy định nhà nước. Ban chỉ
                huy công trường túc trực 24/7.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Văn phòng mở cửa</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Department Contacts & Enterprise Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Khối Dự Án & Đấu Thầu */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-[3px] bg-blue-50 text-[#3e4095]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase">
                  Khối Dự Án & Đấu Thầu
                </h4>
                <p className="text-[11px] text-slate-500">
                  Hạ tầng giao thông & Hầm đường bộ
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Phụ trách khảo sát, thẩm định phương án kỹ thuật thi công, lập hồ
              sơ dự thầu và thỏa thuận liên danh nhà thầu cho các gói thầu hạ
              tầng giao thông quốc gia.
            </p>
            <div className="text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ed3237]" />
                <span className="font-semibold">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ed3237]" />
                <span>Hotline: {hotline}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Quản Lý Thiết Bị & Cơ Giới */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-[3px] bg-red-50 text-[#ed3237]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase">
                  Vật Tư & Máy Móc Cơ Giới
                </h4>
                <p className="text-[11px] text-slate-500">
                  Công nghệ đào hầm & Máy xây dựng
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Điều phối thiết bị khoan hầm hiện đại, máy phun vẩy bê tông rô-bốt,
              trạm trộn công suất lớn và máy đào cơ giới hạng nặng cho các công
              trường trên toàn quốc.
            </p>
            <div className="text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#ed3237]" />
                <span>Trụ sở chính & Kho bãi cơ giới</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ed3237]" />
                <span>Liên hệ bộ phận kỹ thuật thiết bị</span>
              </div>
            </div>
          </div>

          {/* Card 3: Phòng Tuyển Dụng & Nhân Sự */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-[3px] bg-amber-50 text-[#f59e0b]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase">
                  Tuyển Dụng & Nhân Sự
                </h4>
                <p className="text-[11px] text-slate-500">
                  Gia nhập đội ngũ kỹ sư Trung Hải
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Tiếp nhận hồ sơ ứng viên kỹ sư công trình giao thông, trắc đạc, chỉ
              huy trưởng công trường và đội ngũ thợ lành nghề cho các đại dự án.
            </p>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ed3237]" />
                <span className="font-semibold">tuyendung@trunghaico.vn</span>
              </div>
              <Link
                href="/tuyen-dung"
                className="inline-flex items-center gap-1.5 text-xs text-[#ed3237] font-bold hover:underline"
              >
                <span>Xem các vị trí đang tuyển dụng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Google Maps Section - Full Width, High Quality, Clean Border */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ed3237] mb-1">
                <MapPin className="w-4 h-4" />
                <span>Bản Đồ Trực Tuyến</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase">
                Vị Trí Trụ Sở Trên Google Maps
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {address}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[3px] bg-slate-900 hover:bg-[#ed3237] text-white text-xs font-bold transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở trong Google Maps</span>
              </a>
            </div>
          </div>

          {/* Map Iframe */}
          <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-[3px] overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title={`Bản đồ định vị ${companyName}`}
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {/* Quick Direction Guide Footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#ed3237] shrink-0" />
              <span>
                Vị trí nằm tại khu đô thị An Khánh, thuận tiện di chuyển qua trục Mai Chí Thọ, Xa Lộ Hà Nội và cầu Ba Son.
              </span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ed3237] font-semibold hover:underline shrink-0"
            >
              Xem hướng dẫn lộ trình di chuyển &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
