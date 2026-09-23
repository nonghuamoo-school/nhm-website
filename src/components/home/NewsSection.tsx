"use client";

import React, { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsCard from "./NewsCard";
import { useNews } from "@/hooks/useNews";

export default function NewsSection() {
  const { newsList } = useNews();
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");

  const categories = ["ทั้งหมด", "ประชาสัมพันธ์", "กิจกรรม", "วิชาการ", "จัดซื้อจัดจ้าง"];

  const activeNews = newsList.filter((n) => n.status !== "ฉบับร่าง");

  const filteredNews =
    selectedCategory === "ทั้งหมด"
      ? activeNews
      : activeNews.filter((item) => item.category === selectedCategory);

  const featured = filteredNews.find((n) => n.isFeatured) || filteredNews[0];
  const remainingNews = filteredNews.filter((n) => n.id !== featured?.id).slice(0, 4);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              ข่าวสารและกิจกรรมประชาสัมพันธ์
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            ติดตามข่าวสาร ความเคลื่อนไหว และกิจกรรมภายในโรงเรียนบ้านหนองหัวหมู
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Layout: Featured on Left/Top + Grid of Smaller Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {featured && (
          <div className="lg:col-span-5">
            <NewsCard news={featured} featured={true} />
          </div>
        )}

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {remainingNews.map((news) => (
            <NewsCard key={news.id} news={news} featured={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
