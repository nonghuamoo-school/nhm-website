"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Printer,
  Share2,
  Check,
  Building2,
  ShieldCheck
} from "lucide-react";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    category?: string;
    fileType?: string;
    fileSize?: string;
    date?: string;
    driveUrl?: string;
    downloadUrl?: string;
    description?: string;
  } | null;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  document,
}: DocumentViewerModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 12;
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document && (window.document.body.style.overflow = "hidden");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const handleCopyLink = () => {
    if (document.driveUrl) {
      navigator.clipboard.writeText(document.driveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 text-white rounded-2xl flex flex-col shadow-2xl border border-slate-700/60 transition-all duration-300 overflow-hidden ${
          isFullscreen
            ? "w-screen h-screen rounded-none fixed inset-0 z-50"
            : "w-full max-w-5xl h-[92vh] max-h-[920px]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {document.category || "เอกสารราชการ"}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {document.fileSize || "1.2 MB"} • วันที่ {document.date || "ล่าสุด"}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Drive Link Button */}
            {document.driveUrl && (
              <a
                href={document.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="เปิดดูไฟล์ต้นฉบับบน Google Drive"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
                </svg>
                <span>เปิดบน Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Direct Download */}
            <a
              href={document.downloadUrl || "#"}
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ดาวน์โหลด</span>
            </a>

            {/* Share link */}
            <button
              onClick={handleCopyLink}
              title="คัดลอกลิงก์เอกสาร"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              title="พิมพ์เอกสาร"
              className="hidden sm:inline-flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "โหมดเต็มจอ"}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Toolbar Controls (Page Nav & Zoom) */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">
              <span>หน้า</span>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }}
                className="w-8 text-center bg-slate-950 rounded border border-slate-700 py-0.5 text-xs text-white"
              />
              <span>/ {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>เอกสารเผยแพร่อย่างเป็นทางการ • โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
              title="ย่อขนาด"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-12 text-center text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
              title="ขยายขนาด"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Canvas Area */}
        <div className="flex-1 bg-slate-950 overflow-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-150 shadow-2xl"
          >
            {/* Authentic Thai School Document Page Simulation */}
            <div className="w-[680px] sm:w-[760px] min-h-[1020px] bg-white text-slate-800 p-12 sm:p-16 rounded-sm shadow-xl flex flex-col justify-between font-sans leading-relaxed text-xs sm:text-sm">
              <div>
                {/* Official Emblem & Header */}
                <div className="text-center pb-8 border-b-2 border-slate-800/80">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#0F2942]/10 flex items-center justify-center border border-[#0F2942]/20">
                    <Building2 className="w-8 h-8 text-[#0F2942]" />
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-[#0F2942] tracking-tight">
                    {document.title}
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    โรงเรียนบ้านหนองหัวหมู จังหวัดบุรีรัมย์
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    สำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน กระทรวงศึกษาธิการ
                  </p>
                </div>

                {/* Body Content of Simulated Page */}
                <div className="pt-8 space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                    <span>รหัสเอกสาร: NHM-DOC-2569-0{currentPage}</span>
                    <span>หน้าที่ {currentPage} จาก {totalPages}</span>
                  </div>

                  <div className="space-y-4 text-slate-700">
                    <p className="text-justify indent-8 leading-relaxed">
                      {document.description ||
                        "เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นแนวทางการบริหารจัดการศึกษาและการดำเนินงานตามมาตรฐานสถานศึกษา เพื่อยกระดับผลสัมฤทธิ์ทางการเรียน คุณลักษณะอันพึงประสงค์ และประสิทธิภาพการปฏิบัติงานของคณะครูและบุคลากรทางการศึกษา โรงเรียนบ้านหนองหัวหมู"}
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-[#0F2942] text-xs">สาระสำคัญของเอกสาร:</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                        <li>เป้าหมายการพัฒนาคุณภาพผู้เรียนตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน</li>
                        <li>แนวทางการจัดกิจกรรมการเรียนรู้แบบ Active Learning</li>
                        <li>มาตรการดูแลความปลอดภัยในสถานศึกษาและการช่วยเหลือผู้เรียนรายบุคคล</li>
                        <li>การประสานความร่วมมือระหว่างโรงเรียน ชุมชน และคณะกรรมการสถานศึกษา</li>
                      </ul>
                    </div>

                    <p className="text-justify indent-8 leading-relaxed">
                      จึงประกาศและเผยแพร่เพื่อให้คณะครู บุคลากรทางการศึกษา ผู้ปกครอง และผู้มีส่วนเกี่ยวข้อง ได้ใช้เป็นแนวทางในการประสานความร่วมมือเพื่อขับเคลื่อนการศึกษาของโรงเรียนบ้านหนองหัวหมูให้บรรลุตามเป้าหมายต่อไป
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Signature & Verification Footer */}
              <div className="pt-12 mt-8 border-t border-slate-200 flex items-end justify-between text-xs">
                <div>
                  <span className="block text-[11px] text-slate-400">ระบบคลังเอกสารดิจิทัล</span>
                  <span className="font-bold text-[#0F2942]">โรงเรียนบ้านหนองหัวหมู (สพป. บุรีรัมย์ เขต 3)</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="h-10 flex items-center justify-center italic text-slate-400 text-xs">
                    (ลงชื่อแล้วในระบบดิจิทัล)
                  </div>
                  <p className="font-bold text-[#0F2942]">ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู</p>
                  <p className="text-[11px] text-slate-500">ประธานคณะกรรมการบริหารสถานศึกษา</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status bar with Google Drive Direct Tip */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>เชื่อมต่อผ่านระบบ Google Workspace for Education (สพป. บุรีรัมย์ เขต 3)</span>
          </div>

          <div className="flex items-center gap-3">
            {document.driveUrl && (
              <a
                href={document.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              >
                <span>ดูไฟล์ฉบับเต็มบน Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
