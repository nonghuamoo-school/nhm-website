"use client";

import React from "react";
import {
  Building2,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Users,
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function AreaOfficePortalPage() {
  const areaOfficeServices = [
    {
      name: "ระบบสารสนเทศเพื่อการบริหารการศึกษา (DMC / EMIS)",
      description: "ระบบจัดเก็บข้อมูลนักเรียนรายบุคคลและข้อมูลพื้นฐานทางการศึกษา",
      url: "https://www.brm3.go.th",
      badge: "ระบบสารสนเทศ",
    },
    {
      name: "ระบบหนังสือราชการอิเล็กทรอนิกส์ (Smart Area / AMSS++)",
      description: "ระบบรับ-ส่งหนังสือราชการและข้อสั่งการระหว่างโรงเรียนกับเขตพื้นที่",
      url: "https://www.brm3.go.th",
      badge: "งานสารบรรณ",
    },
    {
      name: "ประกาศจัดซื้อจัดจ้างและสอบราคา สพป. บุรีรัมย์ เขต 3",
      description: "ประกาศเผยแพร่แผนการจัดซื้อจัดจ้างและการประกวดราคาภาครัฐ",
      url: "https://www.brm3.go.th",
      badge: "งานพัสดุ",
    },
    {
      name: "ศูนย์พัฒนาวิชาชีพครูและบุคลากรทางการศึกษา",
      description: "การขอมีและเลื่อนวิทยฐานะ (PA / DPA) และการพัฒนาสมรรถนะครู",
      url: "https://www.brm3.go.th",
      badge: "งานบุคคล",
    },
    {
      name: "ข่าวสารและกิจกรรมประชาสัมพันธ์ สพป. บุรีรัมย์ เขต 3",
      description: "ติดตามภาพกิจกรรมการนิเทศ กำกับ ติดตาม และนโยบายทางการศึกษา",
      url: "https://www.brm3.go.th",
      badge: "ประชาสัมพันธ์",
    },
    {
      name: "คลังข้อมูลกฎหมาย ระเบียบ และคู่มือการปฏิบัติราชการ",
      description: "ดาวน์โหลดแบบฟอร์ม ระเบียบกระทรวงศึกษาธิการ และแนวปฏิบัติราชการ",
      url: "https://www.brm3.go.th",
      badge: "นิติการ",
    },
  ];

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "สำนักงานเขตพื้นที่การศึกษา" }]}
      title="สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3"
      description="หน่วยงานต้นสังกัดผู้กำกับดูแล ส่งเสริม และประสานความร่วมมือการจัดการศึกษาของโรงเรียนบ้านหนองหัวหมู"
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Main Area Office Portal Card */}
        <div className="bg-gradient-to-br from-[#0F2942] via-[#163C61] to-[#0A1D30] text-white rounded-2xl p-6 sm:p-8 border border-blue-900/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>หน่วยงานต้นสังกัดทางการศึกษา</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3 (สพป. บุรีรัมย์ เขต 3)
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              กำกับดูแลสถานศึกษาขั้นพื้นฐานในเขตพื้นที่อำเภอนางรอง อำเภอละหานทราย อำเภอปะคำ อำเภอเฉลิมพระเกียรติ และอำเภอโนนสุวรรณ จังหวัดบุรีรัมย์ สังกัดสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>www.brm3.go.th</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>044-672-040</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <a
              href="https://www.brm3.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
            >
              <span>เข้าสู่เว็บไซต์ สพป. บุรีรัมย์ เขต 3</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Portal Services of Area Office */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F2942] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F2942]" />
              <span>ระบบบริการและสารสนเทศ สพป. บุรีรัมย์ เขต 3</span>
            </h3>

            <a
              href="https://www.brm3.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>เปิดดูทั้งหมดบน www.brm3.go.th</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areaOfficeServices.map((srv, idx) => (
              <a
                key={idx}
                href={srv.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 inline-block mb-2">
                    {srv.badge}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F2942] group-hover:text-blue-900 transition-colors leading-snug">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F2942] group-hover:text-blue-800">
                  <span>เข้าใช้งานระบบ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact & Location of Area Office */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-[#0F2942]">ข้อมูลการติดต่อสำนักงานเขตพื้นที่การศึกษา</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3
                <br />
                อำเภอนางรอง จังหวัดบุรีรัมย์ 31110
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                โทรศัพท์: 044-672-040
                <br />
                โทรสาร: 044-672-041
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                เว็บไซต์: www.brm3.go.th
                <br />
                อีเมล: saraban@brm3.go.th
              </span>
            </div>
          </div>
        </div>
      </div>
    </InnerPageLayout>
  );
}
