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
    settings.postalCode ? `\u00A0${settings.postalCode}` : null,
  ]
    .filter(Boolean)
    .join(" ") || `ตำบลท่าโพธิ์ชัย อำเภอหนองกี่ จังหวัดบุรีรัมย์\u00A031210`;

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
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#D1DFF0] shadow-xs overflow-hidden">
        
        {/* Navy Header Banner with school accent indicator */}
        <div className="bg-[#1E3A5F] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between border-b-2 border-[#D96B34]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#7EB8E0]" />
            <h3 className="font-bold text-sm sm:text-base tracking-wide">
              ข้อมูลทั่วไปโรงเรียน
            </h3>
          </div>
          <span className="text-[11px] text-[#7EB8E0] font-mono">
            ระบบฐานข้อมูลสารสนเทศ สพฐ.
          </span>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Logo & School Name Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-white border border-[#D1DFF0] shadow-xs hover:scale-105 transition-transform">
              <SchoolLogo
                size={90}
                customLogoUrl={settings.customLogoUrl}
                emblemType={settings.emblemType}
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E3A5F]">
                {settings.name}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#4B6080] font-serif tracking-wide">
                {settings.nameEn}
              </p>
              <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#2F6FED]/30 text-[#1E3A5F] text-xs font-semibold mt-2 max-w-full text-center leading-relaxed">
                <Building2 className="w-3.5 h-3.5 text-[#2F6FED] shrink-0" />
                <span className="leading-relaxed">
                  <span className="inline">สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษา</span>
                  <span className="inline">&nbsp;</span>
                  <span className="inline-block whitespace-nowrap font-bold">บุรีรัมย์&nbsp;เขต&nbsp;3</span>
                </span>
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
          <div className="hidden sm:block max-w-4xl mx-auto overflow-hidden rounded-2xl border border-[#D1DFF0] shadow-2xs">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <tbody className="divide-y divide-[#D1DFF0]">
                {infoRows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[#EAF2FB]/30"
                    } hover:bg-[#EBF2FF]/60`}
                  >
                    <td className="py-2.5 px-5 font-semibold text-[#1E3A5F] w-64 sm:w-72 whitespace-nowrap bg-[#EAF2FB]/60 border-r border-[#D1DFF0]">
                      <span className="mr-2.5 opacity-80">{row.icon}</span>
                      {row.label}
                    </td>
                    <td className="py-2.5 px-5 text-[#0F1F30] font-medium thai-wrap">
                      {row.isLink ? (
                        <a
                          href={row.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#2F6FED] hover:underline font-semibold"
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
          <div className="text-center text-[11px] text-[#6B7FA0] pt-2 border-t border-[#D1DFF0]">
            (ข้อมูลทางการสถานศึกษา สังกัด สพป.&nbsp;บุรีรัมย์&nbsp;เขต&nbsp;3 ปีการศึกษา 2569)
          </div>
        </div>

        {/* ================= 4 CLEAN QUICK ACTION ACCESS TILES ================= */}
        <div className="bg-[#EAF2FB]/50 border-t border-[#D1DFF0] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F]">
              <Sparkles className="w-3.5 h-3.5 text-[#2F6FED]" />
              <span>เข้าถึงข้อมูลเชิงลึกและบริการสถานศึกษา (คลิกเพื่อเข้าชม)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Tile 1: รายงานผลวิชาการ O-NET / NT / RT */}
            <Link
              href="/academic"
              className="p-3.5 rounded-2xl bg-white border border-[#D1DFF0] hover:border-[#2F6FED] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF2FF] text-[#2F6FED] border border-[#2F6FED]/20 flex items-center justify-center group-hover:bg-[#2F6FED] group-hover:text-white transition-all">
                  <Award className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2F6FED] transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors">
                  ผลสัมฤทธิ์ O-NET • NT • RT
                </h4>
                <p className="text-[11px] text-[#6B7FA0] line-clamp-2 mt-0.5">
                  วิเคราะห์เปรียบเทียบ 3 ระดับ โรงเรียน เขตพื้นที่ ประเทศ
                </p>
              </div>
            </Link>

            {/* Tile 2: สถิติและจำนวนนักเรียน */}
            <Link
              href="/#student-stats"
              className="p-3.5 rounded-2xl bg-white border border-[#D1DFF0] hover:border-emerald-500 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Users className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-emerald-700 transition-colors">
                  สถิตินักเรียน
                </h4>
                <p className="text-[11px] text-[#6B7FA0] line-clamp-2 mt-0.5">
                  จำแนกตามชั้นเรียน อ.2 - ป.6 และสัดส่วนเพศ
                </p>
              </div>
            </Link>

            {/* Tile 3: บุคลากรทางการศึกษา */}
            <Link
              href="/personnel"
              className="p-3.5 rounded-2xl bg-white border border-[#D1DFF0] hover:border-[#D96B34] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#D96B34]/15 text-[#D96B34] border border-[#D96B34]/30 flex items-center justify-center group-hover:bg-[#D96B34] group-hover:text-white transition-all">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#D96B34] transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#D96B34] transition-colors">
                  ทำเนียบบุคลากร
                </h4>
                <p className="text-[11px] text-[#6B7FA0] line-clamp-2 mt-0.5">
                  ฝ่ายบริหาร คณะครู และบุคลากรทางการศึกษา
                </p>
              </div>
            </Link>

            {/* Tile 4: เอกสารและแบบฟอร์มดาวน์โหลด */}
            <Link
              href="/downloads"
              className="p-3.5 rounded-2xl bg-white border border-[#D1DFF0] hover:border-[#2F6FED] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF2FF] text-[#1E3A5F] border border-[#2F6FED]/20 flex items-center justify-center group-hover:bg-[#1E3A5F] group-hover:text-white transition-all">
                  <FolderDown className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2F6FED] transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors">
                  คลังเอกสารและดาวน์โหลด
                </h4>
                <p className="text-[11px] text-[#6B7FA0] line-clamp-2 mt-0.5">
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
