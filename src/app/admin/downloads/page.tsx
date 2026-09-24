"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  Edit3,
  HardDrive,
  Upload,
  CheckCircle2,
  X,
  ExternalLink,
  Eye,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useDownloads } from "@/hooks/useDownloads";
import { DownloadDoc } from "@/types";
import DocumentViewerModal from "@/components/common/DocumentViewerModal";
import {
  resolveDocumentMedia,
  triggerDocumentDownload,
  extractGoogleDriveId
} from "@/lib/drive";

const CATEGORIES: DownloadDoc["category"][] = [
  "แบบฟอร์มคำร้อง",
  "งานวิชาการ",
  "งานบุคคลและงบประมาณ",
  "สำหรับนักเรียน/ผู้ปกครอง"
];

export default function AdminDownloadsPage() {
  const { docList, addDoc, updateDoc, deleteDoc } = useDownloads();
  const [searchWord, setSearchWord] = useState("");
  const [selectedCat, setSelectedCat] = useState("ทั้งหมด");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    category: DownloadDoc["category"];
    fileType: "PDF" | "DOCX" | "XLSX";
    fileSize: string;
    date: string;
    description: string;
    downloadUrl: string;
    driveUrl: string;
  }>({
    title: "",
    category: "แบบฟอร์มคำร้อง",
    fileType: "PDF",
    fileSize: "1.0 MB",
    date: "15 มี.ค. 2569",
    description: "",
    downloadUrl: "#",
    driveUrl: ""
  });

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<DownloadDoc | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "แบบฟอร์มคำร้อง",
      fileType: "PDF",
      fileSize: "1.0 MB",
      date: new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }),
      description: "",
      downloadUrl: "#",
      driveUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DownloadDoc) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      category: doc.category,
      fileType: doc.fileType as "PDF" | "DOCX" | "XLSX",
      fileSize: doc.fileSize,
      date: doc.date || "15 มี.ค. 2569",
      description: doc.description || "",
      downloadUrl: doc.downloadUrl || "#",
      driveUrl: doc.driveUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleOpenPreview = (doc: DownloadDoc) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize =
      sizeInMB < 1
        ? `${Math.round(file.size / 1024)} KB`
        : `${sizeInMB.toFixed(1)} MB`;

    let detectedType: "PDF" | "DOCX" | "XLSX" = "PDF";
    const nameLower = file.name.toLowerCase();
    if (nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls")) {
      detectedType = "XLSX";
    } else if (nameLower.endsWith(".docx") || nameLower.endsWith(".doc")) {
      detectedType = "DOCX";
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        fileSize: formattedSize,
        fileType: detectedType,
        downloadUrl: dataUrl
      }));
      setIsUploadingFile(false);
      showToast(`อัปโหลดไฟล์ "${file.name}" (${formattedSize}) เรียบร้อย`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("กรุณากรอกชื่อเอกสาร");
      return;
    }

    const driveId = extractGoogleDriveId(formData.driveUrl);
    const resolvedDownloadUrl =
      formData.downloadUrl && formData.downloadUrl !== "#"
        ? formData.downloadUrl
        : driveId
        ? `https://drive.google.com/uc?export=download&id=${driveId}`
        : "#";
    const resolvedPreviewUrl =
      driveId
        ? `https://drive.google.com/file/d/${driveId}/preview`
        : resolvedDownloadUrl;

    if (editingId) {
      updateDoc(editingId, {
        title: formData.title.trim(),
        category: formData.category,
        fileType: formData.fileType,
        fileSize: formData.fileSize,
        date: formData.date.trim() || "15 มี.ค. 2569",
        description: formData.description.trim(),
        downloadUrl: resolvedDownloadUrl,
        driveUrl: formData.driveUrl.trim() || undefined,
        previewUrl: resolvedPreviewUrl
      });
      showToast(`แก้ไขเอกสาร "${formData.title}" เรียบร้อยแล้ว`);
    } else {
      addDoc({
        title: formData.title.trim(),
        category: formData.category,
        fileType: formData.fileType,
        fileSize: formData.fileSize,
        date: formData.date.trim() || "15 มี.ค. 2569",
        description: formData.description.trim(),
        downloadUrl: resolvedDownloadUrl,
        driveUrl: formData.driveUrl.trim() || undefined,
        previewUrl: resolvedPreviewUrl,
        downloads: 0
      });
      showToast(`เพิ่มเอกสาร "${formData.title}" เรียบร้อยแล้ว`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบเอกสาร "${title}" ใช่หรือไม่?`)) {
      deleteDoc(id);
      showToast(`ลบเอกสาร "${title}" เรียบร้อยแล้ว`);
    }
  };

  const filtered = docList.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchWord.toLowerCase()));
    const matchesCat = selectedCat === "ทั้งหมด" || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

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
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
            การจัดการเอกสารสถานศึกษา
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] mt-1">
            จัดการเอกสารดาวน์โหลดและแบบฟอร์ม ({docList.length} รายการ)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            อัปโหลดไฟล์ PDF หรือแนบลิงก์ Google Drive เพื่อให้นักเรียนและผู้ปกครองเปิดอ่านออนไลน์และดาวน์โหลดได้ทันที
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0F2942] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all min-h-[44px] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>เพิ่มเอกสารใหม่</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเอกสารหรือคำอธิบาย..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">หมวดหมู่:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 text-slate-700 flex-1 sm:flex-initial"
          >
            <option value="ทั้งหมด">ทั้งหมด ({docList.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">ชื่อเอกสาร</th>
                <th className="py-3.5 px-4 hidden md:table-cell">หมวดหมู่</th>
                <th className="py-3.5 px-4">ชนิด / ขนาด</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">วันที่เผยแพร่</th>
                <th className="py-3.5 px-4 sm:px-6 text-right w-44">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => {
                const media = resolveDocumentMedia(doc);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 max-w-xs sm:max-w-md">
                      <div className="text-sm font-bold text-[#0F2942]">{doc.title}</div>
                      {doc.description && (
                        <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                          {doc.description}
                        </p>
                      )}
                      {doc.driveUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 mt-1.5">
                          <HardDrive className="w-3 h-3 text-blue-600" />
                          <span>Google Drive Online</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-slate-600 font-medium">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-black text-[10.5px] mr-1.5 ${
                          doc.fileType === "PDF"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : doc.fileType === "XLSX"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {doc.fileType}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">({doc.fileSize})</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 hidden sm:table-cell font-mono text-[11px]">
                      {doc.date}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview Online Modal */}
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(doc)}
                          className="p-2 rounded-xl text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
                          title="เปิดอ่านเอกสารออนไลน์"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Open in Google Drive */}
                        {media.driveViewUrl && (
                          <a
                            href={media.driveViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                            title="เปิดใน Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Direct Download */}
                        <button
                          type="button"
                          onClick={() => triggerDocumentDownload(media.downloadUrl, media.fileName)}
                          className="p-2 rounded-xl text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title={`ดาวน์โหลด ${media.fileName}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(doc)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200 cursor-pointer"
                          title="แก้ไขเอกสาร"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                          title="ลบเอกสาร"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: เพิ่ม/แก้ไขเอกสาร ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 relative my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0F2942]">
                    {editingId ? "แก้ไขข้อมูลเอกสาร" : "เพิ่มเอกสารดาวน์โหลดใหม่"}
                  </h3>
                  <p className="text-xs text-slate-400">อัปโหลดไฟล์หรือระบุลิงก์ Google Drive เพื่อเปิดอ่านออนไลน์</p>
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
              {/* Document Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเอกสารหรือแบบฟอร์ม *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แผนปฏิบัติการ โรงเรียนบ้านหนองหัวหมู 2569, แบบฟอร์มคำร้อง..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category & File Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as DownloadDoc["category"] })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชนิดไฟล์</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) =>
                      setFormData({ ...formData, fileType: e.target.value as "PDF" | "DOCX" | "XLSX" })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                  >
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="DOCX">Microsoft Word (.docx)</option>
                    <option value="XLSX">Microsoft Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* Date & File Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    วันที่เผยแพร่ (เช่น 15 มี.ค. 2569)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="15 มี.ค. 2569"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ขนาดไฟล์โดยประมาณ</label>
                  <input
                    type="text"
                    placeholder="เช่น 1.0 MB, 500 KB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Google Drive Link with Guide */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0F2942]">
                    แนบลิงก์ Google Drive (สำหรับเปิดอ่านออนไลน์ PDF)
                  </label>
                  {formData.driveUrl && extractGoogleDriveId(formData.driveUrl) && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>พบ ID ไฟล์ Drive แล้ว</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <HardDrive className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/180xa5rtb1.../view?usp=sharing"
                    value={formData.driveUrl}
                    onChange={(e) => setFormData({ ...formData, driveUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Google Drive Permission Sharing Guide */}
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-[11px] text-blue-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>คำแนะนำการตั้งค่าแชร์ Google Drive เพื่อให้อ่านออนไลน์ได้ทันที:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                    <li>ใน Google Drive คลิกขวาที่ไฟล์ PDF เลือก <strong>&ldquo;แชร์&rdquo; (Share)</strong></li>
                    <li>ตรงหัวข้อ <em>การเข้าถึงทั่วไป</em> เปลี่ยนจาก &ldquo;จำกัดสิทธิ์&rdquo; เป็น <strong className="text-blue-900">&ldquo;ทุกคนที่มีลิงก์&rdquo; (Anyone with the link)</strong></li>
                    <li>ตั้งสิทธิ์เป็น <strong>&ldquo;ผู้มีสิทธิ์อ่าน&rdquo; (Viewer)</strong> แล้วกดคัดลอกลิงก์มาวางในช่องด้านบนนี้</li>
                  </ol>
                  {formData.driveUrl && (
                    <div className="pt-1">
                      <a
                        href={formData.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
                      >
                        <span>คลิกเพื่อทดสอบเปิดลิงก์ Google Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Local File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หรือ อัปโหลดไฟล์จากเครื่องคอมพิวเตอร์
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf, .docx, .doc, .xlsx, .xls"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-3.5 text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#0F2942] block">
                    {isUploadingFile ? "กำลังอ่านไฟล์..." : "คลิกเพื่อเลือกไฟล์จากเครื่อง (PDF / Word / Excel)"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ขนาดปัจจุบัน: {formData.fileSize} • ชนิด: {formData.fileType}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายเพิ่มเติม</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดเอกสาร กลุ่มเป้าหมาย หรือคำแนะนำในการกรอก..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มเอกสาร"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={previewDoc}
      />
    </div>
  );
}
