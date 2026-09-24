"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Maximize2,
  Download,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Sparkles,
  Share2
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { formatThaiTitle } from "@/lib/thaiTypography";

export default function JournalPage() {
  const { newsList } = useNews();
  const [searchWord, setSearchWord] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ทั้งหมด");
  const [lightboxItem, setLightboxItem] = useState<{ url: string; title: string; issue?: string } | null>(null);

  // Filter items that qualify as Journal Posters (have newsletterPosterUrl or category is วารสารประชาสัมพันธ์)
  const journalItems = useMemo(() => {
    return newsList.filter((item) => {
      // Must have newsletterPosterUrl or category is วารสารประชาสัมพันธ์
      const hasPoster = Boolean(item.newsletterPosterUrl || item.category === "วารสารประชาสัมพันธ์");
      const matchesSearch =
        (item.title || "").toLowerCase().includes(searchWord.toLowerCase()) ||
        (item.issueNumber || "").toLowerCase().includes(searchWord.toLowerCase()) ||
        (item.excerpt || "").toLowerCase().includes(searchWord.toLowerCase());
      
      const matchesYear =
        selectedYear === "ทั้งหมด" ||
        item.date.includes(selectedYear) ||
        (item.issueNumber && item.issueNumber.includes(selectedYear));

      return hasPoster && matchesSearch && matchesYear;
    });
  }, [newsList, searchWord, selectedYear]);

  const toolbar = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Total Count Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2942] text-white text-xs font-bold shadow-2xs">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>วารสารประชาสัมพันธ์ทั้งหมด ({journalItems.length} ฉบับ)</span>
        </span>
      </div>

      {/* Year Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold shadow-2xs">
          {["ทั้งหมด", "2569", "2568"].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedYear === year
                  ? "bg-[#0F2942] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {year === "ทั้งหมด" ? "ทุกปีการศึกษา" : `ปี ${year}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อวารสาร หรือฉบับที่..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "วารสารประชาสัมพันธ์" }]}
      title="วารสารประชาสัมพันธ์โรงเรียน"
      description="คลังรวบรวมจดหมายข่าว ป้ายประชาสัมพันธ์ และวารสารอิเล็กทรอนิกส์ โรงเรียนบ้านหนองหัวหมู (ขนาด A4 1414 x 2000 px)"
      toolbar={toolbar}
    >
      <div className="space-y-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50/30 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              📰
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                บอร์ดจดหมายข่าวและวารสารประชาสัมพันธ์อิเล็กทรอนิกส์ (E-Newsletters)
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                คลิกที่รูปป้ายวารสารเพื่อซูมอ่านตัวหนังสือขนาดเต็ม หรือกดบันทึกรูปภาพลงในอุปกรณ์ของคุณ
              </p>
            </div>
          </div>

          <a
            href="https://www.facebook.com/profile.php?id=100071517975903"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <span>เปิดดูอัลบั้มบน Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* E-Journal / Poster Album Grid (3 or 4 Columns, A4 Aspect Ratio 1414x2000) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {journalItems.map((item) => {
            const posterUrl = item.newsletterPosterUrl || item.imageUrl || "/images/school-emblem-doc.png";
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs hover:border-amber-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Poster Thumbnail Box (Aspect Ratio 1414/2000 ~ 1:1.414 A4) */}
                  <div className="relative aspect-[1414/2000] w-full bg-slate-50 overflow-hidden flex items-center justify-center p-2.5 border-b border-slate-100">
                    <img
                      src={posterUrl}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-2xl transition-transform duration-300 group-hover:scale-102"
                    />

                    {/* Issue Badge Top Left */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1">
                      <span className="px-3 py-1 rounded-xl bg-[#0F2942]/90 backdrop-blur-xs text-white text-[11px] font-bold shadow-md">
                        {item.issueNumber || "จดหมายข่าว"}
                      </span>
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs flex flex-col items-center justify-center gap-2.5 p-4">
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxItem({
                            url: posterUrl,
                            title: item.title,
                            issue: item.issueNumber,
                          })
                        }
                        className="px-4 py-2.5 rounded-xl bg-white text-[#0F2942] font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4 text-blue-600" />
                        <span>ซูมดูป้ายขนาดเต็ม</span>
                      </button>

                      <a
                        href={posterUrl}
                        download="nhm-newsletter.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>บันทึกภาพป้าย</span>
                      </a>
                    </div>
                  </div>

                  {/* Metadata and Title */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug thai-wrap">
                      <Link href={`/news/${item.id}`}>{formatThaiTitle(item.title)}</Link>
                    </h4>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] hover:text-blue-700 pt-2"
                  >
                    <span>อ่านรายละเอียด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.facebookUrl && (
                    <a
                      href={item.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1877F2] hover:underline pt-2"
                    >
                      <span className="font-mono">f</span>
                      <span>อัลบั้มเต็ม</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {journalItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E7EB] p-8 text-slate-500 text-sm">
            ไม่พบวารสารประชาสัมพันธ์ที่ตรงกับเงื่อนไขการค้นหา
          </div>
        )}
      </div>

      {/* Lightbox Modal for Fullscreen Poster Viewing */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white px-2">
              <div className="flex items-center gap-2 truncate max-w-[70%]">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-xs shrink-0">
                  {lightboxItem.issue || "วารสารประชาสัมพันธ์"}
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate">
                  {lightboxItem.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={lightboxItem.url}
                  download="nhm-school-newsletter-a4.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-md"
                  title="ดาวน์โหลดภาพป้ายขนาดเต็ม 1414 x 2000 px"
                >
                  <Download className="w-4 h-4" />
                  <span>บันทึกภาพ A4</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="ปิด"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Poster Image (A4 Ratio) */}
            <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl flex items-center justify-center max-h-[85vh] w-auto">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-w-full max-h-[84vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </InnerPageLayout>
  );
}
