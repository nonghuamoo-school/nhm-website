"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Building2, ExternalLink, ChevronRight } from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import TopBar from "./TopBar";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

import UniversalSearchModal from "./UniversalSearchModal";

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
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="w-full">
      {/* Universal Search Modal (searches News, Personnel, Downloads) */}
      <UniversalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* LEVEL 1: Utility Bar */}
      <TopBar />

      {/* LEVEL 2: Brand Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-[#D1DFF0] sticky top-0 z-40 shadow-sm relative overflow-hidden nhm-watermark">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">

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
              <span className="text-base sm:text-xl lg:text-2xl font-black text-[#1E3A5F] tracking-tight leading-normal pb-1 group-hover:text-[#2F6FED] transition-colors">
                {settings.name}
              </span>
              <span className="text-[11px] sm:text-xs text-[#4B6080] font-medium leading-normal -mt-1 hidden sm:block truncate">
                {settings.subAffiliation}
              </span>
              <span className="text-[11px] text-[#4B6080] font-medium leading-normal -mt-1 sm:hidden truncate">
                สพป. บุรีรัมย์ เขต&nbsp;3
              </span>
            </div>
          </Link>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Universal Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#1E3A5F] bg-[#EAF2FB] hover:bg-[#D1DFF0] rounded-xl transition-all border border-[#D1DFF0] min-h-[44px] min-w-[44px] sm:min-w-0 flex items-center justify-center sm:justify-start gap-2 cursor-pointer shadow-2xs group"
              aria-label="ค้นหาข้อมูลข้ามระบบ"
            >
              <Search className="w-4 h-4 text-[#2F6FED] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">ค้นหาข้อมูล...</span>
              <span className="hidden md:inline-block text-[10px] text-[#6B7FA0] bg-white px-1.5 py-0.5 rounded border border-[#D1DFF0] font-mono">
                Ctrl+K
              </span>
            </button>

            {/* Educational Area Office Button (Desktop) */}
            <a
              href="https://www.brm3.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#2A5080] rounded-xl shadow-xs transition-colors min-h-[44px]"
              title="สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3"
            >
              <Building2 className="w-4 h-4 text-[#D96B34] shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#7EB8E0] font-normal">เว็บไซต์เขตพื้นที่</span>
                <span className="text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                  สพป. บุรีรัมย์ เขต&nbsp;3
                  <ExternalLink className="w-3 h-3 text-slate-300 shrink-0" />
                </span>
              </div>
            </a>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1E3A5F] hover:text-[#2F6FED] rounded-xl hover:bg-[#EAF2FB] lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#D1DFF0]"
              aria-label="เมนูหลัก"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#D1DFF0] bg-white/95 backdrop-blur-sm shadow-xl">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors min-h-[44px] ${
                    isActive(link.href)
                      ? "bg-[#1E3A5F] text-white border-l-4 border-[#D96B34]"
                      : "text-[#1E3A5F] hover:bg-[#EAF2FB]"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LEVEL 3: Main Desktop Navigation */}
      <nav className="hidden lg:block bg-[#1E3A5F] text-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center space-x-1 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isActive(link.href)
                    ? "bg-white/15 text-white"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
                {/* Accent underline for active item */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#D96B34] rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
