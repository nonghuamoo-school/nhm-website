"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Megaphone,
  Users,
  FileSpreadsheet,
  Calendar,
  Building2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  FolderDown,
  GraduationCap
} from "lucide-react";

export default function ServiceHub() {
  return (
    <section className="space-y-4">
      {/* Section Header with Dignified Academic Branding */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#0F2942] text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>ศูนย์บริการและสารสนเทศสถานศึกษา</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
            ระบบบริการสารสนเทศและงานบริหารสถานศึกษา
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ช่องทางสืบค้นข้อมูล อำนวยความสะดวกสำหรับนักเรียน ผู้ปกครอง คณะครู และชุมชน
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ระบบเปิดให้บริการตามปกติ</span>
        </div>
      </div>

      {/* Modern Academic Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* ========================================================= */}
        {/* FEATURE CARD 1: งานวิชาการและผลสัมฤทธิ์ทางการเรียน (Span 7) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-gradient-to-br from-white via-blue-50/20 to-sky-50/40 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
          <div>
            {/* Top Badge & Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide block">
                    งานวิชาการและประกันคุณภาพ
                  </span>
                  <h3 className="font-bold text-lg text-[#0F2942] group-hover:text-blue-800 transition-colors">
                    ผลสัมฤทธิ์ทางการศึกษา (RT, NT, O-NET)
                  </h3>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                สูงกว่าเกณฑ์ระดับประเทศ
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              รายงานผลการประเมินคุณภาพผู้เรียนระดับชาติ การจัดการเรียนรู้เชิงรุก (Active Learning) 
              และข้อมูลสถิติผลสัมฤทธิ์ทางการศึกษาที่เปิดเผยต่อสาธารณะ
            </p>

            {/* 3 Key Academic Assessment Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2">
              {/* Metric 1: RT P.1 */}
              <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500">RT (ป.1)</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +4.80
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#0F2942]">82.95%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">การอ่านออกเสียง & รู้เรื่อง</div>
              </div>

              {/* Metric 2: NT P.3 */}
              <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500">NT (ป.3)</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +3.50
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#0F2942]">58.35%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">คณิตศาสตร์ & ภาษาไทย</div>
              </div>

              {/* Metric 3: O-NET P.6 */}
              <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500">O-NET (ป.6)</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +3.80
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#0F2942]">46.46%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">4 กลุ่มสาระการเรียนรู้</div>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-3.5 mt-3 border-t border-blue-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              ข้อมูลเปรียบเทียบมาตรฐาน สพฐ. ปีการศึกษาล่าสุด – 2569
            </span>
            <Link
              href="/academic"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 group-hover:underline"
            >
              <span>ดูรายงานวิเคราะห์วิชาการฉบับเต็ม</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: ข่าวประชาสัมพันธ์และกิจกรรม (Span 5) */}
        {/* ========================================================= */}
        <Link
          href="/news"
          className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-400 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                ข่าวสาร & กิจกรรม
              </span>
            </div>

            <h3 className="font-bold text-base text-[#0F2942] group-hover:text-blue-800 transition-colors mb-1">
              ข่าวประชาสัมพันธ์และประกาศสถานศึกษา
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              ติดตามข่าวสารกิจกรรมการเรียนรู้ ข่าวสารครูผู้ปกครอง และประกาศจัดซื้อจัดจ้างภาครัฐ
            </p>

            {/* Quick News Categories Pill */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                • กิจกรรมโรงเรียน
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                • ข่าวสารวิชาการ
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                • ประกาศจัดซื้อจัดจ้าง
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-800">
            <span>เข้าสู่ศูนย์ข่าวสาร</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-600" />
          </div>
        </Link>

        {/* ========================================================= */}
        {/* CARD 3: บุคลากรทางการศึกษา (Span 4) */}
        {/* ========================================================= */}
        <Link
          href="/personnel"
          className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                12 อัตรากำลัง
              </span>
            </div>

            <h3 className="font-bold text-base text-[#0F2942] group-hover:text-blue-800 transition-colors mb-1">
              บุคลากรและทำเนียบคณะครู
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              ข้อมูลคณะผู้บริหาร ข้าราชการครู และบุคลากรผู้สอนประจำชั้นเรียน อนุบาล 2 – ประถมศึกษาปีที่ 6
            </p>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex justify-between">
                <span>คณะผู้บริหาร:</span>
                <strong className="text-slate-700">1 ท่าน</strong>
              </div>
              <div className="flex justify-between">
                <span>ครูผู้สอนประจำการ:</span>
                <strong className="text-slate-700">9 ท่าน</strong>
              </div>
              <div className="flex justify-between">
                <span>บุคลากรทางการศึกษา:</span>
                <strong className="text-slate-700">2 ท่าน</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-800">
            <span>ดูทำเนียบคณะครู</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-600" />
          </div>
        </Link>

        {/* ========================================================= */}
        {/* CARD 4: คลังเอกสาร & ครุภัณฑ์ (Span 4) */}
        {/* ========================================================= */}
        <Link
          href="/downloads"
          className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Drive & Excel
              </span>
            </div>

            <h3 className="font-bold text-base text-[#0F2942] group-hover:text-blue-800 transition-colors mb-1">
              คลังเอกสาร & ทะเบียนครุภัณฑ์
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              ดาวน์โหลดแบบฟอร์มคำร้องทางการ แบบประเมิน แผนพัฒนาการศึกษา และทะเบียนพัสดุครุภัณฑ์
            </p>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <FolderDown className="w-3.5 h-3.5" />
                <span>รองรับเปิดบน Google Drive โดยตรง</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>ส่งออกข้อมูลพัสดุเป็นแฟ้ม Excel (.xlsx)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-800">
            <span>ดาวน์โหลดเอกสาร</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-600" />
          </div>
        </Link>

        {/* ========================================================= */}
        {/* CARD 5: ปฏิทิน & สพป. บุรีรัมย์ เขต 3 (Span 4) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 5.1: ปฏิทินกิจกรรม */}
          <Link
            href="/calendar"
            className="flex-1 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  ปีการศึกษา 2569
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#0F2942] group-hover:text-blue-800 transition-colors">
                ปฏิทินปฏิบัติงานและกิจกรรม
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                กำหนดการเปิด-ปิดภาคเรียน และกิจกรรมสำคัญ
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-blue-800">
              <span>ดูปฏิทินการศึกษา</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </Link>

          {/* Card 5.2: สพป. บุรีรัมย์ เขต 3 */}
          <a
            href="https://www.brm3.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-xs hover:shadow-md hover:brightness-110 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-blue-200 border border-white/10">
                  หน่วยงานต้นสังกัด
                </span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-blue-200 transition-colors">
                สพป. บุรีรัมย์ เขต 3
              </h4>
              <p className="text-[11px] text-blue-200/80 mt-0.5 line-clamp-1">
                สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-blue-100">
              <span>www.brm3.go.th</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}


