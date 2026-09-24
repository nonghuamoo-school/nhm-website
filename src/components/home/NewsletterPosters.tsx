"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Maximize2,
  Download,
  Calendar,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink
} from "lucide-react";
import { useNews, toIsoDate } from "@/hooks/useNews";

export default function NewsletterPosters() {
  const { newsList } = useNews();
  const [lightboxPoster, setLightboxPoster] = useState<{
    url: string;
    title: string;
    issue?: string;
  } | null>(null);

  // Filter items that have an A4 newsletter poster attached and sort newest first
  const posterItems = useMemo(() => {
    const withPoster = newsList.filter((item) => Boolean(item.newsletterPosterUrl));
    return [...withPoster].sort((a, b) => {
      const isoA = toIsoDate(a.date);
      const isoB = toIsoDate(b.date);
      return isoB.localeCompare(isoA);
    });
  }, [newsList]);

  if (posterItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-900 text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>วารสารและจดหมายข่าวประชาสัมพันธ์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight flex items-center gap-2">
            <span>ป้ายวารสารประชาสัมพันธ์ A4</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {posterItems.length} ฉบับ
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            จดหมายข่าว ผลงานสถานศึกษา และประกาศสำคัญ (สัดส่วน A4 คมชัดสูง แตะเพื่อซูมอ่านหรือบันทึกภาพ)
          </p>
        </div>
      </div>

      {/* Poster Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {posterItems.map((item) => {
          const posterUrl = item.newsletterPosterUrl!;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Poster Frame (A4 1414x2000 aspect ratio) */}
                <div className="relative aspect-[1414/2000] w-full bg-slate-900 overflow-hidden flex items-center justify-center p-2 sm:p-2.5">
                  <img
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-102"
                  />

                  {/* Issue Badge Top Left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold shadow-md">
                      {item.issueNumber || "วารสารประชาสัมพันธ์"}
                    </span>
                  </div>

                  {/* Desktop Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs hidden sm:flex flex-col items-center justify-center gap-2.5 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxPoster({
                          url: posterUrl,
                          title: item.title,
                          issue: item.issueNumber,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-white text-[#0F2942] font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4 text-emerald-700" />
                      <span>ซูมดูป้ายขนาดเต็ม</span>
                    </button>

                    <a
                      href={posterUrl}
                      download={`nhm-${item.issueNumber || "newsletter"}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>บันทึกภาพ A4</span>
                    </a>
                  </div>
                </div>

                {/* Mobile Quick Action Buttons (Always visible on mobile) */}
                <div className="sm:hidden grid grid-cols-2 gap-1.5 p-2.5 bg-slate-50 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxPoster({
                        url: posterUrl,
                        title: item.title,
                        issue: item.issueNumber,
                      })
                    }
                    className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[#0F2942] text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Maximize2 className="w-3 h-3 text-emerald-700" />
                    <span>ซูมดูป้าย</span>
                  </button>
                  <a
                    href={posterUrl}
                    download={`nhm-${item.issueNumber || "newsletter"}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>บันทึกภาพ</span>
                  </a>
                </div>

                {/* Card Body */}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug thai-wrap">
                    <Link href={`/news/${item.id}`}>{item.title}</Link>
                  </h3>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 mt-1 flex items-center justify-between">
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#0F2942] hover:text-emerald-700 pt-2 transition-colors"
                >
                  <span>อ่านเนื้อหาข่าว</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-slate-400 pt-2 font-mono">1414×2000</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxPoster(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[96vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 text-white px-2">
              <div className="flex items-center gap-2 truncate max-w-[70%]">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0">
                  {lightboxPoster.issue || "วารสารประชาสัมพันธ์"}
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate">
                  {lightboxPoster.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={lightboxPoster.url}
                  download="nhm-newsletter-a4.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md"
                  title="ดาวน์โหลดภาพป้ายขนาดเต็ม 1414 x 2000 px"
                >
                  <Download className="w-4 h-4" />
                  <span>บันทึกภาพ A4</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxPoster(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Poster Image Container */}
            <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl flex items-center justify-center max-h-[85vh] w-auto">
              <img
                src={lightboxPoster.url}
                alt={lightboxPoster.title}
                className="max-w-full max-h-[84vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
