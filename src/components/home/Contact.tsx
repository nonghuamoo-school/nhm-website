import React from "react";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { schoolInfo } from "@/data/schoolInfo";

export default function Contact() {
  const formattedAddress = [
    schoolInfo.villageNo !== "[รอข้อมูลจริง]" ? schoolInfo.villageNo : null,
    schoolInfo.subDistrict !== "[รอข้อมูลจริง]" ? `ต.${schoolInfo.subDistrict}` : null,
    schoolInfo.district !== "[รอข้อมูลจริง]" ? `อ.${schoolInfo.district}` : null,
    `จ.${schoolInfo.province}`,
    schoolInfo.postalCode !== "[รอข้อมูลจริง]" ? schoolInfo.postalCode : null,
  ]
    .filter(Boolean)
    .join(" ") || `จังหวัด${schoolInfo.province} [รอข้อมูลที่อยู่จริง]`;

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
          ติดต่อและที่ตั้งโรงเรียน
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {schoolInfo.name} {schoolInfo.subAffiliation}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Contact Information (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F2942]">
                ข้อมูลการติดต่อสถานศึกษา
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เวลาทำการ: วันจันทร์ - วันศุกร์ เวลา 08:00 - 16:30 น.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Address */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <MapPin className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">ที่ตั้งสถานศึกษา</span>
                  <span className="text-slate-600">{formattedAddress}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">เบอร์โทรศัพท์</span>
                  <span className="text-slate-600">{schoolInfo.phone}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">อีเมล</span>
                  <span className="text-slate-600">{schoolInfo.email}</span>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <svg
                  className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-0.5">เฟซบุ๊กแฟนเพจ</span>
                  <span className="text-slate-600">{schoolInfo.facebook}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] text-[11px] text-slate-400">
            ติดต่อสอบถามข้อมูลการศึกษา หรือติดต่อประสานงานในวันและเวลาราชการ
          </div>
        </div>

        {/* Right Column: Embedded Map with Google Maps Navigation Button (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#0F2942]">
                แผนที่แสดงที่ตั้งสถานศึกษา
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                จังหวัดบุรีรัมย์
              </span>
            </div>

            <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-[#E5E7EB] relative bg-slate-100">
              <iframe
                title="แผนที่โรงเรียนบ้านหนองหัวหมู จังหวัดบุรีรัมย์"
                src="https://maps.google.com/maps?q=Buriram%20Thailand&t=&z=10&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 bg-[#091A2B]/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-xs">
                แผนที่พื้นที่จังหวัดบุรีรัมย์ [รอตำแหน่งพิกัด GPS จริงของสถานศึกษา]
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-slate-500">
              สังกัด {schoolInfo.subAffiliation}
            </span>

            <a
              href="https://maps.google.com/?q=Buriram+Thailand"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white font-bold text-xs transition-colors shadow-xs min-h-[44px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>นำทางด้วย Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
