"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Sparkles,
  School,
  Baby,
  BookOpen
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
  const kinderPercent = total > 0 ? Math.round((kindergarten / total) * 100) : 0;
  const primaryLowerPercent = total > 0 ? Math.round((primaryLower / total) * 100) : 0;
  const primaryUpperPercent = total > 0 ? Math.round((primaryUpper / total) * 100) : 0;

  const avgPerRoom = (total / Math.max(1, studentData.summary.totalClassrooms)).toFixed(1);
  const maxGradeStudents = Math.max(15, ...studentData.grades.map((g) => g.total));

  // Donut chart calculations
  const donutSize = 160;
  const strokeWidth = 16;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleStrokeDashoffset = circumference - (malePercent / 100) * circumference;

  return (
    <section id="student-stats" className="space-y-6 scroll-mt-20">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E6EEF8]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] border border-[#C6DCFC] text-[#2F6FED] text-xs font-bold mb-1 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>สถิติจำนวนนักเรียนและโครงสร้างชั้นเรียน</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E3A5F] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#D96B34] rounded-full inline-block" />
            <span>ข้อมูลนักเรียน</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] pl-3.5">
            สถิติจำนวนนักเรียนรายระดับชั้นและสัดส่วนเพศ ประจำปีการศึกษา {activeYear} (รวม {total} คน)
          </p>
        </div>

        {/* Dynamic Year Filter */}
        <div className="flex items-center gap-1 bg-[#F4F8FD] p-1 rounded-2xl self-start sm:self-auto border border-[#E6EEF8]">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeYear === yr
                  ? "bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] text-white shadow-2xs"
                  : "text-[#64748B] hover:text-[#1E3A5F]"
              }`}
            >
              ปี {yr}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 4 STAT CARDS (Light Modern Glass) ================= */}
      {!isLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 animate-fade-in">
        
          {/* CARD 1: นักเรียนทั้งหมด (Pastel Blue) */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2F6FED] border border-blue-100">
                  100% ทั้งหมด
                </span>
              </div>
              <p className="text-sm font-semibold text-[#64748B]">นักเรียนทั้งหมด</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">{total}</span>
                <span className="text-sm sm:text-base font-bold text-[#64748B]">คน</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
              <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
                <div className="w-full h-full bg-[#2F6FED] rounded-full" />
              </div>
              <p className="text-xs text-[#64748B] mt-2 font-normal">
                ปี {activeYear} (ชาย {studentData.summary.totalMale} • หญิง {studentData.summary.totalFemale})
              </p>
            </div>
          </div>

          {/* CARD 2: ปฐมวัย (อ.2 - อ.3) (Pastel Purple) */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#F1EAFE] text-[#7C5CE0] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Baby className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C5CE0] border border-purple-100">
                  {kinderPercent}%
                </span>
              </div>
              <p className="text-sm font-semibold text-[#64748B]">ปฐมวัย (อ.2 - อ.3)</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">{kindergarten}</span>
                <span className="text-sm sm:text-base font-bold text-[#64748B]">คน</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
              <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
                <div
                  style={{ width: `${kinderPercent}%` }}
                  className="h-full bg-[#7C5CE0] rounded-full transition-all duration-700"
                />
              </div>
              <p className="text-xs text-[#64748B] mt-2 font-normal">
                เตรียมความพร้อม พัฒนาการ 4 ด้าน
              </p>
            </div>
          </div>

          {/* CARD 3: ประถมต้น (ป.1 - ป.3) (Pastel Emerald) */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#E3F7EE] text-[#16A37A] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A37A] border border-emerald-100">
                  {primaryLowerPercent}%
                </span>
              </div>
              <p className="text-sm font-semibold text-[#64748B]">ประถมต้น (ป.1 - ป.3)</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">{primaryLower}</span>
                <span className="text-sm sm:text-base font-bold text-[#64748B]">คน</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
              <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
                <div
                  style={{ width: `${primaryLowerPercent}%` }}
                  className="h-full bg-[#16A37A] rounded-full transition-all duration-700"
                />
              </div>
              <p className="text-xs text-[#64748B] mt-2 font-normal">
                เน้นการอ่านออกเขียนได้ คิดเลขเป็น
              </p>
            </div>
          </div>

          {/* CARD 4: ประถมปลาย (ป.4 - ป.6) (Pastel Orange) */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] text-[#E8772E] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#E8772E] border border-orange-100">
                  {primaryUpperPercent}%
                </span>
              </div>
              <p className="text-sm font-semibold text-[#64748B]">ประถมปลาย (ป.4 - ป.6)</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">{primaryUpper}</span>
                <span className="text-sm sm:text-base font-bold text-[#64748B]">คน</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
              <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
                <div
                  style={{ width: `${primaryUpperPercent}%` }}
                  className="h-full bg-[#E8772E] rounded-full transition-all duration-700"
                />
              </div>
              <p className="text-xs text-[#64748B] mt-2 font-normal">
                มุ่งเน้นความเป็นเลิศทางวิชาการ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILED VISUALIZATION SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8 Grade Bars (7 cols): Modern Airy Card */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-[#E6EEF8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E3A5F] text-sm sm:text-base">จำนวนนักเรียนแยกตามระดับชั้น</h3>
                <p className="text-[11px] text-[#64748B]">เปรียบเทียบขนาดห้องเรียน (เฉลี่ย {avgPerRoom} คน/ห้อง)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#64748B] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CE0]" /> ปฐมวัย
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F6FED]" /> ประถมศึกษา
              </span>
            </div>
          </div>

          {/* Chart Canvas with Guide Lines */}
          <div className="relative pt-7 pb-2 px-1 sm:px-4 bg-[#F8FAFD] rounded-2xl border border-[#EEF3FA] overflow-hidden">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-2 sm:inset-x-4 top-8 bottom-7 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-[#CBD5E1] w-full" />
              <div className="border-b border-dashed border-[#CBD5E1] w-full" />
              <div className="border-b border-dashed border-[#CBD5E1] w-full" />
              <div className="border-b border-[#E2E8F0] w-full" />
            </div>

            <div className="h-48 sm:h-56 grid grid-cols-8 gap-1 sm:gap-2.5 items-end relative z-10 w-full">
              {studentData.grades.map((grade, idx) => {
                const isKindergarten = idx < 2 || grade.grade.includes("อนุบาล") || grade.grade.includes("อ.");
                const heightPercent = Math.min(100, Math.round((grade.total / maxGradeStudents) * 88) + 12);
                const shortLabel = grade.grade
                  .replace("อนุบาล 2 (4 ขวบ)", "อ.2")
                  .replace("อนุบาล 3 (5 ขวบ)", "อ.3")
                  .replace(/อนุบาล\s*(\d+).*/, "อ.$1")
                  .replace(/ประถมศึกษาปีที่\s*(\d+).*/, "ป.$1");

                return (
                  <div
                    key={grade.grade}
                    className={`flex flex-col items-center h-full justify-end group cursor-pointer relative ${
                      idx === 1 ? "border-r border-dashed border-[#CBD5E1]/70 pr-0.5 sm:pr-1" : ""
                    }`}
                    title={`${grade.grade}: รวม ${grade.total} คน (ชาย ${grade.male}, หญิง ${grade.female})`}
                  >
                    {/* Centered Count Label */}
                    <div className="mb-1 sm:mb-1.5 flex items-center justify-center">
                      <span className="text-[11px] sm:text-xs font-black text-[#1E3A5F] group-hover:scale-110 font-mono transition-transform">
                        {grade.total}
                      </span>
                    </div>

                    {/* Bar Column on soft track */}
                    <div className="w-full max-w-[24px] sm:max-w-[34px] h-full flex items-end justify-center mx-auto bg-[#EEF3FA] rounded-full p-0.5 sm:p-1 overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-full transition-all duration-500 relative group-hover:brightness-105 shadow-2xs ${
                          isKindergarten
                            ? "bg-gradient-to-t from-[#7C5CE0] to-[#C4B5FD] group-hover:to-[#A78BFA]"
                            : "bg-gradient-to-t from-[#2F6FED] to-[#9CC3F7] group-hover:to-[#60A5FA]"
                        }`}
                      >
                        {/* Glass Highlight */}
                        <div className="absolute top-1 left-0.5 right-0.5 h-1 bg-white/50 rounded-full" />
                      </div>
                    </div>

                    {/* Uniform Short Grade Label (อ.2, อ.3, ป.1 ... ป.6) */}
                    <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center w-full transition-colors ${
                      isKindergarten ? "text-[#7C5CE0]" : "text-[#475569]"
                    }`}>
                      {shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <span>ระดับชั้น อ.2 ถึง ป.6 (รวม {studentData.summary.totalClassrooms} ห้องเรียน)</span>
            <span className="font-bold text-[#1E3A5F] sm:bg-[#F4F8FD] sm:px-2.5 sm:py-1 sm:rounded-xl sm:border sm:border-[#E6EEF8] self-start sm:self-auto">
              ยอดรวมทั้งโรงเรียน: <strong className="text-[#2F6FED] font-mono">{total}</strong> คน
            </span>
          </div>
        </div>

        {/* Right: Modern Donut Chart (5 cols): Airy Card */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-[#E6EEF8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-[#1E3A5F] text-sm sm:text-base">สัดส่วนนักเรียนตามเพศ</h3>
              <p className="text-[11px] text-[#64748B]">ปีการศึกษา {activeYear}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#E8F0FE] text-[#2F6FED] font-bold text-[11px] border border-[#C6DCFC]">
              สัดส่วน {malePercent}:{femalePercent}
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center my-2">
            <svg width={donutSize} height={donutSize} className="-rotate-90">
              {/* Female Track */}
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke="#F59E6C"
                strokeWidth={strokeWidth}
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
              <span className="text-3xl font-black text-[#1E3A5F] tracking-tight">{total}</span>
              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">นักเรียนทั้งหมด</span>
            </div>
          </div>

          {/* Gender Legend Cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3 rounded-2xl bg-[#E8F0FE] border border-[#C6DCFC] flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#2F6FED] shrink-0" />
              <div>
                <p className="text-[10px] text-[#475569] font-medium">ชาย ({malePercent}%)</p>
                <p className="text-base font-black text-[#1E3A5F]">{studentData.summary.totalMale} <span className="text-xs font-normal text-[#64748B]">คน</span></p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF0E5] border border-[#FED7AA] flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#F59E6C] shrink-0" />
              <div>
                <p className="text-[10px] text-[#475569] font-medium">หญิง ({femalePercent}%)</p>
                <p className="text-base font-black text-[#1E3A5F]">{studentData.summary.totalFemale} <span className="text-xs font-normal text-[#64748B]">คน</span></p>
              </div>
            </div>
          </div>

          {/* Quick link */}
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] whitespace-nowrap">ข้อมูล สพป. บุรีรัมย์ เขต&nbsp;3</span>
            <Link
              href="/downloads"
              className="text-xs font-bold text-[#2F6FED] hover:underline flex items-center gap-1 group"
            >
              <span>ดาวน์โหลดเอกสารสถิติ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
