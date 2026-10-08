"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { HeroSlide } from "@/types";

interface HeroSliderProps {
  slides: HeroSlide[];
  intervalSeconds?: number;
}

export default function HeroSlider({ slides, intervalSeconds = 5 }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const prevIndexRef = useRef(0);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setDirection("next");
    prevIndexRef.current = current;
    setCurrent((prev) => (prev + 1) % total);
  }, [current, total]);

  const prevSlide = useCallback(() => {
    setDirection("prev");
    prevIndexRef.current = current;
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [current, total]);

  const intervalMs = Math.max(2, intervalSeconds) * 1000;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [nextSlide, total, intervalMs]);

  if (!slides || slides.length === 0) return null;

  return (
    <section
      id="home"
      className="relative w-full h-[52vh] min-h-[380px] max-h-[520px] sm:h-screen sm:min-h-[650px] sm:max-h-[1100px] overflow-hidden bg-slate-950"
    >
      {/* Slides Container with Directional Push Slide & Parallax Zoom */}
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === current;
          const isPrev = index === prevIndexRef.current && !isActive;

          // Compute directional slide transition classes
          let transformClass = "";
          if (isActive) {
            transformClass = "translate-x-0 opacity-100 scale-100 z-10";
          } else if (isPrev) {
            transformClass =
              direction === "next"
                ? "-translate-x-full opacity-0 scale-95 z-0"
                : "translate-x-full opacity-0 scale-95 z-0";
          } else {
            transformClass =
              direction === "next"
                ? "translate-x-full opacity-0 scale-105 z-0"
                : "-translate-x-full opacity-0 scale-105 z-0";
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${transformClass}`}
            >
              {/* Full Bleed Image with Ken-Burns motion on active */}
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className={`relative w-full h-full transition-transform duration-[3000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title || "Công trình Trung Hải"}
                    fill
                    priority={index === 0}
                    className="object-cover object-center select-none"
                  />
                </div>

                {/* Slide Caption Overlay (Tag, Title, Subtitle, Stats) - Giữ ảnh nguyên bản trong trẻo, không phủ lớp xám */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-24 lg:pb-28 pointer-events-none">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-auto">
                    <div
                      className={`max-w-4xl transition-all duration-700 delay-150 transform ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0 pointer-events-none"
                      }`}
                    >
                      {/* Tag badge */}
                      {slide.tag && (
                        <div className="mb-1.5 sm:mb-3">
                          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-[2px] bg-[#ed3237] text-white text-[11px] sm:text-[13px] font-black uppercase tracking-wider shadow-lg shadow-black/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>{slide.tag}</span>
                          </span>
                        </div>
                      )}

                      {/* Main Title */}
                      {slide.title && (
                        <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight sm:leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)] line-clamp-2 sm:line-clamp-none">
                          {slide.title}
                        </h1>
                      )}

                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p className="mt-1 sm:mt-3 text-[11px] sm:text-base lg:text-lg text-white font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_8px_rgb(0_0_0_/_90%)] line-clamp-2 sm:line-clamp-3">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Stats badge & Project Link */}
                      {((slide.stats?.label && slide.stats?.value) || slide.projectLink) && (
                        <div className="mt-2.5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4">
                          {slide.stats?.label && slide.stats?.value && (
                            <div className="inline-flex items-center gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-[3px] bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xl">
                              <span className="text-[11px] sm:text-sm text-slate-300 font-medium">
                                {slide.stats.label}:
                              </span>
                              <span className="text-xs sm:text-base font-black text-amber-400">
                                {slide.stats.value}
                              </span>
                            </div>
                          )}

                          {slide.projectLink && (
                            <Link
                              href={slide.projectLink}
                              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-[3px] bg-[#ed3237] hover:bg-[#d0282d] text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider shadow-xl shadow-[#ed3237]/30 transition-all hover:gap-3"
                            >
                              <span>Khám phá công trình</span>
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-white/70 hover:bg-[#ed3237] text-slate-800 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xl flex items-center justify-center group active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-white/70 hover:bg-[#ed3237] text-slate-800 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xl flex items-center justify-center group active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators with Animated Progress Fill */}
      <div className="absolute bottom-3.5 sm:bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-3">
        {slides.map((_, i) => {
          const isCurrent = i === current;
          return (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? "next" : "prev");
                prevIndexRef.current = current;
                setCurrent(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`relative overflow-hidden transition-all duration-500 rounded-full ${
                isCurrent
                  ? "w-8 sm:w-16 h-1.5 sm:h-2.5 bg-white/40 shadow-lg"
                  : "w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white/50 hover:bg-white/90"
              }`}
            >
              {isCurrent && (
                <span className="absolute inset-0 bg-[#ed3237] rounded-full animate-slide-progress" />
              )}
            </button>
          );
        })}
      </div>

      {/* Accent Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ed3237] via-[#3e4095] to-[#ed3237] z-30" />
    </section>
  );
}
