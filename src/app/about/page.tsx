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

        {/* 2. History & Background */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#0F2942]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#0F2942]">ประวัติความเป็นมา</h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            {settings.historyText
              ? settings.historyText
                  .split("\n")
                  .filter((p) => p.trim().length > 0)
                  .map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="indent-8 sm:indent-10 text-justify leading-relaxed whitespace-pre-wrap"
                    >
                      {paragraph}
                    </p>
                  ))
              : null}
            <p className="indent-8 sm:indent-10 text-justify leading-relaxed whitespace-pre-wrap">
              ปัจจุบันจัดการเรียนการสอนระดับ{settings.schoolLevels} มุ่งเน้นการจัดการเรียนรู้เชิงรุก (Active Learning) ปลูกฝังคุณธรรม จริยธรรม สอดแทรกทักษะชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง
            </p>
          </div>
        </section>

        {/* 3. Philosophy, Colors, Motto, Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vision, Philosophy & Motto */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Philosophy */}
              <div>
                <div className="flex items-center gap-2 text-amber-700 font-bold mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold">ปรัชญาของโรงเรียน (Philosophy)</h4>
                </div>
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-amber-950 font-bold text-xs sm:text-sm indent-6 text-justify whitespace-pre-wrap">
                  &ldquo;{settings.philosophy || "นตฺถิ ปญฺญา สมา อาภา “ไม่มีแสงสว่างใดเสมอด้วยปัญญา”"}&rdquo;
                </div>
              </div>

              {/* School Motto */}
              <div>
                <div className="flex items-center gap-2 text-orange-700 font-bold mb-1.5">
                  <Award className="w-4 h-4 text-orange-600" />
                  <h4 className="text-sm font-bold">คำขวัญประจำโรงเรียน (Motto)</h4>
                </div>
                <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200/80 text-orange-950 font-bold text-xs sm:text-sm indent-6 text-justify whitespace-pre-wrap">
                  &ldquo;{settings.motto}&rdquo;
                </div>
              </div>

              {/* Vision */}
              <div>
                <div className="flex items-center gap-2 text-[#0F2942] font-bold mb-1.5">
                  <Target className="w-4 h-4 text-[#0F2942]" />
                  <h4 className="text-sm font-bold">วิสัยทัศน์ (Vision)</h4>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[#0F2942] font-medium text-xs sm:text-sm leading-relaxed italic indent-8 sm:indent-10 text-justify whitespace-pre-wrap">
                  &ldquo;{settings.vision}&rdquo;
                </div>
              </div>

              {/* School Color */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <Palette className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-slate-700">สีประจำโรงเรียน:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 font-bold text-xs">
                  <span className="w-3 h-3 rounded-full bg-orange-500 border border-white" />
                  <span>{settings.colors || "สีแสด – สีขาว"}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
              เอกลักษณ์: <strong className="text-[#0F2942]">{settings.uniqueness}</strong> • อัตลักษณ์: <strong className="text-[#0F2942]">{settings.identity}</strong>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F2942] font-bold mb-4 pb-2 border-b border-slate-100">
                <BookOpen className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold">พันธกิจของโรงเรียน (Missions)</h3>
              </div>
              <ul className="space-y-3">
                {settings.mission.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Official Administrative Structure Chart (ผังโครงสร้าง 4 ฝ่ายตามเอกสารจริง) */}
        <AdministrativeStructureChart />

        {/* 5. Fact Sheet */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
          <h3 className="text-base font-bold text-[#0F2942] mb-4">ข้อมูลจำเพาะสถานศึกษา (Fact Sheet)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">กลุ่มโรงเรียน</span>
              <span className="font-bold text-slate-800">{settings.schoolGroup || "ดอนอะรางทุ่งกระเต็น"}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">ปีที่ก่อตั้ง</span>
              <span className="font-bold text-slate-800">วันที่ 1 พฤษภาคม พ.ศ. {settings.establishedYear}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">ระดับชั้นที่เปิดสอน</span>
              <span className="font-bold text-slate-800">{settings.schoolLevels}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">สีประจำโรงเรียน</span>
              <span className="font-bold text-orange-600">{settings.colors || "สีแสด – สีขาว"}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">ที่ตั้งสถานศึกษา</span>
              <span className="font-bold text-slate-800">{settings.villageNo} ต.{settings.subDistrict} อ.{settings.district}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">สำนักงานเขตพื้นที่การศึกษา</span>
              <span className="font-bold text-slate-800">{settings.subAffiliation}</span>
            </div>
          </div>
        </section>
      </div>
    </InnerPageLayout>
  );
}
