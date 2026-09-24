"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, ExternalLink, HardDrive } from "lucide-react";
import DocumentViewerModal from "@/components/common/DocumentViewerModal";
import { resolveDocumentMedia, triggerDocumentDownload } from "@/lib/drive";

interface Attachment {
  name: string;
  size: string;
  url: string;
  type?: "PDF" | "XLSX" | "DOCX" | "LINK" | "IMAGE";
  driveUrl?: string;
}

interface NewsAttachmentsViewProps {
  attachments: Attachment[];
  newsTitle: string;
}

export default function NewsAttachmentsView({
  attachments,
  newsTitle,
}: NewsAttachmentsViewProps) {
  const [selectedDoc, setSelectedDoc] = useState<{
    title: string;
    category?: string;
    fileType?: string;
    fileSize?: string;
    date?: string;
    driveUrl?: string;
    downloadUrl?: string;
    description?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!attachments || attachments.length === 0) return null;

  const handleOpenPreview = (file: Attachment) => {
    setSelectedDoc({
      title: file.name,
      category: "เอกสารแนบข่าว",
      fileType: file.type || "PDF",
      fileSize: file.size,
      driveUrl: file.driveUrl,
      downloadUrl: file.url,
      description: `เอกสารแนบประกอบข่าวประชาสัมพันธ์เรื่อง: ${newsTitle}`,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="pt-6 border-t border-[#E5E7EB] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0F2942] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0F2942]" />
          <span>เอกสารแนบสำหรับอ่านและดาวน์โหลด ({attachments.length} รายการ)</span>
        </h3>

        <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>จัดเก็บบน Google Drive</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {attachments.map((file, idx) => {
          const media = resolveDocumentMedia({
            title: file.name,
            fileType: file.type,
            downloadUrl: file.url,
            driveUrl: file.driveUrl,
          });

          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-slate-300 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    file.type === "PDF" || file.name.endsWith(".pdf")
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : file.type === "XLSX" || file.name.endsWith(".xlsx")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">
                    {file.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>ขนาด: {file.size}</span>
                    {media.isDrive && <span>• เชื่อมต่อ Google Drive</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => handleOpenPreview(file)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2942] bg-white hover:bg-slate-100/80 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                  <span>เปิดอ่านออนไลน์</span>
                </button>

                {/* Google Drive Link */}
                {media.driveViewUrl && (
                  <a
                    href={media.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg border border-blue-200 transition-colors"
                    title="เปิดไฟล์นี้บน Google Drive"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>เปิดใน Drive</span>
                  </a>
                )}

                {/* Download */}
                <button
                  type="button"
                  onClick={() => triggerDocumentDownload(media.downloadUrl, media.fileName)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0F2942] hover:bg-[#163C61] rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title={`ดาวน์โหลด ${media.fileName}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
}
