"use client";

import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";
import { academicHighlights } from "@/data/academic";
import { TrendingUp, Award, GraduationCap, BarChart3 } from "lucide-react";

export default function AcademicPerformance() {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="ผลสัมฤทธิ์ทางการเรียนและการทดสอบระดับชาติ"
        subtitle="รายงานผลการประเมินคุณภาพการศึกษา RT (ป.1), NT (ป.3) และ O-NET (ป.6) ปีการศึกษาล่าสุด"
        actionText="ดูข้อมูลวิชาการทั้งหมด"
        actionHref="/academic"
      />

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {academicHighlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between group"
          >
            <span className="text-xs font-bold text-slate-500">{item.label}</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#0F2942]">{item.score}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
              <TrendingUp className="w-3 h-3" />
              <span>{item.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Vertical Grouped Bar Chart */}
      <AcademicPerformanceChart />
    </section>
  );
}
