"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { schoolInfo } from "@/data/schoolInfo";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formattedAddress = [
    schoolInfo.villageNo !== "[รอข้อมูลจริง]" ? schoolInfo.villageNo : null,
    schoolInfo.subDistrict !== "[รอข้อมูลจริง]" ? `ต.${schoolInfo.subDistrict}` : null,
    schoolInfo.district !== "[รอข้อมูลจริง]" ? `อ.${schoolInfo.district}` : null,
    `จ.${schoolInfo.province}`,
    schoolInfo.postalCode !== "[รอข้อมูลจริง]" ? schoolInfo.postalCode : null,
  ]
    .filter(Boolean)
    .join(" ") || `จังหวัด${schoolInfo.province} [รอข้อมูลจริง]`;

  return (
    <section>
      <SectionTitle
        title="ติดต่อและที่ตั้งโรงเรียน"
        subtitle="ช่องทางการติดต่อ แผนที่การเดินทาง และแบบฟอร์มส่งข้อความถึงโรงเรียน"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Contact details & Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {schoolInfo.name}
            </h3>
            <p className="text-xs text-blue-700 font-medium mb-3">
              {schoolInfo.subAffiliation}
            </p>

            {/* Quick contact rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mb-5">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">ที่อยู่</span>
                  <span>{formattedAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">เบอร์โทรศัพท์</span>
                  <span>{schoolInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">อีเมลติดต่อ</span>
                  <span>{schoolInfo.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">เวลาทำการ</span>
                  <span>จันทร์ - ศุกร์ 08.00 - 16.30 น.</span>
                </div>
              </div>
            </div>

            {/* Map Preview Embed with Buriram Location */}
            <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
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
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-xs">
                แผนที่พื้นที่จังหวัดบุรีรัมย์ [รอตำแหน่งพิกัด GPS จริงของสถานศึกษา]
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiries Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              แบบฟอร์มติดต่อ / สอบถาม
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ส่งข้อความสอบถามข้อมูลการศึกษา หรือติดต่อประสานงานกับเจ้าหน้าที่
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center my-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">ส่งข้อความสำเร็จ</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  เจ้าหน้าที่ได้รับข้อมูลแล้ว และจะติดต่อกลับโดยเร็วที่สุด
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อ - นามสกุล ผู้ติดต่อ
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น นายสมชาย ใจดี"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08X-XXX-XXXX"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      หัวข้อเรื่อง
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="เช่น สอบถามการรับสมัคร"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ข้อความ / รายละเอียด
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="ระบุข้อความที่ต้องการสอบถาม..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งข้อความติดต่อ</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
