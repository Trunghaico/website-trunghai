"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight } from "lucide-react";

interface HeaderProps {
  hotline?: string;
}

export default function Header({ hotline = "0908 266 889" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "#home" },
    { name: "Giới thiệu", href: "#about" },
    { name: "Lĩnh vực hoạt động", href: "#services" },
    { name: "Công trình", href: "#projects" },
    { name: "Tin tức", href: "#news" },
    { name: "Tuyển dụng", href: "#recruitment" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-1.5 border-b border-red-500/60 shadow-[0_4px_25px_-3px_rgba(239,68,68,0.25)] translate-y-0"
            : "bg-transparent py-2 sm:py-2.5 border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-2 group shrink-0">
              <div className="relative h-10 w-24 sm:h-12 sm:w-28 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Trung Hải JSC Logo"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-sm"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Strictly No Wrapping */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative whitespace-nowrap px-3 py-1.5 text-sm xl:text-[15px] font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-orange-600 ${
                    isScrolled
                      ? "text-slate-700 hover:bg-orange-50/50"
                      : "text-white drop-shadow hover:text-orange-400"
                  }`}
                >
                  <span>{item.name}</span>
                  {/* Animated underline micro-interaction */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-orange-600 rounded-full transition-all duration-300 ease-out group-hover:w-4/5" />
                </Link>
              ))}
            </nav>

            {/* Compact Call Button with Animation (No "Hotline:" text) */}
            <div className="hidden lg:flex items-center shrink-0">
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                title={`Gọi ngay: ${hotline}`}
                className={`whitespace-nowrap flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 shadow-sm hover:scale-105 group ${
                  isScrolled
                    ? "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200/80 hover:border-orange-600"
                    : "bg-white/20 text-white hover:bg-orange-600 border border-white/30 backdrop-blur-md"
                }`}
              >
                {/* Ringing Phone Icon with Pulse Beacon */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60 animate-ping" />
                  <div
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isScrolled
                        ? "bg-orange-600 text-white group-hover:bg-white group-hover:text-orange-600"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    <Phone className="w-3 h-3 fill-current animate-phone-ring" />
                  </div>
                </div>

                {/* Only Phone Number, No "Hotline:" word */}
                <span className="tracking-tight font-extrabold text-xs">{hotline}</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                className="p-2.5 rounded-full bg-orange-600 text-white shadow-md"
                aria-label="Gọi điện"
              >
                <Phone className="w-4 h-4 fill-current animate-phone-ring" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 rounded-lg transition-colors ${
                  isScrolled
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-white hover:bg-white/20"
                }`}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Glowing blurred red bottom border when scrolled */}
        {isScrolled && (
          <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/20 via-red-600 to-red-500/20 blur-[1px] shadow-[0_0_10px_rgba(239,68,68,0.8)] pointer-events-none" />
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl z-50">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="relative h-12 w-32">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-lg shadow-orange-600/20 transition-all group"
              >
                <Phone className="w-4 h-4 fill-current animate-phone-ring" />
                <span>{hotline}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
