import React from "react";
import Link from "next/link";
import { ExternalLink, Globe, Laptop, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { externalUsefulLinks } from "@/data/quickLinks";
import { schoolServices } from "@/data/services";
import { schoolInfo } from "@/data/schoolInfo";

export default function UsefulLinks() {
  return (
    <section>
      <SectionTitle
        title="บริการและลิงก์เชื่อมโยงที่เป็นประโยชน์"
        subtitle="ระบบบริการการศึกษาและเว็บไซต์หน่วยงานต้นสังกัดที่เกี่ยวข้อง"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Educational Area Office banner (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F2942] via-[#163C61] to-[#0A1D30] text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-blue-900/50">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-300/30">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-semibold text-amber-300">หน่วยงานต้นสังกัด</span>
                <h3 className="text-lg font-bold text-white">สพป. บุรีรัมย์ เขต 3</h3>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3 หน่วยงานต้นสังกัดผู้กำกับดูแลและส่งเสริมการจัดการศึกษาขั้นพื้นฐานของโรงเรียนบ้านหนองหัวหมู
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                <span className="font-medium text-slate-100">ระบบสารสนเทศเพื่อการบริหารการศึกษา (DMC / EMIS)</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 rounded">
                  ออนไลน์
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                <span className="font-medium text-slate-100">ประกาศจัดซื้อจัดจ้างและรับสมัครงาน สพป.</span>
                <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-700/60 px-2 py-0.5 rounded">
                  อัปเดตล่าสุด
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs">
                <span className="font-medium text-slate-100">หนังสือราชการและระเบียบปฏิบัติ สพป. บุรีรัมย์ เขต 3</span>
                <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded">
                  เป็นทางการ
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/15">
            <a
              href="https://www.brm3.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <span>เข้าสู่เว็บไซต์ สพป. บุรีรัมย์ เขต 3 (www.brm3.go.th)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Institutional Links Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Globe className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-sm text-slate-900">
                ลิงก์หน่วยงานทางการศึกษาและระบบสารสนเทศ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {externalUsefulLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 transition-all group"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      {link.category}
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>เชื่อมโยงระบบการศึกษาของกระทรวงศึกษาธิการ</span>
            <span className="text-blue-700 font-medium">{schoolInfo.subAffiliation}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
