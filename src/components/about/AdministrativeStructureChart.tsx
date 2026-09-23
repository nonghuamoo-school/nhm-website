"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  User,
  Users,
  Award,
  BookOpen,
  Briefcase,
  DollarSign,
  Building,
  FileDown,
  Printer,
  ExternalLink,
  ShieldCheck,
  Edit3,
  Smartphone,
  Monitor,
  ChevronDown
} from "lucide-react";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { usePersonnel } from "@/hooks/usePersonnel";

export default function AdministrativeStructureChart() {
  const { settings } = useSchoolSettings();
  const { personnelList } = usePersonnel();
  const [mobileViewMode, setMobileViewMode] = useState<"mobile" | "tree">("mobile");

  const handlePrint = () => {
    window.print();
  };

  // Helper to find division head and members dynamically
  const getDivisionData = (keyword: string, fallbackHead: string, fallbackMembers: string[]) => {
    const matched = personnelList.filter((p) => {
      const inDept = p.department && p.department.includes(keyword);
      const inPos = p.position && p.position.includes(keyword);
      const inRoles = p.roles && p.roles.some((r) => r.includes(keyword));
      return inDept || inPos || inRoles;
    });

    if (matched.length === 0) {
      return { head: fallbackHead, members: fallbackMembers };
    }

    // Head is someone with "หัวหน้า" in position/roles
    const headMember = matched.find((p) => 
      (p.position && p.position.includes("หัวหน้า")) ||
      (p.roles && p.roles.some((r) => r.includes("หัวหน้า") && r.includes(keyword)))
    ) || matched[0];

    const members = matched
      .filter((p) => p.id !== headMember.id && !p.position?.includes("ผู้อำนวยการ"))
      .map((p) => p.name);

    return {
      head: headMember.name,
      members: members.length > 0 ? members : fallbackMembers,
    };
  };

  const academicDiv = getDivisionData("วิชาการ", "นายธนาธิป คุณวงศ์", [
    "นางสาวอรทัย วงศ์จันทร์",
    "นางสาวสุพิชชา ตาชูชาติ",
    "นางสาวธัญญลักษณ์ กิ่งดี",
  ]);

  const personnelDiv = getDivisionData("บุคคล", "นายณัฏฐ์นริศ หอยสังข์", [
    "นางสาวอรทัย วงศ์จันทร์",
  ]);

  const generalDiv = getDivisionData("ทั่วไป", "นางสาวโสภา ผลึกรุ่งโรจน์", [
    "นางเสาวณีย์ พูนสวัสดิ์",
    "นางสาวเจนจิรา ปลั่งกลาง",
    "นางสาวสุภาภรณ์ สายธิไชย",
    "นางสาวธัญญลักษณ์ กิ่งดี",
  ]);

  const budgetDiv = getDivisionData("งบประมาณ", "นางเสาวณีย์ พูนสวัสดิ์", [
    "นางสาวสุรีรัตน์ ฉิมจารย์",
    "นางสาวโสภา ผลึกรุ่งโรจน์",
    "นางสาวสุพิชชา ตาชูชาติ",
    "นางสาวสุภาภรณ์ สายธิไชย",
  ]);

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>โครงสร้างการบริหารสถานศึกษา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2942] tracking-tight">
            โครงสร้างการบริหารงาน{settings.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ผังโครงสร้างสายบังคับบัญชา 4 ฝ่ายบริหารงานตามระเบียบกระทรวงศึกษาธิการ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Mobile View Toggle (Visible on small screens) */}
          <div className="flex sm:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMobileViewMode("mobile")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                mobileViewMode === "mobile"
                  ? "bg-white text-[#0F2942] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>แนวตั้ง</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode("tree")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                mobileViewMode === "tree"
                  ? "bg-white text-[#0F2942] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>ผังเต็ม</span>
            </button>
          </div>

          <Link
            href="/admin/personnel"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-bold border border-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>จัดการบุคลากร/ผังบริหาร</span>
          </Link>
          <a
            href="/images/admin-structure.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-700" />
            <span>ผังต้นฉบับ</span>
          </a>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์</span>
          </button>
        </div>
      </div>

      {/* ================= OPTION A: MOBILE RESPONSIVE VERTICAL FLOW (ON MOBILE SCREEN) ================= */}
      {mobileViewMode === "mobile" ? (
        <div className="space-y-4 md:hidden">
          {/* Level 1: Director Hero Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-center shadow-sm border-2 border-amber-300">
            <span className="text-[11px] font-bold tracking-wider uppercase block text-amber-100 mb-0.5">
              {settings.directorTitle || "ผู้อำนวยการโรงเรียน"}
            </span>
            <h3 className="text-lg font-black text-white">
              {settings.directorName || "นายอดุลย์ วิกุล"}
            </h3>
            <span className="text-xs text-amber-100 block mt-0.5">
              {settings.directorAcademicStanding || "ผู้อำนวยการชำนาญการพิเศษ"}
            </span>
          </div>

          {/* Stem connector */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <div className="w-0.5 h-4 bg-slate-300" />
          </div>

          {/* Level 2: Board & Advisory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200 text-center shadow-2xs">
              <span className="text-xs font-bold text-purple-950 block">
                คณะกรรมการสถานศึกษาขั้นพื้นฐาน
              </span>
              <span className="text-[11px] text-purple-700 block mt-0.5">
                มีส่วนร่วมในการบริหารและให้ความเห็นชอบ
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200 text-center shadow-2xs">
              <span className="text-xs font-bold text-purple-950 block">
                กรรมการที่ปรึกษา
              </span>
              <span className="text-[11px] text-purple-700 block mt-0.5">
                ผู้ทรงคุณวุฒิและที่ปรึกษาพัฒนาสถานศึกษา
              </span>
            </div>
          </div>

          {/* Stem connector */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-slate-300" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
              4 ฝ่ายบริหารงาน
            </span>
            <div className="w-0.5 h-4 bg-slate-300" />
          </div>

          {/* Level 3: 4 Key Divisions Stack */}
          <div className="space-y-3">
            {/* Division 1: งานบริหารงานวิชาการ */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-900" />
                  <span>1. งานบริหารงานวิชาการ</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full">หัวใจการศึกษา</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">หัวหน้าฝ่าย:</span>
                  <span className="font-black text-slate-800">{academicDiv.head}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="font-semibold text-slate-700 block mb-1">คณะทำงานและผู้รับผิดชอบ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {academicDiv.members.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Division 2: งานบริหารงานบุคคล */}
            <div className="bg-white rounded-2xl border-2 border-yellow-300 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-yellow-900" />
                  <span>2. งานบริหารงานบุคคล</span>
                </span>
                <span className="text-[10px] bg-yellow-200/80 px-2 py-0.5 rounded-full">พัฒนาครู</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-yellow-50/80 border border-yellow-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-yellow-800 uppercase">หัวหน้าฝ่าย:</span>
                  <span className="font-black text-slate-800">{personnelDiv.head}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="font-semibold text-slate-700 block mb-1">คณะทำงานและผู้รับผิดชอบ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {personnelDiv.members.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Division 3: งานบริหารทั่วไป */}
            <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-900" />
                  <span>3. งานบริหารทั่วไป</span>
                </span>
                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full">อาคารและบริการ</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">หัวหน้าฝ่าย:</span>
                  <span className="font-black text-slate-800">{generalDiv.head}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="font-semibold text-slate-700 block mb-1">คณะทำงานและผู้รับผิดชอบ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {generalDiv.members.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Division 4: งานบริหารงบประมาณ */}
            <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-rose-300 to-rose-400 text-rose-950 px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-rose-900" />
                  <span>4. งานบริหารงบประมาณ</span>
                </span>
                <span className="text-[10px] bg-rose-200/80 px-2 py-0.5 rounded-full">การเงินและพัสดุ</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-800 uppercase">หัวหน้าฝ่าย:</span>
                  <span className="font-black text-slate-800">{budgetDiv.head}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="font-semibold text-slate-700 block mb-1">คณะทำงานและผู้รับผิดชอบ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {budgetDiv.members.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ================= OPTION B: FULL HORIZONTAL DESKTOP TREE (DEFAULT ON MD+, OR TOGGLED ON MOBILE) ================= */}
      <div className={`relative p-4 sm:p-8 bg-slate-50/60 rounded-3xl border border-slate-200/80 overflow-x-auto ${mobileViewMode === "mobile" ? "hidden md:block" : "block"}`}>
        
        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-center gap-1.5 py-1 px-3 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-700 font-bold mb-4 w-fit mx-auto shadow-2xs">
          <span>↔ เลื่อนซ้าย-ขวาเพื่อดูผังองค์กรแบบเต็ม</span>
        </div>

        <div className="min-w-[680px] flex flex-col items-center space-y-6">

          {/* Level 1: Director Card */}
          <div className="relative group">
            <div className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-center shadow-md border-2 border-amber-300 min-w-[260px]">
              <span className="text-xs font-bold tracking-wider uppercase block text-amber-100 mb-0.5">
                {settings.directorTitle || "ผู้อำนวยการโรงเรียน"}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {settings.directorName || "นายอดุลย์ วิกุล"}
              </h3>
              <span className="text-[11px] text-amber-100 block mt-0.5">
                {settings.directorAcademicStanding || "ผู้อำนวยการชำนาญการพิเศษ"}
              </span>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-0.5 h-8 bg-slate-400 mx-auto" />
          </div>

          {/* Level 2: Board & Advisory Wings */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-lg relative">
            {/* Horizontal bridge connecting both wings */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-400 -translate-y-1/2 pointer-events-none" />

            {/* Left: คณะกรรมการสถานศึกษา */}
            <div className="p-3.5 rounded-xl bg-purple-50 border-2 border-purple-300 text-center shadow-2xs">
              <span className="text-xs font-bold text-purple-900 block">
                คณะกรรมการสถานศึกษาขั้นพื้นฐาน
              </span>
              <span className="text-[10px] text-purple-600 block mt-0.5">
                (มีส่วนร่วมในการบริหารและให้ความเห็นชอบ)
              </span>
            </div>

            {/* Right: กรรมการที่ปรึกษา */}
            <div className="p-3.5 rounded-xl bg-purple-50 border-2 border-purple-300 text-center shadow-2xs">
              <span className="text-xs font-bold text-purple-900 block">
                กรรมการที่ปรึกษา
              </span>
              <span className="text-[10px] text-purple-600 block mt-0.5">
                (ผู้ทรงคุณวุฒิและที่ปรึกษาพัฒนาสถานศึกษา)
              </span>
            </div>
          </div>

          {/* Connecting Vertical Stem down to 4 Divisions */}
          <div className="w-0.5 h-8 bg-slate-400" />

          {/* Level 3: 4 Key Divisions Grid (วิชาการ • บุคคล • ทั่วไป • งบประมาณ) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start pt-2">
            
            {/* Division 1: งานบริหารงานวิชาการ (Yellow/Orange) */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-3 text-center border-b border-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-900" />
                <span>งานบริหารงานวิชาการ</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 block uppercase">หัวหน้าฝ่าย</span>
                  <p className="font-black text-slate-800 text-xs">{academicDiv.head}</p>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  {academicDiv.members.map((name, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-[11px] font-medium">• {name}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Division 2: งานบริหารงานบุคคล (Yellow) */}
            <div className="bg-white rounded-2xl border-2 border-yellow-300 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-950 px-4 py-3 text-center border-b border-yellow-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4 text-yellow-900" />
                <span>งานบริหารงานบุคคล</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-yellow-50/80 border border-yellow-200">
                  <span className="text-[10px] font-bold text-yellow-800 block uppercase">หัวหน้าฝ่าย</span>
                  <p className="font-black text-slate-800 text-xs">{personnelDiv.head}</p>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  {personnelDiv.members.map((name, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-[11px] font-medium">• {name}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Division 3: งานบริหารทั่วไป (Green) */}
            <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 px-4 py-3 text-center border-b border-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-900" />
                <span>งานบริหารทั่วไป</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 block uppercase">หัวหน้าฝ่าย</span>
                  <p className="font-black text-slate-800 text-xs">{generalDiv.head}</p>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  {generalDiv.members.map((name, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-[11px] font-medium">• {name}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Division 4: งานบริหารงบประมาณ (Pink/Rose) */}
            <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-rose-300 to-rose-400 text-rose-950 px-4 py-3 text-center border-b border-rose-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-900" />
                <span>งานบริหารงบประมาณ</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 block uppercase">หัวหน้าฝ่าย</span>
                  <p className="font-black text-slate-800 text-xs">{budgetDiv.head}</p>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  {budgetDiv.members.map((name, i) => (
                    <p key={i} className="flex items-center gap-1.5 text-[11px] font-medium">• {name}</p>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Official Poster Preview Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-slate-300 shadow-xs shrink-0 bg-white">
            <img
              src="/images/admin-structure.png"
              alt="ผังโครงสร้างการบริหารงาน"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#0F2942]">
              เอกสารผังโครงสร้างการบริหารงานอย่างเป็นทางการ
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              ไฟล์ผังแม่แบบโครงสร้าง 4 ฝ่าย สามารถคลิกเพื่อดูภาพขนาดเต็ม หรือพิมพ์เป็นเอกสารแนบ PDF
            </p>
          </div>
        </div>

        <a
          href="/images/admin-structure.png"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <span>ดูภาพผังเต็ม / ดาวน์โหลด</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
