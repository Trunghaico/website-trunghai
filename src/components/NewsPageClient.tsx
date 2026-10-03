"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Newspaper,
  ChevronRight,
  Home,
  Flame,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  Briefcase,
  ShieldCheck,
  Building2,
  Sparkles,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import { NewsPost } from "@/types";

interface NewsPageClientProps {
  initialNews: NewsPost[];
}

const CATEGORIES = [
  { id: "all", label: "Tất cả tin tức", icon: Newspaper },
  { id: "du-an", label: "Tin Dự Án", icon: Building2 },
  { id: "doanh-nghiep", label: "Doanh Nghiệp", icon: Sparkles },
  { id: "an-toan", label: "An Toàn Lao Động", icon: ShieldCheck },
  { id: "tuyen-dung", label: "Tuyển Dụng", icon: Briefcase },
];

const SORT_OPTIONS: { id: "newest" | "featured" | "title"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "newest", label: "Mới nhất", icon: Calendar },
  { id: "featured", label: "Nổi bật", icon: Flame },
  { id: "title", label: "Tiêu đề A-Z", icon: SlidersHorizontal },
];

interface DropdownOption<T extends string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

function CustomDropdown<T extends string>({
  value,
  options,
  onChange,
  leadingIcon: DefaultIcon,
  className = "",
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (val: T) => void;
  leadingIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];
  const CurrentIcon = selectedOption?.icon || DefaultIcon;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-10 px-3.5 rounded-[3px] bg-white border text-xs font-semibold flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-2xs select-none ${
          isOpen
            ? "border-[#ed3237] ring-2 ring-[#ed3237]/15 text-slate-900"
            : "border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5 text-[#ed3237] shrink-0" />}
          <span className="truncate">{selectedOption?.label}</span>
          {typeof selectedOption?.count === "number" && (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold shrink-0">
              {selectedOption.count}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ed3237]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-full min-w-[210px] bg-white rounded-[3px] border border-slate-200 shadow-xl shadow-slate-900/10 py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.id === value;
            const ItemIcon = opt.icon || DefaultIcon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-red-50 text-[#ed3237] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {ItemIcon && (
                    <ItemIcon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-[#ed3237]" : "text-slate-400"
                      }`}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {typeof opt.count === "number" && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-red-200/60 text-[#ed3237]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {opt.count}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ed3237]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ITEMS_PER_PAGE = 9;

export default function NewsPageClient({ initialNews }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "featured" | "title">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  // Lọc chỉ lấy các bài viết công khai (published !== false)
  const publicNews = useMemo(() => {
    return initialNews.filter((n) => n.published !== false);
  }, [initialNews]);

  // Options cho Dropdown Chuyên mục (tự động nhận diện cả các chuyên mục mới được tạo)
  const categoryOptions = useMemo(() => {
    const dynamicCats: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];
    publicNews.forEach((n) => {
      if (
        n.category &&
        n.category !== "all" &&
        !CATEGORIES.some((c) => c.id === n.category) &&
        !dynamicCats.some((c) => c.id === n.category)
      ) {
        dynamicCats.push({
          id: n.category,
          label: n.categoryName || n.category,
          icon: Newspaper,
        });
      }
    });

    const allCategories = [...CATEGORIES, ...dynamicCats];

    return allCategories.map((cat) => {
      const count =
        cat.id === "all"
          ? publicNews.length
          : publicNews.filter((n) => n.category === cat.id).length;
      return {
        id: cat.id,
        label: cat.label,
        count,
        icon: cat.icon,
      };
    });
  }, [publicNews]);

  // Bài viết tiêu điểm (Featured Post)
  const featuredPost = useMemo(() => {
    const explicitlyFeatured = publicNews.find((n) => n.featured);
    return explicitlyFeatured || publicNews[0];
  }, [publicNews]);

  // Bộ lọc chuyên mục & tìm kiếm & sắp xếp
  const filteredNews = useMemo(() => {
    let result = publicNews.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });

    if (sortBy === "featured") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, "vi"));
    } else {
      // Default: newest by date/id
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [publicNews, selectedCategory, searchQuery, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pt-24 sm:pt-28 pb-16 sm:pb-20 selection:bg-[#ed3237] selection:text-white">
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
            <li className="text-[#ed3237] font-semibold">Tin tức & Sự kiện</li>
          </ol>
        </nav>

        {/* 1. BÀI VIẾT TIÊU ĐIỂM (FEATURED ARTICLE) */}
        {featuredPost && !searchQuery && (
          <section className="mb-8 sm:mb-10">
            <div className="bg-white rounded-[3px] border border-slate-200 shadow-md overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Image Section */}
                <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[380px] overflow-hidden bg-slate-900">
                  <Image
                    src={featuredPost.thumbnail}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-[2px] bg-[#ed3237] text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 animate-pulse" />
                      <span>Bài viết tiêu điểm</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-[2px] bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
                      {featuredPost.categoryName}
                    </span>
                  </div>
                </div>

                {/* Text Info Section */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="hidden lg:flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-[2px] bg-[#ed3237]/10 text-[#ed3237] text-xs font-black uppercase tracking-wider">
                        {featuredPost.categoryName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                        <span>{featuredPost.date}</span>
                      </span>
                    </div>

                    <Link href={`/tin-tuc/${featuredPost.slug || featuredPost.id}`}>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#ed3237] transition-colors leading-snug">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    <p className="mt-3.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{featuredPost.author || "Ban Truyền thông"}</span>
                    </div>

                    <Link
                      href={`/tin-tuc/${featuredPost.slug || featuredPost.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all group-hover:gap-3"
                    >
                      <span>Đọc toàn bộ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. TOOLBAR: TÌM KIẾM, CHUYÊN MỤC & SẮP XẾP */}
        <section ref={listRef} className="mb-8">
          <div className="bg-white rounded-[3px] border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, tin dự án..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-10 pl-9 pr-7 rounded-[3px] bg-white border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ed3237] focus:ring-2 focus:ring-[#ed3237]/15 hover:border-slate-300 transition-all shadow-2xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Controls: Custom Category Dropdown + Custom Sort Dropdown */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
                {/* Category Dropdown */}
                <CustomDropdown
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  leadingIcon={Filter}
                  className="flex-1 sm:flex-none sm:w-56"
                />

                {/* Sort Dropdown */}
                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  leadingIcon={SlidersHorizontal}
                  className="shrink-0 w-36 sm:w-40"
                />
              </div>
            </div>

            {/* Active filter summary bar */}
            {(selectedCategory !== "all" || searchQuery) && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Đang hiển thị <strong>{filteredNews.length}</strong> bài viết</span>
                  {selectedCategory !== "all" && (
                    <span className="px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      Chuyên mục: {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      Từ khóa: &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[#ed3237] hover:underline font-semibold cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 3. DANH SÁCH BÀI VIẾT (NEWS GRID) */}
        <section className="mb-16">
          {filteredNews.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[3px] border border-slate-200 p-8 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Newspaper className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Không có bài viết nào khớp với từ khóa tìm kiếm hoặc chuyên mục bạn vừa chọn.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem tất cả bài viết</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {paginatedNews.map((post) => (
                  <article
                    key={post.id}
                    className="group rounded-[3px] bg-white border border-slate-200 hover:border-[#ed3237]/60 hover:shadow-xl hover:shadow-[#ed3237]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs"
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        {/* Gradient overlay on thumbnail */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-[2px] bg-[#3e4095] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                            {post.categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Article Body */}
                      <div className="p-5">
                        {/* Metadata row */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                            <span>{post.date}</span>
                          </span>
                          {post.author && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="inline-flex items-center gap-1 truncate font-medium">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                <span className="truncate">{post.author}</span>
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title Link */}
                        <Link href={`/tin-tuc/${post.slug || post.id}`} className="block">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Summary */}
                        <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/tin-tuc/${post.slug || post.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ed3237] group-hover:gap-2.5 transition-all"
                      >
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[11px] text-slate-400 font-medium">Trung Hải JSC</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-3 py-2 rounded-[3px] border text-xs font-semibold flex items-center gap-1 transition-all ${
                      currentPage === 1
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#ed3237] text-white shadow-sm shadow-[#ed3237]/30"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-3 py-2 rounded-[3px] border text-xs font-semibold flex items-center gap-1 transition-all ${
                      currentPage === totalPages
                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                    }`}
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
