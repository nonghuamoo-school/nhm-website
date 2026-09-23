"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useNews } from "@/hooks/useNews";

const ITEMS_PER_PAGE = 6;

export default function NewsListPage() {
  const { newsList } = useNews();
  const [selectedCat, setSelectedCat] = useState<string>("ทั้งหมด");
  const [searchWord, setSearchWord] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = ["ทั้งหมด", "ประชาสัมพันธ์", "กิจกรรม", "วิชาการ", "จัดซื้อจัดจ้าง"];

  const filtered = useMemo(() => {
    return newsList.filter((item) => {
      const matchesCat = selectedCat === "ทั้งหมด" || item.category === selectedCat;
      const matchesSearch =
        item.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchWord.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [newsList, selectedCat, searchWord]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedNews = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const featured = filtered.find((n) => n.isFeatured) || filtered[0];

  const toolbar = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCat(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
              selectedCat === cat
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาหัวข้อข่าว..."
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
      title="ข่าวสารและกิจกรรมประชาสัมพันธ์"
      description="ประกาศ ข่าวสาร กิจกรรม ผลงานนักเรียน และข่าวจัดซื้อจัดจ้าง โรงเรียนบ้านหนองหัวหมู"
      toolbar={toolbar}
    >
      <div className="space-y-8">
        {/* Featured Article Banner (Only on page 1 and if no active search) */}
        {currentPage === 1 && !searchWord && featured && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-6 aspect-[16/10] bg-slate-100 relative">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#0F2942] text-white">
                {featured.category}
              </span>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featured.date}</span>
                  <span>•</span>
                  <span>{featured.author}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors leading-snug">
                  <Link href={`/news/${featured.id}`}>{featured.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <Link
                  href={`/news/${featured.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2942] group-hover:text-blue-900"
                >
                  <span>อ่านรายละเอียดข่าวเด่น</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-slate-300 transition-colors overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F2942] text-white">
                    {news.category}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{news.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F2942] group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/news/${news.id}`}>{news.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {news.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2">
                <Link
                  href={`/news/${news.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] group-hover:text-blue-900 pt-2"
                >
                  <span>อ่านต่อ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] p-8 text-slate-500 text-sm">
            ไม่พบข่าวสารที่ตรงกับเงื่อนไขการค้นหา
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
    </InnerPageLayout>
  );
}
