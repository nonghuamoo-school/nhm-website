"use client";

import React, { useState } from "react";
import { Users, UserCheck, School, Sparkles, Filter, Database, CheckCircle2 } from "lucide-react";
import { schoolStudentStats } from "@/data/studentStats";

export default function StudentAnalyticsWidget() {
  const [selectedYear, setSelectedYear] = useState<string>("2568");
  const stats = schoolStudentStats[selectedYear] || schoolStudentStats["2568"];

  const maxStudentCount = 15;
  const malePercent = Math.round((stats.summary.totalMale / stats.summary.totalStudents) * 100); // 51%
  const femalePercent = 100 - malePercent; // 49%

  // Donut SVG parameters
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleStrokeDashoffset = circumference - (malePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F2942]">
                สถิตินักเรียนและโครงสร้างชั้นเรียน
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                รวม 105 คน
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ข้อมูลจำนวนนักเรียนจริงรายชั้นเรียน อนุบาล 2 – ประถมศึกษาปีที่ 6
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">ปีการศึกษา:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["2568", "2567"].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedYear === yr
                    ? "bg-[#1D4ED8] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Students matching blue card */}
        <div className="bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-white/80 block">นักเรียนทั้งหมด</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.summary.totalStudents}</span>
            <span className="text-xs text-white/90">คน</span>
          </div>
          <span className="text-[10px] text-white/70 block mt-1">8 ห้องเรียน</span>
        </div>

        {/* Male */}
        <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-white/80 block">นักเรียนชาย</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.summary.totalMale}</span>
            <span className="text-xs text-white/90">คน ({malePercent}%)</span>
          </div>
          <span className="text-[10px] text-white/70 block mt-1">สัดส่วน 51%</span>
        </div>

        {/* Female */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-white/80 block">นักเรียนหญิง</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.summary.totalFemale}</span>
            <span className="text-xs text-white/90">คน ({femalePercent}%)</span>
          </div>
          <span className="text-[10px] text-white/70 block mt-1">สัดส่วน 49%</span>
        </div>

        {/* Classrooms */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-white/80 block">ห้องเรียนทั้งหมด</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">8</span>
            <span className="text-xs text-white/90">ห้อง</span>
          </div>
          <span className="text-[10px] text-emerald-100 block mt-1">เฉลี่ย 13.1 คน/ห้อง</span>
        </div>
      </div>

      {/* Main Grid: Left Capsule Bars | Right Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 8 Capsule Bars (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-[#0F2942] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>จำนวนนักเรียนแยกตามระดับชั้น (คน)</span>
            </span>
            <span className="text-[11px] text-slate-400">เฉลี่ย 13.1 คน / ห้อง</span>
          </div>

          <div className="h-48 sm:h-56 pt-6 pb-2 grid grid-cols-8 gap-1 sm:gap-2.5 items-end bg-slate-50/70 p-2 sm:p-4 rounded-2xl border border-slate-200 overflow-hidden">
            {stats.grades.map((grade) => {
              const heightPercent = Math.round((grade.total / maxStudentCount) * 85) + 15;
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
                  <span className="text-[10px] sm:text-[11px] font-bold font-mono text-[#0F2942] mb-1.5 group-hover:scale-110 transition-all">
                    {grade.total}
                  </span>

                  <div className="w-full max-w-[24px] sm:max-w-[34px] h-full flex items-end justify-center bg-slate-200/80 rounded-full p-1 overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-blue-700 via-sky-500 to-cyan-400 rounded-full group-hover:from-blue-600 group-hover:to-emerald-400 transition-all duration-500 shadow-sm relative"
                    >
                      <div className="absolute top-1 left-0.5 right-0.5 h-1 bg-white/50 rounded-full" />
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2 text-center w-full">
                    {shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Donut Chart for Male/Female ratio (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-bold text-[#0F2942]">สัดส่วนนักเรียนตามเพศ</span>

          {/* SVG Donut */}
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#C7D2FE"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
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
              <span className="text-2xl font-black text-[#0F2942] tracking-tight">{stats.summary.totalStudents}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">นักเรียนทั้งหมด</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" />
              <span className="text-slate-700 font-medium">ชาย: {stats.summary.totalMale} ({malePercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#C7D2FE]" />
              <span className="text-slate-700 font-medium">หญิง: {stats.summary.totalFemale} ({femalePercent}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
