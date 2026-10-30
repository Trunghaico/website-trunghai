"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { NewsPost } from "@/types";

interface NewsSectionProps {
  initialNews: NewsPost[];
}

// Helper chuyển đổi chuỗi ngày sang timestamp (hỗ trợ DD/MM/YYYY hoặc ISO) để sắp xếp bài mới nhất
function parseDateToTime(dateStr?: string): number {
  if (!dateStr) return 0;
  const dmyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  }
  const timestamp = Date.parse(dateStr);
  return isNaN(timestamp) ? 0 : timestamp;
}

export default function NewsSection({ initialNews }: NewsSectionProps) {
  // 1. Chỉ lấy các bài viết đã công khai (published !== false)
  const publishedNews = initialNews.filter((post) => post.published !== false);

  // 2. Ưu tiên các bài viết được bật "Hiển thị trên trang chủ" (featured === true)
  const hasFeatured = publishedNews.some((post) => Boolean(post.featured));
  const candidateNews = hasFeatured
    ? publishedNews.filter((post) => Boolean(post.featured))
    : publishedNews;

  // 3. Sắp xếp tin tức mới nhất lên đầu theo ngày đăng hoặc id
  const sortedNews = [...candidateNews].sort((a, b) => {
    const timeA = parseDateToTime(a.date);
    const timeB = parseDateToTime(b.date);
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return (b.id || "").localeCompare(a.id || "");
  });

  // 4. Giới hạn hiển thị đúng 6 tin tức mới nhất ngoài trang chủ (tránh bị dài trang)
  const displayNews = sortedNews.slice(0, 6);

  if (displayNews.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-6 sm:py-8 lg:py-10 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Compact & Modern with Brand Colors */}
        <div className="space-y-2 max-w-3xl mb-6 sm:mb-8 reveal-on-scroll">
          <div>
            <span className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#3e4095] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#3e4095]/30">
              THÔNG TIN & SỰ KIỆN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            TIN TỨC CÔNG TRÌNH & DOANH NGHIỆP
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Cập nhật những chuyển động mới nhất về tiến độ thi công, phong trào thi đua và hoạt động của Trung Hải.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayNews.map((post, idx) => (
            <Link
              key={post.id}
              href={`/tin-tuc/${post.slug || post.id}`}
              className={`group rounded-[3px] bg-white border border-slate-200 hover:border-[#3e4095]/60 hover:shadow-xl hover:shadow-[#3e4095]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm reveal-on-scroll delay-${((idx % 3) + 1) * 100}`}
            >
              <div>
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.thumbnail || "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-[2px] bg-[#3e4095] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      {post.categoryName}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-4 text-[11px] sm:text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-[#3e4095] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#3e4095]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#3e4095] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3e4095] group-hover:gap-2 transition-all">
                  <span>ĐỌC TIẾP</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-white border border-slate-300 hover:border-[#3e4095] text-slate-700 hover:text-[#3e4095] text-xs font-bold uppercase tracking-wider shadow-2xs hover:shadow transition-all group"
          >
            <span>Xem tất cả tin tức & sự kiện</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
