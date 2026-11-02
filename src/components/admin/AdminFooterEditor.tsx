"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PanelBottom,
  Save,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Link2,
  Building2,
  ShieldCheck,
  Loader2,
  Compass,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { CompanySettings } from "@/types";

interface FooterLinkItem {
  name: string;
  href: string;
}

interface AdminFooterEditorProps {
  settings: CompanySettings;
  onSave: (updated: Partial<CompanySettings>) => Promise<void>;
  isSaving: boolean;
}

const DEFAULT_QUICK_LINKS: FooterLinkItem[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu doanh nghiệp", href: "/gioi-thieu" },
  { name: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" },
  { name: "Công trình tiêu biểu", href: "/cong-trinh" },
  { name: "Tin tức & Sự kiện", href: "/tin-tuc" },
  { name: "Cơ hội tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ hợp tác", href: "/lien-he" },
];

const DEFAULT_PROJECT_LINKS: FooterLinkItem[] = [
  { name: "Hầm Đèo Cả & Cổ Mã", href: "/#projects" },
  { name: "Hầm đường bộ Cù Mông", href: "/#projects" },
  { name: "Hầm Phước Tượng - Phú Gia", href: "/#projects" },
  { name: "Mở rộng QL1 Khánh Hòa", href: "/#projects" },
];

export default function AdminFooterEditor({
  settings,
  onSave,
  isSaving,
}: AdminFooterEditorProps) {
  const [form, setForm] = useState({
    footerCompanyName:
      settings.footerCompanyName || settings.name || "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
    footerDescription:
      settings.footerDescription ||
      "Đơn vị tiên phong thi công các công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các tuyến quốc lộ trọng điểm quốc gia.",
    taxCode: settings.taxCode || "0312019045",
    footerTaxAuthority: settings.footerTaxAuthority || "Cấp bởi: Thuế cơ sở 1 Thành phố Hồ Chí Minh",
    footerAddress:
      settings.footerAddress || settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
    footerPhone: settings.footerPhone || settings.phone || "0966.700.045",
    footerHotline: settings.footerHotline || settings.hotline || "0966.700.045",
    footerEmail: settings.footerEmail || settings.email || "info@trunghaico.vn",
    footerCopyright:
      settings.footerCopyright ||
      `© ${new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights reserved.`,
    footerIsoCertification: settings.footerIsoCertification || "Tiêu chuẩn ISO 9001:2015 & OHSAS 18001",

    // Small Map in the right corner
    footerShowMap: settings.footerShowMap !== false && settings.footerShowMap !== "false",
    footerMapTitle: settings.footerMapTitle || "Vị Trí Trụ Sở",
    footerMapEmbedUrl:
      settings.footerMapEmbedUrl ||
      settings.googleMapsEmbedUrl ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7093.4802225019375!2d106.7340018!3d10.7902063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175250025dd33df%3A0x79d9f143bf06960a!2zQ8O0bmcgdHkgQ1AgWMOieSBk4buxbmcgQ-G6p3UgxJHGsOG7nW5nIFRow6BuaCBQaMOhdA!5e1!3m2!1svi!2s!4v1791253228303!5m2!1svi!2s",
    footerMapUrl:
      settings.footerMapUrl || settings.googleMapsUrl || "https://www.google.com/maps?cid=0x79d9f143bf06960a",
    footerMapAddress:
      settings.footerMapAddress ||
      settings.footerAddress ||
      settings.address ||
      "12-14 Đường D5, P. An Khánh, TP. Thủ Đức, TP. HCM",
  });

  const [quickLinks, setQuickLinks] = useState<FooterLinkItem[]>(() => {
    if (settings.footerQuickLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerQuickLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_QUICK_LINKS;
  });

  const [projectLinks, setProjectLinks] = useState<FooterLinkItem[]>(() => {
    if (settings.footerProjectsLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerProjectsLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROJECT_LINKS;
  });

  // Sync state if settings update
  useEffect(() => {
    setForm({
      footerCompanyName:
        settings.footerCompanyName || settings.name || "CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI",
      footerDescription:
        settings.footerDescription ||
        "Đơn vị tiên phong thi công các công trình hầm xuyên núi, hạ tầng giao thông đường bộ, cầu cạn và các tuyến quốc lộ trọng điểm quốc gia.",
      taxCode: settings.taxCode || "0312019045",
      footerTaxAuthority: settings.footerTaxAuthority || "Cấp bởi: Thuế cơ sở 1 Thành phố Hồ Chí Minh",
      footerAddress:
        settings.footerAddress || settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
      footerPhone: settings.footerPhone || settings.phone || "0966.700.045",
      footerHotline: settings.footerHotline || settings.hotline || "0966.700.045",
      footerEmail: settings.footerEmail || settings.email || "info@trunghaico.vn",
      footerCopyright:
        settings.footerCopyright ||
        `© ${new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights reserved.`,
      footerIsoCertification: settings.footerIsoCertification || "Tiêu chuẩn ISO 9001:2015 & OHSAS 18001",

      footerShowMap: settings.footerShowMap !== false && settings.footerShowMap !== "false",
      footerMapTitle: settings.footerMapTitle || "Vị Trí Trụ Sở",
      footerMapEmbedUrl:
        settings.footerMapEmbedUrl ||
        settings.googleMapsEmbedUrl ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7093.4802225019375!2d106.7340018!3d10.7902063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175250025dd33df%3A0x79d9f143bf06960a!2zQ8O0bmcgdHkgQ1AgWMOieSBk4buxbmcgQ-G6p3UgxJHGsOG7nW5nIFRow6BuaCBQaMOhdA!5e1!3m2!1svi!2s!4v1791253228303!5m2!1svi!2s",
      footerMapUrl:
        settings.footerMapUrl || settings.googleMapsUrl || "https://www.google.com/maps?cid=0x79d9f143bf06960a",
      footerMapAddress:
        settings.footerMapAddress ||
        settings.footerAddress ||
        settings.address ||
        "12-14 Đường D5, P. An Khánh, TP. Thủ Đức, TP. HCM",
    });

    if (settings.footerQuickLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerQuickLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) setQuickLinks(parsed);
      } catch {
        // ignore
      }
    }

    if (settings.footerProjectsLinksJson) {
      try {
        const parsed = JSON.parse(settings.footerProjectsLinksJson);
        if (Array.isArray(parsed) && parsed.length > 0) setProjectLinks(parsed);
      } catch {
        // ignore
      }
    }
  }, [settings]);

  // Helper to extract iframe src if user pastes full <iframe> code
  const handleMapEmbedUrlChange = (val: string) => {
    let cleanUrl = val.trim();
    if (cleanUrl.includes("<iframe") && cleanUrl.includes("src=\"")) {
      const match = cleanUrl.match(/src="([^"]+)"/);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }
    setForm((prev) => ({ ...prev, footerMapEmbedUrl: cleanUrl }));
  };

  // Sync map directly from contact page settings
  const handleSyncFromContact = () => {
    setForm((prev) => ({
      ...prev,
      footerMapEmbedUrl:
        settings.googleMapsEmbedUrl ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7093.4802225019375!2d106.7340018!3d10.7902063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175250025dd33df%3A0x79d9f143bf06960a!2zQ8O0bmcgdHkgQ1AgWMOieSBk4buxbmcgQ-G6p3UgxJHGsOG7nW5nIFRow6BuaCBQaMOhdA!5e1!3m2!1svi!2s!4v1791253228303!5m2!1svi!2s",
      footerMapUrl: settings.googleMapsUrl || "https://www.google.com/maps?cid=0x79d9f143bf06960a",
      footerMapAddress: settings.address || "12-14 Đường D5, P. An Khánh, TP. Thủ Đức, TP. HCM",
    }));
  };

  // Quick Links handlers
  const handleAddQuickLink = () => {
    setQuickLinks((prev) => [...prev, { name: "Liên kết mới", href: "/" }]);
  };
  const handleUpdateQuickLink = (index: number, field: "name" | "href", val: string) => {
    setQuickLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };
  const handleDeleteQuickLink = (index: number) => {
    setQuickLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Project Links handlers
  const handleAddProjectLink = () => {
    setProjectLinks((prev) => [...prev, { name: "Công trình mới", href: "/#projects" }]);
  };
  const handleUpdateProjectLink = (index: number, field: "name" | "href", val: string) => {
    setProjectLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };
  const handleDeleteProjectLink = (index: number) => {
    setProjectLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      footerQuickLinksJson: JSON.stringify(quickLinks),
      footerProjectsLinksJson: JSON.stringify(projectLinks),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <PanelBottom className="w-5 h-5 text-[#3e4095]" />
            <span>Quản Lý & Chỉnh Sửa Footer (Chân Trang)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật nội dung giới thiệu, thông tin pháp lý, liên kết và bản đồ nhỏ ở góc phải chân trang
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Footer"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card: SMALL MAP IN RIGHT CORNER (FEATURE HIGHLIGHT) */}
        <div className="bg-white rounded-[3px] border-2 border-[#3e4095]/40 p-5 shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#3e4095]/5 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-amber-50 text-amber-800 text-[11px] font-bold uppercase mb-1 border border-amber-200">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Mục Trọng Tâm</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Bản Đồ Nhỏ Góc Phải Chân Trang (Giống Bên Liên Hệ)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Hiển thị bản đồ Google Maps thu nhỏ ở cột ngoài cùng bên phải của Footer, giúp khách hàng xác định nhanh vị trí trụ sở
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.footerShowMap}
                  onChange={(e) => setForm({ ...form, footerShowMap: e.target.checked })}
                  className="w-4 h-4 rounded text-[#3e4095] focus:ring-[#3e4095] border-slate-300 cursor-pointer"
                />
                <span>Bật bản đồ góc phải</span>
              </label>

              <button
                type="button"
                onClick={handleSyncFromContact}
                title="Lấy nhanh toạ độ và link bản đồ đang dùng bên trang Liên hệ"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-blue-50 hover:bg-blue-100 text-[#3e4095] border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Đồng bộ từ trang Liên hệ</span>
              </button>
            </div>
          </div>

          {form.footerShowMap ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề khối bản đồ chân trang
                  </label>
                  <input
                    type="text"
                    value={form.footerMapTitle}
                    onChange={(e) => setForm({ ...form, footerMapTitle: e.target.value })}
                    placeholder="Vị Trí Trụ Sở"
                    className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đường dẫn nhúng Google Maps iframe (Embed URL)
                  </label>
                  <textarea
                    rows={3}
                    value={form.footerMapEmbedUrl}
                    onChange={(e) => handleMapEmbedUrlChange(e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=... (hoặc dán nguyên thẻ iframe)"
                    className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Gợi ý: Mở Google Maps &rarr; Chia sẻ &rarr; Nhúng bản đồ &rarr; Sao chép liên kết hoặc dán toàn bộ thẻ iframe vào đây.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link mở Google Maps ngoài (URL)
                    </label>
                    <input
                      type="text"
                      value={form.footerMapUrl}
                      onChange={(e) => setForm({ ...form, footerMapUrl: e.target.value })}
                      placeholder="https://www.google.com/maps?cid=..."
                      className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Địa chỉ hiển thị dưới bản đồ
                    </label>
                    <input
                      type="text"
                      value={form.footerMapAddress}
                      onChange={(e) => setForm({ ...form, footerMapAddress: e.target.value })}
                      placeholder="12-14 Đường D5, P. An Khánh, TP. Thủ Đức"
                      className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Mini Map Preview */}
              <div className="lg:col-span-5 bg-[#151f32] p-4 rounded-[3px] border border-slate-700 text-white flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {form.footerMapTitle || "Vị Trí Trụ Sở"}
                    </span>
                  </div>
                  {form.footerMapUrl && (
                    <a
                      href={form.footerMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#f59e0b] hover:underline flex items-center gap-1"
                    >
                      <span>Mở Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="relative w-full h-[155px] rounded-[3px] overflow-hidden border border-slate-700 bg-slate-800">
                  {form.footerMapEmbedUrl ? (
                    <iframe
                      title="Bản đồ xem trước"
                      src={form.footerMapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      Chưa có mã nhúng bản đồ
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-300 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3e4095] shrink-0 mt-0.5" />
                  <span className="leading-tight line-clamp-2">
                    {form.footerMapAddress || "Chưa nhập địa chỉ"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[3px] bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
              Bản đồ góc phải hiện đang tắt. Bật công tắc &quot;Bật bản đồ góc phải&quot; phía trên để hiển thị bản đồ trực tuyến ở Footer.
            </div>
          )}
        </div>

        {/* Card 1: Brand and Legal info */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Thông Tin Doanh Nghiệp & Pháp Lý (Cột 1)</span>
            </h3>
            <p className="text-xs text-slate-500">Hiển thị tên công ty, phần tóm tắt năng lực và mã số doanh nghiệp</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đầy đủ doanh nghiệp ở chân trang
              </label>
              <input
                type="text"
                value={form.footerCompanyName}
                onChange={(e) => setForm({ ...form, footerCompanyName: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đoạn mô tả giới thiệu năng lực doanh nghiệp
              </label>
              <textarea
                rows={2}
                value={form.footerDescription}
                onChange={(e) => setForm({ ...form, footerDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã số doanh nghiệp (MST)
                </label>
                <input
                  type="text"
                  value={form.taxCode}
                  onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cơ quan cấp mã số thuế
                </label>
                <input
                  type="text"
                  value={form.footerTaxAuthority}
                  onChange={(e) => setForm({ ...form, footerTaxAuthority: e.target.value })}
                  placeholder="Cấp bởi: Thuế cơ sở 1 Thành phố Hồ Chí Minh"
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact info */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Liên Hệ Trụ Sở (Cột 4)</span>
            </h3>
            <p className="text-xs text-slate-500">Cập nhật địa chỉ, số hotline/điện thoại và email liên hệ ở Footer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Địa chỉ trụ sở chính</span>
              </label>
              <input
                type="text"
                value={form.footerAddress}
                onChange={(e) => setForm({ ...form, footerAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Hotline</span>
              </label>
              <input
                type="text"
                value={form.footerHotline}
                onChange={(e) => setForm({ ...form, footerHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Điện thoại cố định</span>
              </label>
              <input
                type="text"
                value={form.footerPhone}
                onChange={(e) => setForm({ ...form, footerPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Email liên hệ</span>
              </label>
              <input
                type="email"
                value={form.footerEmail}
                onChange={(e) => setForm({ ...form, footerEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Link Columns (Quick Links & Key Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quick links */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                <span>Liên Kết Nhanh (Cột 2)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddQuickLink}
                className="p-1 rounded bg-blue-50 text-[#3e4095] hover:bg-blue-100 transition-colors"
                title="Thêm liên kết"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {quickLinks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateQuickLink(idx, "name", e.target.value)}
                    placeholder="Tên link"
                    className="w-1/2 px-2 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#3e4095] focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleUpdateQuickLink(idx, "href", e.target.value)}
                    placeholder="/duong-dan"
                    className="w-1/2 px-2 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#3e4095] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteQuickLink(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key projects links */}
          <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                <span>Đại Công Trình (Cột 3)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddProjectLink}
                className="p-1 rounded bg-blue-50 text-[#3e4095] hover:bg-blue-100 transition-colors"
                title="Thêm công trình"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {projectLinks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateProjectLink(idx, "name", e.target.value)}
                    placeholder="Tên công trình"
                    className="w-1/2 px-2 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#3e4095] focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleUpdateProjectLink(idx, "href", e.target.value)}
                    placeholder="/#projects"
                    className="w-1/2 px-2 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#3e4095] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteProjectLink(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Copyright and ISO Certification */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Dòng Bản Quyền & Tiêu Chuẩn (Bottom Bar)</span>
            </h3>
            <p className="text-xs text-slate-500">Dòng chữ hiển thị dưới cùng của website</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dòng chữ bản quyền (Copyright)
              </label>
              <input
                type="text"
                value={form.footerCopyright}
                onChange={(e) => setForm({ ...form, footerCopyright: e.target.value })}
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tiêu chuẩn chất lượng</span>
              </label>
              <input
                type="text"
                value={form.footerIsoCertification}
                onChange={(e) => setForm({ ...form, footerIsoCertification: e.target.value })}
                placeholder="Tiêu chuẩn ISO 9001:2015 & OHSAS 18001"
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Đang lưu cấu hình..." : "Lưu Toàn Bộ Cấu Hình Footer"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
