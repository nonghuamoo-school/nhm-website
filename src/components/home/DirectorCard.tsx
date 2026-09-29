"use client";

import React from "react";
import { Quote, Phone, Mail } from "lucide-react";
import { schoolInfo } from "@/data/schoolInfo";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { usePersonnel } from "@/hooks/usePersonnel";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

export default function DirectorCard() {
  const { settings } = useSchoolSettings();
  const { personnelList } = usePersonnel();

  const directorMember =
    personnelList.find(
      (p) =>
        p.id === "p-01" ||
        p.position?.includes("ผู้อำนวยการ") ||
        p.roles?.some((r) => r.includes("ผู้อำนวยการ"))
    ) || personnelList[0];

  const directorName = directorMember?.name || settings.directorName || schoolInfo.director.name;
  const directorImage =
    directorMember?.imageUrl ||
    settings.directorImageUrl ||
    "/images/director-adul.jpg";
  const directorPosition = directorMember?.position || settings.directorTitle || schoolInfo.director.position;
  const directorStanding = directorMember?.academicDegree || settings.directorAcademicStanding || schoolInfo.director.academicStanding;
  const directorMessage = settings.directorMessage || schoolInfo.director.message;
  const directorPhone = settings.phone || schoolInfo.director.phone;
  const directorEmail = settings.email || schoolInfo.director.email;

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle top decoration badge */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D1DFF0]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] bg-[#EAF2FB] px-2.5 py-1 rounded-full border border-[#D1DFF0]">
          สารจากผู้อำนวยการ
        </span>
        <Quote className="w-6 h-6 text-[#D1DFF0]" />
      </div>

      <div className="my-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Director avatar photo */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-[#1E3A5F] shadow-md bg-slate-100 relative">
            <OptimizedNewsImage
              src={directorImage}
              alt="ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู"
              fill
              priority
              sizes="112px"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="absolute -bottom-2 -right-1 bg-[#1E3A5F] text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs border border-white/20">
            ผู้บริหาร
          </span>
        </div>

        {/* Director Info & Statement */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-[#1E3A5F] whitespace-nowrap">{directorName}</h3>
          <p className="text-xs text-[#2F6FED] font-medium">{directorPosition}</p>
          {directorStanding && directorStanding !== "[รอข้อมูลจริง]" && (
            <p className="text-[11px] text-[#6B7FA0]">{directorStanding}</p>
          )}

          <blockquote className="mt-3 text-xs text-[#334155] leading-[1.7] bg-[#EAF2FB]/50 p-3.5 rounded-xl border border-[#D1DFF0] border-l-4 border-l-[#2F6FED] text-left [overflow-wrap:break-word]">
            &ldquo;{directorMessage}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Footer Contact bar */}
      <div className="pt-3 border-t border-[#D1DFF0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7FA0]">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#2F6FED]" />
          <span>โทร: {directorPhone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#2F6FED]" />
          <span>อีเมล: {directorEmail}</span>
        </div>
      </div>
    </div>
  );
}
