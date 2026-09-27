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
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F2540] via-[#1E3A5F] to-[#0A192F] flex flex-col items-center justify-center p-4">
        <div className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <SchoolLogo size={64} />
        </div>
        <div className="w-48 h-1.5 bg-white/20 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2F6FED] to-[#D96B34] animate-pulse rounded-full w-2/3" />
        </div>
        <span className="text-xs text-white/70 mt-3 font-medium">กำลังโหลดข้อมูลระบบผู้ดูแล...</span>
      </div>
    );
  }

  // If not authenticated, render Login Page (Step 4: Premium Glassmorphism Admin Login)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
        {/* Layer 0: Fullscreen Blurred School Gate Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('/images/school-hero-gate.webp')",
            filter: "blur(10px) brightness(0.58)",
          }}
        />

        {/* Layer 1: Deep Navy Gradient Overlay (Top-Left Darker to Bottom-Right) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1B2F]/94 via-[#142B49]/88 to-[#091728]/95 pointer-events-none" />

        {/* Layer 2: Radial Blue Sheen Overlay (Soft Depth & Dimension) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-15%,rgba(47,111,237,0.32),rgba(11,27,47,0.75))] pointer-events-none" />

        {/* Ambient Decorative Glowing Shapes */}
        <div className="absolute top-1/4 -left-28 w-96 h-96 bg-[#2F6FED]/22 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-28 w-96 h-96 bg-[#7EB8E0]/18 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Decorative Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header Bar for vertical balance */}
        <div className="w-full pt-4 flex items-center justify-between max-w-5xl z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/25 transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <span>← กลับสู่หน้าเว็บไซต์หลัก</span>
          </Link>
          <span className="text-[11px] text-white/70 font-mono hidden sm:inline-block">
            NHM School Content Management System
          </span>
        </div>

        {/* Central Premium Glassmorphism Login Card */}
        <div className="w-full max-w-md my-auto relative z-10 animate-in fade-in zoom-in-95 duration-300 py-4">
          <div className="rounded-3xl bg-white/[0.14] backdrop-blur-[24px] border border-white/[0.28] p-6 sm:p-8 shadow-[0_30px_70px_-15px_rgba(5,15,30,0.85),0_0_50px_rgba(47,111,237,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] text-white">
            
            {/* Header: School Logo with Glowing Ring + Title */}
            <div className="text-center space-y-3 pb-6 border-b border-white/15">
              <div className="flex justify-center">
                <div className="relative group">
                  {/* Glowing halo pulse ring */}
                  <div className="absolute -inset-3.5 rounded-full bg-[#2F6FED]/40 blur-xl animate-pulse pointer-events-none" />
                  
                  {/* Outer glowing border ring */}
                  <div className="relative p-3 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/50 ring-4 ring-[#7EB8E0]/40 shadow-[0_0_35px_rgba(47,111,237,0.55)] transition-transform group-hover:scale-105">
                    <SchoolLogo size={76} />
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold border border-white/25 mb-2 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7EB8E0]" />
                  <span>ระบบรักษาความปลอดภัยสารสนเทศ</span>
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  NHM School CMS
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#EAF2FB]/90 mt-1">
                  ระบบบริหารจัดการเว็บไซต์สถานศึกษา
                </p>

                <div className="flex flex-col items-center gap-0.5 text-center mt-2.5 pt-2 border-t border-white/15">
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D96B34]" />
                    <span>{schoolInfo.name}</span>
                  </p>
                  <p className="text-[11px] text-white/80 thai-wrap">
                    สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต&nbsp;3
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form with Micro-interactions */}
            <form onSubmit={handleLogin} className="pt-6 space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white/95 mb-2">
                  รหัสผ่านสำหรับผู้ดูแล (Admin Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock
                      className={`w-4 h-4 transition-all duration-200 ${
                        isInputFocused
                          ? "text-[#7EB8E0] scale-110 drop-shadow-[0_0_8px_rgba(126,184,224,0.9)]"
                          : "text-blue-200/80"
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
                    className="w-full pl-10 pr-10 py-3.5 text-sm rounded-xl border border-white/30 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#7EB8E0] focus:border-[#7EB8E0] focus:shadow-[0_0_25px_rgba(126,184,224,0.45)] transition-all font-mono backdrop-blur-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-all cursor-pointer ${
                      showPassword
                        ? "text-[#7EB8E0] drop-shadow-[0_0_6px_rgba(126,184,224,0.8)]"
                        : isInputFocused
                        ? "text-white"
                        : "text-white/60 hover:text-white"
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
                  <div className="flex items-center gap-2 mt-2.5 p-2.5 rounded-xl bg-rose-500/25 border border-rose-400/50 text-rose-200 text-xs font-bold animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar Animation while authenticating */}
              {isLoading && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-[#7EB8E0] animate-spin" />
                      <span>{progressText}</span>
                    </span>
                    <span className="font-black text-[#7EB8E0] font-mono">{progress}%</span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#2F6FED] via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button with Gradient, Elevated Soft Shadow, and Micro-Motion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2F6FED] via-[#2558CA] to-[#1E3A5F] hover:from-[#3B82F6] hover:via-[#2F6FED] hover:to-[#183354] active:from-[#1E3A5F] active:to-[#0F2540] text-white font-bold text-sm shadow-[0_6px_25px_rgba(47,111,237,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_10px_35px_rgba(47,111,237,0.7),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-white/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed group"
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
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#7EB8E0]" />
                <span>สำหรับคณะครูและผู้บริหาร</span>
              </span>
              <span className="font-mono text-white/50">v2.5 (2569)</span>
            </div>
          </div>
        </div>

        {/* Bottom Screen Bar: School Motto & Academic Year */}
        <div className="w-full max-w-5xl py-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/70 text-center sm:text-left">
          <div className="italic text-white/80">
            &ldquo;{schoolInfo.motto}&rdquo;
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/60">
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
