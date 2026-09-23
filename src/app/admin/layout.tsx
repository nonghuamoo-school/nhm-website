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
  { name: "เอกสาร", href: "/admin/downloads", icon: FileText },
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
      <div className="min-h-screen flex bg-[#F8FAFC]">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F2942] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SchoolLogo size={38} />
              <div className="leading-tight">
                <span className="font-bold text-sm text-white block truncate">
                  {schoolInfo.name}
                </span>
                <span className="text-[10px] text-amber-300 font-medium">
                  ระบบบริหารสถานศึกษา
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <span className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[42px] ${
                    active
                      ? "bg-white/15 text-white font-bold shadow-2xs"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>ดูหน้าเว็บไซต์หลัก</span>
              </span>
              <span className="text-[10px] text-slate-400">Public</span>
            </Link>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-200 transition-colors font-semibold"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>ออกจากระบบ Admin</span>
              </span>
            </button>

            <div className="px-2 text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">สพป. บุรีรัมย์ เขต 3</span>
            </div>
          </div>
        </aside>

        {/* Main Admin Content Wrapper */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Admin Header */}
          <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="เปิดเมนูแอดมิน"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-bold text-sm text-[#0F2942] hidden sm:inline">
                ระบบสารสนเทศและการจัดการเนื้อหา (NHM School CMS)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ระบบออนไลน์</span>
              </span>

              {/* Header Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
