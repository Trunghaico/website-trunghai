"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Briefcase,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudRain,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Project, NewsPost, JobPosting, CompanySettings } from "@/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "news" | "jobs" | "media" | "settings">("dashboard");

  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Project Form State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "",
    category: "ham",
    categoryName: "Hầm Xuyên Núi",
    client: "",
    location: "",
    year: "2026",
    value: "",
    scale: "",
    thumbnail: "",
    gallery: [],
    description: "",
    highlights: [],
    featured: true,
  });

  // News Form State
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<NewsPost>>({
    title: "",
    category: "du-an",
    categoryName: "Tin Dự Án",
    summary: "",
    content: "",
    author: "Ban Biên Tập",
    thumbnail: "",
    featured: true,
  });

  // Job Form State
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobForm, setJobForm] = useState<Partial<JobPosting>>({
    title: "",
    department: "Ban Quản lý Dự án & Thi công",
    location: "Miền Trung / TP.HCM",
    salary: "Thỏa thuận theo năng lực",
    deadline: "30/12/2026",
    type: "Toàn thời gian",
    description: [""],
    requirements: [""],
    benefits: [""],
    active: true,
  });

  // Media upload state
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, newsRes, jobsRes, setRes] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/news").then((r) => r.json()),
        fetch("/api/jobs").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);

      if (Array.isArray(projRes)) setProjects(projRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(jobsRes)) setJobs(jobsRes);
      if (setRes && !setRes.error) setSettings(setRes);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 3500);
  };

  // Upload handler (Cloudinary helper)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetCallback?: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
        if (targetCallback) {
          targetCallback(data.url);
        }
        showNotice("Đã tải ảnh lên thành công!");
      } else {
        showNotice(data.error || "Không thể tải ảnh", "error");
      }
    } catch (err: any) {
      showNotice(err.message || "Lỗi tải file", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Project Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("Đã lưu dự án thành công!");
        setIsEditingProject(false);
        loadData();
      } else {
        showNotice(data.error || "Lỗi khi lưu dự án", "error");
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotice("Đã xóa dự án");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  // News Actions
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm),
      });
      if (res.ok) {
        showNotice("Đã lưu bài viết thành công!");
        setIsEditingNews(false);
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tức này?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotice("Đã xóa tin tức");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  // Job Actions
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      if (res.ok) {
        showNotice("Đã lưu tin tuyển dụng thành công!");
        setIsEditingJob(false);
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa vị trí tuyển dụng này?")) return;
    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotice("Đã xóa tin tuyển dụng");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  // Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showNotice("Đã cập nhật cấu hình doanh nghiệp!");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Notice Toast */}
      {notice && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md text-sm font-semibold border ${
            notice.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/50 text-rose-200"
          }`}
        >
          {notice.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Về Website Chính</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              TRUNG HẢI CMS
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
              Quản Trị
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <span>Xem Web Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800 p-4 space-y-1 shrink-0">
          <button
            onClick={() => { setActiveTab("dashboard"); setIsEditingProject(false); setIsEditingNews(false); setIsEditingJob(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "dashboard" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            onClick={() => { setActiveTab("projects"); setIsEditingProject(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "projects" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Công Trình ({projects.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("news"); setIsEditingNews(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "news" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Tin Tức ({news.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("jobs"); setIsEditingJob(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "jobs" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Tuyển Dụng ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "media" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media & Cloudinary</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "settings" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài Đặt Công Ty</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* TAB: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Bảng Thống Kê Tổng Quan</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Hệ thống quản lý nội dung số Công ty Cổ phần Xây dựng và Đầu tư Trung Hải.
                    </p>
                  </div>

                  {/* Summary metric cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase text-slate-400 font-semibold">Công Trình Đã Đăng</div>
                        <div className="text-3xl font-extrabold text-white mt-1">{projects.length}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500">
                        <FolderKanban className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase text-slate-400 font-semibold">Bài Viết Tin Tức</div>
                        <div className="text-3xl font-extrabold text-white mt-1">{news.length}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                        <Newspaper className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase text-slate-400 font-semibold">Vị Trí Tuyển Dụng</div>
                        <div className="text-3xl font-extrabold text-white mt-1">{jobs.length}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-500">
                        <Briefcase className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Infrastructure Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cloudflare D1 card */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Cloudflare D1 Database</h4>
                          <span className="text-xs text-slate-400">Cơ sở dữ liệu Serverless Edge</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Hệ thống tự động sử dụng Cloudflare D1 khi các biến môi trường được cấu hình trên Vercel:
                        <code className="block mt-2 p-2 rounded bg-slate-950 text-orange-400 text-[11px] font-mono">
                          CLOUDFLARE_ACCOUNT_ID<br />
                          CLOUDFLARE_D1_DATABASE_ID<br />
                          CLOUDFLARE_API_TOKEN
                        </code>
                      </p>
                    </div>

                    {/* Cloudinary card */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                          <CloudRain className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Cloudinary CDN Storage</h4>
                          <span className="text-xs text-slate-400">Lưu trữ và nén hình ảnh siêu tốc</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Hình ảnh công trình tải lên sẽ chuyển thành link CDN tối ưu dung lượng WebP tự động:
                        <code className="block mt-2 p-2 rounded bg-slate-950 text-cyan-300 text-[11px] font-mono">
                          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME<br />
                          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROJECTS */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quản Lý Công Trình / Dự Án</h2>
                      <p className="text-xs text-slate-400">Thêm, sửa hoặc cập nhật các dự án thi công của Trung Hải</p>
                    </div>
                    {!isEditingProject && (
                      <button
                        onClick={() => {
                          setProjectForm({
                            title: "",
                            category: "ham",
                            categoryName: "Hầm Xuyên Núi",
                            client: "",
                            location: "",
                            year: "2026",
                            value: "",
                            scale: "",
                            thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
                            gallery: [],
                            description: "",
                            highlights: ["An toàn tuyệt đối 100%", "Tiến độ thi công đúng hạn"],
                            featured: true,
                          });
                          setIsEditingProject(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-600/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Dự Án Mới</span>
                      </button>
                    )}
                  </div>

                  {isEditingProject ? (
                    /* Project Edit Form */
                    <form onSubmit={handleSaveProject} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {projectForm.id ? "Chỉnh Sửa Dự Án" : "Thêm Dự Án Mới"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Dự Án *</label>
                          <input
                            type="text"
                            required
                            placeholder="Dự án hầm đường bộ qua..."
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Hạng Mục *</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              const map: Record<string, string> = {
                                ham: "Hầm Xuyên Núi",
                                "cau-duong": "Cầu & Đường Bộ",
                                "quoc-lo": "Quốc Lộ & Cao Tốc",
                                "ha-tang": "Hạ Tầng Kỹ Thuật",
                              };
                              setProjectForm({ ...projectForm, category: val, categoryName: map[val] });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          >
                            <option value="ham">Hầm Xuyên Núi</option>
                            <option value="cau-duong">Cầu & Đường Bộ</option>
                            <option value="quoc-lo">Quốc Lộ & Cao Tốc</option>
                            <option value="ha-tang">Hạ Tầng Kỹ Thuật</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Địa Điểm</label>
                          <input
                            type="text"
                            placeholder="Phú Yên - Khánh Hòa"
                            value={projectForm.location}
                            onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Chủ Đầu Tư</label>
                          <input
                            type="text"
                            placeholder="Bộ Giao thông Vận tải"
                            value={projectForm.client}
                            onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Năm Thi Công</label>
                          <input
                            type="text"
                            placeholder="2023 - 2026"
                            value={projectForm.year}
                            onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Giá Trị Gói Thầu</label>
                          <input
                            type="text"
                            placeholder="3.500 Tỷ VNĐ"
                            value={projectForm.value}
                            onChange={(e) => setProjectForm({ ...projectForm, value: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Quy Mô Kỹ Thuật</label>
                          <input
                            type="text"
                            placeholder="Hầm đôi 4 làn xe, dài 2.500m"
                            value={projectForm.scale}
                            onChange={(e) => setProjectForm({ ...projectForm, scale: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Image input + Cloudinary upload button */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Link Ảnh Đại Diện (Cloudinary / URL) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="https://..."
                            value={projectForm.thumbnail}
                            onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shrink-0">
                            <Upload className="w-4 h-4 text-orange-400" />
                            <span>{isUploading ? "Đang tải..." : "Tải ảnh lên"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setProjectForm((prev) => ({ ...prev, thumbnail: url })))}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Chi Tiết Công Trình</label>
                        <textarea
                          rows={4}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all"
                        >
                          Lưu Dự Án
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Project List Table */
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                            <tr>
                              <th className="py-3 px-4">Ảnh</th>
                              <th className="py-3 px-4">Tên Công Trình</th>
                              <th className="py-3 px-4">Hạng Mục</th>
                              <th className="py-3 px-4">Địa Điểm</th>
                              <th className="py-3 px-4">Thời Gian</th>
                              <th className="py-3 px-4 text-right">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {projects.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="relative w-14 h-10 rounded overflow-hidden">
                                    <Image src={p.thumbnail} alt="" fill className="object-cover" />
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">{p.title}</td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 text-xs">
                                    {p.categoryName}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-400">{p.location}</td>
                                <td className="py-3 px-4 text-slate-400">{p.year}</td>
                                <td className="py-3 px-4 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setProjectForm(p);
                                      setIsEditingProject(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                                    title="Sửa"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: NEWS */}
              {activeTab === "news" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quản Lý Tin Tức & Bài Viết</h2>
                      <p className="text-xs text-slate-400">Đăng bài tin tiến độ công trường, thông báo công ty</p>
                    </div>
                    {!isEditingNews && (
                      <button
                        onClick={() => {
                          setNewsForm({
                            title: "",
                            category: "du-an",
                            categoryName: "Tin Dự Án",
                            summary: "",
                            content: "",
                            author: "Ban Biên Tập",
                            thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
                            featured: true,
                          });
                          setIsEditingNews(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-600/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Đăng Bài Viết Mới</span>
                      </button>
                    )}
                  </div>

                  {isEditingNews ? (
                    <form onSubmit={handleSaveNews} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {newsForm.id ? "Sửa Bài Viết" : "Đăng Bài Viết Mới"}
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Tiêu Đề Bài Viết *</label>
                        <input
                          type="text"
                          required
                          value={newsForm.title}
                          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Chuyên Mục</label>
                          <select
                            value={newsForm.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              const map: Record<string, string> = {
                                "du-an": "Tin Dự Án",
                                "doanh-nghiep": "Tin Doanh Nghiệp",
                                "an-toan": "An Toàn Lao Động",
                                "tuyen-dung": "Tuyển Dụng",
                              };
                              setNewsForm({ ...newsForm, category: val, categoryName: map[val] });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          >
                            <option value="du-an">Tin Dự Án</option>
                            <option value="doanh-nghiep">Tin Doanh Nghiệp</option>
                            <option value="an-toan">An Toàn Lao Động</option>
                            <option value="tuyen-dung">Tuyển Dụng</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Tác Giả</label>
                          <input
                            type="text"
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Ảnh Đại Diện</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={newsForm.thumbnail}
                            onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })}
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shrink-0">
                            <Upload className="w-4 h-4 text-orange-400" />
                            <span>Tải ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setNewsForm((prev) => ({ ...prev, thumbnail: url })))}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Tóm Tắt Ngắn</label>
                        <textarea
                          rows={2}
                          value={newsForm.summary}
                          onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Nội Dung Bài Viết</label>
                        <textarea
                          rows={6}
                          value={newsForm.content}
                          onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all"
                        >
                          Lưu Bài Viết
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingNews(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {news.map((item) => (
                        <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                            <Image src={item.thumbnail} alt="" fill className="object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[11px] font-bold text-orange-400">{item.categoryName}</span>
                              <h4 className="text-sm font-bold text-white line-clamp-2 mt-1">{item.title}</h4>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-slate-500">{item.date}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setNewsForm(item); setIsEditingNews(true); }}
                                  className="p-1 rounded bg-slate-800 text-slate-200 hover:text-white"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteNews(item.id)}
                                  className="p-1 rounded bg-rose-950 text-rose-300 hover:text-rose-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: JOBS */}
              {activeTab === "jobs" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quản Lý Tuyển Dụng</h2>
                      <p className="text-xs text-slate-400">Đăng vị trí kỹ sư, chỉ huy trưởng công trình</p>
                    </div>
                    {!isEditingJob && (
                      <button
                        onClick={() => {
                          setJobForm({
                            title: "",
                            department: "Ban Quản lý Thi công",
                            location: "Công trường Miền Trung",
                            salary: "18.000.000 - 25.000.000 VNĐ",
                            deadline: "30/12/2026",
                            type: "Toàn thời gian",
                            description: ["Giám sát thi công hầm và cầu đường"],
                            requirements: ["Tốt nghiệp Đại học Cầu đường"],
                            benefits: ["Bao ăn ở tại công trường, BHXH đầy đủ"],
                            active: true,
                          });
                          setIsEditingJob(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-600/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Vị Trí Mới</span>
                      </button>
                    )}
                  </div>

                  {isEditingJob ? (
                    <form onSubmit={handleSaveJob} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {jobForm.id ? "Sửa Tin Tuyển Dụng" : "Đăng Tin Tuyển Dụng Mới"}
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Chức Danh / Vị Trí *</label>
                        <input
                          type="text"
                          required
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Địa Điểm Làm Việc</label>
                          <input
                            type="text"
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Mức Lương</label>
                          <input
                            type="text"
                            value={jobForm.salary}
                            onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Hạn Nộp Hồ Sơ</label>
                          <input
                            type="text"
                            value={jobForm.deadline}
                            onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all"
                        >
                          Lưu Tin Tuyển Dụng
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingJob(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {jobs.map((job) => (
                        <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-orange-400">{job.department}</span>
                              <span className="text-xs text-slate-500">• {job.type}</span>
                            </div>
                            <h4 className="text-base font-bold text-white mt-1">{job.title}</h4>
                            <div className="text-xs text-slate-400 mt-1">
                              Địa điểm: {job.location} | Lương: {job.salary}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setJobForm(job); setIsEditingJob(true); }}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MEDIA & CLOUDINARY */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Thư Viện Ảnh & Cloudinary</h2>
                    <p className="text-xs text-slate-400">Tải ảnh công trình lên Cloudinary để nhận đường dẫn link trực tiếp</p>
                  </div>

                  {/* Uploader Box */}
                  <div className="p-8 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-orange-500/50 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-600/10 text-orange-500 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Tải Lên Hình Ảnh Mới</h4>
                      <p className="text-xs text-slate-400 mt-1">Hỗ trợ PNG, JPG, WEBP chất lượng cao</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-orange-600/30 transition-all">
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? "Đang xử lý tải lên..." : "Chọn Ảnh Từ Máy Tính"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e)} />
                      </label>
                    </div>
                  </div>

                  {/* Upload result */}
                  {uploadedUrl && (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã tạo link ảnh thành công! Bạn có thể copy link này để dán vào bài viết hoặc dự án:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={uploadedUrl}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-orange-400 text-xs font-mono"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedUrl);
                            showNotice("Đã sao chép link ảnh vào clipboard!");
                          }}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                        >
                          Copy Link
                        </button>
                      </div>
                      <div className="relative h-44 w-full sm:w-80 rounded-xl overflow-hidden mt-3 border border-slate-800">
                        <Image src={uploadedUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === "settings" && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Cài Đặt Thông Tin Doanh Nghiệp</h2>
                    <p className="text-xs text-slate-400">Thay đổi thông tin trụ sở, số điện thoại, mã số thuế</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên Đầy Đủ Doanh Nghiệp</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mã Số Thuế (MST)</label>
                        <input
                          type="text"
                          value={settings.taxCode}
                          onChange={(e) => setSettings({ ...settings, taxCode: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hotline</label>
                        <input
                          type="text"
                          value={settings.hotline}
                          onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Điện Thoại Trụ Sở</label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Công Ty</label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Địa Chỉ Trụ Sở</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-xl shadow-orange-600/30 transition-all"
                      >
                        Lưu Thay Đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
