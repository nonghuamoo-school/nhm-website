import React from "react";
import type { Metadata } from "next";
import NewsEditor from "@/components/news/NewsEditor";

export const metadata: Metadata = {
  title: "สร้างข่าวประชาสัมพันธ์ใหม่ | ระบบจัดการสถานศึกษา",
  description: "สร้างและเผยแพร่ข่าวประชาสัมพันธ์ กิจกรรม หรือประกาศจัดซื้อจัดจ้าง",
};

export default function NewNewsPage() {
  return <NewsEditor isEditMode={false} />;
}
