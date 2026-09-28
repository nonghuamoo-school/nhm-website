"use client";

import React, { useState, useEffect } from "react";
import { Users, School, Sparkles, Baby, BookOpen } from "lucide-react";
import { getStoredStudentStats, fetchStudentStatsCloud, defaultSchoolStudentStats } from "@/data/studentStats";

export default function StudentAnalyticsWidget() {
  const [allStats, setAllStats] = useState(defaultSchoolStudentStats);
  const [selectedYear, setSelectedYear] = useState<string>("2569");

  useEffect(() => {
    setAllStats(getStoredStudentStats());

    // Fetch from Supabase cloud — updates if remote data found
    fetchStudentStatsCloud().then((cloudData) => {
      if (cloudData) setAllStats(cloudData);
    });

    const handleUpdate = () => {
      const updated = getStoredStudentStats();
      setAllStats(updated);
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
  const stats = allStats[activeYear] || defaultSchoolStudentStats["2569"];

  const total = Math.max(1, stats.summary.totalStudents);
  const malePercent = Math.round((stats.summary.totalMale / total) * 100);
  const femalePercent = 100 - malePercent;
  const avgPerRoom = (stats.summary.totalStudents / Math.max(1, stats.summary.totalClassrooms)).toFixed(1);

  // Group by level
  const kindergartenGrades = stats.grades.filter((g) => g.grade.includes("อนุบาล"));
  const primaryGrades = stats.grades.filter((g) => g.grade.includes("ประถม"));
  const kinderTotal = kindergartenGrades.reduce((sum, g) => sum + g.total, 0);
  const primaryTotal = primaryGrades.reduce((sum, g) => sum + g.total, 0);
  const kinderPercent = Math.round((kinderTotal / total) * 100);
  const primaryPercent = 100 - kinderPercent;

  // Find max student grade for the "มากที่สุด" badge
  const maxGradeItem = stats.grades.reduce((max, g) => (g.total > max.total ? g : max), stats.grades[0] || { grade: "", total: 0 });
  const maxStudentCount = Math.max(15, ...stats.grades.map((g) => g.total));

  // Donut SVG parameters
  const size = 170;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleStrokeDashoffset = circumference - (malePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E6EEF8] shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#1E3A5F]">
                สถิตินักเรียนและโครงสร้างชั้นเรียน
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E3F7EE] text-[#16A37A] border border-[#C6EFE0]">
                รวม {stats.summary.totalStudents} คน
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              ข้อมูลจำนวนนักเรียนจริงรายชั้นเรียน อนุบาล 2 – ประถมศึกษาปีที่ 6 (ปีการศึกษา {activeYear})
            </p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748B]">ปีการศึกษา:</span>
          <div className="flex items-center gap-1 bg-[#F4F8FD] p-1 rounded-2xl border border-[#E6EEF8]">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeYear === yr
                    ? "bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#1E3A5F]"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Light SaaS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6EEF8] shadow-xs hover:border-[#2F6FED]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2F6FED] border border-blue-100">
              100% ทั้งหมด
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-[#64748B] block">นักเรียนทั้งหมด</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">{stats.summary.totalStudents}</span>
              <span className="text-xs font-semibold text-[#64748B]">คน</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
            <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#2F6FED] rounded-full" />
            </div>
            <span className="text-[11px] text-[#64748B] mt-1.5 block">โครงสร้าง {stats.summary.totalClassrooms} ห้องเรียน</span>
          </div>
        </div>

        {/* Card 2: Kindergarten */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6EEF8] shadow-xs hover:border-[#7C5CE0]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F1EAFE] text-[#7C5CE0] flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#7C5CE0] border border-purple-100">
              {kinderPercent}%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-[#64748B] block">ระดับปฐมวัย (อ.2 - อ.3)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">{kinderTotal}</span>
              <span className="text-xs font-semibold text-[#64748B]">คน</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
            <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
              <div
                style={{ width: `${kinderPercent}%` }}
                className="h-full bg-[#7C5CE0] rounded-full transition-all duration-700"
              />
            </div>
            <span className="text-[11px] text-[#64748B] mt-1.5 block">2 ห้องเรียน (อ.2 และ อ.3)</span>
          </div>
        </div>

        {/* Card 3: Primary */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6EEF8] shadow-xs hover:border-[#16A37A]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#E3F7EE] text-[#16A37A] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A37A] border border-emerald-100">
              {primaryPercent}%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-[#64748B] block">ประถมศึกษา (ป.1 - ป.6)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">{primaryTotal}</span>
              <span className="text-xs font-semibold text-[#64748B]">คน</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
            <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
              <div
                style={{ width: `${primaryPercent}%` }}
                className="h-full bg-[#16A37A] rounded-full transition-all duration-700"
              />
            </div>
            <span className="text-[11px] text-[#64748B] mt-1.5 block">6 ห้องเรียน (ป.1 ถึง ป.6)</span>
          </div>
        </div>

        {/* Card 4: Avg per room */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6EEF8] shadow-xs hover:border-[#E8772E]/40 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E5] text-[#E8772E] flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#E8772E] border border-orange-100">
              {stats.summary.totalClassrooms} ห้อง
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-[#64748B] block">เฉลี่ยต่อห้องเรียน</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F]">{avgPerRoom}</span>
              <span className="text-xs font-semibold text-[#64748B]">คน/ห้อง</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
            <div className="w-full h-1.5 bg-[#EEF3FA] rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-[#E8772E] rounded-full" />
            </div>
            <span className="text-[11px] text-[#64748B] mt-1.5 block">ชาย {stats.summary.totalMale} • หญิง {stats.summary.totalFemale} คน</span>
          </div>
        </div>
      </div>

      {/* Single Combined Gender Bar */}
      <div className="bg-[#F8FAFD] rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1E3A5F]">สัดส่วนนักเรียนตามเพศ (ชาย {malePercent}% : หญิง {femalePercent}%)</span>
          <span className="text-[#64748B] font-medium">รวมทั้งสิ้น {stats.summary.totalStudents} คน</span>
        </div>

        {/* Combined Bar */}
        <div className="h-3.5 bg-[#EEF3FA] rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${malePercent}%` }}
            className="bg-[#2F6FED] h-full transition-all duration-700"
            title={`ชาย: ${stats.summary.totalMale} คน (${malePercent}%)`}
          />
          <div
            style={{ width: `${femalePercent}%` }}
            className="bg-[#F59E6C] h-full transition-all duration-700"
            title={`หญิง: ${stats.summary.totalFemale} คน (${femalePercent}%)`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2F6FED]" />
            <span className="font-semibold text-[#1E3A5F]">
              นักเรียนชาย: <strong className="font-black">{stats.summary.totalMale}</strong> คน ({malePercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E6C]" />
            <span className="font-semibold text-[#1E3A5F]">
              นักเรียนหญิง: <strong className="font-black">{stats.summary.totalFemale}</strong> คน ({femalePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Grade Bars (8 cols) | Right Donut Chart (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Capsule Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E6EEF8] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-bold text-[#1E3A5F] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2F6FED]" />
              <span>จำนวนนักเรียนแยกตามระดับชั้น (คน)</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                <span className="w-2 h-2 rounded-full bg-[#7C5CE0]" /> ปฐมวัย
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                <span className="w-2 h-2 rounded-full bg-[#2F6FED]" /> ประถม
              </span>
            </div>
          </div>

          {/* Bar Chart Area with dashed grid lines */}
          <div className="relative pt-8 pb-3 px-2 sm:px-4 bg-[#F8FAFD] rounded-2xl border border-[#EEF3FA]">
            {/* Dashed Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-6 px-4">
              <div className="border-b border-dashed border-[#E2E8F0] w-full" />
              <div className="border-b border-dashed border-[#E2E8F0] w-full" />
              <div className="border-b border-dashed border-[#E2E8F0] w-full" />
            </div>

            <div className="relative z-10 h-52 sm:h-56 grid grid-cols-8 gap-1 sm:gap-3 items-end">
              {stats.grades.map((grade, index) => {
                const heightPercent = Math.min(100, Math.round((grade.total / maxStudentCount) * 82) + 18);
                const isKindergarten = grade.grade.includes("อนุบาล");
                const isMax = grade.grade === maxGradeItem.grade;
                const shortLabel = grade.grade
                  .replace("อนุบาล 2 (4 ขวบ)", "อ.2")
                  .replace("อนุบาล 3 (5 ขวบ)", "อ.3")
                  .replace(/อนุบาล\s*(\d+).*/, "อ.$1")
                  .replace(/ประถมศึกษาปีที่\s*(\d+).*/, "ป.$1");

                return (
                  <div
                    key={grade.grade}
                    className={`flex flex-col items-center h-full justify-end group cursor-pointer relative ${
                      index === 1 ? "border-r border-dashed border-[#CBD5E1]/80 pr-1 sm:pr-2" : ""
                    }`}
                    title={`${grade.grade}: รวม ${grade.total} คน (ชาย ${grade.male}, หญิง ${grade.female})`}
                  >
                    {/* "มากที่สุด" badge */}
                    {isMax && (
                      <span className="absolute -top-6 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#2F6FED] to-[#4F8CFF] text-[9px] font-bold text-white shadow-xs whitespace-nowrap animate-bounce">
                        มากที่สุด
                      </span>
                    )}

                    <span className="text-[11px] sm:text-xs font-black font-mono text-[#1E3A5F] mb-1.5 group-hover:scale-110 transition-transform">
                      {grade.total}
                    </span>

                    {/* Track + Fill */}
                    <div className="w-full max-w-[24px] sm:max-w-[34px] h-full flex items-end justify-center bg-[#EEF3FA] rounded-full p-1 overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-full transition-all duration-500 relative ${
                          isKindergarten
                            ? "bg-gradient-to-t from-[#7C5CE0] to-[#C4B5FD] group-hover:to-[#A78BFA]"
                            : "bg-gradient-to-t from-[#2F6FED] to-[#9CC3F7] group-hover:to-[#60A5FA]"
                        }`}
                      >
                        <div className="absolute top-1 left-0.5 right-0.5 h-1 bg-white/60 rounded-full" />
                      </div>
                    </div>

                    <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center w-full ${
                      isKindergarten ? "text-[#7C5CE0]" : "text-[#475569]"
                    }`}>
                      {shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Donut Chart for Male/Female ratio (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E6EEF8] flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E3A5F]">แผนภูมิวงกลมเพศ</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F8FD] text-[#64748B]">
              ปี {activeYear}
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center my-2">
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#F59E6C"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
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

            {/* Donut Center Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#1E3A5F] tracking-tight">{stats.summary.totalStudents}</span>
              <span className="text-[11px] font-bold text-[#64748B]">นักเรียนทั้งหมด</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full flex items-center justify-around text-xs pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2F6FED]" />
              <span className="text-[#1E3A5F] font-semibold">ชาย {stats.summary.totalMale} ({malePercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F59E6C]" />
              <span className="text-[#1E3A5F] font-semibold">หญิง {stats.summary.totalFemale} ({femalePercent}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
