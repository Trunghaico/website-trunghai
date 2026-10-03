"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import CreatableCategorySelect, { CategoryOption } from "@/components/CreatableCategorySelect";
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
  ArrowLeft,
  LogOut,
  Key,
  X,
  Loader2,
  Search,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Link2,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  ChevronUp,
  ChevronDown,
  Clock,
  Play,
} from "lucide-react";
import { Project, NewsPost, JobPosting, CompanySettings, HeroSlide } from "@/types";

// Dynamic import for TinyMCE editor to ensure client-side rendering
const TinyMCEEditor = dynamic(() => import("@/components/TinyMCEEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border border-slate-200 rounded-[3px] bg-slate-50 flex items-center justify-center text-xs text-slate-400 gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-[#ed3237]" />
      <span>Đang tải trình soạn thảo TinyMCE...</span>
    </div>
  ),
});

// Vietnamese SEO Slug converter function
function toVietnameseSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Chuyên mục tin tức mặc định
const DEFAULT_NEWS_CATEGORIES: CategoryOption[] = [
  { id: "du-an", name: "Tin Dự Án" },
  { id: "doanh-nghiep", name: "Tin Doanh Nghiệp" },
  { id: "an-toan", name: "An Toàn Lao Động" },
  { id: "tuyen-dung", name: "Tuyển Dụng" },
];

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; name: string; role: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "news" | "slides" | "jobs" | "media" | "settings">("dashboard");

  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [slideInterval, setSlideInterval] = useState<number>(5);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Search filters
  const [projectSearch, setProjectSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");

  // Slide Form State
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [isSavingInterval, setIsSavingInterval] = useState(false);
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({
    title: "",
    subtitle: "",
    tag: "ĐẠI CÔNG TRÌNH QUỐC GIA",
    image: "",
    projectLink: "",
    stats: { label: "", value: "" },
    orderIndex: 0,
  });

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
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [newsFilterStatus, setNewsFilterStatus] = useState<"all" | "published" | "hidden">("all");
  const [customNewsCategories, setCustomNewsCategories] = useState<CategoryOption[]>([]);
  const [newsForm, setNewsForm] = useState<Partial<NewsPost>>({
    title: "",
    slug: "",
    category: "du-an",
    categoryName: "Tin Dự Án",
    summary: "",
    content: "",
    author: "Ban Biên Tập",
    thumbnail: "",
    featured: true,
    published: true,
  });

  // Danh sách chuyên mục tin tức hợp nhất (mặc định + từ bài viết hiện có + tự thêm mới)
  const availableNewsCategories = useMemo(() => {
    const map = new Map<string, string>();
    DEFAULT_NEWS_CATEGORIES.forEach((c) => map.set(c.id, c.name));
    news.forEach((n) => {
      if (n.category) {
        map.set(n.category, n.categoryName || n.category);
      }
    });
    customNewsCategories.forEach((c) => map.set(c.id, c.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [news, customNewsCategories]);

  // Job Form State
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobForm, setJobForm] = useState<Partial<JobPosting>>({
    title: "",
    department: "Ban Quản lý Thi công",
    location: "Miền Trung / TP.HCM",
    salary: "Thỏa thuận",
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
      const [projRes, newsRes, jobsRes, setRes, slidesRes] = await Promise.all([
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/news").then((r) => r.json()),
        fetch("/api/jobs").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/slides").then((r) => r.json()),
      ]);

      if (Array.isArray(projRes)) setProjects(projRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(jobsRes)) setJobs(jobsRes);
      if (Array.isArray(slidesRes)) setSlides(slidesRes);
      if (setRes && !setRes.error) {
        setSettings(setRes);
        if (setRes.slideInterval) setSlideInterval(Number(setRes.slideInterval) || 5);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth and load data
  useEffect(() => {
    async function checkAuthAndLoadData() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/login");
          return;
        }
        setCurrentUser(data.user);
        loadData();
      } catch (err) {
        router.replace("/login");
      } finally {
        setIsAuthLoading(false);
      }
    }

    checkAuthAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) return;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showNotice("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showNotice("Mật khẩu mới phải có tối thiểu 6 ký tự", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotice("Xác nhận mật khẩu mới không khớp", "error");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(data.error || "Lỗi khi đổi mật khẩu", "error");
        return;
      }
      showNotice("Đã đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showNotice(err.message || "Lỗi kết nối máy chủ", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

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
        showNotice("Đã xóa dự án thành công");
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
      const finalSlug = newsForm.slug || toVietnameseSlug(newsForm.title || "");
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newsForm, slug: finalSlug }),
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
        showNotice("Đã xóa tin tức thành công");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleToggleFeaturedNews = async (post: NewsPost) => {
    const newFeatured = !post.featured;
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, featured: newFeatured }),
      });
      if (res.ok) {
        setNews((prev) =>
          prev.map((n) => (n.id === post.id ? { ...n, featured: newFeatured } : n))
        );
        showNotice(
          newFeatured
            ? "Đã BẬT hiển thị trên trang chủ!"
            : "Đã TẮT hiển thị trên trang chủ!"
        );
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleTogglePublishNews = async (post: NewsPost) => {
    const currentPublished = post.published !== false;
    const newPublished = !currentPublished;
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, published: newPublished }),
      });
      if (res.ok) {
        setNews((prev) =>
          prev.map((n) => (n.id === post.id ? { ...n, published: newPublished } : n))
        );
        showNotice(
          newPublished
            ? "Đã CÔNG KHAI bài viết lên toàn bộ website!"
            : "Đã ẨN bài viết khỏi toàn bộ website (ẩn trang chủ, tin tức & link chi tiết)!"
        );
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  // Slide Actions
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.image) {
      showNotice("Vui lòng chọn hoặc tải lên hình ảnh cho slide", "error");
      return;
    }
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...slideForm,
          orderIndex: slideForm.orderIndex ?? slides.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(data.error || "Lỗi khi lưu slide", "error");
        return;
      }
      showNotice("Đã lưu slide trang chủ thành công!");
      setIsEditingSlide(false);
      loadData();
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa slide này? Hình ảnh trên Cloudinary cũng sẽ tự động được dọn dẹp.")) return;
    try {
      const res = await fetch(`/api/slides?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotice("Đã xóa slide thành công");
        loadData();
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    }
  };

  const handleSaveSlideInterval = async (val: number) => {
    if (val < 2 || val > 60) {
      showNotice("Thời gian chuyển slide phải từ 2 đến 60 giây", "error");
      return;
    }
    setIsSavingInterval(true);
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideInterval: val }),
      });
      if (res.ok) {
        setSlideInterval(val);
        showNotice(`Đã cài đặt thời gian chạy slide: ${val} giây / ảnh!`);
      }
    } catch (err: any) {
      showNotice(err.message, "error");
    } finally {
      setIsSavingInterval(false);
    }
  };

  const handleMoveSlide = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[idx];
    newSlides[idx] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    const reordered = newSlides.map((s, i) => ({ ...s, orderIndex: i }));
    setSlides(reordered);

    try {
      await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: reordered }),
      });
      showNotice("Đã cập nhật lại thứ tự hiển thị slide!");
    } catch (err) {
      console.error("Failed to reorder slides:", err);
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
        showNotice("Đã xóa tin tuyển dụng thành công");
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

  // Filtered lists
  const filteredProjects = projects.filter((p) =>
    projectSearch ? p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.categoryName.toLowerCase().includes(projectSearch.toLowerCase()) || p.location.toLowerCase().includes(projectSearch.toLowerCase()) : true
  );

  const filteredNews = news.filter((n) => {
    const matchSearch = newsSearch
      ? n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        n.categoryName.toLowerCase().includes(newsSearch.toLowerCase()) ||
        (n.summary && n.summary.toLowerCase().includes(newsSearch.toLowerCase()))
      : true;
    if (!matchSearch) return false;
    if (newsFilterStatus === "published") return n.published !== false;
    if (newsFilterStatus === "hidden") return n.published === false;
    return true;
  });

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#ed3237] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Đang xác thực quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "dashboard" as const, label: "Tổng quan", icon: LayoutDashboard, count: null },
    { id: "projects" as const, label: "Công trình", icon: FolderKanban, count: projects.length },
    { id: "news" as const, label: "Tin tức", icon: Newspaper, count: news.length },
    { id: "slides" as const, label: "Slides", icon: Sliders, count: slides.length },
    { id: "jobs" as const, label: "Tuyển dụng", icon: Briefcase, count: jobs.length },
    { id: "media" as const, label: "Media & Ảnh", icon: ImageIcon, count: null },
    { id: "settings" as const, label: "Cài đặt", icon: Settings, count: null },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Notice Toast */}
      {notice && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[3px] shadow-lg text-xs font-semibold border transition-all ${
            notice.type === "success"
              ? "bg-white border-emerald-500 text-emerald-800 shadow-emerald-500/10"
              : "bg-white border-rose-500 text-rose-800 shadow-rose-500/10"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#ed3237] transition-colors text-xs font-medium"
            title="Quay lại trang chủ"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[1px] bg-[#ed3237]" />
              TRUNG HẢI
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[3px] bg-red-50 text-[#ed3237] border border-red-200/80">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {currentUser && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-xs">
              <div className="w-5 h-5 rounded-[2px] bg-[#ed3237] text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.username[0]?.toUpperCase() || "A"}
              </div>
              <span className="font-semibold text-slate-700 hidden sm:inline">{currentUser.name || currentUser.username}</span>
            </div>
          )}

          <button
            onClick={() => setShowPasswordModal(true)}
            title="Đổi mật khẩu tài khoản"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Đổi mật khẩu</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            <span>Xem website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-red-50 hover:bg-[#ed3237] text-[#ed3237] hover:text-white border border-red-200 hover:border-[#ed3237] text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Compact Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-56 bg-white border-r border-slate-200 p-2.5 space-y-1 shrink-0">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Quản Lý
          </div>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsEditingProject(false);
                  setIsEditingNews(false);
                  setIsEditingJob(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[3px] text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#ed3237] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[3px] ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">Đang tải dữ liệu hệ thống...</div>
          ) : (
            <>
              {/* TAB: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-5 max-w-6xl">
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div
                      onClick={() => setActiveTab("projects")}
                      className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs hover:border-[#ed3237]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Công trình</div>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{projects.length}</div>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-red-50 text-[#ed3237] border border-red-100">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("news")}
                      className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs hover:border-[#ed3237]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tin tức</div>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{news.length}</div>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-blue-50 text-blue-600 border border-blue-100">
                        <Newspaper className="w-5 h-5" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("slides")}
                      className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs hover:border-[#ed3237]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Slides Trang Chủ</div>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{slides.length}</div>
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          {slideInterval}s / slide
                        </span>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-amber-50 text-amber-600 border border-amber-100">
                        <Sliders className="w-5 h-5" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("jobs")}
                      className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs hover:border-[#ed3237]/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tuyển dụng</div>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{jobs.length}</div>
                      </div>
                      <div className="p-2.5 rounded-[3px] bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs">
                    <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                      Thao tác nhanh
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setActiveTab("projects");
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm công trình</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("news");
                          setNewsForm({
                            title: "",
                            slug: "",
                            category: "du-an",
                            categoryName: "Tin Dự Án",
                            summary: "",
                            content: "",
                            author: "Ban Biên Tập",
                            thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
                            featured: true,
                          });
                          setIsAutoSlug(true);
                          setIsEditingNews(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm tin tức</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("slides");
                          setSlideForm({
                            title: "",
                            subtitle: "",
                            tag: "",
                            image: "",
                            projectLink: "",
                            stats: { label: "", value: "" },
                            orderIndex: slides.length,
                          });
                          setIsEditingSlide(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm slide banner</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("jobs");
                          setJobForm({
                            title: "",
                            department: "Ban Quản lý Thi công",
                            location: "Miền Trung / TP.HCM",
                            salary: "Thỏa thuận",
                            deadline: "30/12/2026",
                            type: "Toàn thời gian",
                            description: ["Giám sát thi công"],
                            requirements: ["Tốt nghiệp ĐH chuyên ngành"],
                            benefits: ["Chế độ đầy đủ"],
                            active: true,
                          });
                          setIsEditingJob(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Đăng tuyển dụng</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("media")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tải ảnh lên</span>
                      </button>
                    </div>
                  </div>

                  {/* System & Cloud Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                      <div className="p-2 rounded-[3px] bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800">Cloudflare D1 Database</h4>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-[2px] border border-emerald-200">
                            Sẵn sàng
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Lưu trữ cơ sở dữ liệu Edge Serverless thời gian thực.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-[3px] bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
                      <div className="p-2 rounded-[3px] bg-cyan-50 text-cyan-600 border border-cyan-100 shrink-0">
                        <CloudRain className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800">Cloudinary CDN Media</h4>
                          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.2 rounded-[2px] border border-cyan-200">
                            Tự động nén WebP
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Tối ưu hóa hình ảnh công trình và phân phối qua CDN tốc độ cao.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Projects Mini Table */}
                  <div className="rounded-[3px] bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Công trình gần đây
                      </span>
                      <button
                        onClick={() => setActiveTab("projects")}
                        className="text-xs font-semibold text-[#ed3237] hover:underline cursor-pointer"
                      >
                        Xem tất cả ({projects.length})
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {projects.slice(0, 4).map((p) => (
                        <div key={p.id} className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-50/60">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-8 rounded-[2px] overflow-hidden shrink-0 border border-slate-200">
                              <Image src={p.thumbnail} alt="" fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 truncate">{p.title}</div>
                              <div className="text-[11px] text-slate-500">{p.categoryName} • {p.location}</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 shrink-0 ml-2">
                            {p.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROJECTS */}
              {activeTab === "projects" && (
                <div className="space-y-4 max-w-6xl">
                  {/* Header bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Quản lý công trình</h2>
                      <p className="text-xs text-slate-500">Danh sách các dự án thi công của Trung Hải</p>
                    </div>
                    {!isEditingProject && (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Tìm dự án..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#ed3237] focus:outline-none w-44 sm:w-56"
                          />
                        </div>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm mới</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingProject ? (
                    /* Project Form */
                    <form onSubmit={handleSaveProject} className="p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-900">
                          {projectForm.id ? "Chỉnh sửa dự án" : "Thêm dự án mới"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Tên dự án *</label>
                          <input
                            type="text"
                            required
                            placeholder="Tên công trình..."
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Hạng mục *</label>
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
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          >
                            <option value="ham">Hầm Xuyên Núi</option>
                            <option value="cau-duong">Cầu & Đường Bộ</option>
                            <option value="quoc-lo">Quốc Lộ & Cao Tốc</option>
                            <option value="ha-tang">Hạ Tầng Kỹ Thuật</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Địa điểm</label>
                          <input
                            type="text"
                            placeholder="Tỉnh/Thành phố..."
                            value={projectForm.location}
                            onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Chủ đầu tư</label>
                          <input
                            type="text"
                            placeholder="Chủ đầu tư..."
                            value={projectForm.client}
                            onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Năm thi công</label>
                          <input
                            type="text"
                            placeholder="2023 - 2026"
                            value={projectForm.year}
                            onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Giá trị gói thầu</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: 3.500 Tỷ VNĐ"
                            value={projectForm.value}
                            onChange={(e) => setProjectForm({ ...projectForm, value: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Quy mô kỹ thuật</label>
                          <input
                            type="text"
                            placeholder="Quy mô dự án..."
                            value={projectForm.scale}
                            onChange={(e) => setProjectForm({ ...projectForm, scale: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Link ảnh đại diện (Cloudinary / URL) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="https://..."
                            value={projectForm.thumbnail}
                            onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none font-mono"
                          />
                          <label className="cursor-pointer px-3 py-2 rounded-[3px] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-[#ed3237]" />
                            <span>{isUploading ? "Tải lên..." : "Tải ảnh"}</span>
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả công trình</label>
                        <textarea
                          rows={3}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors"
                        >
                          Lưu công trình
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Project Table */
                    <div className="rounded-[3px] border border-slate-200 bg-white shadow-2xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3.5 w-16">Ảnh</th>
                              <th className="py-2.5 px-3.5">Tên công trình</th>
                              <th className="py-2.5 px-3.5">Hạng mục</th>
                              <th className="py-2.5 px-3.5">Địa điểm</th>
                              <th className="py-2.5 px-3.5">Năm</th>
                              <th className="py-2.5 px-3.5 text-right w-24">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredProjects.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                  Không tìm thấy công trình nào
                                </td>
                              </tr>
                            ) : (
                              filteredProjects.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-2.5 px-3.5">
                                    <div className="relative w-12 h-9 rounded-[2px] overflow-hidden border border-slate-200">
                                      <Image src={p.thumbnail} alt="" fill className="object-cover" />
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3.5 font-semibold text-slate-900 max-w-xs truncate">
                                    {p.title}
                                  </td>
                                  <td className="py-2.5 px-3.5">
                                    <span className="px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                                      {p.categoryName}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3.5 text-slate-500">{p.location}</td>
                                  <td className="py-2.5 px-3.5 text-slate-500">{p.year}</td>
                                  <td className="py-2.5 px-3.5 text-right space-x-1">
                                    <button
                                      onClick={() => {
                                        setProjectForm(p);
                                        setIsEditingProject(true);
                                      }}
                                      className="p-1.5 rounded-[3px] border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                      title="Sửa"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProject(p.id)}
                                      className="p-1.5 rounded-[3px] border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 transition-colors"
                                      title="Xóa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: NEWS */}
              {activeTab === "news" && (
                <div className="space-y-4 max-w-6xl">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Quản lý tin tức & bài viết</h2>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[2px]">
                          Tổng: {news.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Tin tiến độ công trường, thông điệp và văn hóa doanh nghiệp</p>
                    </div>
                    {!isEditingNews && (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Tìm bài viết..."
                            value={newsSearch}
                            onChange={(e) => setNewsSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#ed3237] focus:outline-none w-44 sm:w-56"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setNewsForm({
                              title: "",
                              slug: "",
                              category: "du-an",
                              categoryName: "Tin Dự Án",
                              summary: "",
                              content: "",
                              author: "Ban Biên Tập",
                              thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
                              featured: true,
                              published: true,
                            });
                            setIsAutoSlug(true);
                            setIsEditingNews(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm bài viết</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Filter Status Tabs (Tất cả / Đang công khai / Đã ẩn toàn bộ) */}
                  {!isEditingNews && (
                    <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => setNewsFilterStatus("all")}
                        className={`px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          newsFilterStatus === "all"
                            ? "bg-slate-800 text-white shadow-2xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>Tất cả</span>
                        <span className="text-[10px] opacity-80">({news.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsFilterStatus("published")}
                        className={`px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          newsFilterStatus === "published"
                            ? "bg-emerald-700 text-white shadow-2xs"
                            : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Đang công khai</span>
                        <span className="text-[10px] opacity-80">
                          ({news.filter((n) => n.published !== false).length})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsFilterStatus("hidden")}
                        className={`px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          newsFilterStatus === "hidden"
                            ? "bg-rose-700 text-white shadow-2xs"
                            : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
                        }`}
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Đã ẩn toàn bộ</span>
                        <span className="text-[10px] opacity-80">
                          ({news.filter((n) => n.published === false).length})
                        </span>
                      </button>
                    </div>
                  )}

                  {isEditingNews ? (
                    <form onSubmit={handleSaveNews} className="p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {newsForm.id ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-[2px] uppercase">
                            Quill.js 2.0 & SEO Link
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingNews(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tiêu đề bài viết */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Đột phá tiến độ thi công dự án hầm đường bộ 2026..."
                          value={newsForm.title || ""}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setNewsForm((prev) => ({
                              ...prev,
                              title: newTitle,
                              slug: isAutoSlug ? toVietnameseSlug(newTitle) : prev.slug,
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>

                      {/* Chuyển đổi link SEO (SEO URL Slug Converter) */}
                      <div className="p-3.5 rounded-[3px] bg-slate-50/80 border border-slate-200/90 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Globe className="w-3.5 h-3.5 text-[#3e4095]" />
                            <span>Đường dẫn SEO (Slug URL)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newSlug = toVietnameseSlug(newsForm.title || "");
                                setNewsForm((prev) => ({ ...prev, slug: newSlug }));
                                setIsAutoSlug(true);
                                showNotice("Đã tạo đường dẫn SEO mới từ tiêu đề!");
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3e4095] hover:text-[#ed3237] transition-colors cursor-pointer"
                              title="Tạo lại slug tự động từ tiêu đề"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Tạo lại từ tiêu đề</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const fullUrl = `https://trunghaico.vn/tin-tuc/${newsForm.slug || ""}`;
                                navigator.clipboard.writeText(fullUrl);
                                showNotice("Đã sao chép liên kết SEO vào bộ nhớ tạm!");
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Sao chép link SEO"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy link</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center rounded-[3px] border border-slate-200 bg-white overflow-hidden focus-within:border-[#ed3237] focus-within:ring-1 focus-within:ring-[#ed3237]/20">
                          <span className="px-2.5 py-1.5 bg-slate-100 text-slate-500 text-xs font-mono border-r border-slate-200 shrink-0 select-none">
                            trunghaico.vn/tin-tuc/
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="du-an-ham-xuyen-nui-2026"
                            value={newsForm.slug || ""}
                            onChange={(e) => {
                              setIsAutoSlug(false);
                              setNewsForm({ ...newsForm, slug: toVietnameseSlug(e.target.value) });
                            }}
                            className="flex-1 px-3 py-1.5 text-xs text-slate-800 focus:outline-none font-mono"
                          />
                        </div>

                        {/* Google Search Result Preview */}
                        <div className="pt-2 border-t border-slate-200/70">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Mô phỏng hiển thị trên Google Search:</span>
                          </div>
                          <div className="p-2.5 rounded-[3px] bg-white border border-slate-200/70 text-xs space-y-0.5 shadow-2xs">
                            <div className="text-[11px] text-emerald-700 font-mono truncate">
                              https://trunghaico.vn › tin-tuc › {newsForm.slug || "duong-dan-bai-viet"}
                            </div>
                            <div className="text-sm font-semibold text-blue-700 truncate hover:underline cursor-pointer">
                              {newsForm.title || "Tiêu đề bài viết tin tức"} - Trung Hải JSC
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-2">
                              {newsForm.summary || "Đoạn tóm tắt nội dung bài viết sẽ hiển thị tại đây trên kết quả tìm kiếm Google..."}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-700">Chuyên mục</label>
                            <span className="text-[10px] text-slate-400">Gõ để tìm hoặc dấu + thêm mới</span>
                          </div>
                          <CreatableCategorySelect
                            value={newsForm.category || "du-an"}
                            categoryName={newsForm.categoryName}
                            categories={availableNewsCategories}
                            onChange={(cat) => {
                              setNewsForm((prev) => ({
                                ...prev,
                                category: cat.id,
                                categoryName: cat.name,
                              }));
                            }}
                            onAddCategory={(newCat) => {
                              setCustomNewsCategories((prev) => {
                                if (prev.some((c) => c.id === newCat.id)) return prev;
                                return [...prev, newCat];
                              });
                              showNotice(`Đã thêm chuyên mục mới: "${newCat.name}"!`);
                            }}
                            toSlug={toVietnameseSlug}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Tác giả</label>
                          <input
                            type="text"
                            value={newsForm.author}
                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ảnh đại diện</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={newsForm.thumbnail}
                            onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none font-mono"
                          />
                          <label className="cursor-pointer px-3 py-2 rounded-[3px] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-[#ed3237]" />
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tóm tắt ngắn (Meta Description cho SEO)</label>
                        <textarea
                          rows={2}
                          value={newsForm.summary}
                          placeholder="Mô tả tóm tắt ngắn về nội dung bài viết..."
                          onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>

                      {/* Soạn thảo nội dung bằng Quill.js 2.0 */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Nội dung chi tiết bài viết (Trình soạn thảo TinyMCE) *
                          </label>
                          <span className="text-[10px] font-bold text-[#ed3237] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-[3px]">
                            TinyMCE 7 (Kéo chỉnh ảnh)
                          </span>
                        </div>
                        <TinyMCEEditor
                          value={newsForm.content || ""}
                          onChange={(content) => setNewsForm((prev) => ({ ...prev, content }))}
                          placeholder="Soạn thảo nội dung bài viết chi tiết tại đây (hỗ trợ kéo chỉnh ảnh 8 góc, bảng biểu, căn lề, trích dẫn)..."
                        />
                      </div>

                      {/* Cụm thiết lập trạng thái: Công khai/Ẩn toàn bộ & Hiển thị trên trang chủ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* 1. Trạng thái hiển thị toàn bộ website (Công khai / Ẩn) */}
                        <div
                          className={`p-3.5 rounded-[3px] border transition-colors ${
                            newsForm.published !== false
                              ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <span>Trạng thái bài viết:</span>
                                {newsForm.published !== false ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>CÔNG KHAI</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    <span>ĐÃ ẨN TOÀN BỘ</span>
                                  </span>
                                )}
                              </label>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {newsForm.published !== false
                                  ? "Bài viết hiển thị công khai trên website, người đọc có thể truy cập."
                                  : "Ẩn hoàn toàn khỏi trang chủ, trang tin tức và link trực tiếp (chỉ admin thấy)."}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setNewsForm((prev) => ({
                                  ...prev,
                                  published: prev.published === false ? true : false,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                newsForm.published !== false ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  newsForm.published !== false ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* 2. Bật / Tắt hiển thị trên trang chủ */}
                        <div className="p-3.5 rounded-[3px] bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>Hiển thị trên trang chủ:</span>
                              {newsForm.featured ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-[2px]">
                                  Đang BẬT
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-[2px]">
                                  Đang TẮT
                                </span>
                              )}
                            </label>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {newsForm.featured
                                ? "Bài viết sẽ xuất hiện tại khu vực Tin tức trên trang chủ."
                                : "Ẩn khỏi trang chủ (vẫn xem được trong trang tin tức nếu đang công khai)."}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setNewsForm((prev) => ({ ...prev, featured: !prev.featured }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              newsForm.featured ? "bg-[#ed3237]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                newsForm.featured ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors"
                        >
                          Lưu bài viết
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingNews(false)}
                          className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredNews.length === 0 ? (
                        <div className="col-span-2 py-8 text-center text-slate-400 text-xs bg-white rounded-[3px] border border-slate-200">
                          Không tìm thấy bài viết nào
                        </div>
                      ) : (
                        filteredNews.map((item) => {
                          const isPublished = item.published !== false;
                          return (
                            <div
                              key={item.id}
                              className={`p-3.5 rounded-[3px] bg-white border shadow-2xs flex gap-3.5 transition-colors ${
                                isPublished
                                  ? "border-slate-200 hover:border-slate-300"
                                  : "border-rose-200/90 bg-rose-50/20 hover:border-rose-300"
                              }`}
                            >
                              <div className="relative w-20 h-20 rounded-[2px] overflow-hidden shrink-0 border border-slate-200">
                                <Image src={item.thumbnail} alt="" fill className="object-cover" />
                                {!isPublished && (
                                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                    <EyeOff className="w-5 h-5 text-white/90" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold uppercase text-slate-500">
                                      {item.categoryName}
                                    </span>
                                    {isPublished ? (
                                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 rounded-[2px] inline-flex items-center gap-1">
                                        <Eye className="w-2.5 h-2.5" />
                                        <span>CÔNG KHAI</span>
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-1.5 py-0.2 rounded-[2px] inline-flex items-center gap-1">
                                        <EyeOff className="w-2.5 h-2.5" />
                                        <span>ĐÃ ẨN TOÀN BỘ</span>
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                                    {item.title}
                                  </h4>
                                  {item.slug && (
                                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                                      /{item.slug}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] text-slate-400 mr-0.5">{item.date}</span>

                                    {/* 1-click Quick Toggle Nút Ẩn / Mở công khai */}
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePublishNews(item)}
                                      title={
                                        isPublished
                                          ? "Bấm để ẩn bài viết khỏi toàn bộ website"
                                          : "Bấm để mở công khai bài viết lên website"
                                      }
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border transition-all cursor-pointer ${
                                        isPublished
                                          ? "bg-slate-50 text-slate-600 border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                                          : "bg-rose-100 text-rose-700 border-rose-300 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300"
                                      }`}
                                    >
                                      {isPublished ? (
                                        <>
                                          <EyeOff className="w-3 h-3 text-slate-500" />
                                          <span>Ẩn bài</span>
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="w-3 h-3 text-rose-600" />
                                          <span>Hiện lại</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Toggle hiển thị trên trang chủ */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleFeaturedNews(item)}
                                      title={
                                        item.featured
                                          ? "Bấm để tắt hiển thị trên trang chủ"
                                          : "Bấm để bật hiển thị trên trang chủ"
                                      }
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border transition-all cursor-pointer ${
                                        item.featured
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          item.featured ? "bg-emerald-500" : "bg-slate-400"
                                        }`}
                                      />
                                      <span>{item.featured ? "Trang chủ: BẬT" : "Trang chủ: TẮT"}</span>
                                    </button>
                                  </div>

                                  <div className="flex gap-1.5 shrink-0">
                                    <a
                                      href={`/tin-tuc/${item.slug || item.id}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded-[3px] border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                                      title={
                                        isPublished
                                          ? "Xem bài viết live"
                                          : "Bài viết đang bị ẩn (xem live sẽ báo 404)"
                                      }
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                      onClick={() => {
                                        setNewsForm({
                                          ...item,
                                          slug: item.slug || toVietnameseSlug(item.title),
                                          featured: item.featured ?? true,
                                          published: item.published !== false,
                                        });
                                        setIsAutoSlug(false);
                                        setIsEditingNews(true);
                                      }}
                                      className="p-1 rounded-[3px] border border-slate-200 hover:bg-slate-100 text-slate-600"
                                      title="Sửa"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNews(item.id)}
                                      className="p-1 rounded-[3px] border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600"
                                      title="Xóa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SLIDES */}
              {activeTab === "slides" && (
                <div className="space-y-4 max-w-6xl">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">Quản lý Slides Banner Trang Chủ</h2>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[2px]">
                          {slides.length} Slides
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tùy chỉnh hình ảnh trình chiếu lớn trên đầu trang chủ và thời gian tự động lướt giữa các slide.
                      </p>
                    </div>
                    {!isEditingSlide && (
                      <div className="flex items-center gap-2">
                        <a
                          href="/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem Trang Chủ</span>
                        </a>
                        <button
                          onClick={() => {
                            setSlideForm({
                              title: "",
                              subtitle: "",
                              tag: "",
                              image: "",
                              projectLink: "",
                              stats: { label: "", value: "" },
                              orderIndex: slides.length,
                            });
                            setIsEditingSlide(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm slide mới</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Config Box: Thời gian chuyển slide tự động */}
                  <div className="p-4 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-[3px] bg-amber-50 text-amber-600 border border-amber-200/80">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>Thời gian chạy giữa các hình ảnh</span>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-[2px]">
                              Hiện tại: {slideInterval} giây / ảnh
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Khoảng thời gian mỗi bức ảnh hiển thị ở banner trang chủ trước khi tự động chuyển sang ảnh tiếp theo.
                          </p>
                        </div>
                      </div>

                      {/* Presets & Custom Input */}
                      <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
                        <span className="text-[11px] font-semibold text-slate-500 mr-1">Chọn nhanh:</span>
                        {[3, 5, 7, 10].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => handleSaveSlideInterval(sec)}
                            disabled={isSavingInterval}
                            className={`px-2.5 py-1 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                              slideInterval === sec
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                            }`}
                          >
                            {sec}s {sec === 5 && "⭐"}
                          </button>
                        ))}

                        <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200">
                          <input
                            type="number"
                            min="2"
                            max="60"
                            value={slideInterval}
                            onChange={(e) => setSlideInterval(Math.max(2, Math.min(60, Number(e.target.value) || 2)))}
                            className="w-14 px-2 py-1 rounded-[3px] bg-white border border-slate-200 text-xs font-bold text-slate-800 text-center focus:border-amber-500 focus:outline-none"
                          />
                          <span className="text-xs text-slate-500">giây</span>
                          <button
                            type="button"
                            onClick={() => handleSaveSlideInterval(slideInterval)}
                            disabled={isSavingInterval}
                            className="px-2.5 py-1 rounded-[3px] bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          >
                            {isSavingInterval ? "Đang lưu..." : "Lưu"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Add Form */}
                  {isEditingSlide ? (
                    <form onSubmit={handleSaveSlide} className="p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-900">
                          {slideForm.id ? "Chỉnh sửa slide banner" : "Thêm slide banner mới"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingSlide(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Hình ảnh Slide Banner (Tỉ lệ khuyến nghị 16:9 hoặc độ phân giải từ 1920x1080) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="https://res.cloudinary.com/..."
                            value={slideForm.image || ""}
                            onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                          <label className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer flex items-center gap-1.5 shrink-0">
                            {isUploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ed3237]" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{isUploading ? "Đang tải ảnh..." : "Tải ảnh lên"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                  const data = await res.json();
                                  if (data.url) {
                                    setSlideForm((prev) => ({ ...prev, image: data.url }));
                                    showNotice("Tải ảnh slide lên Cloudinary thành công!");
                                  } else {
                                    showNotice(data.error || "Lỗi tải ảnh", "error");
                                  }
                                } catch (err: any) {
                                  showNotice(err.message, "error");
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Live Image Preview */}
                        {slideForm.image && (
                          <div className="mt-3 relative w-full h-48 sm:h-64 rounded-[3px] overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                            <Image src={slideForm.image} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 flex flex-col justify-end p-4 text-white">
                              {slideForm.tag && (
                                <span className="inline-block px-2.5 py-0.5 rounded-[2px] bg-[#ed3237] text-white text-[10px] font-black uppercase tracking-wider w-max mb-1 shadow">
                                  {slideForm.tag}
                                </span>
                              )}
                              {slideForm.title && (
                                <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-white drop-shadow-md">
                                  {slideForm.title}
                                </h4>
                              )}
                              {slideForm.subtitle && (
                                <p className="text-xs text-slate-200 mt-0.5 line-clamp-2 max-w-xl">
                                  {slideForm.subtitle}
                                </p>
                              )}
                              {slideForm.stats?.label && slideForm.stats?.value && (
                                <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-white/20 backdrop-blur-xs text-[11px] font-semibold w-max border border-white/20">
                                  <span className="text-slate-200">{slideForm.stats.label}:</span>
                                  <span className="text-amber-300 font-bold">{slideForm.stats.value}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tiêu đề chính của Slide (Title) <span className="font-normal text-slate-400">(Không bắt buộc)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Ví dụ: DỰ ÁN HẦM ĐƯỜNG BỘ QUA ĐÈO CẢ (để trống nếu không dùng)"
                            value={slideForm.title || ""}
                            onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nhãn huy hiệu (Tag)
                          </label>
                          <input
                            type="text"
                            placeholder="Ví dụ: ĐẠI CÔNG TRÌNH QUỐC GIA"
                            value={slideForm.tag || ""}
                            onChange={(e) => setSlideForm({ ...slideForm, tag: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tiêu đề phụ / Mô tả ngắn (Subtitle)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ví dụ: Kỳ tích chinh phục đèo hiểm trở bậc nhất duyên hải miền Trung..."
                          value={slideForm.subtitle || ""}
                          onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>

                      {/* Stats */}
                      <div className="p-3 rounded-[3px] bg-slate-50 border border-slate-200 space-y-2">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Thông số nổi bật hiển thị trên Slide (Tùy chọn)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-500 mb-0.5">Nhãn chỉ số (Label)</label>
                            <input
                              type="text"
                              placeholder="Ví dụ: Chiều dài hầm, Tổng mức đầu tư..."
                              value={slideForm.stats?.label || ""}
                              onChange={(e) =>
                                setSlideForm({
                                  ...slideForm,
                                  stats: {
                                    label: e.target.value,
                                    value: slideForm.stats?.value || "",
                                  },
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#ed3237] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-500 mb-0.5">Giá trị chỉ số (Value)</label>
                            <input
                              type="text"
                              placeholder="Ví dụ: 4.125 m, 3.921 Tỷ VNĐ..."
                              value={slideForm.stats?.value || ""}
                              onChange={(e) =>
                                setSlideForm({
                                  ...slideForm,
                                  stats: {
                                    label: slideForm.stats?.label || "",
                                    value: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-[3px] bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#ed3237] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          Lưu slide
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingSlide(false)}
                          className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {slides.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-[3px] border border-slate-200">
                          Chưa có slide nào. Bấm &quot;Thêm slide mới&quot; để tạo slide banner đầu tiên!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {slides.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-3.5 rounded-[3px] bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
                            >
                              <div>
                                {/* Thumbnail banner preview */}
                                <div className="relative w-full h-40 sm:h-44 rounded-[2px] overflow-hidden bg-slate-900 border border-slate-200">
                                  <Image src={item.image} alt="" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                      <span className="px-2 py-0.5 rounded-[2px] bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold font-mono">
                                        Slide #{idx + 1}
                                      </span>
                                      {item.tag && (
                                        <span className="px-2 py-0.5 rounded-[2px] bg-[#ed3237] text-white text-[10px] font-bold uppercase tracking-wider">
                                          {item.tag}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                                        {item.title || "(Chưa có tiêu đề)"}
                                      </h4>
                                      {item.subtitle && (
                                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                                          {item.subtitle}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {item.stats?.label && item.stats?.value && (
                                  <div className="mt-2.5 px-2.5 py-1 rounded-[2px] bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">{item.stats.label}:</span>
                                    <span className="font-bold text-slate-800">{item.stats.value}</span>
                                  </div>
                                )}
                              </div>

                              {/* Controls */}
                              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                                {/* Move Up / Down Buttons */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Thứ tự:</span>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveSlide(idx, "up")}
                                    className={`p-1 rounded-[2px] border text-xs ${
                                      idx === 0
                                        ? "border-slate-100 text-slate-300 cursor-not-allowed"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                                    }`}
                                    title="Di chuyển lên trước"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === slides.length - 1}
                                    onClick={() => handleMoveSlide(idx, "down")}
                                    className={`p-1 rounded-[2px] border text-xs ${
                                      idx === slides.length - 1
                                        ? "border-slate-100 text-slate-300 cursor-not-allowed"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                                    }`}
                                    title="Di chuyển xuống sau"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Edit & Delete */}
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSlideForm({
                                        ...item,
                                        stats: item.stats || { label: "", value: "" },
                                      });
                                      setIsEditingSlide(true);
                                    }}
                                    className="p-1.5 rounded-[3px] border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                                    title="Chỉnh sửa slide"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlide(item.id)}
                                    className="p-1.5 rounded-[3px] border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                    title="Xóa slide"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: JOBS */}
              {activeTab === "jobs" && (
                <div className="space-y-4 max-w-6xl">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Quản lý tuyển dụng</h2>
                      <p className="text-xs text-slate-500">Thông báo tuyển dụng nhân sự công ty</p>
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
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm vị trí</span>
                      </button>
                    )}
                  </div>

                  {isEditingJob ? (
                    <form onSubmit={handleSaveJob} className="p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-900">
                          {jobForm.id ? "Chỉnh sửa tin tuyển dụng" : "Đăng vị trí mới"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingJob(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Chức danh / Vị trí *</label>
                        <input
                          type="text"
                          required
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Địa điểm</label>
                          <input
                            type="text"
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Mức lương</label>
                          <input
                            type="text"
                            value={jobForm.salary}
                            onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Hạn nộp</label>
                          <input
                            type="text"
                            value={jobForm.deadline}
                            onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                            className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors"
                        >
                          Lưu tin tuyển dụng
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingJob(false)}
                          className="px-3 py-2 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2.5">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-3.5 rounded-[3px] bg-white border border-slate-200 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">{job.department}</span>
                              <span className="text-[11px] text-slate-400">• {job.type}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{job.title}</h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {job.location} | Lương: {job.salary} | Hạn: {job.deadline}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setJobForm(job);
                                setIsEditingJob(true);
                              }}
                              className="p-1.5 rounded-[3px] border border-slate-200 hover:bg-slate-100 text-slate-600"
                              title="Sửa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 rounded-[3px] border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
                <div className="space-y-4 max-w-4xl">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Tải ảnh lên CDN</h2>
                    <p className="text-xs text-slate-500">Tải hình ảnh để nhận liên kết trực tiếp dùng cho bài viết và dự án</p>
                  </div>

                  {/* Uploader Box */}
                  <div className="p-8 rounded-[3px] bg-white border-2 border-dashed border-slate-300 hover:border-[#ed3237] text-center space-y-3 transition-colors">
                    <div className="w-12 h-12 rounded-[3px] bg-red-50 text-[#ed3237] border border-red-100 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Chọn ảnh từ thiết bị</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ PNG, JPG, WEBP</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs cursor-pointer shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Đang xử lý tải lên..." : "Chọn tệp ảnh"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e)} />
                      </label>
                    </div>
                  </div>

                  {/* Upload result */}
                  {uploadedUrl && (
                    <div className="p-4 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-3">
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã tạo liên kết CDN thành công:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={uploadedUrl}
                          className="flex-1 px-3 py-1.5 rounded-[3px] bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedUrl);
                            setCopiedLink(true);
                            showNotice("Đã sao chép link ảnh vào bộ nhớ tạm!");
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-[3px] bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? "Đã copy" : "Copy link"}</span>
                        </button>
                      </div>
                      <div className="relative h-44 w-full sm:w-72 rounded-[2px] overflow-hidden border border-slate-200">
                        <Image src={uploadedUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === "settings" && settings && (
                <div className="space-y-4 max-w-4xl">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Thông tin doanh nghiệp</h2>
                    <p className="text-xs text-slate-500">Cập nhật thông tin công ty hiển thị trên toàn bộ website</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đầy đủ doanh nghiệp</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số thuế (MST)</label>
                        <input
                          type="text"
                          value={settings.taxCode}
                          onChange={(e) => setSettings({ ...settings, taxCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hotline</label>
                        <input
                          type="text"
                          value={settings.hotline}
                          onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Điện thoại</label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-semibold text-xs shadow-2xs transition-colors"
                      >
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Change Password Modal (Light Theme) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[3px] max-w-sm w-full p-5 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Đổi mật khẩu tài khoản
                </h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 pt-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-[3px] bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#ed3237] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-1.5 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-1.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Cập nhật</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
