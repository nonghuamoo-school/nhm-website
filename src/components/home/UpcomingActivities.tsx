import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

export default function UpcomingActivities() {
  const activities = [
    {
      id: "act-1",
      day: "22",
      month: "ก.ย.",
      title: "การประชุมผู้ปกครองนักเรียน ภาคเรียนที่ 1",
      category: "กิจกรรมโรงเรียน",
      time: "09:00 - 12:00 น.",
      location: "อาคารอเนกประสงค์",
    },
    {
      id: "act-2",
      day: "27",
      month: "ก.ย.",
      title: "กิจกรรมวันวิทยาศาสตร์และสัปดาห์ส่งเสริมการเรียนรู้",
      category: "วิชาการ",
      time: "08:30 - 15:30 น.",
      location: "ลานกิจกรรมโรงเรียน",
    },
    {
      id: "act-3",
      day: "05",
      month: "ต.ค.",
      title: "การสอบวัดผลปลายภาคเรียนที่ 1 ประจำปีการศึกษา 2568",
      category: "สอบ/วิชาการ",
      time: "08:30 - 15:00 น.",
      location: "ห้องเรียนทุกระดับชั้น",
    },
    {
      id: "act-4",
      day: "15",
      month: "ต.ค.",
      title: "ประกาศผลการเรียนและปิดภาคเรียนที่ 1",
      category: "วิชาการ",
      time: "09:00 น. เป็นต้นไป",
      location: "ห้องธุรการ",
    },
  ];

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight">
            กิจกรรมและกำหนดการสำคัญ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            กำหนดการกิจกรรม การประเมินผล และวันสำคัญของสถานศึกษา
          </p>
        </div>

        <Link
          href="/calendar"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2942] hover:text-blue-900 bg-white px-3.5 py-2 rounded-xl border border-[#E5E7EB] shadow-2xs transition-colors shrink-0 min-h-[40px]"
        >
          <span>ดูปฏิทินทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean Timeline Layout */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs divide-y divide-slate-100">
        {activities.map((item) => (
          <div
            key={item.id}
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              {/* Date Box */}
              <div className="w-13 h-13 rounded-xl bg-[#0F2942] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                <span className="text-base font-black leading-none">{item.day}</span>
                <span className="text-[10px] font-semibold text-amber-300 mt-0.5 uppercase">
                  {item.month}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0F2942]">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center">
              <Link
                href="/calendar"
                className="text-xs font-semibold text-[#0F2942] hover:text-blue-900 flex items-center gap-1"
              >
                <span>รายละเอียด</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
