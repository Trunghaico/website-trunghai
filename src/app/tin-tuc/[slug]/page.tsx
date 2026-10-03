import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  ChevronRight,
  ArrowLeft,
  Home,
} from "lucide-react";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate SEO Metadata dynamically for the article
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.getNewsBySlug(slug);

  if (!post || post.published === false) {
    return {
      title: "Không tìm thấy bài viết | Trung Hải JSC",
    };
  }

  const pageUrl = `https://trunghaico.vn/tin-tuc/${post.slug || post.id}`;

  return {
    title: `${post.title} | Trung Hải JSC`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: pageUrl,
      siteName: "Công ty Cổ phần Xây dựng và Đầu tư Trung Hải",
      images: [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Trung Hải JSC"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.thumbnail],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [post, allNews, settings] = await Promise.all([
    db.getNewsBySlug(slug),
    db.getNews(),
    db.getSettings(),
  ]);

  if (!post || post.published === false) {
    notFound();
  }

  // Get related news (excluding current post and only published posts)
  const relatedNews = allNews
    .filter(
      (n) =>
        n.id !== post.id &&
        (n.slug !== post.slug || !post.slug) &&
        n.published !== false
    )
    .slice(0, 5);

  const currentUrl = `https://trunghaico.vn/tin-tuc/${post.slug || post.id}`;

  // Estimate read time based on word count
  const wordCount = (post.content || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ed3237] selection:text-white">
      {/* Sticky Header */}
      <Header hotline={settings.hotline || settings.phone} />

      {/* Main Container */}
      <main className="flex-1 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-[#ed3237] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/tin-tuc" className="hover:text-[#ed3237] transition-colors">
              Tin tức & Sự kiện
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Detailed Article (8 cols) */}
            <article className="lg:col-span-8 bg-white border border-slate-200/90 rounded-[3px] p-5 sm:p-8 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-[2px] bg-red-50 text-[#ed3237] border border-red-200/80 text-[11px] font-bold uppercase tracking-wider">
                    {post.categoryName}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                  {post.title}
                </h1>

                {/* Meta details bar */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ed3237]" />
                    <span className="font-medium text-slate-700">{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tác giả: <strong className="text-slate-700">{post.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{readTimeMinutes} phút đọc</span>
                  </div>
                </div>
              </div>

              {/* Sapo / Lead Summary Box */}
              {post.summary && (
                <div className="p-4 sm:p-5 rounded-[3px] bg-slate-50 border-l-4 border-[#ed3237] text-slate-700 text-sm sm:text-base font-medium leading-relaxed italic shadow-2xs">
                  {post.summary}
                </div>
              )}

              {/* Featured Thumbnail Image */}
              <div className="relative w-full aspect-[16/9] rounded-[3px] overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Article Rich Text Content (rendered from Quill 2.0 or text) */}
              <div className="article-content text-slate-800 text-sm sm:text-base leading-relaxed pt-2">
                {post.content && post.content.includes("<") ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="prose prose-slate max-w-none space-y-4 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-6 [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>blockquote]:border-l-4 [&>blockquote]:border-[#ed3237] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>img]:rounded-[3px] [&>img]:my-4 [&>img]:border [&>img]:border-slate-200"
                  />
                ) : (
                  <div className="space-y-4">
                    {(post.content || "").split("\n\n").map((para, i) => (
                      <p key={i} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Author & Signature Card */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[2px] bg-[#3e4095] text-white flex items-center justify-center font-bold text-xs">
                    TH
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Ban Biên Tập & Truyền Thông</div>
                    <div className="text-[11px] text-slate-500">Công ty Cổ phần Xây dựng và Đầu tư Trung Hải</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Bản quyền © Trung Hải JSC
                </div>
              </div>

              {/* Social Sharing Bar */}
              <ShareButtons title={post.title} url={currentUrl} />

              {/* Back button */}
              <div className="pt-2">
                <Link
                  href="/#news"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#ed3237] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại danh mục tin tức</span>
                </Link>
              </div>
            </article>

            {/* RIGHT COLUMN: Related Articles & Contact Widget (4 cols) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Related News Box */}
              <div className="bg-white border border-slate-200/90 rounded-[3px] p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-2 h-2 rounded-[1px] bg-[#ed3237]" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                    Bài Viết Liên Quan
                  </h3>
                </div>

                {relatedNews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">Không có bài viết liên quan khác.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {relatedNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/tin-tuc/${item.slug || item.id}`}
                        className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 group block transition-all"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-[3px] overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                          />
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#3e4095]">
                            {item.categoryName}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#ed3237] transition-colors line-clamp-2 leading-snug mt-0.5">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <Calendar className="w-3 h-3 text-[#ed3237]" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
