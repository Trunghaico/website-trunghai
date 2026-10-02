"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "@/types";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
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

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, total]);

  if (!slides || slides.length === 0) return null;

  return (
    <section
      id="home"
      className="relative w-full h-[90vh] sm:h-screen min-h-[650px] max-h-[1100px] overflow-hidden bg-slate-950"
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

                {/* Subtle top shade so transparent header stays legible */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                {/* Subtle bottom shade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
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
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-white/70 hover:bg-[#ed3237] text-slate-800 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xl flex items-center justify-center group active:scale-95"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-white/70 hover:bg-[#ed3237] text-slate-800 hover:text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xl flex items-center justify-center group active:scale-95"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators with Animated Progress Fill */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-3">
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
                  ? "w-12 sm:w-16 h-2.5 bg-white/40 shadow-lg"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/90"
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
