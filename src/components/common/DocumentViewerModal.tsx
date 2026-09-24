"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Printer,
  Share2,
  Check,
  Building2,
  ShieldCheck,
  AlertCircle,
  HardDrive,
  Loader2
} from "lucide-react";
import { resolveDocumentMedia, triggerDocumentDownload } from "@/lib/drive";

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
    previewUrl?: string;
    description?: string;
  } | null;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  document: doc,
}: DocumentViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "hidden";
      setIsLoadingIframe(true);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, doc]);

  if (!isOpen || !doc) return null;

  const media = resolveDocumentMedia(doc);

  const handleCopyLink = () => {
    const linkToCopy = media.driveViewUrl || doc.driveUrl || window.location.href;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    triggerDocumentDownload(media.downloadUrl, media.fileName);
  };

  const handlePrint = () => {
    // If there's an iframe, we try to focus and print, or fallback to window.print()
    const iframeEl = document.getElementById("nhm-pdf-viewer-frame") as HTMLIFrameElement | null;
    if (iframeEl && iframeEl.contentWindow) {
      try {
        iframeEl.contentWindow.print();
        return;
      } catch {
        // Cross-origin iframe will throw security error, open in new window instead
        if (media.driveViewUrl) {
          window.open(media.driveViewUrl, "_blank");
          return;
        }
      }
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 text-white rounded-2xl flex flex-col shadow-2xl border border-slate-700/60 transition-all duration-300 overflow-hidden ${
          isFullscreen
            ? "w-screen h-screen rounded-none fixed inset-0 z-50"
            : "w-full max-w-5xl h-[92vh] max-h-[920px]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 shrink-0 gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {doc.category || "เอกสารราชการ"}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {doc.fileSize || "1.0 MB"} • วันที่ {doc.date || "ล่าสุด"}
                </span>
              </div>
              <h2 className="text-xs sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Drive Link Button */}
            {media.driveViewUrl && (
              <a
                href={media.driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="เปิดดูไฟล์ต้นฉบับบน Google Drive"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>เปิดบน Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Direct Download Button with dynamic filename */}
            <button
              type="button"
              onClick={handleDownload}
              title={`ดาวน์โหลดเป็นไฟล์: ${media.fileName}`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ดาวน์โหลด</span>
            </button>

            {/* Share / Copy link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="คัดลอกลิงก์เอกสาร"
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              title="พิมพ์เอกสาร"
              className="hidden sm:inline-flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "ออกจากโหมดเต็มจอ" : "โหมดเต็มจอ"}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors ml-0.5 sm:ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Notification / Helper Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] sm:text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            {media.isDrive ? (
              <>
                <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">
                  เปิดดูไฟล์ออนไลน์ผ่าน Google Drive (สามารถเลื่อนอ่านหลายหน้าและซูมดูได้)
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">เอกสารเผยแพร่อย่างเป็นทางการ • โรงเรียนบ้านหนองหัวหมู</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {media.driveViewUrl && (
              <a
                href={media.driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 text-[11px]"
              >
                <span>เปิดในแท็บใหม่</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 w-full h-full relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          {media.previewEmbedUrl ? (
            <div className="relative w-full h-full flex flex-col bg-slate-900">
              {isLoadingIframe && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10 text-slate-300 gap-2">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-xs font-medium">กำลังโหลดเอกสาร PDF ออนไลน์...</p>
                </div>
              )}
              <iframe
                id="nhm-pdf-viewer-frame"
                src={media.previewEmbedUrl}
                title={doc.title}
                className="w-full h-full border-0 bg-white"
                allow="autoplay; encrypted-media; fullscreen"
                onLoad={() => setIsLoadingIframe(false)}
              />
            </div>
          ) : (
            /* Fallback Card if No Previewable URL exists */
            <div className="p-6 sm:p-10 max-w-lg text-center space-y-4 bg-slate-900 rounded-2xl border border-slate-800 m-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {doc.description || "เอกสารทางการ โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3"}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">หมวดหมู่:</span>
                  <span className="font-semibold text-white">{doc.category || "เอกสารทั่วไป"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ชนิดไฟล์:</span>
                  <span className="font-semibold text-white">{doc.fileType || "PDF"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ขนาด:</span>
                  <span className="font-semibold text-white">{doc.fileSize || "1.0 MB"}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดเอกสาร ({media.fileName})</span>
                </button>
                {media.driveViewUrl && (
                  <a
                    href={media.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>เปิดใน Google Drive</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Notice Bar */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>ชื่อไฟล์ที่ดาวน์โหลด: <span className="font-mono text-slate-300 font-semibold">{media.fileName}</span></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>หากเปิดไม่ติด: ตรวจสอบการตั้งค่าสิทธิ์ Drive ให้เป็น &quot;ทุกคนที่มีลิงก์มีสิทธิ์อ่าน&quot;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
