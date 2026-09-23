"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Filter } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { schoolCalendarEvents } from "@/data/calendar";

export default function CalendarPage() {
  const [selectedCat, setSelectedCat] = useState<string>("ทั้งหมด");

  const categories = ["ทั้งหมด", "กิจกรรมโรงเรียน", "สอบ/วิชาการ", "วันหยุดราชการ", "ประชุม/อบรม"];

  const filtered =
    selectedCat === "ทั้งหมด"
      ? schoolCalendarEvents
      : schoolCalendarEvents.filter((ev) => ev.category === selectedCat);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
        <Filter className="w-3.5 h-3.5" />
        <span>หมวดหมู่กิจกรรม:</span>
      </div>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCat(cat)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
            selectedCat === cat
              ? "bg-[#0F2942] text-white shadow-2xs"
              : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ปฏิทินกิจกรรม" }]}
      title="ปฏิทินกิจกรรมและการศึกษา"
      description="กำหนดการกิจกรรม วันสอบ วันหยุดราชการ และการประชุม ประจำปีการศึกษา โรงเรียนบ้านหนองหัวหมู"
      toolbar={toolbar}
    >
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs divide-y divide-slate-100">
        {filtered.map((event) => (
          <div
            key={event.id}
            className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Date Box */}
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-[#0F2942] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                <CalendarIcon className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[10px] font-bold text-slate-200 uppercase text-center px-1 leading-tight">
                  {event.date.split(" ")[1] || "กำหนด"}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F2942]/10 text-[#0F2942]">
                    {event.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#0F2942]">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#0F2942]" />
                    {event.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {event.time}
                  </span>
                  {event.location !== "-" && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center">
              <span className="text-xs font-semibold text-[#0F2942] bg-[#0F2942]/5 px-3 py-1.5 rounded-xl border border-[#0F2942]/10">
                ปีการศึกษา 2569
              </span>
            </div>
          </div>
        ))}
      </div>
    </InnerPageLayout>
  );
}
