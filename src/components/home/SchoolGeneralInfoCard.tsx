"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Info,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Calendar,
  Compass,
  ArrowRight,
  ExternalLink,
  Award,
  Users,
  FolderDown,
  ChevronRight,
  Sparkles,
  Landmark,
  Car,
} from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

export default function SchoolGeneralInfoCard() {
  const { settings } = useSchoolSettings();

  const formattedAddress = [
    settings.villageNo ? settings.villageNo : null,
    settings.subDistrict ? `ต.${settings.subDistrict}` : null,
    settings.district ? `อ.${settings.district}` : null,
    `จ.${settings.province}`,
    settings.postalCode ? settings.postalCode : null,
  ]
    .filter(Boolean)
    .join(" ") || `ตำบลท่าโพธิ์ชัย อำเภอหนองกี่ จังหวัดบุรีรัมย์ 31210`;

  const infoRows = [
    { label: "รหัส Smis 8 หลัก", value: settings.smisCode8 || "31030078", icon: <span className="font-mono text-slate-400 text-[10px] font-bold">#</span> },
    { label: "รหัส Obec 6 หลัก", value: settings.obecCode6 || "260613", icon: <span className="font-mono text-slate-400 text-[10px] font-bold">#</span> },
    { label: "ชื่อสถานศึกษา (ไทย)", value: settings.name, icon: <Building2 className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "ชื่อสถานศึกษา (อังกฤษ)", value: settings.nameEn, icon: <Building2 className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "ที่อยู่", value: formattedAddress, icon: <MapPin className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "โทรศัพท์", value: settings.phone || "081-743-2407", icon: <Phone className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "ระดับที่เปิดสอน", value: settings.schoolLevels || "อนุบาล 2 – ประถมศึกษาปีที่ 6", icon: <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "วัน-เดือน-ปี ก่อตั้ง", value: `พ.ศ. ${settings.establishedYear || "2517"}`, icon: <Calendar className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "อีเมล", value: settings.email || "31030078@brm3.go.th", icon: <Mail className="w-3.5 h-3.5 text-slate-400" /> },
    {
      label: "Facebook",
      value: settings.facebook && settings.facebook.startsWith("http")
        ? settings.facebook
        : "https://www.facebook.com/profile.php?id=100071517975903",
      displayValue: "โรงเรียนบ้านหนองหัวหมู (Facebook Page)",
      isLink: true,
      icon: <Globe className="w-3.5 h-3.5 text-slate-400" />,
    },
    { label: "หน่วยงานต้นสังกัด", value: settings.subAffiliation, icon: <Building2 className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "กลุ่มโรงเรียน", value: settings.schoolGroup || "ดอนอะรางทุ่งกระเต็น", icon: <Users className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "อปท.", value: settings.localGov || "องค์การบริหารส่วนตำบลทุ่งกระเต็น", icon: <Landmark className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "ระยะทางจาก รร. ถึง สพท.", value: settings.distanceFromOffice || "26 กม.", icon: <Car className="w-3.5 h-3.5 text-slate-400" /> },
    { label: "ระยะทางจาก รร. ถึง อำเภอ", value: settings.distanceFromDistrict || "12 กม.", icon: <Car className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <section className="space-y-4">
      {/* Container Card Matching Official OBEC / SMIS Reference Image */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Navy Header Banner */}
        <div className="bg-[#0c3759] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-300" />
            <h3 className="font-bold text-sm sm:text-base tracking-wide">
              ข้อมูลทั่วไปโรงเรียน
            </h3>
          </div>
          <span className="text-[11px] text-sky-200/80 font-mono">
            ระบบฐานข้อมูลสารสนเทศ สพฐ.
          </span>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Logo & School Name Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:scale-105 transition-transform">
              <SchoolLogo
                size={90}
                customLogoUrl={settings.customLogoUrl}
                emblemType={settings.emblemType}
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F2942]">
                {settings.name}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 font-serif tracking-wide">
                {settings.nameEn}
              </p>
              <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold mt-2 max-w-full text-center leading-relaxed">
                <Building2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="thai-wrap">สังกัด {settings.subAffiliation}</span>
              </div>
            </div>
          </div>

          {/* Mobile View: Dedicated Clean Stacked Cards (Zero syllable cuts on small screens) */}
          <div className="sm:hidden divide-y divide-slate-100 bg-slate-50/60 rounded-2xl border border-slate-200/80 p-2">
            {infoRows.map((row) => (
              <div key={row.label} className="py-2.5 px-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <span className="opacity-80">{row.icon}</span>
                  <span>{row.label}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-relaxed pl-5 thai-wrap">
                  {row.isLink ? (
                    <a
                      href={row.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-700 hover:underline"
                    >
                      <span>{row.displayValue || row.value}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    row.value
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Official Specification Table (Balanced max-width & clean layout on PC) */}
          <div className="hidden sm:block max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <tbody className="divide-y divide-slate-100">
                {infoRows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                    } hover:bg-blue-50/40`}
                  >
                    <td className="py-2.5 px-5 font-semibold text-slate-600 w-64 sm:w-72 whitespace-nowrap bg-slate-50/80 border-r border-slate-100">
                      <span className="mr-2.5 opacity-70">{row.icon}</span>
                      {row.label}
                    </td>
                    <td className="py-2.5 px-5 text-slate-800 font-medium thai-wrap">
                      {row.isLink ? (
                        <a
                          href={row.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                        >
                          <span>{row.displayValue || row.value}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timestamp footer from SMIS */}
          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            (ข้อมูลทางการสถานศึกษา สังกัด สพป. บุรีรัมย์ เขต 3 ปีการศึกษา 2569)
          </div>
        </div>

        {/* ================= 4 CLEAN QUICK ACTION ACCESS TILES ================= */}
        <div className="bg-slate-50/80 border-t border-slate-200/90 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2942]">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>เข้าถึงข้อมูลเชิงลึกและบริการสถานศึกษา (คลิกเพื่อเข้าชม)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Tile 1: รายงานผลวิชาการ O-NET / NT / RT */}
            <Link
              href="/academic"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <Award className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2942] group-hover:text-blue-700 transition-colors">
                  ผลสัมฤทธิ์ O-NET • NT • RT
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  วิเคราะห์เปรียบเทียบ 3 ระดับ โรงเรียน เขตพื้นที่ ประเทศ
                </p>
              </div>
            </Link>

            {/* Tile 2: สถิติและจำนวนนักเรียน */}
            <Link
              href="/#student-stats"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-all">
                  <Users className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2942] group-hover:text-emerald-700 transition-colors">
                  สถิตินักเรียน
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  จำแนกตามชั้นเรียน อ.2 - ป.6 และสัดส่วนเพศ
                </p>
              </div>
            </Link>

            {/* Tile 3: บุคลากรทางการศึกษา */}
            <Link
              href="/personnel"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2942] group-hover:text-amber-700 transition-colors">
                  ทำเนียบบุคลากร
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  ฝ่ายบริหาร คณะครู และบุคลากรทางการศึกษา
                </p>
              </div>
            </Link>

            {/* Tile 4: เอกสารและแบบฟอร์มดาวน์โหลด */}
            <Link
              href="/downloads"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-all">
                  <FolderDown className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2942] group-hover:text-purple-700 transition-colors">
                  คลังเอกสารและดาวน์โหลด
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  แผนปฏิบัติการ แบบฟอร์มคำร้อง และเอกสารเผยแพร่
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
