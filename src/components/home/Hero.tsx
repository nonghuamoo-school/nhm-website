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
                {settings.nameEn} • รหัสสถานศึกษา {settings.schoolCode}
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

          {/* Right Column: School Image with Clean Modern Badges (5 cols) */}
          <div className="lg:col-span-5 relative mt-2 sm:mt-0">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white aspect-[16/11] shadow-md">
              <img
                src={settings.heroImageUrl}
                alt={settings.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

              {/* On-image Badges on Mobile (Clean overlay) */}
              <div className="absolute bottom-2 left-2 right-2 flex sm:hidden items-center justify-between gap-1 text-white">
                <span className="text-[10px] font-bold bg-black/60 backdrop-blur-xs px-2 py-1 rounded-lg">
                  {settings.heroBadge1Value}
                </span>
                <span className="text-[10px] font-bold bg-emerald-600/90 backdrop-blur-xs px-2 py-1 rounded-lg">
                  {settings.heroBadge2Value}
                </span>
              </div>
            </div>

            {/* Floating Badge 1: Education Level (Desktop) */}
            <div className="hidden sm:flex absolute -bottom-3 left-4 bg-white/95 backdrop-blur-xs text-[#0F2942] rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-md items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  {settings.heroBadge1Label}
                </span>
                <span className="text-xs font-bold text-[#0F2942]">
                  {settings.heroBadge1Value}
                </span>
              </div>
            </div>

            {/* Floating Badge 2: Academic Excellence (Desktop) */}
            <div className="hidden sm:flex absolute -top-3 right-4 bg-white/95 backdrop-blur-xs text-[#0F2942] rounded-2xl px-3.5 py-2 border border-slate-200 shadow-md items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="leading-tight">
                <span className="text-[10px] text-slate-400 font-bold block">
                  {settings.heroBadge2Label}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {settings.heroBadge2Value}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
