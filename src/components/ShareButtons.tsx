"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[3px] bg-slate-50 border border-slate-200/90">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
        <Share2 className="w-4 h-4 text-[#ed3237]" />
        <span>Chia sẻ bài viết:</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleShareFacebook}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#1877F2] hover:bg-[#0c63d4] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copied ? "Đã copy link!" : "Sao chép link"}</span>
        </button>
      </div>
    </div>
  );
}
