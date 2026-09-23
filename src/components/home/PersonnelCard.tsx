import React from "react";
import { PersonnelMember } from "@/types";

interface PersonnelCardProps {
  person: PersonnelMember;
}

export default function PersonnelCard({ person }: PersonnelCardProps) {
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all p-3 sm:p-4 flex flex-col justify-between text-center group h-full">
      <div>
        {/* Profile Image */}
        <div className="relative mb-2.5 sm:mb-3 flex justify-center">
          <div
            className={`w-20 h-24 sm:w-26 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all shadow-xs bg-slate-100 relative ${
              isExecutive
                ? "border-amber-400 ring-2 ring-amber-100"
                : "border-slate-200 group-hover:border-blue-500"
            }`}
          >
            {person.imageUrl && !person.imageUrl.includes("school-emblem-doc") ? (
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
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

        {/* Name: Dark navy, always consistent, no accidental amber hover on tap */}
        <h3 className="font-bold text-xs sm:text-sm text-[#0F2942] leading-snug break-words">
          {person.name}
        </h3>

        {/* 1. ตำแหน่งหลัก (เด่น ชัดเจน เป็นทางการ) */}
        <div className="mt-2 mb-1">
          <span
            className={`inline-block w-full px-2 py-1 rounded-lg text-[10.5px] sm:text-xs font-bold leading-snug break-words text-center shadow-2xs ${
              isExecutive
                ? "bg-[#0F2942] text-amber-300 border border-amber-400/40"
                : "bg-[#0F2942] text-white"
            }`}
          >
            {primaryRole}
          </span>
        </div>

        {/* 2. ตำแหน่งเพิ่มเติม (แสดงครบทุกตำแหน่ง ไม่ต้องเด่น ไม่ซ่อน +1 +2) */}
        {additionalRoles.length > 0 && (
          <div className="flex flex-col items-center gap-1 mt-1.5 w-full">
            {additionalRoles.map((role, idx) => (
              <span
                key={idx}
                className="w-full text-[9.5px] sm:text-[10.5px] text-slate-600 font-medium bg-slate-50 hover:bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/80 text-center leading-tight break-words"
              >
                {role}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: กลุ่มสาระ / ฝ่ายงาน */}
      {displayGroup && (
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] sm:text-[10.5px] flex items-center justify-center">
          <span className="font-medium text-slate-400 break-words text-center leading-tight">
            {displayGroup}
          </span>
        </div>
      )}
    </div>
  );
}
