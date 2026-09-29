"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Award, Sparkles, Building2, ChevronRight } from "lucide-react";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { schoolPersonnel } from "@/data/personnel";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

export default function Hero() {
  const { settings } = useSchoolSettings();
  const director = schoolPersonnel[0];
  const directorName = settings.directorName || director?.name || "นายอดุลย์ วิกุล";
  const directorImage = director?.imageUrl || settings.directorImageUrl || "/images/school-emblem-doc.png";
  const directorTitle = "ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู";
  const directorAcademic =
    settings.directorAcademicStanding && settings.directorAcademicStanding !== "[รอข้อมูลจริง]"
      ? settings.directorAcademicStanding
      : (director?.academicDegree || "วิทยฐานะ ชำนาญการพิเศษ");

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

            {/* 3. [ตำแหน่งใหม่] การ์ดผู้อำนวยการ (Director Profile Card) */}
            <Link
              href="/personnel"
              className="group block w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#F0F5FF]/95 via-white/95 to-[#F4F8FD]/95 backdrop-blur-xs border border-[#2F6FED]/30 hover:border-[#2F6FED]/70 shadow-2xs hover:shadow-xs transition-all duration-300"
              title="คลิกเพื่อดูทำเนียบครูและบุคลากรทางการศึกษา"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Circular Photo (68-70px on desktop, ~56px on mobile) */}
                <div className="relative w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden shrink-0 border-2 border-[#2F6FED]/40 shadow-sm bg-slate-100 ring-2 ring-white">
                  <OptimizedNewsImage
                    src={directorImage}
                    alt={directorName}
                    fill
                    sizes="(max-width: 640px) 56px, 70px"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Information Details */}
                <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2F6FED]/15 text-[#2F6FED] font-bold text-[11px] sm:text-xs leading-none border border-[#2F6FED]/25 whitespace-nowrap">
                      ผู้บริหารสถานศึกษา
                    </span>
                    {directorAcademic && (
                      <span className="hidden md:inline-flex text-[11px] text-[#6B7FA0] font-medium leading-none">
                        • {directorAcademic.includes("วิทยฐานะ") ? directorAcademic : `วิทยฐานะ ${directorAcademic.replace("ผู้อำนวยการ", "").trim() || directorAcademic}`}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#1E3A5F] group-hover:text-[#2F6FED] transition-colors leading-tight truncate">
                    {directorName}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B6080] font-medium leading-tight truncate">
                    {directorTitle}
                  </p>
                </div>

                {/* Right Interactive Pill Action (Balanced CTA) */}
                <div className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white text-[#2F6FED] group-hover:bg-[#2F6FED] group-hover:text-white border border-[#2F6FED]/25 shadow-2xs group-hover:shadow-xs transition-all duration-200">
                  <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">ดูประวัติ</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            </Link>

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

          {/* Right Column: Hero Image (5 cols on lg screens, below left column on mobile) */}
          <div className="flex lg:col-span-5 flex-col mt-4 lg:mt-0">
            <div className="rounded-2xl overflow-hidden border border-[#D1DFF0] bg-white aspect-[16/11] shadow-md relative">
              <OptimizedNewsImage
                src={settings.heroImageUrl}
                alt={settings.name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Placed below the image */}
            <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#D1DFF0] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2F6FED] flex items-center justify-center shrink-0 border border-[#2F6FED]/20">
                <GraduationCap className="w-5 h-5" />
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

        </div>
      </div>
    </section>
  );
}
