"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  FileText,
  Users,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
  Building,
  HardDrive,
  Calendar,
  CloudSun,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Award,
  AlertCircle,
  School,
  Database
} from "lucide-react";
import { schoolNews } from "@/data/news";
import { schoolDownloads } from "@/data/downloads";
import { schoolInventoryAssets } from "@/data/assets";
import { schoolStudentStats } from "@/data/studentStats";
import { visitorService } from "@/services/visitorService";
import StudentAnalyticsWidget from "@/components/charts/StudentAnalyticsWidget";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";

export default function AdminDashboardPage() {
  const visitorStats = visitorService.getVisitorStats();
  const currentStudentStats = schoolStudentStats["2569"] || Object.values(schoolStudentStats)[0];
  const recentNews = schoolNews.slice(0, 4);

  // Recent operational tracking items
  const recentOperations = [
    {
      id: "OP-2569-01",
      title: "ประกาศรับสมัครนักเรียนใหม่ ปีการศึกษา 2569 (อ.2 และ ป.1)",
      category: "งานวิชาการและรับสมัคร",
      date: "18 มี.ค. 2569",
      status: "เผยแพร่แล้ว",
      statusColor: "emerald",
      responsible: "ฝ่ายวิชาการ",
      actionUrl: "/news/news-01",
    },
    {
      id: "OP-2569-02",
      title: "รายงานการประเมินตนเองของสถานศึกษา (SAR) ปีการศึกษา 2567",
      category: "งานประกันคุณภาพ",
      date: "15 มี.ค. 2569",
      status: "เชื่อมต่อ Google Drive",
      statusColor: "blue",
      responsible: "ฝ่ายบริหารงานทั่วไป",
      actionUrl: "/downloads",
    },
    {
      id: "OP-2569-03",
      title: "การตรวจสอบและบำรุงรักษาเครื่องคอมพิวเตอร์และ Smart TV",
      category: "งานพัสดุและครุภัณฑ์",
      date: "10 มี.ค. 2569",
      status: "กำลังดำเนินการ",
      statusColor: "amber",
      responsible: "ครูผู้ดูแลระบบสารสนเทศ",
      actionUrl: "/downloads",
    },
    {
      id: "OP-2569-04",
      title: "การประชุมเตรียมความพร้อมสอบระดับชาติ O-NET และ NT",
      category: "งานวัดและประเมินผล",
      date: "05 มี.ค. 2569",
      status: "เสร็จสิ้น",
      statusColor: "slate",
      responsible: "ฝ่ายวิชาการ",
      actionUrl: "/academic",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* ================= 1. EXECUTIVE HERO BANNER ================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F2942] via-[#163C61] to-[#0A1D30] text-white p-6 sm:p-8 shadow-lg border border-blue-900/50">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ระบบบริหารสถานศึกษา Real-time
              </span>
              <span className="text-slate-300">
                • โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              ศูนย์บริหารจัดการและวิเคราะห์ข้อมูลสถานศึกษา
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              &ldquo;นตฺถิ ปญฺญา สมา อาภา — ไม่มีแสงสว่างใดเสมอด้วยปัญญา&rdquo;
            </p>
          </div>

          {/* Real-time Widget Pill */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-white">ระบบอัปเดตอัตโนมัติ ปีการศึกษา 2569</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>อ.หนองกี่ จ.บุรีรัมย์ • ออนไลน์ 100%</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono">
              สถานะ: ปกติ (พร้อมใช้งาน)
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. 5 VIBRANT ANALYTICAL KPI CARDS (Matching media_1790137610841.png) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Metric 1: นักเรียนทั้งหมด (EXACT DESIGN MATCHING USER'S SCREENSHOT) */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/90">นักเรียนทั้งหมด</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">105</span>
              <span className="text-sm font-bold text-white/90">คน</span>
            </div>
          </div>

          <p className="text-[11px] text-white/75 mt-2.5 pt-2.5 border-t border-white/15 font-normal">
            ข้อมูลของปีการศึกษาที่เลือก
          </p>
        </div>

        {/* Metric 2: บุคลากรครู 10 ท่าน */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#4338CA] to-[#3730A3] text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 shadow-inner">
              <Building className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/90">ครูและบุคลากร</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">10</span>
              <span className="text-sm font-bold text-white/90">ท่าน</span>
            </div>
          </div>

          <p className="text-[11px] text-white/75 mt-2.5 pt-2.5 border-t border-white/15 font-normal">
            อัตราส่วน 1 : 10.5 ต่อ นร.
          </p>
        </div>

        {/* Metric 3: จำนวนชั้นเรียน (8 ห้อง) */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 shadow-inner">
              <School className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/90">ห้องเรียนทั้งหมด</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">8</span>
              <span className="text-sm font-bold text-white/90">ห้อง</span>
            </div>
          </div>

          <p className="text-[11px] text-white/75 mt-2.5 pt-2.5 border-t border-white/15 font-normal">
            อนุบาล 2 – ประถมศึกษาปีที่ 6
          </p>
        </div>

        {/* Metric 4: ข่าวสารและเอกสาร */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 shadow-inner">
              <Megaphone className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/90">ข่าวและเอกสารเผยแพร่</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {schoolNews.length + schoolDownloads.length}
              </span>
              <span className="text-sm font-bold text-white/90">ฉบับ</span>
            </div>
          </div>

          <p className="text-[11px] text-white/75 mt-2.5 pt-2.5 border-t border-white/15 font-normal">
            ระบบจัดเก็บ Real-time
          </p>
        </div>

        {/* Metric 5: ผู้เข้าชมเว็บไซต์ */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-2.5 shadow-inner">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white/90">ผู้เข้าชมเว็บไซต์</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {visitorStats.total.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-white/90">ครั้ง</span>
            </div>
          </div>

          <p className="text-[11px] text-white/75 mt-2.5 pt-2.5 border-t border-white/15 font-normal">
            วันนี้ {visitorStats.today} ครั้ง
          </p>
        </div>

      </div>

      {/* ================= 3. STUDENT STATS WIDGET ================= */}
      <StudentAnalyticsWidget />

      {/* ================= 4. ACADEMIC NATIONAL EXAM BENCHMARK (O-NET / NT / RT) ================= */}
      <AcademicPerformanceChart />

      {/* ================= 5. QUICK ACTION HUB ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/personnel"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F2942]">จัดการทำเนียบบุคลากร</h4>
            <p className="text-xs text-slate-500">เพิ่ม ลบ แก้ไข หลายตำแหน่ง</p>
          </div>
        </Link>

        <Link
          href="/admin/news/new"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F2942]">สร้างข่าวประชาสัมพันธ์</h4>
            <p className="text-xs text-slate-500">โพสต์ประกาศและกิจกรรมใหม่</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F2942]">ตั้งค่าข้อมูลสถานศึกษา</h4>
            <p className="text-xs text-slate-500">รหัสโรงเรียน โลโก้ และคำขวัญ</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
