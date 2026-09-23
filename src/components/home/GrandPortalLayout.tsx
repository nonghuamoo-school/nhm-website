"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Info,
  History,
  Users,
  UserCheck,
  Building,
  User,
  Award,
  Eye,
  Target,
  Briefcase,
  Calendar,
  Phone,
  Scale,
  CheckSquare,
  FileText,
  Megaphone,
  Globe,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  QrCode,
  ShieldCheck,
  ThumbsUp,
  Share2,
  FileCheck,
  BookOpen
} from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";
import { schoolNews } from "@/data/news";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

export default function GrandPortalLayout() {
  const { settings } = useSchoolSettings();
  const [activeNewsTab, setActiveNewsTab] = useState<"all" | "procure" | "activity">("all");

  const basicMenu = [
    { label: "ข้อมูลพื้นฐานโรงเรียน", href: "/about", icon: Info },
    { label: "ประวัติหน่วยงาน", href: "/about#history", icon: History },
    { label: "คณะกรรมการสถานศึกษา", href: "/about#committee", icon: Users },
    { label: "คณะกรรมการนักเรียน", href: "/about#students", icon: UserCheck },
    { label: "โครงสร้างหน่วยงาน", href: "/about#structure", icon: Building },
    { label: "ข้อมูลผู้บริหารปัจจุบัน", href: "/personnel", icon: User },
    { label: "ทำเนียบผู้บริหาร", href: "/about#directors", icon: Award },
    { label: "วิสัยทัศน์", href: "/about#vision", icon: Eye },
    { label: "พันธกิจ", href: "/about#vision", icon: Target },
    { label: "อำนาจหน้าที่", href: "/about#duties", icon: Briefcase },
    { label: "แผนการดำเนินงาน", href: "/about#plan", icon: Calendar },
    { label: "ข้อมูลติดต่อหน่วยงาน", href: "/contact", icon: Phone },
    { label: "กฎหมายที่เกี่ยวข้อง", href: "/downloads", icon: Scale },
    { label: "มาตรฐานการปฏิบัติงาน", href: "/downloads", icon: CheckSquare },
    { label: "คู่มือบริการประชาชน", href: "/downloads", icon: FileText },
    { label: "ข่าวประชาสัมพันธ์", href: "/news", icon: Megaphone },
    { label: "สพป. บุรีรัมย์ เขต 3", href: "https://www.brm3.go.th", icon: Globe, external: true },
  ];

  const facultyTeachers = [
    {
      name: "นางชนิสรา ตะวันหะ",
      role: "ครูชำนาญการพิเศษ",
      sub: "หัวหน้าฝ่ายวิชาการ",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "นางสาวเพ็ญนิภา เวชวิภา",
      role: "ครู",
      sub: "กลุ่มสาระการเรียนรู้ภาษาไทย",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "นางเตือนใจ บำรุงแจ่ม",
      role: "ครูชำนาญการพิเศษ",
      sub: "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "นางสาวกวินทรา พืชโยกุล",
      role: "ครูผู้ช่วย",
      sub: "ระดับการศึกษาปฐมวัย (อ.2-3)",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    },
  ];

  const procurementNews = [
    {
      id: "procure-01",
      title: "ประกาศผู้ชนะการเสนอราคาจ้างเหมาบริการผู้ปฏิบัติงานให้ราชการ ตำแหน่งครูอัตราจ้าง",
      date: "16 ก.ค. 2567",
      dept: "ฝ่ายพัสดุและงบประมาณ",
    },
    {
      id: "procure-02",
      title: "ประกาศประกวดราคาซื้อครุภัณฑ์พัฒนาทักษะดิจิทัลห้องเรียนคุณภาพ ประจำปีงบประมาณ 2567",
      date: "05 ก.ค. 2567",
      dept: "งานจัดซื้อจัดจ้าง",
    },
    {
      id: "procure-03",
      title: "เผยแพร่แผนการจัดซื้อจัดจ้างอาหารกลางวันนักเรียน ภาคเรียนที่ 1/2567",
      date: "28 มิ.ย. 2567",
      dept: "โครงการอาหารกลางวัน",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* ================= 3-COLUMN CLASSIC THAI GOVERNMENT PORTAL (ถอดแบบ รร.บ้านลุงขี้หนู) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN (lg:col-span-3): ข้อมูลพื้นฐาน & สารสนเทศนักเรียน */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Box 1: ข้อมูลพื้นฐาน */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center gap-2 font-bold text-sm">
              <Home className="w-4 h-4 text-sky-300" />
              <span>ข้อมูลพื้นฐาน</span>
            </div>
            
            <nav className="divide-y divide-slate-100 text-xs">
              {basicMenu.map((item) => {
                const Icon = item.icon;
                const Content = (
                  <div className="px-4 py-2.5 flex items-center justify-between hover:bg-blue-50/70 hover:text-blue-900 transition-colors group cursor-pointer text-slate-700">
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-3.5 h-3.5 text-blue-800 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.external ? (
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-700" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 group-hover:text-blue-700 transition-transform" />
                    )}
                  </div>
                );

                return item.external ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    {Content}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href}>
                    {Content}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Box 2: ข้อมูลสารสนเทศ */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center gap-2 font-bold text-sm">
              <Database className="w-4 h-4 text-amber-300" />
              <span>ข้อมูลสารสนเทศ</span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              {/* ข้อมูลนักเรียน (Demographics Mini Widget) */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between font-bold text-[#0F2942]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-700" />
                    ข้อมูลนักเรียน
                  </span>
                  <span className="text-blue-800 font-mono text-sm font-black">165 คน</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>• ปฐมวัย (อ.2-3)</span>
                    <strong className="text-emerald-700 font-mono">33 คน</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>• ประถมต้น (ป.1-3)</span>
                    <strong className="text-blue-700 font-mono">64 คน</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>• ประถมปลาย (ป.4-6)</span>
                    <strong className="text-indigo-700 font-mono">68 คน</strong>
                  </div>
                </div>
              </div>

              {/* ข้อมูลบุคลากร */}
              <Link
                href="/personnel"
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 flex items-center justify-between text-slate-700 hover:text-indigo-900 transition-colors group block"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
                  <span className="font-semibold">ข้อมูลบุคลากร</span>
                </div>
                <span className="font-mono font-bold text-indigo-800">12 ท่าน &gt;</span>
              </Link>

              {/* ผลสัมฤทธิ์ O-NET, NT, RT */}
              <Link
                href="/academic"
                className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 flex items-center justify-between text-emerald-950 transition-colors group block"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold">ผลสัมฤทธิ์ 3 ระดับ</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">ดูกราฟ &gt;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN (lg:col-span-6): แบนเนอร์ EIT + เพจเฟซบุ๊ก + ข่าวจัดซื้อจัดจ้าง */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Banner 1: แบบวัดการรับรู้ EIT ของผู้มีส่วนได้ส่วนเสียภายนอก (เหมือน รร.บ้านลุงขี้หนู) */}
          <div className="bg-gradient-to-r from-blue-900 via-sky-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-700/50 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* QR Code Container */}
              <div className="bg-white p-2 rounded-xl shrink-0 shadow-md flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase">
                  SCAN FOR EIT
                </span>
              </div>

              {/* Banner Details */}
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                  <span>การประเมินคุณธรรมและความโปร่งใส</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  แบบวัดการรับรู้ EIT ของผู้มีส่วนได้ส่วนเสียภายนอก
                </h3>
                <p className="text-[11px] text-sky-100/90 leading-relaxed">
                  ขอเชิญ กรรมการสถานศึกษา ผู้ปกครอง ศิษย์เก่า ผู้ประกอบการ หรือผู้มีส่วนได้ส่วนเสีย ร่วมทำแบบประเมินสถานศึกษา
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.brm3.go.th"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white underline"
                  >
                    <span>คลิกเพื่อร่วมทำแบบประเมินออนไลน์ &gt;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: เพจโรงเรียนบ้านหนองหัวหมู (Facebook Style Showcase) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FileText className="w-4 h-4 text-sky-300" />
                <span>เพจโรงเรียนบ้านหนองหัวหมู</span>
              </div>
              <span className="text-[11px] text-sky-200 font-mono">Official Page</span>
            </div>

            {/* Facebook Page Meta Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <SchoolLogo size={46} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F2942]">
                    โรงเรียนบ้านหนองหัวหมู
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    433 ผู้ติดตาม • สพป. บุรีรัมย์ เขต 3
                  </p>
                </div>
              </div>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold shadow-xs hover:bg-[#166FE5] transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>ติดตามเพจ</span>
              </a>
            </div>

            {/* Featured Certificate Poster (เหมือนภาพ รร.บ้านลุงขี้หนู เป๊ะ) */}
            <div className="p-4 sm:p-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 p-5 sm:p-6 text-center space-y-4">
                
                {/* Certificate Seal & Top Branding */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-white p-1 border-2 border-amber-400 shadow-sm flex items-center justify-center">
                    <SchoolLogo size={44} />
                  </div>
                  <span className="text-xs font-bold text-amber-900 tracking-wider">
                    ขอแสดงความยินดี
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#0F2942]">
                    โรงเรียนบ้านหนองหัวหมู
                  </h4>
                  <p className="text-xs text-slate-600">
                    สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3
                  </p>
                </div>

                {/* Golden Badge Box */}
                <div className="py-2.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-xs inline-block text-xs sm:text-sm tracking-wide">
                  ระดับคุณภาพ ยอดเยี่ยม
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  ในการประเมินห้องเรียนคุณภาพและการจัดการเรียนรู้เชิงรุก (Active Learning)
                  <br />
                  ประจำปีการศึกษา ๒๕๖๗
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: ข่าวประชาสัมพันธ์ & จัดซื้อจัดจ้าง */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Megaphone className="w-4 h-4 text-amber-300" />
                <span>ข่าวประชาสัมพันธ์ จัดซื้อจัดจ้าง</span>
              </div>

              <Link
                href="/news"
                className="text-xs text-sky-200 hover:text-white inline-flex items-center gap-0.5"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* News List */}
            <div className="divide-y divide-slate-100">
              {procurementNews.map((item) => (
                <Link
                  key={item.id}
                  href="/news"
                  className="p-4 hover:bg-slate-50/80 transition-colors block group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 shrink-0 mt-0.5 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                          {item.dept}
                        </span>
                        <span>• {item.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F2942] group-hover:text-blue-800 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                href="/news"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>เข้าสู่ศูนย์ข่าวสารและประกาศสถานศึกษาทั้งหมด &gt;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (lg:col-span-3): ผู้อำนวยการโรงเรียน & แนะนำบุคลากร */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Box 1: ผู้อำนวยการโรงเรียน (เหมือน รร.บ้านลุงขี้หนู เป๊ะ) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-center">
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm">
              <User className="w-4 h-4 text-sky-300" />
              <span>ผู้อำนวยการโรงเรียน</span>
            </div>

            <div className="p-5 space-y-3 flex flex-col items-center">
              {/* Formal Civil Service Portrait Frame */}
              <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md relative bg-slate-100">
                <img
                  src={settings.directorImageUrl || schoolInfo.director.imageUrl}
                  alt={settings.directorName || schoolInfo.director.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/school-emblem-doc.png";
                  }}
                />
              </div>

              <div>
                <h4 className="font-black text-sm sm:text-base text-[#0F2942]">
                  {settings.directorName || schoolInfo.director.name}
                </h4>
                <p className="text-xs text-blue-800 font-semibold mt-0.5">
                  {settings.directorTitle || schoolInfo.director.position}
                </p>
                <p className="text-[11px] text-slate-500">
                  {settings.directorAcademicStanding || schoolInfo.director.academicStanding}
                </p>
              </div>

              <div className="w-full pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 italic line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  &ldquo;{settings.directorMessage || schoolInfo.director.message}&rdquo;
                </p>
              </div>

              <Link
                href="/about"
                className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition-colors"
              >
                ดูประวัติผู้อำนวยการ
              </Link>
            </div>
          </div>

          {/* Box 2: แนะนำบุคลากร (Staff Column) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#0c3759] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Users className="w-4 h-4 text-amber-300" />
                <span>แนะนำบุคลากร</span>
              </div>
              <Link href="/personnel" className="text-xs text-sky-200 hover:text-white">
                ทั้งหมด
              </Link>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {facultyTeachers.map((teacher, idx) => (
                <div key={idx} className="p-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors rounded-xl">
                  {/* Portrait photo */}
                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 relative bg-slate-100">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="leading-tight truncate">
                    <h5 className="font-bold text-xs text-[#0F2942] truncate">
                      {teacher.name}
                    </h5>
                    <p className="text-[11px] text-blue-800 font-medium truncate mt-0.5">
                      {teacher.role}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {teacher.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                href="/personnel"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>ดูทำเนียบครูทั้งหมด (12 ท่าน) &gt;</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
