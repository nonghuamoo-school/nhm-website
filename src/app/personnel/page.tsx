"use client";

import React, { useState } from "react";
import { Filter, Users, ChevronDown, Check, Sparkles } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import PersonnelCard from "@/components/home/PersonnelCard";
import { usePersonnel } from "@/hooks/usePersonnel";

const DEPARTMENTS = [
  "ทั้งหมด",
  "ฝ่ายบริหารสถานศึกษา",
  "ฝ่ายบริหารวิชาการ",
  "ฝ่ายบริหารงานบุคคล",
  "ฝ่ายบริหารทั่วไป",
  "ฝ่ายบริหารงบประมาณ",
  "กลุ่มสาระการเรียนรู้ภาษาไทย",
  "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
  "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
  "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ",
  "กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม",
  "กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา",
  "กลุ่มสาระการเรียนรู้ศิลปะ",
  "กลุ่มสาระการเรียนรู้การงานอาชีพ",
  "ระดับการศึกษาปฐมวัย"
];

export default function PersonnelPage() {
  const { personnelList } = usePersonnel();
  const [selectedDept, setSelectedDept] = useState<string>("ทั้งหมด");

  const filtered = (
    selectedDept === "ทั้งหมด"
      ? personnelList
      : personnelList.filter(
          (p) =>
            p.department === selectedDept ||
            p.subjectGroup?.includes(selectedDept) ||
            p.roles?.some((r) => r.includes(selectedDept))
        )
  ).sort((a, b) => (a.order || 0) - (b.order || 0));

  const toolbar = (
    <div className="space-y-3">
      {/* Mobile View: Clean Dropdown & Single-Line Horizontal Swipeable Pills */}
      <div className="sm:hidden space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-[#0F2942]">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>เลือกฝ่ายงาน / กลุ่มสาระ:</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {filtered.length} ท่าน
          </span>
        </div>

        {/* Mobile Dropdown */}
        <div className="relative">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F2942] font-bold text-xs py-2.5 pl-3.5 pr-10 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs appearance-none transition-colors"
          >
            {DEPARTMENTS.map((dept) => {
              const count =
                dept === "ทั้งหมด"
                  ? personnelList.length
                  : personnelList.filter(
                      (p) =>
                        p.department === dept ||
                        p.subjectGroup?.includes(dept) ||
                        p.roles?.some((r) => r.includes(dept))
                    ).length;
              return (
                <option key={dept} value={dept}>
                  {dept} ({count} ท่าน)
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Mobile Horizontal Quick-Switch Chips (Single Line Scrolling - NO vertical wrapping) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs -mx-1 px-1 select-none">
          {["ทั้งหมด", "ฝ่ายบริหารสถานศึกษา", "ฝ่ายบริหารวิชาการ", "กลุ่มสาระการเรียนรู้ภาษาไทย", "กลุ่มสาระการเรียนรู้คณิตศาสตร์"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all min-h-[32px] ${
                selectedDept === dept
                  ? "bg-[#0F2942] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/80"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View: Multi-Category Filter Chips */}
      <div className="hidden sm:block space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-[#0F2942]">เลือกกลุ่มสาระ / ฝ่ายงาน:</span>
          </div>
          <span className="font-semibold text-slate-500">
            แสดง {filtered.length} จากทั้งหมด {personnelList.length} ท่าน
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {DEPARTMENTS.map((dept) => {
            const count =
              dept === "ทั้งหมด"
                ? personnelList.length
                : personnelList.filter(
                    (p) =>
                      p.department === dept ||
                      p.subjectGroup?.includes(dept) ||
                      p.roles?.some((r) => r.includes(dept))
                  ).length;
            if (count === 0 && dept !== "ทั้งหมด") return null;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[34px] ${
                  selectedDept === dept
                    ? "bg-[#0F2942] text-white shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedDept === dept
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "บุคลากร" }]}
      title="ทำเนียบครูและบุคลากรทางการศึกษา"
      description={`คณะผู้บริหาร ครูผู้สอน และบุคลากรทางการศึกษา โรงเรียนบ้านหนองหัวหมู (รวม ${personnelList.length} ท่าน)`}
      toolbar={toolbar}
    >
      <div className="space-y-6">
        {/* Personnel Grid: 2 cols on mobile, 3-4 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((person) => (
            <PersonnelCard key={person.id} person={person} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] p-8 text-slate-500 text-sm space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">ไม่พบบุคลากรในกลุ่มสาระ / ฝ่ายงานที่เลือก</p>
            <button
              onClick={() => setSelectedDept("ทั้งหมด")}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              กลับไปดูบุคลากรทั้งหมด
            </button>
          </div>
        )}
      </div>
    </InnerPageLayout>
  );
}
