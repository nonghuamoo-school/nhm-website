"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Sparkles
} from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types";
import Swal from "sweetalert2";

const CALENDAR_CATEGORIES: CalendarEvent["category"][] = [
  "กิจกรรมโรงเรียน",
  "สอบ/วิชาการ",
  "ประชุม/อบรม",
  "วันหยุดราชการ"
];

export default function AdminCalendarPage() {
  const { eventList, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [searchWord, setSearchWord] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    time: string;
    category: CalendarEvent["category"];
    location: string;
  }>({
    title: "",
    date: "16 พ.ค. 2569",
    time: "08:30 - 16:30 น.",
    category: "กิจกรรมโรงเรียน",
    location: "โรงเรียนบ้านหนองหัวหมู"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      date: "16 พ.ค. 2569",
      time: "08:30 - 16:30 น.",
      category: "กิจกรรมโรงเรียน",
      location: "โรงเรียนบ้านหนองหัวหมู"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: CalendarEvent) => {
    setEditingId(ev.id);
    setFormData({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      category: ev.category,
      location: ev.location
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุชื่อกิจกรรม",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    if (editingId) {
      updateEvent(editingId, {
        title: formData.title.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        category: formData.category,
        location: formData.location.trim() || "-"
      });
      Swal.fire({
        icon: "success",
        title: "บันทึกการแก้ไขเรียบร้อย",
        text: `กิจกรรม "${formData.title}" อัปเดตขึ้น Cloud แบบ Real-time แล้ว`,
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      addEvent({
        title: formData.title.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        category: formData.category,
        location: formData.location.trim() || "-"
      });
      Swal.fire({
        icon: "success",
        title: "เพิ่มกิจกรรมใหม่สำเร็จ",
        text: `กิจกรรม "${formData.title}" บันทึกขึ้น Cloud แบบ Real-time เรียบร้อยแล้ว`,
        timer: 1800,
        showConfirmButton: false,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    const res = await Swal.fire({
      title: "ยืนยันการลบกิจกรรม?",
      text: `คุณต้องการลบกิจกรรม "${title}" ใช่หรือไม่? เมื่อลบแล้วจะหายไปจากหน้าปฏิทินทันทีแบบ Real-time`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ใช่, ลบกิจกรรมนี้",
      cancelButtonText: "ยกเลิก",
    });

    if (res.isConfirmed) {
      deleteEvent(id);
      Swal.fire({
        icon: "success",
        title: "ลบกิจกรรมเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const filtered = eventList.filter((ev) =>
    ev.title.toLowerCase().includes(searchWord.toLowerCase()) ||
    ev.date.toLowerCase().includes(searchWord.toLowerCase()) ||
    ev.category.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F2942] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-400/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
            ปฏิทินและกำหนดการ
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] mt-1">
            จัดการปฏิทินกิจกรรมโรงเรียน ({eventList.length} รายการ)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดการกิจกรรม วันเปิด-ปิดภาคเรียน วันสอบ วันหยุดราชการ และการประชุม
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0F2942] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all min-h-[44px] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>เพิ่มกิจกรรมใหม่</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อกิจกรรม หรือวันที่..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors text-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F2942] to-blue-800 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold mt-0.5">
                  {ev.date.split(" ")[0] || "วัน"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 mb-1 inline-block">
                  {ev.category}
                </span>
                <h3 className="font-bold text-sm text-[#0F2942]">{ev.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.time}</span>
                  </span>
                  {ev.location && ev.location !== "-" && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.location}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleOpenEdit(ev)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
                title="แก้ไขกิจกรรม"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ev.id, ev.title)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                title="ลบกิจกรรม"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL: เพิ่ม/แก้ไขกิจกรรม ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0F2942]">
                    {editingId ? "แก้ไขข้อมูลกิจกรรม" : "เพิ่มกิจกรรมปฏิทินใหม่"}
                  </h3>
                  <p className="text-xs text-slate-400">กำหนดวัน เวลา และสถานที่</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อกิจกรรม / กำหนดการ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เปิดภาคเรียนที่ 1, พิธีไหว้ครู..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as CalendarEvent["category"] })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                >
                  {CALENDAR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันที่จัดกิจกรรม</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 16 พ.ค. 2569"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เวลา</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 08:30 - 16:30 น."
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานที่</label>
                <input
                  type="text"
                  placeholder="เช่น หอประชุมโรงเรียน, ห้องธุรการ..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มกิจกรรม"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
