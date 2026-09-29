"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Building2 } from "lucide-react";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { schoolPersonnel } from "@/data/personnel";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

export default function Hero() {
  const { settings } = useSchoolSettings();
  const director = schoolPersonnel[0];
  const directorName = settings.directorName || director?.name || "นายอดุลย์ วิกุล";
  const directorImage = director?.imageUrl || settings.directorImageUrl || "/images/school-emblem-doc.png";
  const directorTitle = "ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู";

  return (
    <section className="relative rounded-3xl overflow-hidden bg-white/75 backdrop-blur-md border border-[#D1DFF0] shadow-xs">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#2F6FED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D96B34]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 lg:p-8 space-y-5">
        
        {/* Top Header: Institutional Badges + School Title & Subtitle */}
        <div className="space-y-2">
          {/* Institutional Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#1E3A5F] border border-[#2F6FED]/30 text-[11px] sm:text-xs font-bold shadow-2xs whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5 text-[#2F6FED] shrink-0" />
              <span className="hidden sm:inline">{settings.subAffiliation}</span>
              <span className="sm:hidden">สพป. บุรีรัมย์ เขต&nbsp;3</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 text-[#4B6080] border border-[#D1DFF0] text-[11px] sm:text-xs font-semibold shadow-2xs whitespace-nowrap">
              <span>{settings.affiliationBadge}</span>
            </span>
          </div>

          {/* School Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A5F] tracking-tight leading-tight">
              {settings.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#4B6080] mt-0.5">
              {settings.nameEn}
            </p>
          </div>
        </div>

        {/* Middle Showcase Grid: School Gate Photo (Left) & Director Profile Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Left: School Gate Photo & Education Level Badge (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5">
            <div className="rounded-2xl overflow-hidden border border-[#D1DFF0] bg-white shadow-sm relative h-[210px] sm:h-[260px] lg:h-[280px]">
              <OptimizedNewsImage
                src={settings.heroImageUrl}
                alt={settings.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Education Level Badge */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-[#D1DFF0] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#2F6FED] flex items-center justify-center shrink-0 border border-[#2F6FED]/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-[#6B7FA0] font-bold block uppercase">
                  {settings.heroBadge1Label || "ระดับการศึกษา"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#1E3A5F]">
                  {settings.heroBadge1Value || "อนุบาล 2 – ประถมศึกษาปีที่ 6"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Executive Director Profile Card (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col">
            <Link
              href="/personnel"
              className="group flex flex-col items-center justify-center text-center w-full h-full bg-gradient-to-b from-[#F0F5FF]/95 via-white/95 to-[#F4F8FD]/95 backdrop-blur-md rounded-2xl border border-[#2F6FED]/30 hover:border-[#2F6FED] shadow-2xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 relative overflow-hidden"
              title="คลิกเพื่อดูทำเนียบครูและบุคลากรทางการศึกษา"
            >
              {/* Decorative ambient background glows */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#2F6FED]/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#D96B34]/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center my-auto">
                {/* Director Avatar: 84px on mobile (80-90px), 100px on tablet, 120px on desktop (110-130px) */}
                <div className="relative w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden border-2 border-[#2F6FED]/40 shadow-md bg-slate-100 ring-4 ring-white shrink-0 mb-3">
                  <OptimizedNewsImage
                    src={directorImage}
                    alt={directorName}
                    fill
                    priority
                    sizes="(min-width: 1024px) 120px, (min-width: 640px) 100px, 84px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Badge: ผู้บริหารสถานศึกษา */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#2F6FED]/15 text-[#2F6FED] font-bold text-xs border border-[#2F6FED]/25 whitespace-nowrap">
                    ผู้บริหารสถานศึกษา
                  </span>
                </div>

                {/* Name: Bold with unclipped Thai vowels */}
                <h3 className="font-extrabold text-lg sm:text-xl lg:text-2xl text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors leading-relaxed mb-0.5">
                  {directorName}
                </h3>

                {/* Position: Clean typography */}
                <p className="text-xs sm:text-sm text-[#4B6080] font-medium leading-relaxed">
                  {directorTitle}
                </p>
              </div>
            </Link>
          </div>

        </div>

        {/* Bottom Section: School Motto & Welcome Paragraph & Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
          {/* School Motto Highlight Card */}
          <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#D1DFF0] shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#D96B34] rounded-full inline-block" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#D96B34] uppercase tracking-wide">
                คำขวัญประจำโรงเรียน
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#1E3A5F] mt-1 pl-2.5">
              &ldquo;{settings.motto}&rdquo;
            </p>
          </div>

          {/* Welcome Message + Action Buttons */}
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs sm:text-sm text-[#334155] leading-[1.8] font-normal indent-6 sm:indent-8 text-left [overflow-wrap:break-word]">
              {settings.welcomeMessage}
            </p>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href={settings.heroBtn1Url}
                className="col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#1f5bcc] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all min-h-[44px]"
              >
                <span>{settings.heroBtn1Text}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                href={settings.heroBtn2Url}
                className="col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1E3A5F] font-bold text-xs sm:text-sm border border-[#D1DFF0] shadow-2xs transition-colors min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-[#2F6FED] shrink-0" />
                <span>{settings.heroBtn2Text}</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
