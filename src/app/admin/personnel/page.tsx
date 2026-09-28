"use client";

import React, { useState, useRef } from "react";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Upload,
  Camera,
  Loader2
} from "lucide-react";
import { usePersonnel } from "@/hooks/usePersonnel";
import { PersonnelMember } from "@/types";
import Swal from "sweetalert2";
import { compressImageFile } from "@/utils/imageCompressor";

const DEPARTMENT_OPTIONS = [
  "ฝ่ายบริหารสถานศึกษา",
  "ฝ่ายบริหารวิชาการ",
  "ฝ่ายบริหารงานบุคคล",
  "ฝ่ายบริหารงบประมาณ",
  "ฝ่ายบริหารทั่วไป",
  "กลุ่มสาระการเรียนรู้ภาษาไทย",
  "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
  "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
  "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ",
  "กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม",
  "กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา",
  "กลุ่มสาระการเรียนรู้ศิลปะ",
  "กลุ่มสาระการเรียนรู้การงานอาชีพ",
  "ระดับการศึกษาปฐมวัย",
  "ฝ่ายสนับสนุนการศึกษา / เจ้าหน้าที่"
];

const PRESET_AVATARS = [
  { label: "ครูชาย 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { label: "ครูชาย 2", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { label: "ครูหญิง 1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
  { label: "ครูหญิง 2", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { label: "ครูหญิง 3", url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400" },
  { label: "ผู้อำนวยการ", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
];

export default function AdminPersonnelPage() {
  const {
    personnelList,
    isLoaded,
    addMember,
    updateMember,
    deleteMember,
    moveUp,
    moveDown,
    resetToDefault
  } = usePersonnel();

  const [searchWord, setSearchWord] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("ทั้งหมด");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    position: string;
    department: string;
    subjectGroup: string;
    imageUrl: string;
    order: number;
    roles: string[];
  }>({
    name: "",
    position: "",
    department: DEPARTMENT_OPTIONS[0],
    subjectGroup: "",
    imageUrl: PRESET_AVATARS[0].url,
    order: 1,
    roles: []
  });

  const [newRoleInput, setNewRoleInput] = useState("");

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<PersonnelMember | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAvatar(true);
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      showToast("อัปโหลดและปรับขนาดรูปถ่ายเรียบร้อย");
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการโหลดรูปภาพ",
        text: err?.message || "กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#1E3A5F",
      });
    } finally {
      setIsProcessingAvatar(false);
      e.target.value = "";
    }
  };

  // Direct Row-level instant photo upload (no modal needed!)
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null);
  const rowFileInputRef = useRef<HTMLInputElement>(null);

  const triggerRowUpload = (memberId: string) => {
    setUploadingMemberId(memberId);
    rowFileInputRef.current?.click();
  };

  const handleRowFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingMemberId) return;

    const target = personnelList.find((p) => p.id === uploadingMemberId);
    try {
      const dataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      await updateMember(uploadingMemberId, { imageUrl: dataUrl });
      showToast(`อัปโหลดและบันทึกรูปถ่ายของ "${target?.name || 'บุคลากร'}" เรียบร้อยแล้ว`);
      await Swal.fire({
        icon: "success",
        title: "เปลี่ยนรูปถ่ายสำเร็จ!",
        text: `บันทึกรูปถ่ายใหม่ของ "${target?.name || 'บุคลากร'}" เรียบร้อยแล้ว`,
        confirmButtonColor: "#1E3A5F",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error("Row avatar upload error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการโหลดรูปภาพ",
        text: err?.message || "กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#1E3A5F",
      });
    } finally {
      e.target.value = "";
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      position: "ครูผู้สอน",
      department: "กลุ่มสาระการเรียนรู้ภาษาไทย",
      subjectGroup: "กลุ่มสาระการเรียนรู้ภาษาไทย",
      imageUrl: PRESET_AVATARS[0].url,
      order: personnelList.length + 1,
      roles: ["ครูผู้สอน"]
    });
    setNewRoleInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: PersonnelMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      department: member.department,
      subjectGroup: member.subjectGroup || member.department,
      imageUrl: member.imageUrl,
      order: member.order,
      roles: member.roles && member.roles.length > 0 ? [...member.roles] : [member.position]
    });
    setNewRoleInput("");
    setIsModalOpen(true);
  };

  const handleAddRole = () => {
    const trimmed = newRoleInput.trim();
    if (trimmed && !formData.roles.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, trimmed]
      }));
      setNewRoleInput("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r !== roleToRemove)
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    setIsSaving(true);
    try {
      const rolesToSave = formData.roles.length > 0 ? formData.roles : [formData.position];
      const mainPos = formData.position.trim() || rolesToSave[0] || "ครูผู้สอน";

      if (editingId) {
        await updateMember(editingId, {
          name: formData.name.trim(),
          position: mainPos,
          department: formData.department,
          subjectGroup: formData.subjectGroup.trim() || formData.department,
          imageUrl: formData.imageUrl.trim() || PRESET_AVATARS[0].url,
          order: Number(formData.order) || 1,
          roles: rolesToSave
        });
        await Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          text: `บันทึกการแก้ไขข้อมูล "${formData.name}" เรียบร้อยแล้ว`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await addMember({
          name: formData.name.trim(),
          position: mainPos,
          department: formData.department,
          subjectGroup: formData.subjectGroup.trim() || formData.department,
          imageUrl: formData.imageUrl.trim() || PRESET_AVATARS[0].url,
          order: Number(formData.order) || personnelList.length + 1,
          roles: rolesToSave
        });
        await Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          text: `เพิ่มข้อมูลบุคลากร "${formData.name}" เรียบร้อยแล้ว`,
          timer: 1800,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save personnel error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึก",
        text: "กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#1E3A5F",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTarget) {
      deleteMember(deleteConfirmTarget.id);
      showToast(`ลบข้อมูล "${deleteConfirmTarget.name}" เรียบร้อยแล้ว`);
      setDeleteConfirmTarget(null);
    }
  };

  const handleResetConfirm = () => {
    resetToDefault();
    showToast("รีเซ็ตข้อมูลบุคลากรเป็นค่าเริ่มต้นโรงเรียนบ้านหนองหัวหมูเรียบร้อยแล้ว");
    setShowResetConfirm(false);
  };

  // Filter list while maintaining overall sorted order
  const filtered = personnelList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchWord.toLowerCase()) ||
      p.position.toLowerCase().includes(searchWord.toLowerCase()) ||
      (p.roles && p.roles.some((r) => r.toLowerCase().includes(searchWord.toLowerCase())));
    const matchesDept =
      selectedDeptFilter === "ทั้งหมด" ||
      p.department === selectedDeptFilter ||
      p.subjectGroup === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Input for 1-Click Row Upload */}
      <input
        type="file"
        ref={rowFileInputRef}
        onChange={handleRowFileSelected}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E3A5F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#D96B34]/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#D96B34] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="glass-card-admin rounded-3xl p-6 border border-[#D1DFF0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D96B34] uppercase tracking-wide">
              ระบบบริหารงานบุคคลสถานศึกษา
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              บันทึกจริง Real-time
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] mt-1">
            จัดการทำเนียบบุคลากร ({personnelList.length} ท่าน)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เพิ่ม ลบ แก้ไข และกดปุ่มเลื่อนขึ้น-ลง เพื่อจัดเรียงลำดับครูตามอายุหรืออาวุโสได้ทันที
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D1DFF0] hover:bg-[#EAF2FB]/50 text-slate-700 font-bold text-xs transition-colors min-h-[44px]"
            title="รีเซ็ตเป็น 12 รายชื่อตั้งต้น"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">รีเซ็ตเริ่มต้น</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>เพิ่มบุคลากรใหม่</span>
          </button>
        </div>
      </div>

      {/* Seniority / Reordering Guide Banner */}
      <div className="bg-[#EAF2FB]/80 border border-[#D1DFF0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#1E3A5F]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-[#D96B34]" />
          </div>
          <div>
            <span className="font-bold text-[#1E3A5F]">ฟังก์ชันจัดเรียงลำดับตามอายุ / อาวุโส:</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              กดปุ่ม <span className="font-bold text-[#2F6FED] bg-white px-1.5 py-0.5 rounded border border-[#D1DFF0]">▲ เลื่อนขึ้น</span> เพื่อให้ครูผู้ใหญ่อยู่ลำดับบน หรือกด <span className="font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-[#D1DFF0]">▼ เลื่อนลง</span> ระบบจะจัดลำดับและแสดงผลตามนี้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card-admin rounded-2xl p-4 sm:p-5 border border-[#D1DFF0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, ตำแหน่ง, บทบาทหน้าที่..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">กลุ่มงาน/ฝ่าย:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-white/80 border border-[#D1DFF0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 text-[#1E3A5F]"
          >
            <option value="ทั้งหมด">ทั้งหมด ({personnelList.length})</option>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Personnel Table (Desktop / Tablet >= sm) */}
      <div className="hidden sm:block glass-card-admin rounded-2xl border border-[#D1DFF0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F8FD] border-b border-[#E6EEF8] text-[#1E3A5F] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-3 sm:px-4 w-28 text-center">ลำดับ / สลับที่</th>
                <th className="py-3.5 px-4 sm:px-6">บุคลากร</th>
                <th className="py-3.5 px-4">ตำแหน่งและหน้าที่รับผิดชอบ (หลายตำแหน่ง)</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">กลุ่มสาระ / ฝ่ายงาน</th>
                <th className="py-3.5 px-4 sm:px-6 text-right w-32">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1DFF0]/50">
              {filtered.map((p, idx) => {
                // Find true index in complete personnelList
                const globalIndex = personnelList.findIndex((item) => item.id === p.id);
                const isFirst = globalIndex === 0;
                const isLast = globalIndex === personnelList.length - 1;

                return (
                  <tr key={p.id} className="hover:bg-[#EAF2FB]/40 transition-colors">
                    {/* Reorder column with Up & Down buttons */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Order Number Badge */}
                        <span className="w-7 h-7 rounded-xl bg-[#EAF2FB] font-black text-xs text-[#1E3A5F] flex items-center justify-center border border-[#D1DFF0] shadow-2xs">
                          {p.order || idx + 1}
                        </span>

                        {/* Move Up / Move Down Arrow Buttons */}
                        <div className="flex items-center gap-0.5 bg-[#EAF2FB]/70 p-0.5 rounded-lg border border-[#D1DFF0]">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => {
                              moveUp(p.id);
                              showToast(`เลื่อน "${p.name}" ขึ้นแล้ว`);
                            }}
                            className={`p-1.5 rounded-md transition-all ${
                              isFirst
                                ? "text-slate-300 cursor-not-allowed opacity-40"
                                : "text-[#2F6FED] hover:bg-[#2F6FED] hover:text-white active:scale-95"
                            }`}
                            title={isFirst ? "อยู่ที่ลำดับบนสุดแล้ว" : `เลื่อน "${p.name}" ขึ้นด้านบน`}
                          >
                            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => {
                              moveDown(p.id);
                              showToast(`เลื่อน "${p.name}" ลงแล้ว`);
                            }}
                            className={`p-1.5 rounded-md transition-all ${
                              isLast
                                ? "text-slate-300 cursor-not-allowed opacity-40"
                                : "text-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
                            }`}
                            title={isLast ? "อยู่ที่ลำดับล่างสุดแล้ว" : `เลื่อน "${p.name}" ลงด้านล่าง`}
                          >
                            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Personnel Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {/* Clickable Avatar to Upload */}
                        <div
                          onClick={() => triggerRowUpload(p.id)}
                          className="w-12 h-14 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0 shadow-xs relative group cursor-pointer hover:border-blue-600 transition-all"
                          title="คลิกเพื่ออัปโหลด/เปลี่ยนรูปถ่ายครูท่านนี้"
                        >
                          {p.imageUrl && !p.imageUrl.includes("school-emblem-doc") ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-50/70 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center p-1 text-blue-600 group-hover:bg-blue-100/70 transition-colors">
                              <Camera className="w-4 h-4 text-blue-600" />
                              <span className="text-[9px] font-bold mt-0.5">+รูป</span>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-sm text-[#1E3A5F]">{p.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {p.position}
                          </div>
                          {/* 1-click Upload / Change Photo Button */}
                          <button
                            type="button"
                            onClick={() => triggerRowUpload(p.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-md bg-[#EAF2FB] hover:bg-[#D1DFF0]/60 text-[#2F6FED] font-bold text-[10.5px] border border-[#D1DFF0] transition-colors shadow-2xs cursor-pointer"
                          >
                            <Camera className="w-3 h-3 text-[#2F6FED]" />
                            <span>
                              {p.imageUrl && !p.imageUrl.includes("school-emblem-doc")
                                ? "เปลี่ยนรูป"
                                : "อัปโหลดรูปถ่าย"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Roles Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-lg">
                        {p.roles && p.roles.length > 0 ? (
                          p.roles.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className={`inline-block px-2.5 py-1 rounded-lg text-[11px] leading-relaxed break-words thai-wrap font-semibold ${
                                rIdx === 0
                                  ? "bg-[#1E3A5F] text-white shadow-2xs"
                                  : "bg-[#EAF2FB] text-[#1E3A5F] border border-[#D1DFF0]"
                              }`}
                            >
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#1E3A5F] font-semibold bg-[#EAF2FB] px-2.5 py-1 rounded-lg border border-[#D1DFF0] inline-block">{p.position}</span>
                        )}
                      </div>
                    </td>

                    {/* Department / Subject Group */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-600 font-medium">
                      {p.subjectGroup || p.department}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl text-slate-600 hover:text-[#2F6FED] hover:bg-[#EAF2FB] transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(p)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    ไม่พบข้อมูลบุคลากรที่ตรงกับคำค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE VIEW (< sm): COMPACT CARDS ================= */}
      <div className="sm:hidden space-y-2.5">
        {filtered.map((p, idx) => {
          const globalIndex = personnelList.findIndex((item) => item.id === p.id);
          const isFirst = globalIndex === 0;
          const isLast = globalIndex === personnelList.length - 1;

          return (
            <div
              key={p.id}
              className="glass-card-admin p-3 rounded-2xl border border-[#D1DFF0] shadow-xs space-y-2"
            >
              {/* Top Row: Circular Avatar with camera badge + Name/Group + Reorder & Action buttons */}
              <div className="flex items-center justify-between gap-2">
                {/* Avatar + Name Info */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Circular Avatar with Camera overlay badge */}
                  <div
                    onClick={() => triggerRowUpload(p.id)}
                    className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 cursor-pointer bg-slate-100 group"
                    title="แตะเพื่อเปลี่ยนรูปถ่าย"
                  >
                    {p.imageUrl && !p.imageUrl.includes("school-emblem-doc") ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#EBF2FF] flex items-center justify-center text-[#2F6FED]">
                        <Camera className="w-5 h-5 text-[#2F6FED]" />
                      </div>
                    )}
                    {/* Camera icon badge overlay */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center shadow-xs">
                      <Camera className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Name, Order & Group */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-[#EAF2FB] text-[10px] font-black text-[#1E3A5F] flex items-center justify-center shrink-0 border border-[#D1DFF0]">
                        {p.order || idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-[#1E3A5F] truncate">
                        {p.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.subjectGroup || p.department}
                    </p>
                  </div>
                </div>

                {/* Reorder Buttons (>=40x40px) + Edit/Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex items-center bg-[#EAF2FB]/80 p-0.5 rounded-xl border border-[#D1DFF0]">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => {
                        moveUp(p.id);
                        showToast(`เลื่อน "${p.name}" ขึ้นแล้ว`);
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isFirst
                          ? "text-slate-300 opacity-40 cursor-not-allowed"
                          : "text-[#2F6FED] hover:bg-[#2F6FED] hover:text-white active:scale-95"
                      }`}
                      title={isFirst ? "บนสุดแล้ว" : "เลื่อนขึ้น"}
                    >
                      <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => {
                        moveDown(p.id);
                        showToast(`เลื่อน "${p.name}" ลงแล้ว`);
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isLast
                          ? "text-slate-300 opacity-40 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
                      }`}
                      title={isLast ? "ล่างสุดแล้ว" : "เลื่อนลง"}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#2F6FED] hover:bg-[#EAF2FB] active:scale-95 transition-colors border border-[#D1DFF0]/60 bg-white/60"
                    title="แก้ไข"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmTarget(p)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-colors border border-[#D1DFF0]/60 bg-white/60"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Position Badges wrapped cleanly with strict White-Navy palette */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#D1DFF0]/60">
                {p.roles && p.roles.length > 0 ? (
                  p.roles.map((r, rIdx) => (
                    <span
                      key={rIdx}
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-[10.5px] leading-tight font-semibold ${
                        rIdx === 0
                          ? "bg-[#1E3A5F] text-white shadow-2xs"
                          : "bg-[#EBF2FF] text-[#1E3A5F] border border-[#2F6FED]/25"
                      }`}
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="bg-[#1E3A5F] text-white px-2.5 py-0.5 rounded-lg text-[10.5px] font-semibold shadow-2xs">
                    {p.position}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 glass-card-admin rounded-2xl border border-[#D1DFF0] text-slate-400 text-xs">
            ไม่พบข้อมูลบุคลากรที่ตรงกับคำค้นหา
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT PERSONNEL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F2540]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card-admin bg-white/95 backdrop-blur-md rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D1DFF0] my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#D1DFF0] pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-[#D96B34] uppercase">
                  {editingId ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มบุคลากรใหม่"}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#1E3A5F]">
                  {editingId ? formData.name || "แก้ไขบุคลากร" : "บันทึกข้อมูลครูและบุคลากร"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-[#EAF2FB] hover:text-[#1E3A5F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อ - นามสกุล (พร้อมคำนำหน้า)*
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายอดุลย์ วิกุล, นางสาวอรทัย วงศ์จันทร์"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Main Position */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่งหลัก*
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู, ครูผู้สอน, ครูชำนาญการพิเศษ"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1DFF0] bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
              </div>

              {/* Multiple Roles */}
              <div className="bg-[#EAF2FB]/50 p-3.5 rounded-2xl border border-[#D1DFF0]">
                <label className="block text-xs font-bold text-[#1E3A5F] mb-1">
                  หน้าที่และบทบาทที่ได้รับมอบหมาย (ใส่ได้หลายตำแหน่ง)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  เช่น หัวหน้าฝ่ายบริหารวิชาการ, หัวหน้ากลุ่มสาระฯ ภาษาต่างประเทศ, ครูประจำชั้น
                </p>

                {/* Role tags */}
                <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[30px]">
                  {formData.roles.map((r, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#EAF2FB] text-[#1E3A5F] border border-[#D1DFF0] shadow-2xs"
                    >
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(r)}
                        className="text-slate-400 hover:text-red-600"
                        title="ลบตำแหน่งนี้"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add role input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อตำแหน่ง เช่น หัวหน้าฝ่ายบริหารวิชาการ..."
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRole();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3.5 py-2 bg-[#2F6FED] hover:bg-[#255bc4] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0"
                  >
                    + เพิ่มตำแหน่ง
                  </button>
                </div>
              </div>

              {/* Department / Subject Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ฝ่ายงานหลัก
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มสาระการเรียนรู้ / กลุ่มงาน
                  </label>
                  <select
                    value={formData.subjectGroup}
                    onChange={(e) => setFormData({ ...formData, subjectGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20"
                  >
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    รูปถ่ายบุคลากร
                  </label>
                  <span className="text-[11px] text-slate-400">อัปโหลดจากเครื่องได้โดยตรง ไม่ต้องฝากรูป</span>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-slate-100 border-2 border-[#D1DFF0] shrink-0 shadow-xs relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0F2540]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isProcessingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2FB] hover:bg-[#D1DFF0]/60 text-[#2F6FED] font-bold text-xs transition-colors border border-[#D1DFF0]"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#2F6FED]" />
                      <span>{isProcessingAvatar ? "กำลังประมวลผลรูป..." : "เลือกรูปถ่ายจากเครื่อง"}</span>
                    </button>
                    <input
                      type="url"
                      placeholder="หรือใส่ URL รูปภาพ..."
                      value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-[#D1DFF0] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#2F6FED]"
                    />
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-[11px] text-slate-400 shrink-0">เลือกรูปตัวอย่าง:</span>
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: av.url })}
                      className={`w-7 h-8 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${
                        formData.imageUrl === av.url ? "border-[#2F6FED] scale-105" : "border-[#D1DFF0]"
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Number (ลำดับตามอายุ / อาวุโส) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ลำดับการแสดงผลในหน้าเว็บ (เรียงตามอายุ / อาวุโส)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-28 px-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 font-bold"
                />
                <span className="text-[11px] text-slate-400 ml-2">
                  (หรือสามารถกดปุ่ม ▲ เลื่อนขึ้น-ลง ได้ทันทีที่ตาราง)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D1DFF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D1DFF0] text-slate-600 hover:bg-[#EAF2FB] text-xs font-bold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                  <span>{isSaving ? "กำลังบันทึก..." : (editingId ? "บันทึกการแก้ไข" : "บันทึกบุคลากรใหม่")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRM ================= */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-[#0F2540]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card-admin bg-white/95 backdrop-blur-md rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#D1DFF0] text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E3A5F] mb-1">
              ยืนยันการลบข้อมูลบุคลากร?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              คุณต้องการลบข้อมูล <strong>{deleteConfirmTarget.name}</strong> ออกจากทำเนียบบุคลากรหรือไม่?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D1DFF0] text-slate-600 hover:bg-[#EAF2FB] text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                ลบข้อมูลทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET CONFIRM ================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-[#0F2540]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card-admin bg-white/95 backdrop-blur-md rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#D1DFF0] text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-[#EAF2FB] text-[#D96B34] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D1DFF0]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E3A5F] mb-1">
              ยืนยันรีเซ็ตข้อมูลเป็นค่าเริ่มต้น?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              ระบบจะคืนค่ารายชื่อบุคลากรทั้ง 12 ท่านตามข้อมูลทางการของโรงเรียนบ้านหนองหัวหมู
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-[#D1DFF0] text-slate-600 hover:bg-[#EAF2FB] text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-5 py-2.5 rounded-xl bg-[#D96B34] hover:bg-[#c45a25] text-white text-xs font-bold shadow-xs transition-colors"
              >
                ยืนยันการรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
