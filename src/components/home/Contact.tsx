"use client";

import React from "react";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { useSchoolSettings } from "@/hooks/useSchoolSettings";
import { getGoogleMapsEmbedUrl, getGoogleMapsNavigationUrl } from "@/lib/maps";

export default function Contact() {
  const { settings } = useSchoolSettings();

  const formattedAddress = [
    settings.villageNo ? settings.villageNo : null,
    settings.subDistrict ? `ต.${settings.subDistrict}` : null,
    settings.district ? `อ.${settings.district}` : null,
    `จ.${settings.province}`,
    settings.postalCode ? `\u00A0${settings.postalCode}` : null,
  ]
    .filter(Boolean)
    .join(" ") || `144 หมู่ที่ 7 บ้านโคกสะอาด ต.ทุ่งกระเต็น อ.หนองกี่ จ.บุรีรัมย์\u00A031210`;

  const fallbackQuery = `โรงเรียนบ้านหนองหัวหมู ${formattedAddress}`;
  const embedUrl = getGoogleMapsEmbedUrl(settings.mapsUrl, fallbackQuery);
  const navigationUrl = getGoogleMapsNavigationUrl(settings.mapsUrl, fallbackQuery);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#D96B34] rounded-full inline-block" />
          <span>ติดต่อและที่ตั้งโรงเรียน</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4B6080] mt-1 pl-3.5">
          {settings.name} {settings.subAffiliation}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Contact Information (5 cols): Glassmorphism */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#D1DFF0] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#1E3A5F]">
                ข้อมูลการติดต่อสถานศึกษา
              </h3>
              <p className="text-xs text-[#6B7FA0] mt-0.5">
                เวลาทำการ: วันจันทร์ - วันศุกร์ เวลา 08:00 - 16:30 น.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Address */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#EAF2FB]/50 border border-[#D1DFF0]">
                <MapPin className="w-4 h-4 text-[#1E3A5F] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-[#0F1F30] block mb-0.5">ที่ตั้งสถานศึกษา</span>
                  <span className="text-[#334155]">{formattedAddress}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#EAF2FB]/50 border border-[#D1DFF0]">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-[#0F1F30] block mb-0.5">เบอร์โทรศัพท์</span>
                  <span className="text-[#334155]">{settings.phone || "081-743-2407"}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#EAF2FB]/50 border border-[#D1DFF0]">
                <Mail className="w-4 h-4 text-[#2F6FED] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-[#0F1F30] block mb-0.5">อีเมล</span>
                  <span className="text-[#334155]">{settings.email || "31030078@brm3.go.th"}</span>
                </div>
              </div>

              {/* Facebook */}
              {settings.facebook && (
                <a
                  href={
                    settings.facebook.startsWith("http")
                      ? settings.facebook
                      : "https://www.facebook.com/profile.php?id=100071517975903"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#EAF2FB]/50 hover:bg-[#EBF2FF] border border-[#D1DFF0] hover:border-[#2F6FED]/40 transition-all group cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-[#2F6FED] shrink-0 mt-0.5 fill-current group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <div className="text-xs leading-relaxed min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0F1F30] group-hover:text-[#2F6FED] transition-colors">
                        Facebook
                      </span>
                      <ExternalLink className="w-3 h-3 text-[#6B7FA0] group-hover:text-[#2F6FED]" />
                    </div>
                    <span className="text-[#334155] group-hover:text-[#1E3A5F] font-medium block truncate">
                      โรงเรียนบ้านหนองหัวหมู
                    </span>
                    <span className="text-[10px] text-[#2F6FED] font-semibold block mt-0.5 group-hover:underline">
                      คลิกเพื่อเปิดหน้าเพจ Facebook
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#D1DFF0] text-[11px] text-[#6B7FA0]">
            ติดต่อสอบถามข้อมูลการศึกษา หรือติดต่อประสานงานในวันและเวลาราชการ
          </div>
        </div>

        {/* Right Column: Embedded Map with Google Maps Navigation Button (7 cols): Glassmorphism */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#D1DFF0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1E3A5F]">
                แผนที่แสดงที่ตั้งสถานศึกษา
              </span>
              <span className="text-[10px] text-[#1E3A5F] bg-[#EBF2FF] border border-[#2F6FED]/30 px-2 py-0.5 rounded font-medium">
                ต.{settings.subDistrict || "ทุ่งกระเต็น"} อ.{settings.district || "หนองกี่"}
              </span>
            </div>

            <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-[#D1DFF0] relative bg-slate-100">
              <iframe
                title="แผนที่โรงเรียนบ้านหนองหัวหมู จังหวัดบุรีรัมย์"
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 bg-[#0F2540]/90 text-white text-[10px] px-2.5 py-1 rounded backdrop-blur-xs font-medium shadow-xs border border-white/10">
                📍 {settings.name} (ต.{settings.subDistrict || "ทุ่งกระเต็น"} อ.{settings.district || "หนองกี่"})
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#D1DFF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#4B6080] leading-relaxed">
              <span>สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษา</span>
              <span>&nbsp;</span>
              <span className="inline-block whitespace-nowrap font-medium text-[#1E3A5F]">บุรีรัมย์&nbsp;เขต&nbsp;3</span>
            </span>

            <a
              href={navigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#1f5bcc] text-white font-bold text-xs transition-colors shadow-xs min-h-[44px]"
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
