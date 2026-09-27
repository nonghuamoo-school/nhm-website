"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Megaphone,
  Users,
  FileText,
  ChevronRight,
  ArrowRight,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { usePersonnel } from "@/hooks/usePersonnel";
import { useDownloads } from "@/hooks/useDownloads";
import { formatThaiTitle } from "@/lib/thaiTypography";

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = "all" | "news" | "personnel" | "downloads";

export default function UniversalSearchModal({
  isOpen,
  onClose,
}: UniversalSearchModalProps) {
  const router = useRouter();
  const { newsList } = useNews();
  const { personnelList } = usePersonnel();
  const { docList } = useDownloads();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { news: [], personnel: [], downloads: [], total: 0 };
    }

    const matchedNews = (category === "all" || category === "news")
      ? newsList.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
            (n.content && n.content.toLowerCase().includes(q)) ||
            (n.category && n.category.toLowerCase().includes(q))
        )
      : [];

    const matchedPersonnel = (category === "all" || category === "personnel")
      ? personnelList.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.position.toLowerCase().includes(q) ||
            (p.department && p.department.toLowerCase().includes(q)) ||
            (p.subjectGroup && p.subjectGroup.toLowerCase().includes(q)) ||
            (p.roles && p.roles.some((r) => r.toLowerCase().includes(q)))
        )
      : [];

    const matchedDocs = (category === "all" || category === "downloads")
      ? docList.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            (d.description && d.description.toLowerCase().includes(q)) ||
            d.category.toLowerCase().includes(q)
        )
      : [];

    return {
      news: matchedNews,
      personnel: matchedPersonnel,
      downloads: matchedDocs,
      total: matchedNews.length + matchedPersonnel.length + matchedDocs.length,
    };
  }, [query, category, newsList, personnelList, docList]);

  if (!isOpen) return null;

  const quickSuggestions = [
    "รับสมัครนักเรียน",
    "ผอ.อดุลย์",
    "ผลการทดสอบ O-NET",
    "แบบฟอร์มคำร้อง",
    "วิชาการ",
    "ปฏิทินกิจกรรม",
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F2540]/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 sm:pt-16 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D1DFF0] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#D1DFF0] bg-[#EAF2FB]/40">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#2F6FED] absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาข่าว, บุคลากร, เอกสารดาวน์โหลด, แบบฟอร์ม..."
              className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl border border-[#D1DFF0] text-sm text-[#0F1F30] placeholder:text-[#6B7FA0] focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/30 focus:border-[#2F6FED] shadow-xs"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 p-1 text-[#6B7FA0] hover:text-[#1E3A5F] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 p-1 text-[#6B7FA0] hover:text-[#1E3A5F] rounded-lg"
              >
                <span className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  ESC
                </span>
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2">
            {[
              { id: "all", label: "ทั้งหมด" },
              { id: "news", label: "ข่าวประชาสัมพันธ์", icon: Megaphone },
              { id: "personnel", label: "บุคลากร", icon: Users },
              { id: "downloads", label: "เอกสารดาวน์โหลด", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id as SearchCategory)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#1E3A5F] text-white shadow-xs"
                      : "bg-white text-[#1E3A5F] hover:bg-[#EBF2FF] border border-[#D1DFF0]"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Content / Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {!query.trim() ? (
            /* Empty State & Suggestions */
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A5F]">
                <Sparkles className="w-4 h-4 text-[#D96B34]" />
                <span>คำค้นหายอดนิยม</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setQuery(sug)}
                    className="px-3 py-1.5 rounded-xl bg-[#EAF2FB] hover:bg-[#2F6FED] hover:text-white text-xs font-medium text-[#1E3A5F] border border-[#D1DFF0] transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Quick links to core sections */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-[#6B7FA0] block mb-2 uppercase">
                  หน้าสำคัญของโรงเรียน
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF2FF] flex items-center justify-between text-[#1E3A5F] font-semibold transition-colors"
                  >
                    <span>ข้อมูลโรงเรียนและประวัติ</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/academic"
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF2FF] flex items-center justify-between text-[#1E3A5F] font-semibold transition-colors"
                  >
                    <span>ผลการทดสอบ O-NET / NT / RT</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/personnel"
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF2FF] flex items-center justify-between text-[#1E3A5F] font-semibold transition-colors"
                  >
                    <span>ทำเนียบครูและบุคลากร</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/downloads"
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EBF2FF] flex items-center justify-between text-[#1E3A5F] font-semibold transition-colors"
                  >
                    <span>ดาวน์โหลดเอกสารและแบบฟอร์ม</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          ) : searchResults.total === 0 ? (
            /* No Results */
            <div className="text-center py-12 space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-[#1E3A5F]">
                ไม่พบผลการค้นหาสำหรับ &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#6B7FA0]">
                กรุณาตรวจสอบการสะกด หรือลองใช้คำค้นหาที่กว้างขึ้น
              </p>
            </div>
          ) : (
            /* Result Lists */
            <div className="space-y-6">
              {/* News results */}
              {searchResults.news.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-[#D1DFF0]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F]">
                      <Megaphone className="w-3.5 h-3.5 text-[#2F6FED]" />
                      <span>ข่าวประชาสัมพันธ์ ({searchResults.news.length})</span>
                    </div>
                    <Link
                      href={`/news?q=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#2F6FED] hover:underline"
                    >
                      ดูข่าวทั้งหมด →
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.news.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.id}`}
                        onClick={onClose}
                        className="p-3 rounded-xl hover:bg-[#EBF2FF]/60 border border-transparent hover:border-[#2F6FED]/30 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EBF2FF] text-[#1E3A5F] border border-[#2F6FED]/20 mb-1 inline-block">
                            {item.issueNumber || item.category || "ข่าวประชาสัมพันธ์"}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors truncate">
                            {formatThaiTitle(item.title)}
                          </h4>
                          <span className="text-[11px] text-[#6B7FA0]">
                            วันที่ {item.date}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2F6FED] shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Personnel results */}
              {searchResults.personnel.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-[#D1DFF0]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F]">
                      <Users className="w-3.5 h-3.5 text-[#D96B34]" />
                      <span>บุคลากร ({searchResults.personnel.length})</span>
                    </div>
                    <Link
                      href="/personnel"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#2F6FED] hover:underline"
                    >
                      ดูทำเนียบบุคลากร →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.personnel.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href="/personnel"
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-[#EBF2FF]/60 border border-[#D1DFF0] hover:border-[#D96B34]/50 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={item.imageUrl || "/images/school-emblem-doc.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#D96B34] transition-colors truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#4B6080] truncate">
                            {item.position}
                          </p>
                          <span className="text-[10px] text-[#6B7FA0]">
                            {item.department || item.subjectGroup}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads results */}
              {searchResults.downloads.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-[#D1DFF0]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F]">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>เอกสารดาวน์โหลด ({searchResults.downloads.length})</span>
                    </div>
                    <Link
                      href="/downloads"
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#2F6FED] hover:underline"
                    >
                      ดูคลังเอกสารทั้งหมด →
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.downloads.slice(0, 4).map((doc) => (
                      <Link
                        key={doc.id}
                        href="/downloads"
                        onClick={onClose}
                        className="p-3 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-300 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {doc.fileType}
                            </span>
                            <span className="text-[11px] text-[#6B7FA0]">
                              {doc.category}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1E3A5F] group-hover:text-emerald-700 transition-colors truncate">
                            {doc.title}
                          </h4>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-[#D1DFF0] bg-[#EAF2FB]/50 flex items-center justify-between text-[11px] text-[#6B7FA0]">
          <span className="whitespace-nowrap">โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต&nbsp;3</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-[#1E3A5F] font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
