"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  Server,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.replace("/admin");
            return;
          }
        }
      } catch (err) {
        // Not logged in or error, stay on login page
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkCurrentSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!username.trim()) {
      setErrorMessage("Vui lòng nhập tên tài khoản");
      return;
    }

    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          remember,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Tên đăng nhập hoặc mật khẩu không chính xác");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng vào hệ thống...");
      setTimeout(() => {
        router.replace("/admin");
      }, 700);
    } catch (err: any) {
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau!");
      setIsLoading(false);
    }
  };

  const handleAutoFillDefault = () => {
    setUsername("admin");
    setPassword("trunghai@2026");
    setErrorMessage(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold animate-pulse">
            Đang khởi tạo phiên bảo mật...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-[#ed3237] selection:text-white font-sans">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ed3237]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3e4095]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with Back Link */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <div className="w-7 h-7 rounded-[3px] bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Về trang chủ Trung Hải</span>
        </Link>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-[420px]">
          {/* Main Card with Glassmorphism */}
          <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-[4px] shadow-2xl shadow-black/80 overflow-hidden relative">
            {/* Top Brand Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#ed3237] via-[#3e4095] to-[#ed3237]" />

            <div className="p-6 sm:p-7">
              {/* Logo & Heading */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center mb-3 relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 to-blue-600/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white px-3.5 py-1.5 rounded-[3px] shadow border border-slate-200">
                    <Image
                      src="/logo.png"
                      alt="Trung Hải JSC Logo"
                      width={150}
                      height={38}
                      className="h-8 w-auto object-contain"
                      priority
                    />
                  </div>
                </div>

                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mt-0.5">
                  Cổng Quản Trị Hệ Thống
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-normal">
                  Đăng nhập tài khoản điều hành và cập nhật nội dung
                </p>
              </div>

              {/* Notification Alerts */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-[3px] bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="w-4 h-4 text-[#ed3237] shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{errorMessage}</div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-[3px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{successMessage}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Username Input */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập (ví dụ: admin)"
                      autoComplete="username"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-[3px] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-300"
                    >
                      Mật khẩu
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-[3px] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#ed3237] focus:ring-1 focus:ring-[#ed3237] transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded-[2px] bg-slate-950 border-slate-800 text-[#ed3237] focus:ring-0 focus:ring-offset-0 accent-[#ed3237]"
                    />
                    <span className="text-xs text-slate-400 hover:text-slate-300">
                      Ghi nhớ phiên đăng nhập (30 ngày)
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-[3px] bg-gradient-to-r from-[#ed3237] to-[#c41f24] hover:from-[#d9292e] hover:to-[#b0171c] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xác thực hệ thống...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng Nhập Quản Trị</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Developer / Admin Convenience Helper Box */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                <div className="p-2.5 rounded-[3px] bg-slate-950/60 border border-slate-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div className="text-[11px] leading-tight text-slate-400">
                      <span className="font-semibold text-slate-300">Mặc định: </span>
                      <code className="text-amber-300/90 font-mono">admin</code> /{" "}
                      <code className="text-amber-300/90 font-mono">trunghai@2026</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillDefault}
                    className="text-[10px] font-bold text-[#ed3237] hover:text-red-400 uppercase tracking-wider py-1 px-2 rounded bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Điền nhanh
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note inside card */}
            <div className="px-6 py-2.5 bg-slate-950/90 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mã hóa bảo mật 256-Bit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>D1 Cloudflare Database</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 w-full text-center py-2.5 text-[11px] text-slate-600 border-t border-slate-900/80">
        <p>
          © {new Date().getFullYear()} CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ TRUNG HẢI. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
