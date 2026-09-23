"use client";

import React from "react";
import SchoolLogo from "@/components/common/SchoolLogo";

interface DMCVerificationCardProps {
  studentCount?: number;
  progressPercent?: number;
  statusText?: string;
  year?: string;
}

export default function DMCVerificationCard({
  studentCount = 105,
  progressPercent = 94,
  statusText = "เกือบเสร็จแล้ว...",
  year = "2569"
}: DMCVerificationCardProps) {
  return (
    <div className="relative rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center text-center">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Orbit Logo Container matching uploaded image */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Dashed outer orbital ring */}
        <div className="absolute -inset-4 rounded-3xl border border-dashed border-blue-300/80 animate-[spin_40s_linear_infinite] pointer-events-none" />
        
        {/* White rounded card with school emblem */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 shadow-lg p-2.5 flex items-center justify-center">
          <SchoolLogo size={68} />
        </div>
      </div>

      {/* Database Title */}
      <div className="mt-5 space-y-1">
        <h3 className="text-base sm:text-lg font-black tracking-wider text-[#0F2942] uppercase">
          DMC STUDENT DATABASE
        </h3>
        <p className="text-xs sm:text-sm font-bold text-blue-600">
          โรงเรียนบ้านหนองหัวหมู • ปีการศึกษา {year}
        </p>
      </div>

      {/* Progress Bar Container matching uploaded image */}
      <div className="w-full max-w-md mt-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{statusText}</span>
            <span className="text-[11px] font-normal text-slate-400">
              (ยืนยันแล้ว {Math.round((studentCount * progressPercent) / 100)} จาก {studentCount} คน)
            </span>
          </div>
          <span className="text-sm font-black text-blue-600">{progressPercent}%</span>
        </div>

        {/* Striped Gradient Bar */}
        <div className="w-full h-3.5 bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 rounded-full shadow-md transition-all duration-1000 relative overflow-hidden"
          >
            {/* Gloss highlight */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[move-bg_2s_linear_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
