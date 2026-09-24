"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Building2, ExternalLink, ChevronRight, School } from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import TopBar from "./TopBar";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

const navLinks = [
  { name: "หน้าแรก", href: "/" },
  { name: "ข้อมูลโรงเรียน", href: "/about" },
  { name: "บุคลากร", href: "/personnel" },
  { name: "ข่าวประชาสัมพันธ์", href: "/news" },
  { name: "ผลการทดสอบระดับชาติ", href: "/academic" },
  { name: "ดาวน์โหลด", href: "/downloads" },
  { name: "ปฏิทิน", href: "/calendar" },
  { name: "ติดต่อ", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSchoolSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/news?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full">
      {/* LEVEL 1: Utility Bar */}
      <TopBar />

      {/* LEVEL 2: Brand Header (White surface, Logo, Title, Subtitle, Search, Menu) */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 group">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <SchoolLogo
                size={46}
                customLogoUrl={settings.customLogoUrl}
                emblemType={settings.emblemType}
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 py-0.5">
              <span className="text-base sm:text-xl lg:text-2xl font-black text-[#0F2942] tracking-tight leading-normal pb-1 group-hover:text-blue-900 transition-colors">
                {settings.name}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal -mt-1 hidden sm:block">
                {settings.subAffiliation}
              </span>
              <span className="text-[11px] text-slate-500 font-medium leading-normal -mt-1 sm:hidden">
                สพป. บุรีรัมย์ เขต 3
              </span>
            </div>
          </Link>

          {/* Right Action Tools: Search, Educational Area Office, Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Input / Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-[#F8FAFC] rounded-xl px-2.5 py-1.5 border border-[#E5E7EB] shadow-xs"
                >
                  <Search className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-800 focus:outline-none w-32 sm:w-52"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    aria-label="ปิดการค้นหา"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] hover:bg-slate-100 rounded-xl transition-colors border border-[#E5E7EB] min-h-[38px] sm:min-h-[42px] flex items-center gap-1.5"
                  aria-label="ค้นหาข้อมูล"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">ค้นหา</span>
                </button>
              )}
            </div>

            {/* Educational Area Office Website Button (Desktop only, hidden on mobile to avoid clutter) */}
            <a
              href="https://www.brm3.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#0F2942] hover:bg-[#163C61] rounded-xl shadow-xs transition-colors min-h-[42px]"
              title="สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3"
            >
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-amber-300 font-normal">เว็บไซต์เขตพื้นที่</span>
                <span className="text-xs font-bold flex items-center gap-1">
                  สพป. บุรีรัมย์ เขต 3
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </span>
              </div>
            </a>

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0F2942] rounded-xl hover:bg-slate-100 lg:hidden min-h-[38px] min-w-[38px] flex items-center justify-center border border-slate-200"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive(link.href)
                      ? "bg-[#0F2942] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}

              {/* Extra External Link in Mobile Menu */}
              <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                <a
                  href="https://www.brm3.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>เว็บไซต์ สพป. บุรีรัมย์ เขต 3</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                </a>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                >
                  <span>ระบบจัดการสถานศึกษา (Admin)</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LEVEL 3: Main Desktop Navigation */}
      <nav className="hidden lg:block bg-[#0F2942] text-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 py-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive(link.href)
                      ? "bg-white/15 text-white"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline px-2 py-1"
              >
                เข้าสู่ระบบผู้ดูแล (Admin)
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
