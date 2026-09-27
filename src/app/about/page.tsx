"use client";

import React from "react";
import { Building, Target, BookOpen, Layers, Award, CheckCircle, Sparkles, Palette } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import SchoolGeneralInfoCard from "@/components/home/SchoolGeneralInfoCard";
import AdministrativeStructureChart from "@/components/about/AdministrativeStructureChart";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

export default function AboutPage() {
  const { settings } = useSchoolSettings();

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ข้อมูลโรงเรียน" }]}
      title="ข้อมูลโรงเรียนและประวัติความเป็นมา"
      description={`${settings.name} สังกัด ${settings.subAffiliation}`}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* 1. Full Specifications Table from SMIS / OBEC */}
        <SchoolGeneralInfoCard />

        {/* 2. History & Background: Glassmorphism */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#D1DFF0] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#D1DFF0]">
            <Building className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#D96B34] rounded-full inline-block" />
              <span>ประวัติความเป็นมา</span>
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-[#334155] leading-relaxed space-y-4">
            {(settings.historyText || "โรงเรียนบ้านหนองหัวหมู ก่อตั้งขึ้นเมื่อวันที่ 1 พฤษภาคม พ.ศ. 2517 ตั้งอยู่เลขที่ 144 หมู่ที่ 7 บ้านโคกสะอาด ตำบลทุ่งกระเต็น อำเภอหนองกี่ จังหวัดบุรีรัมย์ สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต\u00A03 จัดการศึกษาขั้นพื้นฐานตั้งแต่ระดับอนุบาล 2 ถึงประถมศึกษาปีที่ 6 มุ่งเน้นการจัดการเรียนรู้เชิงรุก (Active Learning) ปลูกฝังคุณธรรม จริยธรรม สอดแทรกทักษะชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง")
              .split("\n")
              .filter((p) => p.trim().length > 0)
              .map((paragraph, idx) => (
                <p
                  key={idx}
                  className="indent-6 sm:indent-8 text-left leading-relaxed text-[#334155] [overflow-wrap:break-word]"
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </section>

        {/* 3. Philosophy, Colors, Motto, Vision Grid: Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vision, Philosophy & Motto */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#D1DFF0] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Philosophy */}
              <div>
                <div className="flex items-center gap-2 text-[#1E3A5F] font-bold mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#2F6FED]" />
                  <h4 className="text-sm font-bold">ปรัชญาของโรงเรียน (Philosophy)</h4>
                </div>
                <div className="p-3.5 sm:p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-[#D1DFF0] text-[#1E3A5F] font-semibold text-xs sm:text-sm leading-[1.7] text-left [overflow-wrap:break-word]">
                  &ldquo;{settings.philosophy || "นตฺถิ ปญฺญา สมา อาภา “ไม่มีแสงสว่างใดเสมอด้วยปัญญา”"}&rdquo;
                </div>
              </div>

              {/* School Motto */}
              <div>
                <div className="flex items-center gap-2 text-[#1E3A5F] font-bold mb-1.5">
                  <Award className="w-4 h-4 text-[#2F6FED]" />
                  <h4 className="text-sm font-bold">คำขวัญประจำโรงเรียน (Motto)</h4>
                </div>
                <div className="p-3.5 sm:p-4 bg-white/80 backdrop-blur-xs rounded-2xl border-l-4 border-l-[#2F6FED] border border-[#D1DFF0] text-[#1E3A5F] font-bold text-xs sm:text-sm leading-[1.7] text-left [overflow-wrap:break-word]">
                  &ldquo;{settings.motto}&rdquo;
                </div>
              </div>

              {/* Vision */}
              <div>
                <div className="flex items-center gap-2 text-[#1E3A5F] font-bold mb-1.5">
                  <Target className="w-4 h-4 text-[#2F6FED]" />
                  <h4 className="text-sm font-bold">วิสัยทัศน์ (Vision)</h4>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D1DFF0] border-l-4 border-l-[#1E3A5F] text-[#1E3A5F] font-medium text-xs sm:text-sm leading-[1.7] text-left shadow-2xs [overflow-wrap:break-word]">
                  &ldquo;{settings.vision}&rdquo;
                </div>
              </div>

              {/* School Color */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <Palette className="w-4 h-4 text-[#2F6FED]" />
                <span className="font-bold text-[#1E3A5F]">สีประจำโรงเรียน:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2FB] text-[#1E3A5F] border border-[#D1DFF0] font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D96B34] border border-white shrink-0" />
                  <span>{settings.colors || "สีแสด – สีขาว"}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D1DFF0] text-xs text-[#6B7FA0]">
              เอกลักษณ์: <strong className="text-[#1E3A5F]">{settings.uniqueness}</strong> • อัตลักษณ์: <strong className="text-[#1E3A5F]">{settings.identity}</strong>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#D1DFF0] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#1E3A5F] font-bold mb-4 pb-2 border-b border-[#D1DFF0]">
                <BookOpen className="w-5 h-5 text-[#2F6FED]" />
                <h3 className="text-base font-bold">พันธกิจของโรงเรียน (Missions)</h3>
              </div>
              <ul className="space-y-3">
                {settings.mission.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Official Administrative Structure Chart */}
        <AdministrativeStructureChart />

        {/* 5. Fact Sheet */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#D1DFF0] shadow-xs">
          <h3 className="text-base font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#D96B34] rounded-full inline-block" />
            <span>ข้อมูลจำเพาะสถานศึกษา (Fact Sheet)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">กลุ่มโรงเรียน</span>
              <span className="font-bold text-[#1E3A5F]">{settings.schoolGroup || "ดอนอะรางทุ่งกระเต็น"}</span>
            </div>
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">ปีที่ก่อตั้ง</span>
              <span className="font-bold text-[#1E3A5F]">วันที่ 1 พฤษภาคม พ.ศ. {settings.establishedYear}</span>
            </div>
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">ระดับชั้นที่เปิดสอน</span>
              <span className="font-bold text-[#1E3A5F]">{settings.schoolLevels}</span>
            </div>
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">สีประจำโรงเรียน</span>
              <span className="font-bold text-[#1E3A5F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D96B34] inline-block shrink-0" />
                <span>{settings.colors || "สีแสด – สีขาว"}</span>
              </span>
            </div>
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">ที่ตั้งสถานศึกษา</span>
              <span className="font-bold text-[#1E3A5F]">{settings.villageNo} ต.{settings.subDistrict} อ.{settings.district}</span>
            </div>
            <div className="p-3.5 bg-[#EAF2FB]/50 rounded-2xl border border-[#D1DFF0]">
              <span className="text-[#6B7FA0] block mb-0.5">สำนักงานเขตพื้นที่การศึกษา</span>
              <span className="font-bold text-[#1E3A5F]">{settings.subAffiliation}</span>
            </div>
          </div>
        </section>
      </div>
    </InnerPageLayout>
  );
}
