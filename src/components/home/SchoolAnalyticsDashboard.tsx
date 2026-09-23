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
import { getStoredStudentStats, defaultSchoolStudentStats } from "@/data/studentStats";

export default function SchoolAnalyticsDashboard() {
  const [allStats, setAllStats] = useState(defaultSchoolStudentStats);
  const [selectedYear, setSelectedYear] = useState<string>("2568");

  useEffect(() => {
    setAllStats(getStoredStudentStats());

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
  const activeYear = allStats[selectedYear] ? selectedYear : availableYears[0] || "2568";
  const studentData = allStats[activeYear] || defaultSchoolStudentStats["2568"];

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
    <section className="space-y-6">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-blue-700" />
            <span>สถิติจำนวนนักเรียนและโครงสร้างชั้นเรียน</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2942] tracking-tight">
            ข้อมูลนักเรียน
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            สถิติจำนวนนักเรียนรายระดับชั้นและสัดส่วนเพศ ประจำปีการศึกษา {activeYear} (รวม {total} คน)
          </p>
        </div>

        {/* Dynamic Year Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeYear === yr
                  ? "bg-[#1D4ED8] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ปี {yr}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* CARD 1: นักเรียนทั้งหมด */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <Users className="w-5 h-5" />
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

        {/* CARD 2: ปฐมวัย (อ.2 - อ.3) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
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

        {/* CARD 3: ประถมต้น (ป.1 - ป.3) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0891B2] to-[#0E7490] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
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

        {/* CARD 4: ประถมปลาย (ป.4 - ป.6) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <Award className="w-5 h-5" />
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

      {/* ================= DETAILED VISUALIZATION SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8 Grade Bars (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F2942] text-sm">จำนวนนักเรียนแยกตามระดับชั้น</h3>
                <p className="text-[11px] text-slate-400">เปรียบเทียบขนาดห้องเรียน (เฉลี่ย {avgPerRoom} คน/ห้อง)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ปฐมวัย
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> ประถมศึกษา
              </span>
            </div>
          </div>

          {/* Chart Canvas with Guide Lines */}
          <div className="relative pt-6 pb-2 px-1 sm:px-4 bg-gradient-to-b from-slate-50/50 to-slate-100/50 rounded-2xl border border-slate-200/80 overflow-hidden">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-2 sm:inset-x-4 top-8 bottom-7 flex flex-col justify-between pointer-events-none opacity-30">
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-dashed border-slate-400 w-full" />
              <div className="border-b border-slate-300 w-full" />
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
                      <span className="text-[10px] sm:text-xs font-black text-[#0F2942] group-hover:text-blue-700 font-mono transition-colors">
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
                            : "bg-gradient-to-t from-[#0F2942] via-blue-700 to-sky-400 group-hover:from-blue-800 group-hover:to-sky-300"
                        }`}
                      >
                        {/* Subtle Glass Highlight */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-md sm:rounded-t-lg" />
                      </div>
                    </div>

                    {/* Uniform Short Grade Label (อ.2, อ.3, ป.1 ... ป.6) */}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-2 text-center w-full group-hover:text-blue-700 transition-colors">
                      {shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>ระดับชั้น อ.2 ถึง ป.6 (รวม {studentData.summary.totalClassrooms} ห้องเรียน)</span>
            <span className="font-bold text-[#0F2942] sm:bg-slate-100 sm:px-2.5 sm:py-1 sm:rounded-lg self-start sm:self-auto">
              ยอดรวมทั้งโรงเรียน: <strong className="text-blue-600 font-mono">{total}</strong> คน
            </span>
          </div>
        </div>

        {/* Right: Modern Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-[#0F2942] text-sm">สัดส่วนนักเรียนตามเพศ</h3>
              <p className="text-[11px] text-slate-400">ปีการศึกษา {activeYear}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/70">
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
                stroke="#1D4ED8"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={maleStrokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Center Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#0F2942] tracking-tight">{total}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">นักเรียน</span>
            </div>
          </div>

          {/* Gender Legend Cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#1D4ED8] shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">ชาย ({malePercent}%)</p>
                <p className="text-base font-black text-[#0F2942]">{studentData.summary.totalMale} <span className="text-xs font-normal text-slate-400">คน</span></p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EC4899] shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">หญิง ({femalePercent}%)</p>
                <p className="text-base font-black text-[#0F2942]">{studentData.summary.totalFemale} <span className="text-xs font-normal text-slate-400">คน</span></p>
              </div>
            </div>
          </div>

          {/* Quick link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">ข้อมูล สพป. บุรีรัมย์ เขต 3</span>
            <Link
              href="/downloads"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
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
