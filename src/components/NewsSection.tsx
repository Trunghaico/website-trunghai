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
    <section id="news" className="py-20 sm:py-28 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
              Thông Tin & Sự Kiện
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              TIN TỨC CÔNG TRÌNH & DOANH NGHIỆP
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Cập nhật những chuyển động mới nhất về tiến độ thi công, phong trào thi đua và hoạt động của Trung Hải.
            </p>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialNews.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group rounded-2xl bg-white border border-slate-200/90 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-orange-600 text-xs font-semibold shadow-sm">
                      {post.categoryName}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:gap-2 transition-all">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 z-10 my-8">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-orange-600 text-slate-600 hover:text-white transition-colors shadow"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold">
                  {selectedPost.categoryName}
                </span>

                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {selectedPost.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                  <span>Ngày đăng: {selectedPost.date}</span>
                  <span>Tác giả: {selectedPost.author}</span>
                </div>

                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden my-4 bg-slate-100">
                  <Image
                    src={selectedPost.thumbnail}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                  <p className="font-semibold text-slate-800">{selectedPost.summary}</p>
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
