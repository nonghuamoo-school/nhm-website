"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  FileText,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Layers,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HardDrive
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import DocumentViewerModal from "@/components/common/DocumentViewerModal";
import { schoolInventoryAssets } from "@/data/assets";
import { getStoredStudentStats, defaultSchoolStudentStats } from "@/data/studentStats";
import { DownloadDoc } from "@/types";
import { useDownloads } from "@/hooks/useDownloads";

type ActiveTab = "documents" | "inventory" | "studentStats";

export default function DownloadsPage() {
  const { docList } = useDownloads();
  const [activeTab, setActiveTab] = useState<ActiveTab>("documents");
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>("ทั้งหมด");
  const [docSearch, setDocSearch] = useState<string>("");

  // Modal State
  const [previewDoc, setPreviewDoc] = useState<DownloadDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Asset Inventory State
  const [assetSearch, setAssetSearch] = useState<string>("");
  const [assetStatusFilter, setAssetStatusFilter] = useState<string>("ทั้งหมด");

  // Student Stats State
  const [studentStatsData, setStudentStatsData] = useState(defaultSchoolStudentStats);
  const [selectedYear, setSelectedYear] = useState<string>("2568");

  useEffect(() => {
    setStudentStatsData(getStoredStudentStats());

    const handleUpdate = () => {
      setStudentStatsData(getStoredStudentStats());
    };

    window.addEventListener("student_stats_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("student_stats_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const docCategories = [
    "ทั้งหมด",
    "งานวิชาการ",
    "แบบฟอร์มคำร้อง",
    "งานบุคคลและงบประมาณ",
    "สำหรับนักเรียน/ผู้ปกครอง",
  ];

  const filteredDocs = docList.filter((doc) => {
    const matchesCat = selectedDocCategory === "ทั้งหมด" || doc.category === selectedDocCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(docSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredAssets = schoolInventoryAssets.filter((asset) => {
    const matchesStatus =
      assetStatusFilter === "ทั้งหมด" || asset.status === assetStatusFilter;
    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.code.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.location.toLowerCase().includes(assetSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenPreview = (doc: DownloadDoc) => {
    setPreviewDoc(doc);
    setIsModalOpen(true);
  };

  const handleExportAssetsExcel = () => {
    // Generate and download a real CSV file for Excel
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
  };

  const availableStudentYears = Object.keys(studentStatsData).sort((a, b) => b.localeCompare(a));
  const activeStudentYear = studentStatsData[selectedYear] ? selectedYear : availableStudentYears[0] || "2568";
  const currentStats = studentStatsData[activeStudentYear] || defaultSchoolStudentStats["2568"];

  const handleExportStudentStatsExcel = () => {
    const header = "\uFEFFระดับชั้น,เพศชาย (คน),เพศหญิง (คน),รวม (คน),จำนวนห้องเรียน\n";
    const rows = currentStats.grades
      .map((g) => `"${g.grade}","${g.male}","${g.female}","${g.total}","${g.classrooms}"`)
      .join("\n");
    const totalRow = `"รวมทั้งสิ้น","${currentStats.summary.totalMale}","${currentStats.summary.totalFemale}","${currentStats.summary.totalStudents}","${currentStats.summary.totalClassrooms}"`;
    const blob = new Blob([header + rows + "\n" + totalRow], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `สถิตินักเรียน_โรงเรียนบ้านหนองหัวหมู_ปี${activeStudentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toolbar = (
    <div className="flex flex-col gap-3">
      {/* 3 Main Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "documents"
              ? "bg-[#0F2942] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>แบบฟอร์มและเอกสารราชการ (PDF)</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "inventory"
              ? "bg-[#0F2942] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ทะเบียนครุภัณฑ์และสินทรัพย์ (Excel)</span>
        </button>

        <button
          onClick={() => setActiveTab("studentStats")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "studentStats"
              ? "bg-[#0F2942] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ข้อมูลสถิตินักเรียนรายชั้น</span>
        </button>
      </div>

      {/* Sub-toolbar depending on Active Tab */}
      {activeTab === "documents" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {docCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedDocCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                  selectedDocCategory === cat
                    ? "bg-[#0F2942] text-white shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหรือรายละเอียดเอกสาร..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 focus:border-[#0F2942] min-h-[38px]"
            />
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>สถานะ:</span>
            </span>
            {["ทั้งหมด", "ใช้งานได้ปกติ", "รอซ่อมบำรุง", "ชำรุด/จำหน่าย"].map((status) => (
              <button
                key={status}
                onClick={() => setAssetStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[34px] ${
                  assetStatusFilter === status
                    ? "bg-[#0F2942] text-white shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ/รหัสครุภัณฑ์..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white focus:outline-none min-h-[38px]"
              />
            </div>

            <button
              onClick={handleExportAssetsExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 min-h-[38px]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ส่งออกเป็นไฟล์ EXCEL</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "studentStats" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F2942]">เลือกปีการศึกษา:</span>
            <div className="flex items-center gap-1">
              {availableStudentYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-[34px] ${
                    activeStudentYear === yr
                      ? "bg-[#0F2942] text-white shadow-2xs"
                      : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200/80 border border-[#E5E7EB]"
                  }`}
                >
                  ปีการศึกษา {yr}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 ml-2">
              (ข้อมูล ณ วันที่ {currentStats.updatedDate})
            </span>
          </div>

          <button
            onClick={handleExportStudentStatsExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 min-h-[38px]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออกข้อมูลสถิติ (EXCEL)</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ดาวน์โหลดเอกสารและสถิติ" }]}
      title="คลังเอกสาร ทะเบียนครุภัณฑ์ และสถิติข้อมูล"
      description="ศูนย์กลางดาวน์โหลดแบบฟอร์ม แผนพัฒนาการจัดการศึกษา ทะเบียนสินทรัพย์ และข้อมูลสถิติการศึกษา โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3"
      toolbar={toolbar}
    >
      {/* Cloud Drive Notice Header */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-slate-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F2942] text-white flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#0F2942] block">
              ระบบเชื่อมต่อเอกสาร Google Drive & Google Workspace for Education
            </span>
            <p className="text-[11px] text-slate-500">
              เอกสารทางการถูกจัดเก็บไว้บนคลาวด์ไดรฟ์ของโรงเรียนบ้านหนองหัวหมู ท่านสามารถกด &ldquo;เปิดดูตัวอย่าง&rdquo; เพื่อเปิดอ่านแบบเต็มจอ หรือดาวน์โหลดไฟล์ได้ทันที
            </p>
          </div>
        </div>

        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs shrink-0 self-start sm:self-center"
        >
          <span>เปิดโฟลเดอร์ Google Drive รวม</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* TAB 1: Documents & Forms with Drive Reader */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold text-xs ${
                      doc.fileType === "PDF"
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : doc.fileType === "XLSX"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <FileText className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] uppercase leading-none">{doc.fileType}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">• วันที่: {doc.date}</span>
                      <span className="text-xs text-slate-400">• ขนาด: {doc.fileSize}</span>
                      <span className="text-xs text-slate-400">• ดาวน์โหลด: {doc.downloads} ครั้ง</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#0F2942]">
                      {doc.title}
                    </h3>

                    {doc.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-2xl leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                  {/* Preview Button */}
                  <button
                    onClick={() => handleOpenPreview(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-[#0F2942] text-xs font-bold border border-slate-200 shadow-2xs transition-colors min-h-[38px]"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>เปิดดูตัวอย่าง</span>
                  </button>

                  {/* Google Drive Link */}
                  {doc.driveUrl && (
                    <a
                      href={doc.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-900 text-xs font-bold border border-blue-200 shadow-2xs transition-colors min-h-[38px]"
                      title="เปิดไฟล์นี้บน Google Drive โดยตรง"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Drive</span>
                    </a>
                  )}

                  {/* Direct Download Button */}
                  <a
                    href={doc.downloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-2xs transition-colors min-h-[38px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดไฟล์</span>
                  </a>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 p-8 text-slate-500 text-sm">
                ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Asset / Inventory Table with Excel Export */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F2942]">
                  บัญชีรายการครุภัณฑ์และสินทรัพย์สถานศึกษา
                </h3>
                <p className="text-[11px] text-slate-500">
                  แสดงรายการครุภัณฑ์ที่ขึ้นทะเบียนคุมพัสดุ สพป. บุรีรัมย์ เขต 3 (พบ {filteredAssets.length} รายการ)
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                สถานะข้อมูล: สมบูรณ์
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F8FAFC] text-[#0F2942] font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-3.5 text-center w-12">ลำดับ</th>
                    <th className="p-3.5">รหัสครุภัณฑ์</th>
                    <th className="p-3.5">รายการครุภัณฑ์</th>
                    <th className="p-3.5">หมวดหมู่</th>
                    <th className="p-3.5 text-center">ปีงบฯ</th>
                    <th className="p-3.5 text-center">จำนวน</th>
                    <th className="p-3.5">สถานที่จัดเก็บ/ผู้รับผิดชอบ</th>
                    <th className="p-3.5 text-center">สถานะ</th>
                    <th className="p-3.5">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map((asset, index) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="p-3.5 font-mono text-[11px] font-semibold text-blue-900 whitespace-nowrap">
                        {asset.code}
                      </td>
                      <td className="p-3.5 font-bold text-[#0F2942] max-w-xs">{asset.name}</td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">{asset.category}</td>
                      <td className="p-3.5 text-center font-mono text-slate-600">{asset.fiscalYear}</td>
                      <td className="p-3.5 text-center font-bold text-slate-800">
                        {asset.quantity} {asset.unit}
                      </td>
                      <td className="p-3.5 text-slate-600">{asset.location}</td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                      <td className="p-3.5 text-slate-400 text-[11px] max-w-xs">{asset.note || "-"}</td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-slate-400">
                        ไม่พบข้อมูลครุภัณฑ์ที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Student Statistics Table by Grade & Gender */}
      {activeTab === "studentStats" && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[11px] font-bold text-slate-400">จำนวนนักเรียนทั้งหมด</span>
              <div className="text-2xl font-bold text-[#0F2942] mt-1">
                {currentStats.summary.totalStudents} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[11px] font-bold text-blue-600">นักเรียนชาย</span>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {currentStats.summary.totalMale} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[11px] font-bold text-rose-600">นักเรียนหญิง</span>
              <div className="text-2xl font-bold text-rose-900 mt-1">
                {currentStats.summary.totalFemale} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600">จำนวนห้องเรียน</span>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {currentStats.summary.totalClassrooms} <span className="text-xs font-normal text-slate-500">ห้อง</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F2942]">
                ข้อมูลสถิตินักเรียน จำแนกตามระดับชั้นและเพศ (ปีการศึกษา {selectedYear})
              </h3>
              <span className="text-xs text-slate-500">
                โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต 3
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F8FAFC] text-[#0F2942] font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-3.5">ระดับชั้น</th>
                    <th className="p-3.5 text-center">เพศชาย (คน)</th>
                    <th className="p-3.5 text-center">เพศหญิง (คน)</th>
                    <th className="p-3.5 text-center">รวม (คน)</th>
                    <th className="p-3.5 text-center">จำนวนห้องเรียน</th>
                    <th className="p-3.5 text-center">เฉลี่ยต่อห้อง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStats.grades.map((grade) => (
                    <tr key={grade.grade} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-[#0F2942]">{grade.grade}</td>
                      <td className="p-3.5 text-center font-mono text-blue-900">{grade.male}</td>
                      <td className="p-3.5 text-center font-mono text-rose-900">{grade.female}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900">{grade.total}</td>
                      <td className="p-3.5 text-center font-mono text-slate-600">{grade.classrooms}</td>
                      <td className="p-3.5 text-center font-mono text-slate-400">
                        {(grade.total / grade.classrooms).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100/80 font-bold text-xs text-[#0F2942] border-t-2 border-slate-300">
                  <tr>
                    <td className="p-3.5 text-[#0F2942]">รวมทั้งสิ้น</td>
                    <td className="p-3.5 text-center font-mono text-blue-900">{currentStats.summary.totalMale}</td>
                    <td className="p-3.5 text-center font-mono text-rose-900">{currentStats.summary.totalFemale}</td>
                    <td className="p-3.5 text-center font-mono font-extrabold text-[#0F2942] text-sm">
                      {currentStats.summary.totalStudents}
                    </td>
                    <td className="p-3.5 text-center font-mono">{currentStats.summary.totalClassrooms}</td>
                    <td className="p-3.5 text-center font-mono">
                      {(currentStats.summary.totalStudents / currentStats.summary.totalClassrooms).toFixed(1)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={previewDoc}
      />
    </InnerPageLayout>
  );
}
