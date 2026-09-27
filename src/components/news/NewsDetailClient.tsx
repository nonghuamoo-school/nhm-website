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
  Maximize2,
  Download,
  Megaphone
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import NewsAttachmentsView from "@/components/news/NewsAttachmentsView";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { formatThaiTitle } from "@/lib/thaiTypography";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

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
          <div className="w-16 h-16 rounded-2xl bg-[#EBF2FF] text-[#2F6FED] flex items-center justify-center mx-auto border border-[#2F6FED]/20">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1E3A5F]">
            ข่าวประชาสัมพันธ์นี้ถูกลบแล้ว
          </h2>
          <p className="text-xs text-[#4B6080] leading-relaxed">
            รายการข่าวที่คุณต้องการเข้าถึง ได้ถูกนำออกจากระบบแล้ว หรือไม่มีอยู่ในการเผยแพร่อีกต่อไป
          </p>
          <div className="pt-2">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#2A5080] text-white text-xs font-bold shadow-xs transition-colors"
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
      title={formatThaiTitle(news.title)}
      description={`ข่าวประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู • เผยแพร่เมื่อ ${news.date}`}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Main Article Container: Glassmorphism */}
        <article className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#D1DFF0] shadow-xs space-y-6">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D1DFF0] text-xs text-[#6B7FA0]">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white bg-[#1E3A5F] px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs border border-white/10">
                <Megaphone className="w-3.5 h-3.5 text-[#D96B34]" />
                <span>ข่าวประชาสัมพันธ์</span>
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

          {/* Visual Presentation: Side-by-side if A4 Poster exists, or Standard Single Cover */}
          {news.newsletterPosterUrl && news.imageUrl && news.newsletterPosterUrl !== news.imageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Right on PC (7 cols), First on Mobile (order-1 md:order-2): Landscape Activity Photo + Excerpt */}
              <div className="order-1 md:order-2 md:col-span-7 space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200 relative group shadow-xs">
                  <OptimizedNewsImage
                    src={news.imageUrl || "/images/school-emblem-doc.png"}
                    alt={news.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-2xs z-10">
                    ภาพบรรยากาศกิจกรรม
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(news.imageUrl || "/images/school-emblem-doc.png")}
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-2xs transition-all cursor-pointer z-10"
                    title="ดูภาพขยาย"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {news.excerpt && (
                  <p className="font-medium text-[#0F1F30] bg-[#EAF2FB]/50 p-3.5 sm:p-5 rounded-2xl border border-[#D1DFF0] leading-[1.8] text-left text-xs sm:text-sm thai-wrap">
                    {news.excerpt}
                  </p>
                )}
              </div>

              {/* Left on PC (5 cols), Second on Mobile (order-2 md:order-1): Vertical A4 Poster */}
              <div className="order-2 md:order-1 md:col-span-5 bg-gradient-to-b from-[#EBF2FF] to-white rounded-2xl sm:rounded-3xl border border-[#D1DFF0] p-3.5 sm:p-4 shadow-xs flex flex-col items-center">
                <div className="flex items-center justify-between w-full pb-2 mb-2.5 border-b border-[#D1DFF0] text-xs font-bold text-[#1E3A5F]">
                  <span className="flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-[#2F6FED]" />
                    <span>ป้ายวารสารประชาสัมพันธ์ A4</span>
                  </span>
                  {news.issueNumber && (
                    <span className="px-2 py-0.5 rounded-md bg-[#D96B34] text-white text-[10px]">
                      {news.issueNumber}
                    </span>
                  )}
                </div>

                {/* Poster Frame */}
                <div className="relative w-full aspect-[1414/2000] max-h-[460px] sm:max-h-none rounded-xl sm:rounded-2xl overflow-hidden shadow-md group bg-[#0F2540] border border-[#D1DFF0] flex items-center justify-center">
                  <OptimizedNewsImage
                    src={news.newsletterPosterUrl}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="w-full h-full object-contain"
                  />
                  {/* Desktop Hover Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => setLightboxImage(news.newsletterPosterUrl!)}
                      className="px-3.5 py-2 rounded-xl bg-white text-[#1E3A5F] hover:text-[#2F6FED] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>ซูมดูป้าย A4 เต็มจอ</span>
                    </button>
                  </div>
                </div>

                {/* Action Button: Single Clean Zoom Button */}
                <div className="w-full mt-3">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(news.newsletterPosterUrl!)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#2F6FED] hover:bg-[#1f5bcc] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ซูมดูป้ายเต็มจอ</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Standard Single Cover Image / Poster with Lightbox */}
              <div className="rounded-2xl overflow-hidden bg-slate-50 border border-[#D1DFF0] relative group flex items-center justify-center p-2 sm:p-4">
                <div className="relative w-full aspect-[16/10] max-h-[600px]">
                  <OptimizedNewsImage
                    src={news.imageUrl || "/images/school-emblem-doc.png"}
                    alt={news.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-contain rounded-xl"
                  />
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(news.imageUrl || "/images/school-emblem-doc.png")}
                    className="px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-2xs text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    title="คลิกดูภาพป้ายขนาดเต็ม"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>ดูภาพขนาดเต็ม</span>
                  </button>
                </div>
              </div>

              {/* Excerpt Callout */}
              {news.excerpt && (
                <p className="font-medium text-[#0F1F30] bg-[#EAF2FB]/50 p-4 sm:p-5 rounded-xl border border-[#D1DFF0] leading-[1.8] text-left text-sm sm:text-base thai-wrap">
                  {news.excerpt}
                </p>
              )}
            </>
          )}

          {/* Article Body Content */}
          <div className="text-sm sm:text-base text-[#334155] leading-[1.8] text-left whitespace-pre-line space-y-4 thai-wrap">
            {news.content}
          </div>

          {/* Facebook Link Banner (If provided) */}
          {news.facebookUrl && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF2FB]/60 border border-[#D1DFF0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                  f
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E3A5F]">
                    รับชมโพสต์และรูปภาพเพิ่มเติมบน Facebook
                  </h4>
                  <p className="text-xs text-[#4B6080] mt-0.5">
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
            <div className="pt-6 border-t border-[#D1DFF0] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1E3A5F] flex items-center gap-2">
                  <Images className="w-5 h-5 text-[#D96B34]" />
                  <span>ภาพบรรยากาศและกิจกรรม ({news.galleryImages.length} ภาพ)</span>
                </h3>
                <span className="text-[11px] text-[#6B7FA0]">
                  คลิกที่รูปภาพเพื่อขยายดูขนาดเต็ม
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {news.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImage(imgUrl)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-[#D1DFF0] cursor-pointer shadow-2xs hover:shadow-md transition-all"
                  >
                    <OptimizedNewsImage
                      src={imgUrl}
                      alt={`ภาพกิจกรรมที่ ${idx + 1}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <span className="p-2 rounded-xl bg-white/90 text-[#0F1F30] shadow-xs">
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
            className="fixed inset-0 z-50 bg-[#0F2540]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Toolbar */}
              <div className="w-full flex items-center justify-between pb-3 text-white">
                <span className="text-xs sm:text-sm font-semibold truncate max-w-[70%] text-slate-200">
                  {news.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(null)}
                    className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                    title="ปิด"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image */}
              <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl flex items-center justify-center max-h-[82vh]">
                <img
                  src={lightboxImage}
                  alt={news.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#1E3A5F] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#D96B34] rounded-full inline-block" />
              <span>ข่าวสารอื่นที่เกี่ยวข้อง</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#D1DFF0] shadow-xs hover:border-[#2F6FED]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2.5 border border-[#D1DFF0] relative">
                      <OptimizedNewsImage
                        src={item.imageUrl || "/images/school-emblem-doc.png"}
                        alt={item.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#D96B34] block mb-1">
                      {item.category} • {item.date}
                    </span>
                    <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug thai-wrap">
                      {formatThaiTitle(item.title)}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#D1DFF0] flex items-center justify-between text-[11px] font-bold text-[#2F6FED]">
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
