"use client";

import { useState, useRef } from "react";
import { Award, Compass, HardHat, TrendingUp } from "lucide-react";

// Interactive 3D Stat Card Component with Mouse-Tracking Tilt & Parallax Layers
function Stat3DItem({
  item,
}: {
  item: {
    icon: any;
    value: string;
    label: string;
    desc: string;
  };
}) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle & elegant 3D tilt calculation (-3.5 to +3.5 degrees)
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.18 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const shadowX = -rotate.y * 0.8;
  const shadowY = rotate.x * 0.8 + 8;

  return (
    <div
      style={{ perspective: "1000px" }}
      className={`relative ${isHovered ? "z-30" : "z-10"}`}
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(8px) scale3d(1.012, 1.012, 1.012)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)",
          boxShadow: isHovered
            ? `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 18px -4px rgba(237, 50, 55, 0.2), 0 6px 14px -3px rgba(15, 23, 42, 0.08)`
            : "none",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.15s ease-out"
            : "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`p-4 sm:p-5 bg-white rounded-[3px] border border-transparent transition-colors duration-200 cursor-pointer overflow-hidden relative select-none ${
          isHovered ? "!border-[#ed3237]/50 bg-white" : "hover:bg-red-50/20"
        }`}
      >
        {/* Dynamic Light Sheen / Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(237, 50, 55, 0.2) 0%, rgba(255, 255, 255, 0.35) 35%, transparent 70%)`,
          }}
        />

        {/* 3D Top Row: Icon + Value */}
        <div
          className="flex items-center gap-3 mb-2"
          style={{
            transform: isHovered ? "translateZ(12px)" : "translateZ(0px)",
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className={`p-2 rounded-[3px] transition-all duration-300 ${
              isHovered
                ? "bg-[#ed3237] text-white shadow-md shadow-[#ed3237]/30 scale-106"
                : "bg-red-50 text-[#ed3237]"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-200 ${
              isHovered ? "text-[#ed3237]" : "text-slate-900"
            }`}
          >
            {item.value}
          </div>
        </div>

        {/* 3D Title */}
        <div
          className="text-sm sm:text-base font-bold text-slate-800"
          style={{
            transform: isHovered ? "translateZ(10px)" : "translateZ(0px)",
            transition: "transform 0.2s ease-out",
          }}
        >
          {item.label}
        </div>

        {/* 3D Subtitle / Description */}
        <div
          className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-normal"
          style={{
            transform: isHovered ? "translateZ(8px)" : "translateZ(0px)",
            transition: "transform 0.2s ease-out",
          }}
        >
          {item.desc}
        </div>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const stats = [
    {
      icon: Award,
      value: "12+",
      label: "Năm Kinh Nghiệm",
      desc: "Xây dựng hạ tầng giao thông trọng điểm",
    },
    {
      icon: Compass,
      value: "30+",
      label: "Km Hầm & Cầu Đường",
      desc: "Chinh phục địa hình hiểm trở bậc nhất",
    },
    {
      icon: HardHat,
      value: "100%",
      label: "An Toàn Tuyệt Đối",
      desc: "Quy chuẩn an toàn lao động quốc tế",
    },
    {
      icon: TrendingUp,
      value: "5.000+",
      label: "Tỷ Đồng Gói Thầu",
      desc: "Tổng giá trị các công trình đã hoàn thành",
    },
  ];

  return (
    <section className="relative z-20 py-3 sm:py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 bg-white border border-slate-200 rounded-[3px] shadow-sm divide-x divide-y lg:divide-y-0 divide-slate-200">
        {stats.map((item, idx) => (
          <div key={idx} className={`reveal-on-scroll delay-${(idx + 1) * 100}`}>
            <Stat3DItem item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
