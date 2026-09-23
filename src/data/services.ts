import { EServiceItem } from "@/types";

export const schoolServices: EServiceItem[] = [
  {
    id: "srv-01",
    name: "ระบบตรวจสอบผลสอบระดับชาติ (สทศ. O-NET)",
    category: "งานวัดและประเมินผล",
    description: "บริการตรวจสอบผลคะแนนการทดสอบทางการศึกษาระดับชาติ O-NET และผลประเมินระดับชาติ",
    icon: "GraduationCap",
    status: "พร้อมใช้งาน",
    targetAudience: "นักเรียน",
    href: "https://www.niets.or.th"
  },
  {
    id: "srv-02",
    name: "ระบบยื่นคำร้องขอเอกสารทางการศึกษา",
    category: "งานทะเบียน",
    description: "ยื่นคำร้องขอหนังสือรับรองความเป็นนักเรียน และหนังสือรับรองความประพฤติ",
    icon: "FileText",
    status: "พร้อมใช้งาน",
    targetAudience: "ผู้ปกครอง",
    href: "#request-docs"
  },
  {
    id: "srv-03",
    name: "ระบบรับสมัครนักเรียนใหม่ออนไลน์",
    category: "งานรับนักเรียน",
    description: "กรอกข้อมูลและอัปโหลดเอกสารเพื่อสมัครเข้าเรียนชั้นอนุบาล 2 และประถมศึกษาปีที่ 1 ประจำปีการศึกษาใหม่",
    icon: "UserPlus",
    status: "พร้อมใช้งาน",
    targetAudience: "ผู้ปกครอง",
    href: "#enrollment"
  },
  {
    id: "srv-04",
    name: "ระบบจองห้องประชุมและอุปกรณ์เทคโนโลยี",
    category: "งานบริหารทั่วไป",
    description: "ระบบจองห้องประชุม ห้องคอมพิวเตอร์ และอุปกรณ์โสตทัศนูปกรณ์สำหรับคณะครูและบุคลากร",
    icon: "CalendarCheck",
    status: "พร้อมใช้งาน",
    targetAudience: "ครูและบุคลากร",
    href: "#facility-booking"
  },
  {
    id: "srv-05",
    name: "ระบบส่งข้อเสนอแนะและติดต่อสอบถาม",
    category: "งานสัมพันธ์ชุมชน",
    description: "ช่องทางรับฟังความคิดเห็น คำติชม หรือข้อเสนอแนะจากผู้ปกครองและชุมชนเพื่อพัฒนาโรงเรียน",
    icon: "MessageSquare",
    status: "พร้อมใช้งาน",
    targetAudience: "ประชาชนทั่วไป",
    href: "/contact"
  },
  {
    id: "srv-06",
    name: "ระบบคลังสื่อการเรียนการสอนดิจิทัล",
    category: "งานวิชาการ",
    description: "แหล่งรวบรวมแผนการสอน สื่อมัลติมีเดีย ใบงาน และคลิปการสอนเพื่อสนับสนุนการจัดการเรียนรู้",
    icon: "FolderGit2",
    status: "เร็วๆ นี้",
    targetAudience: "ครูและบุคลากร",
    href: "#digital-media"
  }
];
