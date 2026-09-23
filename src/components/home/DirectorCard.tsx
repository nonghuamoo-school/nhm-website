import React from "react";
import { Quote, Phone, Mail } from "lucide-react";
import { schoolInfo } from "@/data/schoolInfo";

export default function DirectorCard() {
  const { director } = schoolInfo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle top decoration badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full">
          สารจากผู้อำนวยการ
        </span>
        <Quote className="w-6 h-6 text-slate-200" />
      </div>

      <div className="my-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Director avatar photo */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-100">
            <img
              src={director.imageUrl}
              alt="ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs">
            ผู้บริหาร
          </span>
        </div>

        {/* Director Info & Statement */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-slate-900">{director.name}</h3>
          <p className="text-xs text-blue-700 font-medium">{director.position}</p>
          {director.academicStanding !== "[รอข้อมูลจริง]" && (
            <p className="text-[11px] text-slate-500">{director.academicStanding}</p>
          )}

          <blockquote className="mt-3 text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border-l-2 border-amber-400">
            &ldquo;{director.message}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Footer Contact bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>โทร: {director.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>อีเมล: {director.email}</span>
        </div>
      </div>
    </div>
  );
}
