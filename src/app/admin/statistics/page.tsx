"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  TrendingUp,
  Calendar,
  BarChart3,
  FileText,
  Globe,
  ArrowUpRight,
  Clock,
  Users,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  GraduationCap
} from "lucide-react";
import { visitorService } from "@/services/visitorService";
import StudentAnalyticsWidget from "@/components/charts/StudentAnalyticsWidget";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";
import {
  getStoredStudentStats,
  saveStoredStudentStats,
  resetStoredStudentStats,
  fetchStudentStatsCloud,
  defaultSchoolStudentStats
} from "@/data/studentStats";
import { StudentYearStat, StudentGradeStat } from "@/types";

const defaultGradeTemplate: StudentGradeStat[] = [
  { grade: "อนุบาล 2 (4 ขวบ)", male: 5, female: 5, total: 10, classrooms: 1 },
  { grade: "อนุบาล 3 (5 ขวบ)", male: 6, female: 6, total: 12, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 1", male: 7, female: 7, total: 14, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 2", male: 7, female: 6, total: 13, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 3", male: 8, female: 6, total: 14, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 4", male: 8, female: 7, total: 15, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 5", male: 7, female: 7, total: 14, classrooms: 1 },
  { grade: "ประถมศึกษาปีที่ 6", male: 6, female: 7, total: 13, classrooms: 1 },
];

export default function AdminStatisticsPage() {
  const [activeTab, setActiveTab] = useState<"visitors" | "students">("visitors");
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  
  // Student statistics state
  const [allStudentStats, setAllStudentStats] = useState<Record<string, StudentYearStat>>(defaultSchoolStudentStats);
  const [selectedStudentYear, setSelectedStudentYear] = useState<string>("2569");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [newYearInput, setNewYearInput] = useState("");
  const [showAddYearModal, setShowAddYearModal] = useState(false);

  useEffect(() => {
    const data = getStoredStudentStats();
    setAllStudentStats(data);
    const years = Object.keys(data).sort((a, b) => b.localeCompare(a));
    if (years.length > 0 && !data[selectedStudentYear]) {
      setSelectedStudentYear(years[0]);
    }

    // Fetch from Supabase cloud
    fetchStudentStatsCloud().then((cloudData) => {
      if (cloudData) {
        setAllStudentStats(cloudData);
        const cloudYears = Object.keys(cloudData).sort((a, b) => b.localeCompare(a));
        if (cloudYears.length > 0) {
          setSelectedStudentYear(cloudYears[0]);
        }
      }
    });
  }, []);

  const stats = visitorService.getVisitorStats();
  const maxDaily = Math.max(1, ...stats.dailyTrend.map((d) => d.views));
  const maxMonthly = Math.max(1, ...stats.monthlyTrend.map((m) => m.views));

  // Current year student data
  const availableYears = Object.keys(allStudentStats).sort((a, b) => b.localeCompare(a));
  const activeYearData = allStudentStats[selectedStudentYear] || allStudentStats[availableYears[0]] || defaultSchoolStudentStats["2569"];

  // Handle grade change for student data
  const handleGradeChange = (
    gradeIndex: number,
    field: "male" | "female" | "classrooms",
    val: string
  ) => {
    const num = val === "" ? 0 : parseInt(val, 10);
    const safeNum = isNaN(num) ? 0 : Math.max(0, num);

    const updatedGrades = [...activeYearData.grades];
    const targetGrade = { ...updatedGrades[gradeIndex], [field]: safeNum };
    targetGrade.total = targetGrade.male + targetGrade.female;
    updatedGrades[gradeIndex] = targetGrade;

    // Recalculate summary totals
    const totalMale = updatedGrades.reduce((sum, g) => sum + g.male, 0);
    const totalFemale = updatedGrades.reduce((sum, g) => sum + g.female, 0);
    const totalStudents = totalMale + totalFemale;
    const totalClassrooms = updatedGrades.reduce((sum, g) => sum + g.classrooms, 0);

    const updatedYearData: StudentYearStat = {
      ...activeYearData,
      grades: updatedGrades,
      summary: {
        totalMale,
        totalFemale,
        totalStudents,
        totalClassrooms,
      },
    };

    setAllStudentStats((prev) => ({
      ...prev,
      [selectedStudentYear]: updatedYearData,
    }));
  };

  const handleUpdatedDateChange = (val: string) => {
    setAllStudentStats((prev) => ({
      ...prev,
      [selectedStudentYear]: {
        ...activeYearData,
        updatedDate: val,
      },
    }));
  };

  // Add a new academic year (e.g. 2566, 2565)
  const handleCreateNewYear = () => {
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      alert("กรุณาระบุปีการศึกษา เช่น 2566 หรือ 2565");
      return;
    }
    if (allStudentStats[trimmed]) {
      alert(`มีข้อมูลปีการศึกษา ${trimmed} อยู่แล้ว`);
      setSelectedStudentYear(trimmed);
      setShowAddYearModal(false);
      setNewYearInput("");
      return;
    }

    const newGrades = defaultGradeTemplate.map((g) => ({ ...g }));
    const totalMale = newGrades.reduce((sum, g) => sum + g.male, 0);
    const totalFemale = newGrades.reduce((sum, g) => sum + g.female, 0);

    const newRecord: StudentYearStat = {
      academicYear: trimmed,
      updatedDate: `10 มิถุนายน ${trimmed}`,
      grades: newGrades,
      summary: {
        totalMale,
        totalFemale,
        totalStudents: totalMale + totalFemale,
        totalClassrooms: newGrades.reduce((sum, g) => sum + g.classrooms, 0),
      },
    };

    const updated = { ...allStudentStats, [trimmed]: newRecord };
    setAllStudentStats(updated);
    setSelectedStudentYear(trimmed);
    saveStoredStudentStats(updated);
    setShowAddYearModal(false);
    setNewYearInput("");

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Delete current academic year
  const handleDeleteCurrentYear = () => {
    if (availableYears.length <= 1) {
      alert("ไม่สามารถลบปีการศึกษาได้ เนื่องจากต้องมีข้อมูลอย่างน้อย 1 ปีการศึกษา");
      return;
    }
    if (confirm(`คุณต้องการลบข้อมูลสถิตินักเรียนปีการศึกษา ${selectedStudentYear} ใช่หรือไม่?`)) {
      const updated = { ...allStudentStats };
      delete updated[selectedStudentYear];
      const remainingYears = Object.keys(updated).sort((a, b) => b.localeCompare(a));
      setAllStudentStats(updated);
      setSelectedStudentYear(remainingYears[0]);
      saveStoredStudentStats(updated);
    }
  };

  // Save student stats
  const handleSaveStudentStats = () => {
    saveStoredStudentStats(allStudentStats);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Reset student stats
  const handleResetStudentStats = () => {
    if (confirm("คุณต้องการรีเซ็ตข้อมูลสถิตินักเรียนกลับเป็นค่าเริ่มต้นมาตรฐานหรือไม่?")) {
      resetStoredStudentStats();
      setAllStudentStats(defaultSchoolStudentStats);
      setSelectedStudentYear("2569");
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ================= 1. PAGE HEADER ================= */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-blue-700 font-medium">
              แดชบอร์ด
            </Link>
            <span>/</span>
            <span className="text-[#0F2942] font-semibold">สถิติและข้อมูลนักเรียน</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">
            ศูนย์ข้อมูลสถิติและการวิเคราะห์สถานศึกษา
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ติดตามยอดผู้เข้าชมเว็บไซต์ และจัดการข้อมูลสถิตินักเรียนรายปีการศึกษา (อนุบาล 2 – ป.6)
          </p>
        </div>

        {/* 2 Top Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("visitors")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === "visitors"
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>1. สถิติผู้เข้าชมเว็บไซต์</span>
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === "students"
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>2. จัดการข้อมูลนักเรียนรายปี</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-white font-bold">
              {availableYears.length} ปี
            </span>
          </button>
        </div>
      </div>

      {/* Success Banners */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>บันทึกข้อมูลสถิตินักเรียนเรียบร้อยแล้ว! ทุกหน้าเว็บ หน้าแรก และเอกสารดาวน์โหลดอัปเดตแบบ Real-time ทันที</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>รีเซ็ตข้อมูลสถิตินักเรียนกลับเป็นค่าเริ่มต้นมาตรฐานเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* ================= TAB 1: VISITOR ANALYTICS ================= */}
      {activeTab === "visitors" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              ช่วงเวลาการวิเคราะห์:
            </span>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold shadow-2xs">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === "7d"
                    ? "bg-[#0F2942] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ย้อนหลัง 7 วัน
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === "30d"
                    ? "bg-[#0F2942] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                รายเดือน (30 วัน)
              </button>
            </div>
          </div>

          {/* 4 Analytical KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">วันนี้</span>
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F2942] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0F2942]">
                {stats.today.toLocaleString()} ครั้ง
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+14% จากเฉลี่ยรายวัน</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">สัปดาห์นี้</span>
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0F2942]">
                {stats.thisWeek.toLocaleString()} ครั้ง
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                เฉลี่ย 180 ครั้ง/วัน
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">เดือนนี้</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0F2942]">
                {stats.thisMonth.toLocaleString()} ครั้ง
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                ครอบคลุมทุกช่องทาง
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">ยอดรวมทั้งหมด</span>
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-[#0F2942]">
                {stats.total.toLocaleString()} ครั้ง
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                แสดงบนแถบ Utility Bar สาธารณะ
              </span>
            </div>
          </div>

          {/* Chart Visualization Section */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-base font-bold text-[#0F2942]">
                  {timeRange === "7d"
                    ? "กราฟแสดงแนวโน้มผู้เข้าชมย้อนหลัง 7 วัน"
                    : "กราฟแสดงแนวโน้มผู้เข้าชมย้อนหลัง 6 เดือน"}
                </h2>
                <p className="text-xs text-slate-500">
                  {timeRange === "7d"
                    ? "จำแนกจำนวนการเข้าชมตามวันในสัปดาห์"
                    : "จำแนกจำนวนการเข้าชมตามรายเดือน"}
                </p>
              </div>
            </div>

            {timeRange === "7d" ? (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 pt-6">
                  {stats.dailyTrend.map((d, i) => {
                    const heightPercent = Math.round((d.views / maxDaily) * 100);
                    return (
                      <div key={i} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-bold text-[#0F2942] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.views}
                        </span>
                        <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-[#0F2942] group-hover:bg-[#163C61] rounded-t-lg transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 mt-2">
                          {d.day}
                        </span>
                        <span className="text-[10px] text-slate-400">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-44 sm:h-52 pt-6">
                  {stats.monthlyTrend.map((m, i) => {
                    const heightPercent = Math.round((m.views / maxMonthly) * 100);
                    return (
                      <div key={i} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-bold text-[#0F2942] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {m.views.toLocaleString()}
                        </span>
                        <div className="w-full max-w-[44px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-[#0F2942] group-hover:bg-[#163C61] rounded-t-lg transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 mt-2">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Two Column Breakdown Tables: Popular Pages & Popular News */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
                <Globe className="w-4 h-4 text-[#0F2942]" />
                <h3 className="text-sm font-bold text-[#0F2942]">
                  หน้าเว็บที่มีผู้เข้าชมสูงสุด (Popular Pages)
                </h3>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {stats.popularPages.map((page, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block truncate">
                        {page.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{page.path}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#0F2942]">
                        {page.views.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[10px] block">ครั้ง</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
                <FileText className="w-4 h-4 text-[#0F2942]" />
                <h3 className="text-sm font-bold text-[#0F2942]">
                  ข่าวประชาสัมพันธ์ที่มีผู้เข้าชมสูงสุด (Popular News)
                </h3>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {stats.popularNews.map((news, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 block truncate">
                        {news.title}
                      </span>
                      <span className="text-[11px] text-slate-400">{news.date}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#0F2942]">
                        {news.views.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[10px] block">ครั้ง</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAGE STUDENT STATS BY YEAR ================= */}
      {activeTab === "students" && (
        <div className="space-y-6">
          
          {/* Top Banner Guide */}
          <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-3xl border border-blue-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#0F2942]">
                  จัดการข้อมูลนักเรียนรายชั้นเรียนและเพิ่มปีย้อนหลัง
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  ท่านสามารถเลือกปีการศึกษาที่ต้องการแก้ไข หรือกดปุ่ม <strong>"+ เพิ่มปีการศึกษาใหม่"</strong> (เช่น ปี 2566, 2565) เพื่อกรอกจำนวนนักเรียนชาย-หญิง และจำนวนห้องเรียน ข้อมูลจะเชื่อมโยงไปยังหน้าแรก แดชบอร์ด และหน้ารายงานทันที
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddYearModal(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มปีการศึกษาใหม่</span>
            </button>
          </div>

          {/* Year Switcher Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">เลือกปีการศึกษา:</span>
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedStudentYear(yr)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedStudentYear === yr
                        ? "bg-[#1D4ED8] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ปี {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetStudentStats}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>รีเซ็ตค่าเริ่มต้น</span>
              </button>

              <button
                onClick={handleDeleteCurrentYear}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบปี {selectedStudentYear}</span>
              </button>

              <button
                onClick={handleSaveStudentStats}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกข้อมูลนักเรียน</span>
              </button>
            </div>
          </div>

          {/* Active Year KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-medium text-white/80 block">นักเรียนทั้งหมด</span>
              <div className="text-3xl font-black text-white mt-1">
                {activeYearData.summary.totalStudents} <span className="text-xs font-normal text-white/90">คน</span>
              </div>
              <span className="text-[10px] text-white/70 block mt-1">
                ปีการศึกษา {selectedStudentYear}
              </span>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-medium text-white/80 block">นักเรียนชาย</span>
              <div className="text-3xl font-black text-white mt-1">
                {activeYearData.summary.totalMale} <span className="text-xs font-normal text-white/90">คน</span>
              </div>
              <span className="text-[10px] text-white/70 block mt-1">
                {activeYearData.summary.totalStudents > 0
                  ? Math.round((activeYearData.summary.totalMale / activeYearData.summary.totalStudents) * 100)
                  : 0}% ของทั้งหมด
              </span>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-rose-700 text-white p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-medium text-white/80 block">นักเรียนหญิง</span>
              <div className="text-3xl font-black text-white mt-1">
                {activeYearData.summary.totalFemale} <span className="text-xs font-normal text-white/90">คน</span>
              </div>
              <span className="text-[10px] text-white/70 block mt-1">
                {activeYearData.summary.totalStudents > 0
                  ? Math.round((activeYearData.summary.totalFemale / activeYearData.summary.totalStudents) * 100)
                  : 0}% ของทั้งหมด
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-medium text-white/80 block">จำนวนห้องเรียน</span>
              <div className="text-3xl font-black text-white mt-1">
                {activeYearData.summary.totalClassrooms} <span className="text-xs font-normal text-white/90">ห้อง</span>
              </div>
              <span className="text-[10px] text-white/70 block mt-1">
                เฉลี่ย {(activeYearData.summary.totalStudents / Math.max(1, activeYearData.summary.totalClassrooms)).toFixed(1)} คน/ห้อง
              </span>
            </div>
          </div>

          {/* Editable Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#0F2942] flex items-center gap-2">
                  <span>ตารางกรอกข้อมูลนักเรียน ปีการศึกษา {selectedStudentYear}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-normal">
                    รายระดับชั้น (อ.2 - ป.6)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ระบุจำนวนนักเรียนชาย-หญิง และจำนวนห้องเรียน ระบบจะรวมยอดและคำนวณอัตราส่วนให้อัตโนมัติ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">วันที่ข้อมูล:</span>
                <input
                  type="text"
                  value={activeYearData.updatedDate}
                  onChange={(e) => handleUpdatedDateChange(e.target.value)}
                  placeholder="เช่น 10 มิถุนายน 2569"
                  className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-xl font-medium text-[#0F2942] focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 text-left font-bold">ระดับชั้นเรียน</th>
                    <th className="py-3 px-4 text-center text-blue-900 bg-blue-50/70 border-x border-blue-100">
                      ชาย (คน)
                    </th>
                    <th className="py-3 px-4 text-center text-rose-900 bg-rose-50/70 border-r border-rose-100">
                      หญิง (คน)
                    </th>
                    <th className="py-3 px-4 text-center text-slate-900 bg-slate-200/60 font-bold">
                      รวม (คน)
                    </th>
                    <th className="py-3 px-4 text-center text-emerald-900 bg-emerald-50/70 border-l border-emerald-100">
                      จำนวนห้องเรียน (ห้อง)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeYearData.grades.map((grade, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0F2942]">
                        {grade.grade}
                      </td>

                      {/* Male */}
                      <td className="py-2 px-3 text-center bg-blue-50/20 border-x border-blue-100/50">
                        <input
                          type="number"
                          min="0"
                          value={grade.male}
                          onChange={(e) => handleGradeChange(idx, "male", e.target.value)}
                          className="w-24 py-1.5 text-center font-bold text-blue-900 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
                        />
                      </td>

                      {/* Female */}
                      <td className="py-2 px-3 text-center bg-rose-50/20 border-r border-rose-100/50">
                        <input
                          type="number"
                          min="0"
                          value={grade.female}
                          onChange={(e) => handleGradeChange(idx, "female", e.target.value)}
                          className="w-24 py-1.5 text-center font-bold text-rose-900 bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden shadow-2xs"
                        />
                      </td>

                      {/* Total (auto) */}
                      <td className="py-2 px-3 text-center font-black text-base text-[#0F2942] bg-slate-50/80">
                        {grade.total}
                      </td>

                      {/* Classrooms */}
                      <td className="py-2 px-3 text-center bg-emerald-50/20 border-l border-emerald-100/50">
                        <input
                          type="number"
                          min="1"
                          value={grade.classrooms}
                          onChange={(e) => handleGradeChange(idx, "classrooms", e.target.value)}
                          className="w-20 py-1.5 text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs"
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Summary Total Row */}
                  <tr className="bg-slate-100/90 font-black text-sm border-t-2 border-slate-300">
                    <td className="py-3 px-4 text-[#0F2942]">
                      รวมทั้งสิ้น (ปี {selectedStudentYear})
                    </td>
                    <td className="py-3 px-4 text-center text-blue-900 bg-blue-50/60 font-black">
                      {activeYearData.summary.totalMale} คน
                    </td>
                    <td className="py-3 px-4 text-center text-rose-900 bg-rose-50/60 font-black">
                      {activeYearData.summary.totalFemale} คน
                    </td>
                    <td className="py-3 px-4 text-center text-white bg-[#0F2942] font-black text-base">
                      {activeYearData.summary.totalStudents} คน
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-900 bg-emerald-50/60 font-black">
                      {activeYearData.summary.totalClassrooms} ห้อง
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>* กดปุ่ม "บันทึกข้อมูลนักเรียน" เพื่อบันทึกการเปลี่ยนแปลง</span>
              <button
                onClick={handleSaveStudentStats}
                type="button"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูลสถิตินักเรียน</span>
              </button>
            </div>
          </div>

          {/* Real-time Live Preview */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-base text-[#0F2942]">
                  ตัวอย่างการแสดงผลกราฟจริงบนเว็บไซต์ (Live Preview)
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                กราฟแท่ง 8 ระดับชั้น และ Donut Chart สัดส่วนเพศ
              </span>
            </div>

            <StudentAnalyticsWidget />
          </div>

        </div>
      )}

      {/* ================= MODAL: ADD NEW ACADEMIC YEAR ================= */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F2942]">เพิ่มปีการศึกษาใหม่</h3>
                <p className="text-xs text-slate-500">เช่น ปี 2566, 2565 หรือปีย้อนหลังอื่นๆ</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ระบุปีการศึกษา (พ.ศ.):
              </label>
              <input
                type="text"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                placeholder="เช่น 2566"
                className="w-full py-2.5 px-3 text-sm font-bold text-[#0F2942] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                autoFocus
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                ระบบจะสร้างโครงสร้างชั้นเรียน อ.2 ถึง ป.6 ให้ทันทีเพื่อความสะดวกในการกรอก
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddYearModal(false);
                  setNewYearInput("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleCreateNewYear}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all shadow-xs"
              >
                ยืนยันการเพิ่มปี
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
