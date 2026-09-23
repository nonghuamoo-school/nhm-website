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
            โครงสร้างประชากรนักเรียนและการกระจายตัวชั้นเรียน (Student Demographics)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            แผนภูมิแสดงการกระจายตัวของนักเรียนรายระดับชั้นและสัดส่วนเพศ ประจำปีการศึกษา {selectedYear} (รวม {total} คน)
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

      {/* ================= CHARTS SECTION: CAPSULE BARS + DONUT CHART ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8 Capsule "แท่งไฟ" Bars (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F2942] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>จำนวนนักเรียนแยกตามระดับชั้น (คน)</span>
            </span>
            <span className="text-[11px] text-slate-400">เฉลี่ย 13.1 คน / ห้อง</span>
          </div>

          <div className="h-60 pt-6 pb-2 flex items-end justify-between gap-1.5 sm:gap-2.5 bg-slate-50/70 p-3 sm:p-4 rounded-2xl border border-slate-200">
            {studentData.grades.map((grade) => {
              const maxStudentCount = 15;
              const heightPercent = Math.round((grade.total / maxStudentCount) * 85) + 15;

              return (
                <div
                  key={grade.grade}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  title={`${grade.grade}: รวม ${grade.total} คน (ชาย ${grade.male}, หญิง ${grade.female})`}
                >
                  <span className="text-[11px] font-bold font-mono text-[#0F2942] mb-1.5 group-hover:scale-110 transition-all">
                    {grade.total}
                  </span>

                  <div className="w-full max-w-[34px] h-full flex items-end justify-center bg-slate-200/70 rounded-full p-1 overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-blue-700 via-sky-500 to-cyan-400 rounded-full group-hover:from-blue-600 group-hover:to-emerald-400 transition-all duration-500 shadow-sm relative"
                    >
                      <div className="absolute top-1 left-0.5 right-0.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                    {grade.grade.replace("ประถมศึกษาปีที่ ", "ป.").replace("อนุบาล ", "อ.")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>อนุบาล 2 - ประถมศึกษาปีที่ 6 (รวม 8 ห้องเรียน)</span>
            <span className="font-bold text-blue-700">รวม 105 คน</span>
          </div>
        </div>

        {/* Right: Donut Chart for Male/Female ratio (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-bold text-[#0F2942]">สัดส่วนนักเรียนตามเพศ</span>
            <span className="text-slate-400">ปีการศึกษา {selectedYear}</span>
          </div>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center my-2">
            <svg width={donutSize} height={donutSize} className="-rotate-90">
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke="#C7D2FE"
                strokeWidth={strokeWidth}
              />
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
              <span className="text-3xl font-black text-[#0F2942] tracking-tight">{total}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">นักเรียนทั้งหมด</span>
            </div>
          </div>

          {/* Ratio Breakdown */}
          <div className="w-full grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-center">
              <span className="text-[11px] font-bold text-blue-800 block">นักเรียนชาย</span>
              <span className="text-base font-black text-blue-900">{studentData.summary.totalMale} คน ({malePercent}%)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-center">
              <span className="text-[11px] font-bold text-indigo-800 block">นักเรียนหญิง</span>
              <span className="text-base font-black text-indigo-900">{studentData.summary.totalFemale} คน ({femalePercent}%)</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
