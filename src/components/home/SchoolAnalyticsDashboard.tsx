"use client";

import React, { useState } from "react";
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
import { schoolStudentStats } from "@/data/studentStats";

export default function SchoolAnalyticsDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2568");
  const studentData = schoolStudentStats[selectedYear] || schoolStudentStats["2568"];

  const total = studentData.summary.totalStudents; // 105
  const kindergarten = 22; // อ.2 (10) + อ.3 (12)
  const primaryLower = 41; // ป.1 (14) + ป.2 (13) + ป.3 (14)
  const primaryUpper = 42; // ป.4 (15) + ป.5 (14) + ป.6 (13)

  const malePercent = Math.round((studentData.summary.totalMale / total) * 100); // 51%
  const femalePercent = 100 - malePercent; // 49%

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
            สถิติจำนวนนักเรียนรายระดับชั้นและสัดส่วนเพศ ประจำปีการศึกษา {selectedYear} (รวม {total} คน)
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          {["2568", "2567"].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedYear === yr
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
        
        {/* CARD 1: นักเรียนทั้งหมด 105 คน */}
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
            ข้อมูลของปีการศึกษาที่เลือก (ชาย {studentData.summary.totalMale} • หญิง {studentData.summary.totalFemale})
          </p>
        </div>

        {/* CARD 2: ปฐมวัย (อ.2 - อ.3) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <School className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/90">ระดับปฐมวัย (อ.2 - อ.3)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{kindergarten}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            2 ห้องเรียน • อ.2 (10), อ.3 (12)
          </p>
        </div>

        {/* CARD 3: ประถมต้น (ป.1 - ป.3) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#4338CA] to-[#3730A3] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/90">ประถมศึกษาตอนต้น (ป.1 - ป.3)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{primaryLower}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            3 ห้องเรียน • ป.1 (14), ป.2 (13), ป.3 (14)
          </p>
        </div>

        {/* CARD 4: ประถมปลาย (ป.4 - ป.6) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/90">ประถมศึกษาตอนปลาย (ป.4 - ป.6)</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{primaryUpper}</span>
              <span className="text-sm sm:text-base font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-xs text-white/75 mt-3 pt-3 border-t border-white/15 font-normal">
            3 ห้องเรียน • ป.4 (15), ป.5 (14), ป.6 (13)
          </p>
        </div>

      </div>

      {/* ================= CHARTS SECTION: MODERN BAR CHART + DONUT CHART ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Modern Column Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F2942] text-sm">จำนวนนักเรียนแยกตามระดับชั้น</h3>
                <p className="text-[11px] text-slate-400">เปรียบเทียบขนาดห้องเรียน (เฉลี่ย 13.1 คน/ห้อง)</p>
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
          <div className="relative pt-6 pb-2 px-2 sm:px-4 bg-gradient-to-b from-slate-50/50 to-slate-100/50 rounded-2xl border border-slate-200/80">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-4 top-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-slate-300 w-full" />
            </div>

            <div className="h-56 flex items-end justify-between gap-2 sm:gap-3 relative z-10">
              {studentData.grades.map((grade, idx) => {
                const isKindergarten = idx < 2;
                const maxStudentCount = 16;
                const heightPercent = Math.round((grade.total / maxStudentCount) * 100);

                return (
                  <div
                    key={grade.grade}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    title={`${grade.grade}: รวม ${grade.total} คน (ชาย ${grade.male}, หญิง ${grade.female})`}
                  >
                    {/* Floating Count Badge */}
                    <div className="mb-2 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs group-hover:bg-[#0F2942] group-hover:text-white group-hover:border-[#0F2942] transition-all duration-200">
                      <span className="text-[11px] font-black text-[#0F2942] group-hover:text-white">
                        {grade.total}
                      </span>
                    </div>

                    {/* Bar Column */}
                    <div className="w-full max-w-[32px] sm:max-w-[38px] h-full flex items-end justify-center">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 relative group-hover:scale-y-105 origin-bottom shadow-sm ${
                          isKindergarten
                            ? "bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300"
                            : "bg-gradient-to-t from-[#0F2942] via-blue-700 to-sky-400 group-hover:from-blue-800 group-hover:to-sky-300"
                        }`}
                      >
                        {/* Subtle Glass Highlight */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-lg" />
                      </div>
                    </div>

                    {/* Grade Label */}
                    <span className="text-[11px] font-bold text-slate-700 mt-2.5 truncate w-full text-center group-hover:text-blue-700 transition-colors">
                      {grade.grade.replace("ประถมศึกษาปีที่ ", "ป.").replace("อนุบาล ", "อ.")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>ระดับชั้น อ.2 ถึง ป.6 (รวม 8 ห้องเรียน)</span>
            <span className="font-bold text-[#0F2942] bg-slate-100 px-2.5 py-1 rounded-lg">
              ยอดรวมทั้งโรงเรียน: <strong className="text-blue-600">105</strong> คน
            </span>
          </div>
        </div>

        {/* Right: Modern Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-[#0F2942] text-sm">สัดส่วนนักเรียนตามเพศ</h3>
              <p className="text-[11px] text-slate-400">ปีการศึกษา {selectedYear}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/70">
              สมดุล 51:49
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

            {/* Donut Center Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#0F2942] tracking-tight">{total}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">คนทั้งหมด</span>
            </div>
          </div>

          {/* Ratio Breakdown Cards */}
          <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-900">นักเรียนชาย</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-[#0F2942]">{studentData.summary.totalMale} <span className="text-xs font-normal text-slate-500">คน</span></span>
                <span className="text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">{malePercent}%</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/80 border border-pink-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-pink-900">นักเรียนหญิง</span>
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-[#0F2942]">{studentData.summary.totalFemale} <span className="text-xs font-normal text-slate-500">คน</span></span>
                <span className="text-xs font-bold text-pink-700 bg-white px-2 py-0.5 rounded-md border border-pink-200">{femalePercent}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
