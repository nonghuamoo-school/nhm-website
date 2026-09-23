"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, Search, Edit3, Trash2, Clock, MapPin } from "lucide-react";
import { schoolCalendarEvents } from "@/data/calendar";
import { CalendarEvent } from "@/types";

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(schoolCalendarEvents);
  const [searchWord, setSearchWord] = useState("");

  const filtered = events.filter((ev) =>
    ev.title.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            ปฏิทินและกิจกรรม
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] mt-0.5">
            จัดการปฏิทินกิจกรรมโรงเรียน
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดการกิจกรรม วันสอบ วันหยุดราชการ และการประชุม
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("ระบบเพิ่มกิจกรรมใหม่พร้อมเชื่อมต่อ backend")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>เพิ่มกิจกรรมใหม่</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหากิจกรรม..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors text-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F2942] text-white flex flex-col items-center justify-center shrink-0">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold mt-0.5">
                  {ev.date.split(" ")[1] || "วัน"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F2942]/5 text-[#0F2942] mb-1 inline-block">
                  {ev.category}
                </span>
                <h3 className="font-bold text-sm text-[#0F2942]">{ev.title}</h3>
                <div className="flex items-center gap-3 text-slate-400 mt-1">
                  <span>{ev.date}</span>
                  <span>•</span>
                  <span>{ev.time}</span>
                  {ev.location !== "-" && (
                    <>
                      <span>•</span>
                      <span>{ev.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-center">
              <button
                className="p-2 rounded-lg text-slate-600 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
                title="แก้ไขกิจกรรม"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEvents(events.filter((item) => item.id !== ev.id))}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="ลบกิจกรรม"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
