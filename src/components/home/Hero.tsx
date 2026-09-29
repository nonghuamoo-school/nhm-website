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

      <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full">
          
          {/* Left Column: School Welcome & Identity (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A5F] tracking-tight leading-tight whitespace-normal sm:whitespace-nowrap">
                {settings.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#4B6080] mt-1 whitespace-nowrap">
                {settings.nameEn}
              </p>
            </div>

            {/* School Hero Gate Photo with Education Level Badge */}
            <div className="space-y-2.5">
              <div className="rounded-2xl overflow-hidden border border-[#D1DFF0] bg-white aspect-[16/9] shadow-md relative">
                <OptimizedNewsImage
                  src={settings.heroImageUrl}
                  alt={settings.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-full object-cover"
                />
              </div>

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

            {/* School Motto Highlight Card: Glassmorphism */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#D1DFF0] shadow-2xs">
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

            {/* Welcome paragraph */}
            <p className="text-xs sm:text-sm text-[#334155] leading-[1.8] font-normal indent-6 sm:indent-8 text-left [overflow-wrap:break-word]">
              {settings.welcomeMessage}
            </p>

            {/* Action Buttons: Responsive Grid on Mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
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

          {/* Right Column: Director Profile Card (5 cols on lg screens) */}
          <div className="flex lg:col-span-5 flex-col justify-center">
            <Link
              href="/personnel"
              className="group block w-full bg-gradient-to-b from-[#F0F5FF]/95 via-white/95 to-[#F4F8FD]/95 backdrop-blur-md rounded-3xl border border-[#2F6FED]/30 hover:border-[#2F6FED] shadow-xs hover:shadow-md transition-all duration-300 p-6 sm:p-8 text-center relative overflow-hidden"
              title="คลิกเพื่อดูทำเนียบครูและบุคลากรทางการศึกษา"
            >
              {/* Decorative ambient background glows */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#2F6FED]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#D96B34]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Director Avatar Photo: Large 104px (sm:112px), dignified */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-[#2F6FED]/40 shadow-md bg-slate-100 ring-4 ring-white shrink-0 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <OptimizedNewsImage
                    src={directorImage}
                    alt={directorName}
                    fill
                    priority
                    sizes="112px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Badge: ผู้บริหารสถานศึกษา */}
                <div className="mb-2.5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#2F6FED]/15 text-[#2F6FED] font-bold text-xs border border-[#2F6FED]/25 whitespace-nowrap">
                    ผู้บริหารสถานศึกษา
                  </span>
                </div>

                {/* Name: Big, bold, completely unclipped Thai vowels */}
                <h3 className="font-extrabold text-xl sm:text-2xl text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors leading-relaxed mb-1">
                  {directorName}
                </h3>

                {/* Position: Clean Thai typography with proper line height */}
                <p className="text-xs sm:text-sm text-[#4B6080] font-medium leading-relaxed">
                  {directorTitle}
                </p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
