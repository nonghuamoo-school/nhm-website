import React from "react";
import Link from "next/link";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { NewsItem } from "@/types";

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
  const categoryColorMap: Record<string, string> = {
    ประชาสัมพันธ์: "bg-blue-50 text-blue-700 border-blue-200",
    กิจกรรม: "bg-emerald-50 text-emerald-700 border-emerald-200",
    วิชาการ: "bg-purple-50 text-purple-700 border-purple-200",
    จัดซื้อจัดจ้าง: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const badgeClass =
    categoryColorMap[news.category] || "bg-slate-50 text-slate-700 border-slate-200";

  if (featured) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group h-full">
        {/* Featured Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-xs bg-white/95 backdrop-blur-xs ${badgeClass}`}
          >
            {news.category}
          </span>
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-xs">
            ข่าวเด่น
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {news.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {news.views} ครั้ง
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
              <Link href={`/news/${news.id}`}>{news.title}</Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {news.excerpt}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">{news.author}</span>
            <Link
              href={`/news/${news.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 group-hover:underline"
            >
              <span>อ่านรายละเอียด</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group h-full">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs bg-white/90 backdrop-blur-xs ${badgeClass}`}
        >
          {news.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
            <Calendar className="w-3 h-3" />
            <span>{news.date}</span>
          </div>

          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
            <Link href={`/news/${news.id}`}>{news.title}</Link>
          </h4>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">{news.author}</span>
          <Link
            href={`/news/${news.id}`}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 group-hover:underline text-[11px]"
          >
            <span>อ่านต่อ</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
