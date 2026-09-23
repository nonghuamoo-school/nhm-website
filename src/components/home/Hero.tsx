"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Award, Sparkles, Building2, ChevronRight } from "lucide-react";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

export default function Hero() {
  const { settings } = useSchoolSettings();

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-sky-50/40 border border-slate-200/80 shadow-xs">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full">
          
          {/* Left Column: School Welcome & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            
            {/* Institutional Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[11px] sm:text-xs font-bold shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{settings.subAffiliation} • {settings.affiliationBadge}</span>
              </span>
            </div>

            {/* School Title & Code */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2942] tracking-tight leading-tight">
                {settings.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                {settings.nameEn}
              </p>
            </div>

            {/* School Motto Highlight Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-blue-100 shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 block uppercase tracking-wide">
                คำขวัญประจำโรงเรียน
              </span>
              <p className="text-sm sm:text-base font-bold text-[#0F2942] mt-0.5">
                &ldquo;{settings.motto}&rdquo;
              </p>
            </div>

            {/* Welcome paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {settings.welcomeMessage}
            </p>

            {/* Action Buttons: Responsive Grid on Mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <Link
                href={settings.heroBtn1Url}
                className="col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all min-h-[42px]"
              >
                <span>{settings.heroBtn1Text}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                href={settings.heroBtn2Url}
                className="col-span-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F2942] font-bold text-xs sm:text-sm border border-slate-200/90 shadow-2xs transition-colors min-h-[42px]"
              >
                <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{settings.heroBtn2Text}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: School Image without any floating badges covering the photo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col mt-2 sm:mt-0">
            <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white aspect-[16/11] shadow-md">
              <img
                src={settings.heroImageUrl}
                alt={settings.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Placed below the image so it NEVER covers or obscures the photo */}
            <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  {settings.heroBadge1Label || "ระดับการศึกษา"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0F2942]">
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
