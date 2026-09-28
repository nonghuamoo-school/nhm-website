"use client";

import React, { useState, useEffect } from "react";
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
  School,
  Calendar,
  CloudSun,
  ShieldCheck,
  Settings,
  Sparkles,
  Award,
  ChevronRight,
  MapPin
} from "lucide-react";
import { schoolCalendarEvents } from "@/data/calendar";
import { visitorService, VisitorStats } from "@/services/visitorService";
import { useSchoolSettings, cleanQuotes } from "@/hooks/useSchoolSettings";
import { useNews } from "@/hooks/useNews";
import { useDownloads } from "@/hooks/useDownloads";
import { usePersonnel } from "@/hooks/usePersonnel";
import { getStoredStudentStats, fetchStudentStatsCloud, defaultSchoolStudentStats } from "@/data/studentStats";
import StudentAnalyticsWidget from "@/components/charts/StudentAnalyticsWidget";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";

/**
 * Animated count-up component respecting prefers-reduced-motion
 */
function CountUpNumber({ end, duration = 800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced-motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic curve for gentle deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function AdminDashboardPage() {
  const { settings } = useSchoolSettings();
  const { newsList } = useNews();
  const { docList } = useDownloads();
  const { personnelList } = usePersonnel();

  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => visitorService.getVisitorStats());
  const [studentStats, setStudentStats] = useState(() => defaultSchoolStudentStats["2569"]?.summary || {
    totalStudents: 105,
    totalClassrooms: 8,
    totalMale: 55,
    totalFemale: 50,
  });

  const [greeting, setGreeting] = useState("สวัสดีตอนเช้า");

  useEffect(() => {
    // Determine dynamic greeting by time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("สวัสดีตอนเช้า");
    } else if (hour < 18) {
      setGreeting("สวัสดีตอนบ่าย");
    } else {
      setGreeting("สวัสดีตอนเย็น");
    }

    // Live student stats sync
    const stored = getStoredStudentStats();
    if (stored["2569"]?.summary) {
      setStudentStats(stored["2569"].summary);
    }
    fetchStudentStatsCloud().then((cloudData) => {
      if (cloudData && cloudData["2569"]?.summary) {
        setStudentStats(cloudData["2569"].summary);
      }
    });

    // Sync live metrics immediately
    visitorService.syncFromCloud().then((fresh) => {
      if (fresh) setVisitorStats(fresh);
    });

    // Subscribe to live changes
    const unsubscribe = visitorService.subscribeToVisitorStats((newStats) => {
      setVisitorStats(newStats);
    });

    return () => unsubscribe();
  }, []);

  const totalStudents = studentStats.totalStudents || 105;
  const totalClassrooms = studentStats.totalClassrooms || 8;
  const teacherCount = personnelList.length > 0 ? personnelList.length : 10;
  const studentTeacherRatio = (totalStudents / Math.max(1, teacherCount)).toFixed(1);

  // Dynamic school philosophy cleaned from double quotes
  const rawPhilo = settings.philosophy || "นตฺถิ ปญฺญา สมา อาภา — ไม่มีแสงสว่างใดเสมอด้วยปัญญา";
  const displayPhilosophy = cleanQuotes(rawPhilo);

  const recentNewsItems = newsList.slice(0, 4);
  const upcomingEvents = schoolCalendarEvents.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* ================= 1. EXECUTIVE HERO BANNER ================= */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 pb-14 sm:pb-16 border border-[#E6EEF8] shadow-xs">
        {/* Background school gate photo with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-right sm:bg-center"
          style={{ backgroundImage: "url('/images/school-hero-gate.webp')" }}
        />
        {/* Modern white-gradient overlay (96% white at left to 35% white at right) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.90) 50%, rgba(255,255,255,0.32) 100%)",
          }}
        />

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#2F6FED]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E3F7EE] text-[#16A37A] border border-[#C6EFE0] font-bold flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ระบบบริหารสถานศึกษา Real-time
              </span>
              <span className="text-[#64748B] font-medium">
                • โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต&nbsp;3
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-[#2F6FED] block">
                {greeting}, ยินดีต้อนรับสู่ระบบบริหาร NHM School CMS
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1E3A5F]">
                ศูนย์บริหารจัดการและวิเคราะห์ข้อมูลสถานศึกษา
              </h1>
            </div>

            {/* Dynamic Philosophy from settings */}
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed italic flex items-center gap-1.5 line-clamp-1 sm:line-clamp-none">
              <Sparkles className="w-3.5 h-3.5 text-[#2F6FED] shrink-0" />
              <span>&ldquo;{displayPhilosophy}&rdquo;</span>
            </p>
          </div>

          {/* Translucent Glass Widget on Right */}
          <div className="flex flex-col items-start lg:items-end gap-2 text-xs bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xs shrink-0 text-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2F6FED]" />
              <span className="font-bold text-[#1E3A5F]">ปีการศึกษา 2569 (ภาคเรียนปัจจุบัน)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
              <CloudSun className="w-4 h-4 text-[#E8772E]" />
              <span>ต.หนองโบสถ์ อ.หนองกี่ จ.บุรีรัมย์</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#16A37A] font-semibold pt-1 border-t border-slate-100 w-full justify-between lg:justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>สถานะระบบ: ปกติ (พร้อมใช้งาน 100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. 5 ANALYTICAL SUMMARY KPI CARDS (Overlapping banner) ================= */}
      <div className="-mt-8 sm:-mt-10 relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 px-2 sm:px-4">
        
        {/* Card 1: นักเรียนทั้งหมด (Pastel Blue) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B]">นักเรียนทั้งหมด</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">
                <CountUpNumber end={totalStudents} />
              </span>
              <span className="text-sm font-bold text-[#64748B]">คน</span>
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2.5 border-t border-[#F1F5F9] font-normal">
            ข้อมูลปีการศึกษา 2569
          </p>
        </div>

        {/* Card 2: ครูและบุคลากร (Pastel Purple) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#F1EAFE] text-[#7C5CE0] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B]">ครูและบุคลากร</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">
                <CountUpNumber end={teacherCount} />
              </span>
              <span className="text-sm font-bold text-[#64748B]">ท่าน</span>
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2.5 border-t border-[#F1F5F9] font-normal">
            อัตราส่วน 1 : {studentTeacherRatio} ต่อนักเรียน
          </p>
        </div>

        {/* Card 3: ห้องเรียนทั้งหมด (Pastel Green) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#E3F7EE] text-[#16A37A] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
              <School className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B]">ห้องเรียนทั้งหมด</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">
                <CountUpNumber end={totalClassrooms} />
              </span>
              <span className="text-sm font-bold text-[#64748B]">ห้อง</span>
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2.5 border-t border-[#F1F5F9] font-normal">
            อนุบาล 2 – ประถมศึกษาปีที่ 6
          </p>
        </div>

        {/* Card 4: ข่าวและเอกสาร (Pastel Orange) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] text-[#E8772E] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B]">ข่าวและเอกสารเผยแพร่</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#1E3A5F] tracking-tight">
                <CountUpNumber end={newsList.length + docList.length} />
              </span>
              <span className="text-sm font-bold text-[#64748B]">ฉบับ</span>
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2.5 border-t border-[#F1F5F9] font-normal">
            ข่าว {newsList.length} • เอกสาร {docList.length}
          </p>
        </div>

        {/* Card 5: ผู้เข้าชมเว็บไซต์ (Pastel Vibrant Blue) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6EEF8] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B]">ผู้เข้าชมเว็บไซต์</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F] tracking-tight">
                <CountUpNumber end={visitorStats.total} />
              </span>
              <span className="text-sm font-bold text-[#64748B]">ครั้ง</span>
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2.5 border-t border-[#F1F5F9] font-normal">
            วันนี้ {visitorStats.today.toLocaleString()} ครั้ง
          </p>
        </div>

      </div>

      {/* ================= 3. MAIN DASHBOARD CONTENT (Two-column layout on XL) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left / Primary Column (8 cols): Analytics Widgets */}
        <div className="xl:col-span-8 space-y-6">
          {/* Student Analytics Widget */}
          <StudentAnalyticsWidget />

          {/* Academic National Exam Benchmark (O-NET / NT / RT) */}
          <AcademicPerformanceChart />
        </div>

        {/* Right / Secondary Column (4 cols): Feeds, Calendar & Actions */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Card: Latest News Feed */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6EEF8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#1E3A5F]">ข่าวประชาสัมพันธ์ล่าสุด</h3>
              </div>
              <Link
                href="/admin/news"
                className="text-xs text-[#2F6FED] hover:underline font-bold flex items-center gap-1"
              >
                ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentNewsItems.length > 0 ? (
                recentNewsItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/news/edit/${item.id}`}
                    className="p-3 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF3FA] border border-[#E6EEF8] transition-all flex flex-col gap-1 group block"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2F6FED] border border-blue-100">
                        {item.category || "ข่าวทั่วไป"}
                      </span>
                      <span className="text-[#94A3B8]">{item.date}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors line-clamp-2 mt-0.5">
                      {item.title}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#94A3B8]">
                  ยังไม่มีข่าวประชาสัมพันธ์
                </div>
              )}
            </div>

            <Link
              href="/admin/news/new"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F4F8FD] hover:bg-[#E8F0FE] text-[#2F6FED] text-xs font-bold border border-[#D1DFF0] flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              เขียนข่าวประชาสัมพันธ์ใหม่
            </Link>
          </div>

          {/* Card: Upcoming Calendar Activities */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6EEF8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#E8772E] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#1E3A5F]">กิจกรรมและปฏิทินการศึกษา</h3>
              </div>
              <Link
                href="/admin/calendar"
                className="text-xs text-[#2F6FED] hover:underline font-bold flex items-center gap-1"
              >
                ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#E6EEF8] flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0E5] text-[#E8772E] flex flex-col items-center justify-center shrink-0 border border-[#FED7AA]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1E3A5F] truncate">{evt.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                      <span>{evt.date}</span>
                    </div>
                    {evt.location && evt.location !== "-" && (
                      <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/calendar"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F4F8FD] hover:bg-[#E8F0FE] text-[#2F6FED] text-xs font-bold border border-[#D1DFF0] flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              จัดการปฏิทินโรงเรียน
            </Link>
          </div>

          {/* Card: Quick Action Shortcuts */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6EEF8] shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#1E3A5F] pb-2 border-b border-[#F1F5F9]">
              ทางลัดการจัดการ
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/admin/personnel"
                className="p-3 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF3FA] border border-[#E6EEF8] transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F1EAFE] text-[#7C5CE0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1E3A5F]">จัดการทำเนียบบุคลากร</h4>
                  <p className="text-[11px] text-[#64748B] truncate">แก้ไขรายชื่อและตำแหน่ง</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2F6FED] transition-colors" />
              </Link>

              <Link
                href="/admin/downloads"
                className="p-3 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF3FA] border border-[#E6EEF8] transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E3F7EE] text-[#16A37A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1E3A5F]">คลังเอกสารและดาวน์โหลด</h4>
                  <p className="text-[11px] text-[#64748B] truncate">รายงาน SAR และแบบฟอร์ม</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2F6FED] transition-colors" />
              </Link>

              <Link
                href="/admin/settings"
                className="p-3 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF3FA] border border-[#E6EEF8] transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#2F6FED] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1E3A5F]">ตั้งค่าข้อมูลสถานศึกษา</h4>
                  <p className="text-[11px] text-[#64748B] truncate">ปรัชญา วิสัยทัศน์ และข้อมูลติดต่อ</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2F6FED] transition-colors" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
