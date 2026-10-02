"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Building2, Send, CheckCircle2 } from "lucide-react";
import { CompanySettings } from "@/types";

interface ContactSectionProps {
  settings: CompanySettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="py-6 sm:py-8 lg:py-10 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Compact & Modern */}
        <div className="space-y-2 max-w-3xl mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
              KẾT NỐI HỢP TÁC
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            LIÊN HỆ VỚI TRUNG HẢI
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Sẵn sàng đồng hành cùng các đối tác, chủ đầu tư kiến tạo những công trình giao thông thế kỷ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-[3px] bg-white border border-slate-200 space-y-5 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Thông Tin Trụ Sở Chính
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-[3px] bg-red-50 text-[#ed3237] shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">Tên Doanh Nghiệp</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{settings.name}</div>
                    <div className="text-[11px] text-[#3e4095] font-semibold mt-0.5">MST: {settings.taxCode}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-[3px] bg-red-50 text-[#ed3237] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">Địa Chỉ Trụ Sở</div>
                    <div className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed">{settings.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-[3px] bg-red-50 text-[#ed3237] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">Điện Thoại / Hotline</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                      {settings.phone} - {settings.hotline}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-[3px] bg-red-50 text-[#ed3237] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">Thư Điện Tử</div>
                    <div className="text-xs sm:text-sm text-slate-700 mt-0.5">{settings.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="rounded-[3px] overflow-hidden border border-slate-200 bg-white p-1.5 shadow-sm">
              <iframe
                title="Bản đồ Trung Hải"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.267868512117!2d106.69089857573617!3d10.790786958925508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cb617cfd1f%3A0xb357492c30076a59!2zNDAgVGjhuqFjaCBUaOG7iyBUaGFuaCwgVMOibiDEkOG7i25oLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: "2px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-[3px] bg-white border border-slate-200 shadow-sm relative">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">Gửi Tin Nhắn / Yêu Cầu Hợp Tác</h3>
              <p className="text-xs text-slate-500 mb-6 font-normal">
                Quý khách hàng hoặc đối tác vui lòng để lại thông điệp, ban lãnh đạo Trung Hải sẽ phản hồi sớm nhất.
              </p>

              {submitted ? (
                <div className="p-6 rounded-[3px] bg-emerald-50 border border-emerald-300 text-center space-y-2.5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-base text-emerald-900">Gửi Tin Nhắn Thành Công!</div>
                  <div className="text-xs text-emerald-700">
                    Cảm ơn quý khách đã liên hệ với Công ty Cổ phần Xây dựng và Đầu tư Trung Hải.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ông/Bà..."
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[3px] bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx..."
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[3px] bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Doanh Nghiệp
                      </label>
                      <input
                        type="email"
                        placeholder="contact@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[3px] bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Chủ Đề
                      </label>
                      <input
                        type="text"
                        placeholder="Hợp tác gói thầu / Tư vấn kỹ thuật"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[3px] bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-[#ed3237] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nội Dung Tin Nhắn *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Mô tả thông tin dự án, yêu cầu kỹ thuật hoặc câu hỏi..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-[#ed3237] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-[3px] bg-gradient-to-r from-[#ed3237] to-[#3e4095] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ed3237]/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Thông Điệp</span>
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
