import React from "react";
import { PersonnelMember } from "@/types";

interface PersonnelCardProps {
  person: PersonnelMember;
}

export default function PersonnelCard({ person }: PersonnelCardProps) {
  const displayGroup = person.subjectGroup || person.department;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-3 sm:p-5 flex flex-col justify-between text-center group">
      <div>
        {/* Profile Image */}
        <div className="relative mb-2.5 sm:mb-3.5 flex justify-center">
          <div className="w-18 h-22 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-blue-600 transition-colors shadow-xs bg-slate-100 relative">
            {person.imageUrl && !person.imageUrl.includes("school-emblem-doc") ? (
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200/80 flex flex-col items-center justify-center p-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-[9px] font-bold text-slate-400 mt-1">รูปถ่าย</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#0F2942] group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
          {person.name}
        </h3>

        {/* Roles Badges */}
        {person.roles && person.roles.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 truncate max-w-full">
              {person.roles[0]}
            </span>
            {person.roles.length > 1 && (
              <span className="inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                +{person.roles.length - 1}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1.5 truncate">
            {person.position}
          </p>
        )}
      </div>

      {/* Footer: กลุ่มสาระ / ฝ่ายงาน */}
      {displayGroup && (
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] sm:text-[11px] text-slate-500 flex items-center justify-center">
          <span className="truncate font-medium text-slate-600">{displayGroup}</span>
        </div>
      )}
    </div>
  );
}
