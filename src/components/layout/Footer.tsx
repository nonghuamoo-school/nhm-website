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
                <span>
                  จังหวัด{schoolInfo.province} [รอข้อมูลที่อยู่จริง]
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
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>สังกัด: {schoolInfo.subAffiliation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution (NO visitor count here) */}
      <div className="bg-[#091A2B] py-4 px-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            &copy; {new Date().getFullYear()} {schoolInfo.name} ({schoolInfo.nameEn}). สงวนลิขสิทธิ์ทุกประการ
          </p>
          <p className="text-slate-400 text-center sm:text-right">
            {schoolInfo.subAffiliation.replace("เขต 3", "เขต\u00A03")}
          </p>
        </div>
      </div>
    </footer>
  );
}
