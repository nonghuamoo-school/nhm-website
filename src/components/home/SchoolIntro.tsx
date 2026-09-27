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
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#EAF2FB] text-[#2F6FED]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-[#1E3A5F]">
                ประวัติและวิสัยทัศน์ (Vision & Identity)
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed indent-6 sm:indent-8 text-left [overflow-wrap:break-word]">
              <strong>{schoolInfo.name}</strong> ตั้งอยู่ ณ จังหวัด{schoolInfo.province} สังกัด{schoolInfo.subAffiliation} จัดการศึกษาระดับการศึกษาปฐมวัย และระดับการศึกษาขั้นพื้นฐาน (ประถมศึกษา) เพื่อส่งเสริมการเรียนรู้ของเยาวชนในชุมชนและพื้นที่ใกล้เคียงอย่างทั่วถึงและเท่าเทียม
            </p>

            {/* Vision Banner */}
            <div className="bg-[#EAF2FB]/50 border border-[#D1DFF0] border-l-4 border-l-[#2F6FED] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5 text-[#1E3A5F] font-semibold text-xs">
                <BookOpen className="w-4 h-4 text-[#2F6FED]" />
                <span>วิสัยทัศน์ของโรงเรียน</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1E3A5F] leading-relaxed font-medium text-left [overflow-wrap:break-word]">
                &ldquo;{schoolInfo.vision}&rdquo;
              </p>
            </div>

            {/* Key missions list */}
            <div>
              <h4 className="text-xs font-semibold text-[#1E3A5F] mb-2">
                พันธกิจสำคัญ (School Missions):
              </h4>
              <ul className="space-y-2">
                {schoolInfo.mission.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#D1DFF0] flex items-center justify-between">
            <span className="text-xs text-[#6B7FA0] font-medium">
              คำขวัญ: &ldquo;{schoolInfo.motto}&rdquo;
            </span>
            <Link
              href="/about"
              className="text-xs font-medium text-[#2F6FED] hover:text-[#1E3A5F] flex items-center gap-1 transition-colors"
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
