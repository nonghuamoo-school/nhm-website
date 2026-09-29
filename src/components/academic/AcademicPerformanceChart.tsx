"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  Layers
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
  initialExam?: "O-NET" | "NT" | "RT";
  initialYear?: string;
}

export default function AcademicPerformanceChart({
  showAdminLink = true,
  initialExam,
  initialYear,
}: AcademicPerformanceChartProps) {
  const [activeTab, setActiveTab] = useState<"O-NET" | "NT" | "RT">(initialExam || "O-NET");
  const [datasets, setDatasets] = useState<AllAcademicScores>(defaultAcademicScores);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear || "");
  const [hoveredSubject, setHoveredSubject] = useState<AcademicScoreItem | null>(null);
  const [showFullTableMobile, setShowFullTableMobile] = useState(false);
  const [activeMobileCardIndex, setActiveMobileCardIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

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
  
  // Find the latest year with actual scores entered, or fallback to availableYears[0]
  const latestYearWithScores = availableYears.find((yr) => {
    const dataset = examMap[yr];
    return dataset?.subjects?.some((s) => s.school > 0);
  });

  const currentYear = (selectedYear && examMap[selectedYear])
    ? selectedYear
    : (latestYearWithScores || availableYears[0] || "2567");

  const currentDataset: ExamDataset = examMap[currentYear] || {
    id: activeTab,
    title: `ค่าเฉลี่ยคะแนน ${activeTab}`,
    grade: activeTab === "O-NET" ? "ชั้นประถมศึกษาปีที่ 6" : activeTab === "NT" ? "ชั้นประถมศึกษาปีที่ 3" : "ชั้นประถมศึกษาปีที่ 1",
    year: currentYear,
    source: "สทศ.",
    subjects: [],
  };

  const subjects = currentDataset.subjects || [];

  // Key Achievements Calculations
  const bestSubject = subjects.length > 0 
    ? [...subjects].sort((a, b) => (b.school - b.national) - (a.school - a.national))[0]
    : null;
  const subjectsAboveNational = subjects.filter((s) => s.school >= s.national).length;

  // SVG Chart Geometry Constants
  const svgWidth = 840;
  const svgHeight = 380;
  const chartTop = 55;
  const chartBottom = 315;
  const chartLeft = 55;
  const chartRight = 810;
  const plotWidth = chartRight - chartLeft;
  const plotHeight = chartBottom - chartTop;

  // Max score on Y-axis (Standard 0-100 scale)
  const maxY = 100;
  const yTicks = [100, 80, 60, 40, 20, 0];

  const groupCount = Math.max(1, subjects.length);
  const groupWidth = plotWidth / groupCount;
  const barWidth = Math.min(26, Math.max(20, (groupWidth - 50) / 3));
  const barGap = 7;

  const getYPos = (val: number) => {
    const clamped = Math.max(0, Math.min(maxY, val));
    return chartBottom - (clamped / maxY) * plotHeight;
  };

  // Handle carousel scroll to sync pagination dots
  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / (width * 0.85));
      setActiveMobileCardIndex(Math.min(2, Math.max(0, index)));
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const card = carouselRef.current.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
    setActiveMobileCardIndex(index);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[#D1DFF0] shadow-sm overflow-hidden transition-all">
      
      {/* ================= 1. HARMONIOUS THEME HEADER BANNER ================= */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#244673] to-[#1E3A5F] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2F6FED]/30 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#2F6FED]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-40 h-40 bg-[#7FB3F5]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 border border-white/20 text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#7EB8E0]" />
              เปรียบเทียบ 3 ระดับมาตรฐาน
            </span>
            <span className="text-xs text-blue-100 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              สทศ. • ปีการศึกษา {currentYear}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#7EB8E0]" />
            <span>{currentDataset.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
            เปรียบเทียบผลคะแนนเฉลี่ย: <strong className="text-white underline decoration-[#2F6FED] decoration-2 underline-offset-2">โรงเรียน</strong> vs <strong className="text-slate-300 font-medium">เขตพื้นที่</strong> vs <strong className="text-[#7EB8E0] font-bold">ประเทศ</strong>
          </p>
        </div>

        {/* Tab Switcher & Year Selector */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto">
          {/* Exam Type Segmented Pill: O-NET (ป.6) -> NT (ป.3) -> RT (ป.1) */}
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-inner">
            {(["O-NET", "NT", "RT"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setHoveredSubject(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[36px] cursor-pointer ${
                    isActive
                      ? "bg-white text-[#1E3A5F] shadow-md scale-100"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab === "O-NET" ? "O-NET (ป.6)" : tab === "NT" ? "NT (ป.3)" : "RT (ป.1)"}
                </button>
              );
            })}
          </div>

          {/* Academic Year Switcher */}
          {availableYears.length > 1 && (
            <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-inner">
              <span className="text-[11px] text-blue-200 font-semibold px-2 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#7EB8E0]" />
                ปี:
              </span>
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setHoveredSubject(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentYear === yr
                      ? "bg-[#2F6FED] text-white shadow-md ring-2 ring-white/30"
                      : "bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border border-white/15 backdrop-blur-md"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 2. KEY ACHIEVEMENTS BAR ================= */}
      {subjects.length > 0 && (
        <div className="px-5 sm:px-8 py-3 bg-gradient-to-r from-[#EBF2FF] via-white to-[#F0FDF4] border-b border-[#D1DFF0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {bestSubject && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-[#1E3A5F] border border-[#2F6FED]/30 text-xs font-bold shadow-2xs">
                <Award className="w-4 h-4 text-[#D96B34]" />
                <span>วิชาเด่น: <strong className="text-[#2F6FED]">{bestSubject.name}</strong></span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono text-[11px] font-black border border-emerald-200">
                  ▲ +{(bestSubject.school - bestSubject.national).toFixed(2)} สูงกว่าระดับประเทศ
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-[#1E3A5F] border border-[#D1DFF0] text-xs font-bold shadow-2xs">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>สูงกว่าระดับประเทศ <strong>{subjectsAboveNational}</strong> จาก {subjects.length} วิชา</span>
            </span>
          </div>
        </div>
      )}

      {/* ================= 3. 3-LEVEL THEME LEGEND BAR ================= */}
      <div className="px-5 sm:px-8 py-2.5 bg-slate-50/80 border-b border-[#D1DFF0] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* 3 Level Legends with Highlighted School & Country, Muted District */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-bold">
          {/* Level 1: โรงเรียนบ้านหนองหัวหมู (Deep Navy Hero Bar - เด่นหลัก) */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-[#162E4E] to-[#2B5282] shadow-xs border-2 border-[#1E3A5F] flex items-center justify-center">
              <School className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-[#1E3A5F] font-black">1. โรงเรียนบ้านหนองหัวหมู (เป้าหมายหลัก)</span>
          </div>

          {/* Level 2: สพป. บุรีรัมย์ เขต 3 (Muted Slate - นวลตา ไม่แย่งสายตา) */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-[#94A3B8] to-[#CBD5E1] shadow-xs border border-[#94A3B8] flex items-center justify-center">
              <Building2 className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-[#64748B] font-medium whitespace-nowrap">2. สพป. บุรีรัมย์ เขต&nbsp;3</span>
          </div>

          {/* Level 3: ประเทศ (Vibrant Royal Blue - เด่นชัดคู่กับโรงเรียน) */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-gradient-to-t from-[#1D4ED8] to-[#3B82F6] shadow-xs border border-[#1D4ED8] flex items-center justify-center">
              <Globe2 className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-[#1D4ED8] font-black">3. ระดับประเทศ (เกณฑ์อ้างอิง)</span>
          </div>
        </div>

        {/* Info hint */}
        <div className="text-slate-500 text-[11px] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#2F6FED]" />
          <span>แตะหรือชี้ที่แท่งกราฟเพื่อดูสถิติเปรียบเทียบ</span>
        </div>
      </div>

      {/* ================= 4. ULTRA-MODERN CRISP SVG CHART ================= */}
      <div className="p-4 sm:p-8 relative">
        
        {/* Dynamic Interactive HUD Tooltip Banner */}
        {hoveredSubject ? (
          <div className="mb-3 p-3 rounded-2xl bg-[#1E3A5F] text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7EB8E0] animate-pulse" />
              <span className="font-extrabold text-sm sm:text-base">วิชา: {hoveredSubject.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm">
              <span className="text-blue-100">
                🏫 โรงเรียน: <strong className="text-white font-mono text-base font-black">{hoveredSubject.school.toFixed(2)}</strong>
              </span>
              <span className="text-blue-200">
                🏛️ เขตพื้นที่: <strong className="text-white font-mono">{hoveredSubject.area.toFixed(2)}</strong>
              </span>
              <span className="text-slate-300">
                🌐 ประเทศ: <strong className="text-white font-mono">{hoveredSubject.national.toFixed(2)}</strong>
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-black text-xs font-mono shadow-xs ${
                hoveredSubject.school >= hoveredSubject.national
                  ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                  : "bg-rose-500/25 text-rose-300 border border-rose-400/40"
              }`}>
                {hoveredSubject.school >= hoveredSubject.national
                  ? `▲ สูงกว่าประเทศ +${(hoveredSubject.school - hoveredSubject.national).toFixed(2)}`
                  : `▼ ต่ำกว่าประเทศ ${(hoveredSubject.school - hoveredSubject.national).toFixed(2)}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-3 py-1.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#2F6FED]" />
              <span>ชี้หรือแตะที่แท่งกราฟเพื่อดูคะแนนเปรียบเทียบทั้ง 3 ระดับแบบละเอียด</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">เกณฑ์ข้อมูล สทศ. / สพฐ.</span>
          </div>
        )}

        {/* Mobile scroll hint */}
        <div className="sm:hidden flex items-center justify-between py-1 px-3.5 bg-[#EAF2FB] border border-[#D1DFF0] rounded-full text-[11px] text-[#1E3A5F] font-bold mb-3 shadow-2xs">
          <span>เลื่อนซ้าย-ขวาเพื่อดูกราฟเต็ม</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#2F6FED] animate-pulse" />
        </div>

        <div className="relative group">
          <div className="w-full overflow-x-auto pb-2 scroll-smooth">
            <div className="min-w-[620px] sm:min-w-[680px]">
              <svg
                id="academic-svg-chart"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* School Gradient: Deep Navy Hero Palette with Sapphire Highlight */}
                  <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2A5A9E" />
                    <stop offset="100%" stopColor="#132644" />
                  </linearGradient>

                  {/* Area Gradient: Muted Slate-Grey (ไม่ต้องเด่นมาก) */}
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>

                  {/* National Gradient: Vibrant Royal Blue (เด่นชัดคู่กับโรงเรียน) */}
                  <linearGradient id="nationalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
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

                  const highestBarTop = Math.min(schoolY, areaY, nationalY);

                  return (
                    <g
                      key={item.name}
                      className="cursor-pointer transition-all group"
                      onMouseEnter={() => setHoveredSubject(item)}
                      onMouseLeave={() => setHoveredSubject(null)}
                      onClick={() => setHoveredSubject(item)}
                    >
                      {/* Hover column background highlight */}
                      {isHovered && (
                        <rect
                          x={chartLeft + idx * groupWidth}
                          y={chartTop}
                          width={groupWidth}
                          height={chartBottom - chartTop + 35}
                          fill="#EAF2FB"
                          rx="12"
                          opacity="0.6"
                        />
                      )}

                      {/* Bar 1: โรงเรียน (Deep Navy Hero Bar - เด่นหลัก) */}
                      <g filter="url(#barShadow)">
                        <rect
                          x={groupStartX}
                          y={schoolY}
                          width={barWidth}
                          height={Math.max(2, schoolH)}
                          rx="6"
                          fill="url(#schoolGrad)"
                          stroke="#132644"
                          strokeWidth="1.5"
                          className="transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* Prominent School Score on Top of Hero Bar */}
                        <text
                          x={groupStartX + barWidth / 2}
                          y={schoolY - 8}
                          textAnchor="middle"
                          className="font-mono text-[11px] font-black fill-[#132644] drop-shadow-xs"
                        >
                          {item.school.toFixed(2)}
                        </text>
                      </g>

                      {/* Bar 2: เขตพื้นที่ (Muted Slate - นวลตา ไม่แย่งสายตา) */}
                      <g filter="url(#barShadow)">
                        <rect
                          x={groupStartX + barWidth + barGap}
                          y={areaY}
                          width={barWidth}
                          height={Math.max(2, areaH)}
                          rx="6"
                          fill="url(#areaGrad)"
                          stroke="#94A3B8"
                          strokeWidth="1"
                          className="transition-all duration-300 group-hover:brightness-105"
                        />
                        {/* Area score visible in soft neutral tone */}
                        <text
                          x={groupStartX + barWidth + barGap + barWidth / 2}
                          y={areaY - 7}
                          textAnchor="middle"
                          className={`font-mono text-[9px] font-medium fill-[#64748B] transition-opacity duration-200 ${
                            isHovered ? "opacity-100" : "opacity-75 sm:opacity-85"
                          }`}
                        >
                          {item.area.toFixed(2)}
                        </text>
                      </g>

                      {/* Bar 3: ประเทศ (Vibrant Royal Blue - เด่นชัดคู่กับโรงเรียน) */}
                      <g filter="url(#barShadow)">
                        <rect
                          x={groupStartX + 2 * (barWidth + barGap)}
                          y={nationalY}
                          width={barWidth}
                          height={Math.max(2, nationalH)}
                          rx="6"
                          fill="url(#nationalGrad)"
                          stroke="#1E40AF"
                          strokeWidth="1.5"
                          className="transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* National score visible in prominent blue */}
                        <text
                          x={groupStartX + 2 * (barWidth + barGap) + barWidth / 2}
                          y={nationalY - 7}
                          textAnchor="middle"
                          className="font-mono text-[9.5px] font-bold fill-[#1D4ED8]"
                        >
                          {item.national.toFixed(2)}
                        </text>
                      </g>

                      {/* Directional Difference Tag with Clear Floating Headroom (NO OVERLAP) */}
                      <g transform={`translate(${groupCenterX}, ${highestBarTop - 34})`}>
                        <rect
                          x="-32"
                          y="-9"
                          width="64"
                          height="18"
                          rx="6"
                          fill={isPositive ? "#DCFCE7" : "#FEE2E2"}
                          stroke={isPositive ? "#86EFAC" : "#FCA5A5"}
                          strokeWidth="1.2"
                          filter="url(#barShadow)"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          className={`font-mono text-[9px] font-black tracking-tight ${
                            isPositive ? "fill-emerald-800" : "fill-rose-800"
                          }`}
                        >
                          {isPositive ? `▲ +${diffVsNat.toFixed(2)}` : `▼ ${diffVsNat.toFixed(2)}`}
                        </text>
                      </g>

                      {/* X-Axis Category Label */}
                      <text
                        x={groupCenterX}
                        y={chartBottom + 22}
                        textAnchor="middle"
                        className={`text-xs font-bold transition-colors ${
                          isHovered ? "fill-[#1E3A5F] font-black" : "fill-slate-700"
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

          {/* Fade Shadow Mask on right on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white via-white/80 to-transparent sm:hidden flex items-center justify-end pr-1 text-[#2F6FED]/70">
            <ChevronRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ================= 5. MOBILE-FRIENDLY CAROUSEL & COMPARATIVE DATA ================= */}
      <div className="p-4 sm:p-8 pt-0">
        
        {/* Mobile View: 3-Card Snap Carousel */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2F6FED]" />
              <span>สรุปผลคะแนน 3 ระดับ (ปัดซ้าย-ขวา):</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              การ์ด {activeMobileCardIndex + 1} / 3
            </span>
          </div>

          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {/* Card 1: โรงเรียนบ้านหนองหัวหมู */}
            <div className="snap-center shrink-0 w-[86vw] rounded-2xl bg-[#EAF2FB] border-2 border-[#1E3A5F] p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#D1DFF0]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center shadow-xs">
                    <School className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-[#1E3A5F]">1. โรงเรียนบ้านหนองหัวหมู</h4>
                    <span className="text-[10.5px] text-[#2F6FED] font-bold">ผลคะแนนเฉลี่ยทางการ</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold">
                  ระดับโรงเรียน
                </span>
              </div>
              <div className="divide-y divide-[#D1DFF0] text-xs pt-2">
                {subjects.map((s) => {
                  const diff = s.school - s.national;
                  const isPos = diff >= 0;
                  return (
                    <div key={s.name} className="py-2 flex items-center justify-between">
                      <span className="font-bold text-[#1E3A5F]">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-[#1E3A5F]">{s.school.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isPos ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {isPos ? `▲ +${diff.toFixed(2)}` : `▼ ${diff.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: สพป. บุรีรัมย์ เขต 3 (Muted Slate) */}
            <div className="snap-center shrink-0 w-[86vw] rounded-2xl bg-white border border-[#CBD5E1] p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#94A3B8] text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-[#1E3A5F]">2. สพป. บุรีรัมย์ เขต 3</h4>
                    <span className="text-[10.5px] text-slate-500 font-semibold">ค่าเฉลี่ยเขตพื้นที่การศึกษา</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                  ระดับเขต
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs pt-2">
                {subjects.map((s) => (
                  <div key={s.name} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{s.name}</span>
                    <span className="font-mono text-sm font-medium text-[#64748B]">{s.area.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: ระดับประเทศ (Prominent Royal Blue) */}
            <div className="snap-center shrink-0 w-[86vw] rounded-2xl bg-[#EFF6FF] border-2 border-[#1D4ED8] p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center shadow-xs">
                    <Globe2 className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-[#1E3A5F]">3. ระดับประเทศ</h4>
                    <span className="text-[10.5px] text-[#1D4ED8] font-bold">เกณฑ์มาตรฐาน สทศ. ทั่วประเทศ</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#1D4ED8] text-white text-[10px] font-bold">
                  เกณฑ์ประเทศ
                </span>
              </div>
              <div className="divide-y divide-blue-200/50 text-xs pt-2">
                {subjects.map((s) => (
                  <div key={s.name} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="font-mono text-sm font-black text-[#1D4ED8]">{s.national.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeMobileCardIndex === idx
                    ? "w-6 bg-[#2F6FED]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`ไปที่การ์ดที่ ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Table Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFullTableMobile(!showFullTableMobile)}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#EAF2FB] hover:bg-[#D8E6F8] text-[#1E3A5F] text-xs font-bold border border-[#D1DFF0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <TableIcon className="w-3.5 h-3.5 text-[#2F6FED]" />
            <span>{showFullTableMobile ? "ซ่อนตารางเปรียบเทียบ" : "ดูข้อมูลแบบตารางเปรียบเทียบเต็ม"}</span>
            {showFullTableMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detailed Table (Item 4: Summary Table with High-Contrast Row Highlights) */}
        <div className={`${showFullTableMobile ? "block" : "hidden sm:block"}`}>
          <div className="relative group">
            <div className="bg-slate-50/80 rounded-2xl border border-[#D1DFF0] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto scroll-smooth">
                <table className="w-full min-w-[620px] text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#EAF2FB] text-[#1E3A5F] font-black border-b border-[#D1DFF0]">
                      <th className="py-3.5 px-4 text-left font-bold min-w-[210px] whitespace-nowrap sticky left-0 bg-[#EAF2FB] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        ระดับการประเมิน ({currentYear})
                      </th>
                      {subjects.map((s) => (
                        <th key={s.name} className="py-3 px-3 text-center font-bold min-w-[85px] sm:min-w-[100px] whitespace-nowrap">
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D1DFF0]/60">
                    {/* Row 1: โรงเรียนบ้านหนองหัวหมู (Highlighted Hero Row) */}
                    <tr className="bg-[#EAF2FB]/80 hover:bg-[#EAF2FB] transition-colors font-bold text-[#1E3A5F] border-l-4 border-l-[#1E3A5F]">
                      <td className="py-3.5 px-4 flex items-center gap-2 whitespace-nowrap min-w-[210px] sticky left-0 bg-[#F2F7FD] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A5F] shrink-0" />
                        <span className="font-black">1. โรงเรียนบ้านหนองหัวหมู</span>
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-[#1E3A5F] text-white text-[9.5px] font-bold">
                          โรงเรียน
                        </span>
                      </td>
                      {subjects.map((s) => (
                        <td key={s.name} className="py-3 px-3 text-center font-mono text-[#132644] text-sm font-black whitespace-nowrap">
                          {s.school.toFixed(2)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 2: สพป. บุรีรัมย์ เขต 3 (Muted Slate Row) */}
                    <tr className="hover:bg-slate-50 transition-colors text-slate-700">
                      <td className="py-2.5 px-4 flex items-center gap-2 font-medium whitespace-nowrap min-w-[210px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] shrink-0" />
                        <span className="text-slate-600">2. สพป. บุรีรัมย์ เขต&nbsp;3</span>
                      </td>
                      {subjects.map((s) => (
                        <td key={s.name} className="py-2.5 px-3 text-center font-mono text-[#64748B] font-medium whitespace-nowrap">
                          {s.area.toFixed(2)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 3: ระดับประเทศ (Prominent Royal Blue Row) */}
                    <tr className="hover:bg-blue-50/30 transition-colors text-slate-800">
                      <td className="py-2.5 px-4 flex items-center gap-2 font-bold whitespace-nowrap min-w-[210px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shrink-0" />
                        <span className="text-[#1D4ED8]">3. ระดับประเทศ</span>
                      </td>
                      {subjects.map((s) => (
                        <td key={s.name} className="py-2.5 px-3 text-center font-mono text-[#1D4ED8] font-bold whitespace-nowrap">
                          {s.national.toFixed(2)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: เปรียบเทียบ ส่วนต่าง (โรงเรียน vs ประเทศ) */}
                    <tr className="bg-white text-[11px] font-bold border-t-2 border-[#D1DFF0]">
                      <td className="py-2.5 px-4 text-slate-600 font-bold whitespace-nowrap min-w-[210px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                        ส่วนต่าง (เทียบระดับประเทศ)
                      </td>
                      {subjects.map((s) => {
                        const diff = s.school - s.national;
                        const isPos = diff >= 0;
                        return (
                          <td key={s.name} className="py-2.5 px-3 text-center font-mono whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-black text-xs ${
                                isPos
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-rose-100 text-rose-800 border border-rose-300"
                              }`}
                            >
                              {isPos ? `▲ +${diff.toFixed(2)}` : `▼ ${diff.toFixed(2)}`}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Fade Shadow Mask on mobile for table */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent sm:hidden flex items-center justify-end pr-0.5 text-[#2F6FED]">
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </div>
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
              className="inline-flex items-center gap-1.5 font-bold text-[#2F6FED] hover:text-[#1f5bcc] hover:underline"
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
