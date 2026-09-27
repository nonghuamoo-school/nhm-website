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
import { formatThaiTitle } from "@/lib/thaiTypography";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1 border-b border-[#D1DFF0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF2FF] border border-[#2F6FED]/30 text-[#1E3A5F] text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-[#2F6FED]" />
            <span>วารสารและจดหมายข่าวประชาสัมพันธ์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#D96B34] rounded-full inline-block" />
            <span>ป้ายวารสารประชาสัมพันธ์ A4</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D96B34]/15 text-[#D96B34] border border-[#D96B34]/30">
              {posterItems.length} ฉบับ
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4B6080] mt-0.5 pl-3.5">
            จดหมายข่าว ผลงานสถานศึกษา และประกาศสำคัญ (สัดส่วน A4 คมชัดสูง แตะเพื่อซูมอ่านขนาดเต็มจอ)
          </p>
        </div>
      </div>

      {/* Poster Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          posterItems.length <= 2
            ? "lg:grid-cols-2 max-w-3xl"
            : posterItems.length === 3
            ? "lg:grid-cols-3 max-w-5xl"
            : "lg:grid-cols-3 xl:grid-cols-4"
        } gap-4 sm:gap-6`}
      >
        {posterItems.map((item) => {
          const posterUrl = item.newsletterPosterUrl!;
          return (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#D1DFF0] shadow-xs hover:shadow-md hover:border-[#2F6FED]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Poster Frame (A4 1414x2000 aspect ratio) */}
                <div className="relative aspect-[1414/2000] w-full bg-[#0F2540] overflow-hidden flex items-center justify-center p-2 sm:p-2.5">
                  <OptimizedNewsImage
                    src={posterUrl}
                    alt={item.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-102"
                  />

                  {/* Issue Badge Top Left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1E3A5F]/95 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold shadow-md border border-white/10">
                      {item.issueNumber || "วารสารประชาสัมพันธ์"}
                    </span>
                  </div>

                  {/* Desktop Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-[#0F2540]/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs hidden sm:flex flex-col items-center justify-center gap-2.5 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxPoster({
                          url: posterUrl,
                          title: item.title,
                          issue: item.issueNumber,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-white text-[#1E3A5F] hover:text-[#2F6FED] font-bold text-xs shadow-lg hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4 text-[#2F6FED]" />
                      <span>ซูมดูป้ายขนาดเต็ม</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Quick Action Button */}
                <div className="sm:hidden p-2 bg-[#EAF2FB]/50 border-b border-[#D1DFF0]">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxPoster({
                        url: posterUrl,
                        title: item.title,
                        issue: item.issueNumber,
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl bg-white border border-[#D1DFF0] text-[#1E3A5F] hover:text-[#2F6FED] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#2F6FED]" />
                    <span>แตะเพื่อซูมดูป้าย</span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7FA0] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D96B34] shrink-0" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug thai-wrap">
                    <Link href={`/news/${item.id}`}>{formatThaiTitle(item.title)}</Link>
                  </h3>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="p-3.5 sm:p-4 pt-0 border-t border-[#D1DFF0] mt-1 flex items-center justify-between">
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#2F6FED] hover:text-[#1f5bcc] pt-2 transition-colors"
                >
                  <span>อ่านเนื้อหาข่าว</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-[#6B7FA0] pt-2 font-mono">1414×2000</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxPoster && (
        <div
          className="fixed inset-0 z-50 bg-[#0F2540]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxPoster(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[96vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 text-white px-2">
              <div className="flex items-center gap-2 truncate max-w-[70%]">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#D96B34] text-white font-bold text-xs shrink-0 shadow-xs">
                  {lightboxPoster.issue || "วารสารประชาสัมพันธ์"}
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate text-slate-200">
                  {lightboxPoster.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
