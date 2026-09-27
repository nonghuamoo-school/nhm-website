"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Award,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calculator,
  ArrowLeft,
  Eye,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  X,
  Loader2
} from "lucide-react";
import {
  getStoredAcademicScores,
  saveStoredAcademicScores,
  resetStoredAcademicScores,
  fetchAcademicScoresCloud,
  getStoredOnetPosters,
  saveStoredOnetPosters,
  resetStoredOnetPosters,
  fetchOnetPostersCloud,
  defaultAcademicScores,
  defaultHistoricalOnetScores,
  createDefaultExamYear,
  AllAcademicScores,
  ExamDataset,
  OnetPosterItem
} from "@/data/academicScores";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";
import Swal from "sweetalert2";
import { compressImageFile, optimizeBase64OrUrl } from "@/utils/imageCompressor";

interface ScoreInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
}

/**
 * ScoreInput: Formats scores strictly to 2 decimal places (including trailing zeros e.g. 67.50, 47.60).
 * Handles user typing gracefully without premature truncation, formatting to .toFixed(2) on blur.
 */
function ScoreInput({ value, onChange, className, placeholder = "0.00" }: ScoreInputProps) {
  const formatScore = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return "0.00";
    return Number(val).toFixed(2);
  };

  const [localText, setLocalText] = useState<string>(() => formatScore(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalText(formatScore(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || /^\d*\.?\d{0,2}$/.test(raw)) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed > 100) return;
      setLocalText(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      } else if (raw === "") {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(localText);
    if (!isNaN(parsed)) {
      const formatted = parsed.toFixed(2);
      setLocalText(formatted);
      onChange(parseFloat(formatted));
    } else {
      setLocalText("0.00");
      onChange(0);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localText}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
}

export default function AdminAcademicPage() {
  const [activeMainTab, setActiveMainTab] = useState<"scores" | "posters">("scores");
  const [activeExam, setActiveExam] = useState<"O-NET" | "RT" | "NT">("O-NET");
  const [datasets, setDatasets] = useState<AllAcademicScores>(defaultAcademicScores);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [posters, setPosters] = useState<OnetPosterItem[]>(defaultHistoricalOnetScores);
  
  // New Year Creator State
  const [isAddingNewYear, setIsAddingNewYear] = useState(false);
  const [newYearInput, setNewYearInput] = useState("");
  const [copyPreviousScores, setCopyPreviousScores] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPosterIndex, setUploadingPosterIndex] = useState<number | null>(null);

  // Hidden file inputs mapped by poster index
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const loadedData = getStoredAcademicScores();
    setDatasets(loadedData);
    setPosters(getStoredOnetPosters());

    fetchAcademicScoresCloud().then((cloudData) => {
      if (cloudData) setDatasets(cloudData);
    });
    fetchOnetPostersCloud().then((cloudPosters) => {
      if (cloudPosters) setPosters(cloudPosters);
    });
  }, []);

  // Compute available years for the current exam
  const examMap = datasets[activeExam] || defaultAcademicScores[activeExam] || {};
  const availableYears = Object.keys(examMap).sort((a, b) => b.localeCompare(a));

  // Determine active year
  const activeYear = (selectedYear && examMap[selectedYear])
    ? selectedYear
    : (availableYears[0] || "2567");

  // Keep selectedYear synced when switching tabs
  useEffect(() => {
    if (!examMap[selectedYear]) {
      setSelectedYear(availableYears[0] || "2567");
    }
  }, [activeExam, examMap, selectedYear, availableYears]);

  const currentExamData: ExamDataset = examMap[activeYear] || createDefaultExamYear(activeExam, activeYear);

  // ================= 1. SCORES TAB LOGIC =================
  const handleScoreChange = (
    index: number,
    level: "school" | "area" | "national",
    value: string | number
  ) => {
    const numValue = typeof value === "number" ? value : (value === "" ? 0 : parseFloat(value));
    const updatedSubjects = [...currentExamData.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [level]: isNaN(numValue) ? 0 : numValue,
    };

    setDatasets((prev) => ({
      ...prev,
      [activeExam]: {
        ...(prev[activeExam] || {}),
        [activeYear]: {
          ...currentExamData,
          subjects: updatedSubjects,
        },
      },
    }));
  };

  const handleAutoCalculateTotal = () => {
    const subjectsWithoutTotal = currentExamData.subjects.filter((s) => !s.name.includes("รวม"));
    if (subjectsWithoutTotal.length === 0) return;

    const count = subjectsWithoutTotal.length;
    const avgSchool = subjectsWithoutTotal.reduce((acc, s) => acc + s.school, 0) / count;
    const avgArea = subjectsWithoutTotal.reduce((acc, s) => acc + s.area, 0) / count;
    const avgNational = subjectsWithoutTotal.reduce((acc, s) => acc + s.national, 0) / count;

    const updatedSubjects = currentExamData.subjects.map((s) => {
      if (s.name.includes("รวม")) {
        return {
          ...s,
          school: parseFloat(avgSchool.toFixed(2)),
          area: parseFloat(avgArea.toFixed(2)),
          national: parseFloat(avgNational.toFixed(2)),
        };
      }
      return s;
    });

    setDatasets((prev) => ({
      ...prev,
      [activeExam]: {
        ...(prev[activeExam] || {}),
        [activeYear]: {
          ...currentExamData,
          subjects: updatedSubjects,
        },
      },
    }));
  };

  // Add a new Academic Year for the active exam
  const handleCreateNewExamYear = async (targetYear?: string) => {
    const trimmed = (targetYear || newYearInput).trim();
    if (!trimmed || !/^\d{4}$/.test(trimmed)) {
      alert("กรุณาระบุปีการศึกษาเป็นตัวเลข 4 หลัก เช่น 2566, 2567, 2568, 2569 หรือ 2570");
      return;
    }

    if (examMap[trimmed]) {
      alert(`มีข้อมูลผลสอบ ${activeExam} ปีการศึกษา ${trimmed} อยู่แล้วในระบบ`);
      setSelectedYear(trimmed);
      setIsAddingNewYear(false);
      setNewYearInput("");
      return;
    }

    let newEntry: ExamDataset;
    if (copyPreviousScores && currentExamData) {
      newEntry = {
        ...currentExamData,
        year: trimmed,
        title: `ค่าเฉลี่ยคะแนน ${activeExam} ${currentExamData.grade} ปีการศึกษา ${trimmed}`,
      };
    } else {
      newEntry = createDefaultExamYear(activeExam, trimmed);
    }

    const updatedDatasets = {
      ...datasets,
      [activeExam]: {
        ...(datasets[activeExam] || {}),
        [trimmed]: newEntry,
      },
    };

    setDatasets(updatedDatasets);
    await saveStoredAcademicScores(updatedDatasets);

    setSelectedYear(trimmed);
    setIsAddingNewYear(false);
    setNewYearInput("");
    setSavedMessage(`เพิ่มปีการศึกษา ${trimmed} สำหรับ ${activeExam} เรียบร้อยแล้ว! กรอกคะแนนแล้วกดบันทึกได้เลย`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Delete an Academic Year
  const handleDeleteExamYear = async (yearToDelete: string) => {
    if (availableYears.length <= 1) {
      alert(`ไม่สามารถลบปีการศึกษาได้ เนื่องจากต้องมีข้อมูลอย่างน้อย 1 ปีสำหรับ ${activeExam}`);
      return;
    }

    if (confirm(`คุณต้องการลบข้อมูลผลสอบ ${activeExam} ปีการศึกษา ${yearToDelete} หรือไม่?`)) {
      const updatedExamMap = { ...examMap };
      delete updatedExamMap[yearToDelete];

      const updatedDatasets = {
        ...datasets,
        [activeExam]: updatedExamMap,
      };

      setDatasets(updatedDatasets);
      await saveStoredAcademicScores(updatedDatasets);

      const remainingYears = Object.keys(updatedExamMap).sort((a, b) => b.localeCompare(a));
      setSelectedYear(remainingYears[0] || "");
      setSavedMessage(`ลบปีการศึกษา ${yearToDelete} เรียบร้อยแล้ว`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // ================= 2. POSTERS TAB LOGIC =================
  const handleAddPoster = async (targetYear?: string) => {
    const newYear = targetYear || (posters.length > 0 ? (parseInt(posters[0].year) + 1).toString() : "2568");
    const newPoster: OnetPosterItem = {
      year: newYear,
      title: `ผลการทดสอบ O-NET ป.6 ปีการศึกษา ${newYear}`,
      image: "/images/onet-2567.png",
      highlight: "ผลการทดสอบระดับชาติอย่างเป็นทางการ",
      subjects: [
        { name: "ภาษาไทย", school: 65.0, national: 50.0, diff: "+15.00", higher: true },
        { name: "คณิตศาสตร์", school: 35.0, national: 28.0, diff: "+7.00", higher: true },
        { name: "วิทยาศาสตร์", school: 45.0, national: 38.0, diff: "+7.00", higher: true },
        { name: "ภาษาอังกฤษ", school: 30.0, national: 32.0, diff: "-2.00", higher: false },
      ],
    };
    const updated = [newPoster, ...posters];
    setPosters(updated);
    await saveStoredOnetPosters(updated);
    setSavedMessage(`เพิ่มประกาศผลสอบ O-NET ปีการศึกษา ${newYear} เรียบร้อยแล้ว`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleDeletePoster = async (index: number) => {
    if (confirm(`คุณต้องการลบภาพประกาศผลสอบปีการศึกษา ${posters[index].year} หรือไม่?`)) {
      const updated = posters.filter((_, i) => i !== index);
      setPosters(updated);
      await saveStoredOnetPosters(updated);
    }
  };

  const handlePosterFieldChange = (index: number, field: "year" | "title" | "highlight" | "image", value: string) => {
    const updated = [...posters];
    updated[index] = { ...updated[index], [field]: value };
    setPosters(updated);
  };

  const handlePosterSubjectChange = (
    posterIndex: number,
    subIndex: number,
    field: "school" | "national",
    val: string | number
  ) => {
    const num = typeof val === "number" ? val : (val === "" ? 0 : parseFloat(val));
    const updated = [...posters];
    const poster = { ...updated[posterIndex] };
    const subs = [...poster.subjects];
    const target = { ...subs[subIndex], [field]: isNaN(num) ? 0 : num };

    // Auto-calculate diff and higher
    const diffNum = target.school - target.national;
    target.diff = (diffNum >= 0 ? "+" : "") + diffNum.toFixed(2);
    target.higher = diffNum >= 0;

    subs[subIndex] = target;
    poster.subjects = subs;
    updated[posterIndex] = poster;
    setPosters(updated);
  };

  const handlePosterFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPosterIndex(index);
      const dataUrl = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const updated = [...posters];
      updated[index] = { ...updated[index], image: dataUrl };
      setPosters(updated);
      
      // Auto-save immediately to localStorage so user doesn't lose upload
      await saveStoredOnetPosters(updated);

      await Swal.fire({
        icon: "success",
        title: "อัปโหลดภาพสำเร็จ!",
        text: `อัปโหลดภาพผลสอบ O-NET ปี ${updated[index].year} เรียบร้อยแล้ว (บีบอัดขนาดเหมาะสม พร้อมบันทึกออนไลน์)`,
        confirmButtonColor: "#2F6FED",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error("Poster upload error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการโหลดรูปภาพ",
        text: err?.message || "กรุณาลองใหม่อีกครั้ง หรือเลือกไฟล์รูปภาพอื่น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#2F6FED",
      });
    } finally {
      setUploadingPosterIndex(null);
      e.target.value = "";
    }
  };

  const handlePosterUrlChange = async (index: number, val: string) => {
    let finalVal = val.trim();
    if (finalVal.startsWith("data:image/")) {
      try {
        finalVal = await optimizeBase64OrUrl(finalVal, { maxWidth: 1200, quality: 0.82 });
      } catch (err) {
        console.warn("Could not optimize pasted base64:", err);
      }
    }
    const updated = [...posters];
    updated[index] = { ...updated[index], image: finalVal };
    setPosters(updated);
  };

  // ================= 3. SAVE / RESET LOGIC =================
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Ensure all numeric scores are cleanly formatted to 2 decimals
      const sanitizedDatasets: AllAcademicScores = {};
      for (const [examKey, yearMap] of Object.entries(datasets)) {
        sanitizedDatasets[examKey] = {};
        for (const [yrKey, examData] of Object.entries(yearMap)) {
          sanitizedDatasets[examKey][yrKey] = {
            ...examData,
            subjects: examData.subjects.map((s) => ({
              ...s,
              school: parseFloat(Number(s.school || 0).toFixed(2)),
              area: parseFloat(Number(s.area || 0).toFixed(2)),
              national: parseFloat(Number(s.national || 0).toFixed(2)),
            })),
          };
        }
      }

      const sanitizedPosters = posters.map((p) => ({
        ...p,
        subjects: p.subjects.map((s) => {
          const sc = parseFloat(Number(s.school || 0).toFixed(2));
          const nat = parseFloat(Number(s.national || 0).toFixed(2));
          const diffNum = sc - nat;
          return {
            ...s,
            school: sc,
            national: nat,
            diff: (diffNum >= 0 ? "+" : "") + diffNum.toFixed(2),
            higher: diffNum >= 0,
          };
        }),
      }));

      await saveStoredAcademicScores(sanitizedDatasets);
      await saveStoredOnetPosters(sanitizedPosters);
      setDatasets(sanitizedDatasets);
      setPosters(sanitizedPosters);

      const successTitle = activeMainTab === "scores"
        ? `บันทึกคะแนน ${activeExam} สำเร็จ!`
        : "บันทึกภาพและประกาศผลสอบ O-NET สำเร็จ!";
      const successDetail = activeMainTab === "scores"
        ? `ข้อมูลคะแนน ${activeExam} ปีการศึกษา ${activeYear} และทุกปีการศึกษา ซิงค์ Cloud Database (Real-time) เรียบร้อยแล้ว`
        : `บันทึกภาพประกาศผลสอบ O-NET และข้อมูล (${posters.length} ปี) เรียบร้อยแล้ว พร้อมซิงค์ออนไลน์ทันที`;

      setSavedMessage(successDetail);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);

      await Swal.fire({
        icon: "success",
        title: successTitle,
        text: successDetail,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#2F6FED",
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Save all error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึก",
        text: "กรุณาลองใหม่อีกครั้ง หรือตรวจสอบขนาดไฟล์รูปภาพ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#2F6FED",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCurrent = async () => {
    if (activeMainTab === "scores") {
      if (confirm("คุณต้องการรีเซ็ตคะแนนทั้งหมดกลับเป็นค่ามาตรฐาน สทศ. หรือไม่?")) {
        await resetStoredAcademicScores();
        setDatasets(defaultAcademicScores);
        setSelectedYear("2567");
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3500);
      }
    } else {
      if (confirm("คุณต้องการรีเซ็ตภาพประกาศผลสอบ O-NET กลับเป็นค่าเริ่มต้นหรือไม่?")) {
        await resetStoredOnetPosters();
        setPosters(defaultHistoricalOnetScores);
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3500);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-blue-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3 h-3" /> แดชบอร์ด
            </Link>
            <span>/</span>
            <span className="text-[#1E3A5F] font-semibold">งานวัดผลและวิชาการ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E3A5F] flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#2F6FED]/10 text-[#2F6FED]">
              <Award className="w-6 h-6" />
            </span>
            จัดการคะแนน O-NET / NT / RT และภาพประกาศผลสอบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เลือก/เพิ่มปีการศึกษา กรอกคะแนนเปรียบเทียบ 3 ระดับ และอัปโหลดภาพโปสเตอร์ประกาศผลสอบระดับชาติ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleResetCurrent}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตค่ามาตรฐาน</span>
          </button>

          <button
            onClick={handleSaveAll}
            type="button"
            disabled={isSaving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#255bc4] shadow-sm transition-all min-h-[40px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลทั้งหมด"}</span>
          </button>
        </div>
      </div>

      {/* Success Banners */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นมาตรฐานเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* ================= 2 MAIN SECTION TABS ================= */}
      <div className="flex items-center gap-2 p-1.5 glass-card-admin rounded-2xl border border-[#D1DFF0]">
        <button
          onClick={() => setActiveMainTab("scores")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "scores"
              ? "bg-[#1E3A5F] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. กรอกคะแนน 3 ระดับ (O-NET / RT / NT แยกตามปี)</span>
        </button>

        <button
          onClick={() => setActiveMainTab("posters")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "posters"
              ? "bg-[#1E3A5F] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>2. จัดการภาพประกาศผลสอบ O-NET (อัปโหลดรูปโปสเตอร์)</span>
          <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-white font-bold">
            {posters.length} ปี
          </span>
        </button>
      </div>

      {/* ================= TAB 1: 3-LEVEL SCORES ================= */}
      {activeMainTab === "scores" && (
        <div className="space-y-6">
          {/* Top Bar: Exam Subtabs + Academic Year Selector */}
          <div className="glass-card-admin p-5 rounded-2xl border border-[#D1DFF0] shadow-sm space-y-4">
            
            {/* Exam Types Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {(["O-NET", "RT", "NT"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveExam(tab)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeExam === tab
                        ? "bg-[#1E3A5F] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {tab === "O-NET" ? "O-NET (ป.6)" : tab === "RT" ? "RT (ป.1)" : "NT (ป.3)"}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                  {currentExamData.grade}
                </span>
                <span>• สทศ. / สพฐ.</span>
              </div>
            </div>

            {/* Academic Year Toolbar (Core User Request!) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                  <Calendar className="w-4 h-4 text-[#2F6FED]" />
                  เลือกปีการศึกษา:
                </span>

                {availableYears.map((yearStr) => {
                  const isCurrent = activeYear === yearStr;
                  return (
                    <button
                      key={yearStr}
                      type="button"
                      onClick={() => setSelectedYear(yearStr)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? "bg-[#2F6FED] text-white shadow-sm ring-2 ring-[#2F6FED]/40"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <span>ปี {yearStr}</span>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setIsAddingNewYear(!isAddingNewYear)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2F6FED] bg-[#2F6FED]/10 hover:bg-[#2F6FED]/20 border border-[#2F6FED]/30 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เพิ่มปีการศึกษาใหม่</span>
                </button>
              </div>

              {/* Delete Active Year Button */}
              {availableYears.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteExamYear(activeYear)}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 transition-colors"
                  title={`ลบข้อมูลปีการศึกษา ${activeYear}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบปี {activeYear}</span>
                </button>
              )}
            </div>

            {/* Inline Add Year Form */}
            {isAddingNewYear && (
              <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border border-blue-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#2F6FED]" />
                    เพิ่มปีการศึกษาใหม่สำหรับ {activeExam} ({currentExamData.grade})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewYear(false)}
                    className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">กดเลือกปีด่วน:</span>
                  {(["2568", "2569", "2570", "2567", "2566", "2565"] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewYearInput(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        newYearInput === preset
                          ? "bg-[#2F6FED] text-white border-[#2F6FED]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                      }`}
                    >
                      ปี {preset}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 max-w-xs">
                    <input
                      type="text"
                      value={newYearInput}
                      onChange={(e) => setNewYearInput(e.target.value)}
                      placeholder="ระบุปี พ.ศ. เช่น 2568, 2569 หรือ 2565"
                      maxLength={4}
                      className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyPreviousScores}
                      onChange={(e) => setCopyPreviousScores(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>คัดลอกรายวิชาจากปีล่าสุด</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleCreateNewExamYear()}
                    className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    ยืนยันเพิ่มปีการศึกษา
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3-Level Table Card */}
          <div className="glass-card-admin rounded-2xl border border-[#D1DFF0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div>
                <h3 className="font-bold text-base text-[#1E3A5F] flex items-center gap-2">
                  <span>ตารางกรอกคะแนน ({activeExam} {currentExamData.grade})</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    ปีการศึกษา {activeYear}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  แก้ไขคะแนนเฉลี่ยระดับโรงเรียน เขตพื้นที่ และประเทศ (ทศนิยม 2 ตำแหน่ง)
                </p>
              </div>

              <button
                onClick={handleAutoCalculateTotal}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2F6FED] bg-[#2F6FED]/10 hover:bg-[#2F6FED]/20 border border-[#2F6FED]/30 transition-all self-start sm:self-auto shadow-2xs"
              >
                <Calculator className="w-4 h-4" />
                <span>คำนวณคะแนนแถว "รวม" อัตโนมัติ</span>
              </button>
            </div>

            {/* Input Table */}
            <div className="overflow-x-auto p-4 sm:p-6">
              <p className="text-[11px] text-slate-500 sm:hidden mb-2 flex items-center gap-1">
                <span>👉 เลื่อนซ้าย-ขวาเพื่อกรอกคะแนนให้ครบทุกระดับ</span>
              </p>
              <table className="w-full text-xs sm:text-sm border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 text-left font-bold">กลุ่มสาระ / สมรรถนะ</th>
                    <th className="py-3 px-4 text-center text-emerald-900 bg-emerald-50/70 border-x border-emerald-100">
                      <span className="flex items-center justify-center gap-1.5 font-bold">
                        <span className="w-3 h-3 rounded-xs bg-emerald-600" />
                        1. โรงเรียน (หนองหัวหมู)
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center text-[#1E3A5F] bg-[#EBF2FF]/70 border-r border-[#D1DFF0]">
                      <span className="flex items-center justify-center gap-1.5 font-bold whitespace-nowrap">
                        <span className="w-3 h-3 rounded-xs bg-[#2F6FED]" />
                        2. เขตพื้นที่ (บุรีรัมย์ เขต&nbsp;3)
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center text-blue-900 bg-blue-50/70">
                      <span className="flex items-center justify-center gap-1.5 font-bold">
                        <span className="w-3 h-3 rounded-xs bg-blue-600" />
                        3. ระดับประเทศ
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentExamData.subjects.map((item, idx) => {
                    const isTotal = item.name.includes("รวม");
                    return (
                      <tr
                        key={item.name}
                        className={isTotal ? "bg-blue-50/50 font-bold" : "hover:bg-slate-50/60"}
                      >
                        <td className="py-3 px-4 font-semibold text-[#1E3A5F]">
                          {item.name} {isTotal && "(เฉลี่ยรวม)"}
                        </td>

                        {/* 1. โรงเรียน */}
                        <td className="py-2.5 px-3 text-center bg-emerald-50/20 border-x border-emerald-100/60">
                          <ScoreInput
                            key={`${activeExam}-${activeYear}-${item.name}-school`}
                            value={item.school}
                            onChange={(val) => handleScoreChange(idx, "school", val)}
                            className="w-28 py-1.5 px-2 text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* 2. เขตพื้นที่ */}
                        <td className="py-2.5 px-3 text-center bg-amber-50/20 border-r border-amber-100/60">
                          <ScoreInput
                            key={`${activeExam}-${activeYear}-${item.name}-area`}
                            value={item.area}
                            onChange={(val) => handleScoreChange(idx, "area", val)}
                            className="w-28 py-1.5 px-2 text-center font-medium text-amber-900 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* 3. ประเทศ */}
                        <td className="py-2.5 px-3 text-center bg-blue-50/20">
                          <ScoreInput
                            key={`${activeExam}-${activeYear}-${item.name}-national`}
                            value={item.national}
                            onChange={(val) => handleScoreChange(idx, "national", val)}
                            className="w-28 py-1.5 px-2 text-center font-medium text-blue-900 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs font-mono"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span>* กรุณากดปุ่ม "บันทึกข้อมูลทั้งหมด" เพื่อยืนยันการเปลี่ยนแปลงข้อมูลปี {activeYear}</span>
              <button
                onClick={handleSaveAll}
                type="button"
                className="inline-flex items-center gap-1.5 font-bold text-[#2F6FED] hover:text-[#255bc4]"
              >
                <Save className="w-4 h-4" />
                <span>กดบันทึกข้อมูลคะแนน</span>
              </button>
            </div>
          </div>

          {/* Live Preview Chart */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#2F6FED]" />
                <h3 className="font-bold text-base text-[#1E3A5F]">
                  ตัวอย่างการแสดงผลบนหน้าเว็บไซต์จริง (Live Preview)
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                กราฟแท่งเปรียบเทียบ 3 ระดับ ({activeExam} ปี {activeYear})
              </span>
            </div>
            <AcademicPerformanceChart
              showAdminLink={false}
              initialExam={activeExam}
              initialYear={activeYear}
            />
          </div>
        </div>
      )}

      {/* ================= TAB 2: O-NET POSTERS GALLERY & UPLOAD ================= */}
      {activeMainTab === "posters" && (
        <div className="space-y-6">
          {/* Guide Banner */}
          <div className="p-5 glass-card-admin rounded-2xl border border-[#D1DFF0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1E3A5F]">
                  จัดการภาพโปสเตอร์ประกาศผลสอบ O-NET (Infographics)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  ท่านสามารถกดปุ่ม <strong>"เลือกไฟล์รูปภาพจากเครื่อง"</strong> เพื่ออัปโหลดรูปโปสเตอร์ประกาศผลสอบจากคอมพิวเตอร์หรือโทรศัพท์มือถือได้โดยตรง ภาพจะถูกจัดเก็บพร้อมแสดงผลที่หน้า <strong>/academic (ผลการทดสอบระดับชาติ)</strong> ทันที
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleAddPoster("2568")}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2F6FED]/10 hover:bg-[#2F6FED]/20 text-[#2F6FED] border border-[#2F6FED]/30 text-xs font-bold transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ เพิ่มปี 2568</span>
              </button>
              <button
                onClick={() => handleAddPoster()}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มภาพประกาศปีใหม่</span>
              </button>
            </div>
          </div>

          {/* Poster Cards List */}
          <div className="space-y-6">
            {posters.map((poster, pIdx) => (
              <div
                key={pIdx}
                className="glass-card-admin rounded-2xl border border-[#D1DFF0] shadow-sm overflow-hidden"
              >
                {/* Header Bar */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#1E3A5F] text-white text-xs font-bold shadow-2xs">
                      ปีการศึกษา {poster.year}
                    </span>
                    <span className="font-bold text-sm text-[#1E3A5F]">
                      {poster.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeletePoster(pIdx)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบประกาศปีนี้</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Poster Image Preview & Upload Controls (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      รูปภาพโปสเตอร์ประกาศผลสอบ (ภาพจริง/อินโฟกราฟิก):
                    </label>

                    <div
                      onClick={() => fileInputRefs.current[pIdx]?.click()}
                      className="relative aspect-[4/3] bg-slate-100 hover:bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 overflow-hidden flex items-center justify-center group cursor-pointer transition-all shadow-2xs"
                      title="คลิกเพื่อเลือกไฟล์รูปภาพ"
                    >
                      {poster.image ? (
                        <>
                          <img
                            src={poster.image}
                            alt={poster.title}
                            className="w-full h-full object-contain p-2"
                          />
                          <div
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={poster.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white/95 text-[#1E3A5F] hover:bg-white text-xs font-bold flex items-center gap-1 shadow-md"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>ดูรูปเต็ม</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[pIdx]?.click()}
                              className="p-2 rounded-xl bg-[#2F6FED] text-white hover:bg-[#255bc4] text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>เปลี่ยนรูปภาพ</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePosterFieldChange(pIdx, "image", "")}
                              className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ลบรูป</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-slate-500 group-hover:text-blue-700 transition-colors">
                          <Upload className="w-10 h-10 mx-auto mb-2 text-[#2F6FED] group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-[#1E3A5F]">คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง</p>
                          <p className="text-[11px] text-slate-400 mt-1">รองรับ JPG, PNG, WebP (ระบบย่อขนาดให้อัตโนมัติ)</p>
                        </div>
                      )}
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[pIdx] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePosterFileUpload(pIdx, e)}
                    />

                    {/* Upload Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[pIdx]?.click()}
                        disabled={uploadingPosterIndex === pIdx}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>
                          {uploadingPosterIndex === pIdx ? "กำลังประมวลผลรูป..." : "เลือกไฟล์รูปภาพจากเครื่อง"}
                        </span>
                      </button>
                    </div>

                    {/* URL Input fallback or File Badge */}
                    <div className="space-y-1">
                      {poster.image?.startsWith("data:") ? (
                        <div className="p-2.5 rounded-xl bg-white border border-blue-200 flex items-center justify-between gap-2 shadow-2xs">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-blue-950 block truncate">
                              ไฟล์รูปภาพโปสเตอร์ที่อัปโหลด
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              เลือกไฟล์สำเร็จ (พร้อมบันทึกออนไลน์)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePosterFieldChange(pIdx, "image", "")}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                          >
                            ลบออก
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-[11px] text-slate-400">หรือระบุ URL รูปภาพ (หรือวาง Base64):</span>
                          <input
                            type="text"
                            value={poster.image}
                            onChange={(e) => handlePosterUrlChange(pIdx, e.target.value)}
                            placeholder="เช่น /images/onet-2567.png หรือ https://..."
                            className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Meta Details & Quick Subject Diff Editor (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ปีการศึกษา:
                        </label>
                        <input
                          type="text"
                          value={poster.year}
                          onChange={(e) => handlePosterFieldChange(pIdx, "year", e.target.value)}
                          placeholder="เช่น 2569"
                          className="w-full py-2 px-3 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ข้อความเด่น (Highlight Badge):
                        </label>
                        <input
                          type="text"
                          value={poster.highlight || ""}
                          onChange={(e) => handlePosterFieldChange(pIdx, "highlight", e.target.value)}
                          placeholder="เช่น สูงกว่าระดับประเทศทุกรายวิชา"
                          className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        หัวข้อประกาศผลสอบ:
                      </label>
                      <input
                        type="text"
                        value={poster.title}
                        onChange={(e) => handlePosterFieldChange(pIdx, "title", e.target.value)}
                        placeholder="เช่น ผลการทดสอบ O-NET ป.6 ปีการศึกษา 2569"
                        className="w-full py-2 px-3 text-xs font-bold text-[#1E3A5F] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Subject Mini Score Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">
                          คะแนนสรุปเปรียบเทียบในโปสเตอร์ (โรงเรียน vs ประเทศ):
                        </label>
                        <span className="text-[11px] text-slate-400">
                          ระบบจะคำนวณส่วนต่าง (+/-) อัตโนมัติ
                        </span>
                      </div>

                      <div className="space-y-2">
                        {poster.subjects.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <span className="font-bold text-[#1E3A5F] w-24 shrink-0">
                              {sub.name}
                            </span>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-500">โรงเรียน:</span>
                                <ScoreInput
                                  key={`poster-${pIdx}-${sIdx}-school`}
                                  value={sub.school}
                                  onChange={(val) =>
                                    handlePosterSubjectChange(pIdx, sIdx, "school", val)
                                  }
                                  className="w-20 py-1 px-2 text-center font-bold text-emerald-900 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                                />
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-slate-500">ประเทศ:</span>
                                <ScoreInput
                                  key={`poster-${pIdx}-${sIdx}-national`}
                                  value={sub.national}
                                  onChange={(val) =>
                                    handlePosterSubjectChange(pIdx, sIdx, "national", val)
                                  }
                                  className="w-20 py-1 px-2 text-center font-medium text-blue-900 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono"
                                />
                              </div>

                              <div className="w-20 text-center font-mono font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] ${
                                    sub.higher
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {sub.diff}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
