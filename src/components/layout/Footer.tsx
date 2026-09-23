import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";

export default function Footer() {
  return (
    <footer className="bg-[#0F2942] text-slate-300 border-t border-slate-800 mt-auto">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo size={44} />
              <div>
                <h3 className="font-bold text-base text-white">{schoolInfo.name}</h3>
                <p className="text-xs text-slate-400">{schoolInfo.nameEn}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {schoolInfo.affiliation}
              <br />
              {schoolInfo.subAffiliation}
            </p>
            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs text-amber-400 font-medium">คำขวัญประจำโรงเรียน:</p>
              <p className="text-xs text-slate-300 italic mt-0.5">&ldquo;{schoolInfo.motto}&rdquo;</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              เมนูหลัก
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  ข้อมูลโรงเรียน
                </Link>
              </li>
              <li>
                <Link href="/personnel" className="hover:text-amber-400 transition-colors">
                  บุคลากร
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-400 transition-colors">
                  ข่าวประชาสัมพันธ์
                </Link>
              </li>
              <li>
                <Link href="/academic" className="hover:text-amber-400 transition-colors">
                  ผลการทดสอบระดับชาติ
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-amber-400 transition-colors">
                  ดาวน์โหลดเอกสาร
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-amber-400 transition-colors">
                  ปฏิทินกิจกรรม
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Institutional Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              ลิงก์หน่วยงาน
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.brm3.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  สพป. บุรีรัมย์ เขต 3
                </a>
              </li>
              <li>
                <a
                  href="https://www.obec.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  สพฐ. (OBEC)
                </a>
              </li>
              <li>
                <a
                  href="https://www.moe.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  กระทรวงศึกษาธิการ (MOE)
                </a>
              </li>
              <li>
                <a
                  href="https://portal.bopp-obec.info/dmc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  ระบบจัดเก็บข้อมูลนักเรียน (DMC)
                </a>
              </li>
              <li>
                <a
                  href="https://sgs.bopp-obec.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  ระบบวัดและประเมินผล (SGS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.dltv.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-300"
                >
                  มูลนิธิการศึกษาทางไกล (DLTV)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">
              ติดต่อโรงเรียน
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  144 หมู่ 7 ต.ทุ่งกระเต็น อ.หนองกี่ จ.บุรีรัมย์ 31210
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>โทรศัพท์: {schoolInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>อีเมล: {schoolInfo.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-blue-400 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <a
                  href="https://www.facebook.com/profile.php?id=100071517975903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors underline-offset-2 hover:underline truncate"
                >
                  Facebook: โรงเรียนบ้านหนองหัวหมู
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>สังกัด: {schoolInfo.subAffiliation.replace("เขต 3", "เขต\u00A03")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution (Clean mobile responsive wrapping) */}
      <div className="bg-[#091A2B] py-4 px-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-300">
              &copy; {new Date().getFullYear()} {schoolInfo.name}
            </span>{" "}
            <span className="hidden md:inline text-slate-400">({schoolInfo.nameEn}).</span>{" "}
            <span className="whitespace-nowrap font-normal text-slate-400">สงวนลิขสิทธิ์ทุกประการ</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right leading-relaxed whitespace-nowrap">
            <span>{schoolInfo.subAffiliation.replace("เขต 3", "เขต\u00A03")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
