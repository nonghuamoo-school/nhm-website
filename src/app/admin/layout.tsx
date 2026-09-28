"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  Award,
  LogOut
} from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";
import { AdminAuthGuard, useAdminAuth } from "@/components/admin/AdminAuthGuard";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "คะแนน O-NET & โปสเตอร์", href: "/admin/academic", icon: Award },
  { name: "ข่าวประชาสัมพันธ์", href: "/admin/news", icon: Megaphone },
  { name: "เอกสาร & ครุภัณฑ์", href: "/admin/downloads", icon: FileText },
  { name: "บุคลากร", href: "/admin/personnel", icon: Users },
  { name: "กิจกรรม", href: "/admin/calendar", icon: Calendar },
  { name: "สถิติผู้เข้าชม & ข้อมูลนักเรียน", href: "/admin/statistics", icon: BarChart3 },
  { name: "ตั้งค่า", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nhm_admin_session");
      window.location.reload();
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex bg-gradient-to-b from-[#F4F8FD] via-[#F8FBFE] to-white text-[#1E3A5F]">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/25 z-40 lg:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Admin Sidebar (Modern SaaS Light Theme) */}
        <aside
          className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 lg:bg-white/88 backdrop-blur-xl text-[#1E3A5F] flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-[#E6EEF8] shadow-xs ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            {/* Brand header */}
            <div className="p-5 border-b border-[#E6EEF8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SchoolLogo size={38} />
                <div className="leading-tight">
                  <span className="font-bold text-sm text-[#1E3A5F] block truncate">
                    {schoolInfo.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
                    <span>ระบบบริหารสถานศึกษา</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-[#94A3B8] hover:text-[#1E3A5F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-3 space-y-1">
              <span className="px-3 py-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                เมนูจัดการระบบ
              </span>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-xs font-semibold transition-all duration-200 min-h-[42px] group ${
                      active
                        ? "bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] text-white font-bold shadow-[0_6px_16px_rgba(47,111,237,0.3)]"
                        : "text-[#334155] hover:bg-[#EEF4FE] hover:text-[#2F6FED]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        active
                          ? "text-white"
                          : "text-[#64748B] group-hover:text-[#2F6FED] group-hover:translate-x-0.5"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar actions */}
          <div className="p-4 border-t border-[#E6EEF8] space-y-2 relative z-10">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF4FE] hover:text-[#2F6FED] border border-[#E6EEF8] text-xs text-[#334155] transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#2F6FED] group-hover:translate-x-0.5 transition-transform" />
                <span>ดูหน้าเว็บไซต์หลัก</span>
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono">Public</span>
            </Link>

            {/* Logout button (Soft pastel red) */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs text-rose-700 border border-rose-200 transition-colors font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>ออกจากระบบ Admin</span>
              </span>
            </button>

            <div className="px-2 text-[11px] text-[#94A3B8] flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">สพป. บุรีรัมย์ เขต&nbsp;3</span>
            </div>
          </div>
        </aside>

        {/* Main Admin Content Wrapper */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
          {/* Admin Header: Light Glassmorphism */}
          <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-[#E6EEF8] flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-[#F4F8FD] min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#E6EEF8]"
                aria-label="เปิดเมนูแอดมิน"
              >
                <Menu className="w-5 h-5 text-[#1E3A5F]" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-4 bg-[#2F6FED] rounded-full hidden sm:inline-block shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-[#1E3A5F] truncate">
                  <span className="hidden lg:inline">ระบบสารสนเทศและการจัดการเนื้อหา (NHM School CMS)</span>
                  <span className="hidden sm:inline lg:hidden">ระบบจัดการเนื้อหา (CMS)</span>
                  <span className="sm:hidden">NHM CMS</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ระบบออนไลน์</span>
              </span>

              {/* Header Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6EEF8] hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer bg-white/80"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 box-border">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
