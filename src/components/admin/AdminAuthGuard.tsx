"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Sparkles, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const DEFAULT_ADMIN_PASSWORD = "@31030078";
export const PASSWORD_KEY = "nhm_admin_password";
export const SESSION_KEY = "nhm_admin_session";

export function getAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(PASSWORD_KEY, newPassword);
    window.dispatchEvent(new Event("nhm_password_updated"));
  }
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from("school_settings")
        .upsert({ key: "admin_password", value: { password: newPassword }, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn("Could not sync password to Supabase:", err);
    }
  }
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  useEffect(() => {
    // Check existing session
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Sync custom password from Supabase in background
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("school_settings")
        .select("value")
        .eq("key", "admin_password")
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.value && data.value.password) {
            if (typeof window !== "undefined") {
              localStorage.setItem(PASSWORD_KEY, data.value.password);
            }
          }
        });
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const activePassword = getAdminPassword();
    // Accept either custom password OR default fallback master password
    if (password === activePassword || password === DEFAULT_ADMIN_PASSWORD) {
      setIsLoading(true);
      setProgress(15);
      setProgressText("กำลังตรวจสอบรหัสผ่านผู้ดูแลระบบ...");

      setTimeout(() => {
        setProgress(45);
        setProgressText("กำลังเชื่อมต่อฐานข้อมูล Cloud Database...");
      }, 300);

      setTimeout(() => {
        setProgress(80);
        setProgressText("กำลังเตรียมสิทธิ์การจัดการระบบ...");
      }, 700);

      setTimeout(() => {
        setProgress(100);
        setProgressText("ยืนยันตัวตนสำเร็จ กำลังเข้าสู่ระบบ...");
      }, 1000);

      setTimeout(() => {
        localStorage.setItem(SESSION_KEY, "true");
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1300);
    } else {
      setError("รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setPassword("");
  };

  // Initial loading state while checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F2942] flex flex-col items-center justify-center p-4">
        <SchoolLogo size={64} />
        <div className="w-48 h-1.5 bg-white/20 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-amber-400 animate-pulse rounded-full w-2/3" />
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#0F2942] to-[#1E3A8A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Logo & School Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className="flex justify-center">
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
                <SchoolLogo size={56} />
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>ระบบรักษาความปลอดภัย</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] tracking-tight mb-2">
                เข้าสู่ระบบผู้ดูแลระบบ
              </h1>
              <div className="flex flex-col items-center gap-0.5 text-center">
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  {schoolInfo.name}
                </p>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์&nbsp;เขต&nbsp;3
                </p>
                <p className="text-xs text-slate-500 font-medium sm:hidden">
                  สพป. บุรีรัมย์&nbsp;เขต&nbsp;3
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="pt-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รหัสผ่านสำหรับผู้ดูแล (Admin Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  placeholder="กรอกรหัสผ่านเข้าระบบ..."
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-rose-600 text-xs font-bold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Progress Bar Animation while authenticating */}
            {isLoading && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    <span>{progressText}</span>
                  </span>
                  <span className="font-black text-blue-700 font-mono">{progress}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 bg-blue-200/70 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0F2942] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังโหลดข้อมูล...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบจัดการ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>สำหรับเจ้าหน้าที่และผู้บริหาร</span>
            <a
              href="/"
              className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← กลับสู่หน้าหลัก
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render children with a global top progress bar on route changes
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function useAdminAuth() {
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
      window.location.reload();
    }
  };

  return { logout };
}
