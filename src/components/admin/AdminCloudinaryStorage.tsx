"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CloudRain,
  HardDrive,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Info,
  Sparkles,
} from "lucide-react";
import { CloudinaryUsageData, CompanySettings } from "@/types";

interface AdminCloudinaryStorageProps {
  settings: CompanySettings;
  onRefreshUsage?: () => void;
  onUploadImage?: (file: File) => Promise<string | null>;
  isUploadingImage?: boolean;
}

export default function AdminCloudinaryStorage({
  settings,
  onRefreshUsage,
  onUploadImage,
  isUploadingImage = false,
}: AdminCloudinaryStorageProps) {
  const [usage, setUsage] = useState<CloudinaryUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  // Cloudinary credentials form
  const [configForm, setConfigForm] = useState({
    cloudName: settings.cloudinaryCloudName || "syjvx1ly",
    apiKey: settings.cloudinaryApiKey || "",
    apiSecret: settings.cloudinaryApiSecret || "",
    quotaGb: settings.cloudinaryQuotaGb || 25,
  });

  // Upload state
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setFeedbackNotice({ type, text });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const loadUsageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cloudinary/usage", { cache: "no-store" });
      if (res.ok) {
        const data: CloudinaryUsageData = await res.json();
        setUsage(data);
      }
    } catch (err: any) {
      console.warn("Lỗi tải dung lượng Cloudinary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsageData();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/cloudinary/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("Đã lưu cấu hình Cloudinary thành công!");
        setShowConfigModal(false);
        if (data.usage) setUsage(data.usage);
        else loadUsageData();
      } else {
        showNotice(data.error || "Lỗi lưu cấu hình", "error");
      }
    } catch (err: any) {
      showNotice(err.message || "Lỗi lưu cấu hình", "error");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    if (url) {
      setUploadedUrl(url);
      showNotice("Đã tải ảnh lên CDN thành công!");
      loadUsageData();
    }
  };

  const handleDeleteUploaded = async () => {
    if (!uploadedUrl) return;
    if (!confirm("Bạn có chắc muốn xóa ảnh này khỏi Cloudinary để giải phóng dung lượng?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cloudinary/usage?url=${encodeURIComponent(uploadedUrl)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotice("Đã xóa ảnh thành công và giải phóng dung lượng!");
        setUploadedUrl("");
        loadUsageData();
      } else {
        showNotice(data.error || "Không thể xóa ảnh", "error");
      }
    } catch (err: any) {
      showNotice(err.message || "Lỗi khi xóa ảnh", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const percentUsed = usage?.storage?.percentUsed || 0;
  const isHighUsage = percentUsed >= 85;
  const isMidUsage = percentUsed >= 60 && percentUsed < 85;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {feedbackNotice && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[3px] shadow-lg text-xs font-semibold border transition-all ${
            feedbackNotice.type === "success"
              ? "bg-white border-emerald-500 text-emerald-800 shadow-emerald-500/10"
              : "bg-white border-rose-500 text-rose-800 shadow-rose-500/10"
          }`}
        >
          {feedbackNotice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackNotice.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-600" />
            <span>Quản Lý Dung Lượng Lưu Trữ Cloudinary & Media</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi dung lượng lưu trữ đã dùng, còn lại, số lượng hình ảnh và phân phối CDN
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadUsageData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[3px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Làm mới số liệu lưu trữ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#3e4095]" : ""}`} />
            <span>{loading ? "Đang cập nhật..." : "Làm mới"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Cấu hình API Key</span>
          </button>
        </div>
      </div>

      {/* Main Storage Gauge Card */}
      <div className="bg-white rounded-[3px] border border-slate-200 p-6 shadow-2xs space-y-6">
        {/* Status header & badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[3px] bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Cloudinary Cloud: <code className="text-[#3e4095] font-bold">{usage?.cloudName || "syjvx1ly"}</code>
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-[2px] bg-slate-100 text-slate-600">
                  {usage?.plan || "Free Tier"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật lần cuối: {usage?.lastUpdated || new Date().toISOString().split("T")[0]}
              </p>
            </div>
          </div>

          <div>
            {usage?.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kết nối API Cloudinary trực tiếp</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-blue-50 text-[#3e4095] text-xs font-semibold border border-blue-200">
                <Info className="w-3.5 h-3.5 text-[#3e4095]" />
                <span>Số liệu tổng hợp từ cơ sở dữ liệu website</span>
              </span>
            )}
          </div>
        </div>

        {/* Visual Storage Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Tiến độ dung lượng lưu trữ:</span>
              <strong className="text-slate-900 font-bold">{usage?.storage?.usedFormatted || "0 MB"}</strong>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">{usage?.storage?.limitFormatted || "25 GB"}</span>
            </span>

            <span
              className={`font-extrabold ${
                isHighUsage ? "text-rose-600" : isMidUsage ? "text-amber-600" : "text-[#3e4095]"
              }`}
            >
              {percentUsed}% đã dùng
            </span>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighUsage
                  ? "bg-gradient-to-r from-amber-500 to-rose-600"
                  : isMidUsage
                  ? "bg-gradient-to-r from-cyan-500 to-amber-500"
                  : "bg-gradient-to-r from-blue-500 to-[#3e4095]"
              }`}
              style={{ width: `${Math.max(1, Math.min(100, percentUsed))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span>0 GB</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span>Còn lại trống:</span>
              <strong className="font-bold">{usage?.storage?.remainingFormatted || "25 GB"}</strong>
            </span>
            <span>{usage?.storage?.limitFormatted || "25 GB"}</span>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Card 1: Used Storage */}
          <div className="p-3.5 rounded-[3px] bg-slate-50 border border-slate-200/90">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dung lượng đã dùng
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {usage?.storage?.usedFormatted || "0 MB"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Tương đương {percentUsed}% tổng gói
            </div>
          </div>

          {/* Card 2: Remaining Storage */}
          <div className="p-3.5 rounded-[3px] bg-emerald-50/50 border border-emerald-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Dung lượng còn lại
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              {usage?.storage?.remainingFormatted || "25 GB"}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">
              Còn trống {Math.max(0, +(100 - percentUsed).toFixed(1))}% dung lượng
            </div>
          </div>

          {/* Card 3: Total Assets */}
          <div className="p-3.5 rounded-[3px] bg-blue-50/50 border border-blue-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3e4095]">
              Tổng số lượng tệp
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#3e4095] mt-1">
              {usage?.objects?.count || 0}{" "}
              <span className="text-xs font-semibold text-slate-500">tệp</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Hình ảnh & tài nguyên CDN
            </div>
          </div>

          {/* Card 4: Bandwidth / Plan */}
          <div className="p-3.5 rounded-[3px] bg-slate-50 border border-slate-200/90">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Băng thông truyền tải
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {usage?.bandwidth?.usedFormatted || "0 MB"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Phục vụ qua mạng CDN toàn cầu
            </div>
          </div>
        </div>

        {/* Tip / Notice box */}
        {!usage?.connected && (
          <div className="p-3.5 rounded-[3px] bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Mẹo quản trị:</strong> Bạn đang xem dung lượng được tính toán theo các tài nguyên ảnh thực tế trên website. Để đồng bộ số liệu thời gian thực 100% từ bảng điều khiển Cloudinary của bạn, bấm nút{" "}
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="font-bold underline text-[#3e4095] hover:text-blue-800"
              >
                Cấu hình API Key
              </button>{" "}
              để nhập mã API Key và API Secret từ Cloudinary Console.
            </div>
          </div>
        )}
      </div>

      {/* Uploader Box */}
      <div className="bg-white rounded-[3px] border border-slate-200 p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#3e4095]" />
            <span>Tải Hình Ảnh Mới Lên Cloudinary CDN</span>
          </h3>
          <p className="text-xs text-slate-500">
            Tải ảnh lên để tự động nén định dạng WebP, lưu vào bộ nhớ CDN và tạo liên kết trực tiếp
          </p>
        </div>

        <div className="p-6 rounded-[3px] border-2 border-dashed border-slate-300 hover:border-[#3e4095] text-center space-y-3 transition-colors bg-slate-50/50">
          <div className="w-12 h-12 rounded-[3px] bg-blue-50 text-[#3e4095] border border-blue-100 flex items-center justify-center mx-auto">
            {isUploadingImage ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Chọn hoặc kéo thả tệp ảnh từ máy tính</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ JPG, PNG, WEBP, GIF. Tự động nén tối ưu trước khi tải lên.
            </p>
          </div>
          <div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white font-semibold text-xs cursor-pointer shadow-2xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploadingImage ? "Đang xử lý tải lên..." : "Chọn tệp ảnh từ máy tính"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploadingImage} />
            </label>
          </div>
        </div>

        {/* Upload Result Preview */}
        {uploadedUrl && (
          <div className="p-4 rounded-[3px] bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã tạo liên kết CDN thành công:</span>
              </div>
              <button
                type="button"
                onClick={handleDeleteUploaded}
                disabled={isDeleting}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Đang xóa..." : "Xóa ảnh này khỏi CDN"}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="flex-1 px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(uploadedUrl);
                  setCopiedLink(true);
                  showNotice("Đã sao chép liên kết vào bộ nhớ tạm!");
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3 py-1.5 rounded-[3px] bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Đã copy" : "Copy link"}</span>
              </button>
            </div>

            <div className="relative h-44 w-full sm:w-80 rounded-[2px] overflow-hidden border border-slate-200 bg-white">
              <Image src={uploadedUrl} alt="Preview" fill className="object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Cloudinary API Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop-in">
          <div className="bg-white rounded-[3px] border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-modal-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#3e4095]" />
                <span>Cấu hình Cloudinary API</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cloud Name (Tên Cloudinary)
                </label>
                <input
                  type="text"
                  required
                  value={configForm.cloudName}
                  onChange={(e) => setConfigForm({ ...configForm, cloudName: e.target.value })}
                  placeholder="syjvx1ly"
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                  placeholder="Nhập Cloudinary API Key (VD: 123456789012345)"
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={configForm.apiSecret}
                  onChange={(e) => setConfigForm({ ...configForm, apiSecret: e.target.value })}
                  placeholder="Nhập Cloudinary API Secret"
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tổng dung lượng gói (GB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={configForm.quotaGb}
                  onChange={(e) => setConfigForm({ ...configForm, quotaGb: Number(e.target.value) || 25 })}
                  placeholder="25"
                  className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#3e4095] focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Mặc định gói Miễn Phí của Cloudinary là 25 GB (25 Credits).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-4 py-2 rounded-[3px] bg-[#3e4095] hover:bg-[#2d2f70] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSavingConfig ? "Đang lưu..." : "Lưu & Kiểm tra kết nối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
