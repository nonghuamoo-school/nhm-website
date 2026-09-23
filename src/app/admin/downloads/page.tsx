"use client";

import React, { useState } from "react";
import { FileText, Plus, Search, Download, Trash2, Edit3, HardDrive } from "lucide-react";
import { schoolDownloads } from "@/data/downloads";
import { DownloadDoc } from "@/types";

export default function AdminDownloadsPage() {
  const [docs, setDocs] = useState<DownloadDoc[]>(schoolDownloads);
  const [searchWord, setSearchWord] = useState("");

  const filtered = docs.filter((doc) =>
    doc.title.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            การจัดการเอกสาร
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] mt-0.5">
            จัดการเอกสารดาวน์โหลดและแบบฟอร์ม
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            อัปโหลด เผยแพร่ และตรวจสอบสถิติดาวน์โหลดแบบฟอร์ม
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("ระบบอัปโหลดเอกสารใหม่พร้อมเชื่อมต่อ backend")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>เพิ่มเอกสารใหม่</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเอกสาร..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">ชื่อเอกสาร</th>
                <th className="py-3.5 px-4 hidden md:table-cell">หมวดหมู่</th>
                <th className="py-3.5 px-4">ชนิด / ขนาด</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">ดาวน์โหลด</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 max-w-xs sm:max-w-md">
                    <div>{doc.title}</div>
                    {doc.driveUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-normal bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 mt-1">
                        Google Drive Synced
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-600">
                    {doc.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0F2942]">{doc.fileType}</span>{" "}
                    <span className="text-slate-400">({doc.fileSize})</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 hidden sm:table-cell">
                    {doc.downloads} ครั้ง
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {doc.driveUrl && (
                        <a
                          href={doc.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                          title="เปิดใน Google Drive"
                        >
                          <HardDrive className="w-4 h-4" />
                        </a>
                      )}
                      <a
                        href={doc.downloadUrl}
                        className="p-2 rounded-lg text-slate-600 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
                        title="ดาวน์โหลด"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setDocs(docs.filter((d) => d.id !== doc.id))}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="ลบเอกสาร"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
