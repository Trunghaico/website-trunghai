"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ChevronDown,
  Search,
  RotateCcw,
  CheckCircle2,
  Building2,
  ChevronRight,
  Home,
  Calendar,
  SlidersHorizontal,
  Mail,
  Copy,
  Check,
  Send,
} from "lucide-react";
import { JobPosting, CompanySettings } from "@/types";

interface RecruitmentPageClientProps {
  initialJobs: JobPosting[];
  settings: CompanySettings;
}

const HR_EMAIL = "tuyendung@trunghaico.vn";

export default function RecruitmentPageClient({
  initialJobs,
  settings,
}: RecruitmentPageClientProps) {
  // Bộ lọc & Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Accordion mở/đóng chi tiết bài đăng (mặc định mở vị trí đầu tiên)
  const [expandedJobId, setExpandedJobId] = useState<string | null>(
    initialJobs[0]?.id || null
  );

  // Trạng thái sao chép email
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (email = HR_EMAIL) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Danh sách phòng ban và địa điểm duy nhất
  const departments = useMemo(() => {
    return Array.from(
      new Set(initialJobs.map((j) => j.department).filter(Boolean))
    );
  }, [initialJobs]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(initialJobs.map((j) => j.location).filter(Boolean))
    );
  }, [initialJobs]);

  // Lọc bài đăng
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      if (!job.active) return false;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        (job.department && job.department.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q) ||
        job.description.some((d) => d.toLowerCase().includes(q)) ||
        job.requirements.some((r) => r.toLowerCase().includes(q));

      const matchesDepartment =
        selectedDepartment === "all" || job.department === selectedDepartment;

      const matchesLocation =
        selectedLocation === "all" || job.location === selectedLocation;

      const matchesType =
        selectedType === "all" || job.type === selectedType;

      return matchesSearch && matchesDepartment && matchesLocation && matchesType;
    });
  }, [
    initialJobs,
    searchTerm,
    selectedDepartment,
    selectedLocation,
    selectedType,
  ]);

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDepartment !== "all" ||
    selectedLocation !== "all" ||
    selectedType !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedLocation("all");
    setSelectedType("all");
  };

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

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
            <li className="text-[#ed3237] font-semibold">Tuyển dụng</li>
          </ol>
        </nav>

        {/* Page Title & Count Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-red-50 border border-red-200/80 text-[#ed3237] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Cơ hội việc làm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              DANH SÁCH VỊ TRÍ TUYỂN DỤNG
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 bg-white px-4 py-2 rounded-[3px] border border-slate-200 shadow-2xs self-start md:self-auto">
            Hiện có{" "}
            <span className="font-extrabold text-[#ed3237] text-base">
              {filteredJobs.length}
            </span>{" "}
            vị trí đang mở
          </div>
        </div>

        {/* Khối nổi bật: Hướng dẫn nộp CV qua Email trực tiếp */}
        <div className="mb-8 p-4 sm:p-5 rounded-[3px] bg-gradient-to-r from-red-50/90 via-white to-red-50/70 border-l-4 border-l-[#ed3237] border-y border-r border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-[3px] bg-[#ed3237] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Ứng tuyển trực tiếp qua Email Ban Nhân Sự
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="text-xs text-slate-700">Email nhận CV:</span>
                <a
                  href={`mailto:${HR_EMAIL}?subject=Ứng tuyển việc làm - Trung Hải JSC`}
                  className="text-base sm:text-lg font-extrabold text-[#ed3237] hover:underline cursor-pointer"
                >
                  {HR_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleCopyEmail(HR_EMAIL)}
              className="px-3.5 py-2 rounded-[3px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép email</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sao chép email</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${HR_EMAIL}?subject=Ứng tuyển việc làm - Trung Hải JSC`}
              className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi thư ứng tuyển</span>
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-[3px] bg-white border border-slate-200 shadow-2xs mb-8 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm vị trí, kỹ năng, chức danh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-[3px] border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237]"
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] bg-white cursor-pointer"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] bg-white cursor-pointer"
              >
                <option value="all">Tất cả địa điểm</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Dropdown */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[3px] border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] bg-white cursor-pointer"
              >
                <option value="all">Tất cả hình thức</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Theo dự án">Theo dự án</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ed3237]" />
                Đang áp dụng bộ lọc tùy chỉnh
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-[#ed3237] hover:text-[#d0282d] font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            </div>
          )}
        </div>

        {/* Job Listings List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-[3px] border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-slate-800 font-bold text-lg">
              Không tìm thấy vị trí tuyển dụng phù hợp
            </div>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Không có bài đăng nào khớp với từ khóa hoặc bộ lọc đã chọn.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 rounded-[3px] bg-[#ed3237] text-white text-xs font-semibold hover:bg-[#d0282d] transition-colors cursor-pointer"
            >
              Xem tất cả vị trí tuyển dụng
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-[3px] border transition-all duration-200 overflow-hidden bg-white ${
                    isExpanded
                      ? "border-[#ed3237]/60 shadow-md shadow-[#ed3237]/5 ring-1 ring-[#ed3237]/20"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  {/* Job Header Bar */}
                  <div
                    onClick={() => toggleExpand(job.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none group"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-[2px] bg-red-100 text-[#ed3237] text-xs font-bold">
                          Đang tuyển
                        </span>
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#3e4095]/10 text-[#3e4095] text-xs font-bold">
                          {job.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {job.department}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors">
                        {job.title}
                      </h2>

                      <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#ed3237] shrink-0" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5 shrink-0" />
                          <span>{job.salary}</span>
                        </span>
                        {job.workingHours && (
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-[#3e4095] shrink-0" />
                            <span>{job.workingHours}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Hạn nộp: {job.deadline}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                      <span className="text-xs font-semibold text-[#ed3237] group-hover:underline">
                        {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                      </span>
                      <div
                        className={`p-2 rounded-[3px] transition-transform duration-200 ${
                          isExpanded
                            ? "rotate-180 bg-red-50 text-[#ed3237]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Job Details */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 space-y-6 text-sm text-slate-700 bg-slate-50/50">
                      {/* Mô tả công việc */}
                      {job.description && job.description.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                            <span className="w-2 h-2 rounded-full bg-[#ed3237]" />
                            <span>Mô tả công việc:</span>
                          </h3>
                          <ul className="space-y-2 list-none text-slate-600">
                            {job.description.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="text-[#ed3237] mt-1 shrink-0 font-bold">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Yêu cầu ứng viên */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                            <span className="w-2 h-2 rounded-full bg-[#3e4095]" />
                            <span>Yêu cầu ứng viên:</span>
                          </h3>
                          <ul className="space-y-2 list-none text-slate-600">
                            {job.requirements.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="text-[#3e4095] mt-1 shrink-0 font-bold">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Quyền lợi & Đãi ngộ */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-sm sm:text-base">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Quyền lợi & Chế độ đãi ngộ:</span>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
                            {job.benefits.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2.5 rounded-[3px] bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs sm:text-sm"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Khối nổi bật gửi CV qua email */}
                      <div className="p-4 sm:p-5 rounded-[3px] bg-gradient-to-br from-red-50/80 via-white to-red-50/50 border border-[#ed3237]/35 shadow-2xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-[3px] bg-[#ed3237] text-white flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 font-medium">
                                Nộp hồ sơ ứng tuyển vị trí này qua email:
                              </div>
                              <a
                                href={`mailto:${HR_EMAIL}?subject=Ứng tuyển ${encodeURIComponent(job.title)} - [Họ và tên]`}
                                className="text-base sm:text-lg font-extrabold text-[#ed3237] hover:underline cursor-pointer"
                              >
                                {HR_EMAIL}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(HR_EMAIL)}
                              className="px-3.5 py-1.5 rounded-[3px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {copiedEmail ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Chép email</span>
                                </>
                              )}
                            </button>
                            <a
                              href={`mailto:${HR_EMAIL}?subject=Ứng tuyển ${encodeURIComponent(job.title)} - [Họ và tên]`}
                              className="px-4 py-2 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Soạn Email Ứng Tuyển</span>
                            </a>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                          <div>
                            💡 <strong>Gợi ý tiêu đề email:</strong>{" "}
                            <code className="px-1.5 py-0.5 rounded-[2px] bg-red-100/70 text-[#ed3237] font-semibold">
                              [Họ và tên] - Ứng tuyển {job.title}
                            </code>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                            <span>
                              Hạn tiếp nhận:{" "}
                              <strong className="text-slate-800">
                                {job.deadline}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
