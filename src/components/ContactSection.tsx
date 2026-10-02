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
    <section id="contact" className="py-20 sm:py-28 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
            Kết Nối Hợp Tác
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            LIÊN HỆ VỚI TRUNG HẢI
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Sẵn sàng đồng hành cùng các đối tác, chủ đầu tư kiến tạo những công trình giao thông thế kỷ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Thông Tin Trụ Sở Chính
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 font-semibold">Tên Doanh Nghiệp</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{settings.name}</div>
                    <div className="text-xs text-orange-600 font-medium mt-1">MST: {settings.taxCode}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 font-semibold">Địa Chỉ Trụ Sở</div>
                    <div className="text-sm text-slate-700 mt-0.5 leading-relaxed">{settings.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 font-semibold">Điện Thoại / Hotline</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {settings.phone} - {settings.hotline}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 font-semibold">Thư Điện Tử</div>
                    <div className="text-sm text-slate-700 mt-0.5">{settings.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xl">
              <iframe
                title="Bản đồ Trung Hải"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.267868512117!2d106.69089857573617!3d10.790786958925508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cb617cfd1f%3A0xb357492c30076a59!2zNDAgVGjhuqFjaCBUaOG7iyBUaGFuaCwgVMOibiDEkOG7i25oLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "1rem" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Gửi Tin Nhắn / Yêu Cầu Hợp Tác</h3>
              <p className="text-sm text-slate-500 mb-8 font-normal">
                Quý khách hàng hoặc đối tác vui lòng để lại thông điệp, ban lãnh đạo Trung Hải sẽ phản hồi sớm nhất.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="font-bold text-lg text-emerald-900">Gửi Tin Nhắn Thành Công!</div>
                  <div className="text-sm text-emerald-700">
                    Cảm ơn quý khách đã liên hệ với Công ty Cổ phần Xây dựng và Đầu tư Trung Hải.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ông/Bà..."
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx..."
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Doanh Nghiệp
                      </label>
                      <input
                        type="email"
                        placeholder="contact@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Chủ Đề
                      </label>
                      <input
                        type="text"
                        placeholder="Hợp tác gói thầu / Tư vấn kỹ thuật"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nội Dung Tin Nhắn *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Mô tả thông tin dự án, yêu cầu kỹ thuật hoặc câu hỏi..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
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
