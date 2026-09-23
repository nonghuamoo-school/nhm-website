import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, ChevronRight } from "lucide-react";
import { schoolInfo } from "@/data/schoolInfo";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl overflow-hidden shadow-lg border border-slate-800">
      {/* Subtle geometric background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column: Welcome text & CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ยินดีต้อนรับสู่เว็บไซต์ทางการ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {schoolInfo.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              สถานศึกษาแห่งการเรียนรู้ มุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม นำเทคโนโลยี ส่งเสริมทักษะชีวิต และร่วมสืบสานภูมิปัญญาท้องถิ่น ภายใต้การดูแลของ{schoolInfo.subAffiliation}
            </p>

            {/* Quick highlight points */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>การเรียนการสอนระดับ อ.2 - ป.6</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>ห้องเรียนคุณภาพ สื่อดิจิทัลครบครัน</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>เกี่ยวกับโรงเรียน</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all"
              >
                <BookOpen className="w-4 h-4 text-sky-300" />
                <span>ข่าวและกิจกรรมล่าสุด</span>
              </Link>
            </div>
          </div>

          {/* Right column: School Building & Activity Preview Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-xl bg-slate-800 aspect-[16/10] group">
              {/* Image banner with overlay */}
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=900"
                alt="อาคารเรียนโรงเรียนบ้านหนองหัวหมู"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
                  ภาพบรรยากาศสถานศึกษา
                </span>
                <p className="text-xs text-white font-medium mt-0.5">
                  อาคารเรียนและพื้นที่กิจกรรมส่งเสริมการเรียนรู้ที่ทันสมัย ปลอดภัย และร่มรื่น
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
