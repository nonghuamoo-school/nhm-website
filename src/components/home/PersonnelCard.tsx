import React from "react";
import { PersonnelMember } from "@/types";
import OptimizedNewsImage from "@/components/common/OptimizedNewsImage";

interface PersonnelCardProps {
  person: PersonnelMember;
  layout?: "auto" | "horizontal" | "vertical";
}

export default function PersonnelCard({ person, layout = "auto" }: PersonnelCardProps) {
  const displayGroup = person.subjectGroup || person.department;

  // Extract roles and deduplicate
  const rawRoles = person.roles && person.roles.length > 0
    ? person.roles
    : person.position
    ? [person.position]
    : [];

  const allRoles = Array.from(new Set(rawRoles.filter(Boolean)));
  const primaryRole = allRoles[0] || person.position || "บุคลากรทางการศึกษา";
  const additionalRoles = allRoles.slice(1);

  const isExecutive =
    person.id === "p-01" ||
    primaryRole.includes("ผู้อำนวยการ") ||
    person.position?.includes("ผู้อำนวยการ");

  // Determine flex direction based on layout mode
  const isHorizontalMode = layout === "horizontal" || layout === "auto";

  return (
    <div
      className={`glass-card rounded-2xl border border-[#D1DFF0] shadow-xs hover:shadow-md hover:border-[#2F6FED]/50 transition-all p-3.5 sm:p-4 group h-full ${
        isHorizontalMode
          ? "flex flex-row sm:flex-col items-center sm:items-stretch gap-3.5 sm:gap-0 text-left sm:text-center justify-between"
          : "flex flex-col justify-between text-center"
      }`}
    >
      {/* Profile Image */}
      <div className={`relative shrink-0 ${isHorizontalMode ? "mb-0 sm:mb-3 flex justify-center" : "mb-3 flex justify-center"}`}>
        <div
          className={`w-20 h-24 sm:w-26 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all shadow-xs bg-slate-100 relative ${
            isExecutive
              ? "border-[#D96B34] ring-2 ring-[#D96B34]/20"
              : "border-slate-200 group-hover:border-[#2F6FED]"
          }`}
        >
          {person.imageUrl && !person.imageUrl.includes("school-emblem-doc") ? (
            <OptimizedNewsImage
              src={person.imageUrl}
              alt={person.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 80px, 104px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200/80 flex flex-col items-center justify-center p-2 text-slate-400">
              <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-[9px] font-bold text-slate-400 mt-1">รูปถ่าย</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 sm:w-full flex flex-col justify-between">
        <div>
          {/* Name */}
          <h3 className="font-bold text-sm sm:text-base text-[#1E3A5F] leading-snug whitespace-nowrap">
            {person.name}
          </h3>

          {/* 1. ตำแหน่งหลัก (เด่น ชัดเจน เป็นทางการ) */}
          <div className="mt-1.5 mb-1 sm:mt-2">
            <span
              className={`inline-block w-full px-2.5 py-1 rounded-lg text-xs font-bold leading-snug text-center shadow-xs thai-wrap ${
                isExecutive
                  ? "bg-[#1E3A5F] text-[#D96B34] border border-[#D96B34]/40"
                  : "bg-[#1E3A5F] text-white"
              }`}
            >
              {primaryRole}
            </span>
          </div>

          {/* 2. ตำแหน่งเพิ่มเติม (โทนน้ำเงินอ่อน เข้ากับธีม อ่านชัดเจน ไม่เหมือนปุ่ม disabled) */}
          {additionalRoles.length > 0 && (
            <div className={`flex flex-col gap-1.5 mt-1.5 w-full ${isHorizontalMode ? "items-stretch sm:items-center" : "items-center"}`}>
              {additionalRoles.map((role, idx) => (
                <span
                  key={idx}
                  className={`w-full text-[11px] sm:text-[11.5px] text-[#1E3A5F] font-semibold bg-[#EAF2FB] hover:bg-[#DCE9F8] px-2.5 py-1 rounded-lg border border-[#D1DFF0] leading-snug break-words thai-wrap transition-colors shadow-2xs ${
                    isHorizontalMode ? "text-left sm:text-center" : "text-center"
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: กลุ่มสาระ / ฝ่ายงาน */}
        {displayGroup && (
          <div className={`mt-2.5 pt-1.5 border-t border-slate-100 text-[10.5px] sm:text-[11px] text-slate-400 font-medium thai-wrap ${
            isHorizontalMode ? "text-left sm:text-center" : "text-center"
          }`}>
            <span>{displayGroup}</span>
          </div>
        )}
      </div>
    </div>
  );
}
