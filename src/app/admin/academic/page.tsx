"use client";

import React, { useState, useEffect } from "react";
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
  School,
  Building2,
  Globe2
} from "lucide-react";
import {
  getStoredAcademicScores,
  saveStoredAcademicScores,
  resetStoredAcademicScores,
  defaultAcademicScores,
  ExamDataset,
  AcademicScoreItem
} from "@/data/academicScores";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";

export default function AdminAcademicPage() {
  const [activeExam, setActiveExam] = useState<"O-NET" | "RT" | "NT">("O-NET");
  const [datasets, setDatasets] = useState<Record<string, ExamDataset>>(defaultAcademicScores);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setDatasets(getStoredAcademicScores());
  }, []);

  const currentExamData = datasets[activeExam] || defaultAcademicScores[activeExam];

  // Handle score change for a specific subject and level (3 levels: school, area, national)
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

  // Auto-calculate average for "รวม" row across the 3 levels
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

  // Save changes to localStorage and dispatch event
  const handleSave = () => {
    saveStoredAcademicScores(datasets);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm("คุณต้องการรีเซ็ตคะแนนทั้งหมดกลับเป็นค่ามาตรฐาน สทศ. หรือไม่?")) {
      resetStoredAcademicScores();
      setDatasets(defaultAcademicScores);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3500);
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
            <span className="text-[#0F2942] font-semibold">ตั้งค่าคะแนน 3 ระดับ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-blue-100 text-blue-900">
              <Award className="w-6 h-6" />
            </span>
            จัดการคะแนน O-NET / NT / RT (3 ระดับ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            กรอกและปรับปรุงข้อมูลคะแนนเฉลี่ย 3 ระดับ: <strong>1. โรงเรียน</strong> • <strong>2. เขตพื้นที่ (สพป. บุรีรัมย์ เขต 3)</strong> • <strong>3. ประเทศ</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตค่ามาตรฐาน</span>
          </button>

          <button
            onClick={handleSave}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-xs transition-all min-h-[38px]"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกคะแนน</span>
          </button>
        </div>
      </div>

      {/* Success Banners */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>บันทึกข้อมูลคะแนน 3 ระดับเรียบร้อยแล้ว! กราฟและตารางในทุกหน้าเว็บถูกอัปเดตแบบ Real-time ทันที</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>รีเซ็ตคะแนนทั้งหมดกลับเป็นค่าเริ่มต้นมาตรฐาน สทศ. เรียบร้อยแล้ว</span>
        </div>
      )}

      {/* ================= EXAM TABS SELECTOR ================= */}
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

      {/* ================= 3-LEVEL EDITABLE DATA TABLE CARD ================= */}
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
                const isTotal = item.name === "รวม";
                return (
                  <tr
                    key={item.name}
                    className={isTotal ? "bg-blue-50/50 font-bold" : "hover:bg-slate-50/60"}
                  >
                    <td className="py-3 px-4 font-semibold text-[#0F2942]">
                      {item.name} {isTotal && "(เฉลี่ยรวมทุกวิชา)"}
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
          <span>* กรุณากดปุ่ม "บันทึกคะแนน" ด้านบนหรือด้านล่าง เพื่อยืนยันการเปลี่ยนแปลง</span>
          <button
            onClick={handleSave}
            type="button"
            className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900"
          >
            <Save className="w-4 h-4" />
            <span>กดบันทึกข้อมูลคะแนน</span>
          </button>
        </div>
      </div>

      {/* ================= REAL-TIME LIVE PREVIEW OF THE OFFICIAL CHART ================= */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-base text-[#0F2942]">
              ตัวอย่างการแสดงผลบนหน้าเว็บไซต์จริง (Live Preview)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            กราฟแท่ง SVG 3 มิติ และตารางเปรียบเทียบ 3 ระดับ
          </span>
        </div>

        {/* Live Chart Rendering */}
        <AcademicPerformanceChart showAdminLink={false} />
      </div>

    </div>
  );
}
