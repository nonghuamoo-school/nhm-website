import React from "react";
import Link from "next/link";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { NewsItem } from "@/types";
import { formatThaiTitle } from "@/lib/thaiTypography";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
  const categoryColorMap: Record<string, string> = {
    ประชาสัมพันธ์: "bg-[#EBF2FF] text-[#1E3A5F] border-[#2F6FED]/30",
    กิจกรรม: "bg-emerald-50 text-emerald-800 border-emerald-200",
    วิชาการ: "bg-purple-50 text-purple-800 border-purple-200",
    จัดซื้อจัดจ้าง: "bg-amber-50 text-amber-800 border-amber-200",
  };

  const badgeClass =
    categoryColorMap[news.category] || "bg-[#EAF2FB] text-[#1E3A5F] border-[#D1DFF0]";

  if (featured) {
    return (
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs hover:shadow-md hover:border-[#2F6FED]/40 transition-all overflow-hidden flex flex-col group h-full">
        {/* Featured Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <OptimizedNewsImage
            src={news.imageUrl}
            alt={news.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-xs bg-white/95 backdrop-blur-xs z-10 ${badgeClass}`}
          >
            {news.category}
          </span>
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-[#D96B34] text-white shadow-xs z-10">
            ข่าวเด่น
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#6B7FA0] mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D96B34]" />
                {news.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#2F6FED]" />
                {news.views} ครั้ง
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug thai-wrap">
              <Link href={`/news/${news.id}`}>{formatThaiTitle(news.title)}</Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-[#4B6080] line-clamp-3 leading-relaxed thai-wrap">
              {news.excerpt}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D1DFF0] flex items-center justify-between">
            <span className="text-[11px] text-[#6B7FA0] font-medium">{news.author}</span>
            <Link
              href={`/news/${news.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6FED] hover:text-[#1f5bcc] group-hover:underline"
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
    <div className="bg-white/85 backdrop-blur-md rounded-xl border border-[#D1DFF0] shadow-xs hover:shadow-md hover:border-[#2F6FED]/40 transition-all overflow-hidden flex flex-col group h-full">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <OptimizedNewsImage
          src={news.imageUrl}
          alt={news.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs bg-white/90 backdrop-blur-xs z-10 ${badgeClass}`}
        >
          {news.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7FA0] mb-1.5">
            <Calendar className="w-3 h-3 text-[#D96B34]" />
            <span>{news.date}</span>
          </div>

          <h4 className="font-bold text-sm text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug thai-wrap">
            <Link href={`/news/${news.id}`}>{formatThaiTitle(news.title)}</Link>
          </h4>

          <p className="mt-1.5 text-xs text-[#4B6080] line-clamp-2 leading-relaxed thai-wrap">
            {news.excerpt}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#D1DFF0] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#6B7FA0]">{news.author}</span>
          <Link
            href={`/news/${news.id}`}
            className="inline-flex items-center gap-1 font-semibold text-[#2F6FED] hover:text-[#1f5bcc] group-hover:underline text-[11px]"
          >
            <span>อ่านต่อ</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
