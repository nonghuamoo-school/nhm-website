"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Eye,
  Paperclip,
  Sparkles,
  ChevronRight,
  FileText
} from "lucide-react";
import { useNews } from "@/hooks/useNews";

const categories = ["ทั้งหมด", "ประชาสัมพันธ์", "กิจกรรม", "วิชาการ", "จัดซื้อจัดจ้าง"] as const;

export default function LatestNews() {
  const { newsList } = useNews();
  const [activeCategory, setActiveCategory] = useState<string>("ทั้งหมด");

  const filteredNews = newsList.filter((item) => {
    if (activeCategory === "ทั้งหมด") return true;
    return item.category === activeCategory;
  });

  // Featured article is either the first marked as featured, or the first item in current category
  const featured = filteredNews.find((n) => n.isFeatured) || filteredNews[0];
  const sideNews = filteredNews.filter((n) => n.id !== featured?.id).slice(0, 4);

  return (
    <section className="space-y-5">
      {/* Header with Title & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0F2942] text-[11px] font-bold mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>ข่าวสารและประกาศสถานศึกษา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
            ข่าวประชาสัมพันธ์ล่าสุด
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ติดตามข่าวสาร กิจกรรม และประกาศสำคัญของโรงเรียนบ้านหนองหัวหมู
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[34px] ${
                activeCategory === cat
                  ? "bg-[#0F2942] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2942] hover:text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors min-h-[34px] ml-1"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Asymmetric 7/5 with balanced spacing */}
      {featured ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Featured Flagship Story (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden group hover:border-slate-300 transition-colors flex flex-col">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0F2942] text-white shadow-xs">
                  {featured.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-xs text-[#0F2942] shadow-xs">
                  ข่าวเด่น
                </span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3" />
                <span>{featured.views} ครั้ง</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {featured.date}
                  </span>
                  <span>•</span>
                  <span>โดย {featured.author}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors leading-snug">
                  <Link href={`/news/${featured.id}`}>{featured.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {featured.excerpt}
                </p>

                {featured.attachments && featured.attachments.length > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-800 text-[11px] font-semibold">
                    <Paperclip className="w-3 h-3 text-blue-600" />
                    <span>มีเอกสารแนบ {featured.attachments.length} รายการ (PDF)</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/news/${featured.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] group-hover:text-blue-800 transition-colors"
                >
                  <span>อ่านรายละเอียดเนื้อหาข่าว</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="text-[11px] text-slate-400 font-mono">
                  สพป. บุรีรัมย์ เขต 3
                </span>
              </div>
            </div>
          </div>

          {/* Right: 4 Balanced Compact Stories (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {sideNews.length > 0 ? (
              sideNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E5E7EB] shadow-xs hover:border-slate-300 hover:bg-slate-50/70 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    {news.attachments && news.attachments.length > 0 && (
                      <span className="absolute bottom-1 right-1 p-1 bg-black/60 rounded text-white" title="มีไฟล์แนบ">
                        <Paperclip className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 text-[11px]">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          news.category === "วิชาการ"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : news.category === "กิจกรรม"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : news.category === "จัดซื้อจัดจ้าง"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {news.category}
                      </span>
                      <span className="text-slate-400">• {news.date}</span>
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <span className="truncate max-w-[150px]">{news.author}</span>
                      <span className="flex items-center gap-0.5 text-slate-400 shrink-0">
                        <Eye className="w-3 h-3" />
                        {news.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] text-center text-slate-400 text-xs">
                ไม่มีข่าวเพิ่มเติมในหมวดหมู่นี้
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#E5E7EB] text-slate-400 text-sm">
          ไม่พบข่าวประชาสัมพันธ์ในหมวดหมู่นี้
        </div>
      )}
    </section>
  );
}
