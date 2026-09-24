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
  BookOpen
} from "lucide-react";
import { useNews, sortNewsByDateDesc } from "@/hooks/useNews";

export default function LatestNews() {
  const { newsList } = useNews();

  // Strictly sort news by newest date first
  const sortedNews = useMemo(() => sortNewsByDateDesc(newsList), [newsList]);

  // The latest news item is always the main featured story
  const featured = sortedNews[0];
  const sideNews = sortedNews.slice(1, 5);

  return (
    <section className="space-y-5">
      {/* Header with Title & Action Links */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0F2942] text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>ข่าวสารและประกาศสถานศึกษา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
            ข่าวประชาสัมพันธ์ล่าสุด
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ติดตามข่าวสาร จดหมายข่าว และกิจกรรมสำคัญของโรงเรียนบ้านหนองหัวหมู
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0F2942] hover:bg-[#163C61] px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <span>ดูข่าวทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Asymmetric 7/5 or Full 12 when single */}
      {featured ? (
        <div className={`grid grid-cols-1 ${sideNews.length > 0 ? "lg:grid-cols-12" : ""} gap-5 items-start`}>
          {/* Featured Flagship Story */}
          <div className={`${sideNews.length > 0 ? "lg:col-span-7" : "w-full"} bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden group hover:border-slate-300 transition-colors flex flex-col`}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <img
                src={featured.imageUrl || "/images/school-emblem-doc.png"}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0F2942] text-white shadow-xs flex items-center gap-1">
                  <Megaphone className="w-3 h-3 text-amber-400" />
                  <span>ข่าวประชาสัมพันธ์</span>
                </span>
                {featured.issueNumber && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-white shadow-xs">
                    {featured.issueNumber}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3" />
                <span>{featured.views} ครั้ง</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.author}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors leading-snug thai-wrap">
                  <Link href={`/news/${featured.id}`}>{featured.title}</Link>
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed thai-wrap">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/news/${featured.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] group-hover:text-blue-900"
                >
                  <span>อ่านรายละเอียด</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <span className="text-[11px] text-slate-400 font-mono">
                  โรงเรียนบ้านหนองหัวหมู
                </span>
              </div>
            </div>
          </div>

          {/* Right: 4 Balanced Compact Stories (5 cols) */}
          {sideNews.length > 0 && (
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {sideNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E5E7EB] shadow-xs hover:border-slate-300 hover:bg-slate-50/70 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                    <img
                      src={news.imageUrl || "/images/school-emblem-doc.png"}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    {news.newsletterPosterUrl && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500/90 text-white rounded text-[8px] font-bold shadow-2xs" title="มีป้ายวารสาร A4">
                        A4
                      </span>
                    )}
                    {news.attachments && news.attachments.length > 0 && (
                      <span className="absolute bottom-1 right-1 p-1 bg-black/60 rounded text-white" title="มีไฟล์แนบ">
                        <Paperclip className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-900 border border-blue-200">
                        {news.issueNumber || "ข่าวประชาสัมพันธ์"}
                      </span>
                      <span className="text-slate-400">• {news.date}</span>
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug thai-wrap">
                      {news.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
          ยังไม่มีข่าวประชาสัมพันธ์ในระบบ
        </div>
      )}
    </section>
  );
}
