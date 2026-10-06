"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronRight, ChevronDown } from "lucide-react";

interface HeaderProps {
  hotline?: string;
  phoneDisplay?: string;
  address?: string;
  workingHours?: string;
  email?: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
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
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(true);

  useEffect(() => {
    setAboutDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is opened
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavItem[] = [
    { name: "Trang chủ", href: "/" },
    {
      name: "Giới thiệu",
      href: "/gioi-thieu",
      children: [
        { name: "Tổng quan doanh nghiệp", href: "/gioi-thieu" },
        { name: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" },
      ],
    },
    { name: "Công trình", href: "/cong-trinh" },
    { name: "Tin tức", href: "/tin-tuc" },
    { name: "Tuyển dụng", href: "/tuyen-dung" },
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
              ? "bg-white shadow-md border-b-2 border-[#ed3237] py-2 sm:py-3"
              : "bg-transparent py-2.5 sm:py-3.5 border-b border-white/10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between gap-4 min-h-[44px] sm:min-h-[48px]">
              {/* Logo - centered on mobile, left-aligned on desktop */}
              <Link
                href="/"
                className="flex items-center group shrink-0 z-10 max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
              >
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
              <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-2 2xl:space-x-3 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((item) => {
                  if (item.children) {
                    const isDropdownActive =
                      pathname.startsWith("/gioi-thieu") ||
                      pathname.startsWith("/linh-vuc-hoat-dong");

                    return (
                      <div
                        key={item.name}
                        className="relative group py-2"
                        onMouseEnter={() => setAboutDropdownOpen(true)}
                        onMouseLeave={() => setAboutDropdownOpen(false)}
                      >
                        <button
                          type="button"
                          onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                          className={`group/btn relative whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 text-[13px] xl:text-sm 2xl:text-[15px] font-semibold tracking-tight xl:tracking-normal transition-all duration-300 rounded-[3px] hover:text-[#ed3237] flex items-center gap-1 cursor-pointer ${
                            isDropdownActive
                              ? "text-[#ed3237] font-bold"
                              : isSolid
                              ? "text-slate-700 hover:bg-slate-50"
                              : "text-white drop-shadow hover:text-[#ed3237]"
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              aboutDropdownOpen
                                ? "rotate-180 text-[#ed3237]"
                                : isDropdownActive
                                ? "text-[#ed3237]"
                                : isSolid
                                ? "text-slate-400 group-hover/btn:text-[#ed3237]"
                                : "text-white/80 group-hover/btn:text-[#ed3237]"
                            }`}
                          />
                          {/* Animated underline micro-interaction */}
                          <span
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#ed3237] rounded-full transition-all duration-300 ease-out ${
                              isDropdownActive || aboutDropdownOpen ? "w-4/5" : "w-0 group-hover/btn:w-4/5"
                            }`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                          className={`absolute left-0 top-full pt-1.5 min-w-[215px] transition-all duration-200 z-50 ${
                            aboutDropdownOpen
                              ? "opacity-100 translate-y-0 pointer-events-auto"
                              : "opacity-0 -translate-y-2 pointer-events-none"
                          }`}
                        >
                          <div className="bg-white rounded-[3px] border border-slate-200 shadow-xl shadow-slate-900/10 py-1.5 overflow-hidden">
                            {item.children.map((sub) => {
                              const isSubActive = pathname === sub.href;

                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setAboutDropdownOpen(false)}
                                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-[13px] font-semibold transition-all ${
                                    isSubActive
                                      ? "text-[#ed3237] bg-red-50/70 font-bold"
                                      : "text-slate-700 hover:text-[#ed3237] hover:bg-red-50/50"
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  {isSubActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ed3237]" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 text-[13px] xl:text-sm 2xl:text-[15px] font-semibold tracking-tight xl:tracking-normal transition-all duration-300 rounded-[3px] hover:text-[#ed3237] ${
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

              {/* Mobile Hamburger Button (pinned right, call button removed on mobile) */}
              <div className="flex items-center gap-2 lg:hidden ml-auto">
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

      {/* Mobile Drawer Navigation (Gọn gàng, border-radius 3px, có animation slide-in) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop with smooth fade-in */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-backdrop-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container with slide-in animation from right */}
          <div className="fixed top-0 right-0 bottom-0 w-[78%] max-w-[320px] bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-drawer-in">
            <div>
              {/* Header: Chỉ có nhãn Menu tinh tế và nút đóng bo góc 3px */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-[3px] bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-[#ed3237] flex items-center justify-center transition-colors"
                  aria-label="Đóng menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Menu List: Không icon, bo góc rounded-[3px], gọn gàng */}
              <div className="mt-3 flex flex-col space-y-1">
                {navLinks.map((item) => {
                  if (item.children) {
                    const isDropdownActive =
                      pathname.startsWith("/gioi-thieu") ||
                      pathname.startsWith("/linh-vuc-hoat-dong");

                    return (
                      <div key={item.name} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-[3px] text-[13px] font-semibold transition-all ${
                            isDropdownActive
                              ? "text-[#ed3237] bg-red-50/70 font-bold border-l-2 border-[#ed3237]"
                              : "text-slate-700 hover:text-[#ed3237] hover:bg-slate-50"
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              mobileAboutOpen ? "rotate-180 text-[#ed3237]" : "text-slate-400"
                            }`}
                          />
                        </button>

                        {mobileAboutOpen && (
                          <div className="ml-3 pl-2.5 border-l border-red-200 my-1 flex flex-col space-y-0.5">
                            {item.children.map((sub) => {
                              const isSubActive = pathname === sub.href;

                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center justify-between px-3 py-2 rounded-[3px] text-xs font-medium transition-all ${
                                    isSubActive
                                      ? "text-[#ed3237] bg-red-50/60 font-bold"
                                      : "text-slate-600 hover:text-[#ed3237] hover:bg-slate-50"
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  {isSubActive ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ed3237]" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-[3px] text-[13px] font-semibold transition-all ${
                        isActive
                          ? "text-[#ed3237] bg-red-50/70 font-bold border-l-2 border-[#ed3237]"
                          : "text-slate-700 hover:text-[#ed3237] hover:bg-slate-50"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#ed3237]" : "text-slate-300"}`} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer with hotline and info: gọn gàng, rounded-[3px] */}
            <div className="pt-3 border-t border-slate-100 mt-4 space-y-2">
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#ed3237] via-[#963966] to-[#3e4095] rounded-[3px] shadow-sm active:scale-98 transition-all"
              >
                <Phone className="w-3.5 h-3.5 fill-current animate-phone-ring" />
                <span>Hotline: {hotline}</span>
              </a>

              <p className="text-[11px] text-slate-400 text-center truncate px-1">
                {address}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
