"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, User, ArrowRight, X } from "lucide-react";
import { NewsPost } from "@/types";

interface NewsSectionProps {
  initialNews: NewsPost[];
}

export default function NewsSection({ initialNews }: NewsSectionProps) {
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

  return (
    <section id="news" className="py-6 sm:py-8 lg:py-10 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Compact & Modern with Brand Colors */}
        <div className="space-y-2 max-w-3xl mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#ed3237] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-[#ed3237]/30">
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
          {initialNews.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group rounded-[3px] bg-white border border-slate-200 hover:border-[#ed3237]/60 hover:shadow-xl hover:shadow-[#ed3237]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
            >
              <div>
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.thumbnail}
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
                      <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#ed3237] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ed3237] group-hover:gap-2 transition-all">
                  <span>ĐỌC TIẾP</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Post Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          />
          <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
            <div className="relative w-full max-w-3xl rounded-[3px] bg-white border border-slate-200 shadow-2xl p-5 sm:p-7 z-10 my-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 p-2 rounded-[3px] bg-slate-100 hover:bg-[#ed3237] text-slate-600 hover:text-white transition-colors shadow"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-[2px] bg-red-50 text-[#ed3237] border border-red-200 text-xs font-bold">
                  {selectedPost.categoryName}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedPost.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span className="text-[#3e4095] font-semibold">Ngày đăng: {selectedPost.date}</span>
                  <span>Tác giả: {selectedPost.author}</span>
                </div>

                <div className="relative h-60 sm:h-72 w-full rounded-[3px] overflow-hidden my-3 bg-slate-100">
                  <Image
                    src={selectedPost.thumbnail}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 font-normal">
                  <p className="font-semibold text-slate-900">{selectedPost.summary}</p>
                  <p>{selectedPost.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
