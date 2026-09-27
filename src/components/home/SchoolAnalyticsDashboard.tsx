"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  BarChart3,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  School
} from "lucide-react";
import { getStoredStudentStats, fetchStudentStatsCloud, defaultSchoolStudentStats } from "@/data/studentStats";
import { MetricCardSkeleton } from "@/components/ui/Skeleton";

export default function SchoolAnalyticsDashboard() {
  const [allStats, setAllStats] = useState(defaultSchoolStudentStats);
  const [selectedYear, setSelectedYear] = useState<string>("2569");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAllStats(getStoredStudentStats());
    setIsLoaded(true);

    // Fetch from Supabase cloud — overwrites localStorage if data found
    fetchStudentStatsCloud().then((cloudData) => {
      if (cloudData) setAllStats(cloudData);
      setIsLoaded(true);
    });

    const handleUpdate = () => {
      setAllStats(getStoredStudentStats());
    };

    window.addEventListener("student_stats_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("student_stats_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const availableYears = Object.keys(allStats).sort((a, b) => b.localeCompare(a));
  const activeYear = allStats[selectedYear] ? selectedYear : availableYears[0] || "2569";
  const studentData = allStats[activeYear] || defaultSchoolStudentStats["2569"];

  const total = studentData.summary.totalStudents;
  const kindergarten = studentData.grades
    .filter((g) => g.grade.includes("อนุบาล") || g.grade.includes("อ."))
    .reduce((acc, g) => acc + g.total, 0);

  const primaryLower = studentData.grades
    .filter((g) =>
      g.grade.includes("ประถมศึกษาปีที่ 1") ||
      g.grade.includes("ประถมศึกษาปีที่ 2") ||
      g.grade.includes("ประถมศึกษาปีที่ 3") ||
      g.grade.includes("ป.1") ||
      g.grade.includes("ป.2") ||
      g.grade.includes("ป.3")
    )
    .reduce((acc, g) => acc + g.total, 0);

  const primaryUpper = studentData.grades
    .filter((g) =>
      g.grade.includes("ประถมศึกษาปีที่ 4") ||
      g.grade.includes("ประถมศึกษาปีที่ 5") ||
      g.grade.includes("ประถมศึกษาปีที่ 6") ||
      g.grade.includes("ป.4") ||
      g.grade.includes("ป.5") ||
      g.grade.includes("ป.6")
    )
    .reduce((acc, g) => acc + g.total, 0);

  const malePercent = total > 0 ? Math.round((studentData.summary.totalMale / total) * 100) : 50;
  const femalePercent = 100 - malePercent;
  const avgPerRoom = (total / Math.max(1, studentData.summary.totalClassrooms)).toFixed(1);
  const maxGradeStudents = Math.max(15, ...studentData.grades.map((g) => g.total));

  // Donut chart calculations
  const donutSize = 150;
  const strokeWidth = 16;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleStrokeDashoffset = circumference - (malePercent / 100) * circumference;

  return (
    <section id="student-stats" className="space-y-6 scroll-mt-20">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#D1DFF0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] border border-[#2F6FED]/30 text-[#1E3A5F] text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>สถิติจำนวนนักเรียนและโครงสร้างชั้นเรียน</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E3A5F] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#D96B34] rounded-full inline-block" />
            <span>ข้อมูลนักเรียน</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4B6080] pl-3.5">
            สถิติจำนวนนักเรียนรายระดับชั้นและสัดส่วนเพศ ประจำปีการศึกษา {activeYear} (รวม {total} คน)
          </p>
        </div>

        {/* Dynamic Year Filter */}
        <div className="flex items-center gap-1 bg-[#EAF2FB] p-1 rounded-xl self-start sm:self-auto border border-[#D1DFF0]">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeYear === yr
                  ? "bg-[#2F6FED] text-white shadow-2xs"
                  : "text-[#1E3A5F] hover:text-[#2F6FED]"
              }`}
            >
              ปี {yr}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      {!isLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-fade-in">
        
        {/* CARD 1: นักเรียนทั้งหมด (Primary Navy) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1E3A5F] to-[#0F2540] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group border border-[#162E4A]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <Users className="w-5 h-5 text-[#7EB8E0]" />
            </div>
            <p className="text-sm font-medium text-white/90">นักเรียนทั้งหมด</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{total}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            ปี {activeYear} (ชาย {studentData.summary.totalMale} • หญิง {studentData.summary.totalFemale})
          </p>
        </div>

        {/* CARD 2: ปฐมวัย (อ.2 - อ.3) (Teal/Emerald) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0F766E] to-[#115E59] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-teal-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <School className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/90">ปฐมวัย (อ.2 - อ.3)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{kindergarten}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            เตรียมความพร้อม พัฒนาการ 4 ด้าน
          </p>
        </div>

        {/* CARD 3: ประถมต้น (ป.1 - ป.3) (Bright Blue to Navy) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2F6FED] to-[#1E3A5F] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-[#2F6FED]/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/90">ประถมต้น (ป.1 - ป.3)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{primaryLower}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            เน้นการอ่านออกเขียนได้ คิดเลขเป็น
          </p>
        </div>

        {/* CARD 4: ประถมปลาย (ป.4 - ป.6) (Slate Navy) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#244870] to-[#162E4A] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-[#162E4A]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <Award className="w-5 h-5 text-[#D96B34]" />
            </div>
            <p className="text-sm font-medium text-white/90">ประถมปลาย (ป.4 - ป.6)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{primaryUpper}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            มุ่งเน้นความเป็นเลิศทางวิชาการ
          </p>
        </div>
        </div>
      )}

      {/* ================= DETAILED VISUALIZATION SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8 Grade Bars (7 cols): Glassmorphism */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-[#D1DFF0] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EBF2FF] text-[#2F6FED] flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E3A5F] text-sm">จำนวนนักเรียนแยกตามระดับชั้น</h3>
                <p className="text-[11px] text-[#6B7FA0]">เปรียบเทียบขนาดห้องเรียน (เฉลี่ย {avgPerRoom} คน/ห้อง)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#4B6080] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ปฐมวัย
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2F6FED]" /> ประถมศึกษา
              </span>
            </div>
          </div>

          {/* Chart Canvas with Guide Lines */}
          <div className="relative pt-6 pb-2 px-1 sm:px-4 bg-[#EAF2FB]/40 rounded-2xl border border-[#D1DFF0] overflow-hidden">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-2 sm:inset-x-4 top-8 bottom-7 flex flex-col justify-between pointer-events-none opacity-30">
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-[#D1DFF0] w-full" />
            </div>

            <div className="h-48 sm:h-56 grid grid-cols-8 gap-1 sm:gap-2.5 items-end relative z-10 w-full">
              {studentData.grades.map((grade, idx) => {
                const isKindergarten = idx < 2 || grade.grade.includes("อนุบาล") || grade.grade.includes("อ.");
                const heightPercent = Math.min(100, Math.round((grade.total / maxGradeStudents) * 90) + 10);
                const shortLabel = grade.grade
                  .replace("อนุบาล 2 (4 ขวบ)", "อ.2")
                  .replace("อนุบาล 3 (5 ขวบ)", "อ.3")
                  .replace(/อนุบาล\s*(\d+).*/, "อ.$1")
                  .replace(/ประถมศึกษาปีที่\s*(\d+).*/, "ป.$1");

                return (
                  <div
                    key={grade.grade}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer"
                    title={`${grade.grade}: รวม ${grade.total} คน (ชาย ${grade.male}, หญิง ${grade.female})`}
                  >
                    {/* Centered Count Label */}
                    <div className="mb-1 sm:mb-1.5 flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs font-black text-[#1E3A5F] group-hover:text-[#2F6FED] font-mono transition-colors">
                        {grade.total}
                      </span>
                    </div>

                    {/* Bar Column */}
                    <div className="w-full max-w-[24px] sm:max-w-[34px] h-full flex items-end justify-center mx-auto">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md sm:rounded-t-lg transition-all duration-500 relative group-hover:scale-y-105 origin-bottom shadow-xs ${
                          isKindergarten
                            ? "bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300"
                            : "bg-gradient-to-t from-[#1E3A5F] via-[#2F6FED] to-[#7EB8E0] group-hover:from-[#2F6FED] group-hover:to-[#93C5FD]"
                        }`}
                      >
                        {/* Subtle Glass Highlight */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-md sm:rounded-t-lg" />
                      </div>
                    </div>

                    {/* Uniform Short Grade Label (อ.2, อ.3, ป.1 ... ป.6) */}
                    <span className="text-[10px] sm:text-xs font-bold text-[#1E3A5F] mt-2 text-center w-full group-hover:text-[#2F6FED] transition-colors">
                      {shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-[#4B6080] pt-2 border-t border-[#D1DFF0]">
            <span>ระดับชั้น อ.2 ถึง ป.6 (รวม {studentData.summary.totalClassrooms} ห้องเรียน)</span>
            <span className="font-bold text-[#1E3A5F] sm:bg-[#EAF2FB] sm:px-2.5 sm:py-1 sm:rounded-lg sm:border sm:border-[#D1DFF0] self-start sm:self-auto">
              ยอดรวมทั้งโรงเรียน: <strong className="text-[#2F6FED] font-mono">{total}</strong> คน
            </span>
          </div>
        </div>

        {/* Right: Modern Donut Chart (5 cols): Glassmorphism */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-[#D1DFF0] shadow-xs flex flex-col justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-[#1E3A5F] text-sm">สัดส่วนนักเรียนตามเพศ</h3>
              <p className="text-[11px] text-[#6B7FA0]">ปีการศึกษา {activeYear}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EBF2FF] text-[#2F6FED] font-bold text-[11px] border border-[#2F6FED]/30">
              สัดส่วน {malePercent}:{femalePercent}
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center my-3">
            <svg width={donutSize} height={donutSize} className="-rotate-90 drop-shadow-xs">
              {/* Female Track */}
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke="#EC4899"
                strokeWidth={strokeWidth}
                opacity={0.85}
              />
              {/* Male Segment */}
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke="#2F6FED"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={maleStrokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Center Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F] tracking-tight">{total}</span>
              <span className="text-[10px] uppercase font-bold text-[#6B7FA0] tracking-wider">นักเรียน</span>
            </div>
          </div>

          {/* Gender Legend Cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3 rounded-2xl bg-[#EBF2FF] border border-[#2F6FED]/20 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#2F6FED] shrink-0" />
              <div>
                <p className="text-[10px] text-[#4B6080] font-medium">ชาย ({malePercent}%)</p>
                <p className="text-base font-black text-[#1E3A5F]">{studentData.summary.totalMale} <span className="text-xs font-normal text-[#6B7FA0]">คน</span></p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200/60 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EC4899] shrink-0" />
              <div>
                <p className="text-[10px] text-[#4B6080] font-medium">หญิง ({femalePercent}%)</p>
                <p className="text-base font-black text-[#1E3A5F]">{studentData.summary.totalFemale} <span className="text-xs font-normal text-[#6B7FA0]">คน</span></p>
              </div>
            </div>
          </div>

          {/* Quick link */}
          <div className="pt-2 border-t border-[#D1DFF0] flex items-center justify-between">
            <span className="text-[11px] text-[#6B7FA0] whitespace-nowrap">ข้อมูล สพป. บุรีรัมย์ เขต&nbsp;3</span>
            <Link
              href="/downloads"
              className="text-xs font-bold text-[#2F6FED] hover:text-[#1f5bcc] flex items-center gap-1 group"
            >
              <span>ดาวน์โหลดเอกสารสถิติ</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
