import { StatItem } from "@/types";

export const schoolStats: StatItem[] = [
  {
    id: "students",
    label: "จำนวนนักเรียนทั้งหมด",
    value: "[รอข้อมูลจริง]",
    unit: "คน",
    change: "[รอข้อมูลจริง]",
    description: "ระดับชั้นอนุบาล ถึง ประถมศึกษา",
    icon: "Users",
    colorClass: "from-blue-600 to-indigo-600 text-blue-600 bg-blue-50 border-blue-100"
  },
  {
    id: "personnel",
    label: "ครูและบุคลากร",
    value: "[รอข้อมูลจริง]",
    unit: "คน",
    change: "[รอข้อมูลจริง]",
    description: "ข้าราชการครูและบุคลากรทางการศึกษา",
    icon: "GraduationCap",
    colorClass: "from-sky-600 to-cyan-600 text-sky-600 bg-sky-50 border-sky-100"
  },
  {
    id: "classrooms",
    label: "ห้องเรียนทั้งหมด",
    value: "[รอข้อมูลจริง]",
    unit: "ห้อง",
    change: "[รอข้อมูลจริง]",
    description: "ห้องเรียนจัดการเรียนรู้",
    icon: "School",
    colorClass: "from-emerald-600 to-teal-600 text-emerald-600 bg-emerald-50 border-emerald-100"
  },
  {
    id: "achievement",
    label: "ผลสัมฤทธิ์ทางการเรียน",
    value: "[รอข้อมูลจริง]",
    unit: "",
    change: "[รอข้อมูลจริง]",
    description: "ผลการประเมินคุณภาพผู้เรียนระดับชาติ",
    icon: "Award",
    colorClass: "from-amber-600 to-yellow-600 text-amber-600 bg-amber-50 border-amber-100"
  }
];
