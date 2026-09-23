"use client";

import React, { useState } from "react";
import { Filter, Users } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span>เลือกกลุ่มสาระ / ฝ่ายงาน:</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-1">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[34px] ${
              selectedDept === dept
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "บุคลากร" }]}
      title="ทำเนียบครูและบุคลากรทางการศึกษา"
      description="คณะผู้บริหาร ครูผู้สอน และบุคลากรทางการศึกษา โรงเรียนบ้านหนองหัวหมู"
      toolbar={toolbar}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((person) => (
            <PersonnelCard key={person.id} person={person} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-8 text-slate-500 text-sm">
            ไม่พบบุคลากรในกลุ่มสาระ / ฝ่ายงานที่เลือก
          </div>
        )}
      </div>
    </InnerPageLayout>
  );
}
