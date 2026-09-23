import React from "react";
import { PersonnelMember } from "@/types";

interface PersonnelCardProps {
  person: PersonnelMember;
}

export default function PersonnelCard({ person }: PersonnelCardProps) {
  const displayGroup = person.subjectGroup || person.department;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between text-center group">
      <div>
        {/* Profile Image */}
        <div className="relative mb-3.5 flex justify-center">
          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-amber-500 transition-colors shadow-xs bg-slate-100">
            <img
              src={person.imageUrl}
              alt={person.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-sm sm:text-base text-[#0F2942] group-hover:text-amber-600 transition-colors">
          {person.name}
        </h3>

        {/* Roles Badges (แสดงบทบาท/หน้าที่รับผิดชอบทั้งหมด) */}
        {person.roles && person.roles.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
            {person.roles.map((role, idx) => (
              <span
                key={idx}
                className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold leading-relaxed ${
                  idx === 0
                    ? "bg-amber-50 text-amber-900 border border-amber-200/80"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-semibold text-slate-700 mt-1.5">
            {person.position}
          </p>
        )}
      </div>

      {/* Footer: กลุ่มสาระ / ฝ่ายงาน (ไม่มีเบอร์โทรส่วนตัวและไม่มีคณะ) */}
      {displayGroup && (
        <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-center">
          <span className="truncate font-medium text-slate-600">{displayGroup}</span>
        </div>
      )}
    </div>
  );
}
