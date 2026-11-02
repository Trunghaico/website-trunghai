"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PanelTop,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Link2,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CompanySettings } from "@/types";

interface NavSubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavSubItem[];
}

interface AdminHeaderEditorProps {
  settings: CompanySettings;
  onSave: (updated: Partial<CompanySettings>) => Promise<void>;
  isSaving: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
  isUploadingImage?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Trang chủ", href: "/" },
  {
    name: "Giới thiệu",
    href: "/gioi-thieu",
    children: [
      { name: "Tổng quan doanh nghiệp", href: "/gioi-thieu" },
      { name: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" },
    ],
  },
  { name: "Công trình", href: "/cong-trinh" },
  { name: "Tin tức", href: "/tin-tuc" },
  { name: "Tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ", href: "/lien-he" },
];

export default function AdminHeaderEditor({
  settings,
  onSave,
  isSaving,
  onUploadImage,
  isUploadingImage = false,
}: AdminHeaderEditorProps) {
  const [form, setForm] = useState({
    headerLogoUrl: settings.headerLogoUrl || "/logo.png",
    headerAddress: settings.headerAddress || settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
    headerWorkingHours: settings.headerWorkingHours || settings.workingHours || "Thứ 2 – Thứ 6: 08:00 – 17:30",
    headerPhoneDisplay: settings.headerPhoneDisplay || (settings.phone && settings.hotline ? `${settings.phone} / ${settings.hotline}` : (settings.phone || settings.hotline || "0966.700.045")),
    headerHotline: settings.headerHotline || settings.hotline || settings.phone || "0966.700.045",
    headerEmail: settings.headerEmail || settings.email || "info@trunghaico.vn",
    headerCtaText: settings.headerCtaText || "Hotline 24/7",
  });

  const [navItems, setNavItems] = useState<NavItem[]>(() => {
    if (settings.headerNavItemsJson) {
      try {
        const parsed = JSON.parse(settings.headerNavItemsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_NAV_ITEMS;
  });

  const [activeSubmenuIndex, setActiveSubmenuIndex] = useState<number | null>(null);

  // Sync if settings update
  useEffect(() => {
    setForm({
      headerLogoUrl: settings.headerLogoUrl || "/logo.png",
      headerAddress: settings.headerAddress || settings.address || "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
      headerWorkingHours: settings.headerWorkingHours || settings.workingHours || "Thứ 2 – Thứ 6: 08:00 – 17:30",
      headerPhoneDisplay: settings.headerPhoneDisplay || (settings.phone && settings.hotline ? `${settings.phone} / ${settings.hotline}` : (settings.phone || settings.hotline || "0966.700.045")),
      headerHotline: settings.headerHotline || settings.hotline || settings.phone || "0966.700.045",
      headerEmail: settings.headerEmail || settings.email || "info@trunghaico.vn",
      headerCtaText: settings.headerCtaText || "Hotline 24/7",
    });

    if (settings.headerNavItemsJson) {
      try {
        const parsed = JSON.parse(settings.headerNavItemsJson);
        if (Array.isArray(parsed) && parsed.length > 0) setNavItems(parsed);
      } catch {
        // ignore
      }
    }
  }, [settings]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    if (url) {
      setForm((prev) => ({ ...prev, headerLogoUrl: url }));
    }
  };

  const handleAddNavItem = () => {
    setNavItems((prev) => [...prev, { name: "Menu Mới", href: "/" }]);
  };

  const handleUpdateNavItem = (index: number, field: "name" | "href", value: string) => {
    setNavItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDeleteNavItem = (index: number) => {
    setNavItems((prev) => prev.filter((_, i) => i !== index));
    if (activeSubmenuIndex === index) setActiveSubmenuIndex(null);
  };

  const handleAddSubItem = (parentIndex: number) => {
    setNavItems((prev) => {
      const next = [...prev];
      const children = next[parentIndex].children ? [...next[parentIndex].children!] : [];
      children.push({ name: "Mục con mới", href: "/" });
      next[parentIndex] = { ...next[parentIndex], children };
      return next;
    });
  };

  const handleUpdateSubItem = (parentIndex: number, subIndex: number, field: "name" | "href", value: string) => {
    setNavItems((prev) => {
      const next = [...prev];
      const children = [...(next[parentIndex].children || [])];
      children[subIndex] = { ...children[subIndex], [field]: value };
      next[parentIndex] = { ...next[parentIndex], children };
      return next;
    });
  };

  const handleDeleteSubItem = (parentIndex: number, subIndex: number) => {
    setNavItems((prev) => {
      const next = [...prev];
      const children = (next[parentIndex].children || []).filter((_, i) => i !== subIndex);
      next[parentIndex] = {
        ...next[parentIndex],
        children: children.length > 0 ? children : undefined,
      };
      return next;
    });
  };

  const handleResetNav = () => {
    if (confirm("Khôi phục danh sách Menu điều hướng về mặc định ban đầu?")) {
      setNavItems(DEFAULT_NAV_ITEMS);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      headerNavItemsJson: JSON.stringify(navItems),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <PanelTop className="w-5 h-5 text-[#3e4095]" />
            <span>Quản Lý & Chỉnh Sửa Header (Đầu Trang)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật logo, thanh thông tin liên hệ trên cùng (topbar), nút hotline CTA và các liên kết menu điều hướng
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Header"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Topbar settings */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>Thanh Thông Tin Trên Cùng (Topbar)</span>
              </h3>
              <p className="text-xs text-slate-500">Hiển thị địa chỉ, giờ hành chính, số điện thoại và email ở đầu website</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-[2px]">
              Hiển thị trên Trang Chủ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Địa chỉ trụ sở hiển thị</span>
              </label>
              <input
                type="text"
                value={form.headerAddress}
                onChange={(e) => setForm({ ...form, headerAddress: e.target.value })}
                placeholder="12-14 Đường D5, P. An Khánh, TP. Hồ Chí Minh"
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Giờ làm việc</span>
              </label>
              <input
                type="text"
                value={form.headerWorkingHours}
                onChange={(e) => setForm({ ...form, headerWorkingHours: e.target.value })}
                placeholder="Thứ 2 – Thứ 6: 08:00 – 17:30"
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Số điện thoại hiển thị Topbar</span>
              </label>
              <input
                type="text"
                value={form.headerPhoneDisplay}
                onChange={(e) => setForm({ ...form, headerPhoneDisplay: e.target.value })}
                placeholder="0966.700.045 hoặc 0966.700.045 / 0912.345.678"
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Dùng dấu gạch chéo &quot;/&quot; nếu muốn chia 2 số</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Email liên hệ hiển thị Topbar</span>
              </label>
              <input
                type="email"
                value={form.headerEmail}
                onChange={(e) => setForm({ ...form, headerEmail: e.target.value })}
                placeholder="info@trunghaico.vn"
                className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Logo and CTA Button */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
              <span>Logo & Nút Bấm Hotline (Kêu Gọi Hành Động)</span>
            </h3>
            <p className="text-xs text-slate-500">Tùy biến hình ảnh thương hiệu và nút gọi khẩn cấp ở góc phải menu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Logo Settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Logo thương hiệu Header</label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 rounded-[3px] border border-slate-200 bg-slate-50 p-1 flex items-center justify-center relative overflow-hidden shrink-0">
                  {form.headerLogoUrl ? (
                    <Image
                      src={form.headerLogoUrl}
                      alt="Header Logo Preview"
                      width={70}
                      height={50}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400">Chưa có logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={form.headerLogoUrl}
                    onChange={(e) => setForm({ ...form, headerLogoUrl: e.target.value })}
                    placeholder="/logo.png hoặc URL ảnh online"
                    className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors">
                      {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Tải ảnh lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, headerLogoUrl: "/logo.png" })}
                      className="text-[11px] text-[#3e4095] hover:underline"
                    >
                      Dùng logo gốc
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button Settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Cấu hình nút gọi điện (CTA)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Số điện thoại gọi khi click</label>
                  <input
                    type="text"
                    value={form.headerHotline}
                    onChange={(e) => setForm({ ...form, headerHotline: e.target.value })}
                    placeholder="0966.700.045"
                    className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Nhãn nút phụ (tuỳ chọn)</label>
                  <input
                    type="text"
                    value={form.headerCtaText}
                    onChange={(e) => setForm({ ...form, headerCtaText: e.target.value })}
                    placeholder="Hotline 24/7"
                    className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Navigation Menu Items */}
        <div className="bg-white rounded-[3px] border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                <span>Danh Sách Menu Điều Hướng Chính</span>
              </h3>
              <p className="text-xs text-slate-500">Chỉnh sửa tên hiển thị, đường dẫn href và danh mục con (dropdown)</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetNav}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                title="Khôi phục menu gốc ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
              <button
                type="button"
                onClick={handleAddNavItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-blue-50 hover:bg-blue-100 text-[#3e4095] border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mục menu</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[3px] border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-[2px] bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateNavItem(idx, "name", e.target.value)}
                      placeholder="Tên hiển thị (VD: Trang chủ)"
                      className="px-2.5 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 font-semibold focus:border-[#3e4095] focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => handleUpdateNavItem(idx, "href", e.target.value)}
                        placeholder="Đường dẫn href (VD: /gioi-thieu)"
                        className="w-full px-2.5 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#3e4095] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddSubItem(idx)}
                      title="Thêm menu con dropdown"
                      className="p-1.5 rounded-[3px] bg-blue-50 text-[#3e4095] hover:bg-[#3e4095] hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNavItem(idx)}
                      title="Xóa mục menu này"
                      className="p-1.5 rounded-[3px] bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Submenu Children */}
                {item.children && item.children.length > 0 && (
                  <div className="ml-8 pl-3 border-l-2 border-blue-200 space-y-2 pt-1">
                    <div className="text-[11px] font-bold uppercase text-[#3e4095] flex items-center gap-1.5">
                      <span>Menu con dropdown ({item.children.length}):</span>
                    </div>

                    {item.children.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono w-4 shrink-0">
                          {sIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubItem(idx, sIdx, "name", e.target.value)}
                          placeholder="Tên menu con"
                          className="px-2 py-1 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#3e4095] focus:outline-none flex-1"
                        />
                        <input
                          type="text"
                          value={sub.href}
                          onChange={(e) => handleUpdateSubItem(idx, sIdx, "href", e.target.value)}
                          placeholder="/duong-dan"
                          className="px-2 py-1 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#3e4095] focus:outline-none flex-1 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteSubItem(idx, sIdx)}
                          title="Xóa mục con này"
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Header Live Preview */}
        <div className="bg-slate-900 rounded-[3px] p-5 shadow-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Xem Trước Trực Quan Giao Diện Header</span>
            </h3>
            <span className="text-[10px] text-slate-400">Mô phỏng giao diện máy tính</span>
          </div>

          <div className="rounded-[3px] overflow-hidden border border-slate-700/80 bg-white">
            {/* Simulated Topbar */}
            <div className="bg-[#18202c] text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 truncate max-w-xs">
                  <MapPin className="w-3 h-3 text-[#f59e0b]" />
                  {form.headerAddress}
                </span>
                <span className="flex items-center gap-1 hidden sm:inline-flex">
                  <Clock className="w-3 h-3 text-[#f59e0b]" />
                  {form.headerWorkingHours}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#f59e0b]" />
                  {form.headerPhoneDisplay}
                </span>
                <span className="flex items-center gap-1 hidden md:inline-flex">
                  <Mail className="w-3 h-3 text-[#f59e0b]" />
                  {form.headerEmail}
                </span>
              </div>
            </div>

            {/* Simulated Navbar */}
            <div className="px-4 py-2 flex items-center justify-between border-b-2 border-[#3e4095]">
              <div className="relative h-10 w-24">
                {form.headerLogoUrl ? (
                  <Image
                    src={form.headerLogoUrl}
                    alt="Logo preview"
                    fill
                    className="object-contain object-left"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-800">TRUNG HẢI</span>
                )}
              </div>

              <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                {navItems.slice(0, 6).map((item, i) => (
                  <span key={i} className="hover:text-[#3e4095] cursor-pointer flex items-center gap-1">
                    {item.name}
                    {item.children && <ChevronDown className="w-3 h-3" />}
                  </span>
                ))}
              </div>

              <div className="px-3 py-1 rounded-full bg-[#3e4095] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Phone className="w-3 h-3" />
                <span>{form.headerHotline}</span>
              </div>
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
            <span>{isSaving ? "Đang lưu cấu hình..." : "Lưu Toàn Bộ Cấu Hình Header"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
