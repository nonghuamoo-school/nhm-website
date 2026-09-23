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
  Camera
} from "lucide-react";
import { usePersonnel } from "@/hooks/usePersonnel";
import { PersonnelMember } from "@/types";

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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    setIsProcessingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDimension = 800;

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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: event.target?.result as string }));
        }
        setIsProcessingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    const rolesToSave = formData.roles.length > 0 ? formData.roles : [formData.position];
    const mainPos = formData.position.trim() || rolesToSave[0] || "ครูผู้สอน";

    if (editingId) {
      updateMember(editingId, {
        name: formData.name.trim(),
        position: mainPos,
        department: formData.department,
        subjectGroup: formData.subjectGroup.trim() || formData.department,
        imageUrl: formData.imageUrl.trim() || PRESET_AVATARS[0].url,
        order: Number(formData.order) || 1,
        roles: rolesToSave
      });
      showToast(`แก้ไขข้อมูล "${formData.name}" เรียบร้อยแล้ว`);
    } else {
      addMember({
        name: formData.name.trim(),
        position: mainPos,
        department: formData.department,
        subjectGroup: formData.subjectGroup.trim() || formData.department,
        imageUrl: formData.imageUrl.trim() || PRESET_AVATARS[0].url,
        order: Number(formData.order) || personnelList.length + 1,
        roles: rolesToSave
      });
      showToast(`เพิ่มข้อมูลบุคลากร "${formData.name}" เรียบร้อยแล้ว`);
    }

    setIsModalOpen(false);
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
              ระบบบริหารงานบุคคลสถานศึกษา
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              บันทึกจริง Real-time
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] mt-1">
            จัดการทำเนียบบุคลากร ({personnelList.length} ท่าน)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เพิ่ม ลบ แก้ไข และกดปุ่มเลื่อนขึ้น-ลง เพื่อจัดเรียงลำดับครูตามอายุหรืออาวุโสได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors min-h-[44px]"
            title="รีเซ็ตเป็น 12 รายชื่อตั้งต้น"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">รีเซ็ตเริ่มต้น</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>เพิ่มบุคลากรใหม่</span>
          </button>
        </div>
      </div>

      {/* Seniority / Reordering Guide Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#0F2942]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-blue-900">ฟังก์ชันจัดเรียงลำดับตามอายุ / อาวุโส:</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              กดปุ่ม <span className="font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-300">▲ เลื่อนขึ้น</span> เพื่อให้ครูผู้ใหญ่อยู่ลำดับบน หรือกด <span className="font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-300">▼ เลื่อนลง</span> ระบบจะจัดลำดับและแสดงผลตามนี้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, ตำแหน่ง, บทบาทหน้าที่..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">กลุ่มงาน/ฝ่าย:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 text-slate-700"
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

      {/* Personnel Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-3 sm:px-4 w-28 text-center">ลำดับ / สลับที่</th>
                <th className="py-3.5 px-4 sm:px-6">บุคลากร</th>
                <th className="py-3.5 px-4">ตำแหน่งและหน้าที่รับผิดชอบ (หลายตำแหน่ง)</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">กลุ่มสาระ / ฝ่ายงาน</th>
                <th className="py-3.5 px-4 sm:px-6 text-right w-32">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p, idx) => {
                // Find true index in complete personnelList
                const globalIndex = personnelList.findIndex((item) => item.id === p.id);
                const isFirst = globalIndex === 0;
                const isLast = globalIndex === personnelList.length - 1;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reorder column with Up & Down buttons */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Order Number Badge */}
                        <span className="w-7 h-7 rounded-xl bg-slate-100 font-black text-xs text-[#0F2942] flex items-center justify-center border border-slate-200 shadow-2xs">
                          {p.order || idx + 1}
                        </span>

                        {/* Move Up / Move Down Arrow Buttons */}
                        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
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
                                : "text-blue-700 hover:bg-blue-600 hover:text-white active:scale-95"
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
                        <div className="w-10 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0F2942]">{p.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {p.position}
                          </div>
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
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                rIdx === 0
                                  ? "bg-amber-50 text-amber-900 border border-amber-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 font-medium">{p.position}</span>
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
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
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

      {/* ================= MODAL: ADD / EDIT PERSONNEL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">
                  {editingId ? "แก้ไขข้อมูลบุคลากร" : "เพิ่มบุคลากรใหม่"}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F2942]">
                  {editingId ? formData.name || "แก้ไขบุคลากร" : "บันทึกข้อมูลครูและบุคลากร"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Multiple Roles */}
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
                <label className="block text-xs font-bold text-amber-900 mb-1">
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-amber-300 shadow-2xs"
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
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0 shadow-xs relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isProcessingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors border border-amber-200"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isProcessingAvatar ? "กำลังประมวลผลรูป..." : "เลือกรูปถ่ายจากเครื่อง"}</span>
                    </button>
                    <input
                      type="url"
                      placeholder="หรือใส่ URL รูปภาพ..."
                      value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                        formData.imageUrl === av.url ? "border-amber-500 scale-105" : "border-slate-200"
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
                  className="w-28 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold"
                />
                <span className="text-[11px] text-slate-400 ml-2">
                  (หรือสามารถกดปุ่ม ▲ เลื่อนขึ้น-ลง ได้ทันทีที่ตาราง)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {editingId ? "บันทึกการแก้ไข" : "บันทึกบุคลากรใหม่"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRM ================= */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ยืนยันการลบข้อมูลบุคลากร?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              คุณต้องการลบข้อมูล <strong>{deleteConfirmTarget.name}</strong> ออกจากทำเนียบบุคลากรหรือไม่?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ยืนยันรีเซ็ตข้อมูลเป็นค่าเริ่มต้น?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              ระบบจะคืนค่ารายชื่อบุคลากรทั้ง 12 ท่านตามข้อมูลทางการของโรงเรียนบ้านหนองหัวหมู
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
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
