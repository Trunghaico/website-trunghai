"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronRight } from "lucide-react";

interface HeaderProps {
  hotline?: string;
  phoneDisplay?: string;
  address?: string;
  workingHours?: string;
  email?: string;
}

export default function Header({
  hotline = "0966.700.045",
  phoneDisplay = "0966.700.045",
  address = "12-14 Đường D5, Khu phố 12, Phường An Khánh, Tp. Hồ Chí Minh",
  workingHours = "Thứ 2 – Thứ 7: 08:00 – 17:30",
  email = "info@trunghaico.vn",
}: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    { name: "Trang chủ", href: "/" },
    { name: "Giới thiệu", href: "/gioi-thieu" },
    { name: "Lĩnh vực hoạt động", href: "/#services" },
    { name: "Công trình", href: "/cong-trinh" },
    { name: "Tin tức", href: "/tin-tuc" },
  ];

  // Header should be solid on subpages or when scrolled
  const isSolid = isScrolled || (pathname !== "/" && pathname !== "");

  const phoneParts = phoneDisplay.split("/").map((p) => p.trim());

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
        {/* Topbar: Only appears on Homepage, disappears smoothly on scroll */}
        {isHomePage && (
          <div
            className={`w-full bg-[#18202c] text-slate-300 text-xs sm:text-[13px] border-b border-white/[0.08] transition-all duration-300 ease-in-out overflow-hidden z-20 ${
              isScrolled
                ? "max-h-0 opacity-0 -translate-y-full py-0 border-b-0 pointer-events-none"
                : "max-h-12 opacity-100 translate-y-0 py-1.5 sm:py-2"
            }`}
          >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Left Group: Address & Working Hours */}
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <svg
                    className="w-3.5 h-3.5 text-[#f59e0b] fill-current shrink-0"
                    viewBox="0 0 24 24"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    aria-hidden="true"
                  >
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>
                  <span className="truncate">{address}</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0 text-slate-300/90">
                  <svg
                    className="w-3.5 h-3.5 text-[#f59e0b] fill-current shrink-0"
                    viewBox="0 0 24 24"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 5a1 1 0 1 0-2 0v4.586l3.293 3.293a1 1 0 0 0 1.414-1.414L13 10.586V7z" />
                  </svg>
                  <span>{workingHours}</span>
                </div>
              </div>

              {/* Right Group: Phone Numbers & Email */}
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b] shrink-0" />
                  <div className="flex items-center gap-2">
                    {phoneParts.map((item, idx) => (
                      <span key={idx} className="flex items-center gap-2">
                        {idx > 0 && <span className="text-slate-500 font-normal">/</span>}
                        <a
                          href={`tel:${item.replace(/[^0-9]/g, "")}`}
                          className="hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-[#f59e0b] fill-current shrink-0"
                    viewBox="0 0 24 24"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    aria-hidden="true"
                  >
                    <path d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H3zm0 2.2 9 5.625L21 7.2V17H3V7.2zM12 11.125 4.6 6.5h14.8L12 11.125z" />
                  </svg>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Main Navbar */}
        <div
          className={`relative w-full transition-all duration-300 ease-in-out ${
            isSolid
              ? "bg-white/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-[#ed3237] shadow-sm"
              : "bg-transparent py-3 sm:py-3.5 border-b border-white/10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between gap-4">
              {/* Logo - accurate width matching 466x394 image ratio */}
              <Link href="/" className="flex items-center group shrink-0 z-10">
                <div className="relative h-10 w-[47px] sm:h-12 sm:w-[57px] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="Trung Hải JSC Logo"
                    fill
                    priority
                    className="object-contain drop-shadow-sm"
                  />
                </div>
              </Link>

              {/* Desktop Navigation - Centered Exactly in the Middle */}
              <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative whitespace-nowrap px-3.5 py-1.5 text-sm xl:text-[15px] font-semibold tracking-wide transition-all duration-300 rounded-lg hover:text-[#ed3237] ${
                        isActive
                          ? "text-[#ed3237] font-bold"
                          : isSolid
                          ? "text-slate-700 hover:bg-slate-50"
                          : "text-white drop-shadow hover:text-[#ed3237]"
                      }`}
                    >
                      <span>{item.name}</span>
                      {/* Animated underline micro-interaction */}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#ed3237] rounded-full transition-all duration-300 ease-out ${
                          isActive ? "w-4/5" : "w-0 group-hover:w-4/5"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Compact Call Button with Brand Colors: Red (#ed3237) & Blue (#3e4095) */}
              <div className="hidden lg:flex items-center shrink-0 z-10">
                <a
                  href={`tel:${hotline.replace(/\s+/g, "")}`}
                  title={`Gọi ngay: ${hotline}`}
                  className="whitespace-nowrap flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-300 shadow-md shadow-[#ed3237]/25 hover:shadow-lg hover:shadow-[#3e4095]/35 hover:scale-105 group bg-gradient-to-r from-[#ed3237] via-[#963966] to-[#3e4095] text-white border border-white/20"
                >
                  {/* Ringing Phone Icon with Pulse Beacon */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
                    <div className="relative w-6 h-6 rounded-full bg-white text-[#ed3237] group-hover:text-[#3e4095] flex items-center justify-center transition-colors shadow-sm">
                      <Phone className="w-3 h-3 fill-current animate-phone-ring" />
                    </div>
                  </div>

                  {/* Only Phone Number */}
                  <span className="tracking-tight font-extrabold text-xs text-white drop-shadow-sm">{hotline}</span>
                </a>
              </div>

              {/* Mobile Hamburger Button */}
              <div className="flex items-center gap-2 lg:hidden">
                <a
                  href={`tel:${hotline.replace(/\s+/g, "")}`}
                  className="p-2.5 rounded-full bg-gradient-to-r from-[#ed3237] to-[#3e4095] text-white shadow-md shadow-[#ed3237]/30"
                  aria-label="Gọi điện"
                >
                  <Phone className="w-4 h-4 fill-current animate-phone-ring" />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isSolid
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
        </div>
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
                <div className="relative h-11 w-56">
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
                {navLinks.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        isActive
                          ? "text-[#ed3237] bg-red-50/70 font-bold"
                          : "text-slate-700 hover:text-[#ed3237] hover:bg-red-50/50"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-[#ed3237]" : "text-slate-400"}`} />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#ed3237] via-[#963966] to-[#3e4095] rounded-xl shadow-lg shadow-[#ed3237]/25 hover:opacity-95 transition-all group"
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
