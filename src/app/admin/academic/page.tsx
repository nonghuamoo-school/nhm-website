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
  Info
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
  ExamDataset,
  OnetPosterItem
} from "@/data/academicScores";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";

// Helper: Compress and resize image file to base64 DataURL (prevents localStorage quota errors)
function compressImageFile(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminAcademicPage() {
  const [activeMainTab, setActiveMainTab] = useState<"scores" | "posters">("scores");
  const [activeExam, setActiveExam] = useState<"O-NET" | "RT" | "NT">("O-NET");
  const [datasets, setDatasets] = useState<Record<string, ExamDataset>>(defaultAcademicScores);
  const [posters, setPosters] = useState<OnetPosterItem[]>(defaultHistoricalOnetScores);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [uploadingPosterIndex, setUploadingPosterIndex] = useState<number | null>(null);

  // Hidden file inputs mapped by poster index
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDatasets(getStoredAcademicScores());
    setPosters(getStoredOnetPosters());

    fetchAcademicScoresCloud().then((cloudData) => {
      if (cloudData) setDatasets(cloudData);
    });
    fetchOnetPostersCloud().then((cloudPosters) => {
      if (cloudPosters) setPosters(cloudPosters);
    });
  }, []);

  const currentExamData = datasets[activeExam] || defaultAcademicScores[activeExam];

  // ================= 1. SCORES TAB LOGIC =================
  const handleScoreChange = (
    index: number,
    level: "school" | "area" | "national",
    value: string
  ) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    const updatedSubjects = [...currentExamData.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [level]: isNaN(numValue) ? 0 : numValue,
    };

    setDatasets((prev) => ({
      ...prev,
      [activeExam]: {
        ...prev[activeExam],
        subjects: updatedSubjects,
      },
    }));
  };

  const handleAutoCalculateTotal = () => {
    const subjectsWithoutTotal = currentExamData.subjects.filter((s) => s.name !== "รวม");
    if (subjectsWithoutTotal.length === 0) return;

    const count = subjectsWithoutTotal.length;
    const avgSchool = subjectsWithoutTotal.reduce((acc, s) => acc + s.school, 0) / count;
    const avgArea = subjectsWithoutTotal.reduce((acc, s) => acc + s.area, 0) / count;
    const avgNational = subjectsWithoutTotal.reduce((acc, s) => acc + s.national, 0) / count;

    const updatedSubjects = currentExamData.subjects.map((s) => {
      if (s.name === "รวม") {
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
        ...prev[activeExam],
        subjects: updatedSubjects,
      },
    }));
  };

  // ================= 2. POSTERS TAB LOGIC =================
  const handleAddPoster = () => {
    const newYear = (posters.length > 0 ? (parseInt(posters[0].year) + 1).toString() : "2569");
    const newPoster: OnetPosterItem = {
      year: newYear,
      title: `ผลการทดสอบ O-NET ป.6 ปีการศึกษา ${newYear}`,
      image: "/images/onet-2568.png",
      highlight: "ผลการทดสอบระดับชาติอย่างเป็นทางการ",
      subjects: [
        { name: "ภาษาไทย", school: 65.0, national: 50.0, diff: "+15.00", higher: true },
        { name: "คณิตศาสตร์", school: 35.0, national: 28.0, diff: "+7.00", higher: true },
        { name: "วิทยาศาสตร์", school: 45.0, national: 38.0, diff: "+7.00", higher: true },
        { name: "ภาษาอังกฤษ", school: 30.0, national: 32.0, diff: "-2.00", higher: false },
      ],
    };
    setPosters([newPoster, ...posters]);
  };

  const handleDeletePoster = (index: number) => {
    if (confirm(`คุณต้องการลบภาพประกาศผลสอบปีการศึกษา ${posters[index].year} หรือไม่?`)) {
      const updated = posters.filter((_, i) => i !== index);
      setPosters(updated);
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
    val: string
  ) => {
    const num = val === "" ? 0 : parseFloat(val);
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
      const dataUrl = await compressImageFile(file, 1200, 0.85);
      const updated = [...posters];
      updated[index] = { ...updated[index], image: dataUrl };
      setPosters(updated);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploadingPosterIndex(null);
    }
  };

  // ================= 3. SAVE / RESET LOGIC =================
  const handleSaveAll = async () => {
    await saveStoredAcademicScores(datasets);
    await saveStoredOnetPosters(posters);
    setSavedMessage(
      activeMainTab === "scores"
        ? "บันทึกข้อมูลคะแนน 3 ระดับเรียบร้อยแล้ว! ข้อมูลซิงค์ Cloud Database แบบ Real-time"
        : "บันทึกภาพประกาศผลสอบ O-NET และข้อมูลเรียบร้อยแล้ว! ซิงค์ Real-time ทันที"
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetCurrent = async () => {
    if (activeMainTab === "scores") {
      if (confirm("คุณต้องการรีเซ็ตคะแนนทั้งหมดกลับเป็นค่ามาตรฐาน สทศ. หรือไม่?")) {
        await resetStoredAcademicScores();
        setDatasets(defaultAcademicScores);
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
            <span className="text-[#0F2942] font-semibold">งานวัดผลและวิชาการ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-blue-100 text-blue-900">
              <Award className="w-6 h-6" />
            </span>
            จัดการคะแนน O-NET / NT / RT และภาพประกาศผลสอบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            กรอกคะแนนเปรียบเทียบ 3 ระดับ และอัปโหลดภาพโปสเตอร์/อินโฟกราฟิกประกาศผลสอบระดับชาติ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetCurrent}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตค่ามาตรฐาน</span>
          </button>

          <button
            onClick={handleSaveAll}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-xs transition-all min-h-[38px]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลทั้งหมด</span>
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
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveMainTab("scores")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "scores"
              ? "bg-[#0F2942] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. กรอกคะแนน 3 ระดับ (โรงเรียน • เขต • ประเทศ)</span>
        </button>

        <button
          onClick={() => setActiveMainTab("posters")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMainTab === "posters"
              ? "bg-[#0F2942] text-white shadow-md"
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
          {/* Exam Subtabs Selector */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
              {(["O-NET", "RT", "NT"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveExam(tab)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeExam === tab
                      ? "bg-[#0F2942] text-white shadow-md scale-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab === "O-NET" ? "O-NET (ป.6)" : tab === "RT" ? "RT (ป.1)" : "NT (ป.3)"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 px-3">
              <span>ปีการศึกษา: <strong className="text-slate-900">{currentExamData.year}</strong></span>
              <span>•</span>
              <span>ระดับชั้น: <strong className="text-slate-900">{currentExamData.grade}</strong></span>
            </div>
          </div>

          {/* 3-Level Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div>
                <h3 className="font-bold text-base text-[#0F2942] flex items-center gap-2">
                  <span>ตารางกรอกคะแนน ({activeExam} {currentExamData.grade})</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-normal">
                    3 ระดับเปรียบเทียบ
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  แก้ไขคะแนนเฉลี่ยระดับโรงเรียน เขตพื้นที่ และประเทศ (ทศนิยม 2 ตำแหน่ง)
                </p>
              </div>

              <button
                onClick={handleAutoCalculateTotal}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all self-start sm:self-auto shadow-2xs"
              >
                <Calculator className="w-4 h-4" />
                <span>คำนวณคะแนนแถว "รวม" อัตโนมัติ</span>
              </button>
            </div>

            {/* Input Table */}
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 text-left font-bold">กลุ่มสาระ / สมรรถนะ</th>
                    <th className="py-3 px-4 text-center text-emerald-900 bg-emerald-50/70 border-x border-emerald-100">
                      <span className="flex items-center justify-center gap-1.5 font-bold">
                        <span className="w-3 h-3 rounded-xs bg-emerald-600" />
                        1. โรงเรียน (หนองหัวหมู)
                      </span>
                    </th>
                    <th className="py-3 px-4 text-center text-amber-900 bg-amber-50/70 border-r border-amber-100">
                      <span className="flex items-center justify-center gap-1.5 font-bold">
                        <span className="w-3 h-3 rounded-xs bg-amber-500" />
                        2. เขตพื้นที่ (บุรีรัมย์ เขต 3)
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
                        <td className="py-3 px-4 font-semibold text-[#0F2942]">
                          {item.name} {isTotal && "(เฉลี่ยรวม)"}
                        </td>

                        {/* 1. โรงเรียน */}
                        <td className="py-2.5 px-3 text-center bg-emerald-50/20 border-x border-emerald-100/60">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={item.school}
                            onChange={(e) => handleScoreChange(idx, "school", e.target.value)}
                            className="w-28 py-1.5 px-2 text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs"
                          />
                        </td>

                        {/* 2. เขตพื้นที่ */}
                        <td className="py-2.5 px-3 text-center bg-amber-50/20 border-r border-amber-100/60">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={item.area}
                            onChange={(e) => handleScoreChange(idx, "area", e.target.value)}
                            className="w-28 py-1.5 px-2 text-center font-medium text-amber-900 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden shadow-2xs"
                          />
                        </td>

                        {/* 3. ประเทศ */}
                        <td className="py-2.5 px-3 text-center bg-blue-50/20">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={item.national}
                            onChange={(e) => handleScoreChange(idx, "national", e.target.value)}
                            className="w-28 py-1.5 px-2 text-center font-medium text-blue-900 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span>* กรุณากดปุ่ม "บันทึกข้อมูลทั้งหมด" เพื่อยืนยันการเปลี่ยนแปลง</span>
              <button
                onClick={handleSaveAll}
                type="button"
                className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900"
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
                <Eye className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-base text-[#0F2942]">
                  ตัวอย่างการแสดงผลบนหน้าเว็บไซต์จริง (Live Preview)
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                กราฟแท่งเปรียบเทียบ 3 ระดับ และตารางผลคะแนน
              </span>
            </div>
            <AcademicPerformanceChart showAdminLink={false} />
          </div>
        </div>
      )}

      {/* ================= TAB 2: O-NET POSTERS GALLERY & UPLOAD ================= */}
      {activeMainTab === "posters" && (
        <div className="space-y-6">
          {/* Guide Banner */}
          <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-3xl border border-blue-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#0F2942]">
                  จัดการภาพโปสเตอร์ประกาศผลสอบ O-NET (Infographics)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  ท่านสามารถกดปุ่ม <strong>"เลือกไฟล์รูปภาพจากเครื่อง"</strong> เพื่ออัปโหลดรูปโปสเตอร์ประกาศผลสอบจากคอมพิวเตอร์หรือโทรศัพท์มือถือได้โดยตรง ภาพจะถูกย่อและจัดเก็บพร้อมแสดงผลที่หน้า <strong>/academic (ผลการทดสอบระดับชาติ)</strong> ทันที
                </p>
              </div>
            </div>

            <button
              onClick={handleAddPoster}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มภาพประกาศผลสอบปีใหม่</span>
            </button>
          </div>

          {/* Poster Cards List */}
          <div className="space-y-6">
            {posters.map((poster, pIdx) => (
              <div
                key={pIdx}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header Bar */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#0F2942] text-white text-xs font-bold shadow-2xs">
                      ปีการศึกษา {poster.year}
                    </span>
                    <span className="font-bold text-sm text-[#0F2942]">
                      {poster.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeletePoster(pIdx)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-all"
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

                    <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center group">
                      {poster.image ? (
                        <>
                          <img
                            src={poster.image}
                            alt={poster.title}
                            className="w-full h-full object-contain p-2"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                            <a
                              href={poster.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white/90 text-[#0F2942] hover:bg-white text-xs font-bold flex items-center gap-1 shadow-md"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>ดูรูปเต็ม</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[pIdx]?.click()}
                              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold flex items-center gap-1 shadow-md"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>เปลี่ยนรูปภาพ</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-slate-400">
                          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                          <p className="text-xs">ยังไม่มีรูปภาพ</p>
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
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold transition-all shadow-2xs"
                      >
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>
                          {uploadingPosterIndex === pIdx ? "กำลังประมวลผลรูป..." : "เลือกไฟล์รูปภาพจากเครื่อง"}
                        </span>
                      </button>
                    </div>

                    {/* URL Input fallback */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400">หรือระบุ URL รูปภาพ:</span>
                      <input
                        type="text"
                        value={poster.image}
                        onChange={(e) => handlePosterFieldChange(pIdx, "image", e.target.value)}
                        placeholder="เช่น /images/onet-2568.png หรือ https://..."
                        className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
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
                          placeholder="เช่น 2568"
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
                        placeholder="เช่น ผลการทดสอบ O-NET ป.6 ปีการศึกษา 2568"
                        className="w-full py-2 px-3 text-xs font-bold text-[#0F2942] bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Subject Mini Score Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">
                          คะแนนเปรียบเทียบระดับโรงเรียน กับ ระดับประเทศ:
                        </label>
                        <span className="text-[11px] text-slate-400">
                          (ระบบคำนวณผลต่าง +/- ให้อัตโนมัติ)
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-200">
                              <th className="py-1.5 text-left font-bold">วิชา</th>
                              <th className="py-1.5 text-center font-bold">รร. หนองหัวหมู</th>
                              <th className="py-1.5 text-center font-bold">ระดับประเทศ</th>
                              <th className="py-1.5 text-center font-bold">ผลต่าง (Diff)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60">
                            {poster.subjects?.map((sub, sIdx) => (
                              <tr key={sIdx}>
                                <td className="py-2 font-semibold text-[#0F2942]">{sub.name}</td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={sub.school}
                                    onChange={(e) =>
                                      handlePosterSubjectChange(pIdx, sIdx, "school", e.target.value)
                                    }
                                    className="w-20 py-1 text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded-lg text-xs"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={sub.national}
                                    onChange={(e) =>
                                      handlePosterSubjectChange(pIdx, sIdx, "national", e.target.value)
                                    }
                                    className="w-20 py-1 text-center font-medium text-blue-900 bg-white border border-blue-300 rounded-lg text-xs"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      sub.higher
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {sub.diff}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>* ข้อมูลจะถูกจัดแสดงในหน้าเว็บไซต์หลัก <strong>/academic</strong> ทันทีหลังกดบันทึก</span>
                  <button
                    onClick={handleSaveAll}
                    type="button"
                    className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกข้อมูลโปสเตอร์นี้</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Add & Save */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleAddPoster}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0F2942] text-xs font-bold shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มภาพประกาศผลสอบปีใหม่</span>
            </button>

            <button
              onClick={handleSaveAll}
              type="button"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลภาพโปสเตอร์ทั้งหมด</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
