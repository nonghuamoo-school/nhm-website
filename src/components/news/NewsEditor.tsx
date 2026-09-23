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
  Share2,
  Loader2,
  Images,
  X as CloseIcon
} from "lucide-react";
import { NewsItem } from "@/types";
import { useNews, toIsoDate, formatThaiDate } from "@/hooks/useNews";
import Swal from "sweetalert2";

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
  const [facebookUrl, setFacebookUrl] = useState(initialData?.facebookUrl || "");
  const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialData?.galleryImages || []
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");

  // Date selection states (ISO for calendar picker, Thai string for display)
  const initialIso = initialData?.date
    ? toIsoDate(initialData.date)
    : new Date().toISOString().split("T")[0];

  const initialThai = initialData?.date
    ? formatThaiDate(initialData.date)
    : formatThaiDate(initialIso);

  const [publishIsoDate, setPublishIsoDate] = useState<string>(initialIso);
  const [publishDate, setPublishDate] = useState<string>(initialThai);

  const handleDateChange = (isoVal: string) => {
    if (!isoVal) return;
    setPublishIsoDate(isoVal);
    const thaiStr = formatThaiDate(isoVal);
    setPublishDate(thaiStr);
  };

  const handleSetPreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const iso = d.toISOString().split("T")[0];
    handleDateChange(iso);
  };

  const handleSetYearPreset = (thaiYear: number) => {
    const ceYear = thaiYear - 543;
    const baseDate = publishIsoDate ? new Date(publishIsoDate) : new Date();
    baseDate.setFullYear(ceYear);
    const iso = baseDate.toISOString().split("T")[0];
    handleDateChange(iso);
  };

  const handleManualThaiDateChange = (val: string) => {
    setPublishDate(val);
    const iso = toIsoDate(val);
    if (iso) setPublishIsoDate(iso);
  };

  const [status, setStatus] = useState<"เผยแพร่แล้ว" | "ฉบับร่าง">(
    initialData?.status || "เผยแพร่แล้ว"
  );
  const [attachments, setAttachments] = useState<
    { name: string; size: string; url: string; driveUrl?: string; type?: "PDF" | "XLSX" | "DOCX" | "LINK" | "IMAGE" }[]
  >(initialData?.attachments || []);

  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentSize, setNewAttachmentSize] = useState("1.2 MB");
  const [newAttachmentType, setNewAttachmentType] = useState<"PDF" | "XLSX" | "DOCX" | "LINK" | "IMAGE">("PDF");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");
  const [newAttachmentDriveUrl, setNewAttachmentDriveUrl] = useState("");

  const [previewTab, setPreviewTab] = useState<"article" | "card" | "seo">("article");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingGallery, setIsProcessingGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Compress image helper (target < 120KB WebP/JPEG)
  const compressImageFile = (file: File, maxDimension = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

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
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Cover image upload
  const handleCoverFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)");
      return;
    }
    setIsProcessingImage(true);
    try {
      const dataUrl = await compressImageFile(file, 1280);
      setImageUrl(dataUrl);
    } catch (err) {
      console.error("Error processing cover image:", err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Gallery multi-image upload
  const handleGalleryFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingGallery(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const dataUrl = await compressImageFile(file, 1000);
          newImages.push(dataUrl);
        }
      }
      if (newImages.length > 0) {
        setGalleryImages((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error("Error processing gallery images:", err);
    } finally {
      setIsProcessingGallery(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages((prev) => [...prev, newGalleryUrl.trim()]);
      setNewGalleryUrl("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
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
          url: newAttachmentUrl.trim() || newAttachmentDriveUrl.trim() || "#",
          type: newAttachmentType,
          driveUrl: newAttachmentDriveUrl.trim() || undefined,
        },
      ]);
      setNewAttachmentName("");
      setNewAttachmentUrl("");
      setNewAttachmentDriveUrl("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const saveCurrentNews = async (newStatus: "เผยแพร่แล้ว" | "ฉบับร่าง") => {
    const newsPayload: Omit<NewsItem, "id"> & { id?: string } = {
      title: title.trim() || "ข่าวประชาสัมพันธ์",
      category,
      imageUrl: imageUrl || "/images/school-emblem-doc.png",
      galleryImages: galleryImages.filter(Boolean),
      facebookUrl: facebookUrl.trim() || undefined,
      externalUrl: externalUrl.trim() || undefined,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || title.trim(),
      date: publishDate.trim() || "23 ก.ย. 2568",
      author: "งานประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู",
      status: newStatus,
      attachments,
      views: initialData?.views || 1,
      slug: initialData?.slug || `news-${Date.now()}`,
    };

    if (isEditMode && initialData?.id) {
      await updateNews(initialData.id, newsPayload);
    } else {
      await addNews(newsPayload);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      setStatus("ฉบับร่าง");
      await saveCurrentNews("ฉบับร่าง");
      setSaveSuccess(true);
      await Swal.fire({
        icon: "success",
        title: "บันทึกฉบับร่างสำเร็จ",
        text: "ข่าวได้รับการบันทึกเป็นฉบับร่างและเชื่อมต่อระบบเรียบร้อยแล้ว",
        timer: 1600,
        showConfirmButton: false,
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Draft save error:", err);
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุหัวข้อข่าว",
        text: "กรุณาใส่หัวข้อข่าวสารก่อนทำการเผยแพร่",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      setStatus("เผยแพร่แล้ว");
      await saveCurrentNews("เผยแพร่แล้ว");
      setSaveSuccess(true);
      await Swal.fire({
        icon: "success",
        title: "เผยแพร่ข่าวสำเร็จ!",
        text: "ข่าวสารได้รับการบันทึกและซิงค์ข้อมูล Realtime เรียบร้อยแล้ว",
        timer: 1600,
        showConfirmButton: false,
      });
      router.push("/admin/news");
    } catch (err) {
      console.error("Publish error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเผยแพร่ข่าวได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors min-h-[40px] disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "กำลังบันทึก..." : "บันทึกฉบับร่าง"}</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[40px] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Send className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSubmitting ? "กำลังเผยแพร่..." : "เผยแพร่ข่าวสาร"}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Desktop): Left Editor | Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Editor Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
            {/* Title */}
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

            {/* SECTION 1: Cover Image Direct Upload */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>รูปภาพหน้าปกหลัก (Cover Image)</span>
                </label>
                <span className="text-[11px] text-slate-400">รูปภาพขนาดใหญ่ด้านบนสุดของข่าว</span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverFileUpload(file);
                }}
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-[#0F2942] mb-1">
                    คลิกเพื่อเลือกไฟล์รูปหน้าปกจากเครื่อง หรือถ่ายรูป
                  </p>
                  <p className="text-[11px] text-slate-400">
                    รองรับ JPG, PNG, WebP (ระบบปรับขนาดและบีบอัดอัตโนมัติ)
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
                    placeholder="หรือวางลิงก์รูปภาพ URL..."
                    value={imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: DEDICATED FACEBOOK POST LINK */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/60 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F2942]">
                      แนบลิงก์โพสต์ Facebook ของโรงเรียน
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      ระบบจะสร้างปุ่ม "เปิดดูโพสต์บน Facebook" บนหน้าข่าวให้อัตโนมัติ
                    </p>
                  </div>
                </div>

                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-[#1877F2] hover:bg-blue-50 text-[11px] font-bold border border-blue-200 transition-colors shadow-2xs"
                  >
                    <span>เปิดทดสอบลิงก์</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  type="url"
                  placeholder="วางลิงก์โพสต์ Facebook เช่น https://www.facebook.com/nonghuamooschool/posts/..."
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                />
              </div>

              {facebookUrl && (
                <div className="text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เชื่อมโยงโพสต์ Facebook สำเร็จ ลิงก์จะถูกบันทึกและแสดงบนเว็บไซต์</span>
                </div>
              )}
            </div>

            {/* SECTION 3: PHOTO GALLERY (คลังรูปภาพกิจกรรมเพิ่มเติม) */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Images className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F2942] flex items-center gap-2">
                      <span>รูปภาพกิจกรรมและบรรยากาศเพิ่มเติม (Photo Gallery)</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                        {galleryImages.length} รูป
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      แนบภาพบรรยากาศหลายๆ รูป เพื่อให้ผู้ปกครองและนักเรียนคลิกดูรูปขนาดเต็มได้
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden Gallery File Input */}
              <input
                type="file"
                ref={galleryInputRef}
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleGalleryFilesUpload(e.target.files)}
                className="hidden"
              />

              {/* Gallery Upload Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isProcessingGallery}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isProcessingGallery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isProcessingGallery ? "กำลังประมวลผลรูปภาพ..." : "เพิ่มภาพจากเครื่อง (เลือกได้หลายรูป)"}</span>
                </button>

                <div className="flex-1 flex items-center gap-1 min-w-[200px]">
                  <input
                    type="url"
                    placeholder="หรือวางลิงก์รูปภาพ URL..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                  >
                    เพิ่มรูป
                  </button>
                </div>
              </div>

              {/* Gallery Thumbnails Grid */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 group shadow-2xs"
                    >
                      <img
                        src={img}
                        alt={`ภาพกิจกรรมที่ ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                        title="ลบรูปนี้"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-2xs">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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

            {/* SECTION 4: ATTACHMENTS & DOWNLOADS */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  เอกสารดาวน์โหลดแนบข่าว (PDF, Word, Excel, ลิงก์)
                </label>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  รองรับเอกสารระเบียบการ / ประกาศ
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
                      <option value="LINK">LINK (ลิงก์ทั่วไป)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="ขนาด เช่น 1.5 MB"
                      value={newAttachmentSize}
                      onChange={(e) => setNewAttachmentSize(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    placeholder="ลิงก์ไฟล์ หรือ Google Drive (เช่น https://drive.google.com/...)"
                    value={newAttachmentDriveUrl}
                    onChange={(e) => setNewAttachmentDriveUrl(e.target.value)}
                    className="w-full sm:flex-1 text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1 shrink-0"
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

            {/* Publish Date Picker & Historic Date Selection */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>กำหนดวันที่เผยแพร่ข่าว (เลือกล่วงหน้า / ทำย้อนหลังได้)</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  ระบบแปลงเป็นวัน-เดือน-ปี พ.ศ. ให้อัตโนมัติ
                </span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/90 space-y-3">
                {/* Visual Display + Native Calendar Picker Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-0.5">
                      วันที่แสดงผลบนเว็บไซต์ (ปฏิทินไทย พ.ศ.)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#0F2942]">
                        {publishDate}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {publishIsoDate}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Calendar Picker */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-600 shrink-0">
                      เลือกจากปฏิทิน:
                    </label>
                    <input
                      type="date"
                      value={publishIsoDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="text-xs font-bold px-3 py-2 rounded-xl border border-blue-300 bg-blue-50/70 text-[#0F2942] hover:bg-blue-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs transition-colors"
                      title="คลิกเพื่อเปิดปฏิทินเลือกวันที่"
                    />
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-0.5">ปุ่มลัด:</span>
                  <button
                    type="button"
                    onClick={() => handleSetPreset(0)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                  >
                    วันนี้ (2569)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset(-1)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                  >
                    เมื่อวาน
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset(-7)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                  >
                    7 วันก่อน
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset(-30)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                  >
                    1 เดือนก่อน
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetYearPreset(2568)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors shadow-2xs"
                    title="เลื่อนวันที่ไปปีการศึกษา 2568 ย้อนหลัง"
                  >
                    ย้อนหลังปี 2568
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetYearPreset(2567)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors shadow-2xs"
                    title="เลื่อนวันที่ไปปีการศึกษา 2567 ย้อนหลัง"
                  >
                    ย้อนหลังปี 2567
                  </button>
                </div>

                {/* Fine-tune Text Input */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 shrink-0">แก้ไขข้อความวันที่เอง:</span>
                  <input
                    type="text"
                    value={publishDate}
                    onChange={(e) => handleManualThaiDateChange(e.target.value)}
                    placeholder="เช่น 23 ก.ย. 2569"
                    className="flex-1 max-w-xs text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
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
              <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                {/* Cover Image */}
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-[#E5E7EB]">
                  <img
                    src={imageUrl || "/images/school-emblem-doc.png"}
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

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-xs font-medium text-slate-700 bg-[#F8FAFC] p-3 rounded-xl border border-[#E5E7EB] leading-relaxed">
                    {excerpt}
                  </p>
                )}

                {/* Body Content */}
                <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-100 pt-3">
                  {content || "เริ่มพิมพ์เนื้อหาในช่องด้านซ้ายเพื่อดูตัวอย่างสด..."}
                </div>

                {/* Facebook Post Button Preview */}
                {facebookUrl && (
                  <div className="pt-2">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-bold">
                          f
                        </div>
                        <span className="text-[11px] font-bold text-[#0F2942]">
                          ดูโพสต์และภาพเพิ่มเติมบน Facebook
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#1877F2]" />
                    </div>
                  </div>
                )}

                {/* Gallery Preview */}
                {galleryImages.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      คลังรูปภาพกิจกรรม ({galleryImages.length} ภาพ)
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {galleryImages.slice(0, 6).map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={img} alt="ภาพย่อ" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
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
                      src={imageUrl || "/images/school-emblem-doc.png"}
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
                    https://nhm-website-two.vercel.app/news/...
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
