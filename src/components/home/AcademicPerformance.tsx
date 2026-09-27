"use client";

import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";
import { academicHighlights } from "@/data/academic";
import { TrendingUp, Award, GraduationCap, BarChart3 } from "lucide-react";

interface AcademicPerformanceProps {
  showHeader?: boolean;
}

export default function AcademicPerformance({ showHeader = true }: AcademicPerformanceProps) {
  return (
    <section className="space-y-6">
      {showHeader && (
        <SectionTitle
          title="ผลสัมฤทธิ์ทางการเรียนและการทดสอบระดับชาติ"
          subtitle="รายงานผลการประเมินคุณภาพการศึกษา RT (ป.1), NT (ป.3) และ O-NET (ป.6) ปีการศึกษาล่าสุด"
          actionText="ดูข้อมูลวิชาการทั้งหมด"
          actionHref="/academic"
        />
      )}

      {/* Top 4 Metric Cards: Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {academicHighlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#D1DFF0] shadow-xs hover:border-[#2F6FED]/40 hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <span className="text-xs font-bold text-[#6B7FA0]">{item.label}</span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">{item.score}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
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
