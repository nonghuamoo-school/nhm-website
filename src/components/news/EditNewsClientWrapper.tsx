"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, FileQuestion } from "lucide-react";
import NewsEditor from "@/components/news/NewsEditor";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";

interface EditNewsClientWrapperProps {
  id: string;
  initialNews?: NewsItem | null;
}

export default function EditNewsClientWrapper({ id, initialNews }: EditNewsClientWrapperProps) {
  const { newsList, isLoaded } = useNews();

  const news = isLoaded
    ? newsList.find((n) => n.id === id)
    : initialNews || newsList.find((n) => n.id === id);

  if (!isLoaded && !news) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F2942]" />
        <p className="text-sm font-semibold">กำลังโหลดข้อมูลข่าว...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#0F2942]">
          ไม่พบข้อมูลข่าวสารที่ต้องการแก้ไข
        </h2>
        <p className="text-xs text-slate-500">
          ข่าวนี้อาจถูกลบไปแล้ว หรือรหัสข่าวไม่ถูกต้อง
        </p>
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังรายการข่าว</span>
        </Link>
      </div>
    );
  }

  return <NewsEditor initialData={news} isEditMode={true} />;
}
