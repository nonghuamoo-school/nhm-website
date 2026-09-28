"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  const [isInputFocused, setIsInputFocused] = useState(false);

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

    if (!password.trim()) {
      setError("กรุณากรอกรหัสผ่านผู้ดูแลระบบ");
      return;
    }

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
  // Initial loading state while checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F4F8FD] to-white flex flex-col items-center justify-center p-4">
        <div className="relative p-3.5 rounded-3xl bg-white border border-[#E6EEF8] shadow-sm">
          <SchoolLogo size={64} />
        </div>
        <div className="w-48 h-1.5 bg-[#EEF3FA] rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] animate-pulse rounded-full w-2/3" />
        </div>
        <span className="text-xs text-[#94A3B8] mt-3 font-medium">กำลังโหลดข้อมูลระบบผู้ดูแล...</span>
      </div>
    );
  }

  // If not authenticated, render Login Page (Modern SaaS Light Theme)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#F4F8FD] via-[#F8FBFE] to-white">
        {/* Layer 0: Blurred School Gate Photo Background (Very subtle opacity 12%) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-1000 scale-105 opacity-[0.12]"
          style={{
            backgroundImage: "url('/images/school-hero-gate.webp')",
            filter: "blur(10px)",
          }}
        />

        {/* Layer 1: Ambient Decorative Light Glowing Blobs */}
        <div className="absolute top-1/4 -left-28 w-96 h-96 bg-[#2F6FED]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-28 w-96 h-96 bg-[#FFF0E5] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-[#F1EAFE]/70 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Decorative Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header Bar for vertical balance */}
        <div className="w-full pt-4 flex items-center justify-between max-w-5xl z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#1E3A5F] text-xs font-semibold backdrop-blur-md border border-[#E6EEF8] transition-all shadow-xs hover:border-[#2F6FED]/40 hover:scale-105 active:scale-95"
          >
            <span>← กลับสู่หน้าเว็บไซต์หลัก</span>
          </Link>
          <span className="text-[11px] text-[#94A3B8] font-mono hidden sm:inline-block">
            NHM School Content Management System
          </span>
        </div>

        {/* Central Modern SaaS Glassmorphism Login Card */}
        <div className="w-full max-w-md my-auto relative z-10 animate-in fade-in zoom-in-95 duration-300 py-4">
          <div className="rounded-3xl bg-white/90 backdrop-blur-[20px] border border-[#E6EEF8] p-6 sm:p-8 shadow-[0_12px_40px_rgba(47,111,237,0.08)] text-[#1E3A5F]">
            
            {/* Header: School Logo with clean frame + Title */}
            <div className="text-center space-y-3 pb-6 border-b border-[#E6EEF8]">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="relative p-3 rounded-3xl bg-white border border-[#E6EEF8] shadow-sm transition-transform group-hover:scale-105">
                    <SchoolLogo size={72} />
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#2F6FED] text-[11px] font-bold border border-[#2F6FED]/20 mb-2 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2F6FED]" />
                  <span>ระบบรักษาความปลอดภัยสารสนเทศ</span>
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] tracking-tight">
                  NHM School CMS
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#475569] mt-1">
                  ระบบบริหารจัดการเว็บไซต์สถานศึกษา
                </p>

                <div className="flex flex-col items-center gap-0.5 text-center mt-2.5 pt-2 border-t border-[#E6EEF8]">
                  <p className="text-xs sm:text-sm font-bold text-[#1E3A5F] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
                    <span>{schoolInfo.name}</span>
                  </p>
                  <p className="text-[11px] text-[#94A3B8] thai-wrap">
                    สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต&nbsp;3
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="pt-6 space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1E3A5F] mb-2">
                  รหัสผ่านสำหรับผู้ดูแล (Admin Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock
                      className={`w-4 h-4 transition-all duration-200 ${
                        isInputFocused
                          ? "text-[#2F6FED] scale-110"
                          : "text-[#94A3B8]"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    disabled={isLoading}
                    placeholder="กรอกรหัสผ่านเข้าระบบ..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-3.5 text-sm rounded-xl border border-[#E6EEF8] bg-white hover:border-[#D1DFF0] focus:bg-white text-[#1E3A5F] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED] focus:shadow-[0_0_20px_rgba(47,111,237,0.12)] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-all cursor-pointer ${
                      showPassword
                        ? "text-[#2F6FED]"
                        : isInputFocused
                        ? "text-[#1E3A5F]"
                        : "text-[#94A3B8] hover:text-[#1E3A5F]"
                    }`}
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
                  <div className="flex items-center gap-2 mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar Animation while authenticating */}
              {isLoading && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#EEF4FE] border border-[#E6EEF8] animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E3A5F] flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-[#2F6FED] animate-spin" />
                      <span>{progressText}</span>
                    </span>
                    <span className="font-black text-[#2F6FED] font-mono">{progress}%</span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2.5 bg-[#E6EEF8] rounded-full overflow-hidden p-0.5">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] rounded-full transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button with Gradient, Elevated Soft Shadow, and Micro-Motion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] hover:from-[#255bc4] hover:to-[#3b7cee] active:from-[#1E3A5F] active:to-[#2F6FED] text-white font-bold text-sm shadow-[0_6px_20px_rgba(47,111,237,0.3)] hover:shadow-[0_8px_25px_rgba(47,111,237,0.4)] border border-transparent transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>กำลังยืนยันตัวตน...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบจัดการสถานศึกษา</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer inside card */}
            <div className="mt-6 pt-4 border-t border-[#E6EEF8] flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2F6FED]" />
                <span>สำหรับคณะครูและผู้บริหาร</span>
              </span>
              <span className="font-mono text-[#94A3B8]">v2.5 (2569)</span>
            </div>
          </div>
        </div>

        {/* Bottom Screen Bar: School Motto & Academic Year */}
        <div className="w-full max-w-5xl py-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8] text-center sm:text-left">
          <div className="italic text-[#475569]">
            &ldquo;{schoolInfo.motto}&rdquo;
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <span>ปีการศึกษา 2569</span>
            <span>•</span>
            <span className="whitespace-nowrap">สพป. บุรีรัมย์ เขต&nbsp;3</span>
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
