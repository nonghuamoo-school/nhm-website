import React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Sparkles, BookOpen } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import DirectorCard from "./DirectorCard";
import { schoolInfo } from "@/data/schoolInfo";

export default function SchoolIntro() {
  return (
    <section>
      <SectionTitle
        title="ข้อมูลและวิสัยทัศน์สถานศึกษา"
        subtitle="มุ่งมั่นสร้างรากฐานการศึกษาที่เข้มแข็ง พัฒนาศักยภาพนักเรียนสู่อนาคต"
        actionText="ดูข้อมูลโรงเรียนทั้งหมด"
        actionHref="/about"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: School Vision & Identity */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-50 text-blue-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-slate-900">
                ประวัติและวิสัยทัศน์ (Vision & Identity)
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed indent-8 sm:indent-10 text-justify whitespace-pre-wrap">
              <strong>{schoolInfo.name}</strong> ตั้งอยู่ ณ จังหวัด{schoolInfo.province} สังกัด{schoolInfo.subAffiliation} จัดการศึกษาระดับการศึกษาปฐมวัย และระดับการศึกษาขั้นพื้นฐาน (ประถมศึกษา) เพื่อส่งเสริมการเรียนรู้ของเยาวชนในชุมชนและพื้นที่ใกล้เคียงอย่างทั่วถึงและเท่าเทียม
            </p>

            {/* Vision Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5 text-blue-900 font-semibold text-xs">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>วิสัยทัศน์ของโรงเรียน</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-950 italic leading-relaxed font-medium indent-6 sm:indent-8 text-justify whitespace-pre-wrap">
                &ldquo;{schoolInfo.vision}&rdquo;
              </p>
            </div>

            {/* Key missions list */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">
                พันธกิจสำคัญ (School Missions):
              </h4>
              <ul className="space-y-2">
                {schoolInfo.mission.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              ปรัชญา: &ldquo;{schoolInfo.motto}&rdquo;
            </span>
            <Link
              href="/about"
              className="text-xs font-medium text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>อ่านประวัติและโครงสร้างบริหาร</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Director Profile Card */}
        <div className="lg:col-span-5 flex flex-col">
          <DirectorCard />
        </div>
      </div>
    </section>
  );
}
