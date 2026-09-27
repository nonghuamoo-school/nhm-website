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
  Filter,
  Share2,
  Images,
  Paperclip,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import Swal from "sweetalert2";

export default function AdminNewsListPage() {
  const { newsList, deleteNews, resetToDefault, isCloudSynced } = useNews();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsList.filter((item) => {
    const titleMatch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = (item.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || excerptMatch;
  });

  const handleDelete = async (news: NewsItem) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบข่าวประชาสัมพันธ์?",
      text: `คุณต้องการลบข่าว "${news.title}" หรือไม่? ข่าวจะถูกนำออกจากทุกหน้าและคลาวด์ทันที`,
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบข่าวนี้",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
    });

    if (result.isConfirmed) {
      await deleteNews(news.id);
      Swal.fire({
        icon: "success",
        title: "ลบข่าวเรียบร้อยแล้ว",
        timer: 1600,
        showConfirmButton: false,
      });
    }
  };

  const handleResetDefaults = async () => {
    const res = await Swal.fire({
      icon: "question",
      title: "กู้คืนข่าวตัวอย่างเริ่มต้น?",
      text: "ระบบจะโหลดข่าวประชาสัมพันธ์ตัวอย่างตั้งต้นกลับคืนมา",
      showCancelButton: true,
      confirmButtonText: "ตกลง กู้คืน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#1E3A5F",
    });

    if (res.isConfirmed) {
      await resetToDefault();
      Swal.fire({
        icon: "success",
        title: "กู้คืนข้อมูลสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card-admin rounded-2xl p-6 border border-[#D1DFF0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              ระบบจัดการเนื้อหา (CMS)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Sync</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F]">
            จัดการข่าวประชาสัมพันธ์และกิจกรรม
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เผยแพร่ แก้ไข แนบรูปภาพกิจกรรม และเชื่อมโยงโพสต์ Facebook
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D1DFF0] bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs shadow-2xs transition-colors min-h-[44px] box-border"
            title="กู้คืนข่าวตัวอย่างเริ่มต้นหากตารางว่าง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">กู้คืนข่าวเริ่มต้น</span>
          </button>

          <Link
            href="/admin/news/new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#2558CA] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px] box-border"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>สร้างข่าวประชาสัมพันธ์ใหม่</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card-admin rounded-2xl p-4 sm:p-5 border border-[#D1DFF0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* News Count Summary */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E3A5F] text-white border border-[#1E3A5F] shadow-xs">
            <Megaphone className="w-3.5 h-3.5 text-[#D96B34]" />
            <span>ข่าวประชาสัมพันธ์ทั้งหมด ({filteredNews.length} รายการ)</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อข่าว..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED] min-h-[38px]"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="glass-card-admin rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E3A5F]/5 border-b border-[#D1DFF0] text-[#1E3A5F] font-semibold uppercase">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">หัวข้อข่าวและสิ่งที่แนบ</th>
                <th className="py-3.5 px-4 hidden md:table-cell">หมวดหมู่</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">วันที่เผยแพร่</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">ยอดเข้าชม</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1DFF0]">
              {filteredNews.map((news, idx) => (
                <tr
                  key={news.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#EAF2FB]/35"
                  } hover:bg-[#EBF2FF]/60`}
                >
                  <td className="py-3.5 px-4 sm:px-6 max-w-sm sm:max-w-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 mt-0.5">
                        <img
                          src={news.imageUrl || "/images/school-emblem-doc.png"}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <span className="font-bold text-[#1E3A5F] block leading-snug line-clamp-2 thai-wrap">
                          {news.title}
                        </span>
                        
                        {/* Badges for Attachments, Facebook, and Gallery */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {news.facebookUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1877F2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <Share2 className="w-3 h-3" />
                              <span>มีลิงก์ FB</span>
                            </span>
                          )}

                          {news.galleryImages && news.galleryImages.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D96B34] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              <Images className="w-3 h-3 text-[#D96B34]" />
                              <span>{news.galleryImages.length} รูปกิจกรรม</span>
                            </span>
                          )}

                          {news.attachments && news.attachments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              <Paperclip className="w-3 h-3 text-slate-500" />
                              <span>{news.attachments.length} เอกสาร</span>
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 block truncate">
                            {news.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="font-bold px-2 py-0.5 rounded bg-[#1E3A5F]/10 text-[#1E3A5F]">
                      {news.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#4B6080] hidden sm:table-cell">
                    {news.date}
                  </td>
                  <td className="py-3.5 px-4 text-[#4B6080] hidden lg:table-cell">
                    {news.views} ครั้ง
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      news.status === "ฉบับร่าง"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {news.status || "เผยแพร่แล้ว"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/news/${news.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#2F6FED] bg-[#EBF2FF] hover:bg-[#2F6FED] hover:text-white transition-colors border border-[#2F6FED]/25 shadow-2xs"
                        title="แก้ไขเนื้อหา"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">แก้ไข</span>
                      </Link>
                      <Link
                        href={`/news/${news.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-[#1E3A5F] bg-[#EAF2FB] hover:bg-[#1E3A5F] hover:text-white transition-colors border border-[#D1DFF0]"
                        title="ดูหน้าจริง"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(news)}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors border border-rose-200 cursor-pointer"
                        title="ลบข่าว"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">ไม่พบข่าวสารที่ตรงกับเงื่อนไข</p>
              <p className="text-xs text-slate-400 mt-0.5">
                ลองเปลี่ยนคำค้นหา หรือกดสร้างข่าวประชาสัมพันธ์ใหม่
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                กู้คืนข่าวตัวอย่างเริ่มต้น
              </button>
              <Link
                href="/admin/news/new"
                className="px-4 py-2 rounded-xl bg-[#2F6FED] text-white text-xs font-bold hover:bg-[#2558CA] transition-colors"
              >
                สร้างข่าวประชาสัมพันธ์ใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
