"use client";

import { useState } from "react";
import { MapPin, DollarSign, Clock, ChevronDown, CheckCircle, Send } from "lucide-react";
import { JobPosting } from "@/types";

interface RecruitmentSectionProps {
  initialJobs: JobPosting[];
}

export default function RecruitmentSection({ initialJobs }: RecruitmentSectionProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(initialJobs[0]?.id || null);
  const [applied, setApplied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    job: initialJobs[0]?.title || "",
    cvNote: "",
  });

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setFormData({ name: "", phone: "", email: "", job: "", cvNote: "" });
    }, 4000);
  };

  return (
    <section id="recruitment" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
            Gia Nhập Đội Ngũ Trung Hải
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            CƠ HỘI NGHỀ NGHIỆP & PHÁT TRIỂN
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Chúng tôi luôn chào đón những kỹ sư đam mê, bản lĩnh, sẵn sàng chinh phục những đại công trình giao thông trọng điểm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Job Openings List */}
          <div className="lg:col-span-7 space-y-4">
            {initialJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "bg-white border-orange-500/60 shadow-xl shadow-orange-500/5"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Job Header */}
                  <div
                    onClick={() => toggleExpand(job.id)}
                    className="p-6 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">
                          {job.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{job.department}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-orange-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl transition-transform duration-300 shrink-0 ${
                        isExpanded ? "rotate-180 bg-orange-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 text-sm text-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">Mô tả công việc:</h4>
                        <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                          {job.description.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">Yêu cầu ứng viên:</h4>
                        <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                          {job.requirements.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">Quyền lợi & Đãi ngộ:</h4>
                        <ul className="space-y-1.5 list-disc list-inside text-emerald-700 font-medium">
                          {job.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          Hạn nộp hồ sơ: {job.deadline}
                        </span>
                        <button
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, job: job.title }));
                            const formEl = document.getElementById("apply-form");
                            formEl?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-sm transition-colors"
                        >
                          Ứng Tuyển Vị Trí Này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Application Form */}
          <div id="apply-form" className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nộp Hồ Sơ Trực Tuyến</h3>
              <p className="text-xs text-slate-500 mb-6">
                Điền thông tin và kinh nghiệm của bạn, phòng Nhân sự Trung Hải sẽ liên hệ lại trong vòng 48 giờ.
              </p>

              {applied ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900">Gửi Hồ Sơ Thành Công!</div>
                  <div className="text-xs text-emerald-700">
                    Cảm ơn bạn đã quan tâm đến cơ hội nghề nghiệp tại Trung Hải. Ban nhân sự sẽ sớm phản hồi.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0908xxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Liên Hệ *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vị Trí Ứng Tuyển *
                    </label>
                    <select
                      value={formData.job}
                      onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                    >
                      {initialJobs.map((j) => (
                        <option key={j.id} value={j.title}>
                          {j.title}
                        </option>
                      ))}
                      <option value="Khác">Vị trí khác / Ứng tuyển tự do</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link CV (Google Drive/Dropbox) hoặc Giới thiệu tóm tắt *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Dán link CV hoặc ghi tóm tắt số năm kinh nghiệm thi công cầu đường/hầm..."
                      value={formData.cvNote}
                      onChange={(e) => setFormData({ ...formData, cvNote: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Nộp Đơn Ứng Tuyển</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
