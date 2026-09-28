import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, ShieldCheck } from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-slate-300 border-t-4 border-[#D96B34] mt-auto">
      {/* Main Footer Container (Expanded max-width so content shifts cleanly left on PC) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10">
          
          {/* Col 1: School Identity (5 cols on PC for vast horizontal breathing room) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo size={48} />
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white whitespace-nowrap">{schoolInfo.name}</h3>
                <p className="text-xs text-slate-300 font-medium whitespace-nowrap">{schoolInfo.nameEn}</p>
              </div>
            </div>
            
            {/* Affiliations: สพป. บุรีรัมย์ เขต 3 ไว้บน, สพฐ. ไว้ล่าง */}
            <div className="text-xs leading-relaxed space-y-1.5 pt-1">
              <div className="font-semibold text-white flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] shrink-0 mt-1.5" />
                <p className="leading-relaxed">
                  <span>สำนักงานเขตพื้นที่การศึกษาประถมศึกษา</span>
                  <span>&nbsp;</span>
                  <span className="inline-block whitespace-nowrap">บุรีรัมย์&nbsp;เขต&nbsp;3</span>
                </p>
              </div>
              <div className="text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400/80 shrink-0 mt-1.5" />
                <p className="leading-relaxed whitespace-normal sm:whitespace-nowrap">
                  สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-[#D96B34] font-medium">คำขวัญประจำโรงเรียน:</p>
              <p className="text-xs text-slate-200 italic mt-0.5 whitespace-normal xl:whitespace-nowrap">&ldquo;{schoolInfo.motto}&rdquo;</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 xl:col-span-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#D96B34] rounded-xs" />
              <span className="whitespace-nowrap">เมนูหลัก</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors text-slate-200">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition-colors text-slate-200">
                  ข้อมูลโรงเรียน
                </Link>
              </li>
              <li>
                <Link href="/personnel" className="hover:text-white hover:underline transition-colors text-slate-200">
                  บุคลากร
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white hover:underline transition-colors text-slate-200">
                  ข่าวประชาสัมพันธ์
                </Link>
              </li>
              <li>
                <Link href="/academic" className="hover:text-white hover:underline transition-colors text-slate-200">
                  ผลการทดสอบระดับชาติ
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white hover:underline transition-colors text-slate-200">
                  ดาวน์โหลดเอกสาร
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-white hover:underline transition-colors text-slate-200">
                  ปฏิทินกิจกรรม
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10 mt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[#7EB8E0] hover:text-white hover:underline transition-colors font-semibold"
                  title="เข้าสู่ระบบ Admin สำหรับครูและบุคลากร"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D96B34]" />
                  <span>เข้าสู่ระบบ Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Institutional Links */}
          <div className="lg:col-span-2 xl:col-span-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#D96B34] rounded-xs" />
              <span className="whitespace-nowrap">ลิงก์หน่วยงาน</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.brm3.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  สพป. บุรีรัมย์ เขต&nbsp;3
                </a>
              </li>
              <li>
                <a
                  href="https://www.obec.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  สพฐ. (OBEC)
                </a>
              </li>
              <li>
                <a
                  href="https://www.moe.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  กระทรวงศึกษาธิการ (MOE)
                </a>
              </li>
              <li>
                <a
                  href="https://portal.bopp-obec.info/dmc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  ระบบสารสนเทศ (DMC)
                </a>
              </li>
              <li>
                <a
                  href="https://sgs.bopp-obec.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  วัดผลประเมินผล (SGS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.dltv.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors text-slate-200 whitespace-nowrap"
                >
                  การศึกษาทางไกล (DLTV)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information (No dropped postal codes or affiliations) */}
          <div className="lg:col-span-3 xl:col-span-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#D96B34] rounded-xs" />
              <span className="whitespace-nowrap">ติดต่อโรงเรียน</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D96B34] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="whitespace-nowrap">144 หมู่ 7 ต.ทุ่งกระเต็น</p>
                  <p className="whitespace-nowrap">อ.หนองกี่ จ.บุรีรัมย์&nbsp;31210</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D96B34] shrink-0" />
                <span className="whitespace-nowrap">โทรศัพท์: {schoolInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D96B34] shrink-0" />
                <span className="whitespace-nowrap">อีเมล: {schoolInfo.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#7EB8E0] shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <a
                  href="https://www.facebook.com/profile.php?id=100071517975903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline-offset-2 hover:underline truncate text-slate-200"
                >
                  Facebook: โรงเรียนบ้านหนองหัวหมู
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#D96B34] shrink-0 mt-0.5" />
                <div className="leading-relaxed text-xs text-slate-200">
                  <p className="font-semibold text-white whitespace-nowrap">
                    สพป. บุรีรัมย์ เขต&nbsp;3
                  </p>
                  <p className="text-slate-300 text-[11px] whitespace-nowrap">
                    สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="bg-[#0F2540] py-4 px-4 border-t border-white/10 text-xs text-slate-300">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left px-0 xl:px-2">
          <div className="leading-relaxed">
            <div>
              <span className="font-semibold text-white">
                &copy; {new Date().getFullYear()} {schoolInfo.name}
              </span>{" "}
              <span className="hidden md:inline text-slate-300">({schoolInfo.nameEn}).</span>{" "}
              <span className="whitespace-nowrap font-normal text-slate-300">สงวนลิขสิทธิ์ทุกประการ</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 flex flex-wrap items-center gap-2">
              <span>พัฒนาระบบโดย &quot;นายธนาธิป คุณวงศ์&quot; คุณครูโรงเรียนบ้านหนองหัวหมู</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <Link
                href="/admin"
                className="text-slate-400 hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                เข้าสู่ระบบ Admin
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 pr-12 sm:pr-0">
            <span className="text-center sm:text-right leading-relaxed whitespace-nowrap text-slate-300">
              {schoolInfo.subAffiliation}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
