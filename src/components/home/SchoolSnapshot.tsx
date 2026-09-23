import React from "react";
import { Users, GraduationCap, School, CalendarDays } from "lucide-react";

export default function SchoolSnapshot() {
  const snapshots = [
    {
      id: "students",
      label: "นักเรียน",
      value: "105 คน",
      sublabel: "อนุบาล – ประถมศึกษา",
      icon: Users,
    },
    {
      id: "personnel",
      label: "บุคลากร",
      value: "12 ท่าน",
      sublabel: "ผู้บริหาร ครู และเจ้าหน้าที่",
      icon: GraduationCap,
    },
    {
      id: "classrooms",
      label: "ห้องเรียน",
      value: "8 ห้อง",
      sublabel: "ห้องเรียนจัดการเรียนรู้",
      icon: School,
    },
    {
      id: "academic-year",
      label: "ปีการศึกษา",
      value: "2569",
      sublabel: "ภาคเรียนปัจจุบัน",
      icon: CalendarDays,
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
          ข้อมูลสถานศึกษาโดยสรุป (School Snapshot)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          สถิติข้อมูลพื้นฐานโรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3
        </p>
      </div>

      {/* Four Horizontal Minimal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {snapshots.map((item) => {
          const Icon = item.icon;
          const isPending = item.value.startsWith("[");

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0F2942]/5 text-[#0F2942] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-500 block">
                  {item.label}
                </span>
                <span
                  className={`block tracking-tight truncate mt-0.5 ${
                    isPending
                      ? "text-sm font-semibold text-slate-400"
                      : "text-xl font-bold text-[#0F2942]"
                  }`}
                >
                  {item.value}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {item.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
