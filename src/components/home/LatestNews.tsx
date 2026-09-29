"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Eye,
  Paperclip,
  Sparkles,
  ChevronRight,
  Megaphone,
} from "lucide-react";
import { useNews, sortNewsByDateDesc } from "@/hooks/useNews";
import { formatThaiTitle } from "@/lib/thaiTypography";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";
import { NewsCardSkeleton, SideNewsSkeleton } from "@/components/ui/Skeleton";

export default function LatestNews() {
  const { newsList, isLoaded } = useNews();

  // Strictly sort news by newest date first
  const sortedNews = useMemo(() => sortNewsByDateDesc(newsList), [newsList]);

  // The latest news item is always the main featured story
  const featured = sortedNews[0];
  const sideNews = sortedNews.slice(1, 5);

  return (
    <section className="space-y-5">
      {/* Header with Title & Action Links */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-[#D1DFF0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF2FF] border border-[#2F6FED]/30 text-[#1E3A5F] text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-[#2F6FED]" />
            <span>ข่าวสารและประกาศสถานศึกษา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#D96B34] rounded-full inline-block" />
            <span>ข่าวประชาสัมพันธ์ล่าสุด</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4B6080] mt-0.5 pl-3.5">
            <span className="block sm:inline">ติดตามข่าวสาร จดหมายข่าว และกิจกรรมสำคัญ</span>
            <span className="block sm:inline sm:ml-1">ของโรงเรียนบ้านหนองหัวหมู</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#2A5080] px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <span>ดูข่าวทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Loading skeleton — while hook fetches from localStorage/Supabase */}
      {!isLoaded && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7">
            <NewsCardSkeleton />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {[1, 2, 3].map((i) => (
              <SideNewsSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: only shown after data is ready */}
      {isLoaded && (
        <div className="animate-fade-in">
          {featured ? (
            <div className={`grid grid-cols-1 ${sideNews.length > 0 ? "lg:grid-cols-12" : ""} gap-5 items-start`}>
              {/* Featured Flagship Story: Glassmorphism */}
              <div className={`${sideNews.length > 0 ? "lg:col-span-7" : "w-full"} bg-white/80 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden group hover:border-[#2F6FED]/40 hover:shadow-md transition-all flex flex-col`}>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <OptimizedNewsImage
                    src={featured.imageUrl || "/images/school-emblem-doc.png"}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2540]/80 via-transparent to-transparent opacity-75 pointer-events-none" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#1E3A5F] text-white shadow-xs flex items-center gap-1 border border-white/10">
                      <Megaphone className="w-3 h-3 text-[#D96B34]" />
                      <span>ข่าวประชาสัมพันธ์</span>
                    </span>
                    {featured.issueNumber && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#D96B34] text-white shadow-xs">
                        {featured.issueNumber}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-white/90 bg-[#0F2540]/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                    <Eye className="w-3 h-3 text-[#7EB8E0]" />
                    <span>{featured.views} ครั้ง</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6B7FA0] mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D96B34]" />
                      <span>{featured.date}</span>
                      <span>•</span>
                      <span>{featured.author}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors leading-snug thai-wrap">
                      <Link href={`/news/${featured.id}`}>{formatThaiTitle(featured.title)}</Link>
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-[#334155] line-clamp-2 sm:line-clamp-3 leading-relaxed thai-wrap">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D1DFF0] flex items-center justify-between">
                    <Link
                      href={`/news/${featured.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F6FED] group-hover:text-[#1f5bcc]"
                    >
                      <span>อ่านรายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-[11px] text-[#6B7FA0] font-mono">
                      โรงเรียนบ้านหนองหัวหมู
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Compact Side Stories */}
              {sideNews.length > 0 && (
                <div className="lg:col-span-5 flex flex-col gap-2.5">
                  {sideNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.id}`}
                      className="bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-[#D1DFF0] shadow-xs hover:border-[#2F6FED]/40 hover:bg-white transition-all flex items-center gap-3.5 group"
                    >
                      <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#D1DFF0] relative">
                        <OptimizedNewsImage
                          src={news.imageUrl || "/images/school-emblem-doc.png"}
                          alt={news.title}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {news.newsletterPosterUrl && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#D96B34] text-white rounded text-[8px] font-bold shadow-2xs" title="มีป้ายวารสาร A4">
                            A4
                          </span>
                        )}
                        {news.attachments && news.attachments.length > 0 && (
                          <span className="absolute bottom-1 right-1 p-1 bg-[#0F2540]/80 rounded text-white" title="มีไฟล์แนบ">
                            <Paperclip className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-[11px]">
                          <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-[#EBF2FF] text-[#1E3A5F] border border-[#2F6FED]/25">
                            {news.issueNumber || "ข่าวประชาสัมพันธ์"}
                          </span>
                          <span className="text-[#6B7FA0]">• {news.date}</span>
                        </div>

                        <h4 className="text-xs sm:text-[13px] font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug thai-wrap">
                          {formatThaiTitle(news.title)}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white/80 backdrop-blur-md rounded-2xl border border-[#D1DFF0] text-[#6B7FA0] text-sm">
              ยังไม่มีข่าวประชาสัมพันธ์ในระบบ
            </div>
          )}
        </div>
      )}
    </section>
  );
}
