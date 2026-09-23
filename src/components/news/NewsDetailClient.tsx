"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  User,
  ArrowLeft,
  ArrowRight,
  FileText,
  ExternalLink,
  Share2,
  Images,
  X as CloseIcon,
  Maximize2
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import NewsAttachmentsView from "@/components/news/NewsAttachmentsView";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";

interface NewsDetailClientProps {
  id: string;
  initialNews?: NewsItem | null;
}

export default function NewsDetailClient({ id, initialNews }: NewsDetailClientProps) {
  const { newsList, isLoaded } = useNews();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Pick news from dynamic newsList once loaded, fallback to initialNews during hydration
  const news = isLoaded
    ? newsList.find((item) => item.id === id)
    : initialNews || newsList.find((item) => item.id === id);

  // If news has been deleted by Admin
  if (isLoaded && !news) {
    return (
      <InnerPageLayout
        breadcrumbs={[
          { label: "ข่าวประชาสัมพันธ์", href: "/news" },
          { label: "ไม่พบข่าว" },
        ]}
        title="ไม่พบข่าวประชาสัมพันธ์"
        description="ข่าวสารนี้อาจถูกลบหรือยกเลิกการเผยแพร่โดยผู้ดูแลระบบแล้ว"
      >
        <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#0F2942]">
            ข่าวประชาสัมพันธ์นี้ถูกลบแล้ว
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            รายการข่าวที่คุณต้องการเข้าถึง ได้ถูกนำออกจากระบบแล้ว หรือไม่มีอยู่ในการเผยแพร่อีกต่อไป
          </p>
          <div className="pt-2">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับไปหน้ารวมข่าวประชาสัมพันธ์</span>
            </Link>
          </div>
        </div>
      </InnerPageLayout>
    );
  }

  if (!news) {
    return null;
  }

  // Related news: Strictly filter from dynamic newsList (exclude current item and exclude drafts/deleted items)
  const relatedNews = newsList
    .filter((item) => item.id !== news.id && item.status !== "ฉบับร่าง")
    .slice(0, 3);

  return (
    <InnerPageLayout
      breadcrumbs={[
        { label: "ข่าวประชาสัมพันธ์", href: "/news" },
        { label: news.title },
      ]}
      title={news.title}
      description={`หมวดหมู่: ${news.category} • เผยแพร่เมื่อ ${news.date}`}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Main Article Container */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB] text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white bg-[#0F2942] px-2.5 py-1 rounded-md">
                {news.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {news.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {news.author}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{news.views} ครั้ง</span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100 border border-[#E5E7EB] relative group">
            <img
              src={news.imageUrl || "/images/school-emblem-doc.png"}
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setLightboxImage(news.imageUrl || "/images/school-emblem-doc.png")}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="ดูรูปขนาดเต็ม"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Excerpt Callout */}
          {news.excerpt && (
            <p className="font-medium text-slate-800 bg-[#F8FAFC] p-4 sm:p-5 rounded-xl border border-[#E5E7EB] leading-relaxed text-sm sm:text-base thai-wrap">
              {news.excerpt}
            </p>
          )}

          {/* Article Body Content */}
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4 thai-wrap">
            {news.content}
          </div>

          {/* Facebook Link Banner (If provided) */}
          {news.facebookUrl && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                  f
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F2942]">
                    รับชมโพสต์และรูปภาพเพิ่มเติมบน Facebook
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    โพสต์ประชาสัมพันธ์และร่วมแสดงความคิดเห็นทางเพจโรงเรียนบ้านหนองหัวหมู
                  </p>
                </div>
              </div>

              <a
                href={news.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                <span>ดูโพสต์บน Facebook</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Photo Gallery Section (If attached) */}
          {news.galleryImages && news.galleryImages.length > 0 && (
            <div className="pt-6 border-t border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F2942] flex items-center gap-2">
                  <Images className="w-5 h-5 text-amber-500" />
                  <span>ภาพบรรยากาศและกิจกรรม ({news.galleryImages.length} ภาพ)</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  คลิกที่รูปภาพเพื่อขยายดูขนาดเต็ม
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {news.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImage(imgUrl)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`ภาพกิจกรรมที่ ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-xl bg-white/90 text-slate-900 shadow-xs">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section with Google Drive Integration */}
          {news.attachments && news.attachments.length > 0 && (
            <NewsAttachmentsView
              attachments={news.attachments}
              newsTitle={news.title}
            />
          )}
        </article>

        {/* Lightbox Modal for Fullscreen Photo Viewing */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white z-10 transition-colors"
                title="ปิด"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
              <img
                src={lightboxImage}
                alt="ภาพกิจกรรมขยายใหญ่"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Related News (Only existing, non-deleted news!) */}
        {relatedNews.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#0F2942]">
              ข่าวสารอื่นที่เกี่ยวข้อง
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                      <img
                        src={item.imageUrl || "/images/school-emblem-doc.png"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      {item.category} • {item.date}
                    </span>
                    <h4 className="text-xs font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug thai-wrap">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0F2942]">
                    <span>อ่านต่อ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </InnerPageLayout>
  );
}
