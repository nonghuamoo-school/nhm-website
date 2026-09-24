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
  AlertCircle,
  FileSpreadsheet,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { useDownloads } from "@/hooks/useDownloads";
import { useAssets } from "@/hooks/useAssets";
import { DownloadDoc, InventoryAsset } from "@/types";
import DocumentViewerModal from "@/components/common/DocumentViewerModal";
import {
  resolveDocumentMedia,
  triggerDocumentDownload,
  extractGoogleDriveId
} from "@/lib/drive";

const DOC_CATEGORIES: DownloadDoc["category"][] = [
  "แบบฟอร์มคำร้อง",
  "งานวิชาการ",
  "งานบุคคลและงบประมาณ",
  "สำหรับนักเรียน/ผู้ปกครอง"
];

const ASSET_CATEGORIES = [
  "ครุภัณฑ์คอมพิวเตอร์",
  "ครุภัณฑ์การศึกษา",
  "ครุภัณฑ์สำนักงาน",
  "ครุภัณฑ์ไฟฟ้าและวิทยุ",
  "ครุภัณฑ์ยานพาหนะและขนส่ง",
  "ครุภัณฑ์การเกษตร",
  "ครุภัณฑ์วิทยาศาสตร์และการแพทย์",
  "ครุภัณฑ์งานบ้านงานครัว",
  "ครุภัณฑ์กีฬา/ดนตรี",
  "อื่นๆ"
];

const ASSET_STATUSES: InventoryAsset["status"][] = [
  "ใช้งานได้ปกติ",
  "รอซ่อมบำรุง",
  "ชำรุด/จำหน่าย"
];

export default function AdminDownloadsPage() {
  const { docList, addDoc, updateDoc, deleteDoc } = useDownloads();
  const {
    assetsList,
    addAsset,
    updateAsset,
    deleteAsset,
    clearAllAssets,
    resetToDefault
  } = useAssets();

  // Tab State
  const [activeTab, setActiveTab] = useState<"documents" | "inventory">("documents");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ------------------------------------
  // Documents Management State
  // ------------------------------------
  const [docSearch, setDocSearch] = useState("");
  const [selectedDocCat, setSelectedDocCat] = useState("ทั้งหมด");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docFormData, setDocFormData] = useState<{
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

  const [previewDoc, setPreviewDoc] = useState<DownloadDoc | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // ------------------------------------
  // Inventory Asset Management State
  // ------------------------------------
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAssetCat, setSelectedAssetCat] = useState("ทั้งหมด");
  const [selectedAssetStatus, setSelectedAssetStatus] = useState("ทั้งหมด");
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetFormData, setAssetFormData] = useState<Omit<InventoryAsset, "id">>({
    code: "",
    name: "",
    category: "ครุภัณฑ์คอมพิวเตอร์",
    fiscalYear: "2567",
    quantity: 1,
    unit: "เครื่อง",
    location: "ห้องปฏิบัติการคอมพิวเตอร์",
    status: "ใช้งานได้ปกติ",
    note: ""
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ------------------------------------
  // Document Handlers
  // ------------------------------------
  const handleOpenAddDoc = () => {
    setEditingDocId(null);
    setDocFormData({
      title: "",
      category: "แบบฟอร์มคำร้อง",
      fileType: "PDF",
      fileSize: "1.0 MB",
      date: new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }),
      description: "",
      downloadUrl: "#",
      driveUrl: ""
    });
    setIsDocModalOpen(true);
  };

  const handleOpenEditDoc = (doc: DownloadDoc) => {
    setEditingDocId(doc.id);
    setDocFormData({
      title: doc.title,
      category: doc.category,
      fileType: doc.fileType as "PDF" | "DOCX" | "XLSX",
      fileSize: doc.fileSize,
      date: doc.date || "15 มี.ค. 2569",
      description: doc.description || "",
      downloadUrl: doc.downloadUrl || "#",
      driveUrl: doc.driveUrl || ""
    });
    setIsDocModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const ext = file.name.split(".").pop()?.toUpperCase();
    let determinedType: "PDF" | "DOCX" | "XLSX" = "PDF";
    if (ext === "DOC" || ext === "DOCX") determinedType = "DOCX";
    else if (ext === "XLS" || ext === "XLSX") determinedType = "XLSX";

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setDocFormData((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        fileSize: `${sizeInMb} MB`,
        fileType: determinedType,
        downloadUrl: base64Url
      }));
      setIsUploadingFile(false);
      showToast(`แนบไฟล์ "${file.name}" เรียบร้อยแล้ว`);
    };
    reader.onerror = () => {
      setIsUploadingFile(false);
      alert("เกิดข้อผิดพลาดในการอ่านไฟล์ โปรดลองอีกครั้ง");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.title.trim()) {
      alert("กรุณากรอกชื่อเอกสาร");
      return;
    }

    const driveId = extractGoogleDriveId(docFormData.driveUrl);
    let resolvedDownloadUrl = docFormData.downloadUrl;
    let resolvedPreviewUrl: string | undefined = undefined;

    if (driveId) {
      resolvedDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      resolvedPreviewUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    }

    if (editingDocId) {
      updateDoc(editingDocId, {
        title: docFormData.title.trim(),
        category: docFormData.category,
        fileType: docFormData.fileType,
        fileSize: docFormData.fileSize,
        date: docFormData.date.trim() || "15 มี.ค. 2569",
        description: docFormData.description.trim(),
        downloadUrl: resolvedDownloadUrl,
        driveUrl: docFormData.driveUrl.trim() || undefined,
        previewUrl: resolvedPreviewUrl
      });
      showToast(`แก้ไขเอกสาร "${docFormData.title}" เรียบร้อยแล้ว`);
    } else {
      addDoc({
        title: docFormData.title.trim(),
        category: docFormData.category,
        fileType: docFormData.fileType,
        fileSize: docFormData.fileSize,
        date: docFormData.date.trim() || "15 มี.ค. 2569",
        description: docFormData.description.trim(),
        downloadUrl: resolvedDownloadUrl,
        driveUrl: docFormData.driveUrl.trim() || undefined,
        previewUrl: resolvedPreviewUrl,
        downloads: 0
      });
      showToast(`เพิ่มเอกสาร "${docFormData.title}" เรียบร้อยแล้ว`);
    }

    setIsDocModalOpen(false);
  };

  const handleDeleteDoc = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบเอกสาร "${title}" ใช่หรือไม่?`)) {
      deleteDoc(id);
      showToast(`ลบเอกสาร "${title}" เรียบร้อยแล้ว`);
    }
  };

  // ------------------------------------
  // Asset Handlers
  // ------------------------------------
  const handleOpenAddAsset = () => {
    setEditingAssetId(null);
    setAssetFormData({
      code: `ครุภัณฑ์ 7440-00${assetsList.length + 1}-00${Math.floor(Math.random() * 89 + 10)}/67`,
      name: "",
      category: "ครุภัณฑ์คอมพิวเตอร์",
      fiscalYear: "2567",
      quantity: 1,
      unit: "เครื่อง",
      location: "ห้องปฏิบัติการคอมพิวเตอร์",
      status: "ใช้งานได้ปกติ",
      note: ""
    });
    setIsAssetModalOpen(true);
  };

  const handleOpenEditAsset = (asset: InventoryAsset) => {
    setEditingAssetId(asset.id);
    setAssetFormData({
      code: asset.code,
      name: asset.name,
      category: asset.category,
      fiscalYear: asset.fiscalYear,
      quantity: asset.quantity,
      unit: asset.unit,
      location: asset.location,
      status: asset.status,
      note: asset.note || ""
    });
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetFormData.name.trim()) {
      alert("กรุณาระบุชื่อรายการครุภัณฑ์");
      return;
    }
    if (!assetFormData.code.trim()) {
      alert("กรุณาระบุรหัสครุภัณฑ์");
      return;
    }

    if (editingAssetId) {
      updateAsset(editingAssetId, {
        code: assetFormData.code.trim(),
        name: assetFormData.name.trim(),
        category: assetFormData.category,
        fiscalYear: assetFormData.fiscalYear.trim(),
        quantity: Number(assetFormData.quantity) || 1,
        unit: assetFormData.unit.trim() || "รายการ",
        location: assetFormData.location.trim(),
        status: assetFormData.status,
        note: assetFormData.note?.trim() || ""
      });
      showToast(`บันทึกการแก้ไขครุภัณฑ์ "${assetFormData.name}" เรียบร้อย`);
    } else {
      addAsset({
        code: assetFormData.code.trim(),
        name: assetFormData.name.trim(),
        category: assetFormData.category,
        fiscalYear: assetFormData.fiscalYear.trim(),
        quantity: Number(assetFormData.quantity) || 1,
        unit: assetFormData.unit.trim() || "รายการ",
        location: assetFormData.location.trim(),
        status: assetFormData.status,
        note: assetFormData.note?.trim() || ""
      });
      showToast(`เพิ่มครุภัณฑ์ "${assetFormData.name}" เข้าสู่ระบบเรียบร้อย`);
    }

    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบรายการครุภัณฑ์ "${name}" ออกจากระบบใช่หรือไม่?`)) {
      deleteAsset(id);
      showToast(`ลบรายการครุภัณฑ์ "${name}" เรียบร้อยแล้ว`);
    }
  };

  const handleClearAllAssets = () => {
    if (assetsList.length === 0) {
      alert("ไม่มีข้อมูลในทะเบียนครุภัณฑ์");
      return;
    }
    const confirmed = confirm(
      `คำเตือน: คุณต้องการลบข้อมูลครุภัณฑ์ทั้งหมด (${assetsList.length} รายการ) ใช่หรือไม่?\n\nรายการตัวอย่างทั้งหมดจะถูกล้างออกจากระบบทันที`
    );
    if (confirmed) {
      clearAllAssets();
      showToast("ล้างข้อมูลครุภัณฑ์ทั้งหมดเรียบร้อยแล้ว");
    }
  };

  const handleResetDefaultAssets = () => {
    if (confirm("คุณต้องการโหลดรายการครุภัณฑ์ตัวอย่างมาตรฐาน (7 รายการ) กลับคืนมาใช่หรือไม่?")) {
      resetToDefault();
      showToast("โหลดรายการครุภัณฑ์ตัวอย่างกลับคืนเรียบร้อยแล้ว");
    }
  };

  const handleExportAssetsCSV = () => {
    const header = "\uFEFFลำดับ,รหัสครุภัณฑ์,รายการ,หมวดหมู่,ปีงบประมาณ,จำนวน,หน่วย,สถานที่จัดเก็บ,สถานะ,หมายเหตุ\n";
    const rows = filteredAssets
      .map(
        (a, i) =>
          `"${i + 1}","${a.code}","${a.name}","${a.category}","${a.fiscalYear}","${a.quantity}","${a.unit}","${a.location}","${a.status}","${a.note || ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ทะเบียนครุภัณฑ์_โรงเรียนบ้านหนองหัวหมู_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("ดาวน์โหลดไฟล์ Excel (CSV) สำเร็จ");
  };

  // ------------------------------------
  // Filtered Lists
  // ------------------------------------
  const filteredDocs = docList.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(docSearch.toLowerCase()));
    const matchesCat = selectedDocCat === "ทั้งหมด" || doc.category === selectedDocCat;
    return matchesSearch && matchesCat;
  });

  const filteredAssets = assetsList.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.code.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.location.toLowerCase().includes(assetSearch.toLowerCase());
    const matchesCat = selectedAssetCat === "ทั้งหมด" || asset.category === selectedAssetCat;
    const matchesStatus = selectedAssetStatus === "ทั้งหมด" || asset.status === selectedAssetStatus;
    return matchesSearch && matchesCat && matchesStatus;
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

      {/* Top Primary Tabs */}
      <div className="bg-white rounded-3xl p-2 border border-[#E5E7EB] shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "documents"
              ? "bg-[#0F2942] text-white shadow-md"
              : "text-slate-600 hover:text-[#0F2942] hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>แบบฟอร์มและเอกสารราชการ</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === "documents" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {docList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "inventory"
              ? "bg-[#0F2942] text-white shadow-md"
              : "text-slate-600 hover:text-[#0F2942] hover:bg-slate-50"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>ทะเบียนครุภัณฑ์และสินทรัพย์</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === "inventory" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {assetsList.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DOCUMENTS MANAGEMENT                              */}
      {/* ======================================================== */}
      {activeTab === "documents" && (
        <div className="space-y-6 animate-in fade-in duration-150">
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
              onClick={handleOpenAddDoc}
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
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 shrink-0">หมวดหมู่:</span>
              <select
                value={selectedDocCat}
                onChange={(e) => setSelectedDocCat(e.target.value)}
                className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 text-slate-700 flex-1 sm:flex-initial"
              >
                <option value="ทั้งหมด">ทั้งหมด ({docList.length})</option>
                {DOC_CATEGORIES.map((cat) => (
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
                  {filteredDocs.map((doc) => {
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
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <HardDrive className="w-3 h-3" />
                              <span>Google Drive Cloud</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${
                              doc.fileType === "PDF"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : doc.fileType === "XLSX"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {doc.fileType}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-1.5">{doc.fileSize}</span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell text-slate-500 text-[11px]">
                          {doc.date}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                            {Boolean(media.previewEmbedUrl) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewDoc(doc);
                                  setIsPreviewOpen(true);
                                }}
                                className="p-2 rounded-xl text-blue-700 hover:bg-blue-50 transition-colors"
                                title="เปิดอ่านเอกสาร"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => triggerDocumentDownload(media.downloadUrl, media.fileName)}
                              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                              title="ดาวน์โหลดไฟล์"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditDoc(doc)}
                              className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(doc.id, doc.title)}
                              className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                              title="ลบเอกสาร"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-500">ไม่พบเอกสารที่ค้นหา</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: INVENTORY & ASSETS MANAGEMENT                     */}
      {/* ======================================================== */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Bar */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                งานพัสดุและสินทรัพย์สถานศึกษา
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] mt-1">
                จัดการทะเบียนครุภัณฑ์และสินทรัพย์ ({assetsList.length} รายการ)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                บันทึก แก้ไข ค้นหา และลบรายการครุภัณฑ์โรงเรียนบ้านหนองหัวหมู พร้อมซิงค์ระบบออนไลน์และส่งออกไฟล์ Excel
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Add New Asset Button */}
              <button
                type="button"
                onClick={handleOpenAddAsset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-200" />
                <span>เพิ่มครุภัณฑ์ใหม่</span>
              </button>

              {/* Export CSV / Excel */}
              <button
                type="button"
                onClick={handleExportAssetsCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                title="ส่งออกไฟล์ Excel (CSV)"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">ส่งออก Excel</span>
              </button>

              {/* Clear All Assets (Requested by User) */}
              {assetsList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllAssets}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors cursor-pointer"
                  title="ล้างข้อมูลตัวอย่างทั้งหมด"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบข้อมูลทั้งหมด</span>
                </button>
              )}

              {/* Reset to Default 7 Mock Assets */}
              {assetsList.length === 0 && (
                <button
                  type="button"
                  onClick={handleResetDefaultAssets}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-colors cursor-pointer"
                  title="โหลดรายการตัวอย่างเริ่มต้น"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>โหลดข้อมูลตัวอย่าง</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหารหัส, ชื่อครุภัณฑ์, สถานที่..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">หมวดหมู่:</span>
                <select
                  value={selectedAssetCat}
                  onChange={(e) => setSelectedAssetCat(e.target.value)}
                  className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none"
                >
                  <option value="ทั้งหมด">ทั้งหมด ({assetsList.length})</option>
                  {ASSET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">สถานะ:</span>
                <select
                  value={selectedAssetStatus}
                  onChange={(e) => setSelectedAssetStatus(e.target.value)}
                  className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none"
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  {ASSET_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Asset Inventory Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3 text-center w-12">ลำดับ</th>
                    <th className="py-3.5 px-3">รหัสครุภัณฑ์</th>
                    <th className="py-3.5 px-4">รายการครุภัณฑ์</th>
                    <th className="py-3.5 px-3 hidden md:table-cell">หมวดหมู่</th>
                    <th className="py-3.5 px-3 text-center">ปีงบฯ</th>
                    <th className="py-3.5 px-3 text-center">จำนวน</th>
                    <th className="py-3.5 px-3 hidden lg:table-cell">สถานที่จัดเก็บ/ผู้รับผิดชอบ</th>
                    <th className="py-3.5 px-3 text-center">สถานะ</th>
                    <th className="py-3.5 px-4 text-right w-28">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map((asset, index) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-blue-900 whitespace-nowrap">
                        {asset.code}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#0F2942] text-xs sm:text-[13px]">{asset.name}</div>
                        {asset.note && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{asset.note}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 hidden md:table-cell text-slate-600 whitespace-nowrap">
                        {asset.category}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600 font-semibold">
                        {asset.fiscalYear}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                        {asset.quantity} {asset.unit}
                      </td>
                      <td className="py-3.5 px-3 hidden lg:table-cell text-slate-600 text-[11px]">
                        {asset.location}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                            asset.status === "ใช้งานได้ปกติ"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : asset.status === "รอซ่อมบำรุง"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {asset.status === "ใช้งานได้ปกติ" && <CheckCircle2 className="w-3 h-3" />}
                          {asset.status === "รอซ่อมบำรุง" && <AlertTriangle className="w-3 h-3" />}
                          {asset.status === "ชำรุด/จำหน่าย" && <XCircle className="w-3 h-3" />}
                          <span>{asset.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAsset(asset)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="แก้ไขข้อมูลครุภัณฑ์"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAsset(asset.id, asset.name)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="ลบรายการครุภัณฑ์"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-14 text-slate-400">
                        <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-sm text-slate-600">
                          {assetsList.length === 0
                            ? "ยังไม่มีข้อมูลในทะเบียนครุภัณฑ์ (รายการทั้งหมดถูกลบแล้ว)"
                            : "ไม่พบข้อมูลครุภัณฑ์ที่ค้นหา"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {assetsList.length === 0
                            ? "คุณสามารถกดปุ่ม \"+ เพิ่มครุภัณฑ์ใหม่\" หรือกด \"โหลดข้อมูลตัวอย่าง\" ได้ทันที"
                            : "ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT DOCUMENT                             */}
      {/* ======================================================== */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2942]">
                    {editingDocId ? "แก้ไขเอกสารดาวน์โหลด" : "เพิ่มเอกสารดาวน์โหลดใหม่"}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    แนบไฟล์โดยตรง หรือใช้ลิงก์จาก Google Drive
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 pt-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเอกสาร / แบบฟอร์ม <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แบบคำร้องขอย้ายสถานศึกษา (ปพ.6)"
                  value={docFormData.title}
                  onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category & File Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่</label>
                  <select
                    value={docFormData.category}
                    onChange={(e) =>
                      setDocFormData({
                        ...docFormData,
                        category: e.target.value as DownloadDoc["category"]
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {DOC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทไฟล์</label>
                  <select
                    value={docFormData.fileType}
                    onChange={(e) =>
                      setDocFormData({
                        ...docFormData,
                        fileType: e.target.value as "PDF" | "DOCX" | "XLSX"
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* Google Drive Link */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <label className="block text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ลิงก์ Google Drive (แนะนำ)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={docFormData.driveUrl}
                  onChange={(e) => setDocFormData({ ...docFormData, driveUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <p className="text-[10px] text-emerald-700 mt-1">
                  * วางลิงก์แชร์ของ Google Drive ระบบจะแปลงเป็นโหมดอ่านออนไลน์และดาวน์โหลดอัตโนมัติ
                </p>
              </div>

              {/* Direct File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หรือ อัปโหลดไฟล์จากเครื่อง
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>
                    {isUploadingFile
                      ? "กำลังอ่านไฟล์..."
                      : docFormData.downloadUrl && docFormData.downloadUrl.startsWith("data:")
                      ? "เลือกไฟล์ใหม่แล้ว (คลิกเปลี่ยน)"
                      : "คลิกเพื่อเลือกไฟล์ PDF / Word / Excel"}
                  </span>
                </button>
              </div>

              {/* Date & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันที่เผยแพร่</label>
                  <input
                    type="text"
                    placeholder="เช่น 15 มี.ค. 2569"
                    value={docFormData.date}
                    onChange={(e) => setDocFormData({ ...docFormData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ขนาดไฟล์ระบุ</label>
                  <input
                    type="text"
                    placeholder="เช่น 1.2 MB"
                    value={docFormData.fileSize}
                    onChange={(e) => setDocFormData({ ...docFormData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายเพิ่มเติม</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดเอกสาร กลุ่มเป้าหมาย หรือคำแนะนำในการกรอก..."
                  value={docFormData.description}
                  onChange={(e) => setDocFormData({ ...docFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {editingDocId ? "บันทึกการแก้ไข" : "เพิ่มเอกสาร"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT INVENTORY ASSET                      */}
      {/* ======================================================== */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2942]">
                    {editingAssetId ? "แก้ไขรายการครุภัณฑ์" : "เพิ่มรายการครุภัณฑ์ใหม่"}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    บันทึกข้อมูลเพื่อแสดงในทะเบียนคุมพัสดุและส่งออก Excel
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssetModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-3.5 pt-4">
              {/* Asset Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รหัสครุภัณฑ์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ครุภัณฑ์ 7440-001-0012/67"
                  value={assetFormData.code}
                  onChange={(e) => setAssetFormData({ ...assetFormData, code: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อรายการครุภัณฑ์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เครื่องคอมพิวเตอร์ประมวลผล All-in-One เพื่อการศึกษา"
                  value={assetFormData.name}
                  onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Fiscal Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่ครุภัณฑ์</label>
                  <select
                    value={assetFormData.category}
                    onChange={(e) => setAssetFormData({ ...assetFormData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {ASSET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ปีงบประมาณ</label>
                  <input
                    type="text"
                    placeholder="เช่น 2567"
                    value={assetFormData.fiscalYear}
                    onChange={(e) => setAssetFormData({ ...assetFormData, fiscalYear: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">จำนวน</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={assetFormData.quantity}
                    onChange={(e) => setAssetFormData({ ...assetFormData, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    placeholder="เช่น เครื่อง, ชุด, ตัว, หลัง"
                    value={assetFormData.unit}
                    onChange={(e) => setAssetFormData({ ...assetFormData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Location / Responsible */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  สถานที่จัดเก็บ / ผู้รับผิดชอบ
                </label>
                <input
                  type="text"
                  placeholder="เช่น ห้องปฏิบัติการคอมพิวเตอร์ / ครูผู้ดูแลระบบ"
                  value={assetFormData.location}
                  onChange={(e) => setAssetFormData({ ...assetFormData, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สถานะครุภัณฑ์</label>
                <div className="grid grid-cols-3 gap-2">
                  {ASSET_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAssetFormData({ ...assetFormData, status: st })}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        assetFormData.status === st
                          ? st === "ใช้งานได้ปกติ"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : st === "รอซ่อมบำรุง"
                            ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                            : "bg-red-600 text-white border-red-600 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {st === "ใช้งานได้ปกติ" && <CheckCircle2 className="w-3 h-3" />}
                      {st === "รอซ่อมบำรุง" && <AlertTriangle className="w-3 h-3" />}
                      {st === "ชำรุด/จำหน่าย" && <XCircle className="w-3 h-3" />}
                      <span>{st}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หมายเหตุ / แหล่งงบประมาณ</label>
                <textarea
                  rows={2}
                  placeholder="เช่น จัดสรรจากงบประมาณ สพป. บุรีรัมย์ เขต 3 หรือ โครงการ DLTV"
                  value={assetFormData.note}
                  onChange={(e) => setAssetFormData({ ...assetFormData, note: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {editingAssetId ? "บันทึกการแก้ไข" : "เพิ่มครุภัณฑ์"}
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
