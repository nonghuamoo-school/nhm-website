"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Megaphone,
  Maximize2,
  X,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useNews, sortNewsByDateDesc } from "@/hooks/useNews";

const ITEMS_PER_PAGE = 6;

export default function NewsListPage() {
  const { newsList } = useNews();
  const [searchWord, setSearchWord] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Strictly sort news by date descending
  const sorted = useMemo(() => sortNewsByDateDesc(newsList), [newsList]);

  // Filter only by search word (title or excerpt)
  const filtered = useMemo(() => {
    if (!searchWord.trim()) return sorted;
    const term = searchWord.toLowerCase().trim();
    return sorted.filter((item) => {
      const titleMatch = (item.title || "").toLowerCase().includes(term);
      const excerptMatch = (item.excerpt || "").toLowerCase().includes(term);
      return titleMatch || excerptMatch;
    });
  }, [sorted, searchWord]);

  // Featured banner on page 1 when no search active: ALWAYS the newest news item
  const showFeaturedBanner = !searchWord && currentPage === 1 && filtered.length > 0;
  const featured = showFeaturedBanner ? filtered[0] : null;

  // Grid items: exclude featured from page 1 grid to avoid duplication
  const gridSource = useMemo(() => {
    if (featured) {
      return filtered.filter((n) => n.id !== featured.id);
    }
    return filtered;
  }, [filtered, featured]);

  const totalPages = Math.ceil(gridSource.length / ITEMS_PER_PAGE) || 1;
  const paginatedNews = gridSource.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toolbar = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* News Count Badge */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2942] text-white shadow-2xs">
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>ข่าวประชาสัมพันธ์ทั้งหมด ({filtered.length} รายการ)</span>
        </span>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาชื่อเรื่องข่าวประชาสัมพันธ์..."
          value={searchWord}
          onChange={(e) => {
            setSearchWord(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
        />
      </div>
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ข่าวประชาสัมพันธ์" }]}
      title="ข่าวประชาสัมพันธ์"
      description="จดหมายข่าวประชาสัมพันธ์ กิจกรรม และประกาศสำคัญ โรงเรียนบ้านหนองหัวหมู"
      toolbar={toolbar}
    >
      <div className="space-y-8">
        {/* Featured Article Banner */}
        {currentPage === 1 && !searchWord && featured && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-6 aspect-[16/11] bg-slate-50 relative overflow-hidden flex items-center justify-center p-2 sm:p-3">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-contain sm:object-cover rounded-2xl"
              />
              <span className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-xl bg-[#0F2942]/90 backdrop-blur-xs text-white shadow-sm flex items-center gap-1.5">
                <Megaphone className="w-3 h-3 text-amber-400" />
                <span>ข่าวประชาสัมพันธ์ล่าสุด</span>
              </span>

              <button
                type="button"
                onClick={() => setLightboxImage(featured.imageUrl)}
                className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-2xs transition-all shadow-md cursor-pointer"
                title="คลิกดูภาพป้ายขนาดเต็ม"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.author}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors leading-snug thai-wrap">
                  <Link href={`/news/${featured.id}`}>{featured.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed thai-wrap">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/news/${featured.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2942] hover:text-blue-700"
                >
                  <span>อ่านรายละเอียดข่าว</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {featured.facebookUrl && (
                  <a
                    href={featured.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>ดูอัลบั้มบน Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Poster / News Image with Lightbox Zoom Trigger */}
                <div className="relative aspect-[16/11] bg-slate-50 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={news.imageUrl || "/images/school-emblem-doc.png"}
                    alt={news.title}
                    className="w-full h-full object-contain sm:object-cover rounded-2xl"
                  />
                  <span className="absolute top-3.5 left-3.5 text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#0F2942]/90 backdrop-blur-2xs text-white">
                    ข่าวประชาสัมพันธ์
                  </span>

                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                    {news.facebookUrl && (
                      <a
                        href={news.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded-lg bg-[#1877F2] hover:bg-blue-700 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 transition-colors"
                        title="เปิดดูอัลบั้มภาพบน Facebook"
                      >
                        <span className="font-mono">f</span>
                        <span className="hidden sm:inline">อัลบั้ม</span>
                      </a>
                    )}
                    {news.galleryImages && news.galleryImages.length > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-bold text-[10px] shadow-xs flex items-center gap-1" title={`มีรูปกิจกรรม ${news.galleryImages.length} รูป`}>
                        <span>📷</span>
                        <span>{news.galleryImages.length}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setLightboxImage(news.imageUrl || "/images/school-emblem-doc.png")}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      title="ดูป้ายขนาดเต็ม"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{news.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug thai-wrap">
                    <Link href={`/news/${news.id}`}>{news.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed thai-wrap">
                    {news.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <Link
                  href={`/news/${news.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] group-hover:text-blue-900 pt-2"
                >
                  <span>อ่านต่อ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setLightboxImage(news.imageUrl || "/images/school-emblem-doc.png")}
                  className="text-[11px] text-slate-500 hover:text-blue-700 font-semibold pt-2 flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>ดูป้าย</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E7EB] p-8 text-slate-500 text-sm">
            ไม่พบข่าวประชาสัมพันธ์ที่ตรงกับคำค้นหา
          </div>
        )}

        {/* Compact Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="หน้าก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold min-h-[40px] min-w-[40px] transition-colors ${
                  currentPage === page
                    ? "bg-[#0F2942] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="หน้าถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Fullscreen Poster / Image Viewing */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>ป้ายข่าวสารประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  download="nhm-school-poster.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                  title="ดาวน์โหลดหรือเปิดภาพขนาดต้นฉบับ"
                >
                  <Download className="w-4 h-4" />
                  <span>บันทึกภาพ</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Poster Image */}
            <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl flex items-center justify-center max-h-[82vh]">
              <img
                src={lightboxImage}
                alt="ป้ายข่าวประชาสัมพันธ์ขนาดเต็ม"
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </InnerPageLayout>
  );
}
