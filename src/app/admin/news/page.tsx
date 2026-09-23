"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Filter
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";

export default function AdminNewsListPage() {
  const { newsList, deleteNews } = useNews();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ["ทั้งหมด", "ประชาสัมพันธ์", "กิจกรรม", "วิชาการ", "จัดซื้อจัดจ้าง"];

  const filteredNews = newsList.filter((item) => {
    const matchesCat =
      selectedCategory === "ทั้งหมด" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDelete = (id: string) => {
    deleteNews(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            ระบบจัดการเนื้อหา (CMS)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] mt-0.5">
            จัดการข่าวประชาสัมพันธ์และกิจกรรม
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เผยแพร่ แก้ไข และจัดหมวดหมู่ข่าวสารของสถานศึกษา
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>สร้างข่าวประชาสัมพันธ์ใหม่</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                selectedCategory === cat
                  ? "bg-[#0F2942] text-white shadow-2xs"
                  : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อข่าว..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">หัวข้อข่าว</th>
                <th className="py-3.5 px-4 hidden md:table-cell">หมวดหมู่</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">วันที่เผยแพร่</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">ยอดเข้าชม</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNews.map((news) => (
                <tr key={news.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs sm:max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {news.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {news.author}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="font-bold px-2 py-0.5 rounded bg-[#0F2942]/5 text-[#0F2942]">
                      {news.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 hidden sm:table-cell">
                    {news.date}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 hidden lg:table-cell">
                    {news.views} ครั้ง
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      เผยแพร่แล้ว
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/news/${news.id}/edit`}
                        className="p-2 rounded-lg text-slate-600 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
                        title="แก้ไขเนื้อหา"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/news/${news.id}`}
                        target="_blank"
                        className="p-2 rounded-lg text-slate-400 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
                        title="ดูหน้าจริง"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {deleteConfirmId === news.id ? (
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[10px]"
                        >
                          ยืนยันลบ
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(news.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="ลบข่าว"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            ไม่พบข่าวสารที่ตรงกับเงื่อนไข
          </div>
        )}
      </div>
    </div>
  );
}
