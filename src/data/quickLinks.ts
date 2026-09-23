import { QuickLinkItem } from "@/types";

export const quickLinks: QuickLinkItem[] = [
  {
    id: "about",
    title: "ข้อมูลโรงเรียน",
    subtitle: "ประวัติ วิสัยทัศน์ และพันธกิจ",
    href: "/about",
    icon: "Building2",
    badge: "ทั่วไป",
    color: "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
  },
  {
    id: "personnel",
    title: "บุคลากร",
    subtitle: "ทำเนียบผู้บริหารและคณะครู",
    href: "/personnel",
    icon: "UserCheck",
    badge: "คณะทำงาน",
    color: "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
  },
  {
    id: "news",
    title: "ข่าวประชาสัมพันธ์",
    subtitle: "กิจกรรมและประกาศโรงเรียน",
    href: "/news",
    icon: "Megaphone",
    badge: "อัปเดต",
    color: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
  },
  {
    id: "academic",
    title: "ผลการทดสอบระดับชาติ",
    subtitle: "รายงานผลสอบ O-NET, NT, RT",
    href: "/academic",
    icon: "TrendingUp",
    badge: "วิชาการ",
    color: "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
  },
  {
    id: "downloads",
    title: "ดาวน์โหลดเอกสาร",
    subtitle: "แบบฟอร์มคำร้องและระเบียบ",
    href: "/downloads",
    icon: "DownloadCloud",
    badge: "เอกสาร",
    color: "text-teal-700 bg-teal-50 hover:bg-teal-100 border-teal-200"
  },
  {
    id: "area-office",
    title: "สพป. บุรีรัมย์ เขต 3",
    subtitle: "เว็บไซต์สำนักงานเขตพื้นที่การศึกษา",
    href: "https://www.brm3.go.th",
    icon: "Building2",
    badge: "เขตพื้นที่",
    color: "text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200"
  }
];

export const externalUsefulLinks = [
  {
    name: "กระทรวงศึกษาธิการ (MOE)",
    url: "https://www.moe.go.th",
    category: "หน่วยงานหลัก"
  },
  {
    name: "สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)",
    url: "https://www.obec.go.th",
    category: "สังกัดหลัก"
  },
  {
    name: "สพป. บุรีรัมย์ เขต 3",
    url: "https://www.brm3.go.th",
    category: "เขตพื้นที่การศึกษา"
  },
  {
    name: "ระบบจัดเก็บข้อมูลนักเรียนรายบุคคล (DMC)",
    url: "https://portal.bopp-obec.info/dmc",
    category: "ระบบสารสนเทศ"
  },
  {
    name: "สถาบันทดสอบทางการศึกษาแห่งชาติ (สทศ. NIETS)",
    url: "https://www.niets.or.th",
    category: "ระบบทดสอบระดับชาติ"
  },
  {
    name: "มูลนิธิการศึกษาทางไกลผ่านดาวเทียม (DLTV)",
    url: "https://www.dltv.ac.th",
    category: "แหล่งเรียนรู้"
  }
];
