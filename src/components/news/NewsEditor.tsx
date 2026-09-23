"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Paperclip,
  Plus,
  Trash2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  ExternalLink,
  Upload,
  Camera,
  X as CloseIcon
} from "lucide-react";
import { NewsItem } from "@/types";
import { useNews } from "@/hooks/useNews";

interface NewsEditorProps {
  initialData?: NewsItem;
  isEditMode?: boolean;
}

export default function NewsEditor({
  initialData,
  isEditMode = false,
}: NewsEditorProps) {
  const router = useRouter();
  const { addNews, updateNews } = useNews();

  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState<
    "ประชาสัมพันธ์" | "กิจกรรม" | "วิชาการ" | "จัดซื้อจัดจ้าง"
  >(initialData?.category || "ประชาสัมพันธ์");
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [publishDate, setPublishDate] = useState(
    initialData?.date || "22 ก.ย. 2568"
  );
  const [status, setStatus] = useState<"เผยแพร่แล้ว" | "ฉบับร่าง">(
    initialData?.status || "เผยแพร่แล้ว"
  );
  const [attachments, setAttachments] = useState<
    { name: string; size: string; url: string; driveUrl?: string; type?: "PDF" | "XLSX" | "DOCX" | "LINK" }[]
  >(initialData?.attachments || []);

  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentSize, setNewAttachmentSize] = useState("1.2 MB");
  const [newAttachmentType, setNewAttachmentType] = useState<"PDF" | "XLSX" | "DOCX" | "LINK">("PDF");
  const [newAttachmentDriveUrl, setNewAttachmentDriveUrl] = useState("");

  const [previewTab, setPreviewTab] = useState<"article" | "card" | "seo">("article");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image to crisp WebP/JPEG under 150KB for zero-host direct embedding
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)");
      return;
    }

    setIsProcessingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            setImageUrl(dataUrl);
          } else {
            setImageUrl(e.target?.result as string);
          }
          setIsProcessingImage(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix = "") => {
    setContent((prev) => prev + `\n${prefix}ข้อความใหม่${suffix}`);
  };

  const handleAddAttachment = () => {
    if (newAttachmentName.trim()) {
      setAttachments([
        ...attachments,
        {
          name: newAttachmentName.trim(),
          size: newAttachmentSize || "1.0 MB",
          url: "#",
          type: newAttachmentType,
          driveUrl: newAttachmentDriveUrl.trim() || undefined,
        },
      ]);
      setNewAttachmentName("");
      setNewAttachmentDriveUrl("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const saveCurrentNews = (newStatus: "เผยแพร่แล้ว" | "ฉบับร่าง") => {
    const newsPayload = {
      title: title.trim() || "ข่าวประชาสัมพันธ์",
      category,
      imageUrl,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || title.trim(),
      date: publishDate,
      author: "งานประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู",
      status: newStatus,
      attachments,
      views: initialData?.views || 1,
      slug: initialData?.slug || `news-${Date.now()}`
    };

    if (isEditMode && initialData?.id) {
      updateNews(initialData.id, newsPayload);
    } else {
      addNews(newsPayload);
    }
  };

  const handleSaveDraft = () => {
    setStatus("ฉบับร่าง");
    saveCurrentNews("ฉบับร่าง");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublish = () => {
    setStatus("เผยแพร่แล้ว");
    saveCurrentNews("เผยแพร่แล้ว");
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      router.push("/admin/news");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Back Button and Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="p-2 rounded-xl text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
            title="ย้อนกลับ"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              {isEditMode ? "แก้ไขข่าวประชาสัมพันธ์" : "สร้างข่าวประชาสัมพันธ์ใหม่"}
            </span>
            <h1 className="text-lg font-bold text-[#0F2942]">
              {title || "หัวข้อข่าวสาร..."}
            </h1>
          </div>
        </div>

        {/* CMS Action Buttons */}
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>บันทึกสำเร็จ</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors min-h-[40px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกฉบับร่าง</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[40px]"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>เผยแพร่ข่าวสาร</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Desktop): Left Editor | Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Editor Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
            {/* Title (Notion-style prominent input) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                หัวข้อข่าวสาร (Title) *
              </label>
              <input
                type="text"
                placeholder="ระบุหัวข้อข่าวหรือชื่อกิจกรรม..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base sm:text-lg font-bold text-[#0F2942] placeholder:text-slate-300 px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942]"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  หมวดหมู่ข่าวสาร *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
                >
                  <option value="ประชาสัมพันธ์">ประชาสัมพันธ์</option>
                  <option value="กิจกรรม">กิจกรรม</option>
                  <option value="วิชาการ">วิชาการ</option>
                  <option value="จัดซื้อจัดจ้าง">จัดซื้อจัดจ้าง</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  สถานะการเผยแพร่ *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
                >
                  <option value="เผยแพร่แล้ว">เผยแพร่แล้ว (Published)</option>
                  <option value="ฉบับร่าง">ฉบับร่าง (Draft)</option>
                </select>
              </div>
            </div>

            {/* Cover Image Direct Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>รูปภาพหน้าปกข่าว (Cover Image)</span>
                </label>
                <span className="text-[11px] text-slate-400">อัปโหลดจากคอมฯ หรือมือถือได้ทันที ไม่ต้องฝากรูป</span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              {imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-xs">
                  <div className="aspect-[16/9] w-full max-h-56 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="ตัวอย่างรูปหน้าปก"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-2xs">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingImage}
                      className="px-3.5 py-2 rounded-xl bg-white text-slate-800 font-bold text-xs hover:bg-slate-100 shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isProcessingImage ? "กำลังประมวลผล..." : "เปลี่ยนรูปภาพ"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบรูป</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Drop Area */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-[#0F2942] mb-1">
                    คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง หรือถ่ายรูป
                  </p>
                  <p className="text-[11px] text-slate-400">
                    รองรับ JPG, PNG, WebP (ระบบปรับขนาดและบีบอัดอัตโนมัติ ไม่ต้องฝากเว็บอื่น)
                  </p>
                </div>
              )}

              {/* Direct File Browse Button + Manual URL Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isProcessingImage ? "กำลังประมวลผลรูป..." : "เลือกไฟล์จากเครื่อง / ถ่ายภาพ"}</span>
                </button>

                <div className="flex-1 max-w-xs">
                  <input
                    type="url"
                    placeholder="หรือวางลิงก์ URL..."
                    value={imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                คำโปรยหรือสรุปเนื้อหาย่อ (Excerpt)
              </label>
              <textarea
                rows={2}
                placeholder="สรุปเนื้อหาสั้นๆ 2-3 บรรทัดสำหรับแสดงในการ์ดข่าว..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] resize-none"
              />
            </div>

            {/* Rich Text Editor with Toolbar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500">
                เนื้อหาข่าวฉบับเต็ม (Full Content) *
              </label>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="ตัวหนา"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="ตัวเอียง"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("## ")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="หัวข้อย่อย H2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("### ")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="หัวข้อย่อย H3"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("- ")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="รายการหัวข้อ"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("> ")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-xs font-bold flex items-center"
                  title="ข้อความอ้างอิง"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                rows={8}
                placeholder="เขียนเนื้อหาข่าวสาร รายละเอียด วันที่ สถานที่..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] leading-relaxed"
              />
            </div>

            {/* Attachments Section */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  เอกสารแนบข่าวและลิงก์ Google Drive
                </label>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  แนะนำ: วางลิงก์ Google Drive เพื่อเปิดอ่านออนไลน์
                </span>
              </div>

              {/* Add Attachment Row */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="ชื่อเอกสาร เช่น ประกาศรับสมัคร_2568.pdf"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newAttachmentType}
                      onChange={(e) => setNewAttachmentType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none"
                    >
                      <option value="PDF">PDF (เอกสาร)</option>
                      <option value="XLSX">XLSX (Excel)</option>
                      <option value="DOCX">DOCX (Word)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="ขนาด เช่น 1.5 MB"
                      value={newAttachmentSize}
                      onChange={(e) => setNewAttachmentSize(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none"
                    >
                    </input>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="ลิงก์แชร์ Google Drive (เช่น https://drive.google.com/file/d/...)"
                    value={newAttachmentDriveUrl}
                    onChange={(e) => setNewAttachmentDriveUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-xs font-bold text-white transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มเอกสาร</span>
                  </button>
                </div>
              </div>

              {/* Attachment List */}
              <div className="space-y-2 pt-1">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        file.type === "PDF"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : file.type === "XLSX"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {file.type || "PDF"}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                      <span className="text-slate-400">({file.size})</span>
                      {file.driveUrl && (
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          มี Drive Link
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="ลบเอกสาร"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                วันที่แสดงในข่าว (Publish Date)
              </label>
              <div className="relative w-full sm:w-60">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview & SEO Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-4">
            {/* Preview Tab Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#0F2942] flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>ตัวอย่างสด (Live Preview)</span>
              </span>

              <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewTab("article")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === "article"
                      ? "bg-[#0F2942] text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  หน้าบทความ
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("card")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === "card"
                      ? "bg-[#0F2942] text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  การ์ดข่าว
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("seo")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === "seo"
                      ? "bg-[#0F2942] text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  SEO
                </button>
              </div>
            </div>

            {/* TAB 1: Article Live Preview */}
            {previewTab === "article" && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-[#E5E7EB]">
                  <img
                    src={imageUrl}
                    alt={title || "หน้าปก"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F2942] text-white inline-block">
                    {category}
                  </span>
                  <h3 className="text-base font-bold text-[#0F2942] leading-snug">
                    {title || "หัวข้อข่าวสารจะแสดงที่นี่..."}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{publishDate}</span>
                    <span>•</span>
                    <span>ผู้ดูแลระบบ</span>
                  </div>
                </div>

                {excerpt && (
                  <p className="text-xs font-medium text-slate-700 bg-[#F8FAFC] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed">
                    {excerpt}
                  </p>
                )}

                <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-100 pt-3">
                  {content || "เริ่มพิมพ์เนื้อหาในช่องด้านซ้ายเพื่อดูตัวอย่างสด..."}
                </div>

                {attachments.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      เอกสารแนบ ({attachments.length})
                    </span>
                    <div className="space-y-1">
                      {attachments.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] text-[11px]"
                        >
                          <span className="truncate">{file.name}</span>
                          <span className="text-slate-400 ml-2">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Card Live Preview */}
            {previewTab === "card" && (
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  ตัวอย่างการแสดงผลในการ์ดหน้ารวมข่าว
                </span>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden max-w-sm mx-auto">
                  <div className="aspect-[16/10] bg-slate-100 relative">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F2942] text-white">
                      {category}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {publishDate}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0F2942] line-clamp-2">
                      {title || "หัวข้อข่าวสาร..."}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {excerpt || "คำโปรยข่าวสั้น..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SEO Summary */}
            {previewTab === "seo" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    ตัวอย่างในผลการค้นหา Google (Search Snippet)
                  </span>
                  <span className="text-blue-700 font-semibold text-sm hover:underline block truncate">
                    {title || "หัวข้อข่าวสาร"} | โรงเรียนบ้านหนองหัวหมู
                  </span>
                  <span className="text-emerald-700 text-[11px] block">
                    https://nonghuamu.ac.th/news/...
                  </span>
                  <p className="text-slate-600 text-[11px] line-clamp-2">
                    {excerpt || content?.slice(0, 150) || "คำอธิบายเนื้อหาจะปรากฏที่นี่..."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">ความยาวชื่อเรื่อง</span>
                    <span className="font-bold text-slate-800">
                      {title.length} ตัวอักษร
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">ความยาวคำโปรย</span>
                    <span className="font-bold text-slate-800">
                      {excerpt.length} ตัวอักษร
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
