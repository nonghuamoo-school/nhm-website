"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Settings,
  TrendingUp,
  Award,
  Sparkles,
  School,
  Building2,
  Globe2,
  CheckCircle2,
  Info,
  Calendar
} from "lucide-react";
import {
  getStoredAcademicScores,
  fetchAcademicScoresCloud,
  defaultAcademicScores,
  AllAcademicScores,
  ExamDataset,
  AcademicScoreItem
} from "@/data/academicScores";

interface AcademicPerformanceChartProps {
  showAdminLink?: boolean;
  initialExam?: "O-NET" | "RT" | "NT";
  initialYear?: string;
}

export default function AcademicPerformanceChart({
  showAdminLink = true,
  initialExam,
  initialYear,
}: AcademicPerformanceChartProps) {
  const [activeTab, setActiveTab] = useState<"O-NET" | "RT" | "NT">(initialExam || "O-NET");
  const [datasets, setDatasets] = useState<AllAcademicScores>(defaultAcademicScores);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear || "");
  const [hoveredSubject, setHoveredSubject] = useState<AcademicScoreItem | null>(null);

  const loadData = () => {
    const data = getStoredAcademicScores();
    setDatasets(data);
  };

  useEffect(() => {
    loadData();

    // Fetch from Supabase cloud
    fetchAcademicScoresCloud().then((cloudData) => {
      if (cloudData) setDatasets(cloudData);
    });

    const handleUpdate = () => loadData();
    window.addEventListener("academic_scores_updated", handleUpdate);
    return () => window.removeEventListener("academic_scores_updated", handleUpdate);
  }, []);

  // Sync prop changes if passed
  useEffect(() => {
    if (initialExam) setActiveTab(initialExam);
  }, [initialExam]);

  useEffect(() => {
    if (initialYear) setSelectedYear(initialYear);
  }, [initialYear]);

  // Compute available years for current active exam
  const examMap = datasets[activeTab] || defaultAcademicScores[activeTab] || {};
  const availableYears = Object.keys(examMap).sort((a, b) => b.localeCompare(a));
  
  const currentYear = (selectedYear && examMap[selectedYear])
    ? selectedYear
    : (availableYears[0] || "2567");

  const currentDataset: ExamDataset = examMap[currentYear] || {
    id: activeTab,
    title: `ค่าเฉลี่ยคะแนน ${activeTab}`,
    grade: activeTab === "O-NET" ? "ชั้นประถมศึกษาปีที่ 6" : activeTab === "RT" ? "ชั้นประถมศึกษาปีที่ 1" : "ชั้นประถมศึกษาปีที่ 3",
    year: currentYear,
    source: "สทศ.",
    subjects: [],
  };

  // SVG Chart Geometry Constants
  const svgWidth = 840;
  const svgHeight = 360;
  const chartTop = 40;
  const chartBottom = 300;
  const chartLeft = 55;
  const chartRight = 810;
  const plotWidth = chartRight - chartLeft;
  const plotHeight = chartBottom - chartTop;

  // Max score on Y-axis (Standard 0-100 scale)
  const maxY = 100;
  const yTicks = [100, 80, 60, 40, 20, 0];

  const subjects = currentDataset.subjects || [];
  const groupCount = Math.max(1, subjects.length);
  const groupWidth = plotWidth / groupCount;
  const barWidth = Math.min(22, (groupWidth - 40) / 3);
  const barGap = 4;

  const getYPos = (val: number) => {
    const clamped = Math.max(0, Math.min(maxY, val));
    return chartBottom - (clamped / maxY) * plotHeight;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden transition-all">
      
      {/* ================= 1. PREMIUM NAVY HEADER BANNER ================= */}
      <div className="bg-gradient-to-r from-[#0F2942] via-[#163C61] to-[#0A1D30] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              เปรียบเทียบ 3 ระดับมาตรฐาน
            </span>
            <span className="text-xs text-blue-200 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              สทศ. • ปีการศึกษา {currentYear}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            {currentDataset.title} ({currentDataset.grade})
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            เปรียบเทียบผลคะแนนเฉลี่ย: <strong className="text-emerald-400">โรงเรียน</strong> vs <strong className="text-amber-400">เขตพื้นที่</strong> vs <strong className="text-sky-300">ประเทศ</strong>
          </p>
        </div>

        {/* Tab Switcher & Year Selector */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto">
          {/* Exam Type Segmented Pill */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-inner">
            {(["O-NET", "RT", "NT"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setHoveredSubject(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[36px] ${
                    isActive
                      ? "bg-white text-[#0F2942] shadow-md scale-100"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab === "O-NET" ? "O-NET (ป.6)" : tab === "RT" ? "RT (ป.1)" : "NT (ป.3)"}
                </button>
              );
            })}
          </div>

          {/* Academic Year Switcher */}
          {availableYears.length > 1 && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-inner">
              <span className="text-[11px] text-blue-200 font-semibold px-2 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-300" />
                ปี:
              </span>
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setHoveredSubject(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentYear === yr
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 2. 3-LEVEL LEGEND BAR & QUICK SUMMARY ================= */}
      <div className="px-5 sm:px-8 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* 3 Level Legends */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-bold">
          {/* Level 1: โรงเรียน */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm border border-emerald-500/60 flex items-center justify-center">
              <School className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-slate-800">1. โรงเรียนบ้านหนองหัวหมู</span>
          </div>

          {/* Level 2: เขตพื้นที่ */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-amber-600 to-amber-400 shadow-sm border border-amber-500/60 flex items-center justify-center">
              <Building2 className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-slate-800">2. สพป. บุรีรัมย์ เขต 3</span>
          </div>

          {/* Level 3: ประเทศ */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-blue-700 to-sky-400 shadow-sm border border-blue-500/60 flex items-center justify-center">
              <Globe2 className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-slate-800">3. ระดับประเทศ</span>
          </div>
        </div>

        {/* Info hint */}
        <div className="text-slate-500 text-[11px] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>แตะหรือชี้ที่แท่งกราฟเพื่อดูสถิติเปรียบเทียบ</span>
        </div>
      </div>

      {/* ================= 3. ULTRA-MODERN CRISP SVG CHART ================= */}
      <div className="p-4 sm:p-8 relative">
        {/* Mobile scroll hint */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 py-1 px-3 bg-blue-50 border border-blue-100 rounded-full text-[11px] text-blue-700 font-bold mb-3 w-fit mx-auto shadow-2xs">
          <span>เลื่อนซ้าย-ขวาเพื่อดูกราฟเต็ม</span>
        </div>

        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[620px] sm:min-w-[680px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* School Gradient (Emerald) */}
                <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Area Gradient (Amber) */}
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* National Gradient (Royal Blue) */}
                <linearGradient id="nationalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>

                {/* Drop shadow for bars */}
                <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Y-Axis Grid Lines & Tick Labels */}
              {yTicks.map((tick) => {
                const y = getYPos(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={chartLeft}
                      y1={y}
                      x2={chartRight}
                      y2={y}
                      stroke={tick === 0 ? "#94A3B8" : "#E2E8F0"}
                      strokeWidth={tick === 0 ? "1.5" : "1"}
                      strokeDasharray={tick === 0 ? undefined : "4 4"}
                    />
                    <text
                      x={chartLeft - 12}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-400 font-mono text-[11px] font-bold"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Subject Groups & Pillars */}
              {subjects.map((item, idx) => {
                const groupCenterX = chartLeft + (idx + 0.5) * groupWidth;
                const totalBarsWidth = 3 * barWidth + 2 * barGap;
                const groupStartX = groupCenterX - totalBarsWidth / 2;

                const schoolY = getYPos(item.school);
                const schoolH = chartBottom - schoolY;

                const areaY = getYPos(item.area);
                const areaH = chartBottom - areaY;

                const nationalY = getYPos(item.national);
                const nationalH = chartBottom - nationalY;

                const isHovered = hoveredSubject?.name === item.name;
                const diffVsNat = item.school - item.national;
                const isPositive = diffVsNat >= 0;

                return (
                  <g
                    key={item.name}
                    className="cursor-pointer transition-all group"
                    onMouseEnter={() => setHoveredSubject(item)}
                    onMouseLeave={() => setHoveredSubject(null)}
                  >
                    {/* Hover column background highlight */}
                    {isHovered && (
                      <rect
                        x={chartLeft + idx * groupWidth}
                        y={chartTop}
                        width={groupWidth}
                        height={chartBottom - chartTop + 35}
                        fill="#F1F5F9"
                        rx="12"
                        opacity="0.6"
                      />
                    )}

                    {/* Bar 1: โรงเรียน (Emerald) */}
                    <g filter="url(#barShadow)">
                      <rect
                        x={groupStartX}
                        y={schoolY}
                        width={barWidth}
                        height={Math.max(2, schoolH)}
                        rx="6"
                        fill="url(#schoolGrad)"
                        className="transition-all duration-300 group-hover:brightness-110"
                      />
                      <text
                        x={groupStartX + barWidth / 2}
                        y={schoolY - 6}
                        textAnchor="middle"
                        className="font-mono text-[11px] font-black fill-emerald-800"
                      >
                        {item.school.toFixed(1)}
                      </text>
                    </g>

                    {/* Bar 2: เขตพื้นที่ (Amber) */}
                    <g filter="url(#barShadow)">
                      <rect
                        x={groupStartX + barWidth + barGap}
                        y={areaY}
                        width={barWidth}
                        height={Math.max(2, areaH)}
                        rx="6"
                        fill="url(#areaGrad)"
                        className="transition-all duration-300 group-hover:brightness-110"
                      />
                      <text
                        x={groupStartX + barWidth + barGap + barWidth / 2}
                        y={areaY - 6}
                        textAnchor="middle"
                        className="font-mono text-[10px] font-bold fill-amber-800"
                      >
                        {item.area.toFixed(1)}
                      </text>
                    </g>

                    {/* Bar 3: ประเทศ (Royal Blue) */}
                    <g filter="url(#barShadow)">
                      <rect
                        x={groupStartX + 2 * (barWidth + barGap)}
                        y={nationalY}
                        width={barWidth}
                        height={Math.max(2, nationalH)}
                        rx="6"
                        fill="url(#nationalGrad)"
                        className="transition-all duration-300 group-hover:brightness-110"
                      />
                      <text
                        x={groupStartX + 2 * (barWidth + barGap) + barWidth / 2}
                        y={nationalY - 6}
                        textAnchor="middle"
                        className="font-mono text-[10px] font-bold fill-blue-800"
                      >
                        {item.national.toFixed(1)}
                      </text>
                    </g>

                    {/* Difference Tag above group */}
                    <g transform={`translate(${groupCenterX}, ${Math.min(schoolY, areaY, nationalY) - 24})`}>
                      <rect
                        x="-24"
                        y="-10"
                        width="48"
                        height="18"
                        rx="6"
                        fill={isPositive ? "#DCFCE7" : "#FEE2E2"}
                        stroke={isPositive ? "#86EFAC" : "#FCA5A5"}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        className={`font-mono text-[9px] font-black ${
                          isPositive ? "fill-emerald-700" : "fill-rose-700"
                        }`}
                      >
                        {isPositive ? `+${diffVsNat.toFixed(1)}` : diffVsNat.toFixed(1)}
                      </text>
                    </g>

                    {/* X-Axis Category Label */}
                    <text
                      x={groupCenterX}
                      y={chartBottom + 22}
                      textAnchor="middle"
                      className={`text-xs font-bold transition-colors ${
                        isHovered ? "fill-blue-800 font-black" : "fill-slate-700"
                      }`}
                    >
                      {item.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ================= 4. EXECUTIVE COMPARATIVE DATA TABLE ================= */}
      <div className="p-4 sm:p-8 pt-0">
        <div className="sm:hidden flex items-center justify-center gap-1.5 py-1 px-3 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-700 font-bold mb-3 w-fit mx-auto shadow-2xs">
          <span>↔ เลื่อนตารางไปทางขวาเพื่อดูทุกวิชา</span>
        </div>
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-200/80 text-[#0F2942] font-black border-b border-slate-300">
                  <th className="py-3.5 px-4 text-left font-bold min-w-[210px] whitespace-nowrap sticky left-0 bg-slate-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    ระดับการประเมิน ({currentYear})
                  </th>
                  {subjects.map((s) => (
                    <th key={s.name} className="py-3 px-3 text-center font-bold min-w-[85px] sm:min-w-[100px] whitespace-nowrap">
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {/* Row 1: โรงเรียนบ้านหนองหัวหมู (Highlighted) */}
                <tr className="bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors font-bold text-emerald-950">
                  <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap min-w-[210px] sticky left-0 bg-emerald-50/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>โรงเรียนบ้านหนองหัวหมู</span>
                  </td>
                  {subjects.map((s) => (
                    <td key={s.name} className="py-3 px-3 text-center font-mono text-emerald-800 text-sm font-black whitespace-nowrap">
                      {s.school.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Row 2: สพป. บุรีรัมย์ เขต 3 */}
                <tr className="hover:bg-amber-50/30 transition-colors text-slate-800">
                  <td className="py-2.5 px-4 flex items-center gap-2 font-medium whitespace-nowrap min-w-[210px] sticky left-0 bg-white/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>สพป. บุรีรัมย์ เขต 3</span>
                  </td>
                  {subjects.map((s) => (
                    <td key={s.name} className="py-2.5 px-3 text-center font-mono text-amber-900 font-semibold whitespace-nowrap">
                      {s.area.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Row 3: ระดับประเทศ */}
                <tr className="hover:bg-blue-50/30 transition-colors text-slate-800">
                  <td className="py-2.5 px-4 flex items-center gap-2 font-medium whitespace-nowrap min-w-[210px] sticky left-0 bg-white/95 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    <span>ระดับประเทศ</span>
                  </td>
                  {subjects.map((s) => (
                    <td key={s.name} className="py-2.5 px-3 text-center font-mono text-blue-900 font-semibold whitespace-nowrap">
                      {s.national.toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Row 4: เปรียบเทียบ ส่วนต่าง (โรงเรียน vs ประเทศ) */}
                <tr className="bg-white text-[11px] font-bold border-t-2 border-slate-200">
                  <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap min-w-[210px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    ส่วนต่าง (โรงเรียน vs ประเทศ)
                  </td>
                  {subjects.map((s) => {
                    const diff = s.school - s.national;
                    const isPos = diff >= 0;
                    return (
                      <td key={s.name} className="py-2.5 px-3 text-center font-mono whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                            isPos
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <TrendingUp className="w-2.5 h-2.5" />
                          {isPos ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Admin Link */}
        {showAdminLink && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              แหล่งข้อมูล: ข้อมูลสถิติทางการจากระบบประเมินผล สทศ. / สพฐ.
            </span>
            <Link
              href="/admin/academic"
              className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 hover:underline"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>แก้ไขและตั้งค่าคะแนน 3 ระดับ ในระบบ Admin &gt;</span>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
