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
  XCircle
} from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import DocumentViewerModal from "@/components/common/DocumentViewerModal";
import { useAssets } from "@/hooks/useAssets";
import { getStoredStudentStats, fetchStudentStatsCloud, defaultSchoolStudentStats } from "@/data/studentStats";
import { DownloadDoc } from "@/types";
import { useDownloads } from "@/hooks/useDownloads";
import { resolveDocumentMedia, triggerDocumentDownload } from "@/lib/drive";

type ActiveTab = "documents" | "inventory" | "studentStats";

export default function DownloadsPage() {
  const { docList } = useDownloads();
  const { assetsList } = useAssets();
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
  const [selectedYear, setSelectedYear] = useState<string>("2569");

  useEffect(() => {
    setStudentStatsData(getStoredStudentStats());

    // Fetch from Supabase cloud
    fetchStudentStatsCloud().then((cloudData) => {
      if (cloudData) setStudentStatsData(cloudData);
    });

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

  const filteredAssets = assetsList.filter((asset) => {
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
  const activeStudentYear = studentStatsData[selectedYear] ? selectedYear : availableStudentYears[0] || "2569";
  const currentStats = studentStatsData[activeStudentYear] || defaultSchoolStudentStats["2569"];

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
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EAF2FB]/70 backdrop-blur-sm rounded-2xl border border-[#D1DFF0] w-fit">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "documents"
              ? "bg-[#1E3A5F] text-white shadow-xs"
              : "text-[#1E3A5F] hover:bg-[#EBF2FF]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>แบบฟอร์มและเอกสารราชการ (PDF)</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "inventory"
              ? "bg-[#1E3A5F] text-white shadow-xs"
              : "text-[#1E3A5F] hover:bg-[#EBF2FF]"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ทะเบียนครุภัณฑ์และสินทรัพย์ (Excel)</span>
        </button>

        <button
          onClick={() => setActiveTab("studentStats")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
            activeTab === "studentStats"
              ? "bg-[#1E3A5F] text-white shadow-xs"
              : "text-[#1E3A5F] hover:bg-[#EBF2FF]"
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
                    ? "bg-[#1E3A5F] text-white shadow-2xs"
                    : "bg-white/80 text-[#1E3A5F] hover:bg-[#EBF2FF] border border-[#D1DFF0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#6B7FA0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหรือรายละเอียดเอกสาร..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D1DFF0] bg-[#EAF2FB]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/25 focus:border-[#2F6FED] min-h-[38px] text-[#0F1F30]"
            />
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#D96B34]" />
              <span>สถานะ:</span>
            </span>
            {["ทั้งหมด", "ใช้งานได้ปกติ", "รอซ่อมบำรุง", "ชำรุด/จำหน่าย"].map((status) => (
              <button
                key={status}
                onClick={() => setAssetStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[34px] ${
                  assetStatusFilter === status
                    ? "bg-[#1E3A5F] text-white shadow-2xs"
                    : "bg-white/80 text-[#1E3A5F] hover:bg-[#EBF2FF] border border-[#D1DFF0]"
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
            <span className="text-xs font-bold text-[#1E3A5F]">เลือกปีการศึกษา:</span>
            <div className="flex items-center gap-1">
              {availableStudentYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-[34px] ${
                    activeStudentYear === yr
                      ? "bg-[#1E3A5F] text-white shadow-2xs"
                      : "bg-white/80 text-[#1E3A5F] hover:bg-[#EBF2FF] border border-[#D1DFF0]"
                  }`}
                >
                  ปีการศึกษา {yr}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-[#6B7FA0] ml-2">
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
      description="ศูนย์กลางดาวน์โหลดแบบฟอร์ม แผนพัฒนาการจัดการศึกษา ทะเบียนสินทรัพย์ และข้อมูลสถิติการศึกษา โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต\u00A03"
      toolbar={toolbar}
    >
      {/* TAB 1: Documents & Forms with Drive Reader: Glassmorphism */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden divide-y divide-[#D1DFF0]">
            {filteredDocs.map((doc) => {
              const media = resolveDocumentMedia(doc);
              return (
                <div
                  key={doc.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#EBF2FF]/30 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold text-xs ${
                        doc.fileType === "PDF"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : doc.fileType === "XLSX"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-[#EBF2FF] text-[#2F6FED] border border-[#2F6FED]/25"
                      }`}
                    >
                      <FileText className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] uppercase leading-none">{doc.fileType}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-[#1E3A5F] bg-[#EAF2FB] border border-[#D1DFF0] px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <span className="text-xs text-[#6B7FA0]">• วันที่: {doc.date}</span>
                        <span className="text-xs text-[#6B7FA0]">• ขนาด: {doc.fileSize}</span>
                        <span className="text-xs text-[#6B7FA0]">• ดาวน์โหลด: {doc.downloads} ครั้ง</span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-[#1E3A5F]">
                        {doc.title}
                      </h3>

                      {doc.description && (
                        <p className="text-xs text-[#4B6080] mt-1 line-clamp-2 max-w-2xl leading-relaxed">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF2FB] hover:bg-[#EBF2FF] text-[#1E3A5F] text-xs font-bold border border-[#D1DFF0] shadow-2xs transition-colors min-h-[38px] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#2F6FED]" />
                      <span>เปิดอ่านออนไลน์</span>
                    </button>

                    {/* Google Drive Link */}
                    {media.driveViewUrl && (
                      <a
                        href={media.driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBF2FF] hover:bg-blue-100/80 text-[#1E3A5F] text-xs font-bold border border-[#2F6FED]/30 shadow-2xs transition-colors min-h-[38px]"
                        title="เปิดไฟล์นี้บน Google Drive โดยตรง"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#2F6FED]" />
                        <span>Google Drive</span>
                      </a>
                    )}

                    {/* Direct Download Button with clean filename */}
                    <button
                      type="button"
                      onClick={() => triggerDocumentDownload(media.downloadUrl, media.fileName)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#1f5bcc] text-white text-xs font-bold shadow-2xs transition-colors min-h-[38px] cursor-pointer"
                      title={`ดาวน์โหลด ${media.fileName}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลดไฟล์</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 p-8 text-slate-500 text-sm">
                ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Asset / Inventory Table with Excel Export: Glassmorphism */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#EAF2FB]/50 border-b border-[#D1DFF0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1E3A5F]">
                  บัญชีรายการครุภัณฑ์และสินทรัพย์สถานศึกษา
                </h3>
                <p className="text-[11px] text-[#6B7FA0]">
                  แสดงรายการครุภัณฑ์ที่ขึ้นทะเบียนคุมพัสดุ สพป. บุรีรัมย์ เขต&nbsp;3 (พบ {filteredAssets.length} รายการ)
                </p>
              </div>

              <span className="text-xs font-semibold text-[#6B7FA0]">
                สถานะข้อมูล: สมบูรณ์
              </span>
            </div>

            <p className="text-[11px] text-[#6B7FA0] sm:hidden px-4 pt-3 flex items-center gap-1">
              <span>👉 เลื่อนซ้าย-ขวาเพื่อดูข้อมูลครุภัณฑ์ทั้งหมด</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                <thead className="bg-[#EAF2FB]/70 text-[#1E3A5F] font-bold border-b border-[#D1DFF0]">
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
                <tbody className="divide-y divide-[#D1DFF0]">
                  {filteredAssets.map((asset, index) => (
                    <tr key={asset.id} className="hover:bg-[#EBF2FF]/40 transition-colors">
                      <td className="p-3.5 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="p-3.5 font-mono text-[11px] font-semibold text-[#1E3A5F] whitespace-nowrap">
                        {asset.code}
                      </td>
                      <td className="p-3.5 font-bold text-[#1E3A5F] max-w-xs">{asset.name}</td>
                      <td className="p-3.5 text-[#4B6080] whitespace-nowrap">{asset.category}</td>
                      <td className="p-3.5 text-center font-mono text-[#4B6080]">{asset.fiscalYear}</td>
                      <td className="p-3.5 text-center font-bold text-[#0F1F30]">
                        {asset.quantity} {asset.unit}
                      </td>
                      <td className="p-3.5 text-[#4B6080]">{asset.location}</td>
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
                      <td colSpan={9} className="text-center py-12 text-slate-400">
                        <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-[#4B6080]">
                          {assetsList.length === 0
                            ? "ยังไม่มีข้อมูลในทะเบียนคุมครุภัณฑ์และสินทรัพย์"
                            : "ไม่พบข้อมูลครุภัณฑ์ที่ตรงกับเงื่อนไขการค้นหา"}
                        </p>
                        <p className="text-xs text-[#6B7FA0] mt-1">
                          {assetsList.length === 0
                            ? "เจ้าหน้าที่พัสดุสามารถเพิ่มและจัดการรายการครุภัณฑ์ได้ผ่านระบบผู้ดูแล"
                            : "ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ"}
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

      {/* TAB 3: Student Statistics Table by Grade & Gender: Glassmorphism */}
      {activeTab === "studentStats" && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#D1DFF0] shadow-xs">
              <span className="text-[11px] font-bold text-[#6B7FA0]">จำนวนนักเรียนทั้งหมด</span>
              <div className="text-2xl font-bold text-[#1E3A5F] mt-1">
                {currentStats.summary.totalStudents} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#D1DFF0] shadow-xs">
              <span className="text-[11px] font-bold text-[#2F6FED]">นักเรียนชาย</span>
              <div className="text-2xl font-bold text-[#2F6FED] mt-1">
                {currentStats.summary.totalMale} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#D1DFF0] shadow-xs">
              <span className="text-[11px] font-bold text-rose-600">นักเรียนหญิง</span>
              <div className="text-2xl font-bold text-rose-800 mt-1">
                {currentStats.summary.totalFemale} <span className="text-xs font-normal text-slate-500">คน</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#D1DFF0] shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600">จำนวนห้องเรียน</span>
              <div className="text-2xl font-bold text-emerald-800 mt-1">
                {currentStats.summary.totalClassrooms} <span className="text-xs font-normal text-slate-500">ห้อง</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#EAF2FB]/50 border-b border-[#D1DFF0] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E3A5F]">
                ข้อมูลสถิตินักเรียน จำแนกตามระดับชั้นและเพศ (ปีการศึกษา {selectedYear})
              </h3>
              <span className="text-xs text-[#6B7FA0] whitespace-nowrap">
                โรงเรียนบ้านหนองหัวหมู สพป. บุรีรัมย์ เขต&nbsp;3
              </span>
            </div>

            <p className="text-[11px] text-[#6B7FA0] sm:hidden px-4 pt-3 flex items-center gap-1">
              <span>👉 เลื่อนซ้าย-ขวาเพื่อดูข้อมูลสถิตินักเรียนทั้งหมด</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[550px]">
                <thead className="bg-[#EAF2FB]/70 text-[#1E3A5F] font-bold border-b border-[#D1DFF0]">
                  <tr>
                    <th className="p-3.5">ระดับชั้น</th>
                    <th className="p-3.5 text-center">เพศชาย (คน)</th>
                    <th className="p-3.5 text-center">เพศหญิง (คน)</th>
                    <th className="p-3.5 text-center">รวม (คน)</th>
                    <th className="p-3.5 text-center">จำนวนห้องเรียน</th>
                    <th className="p-3.5 text-center">เฉลี่ยต่อห้อง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1DFF0]">
                  {currentStats.grades.map((grade) => (
                    <tr key={grade.grade} className="hover:bg-[#EBF2FF]/40 transition-colors">
                      <td className="p-3.5 font-bold text-[#1E3A5F]">{grade.grade}</td>
                      <td className="p-3.5 text-center font-mono text-[#2F6FED]">{grade.male}</td>
                      <td className="p-3.5 text-center font-mono text-rose-800">{grade.female}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#0F1F30]">{grade.total}</td>
                      <td className="p-3.5 text-center font-mono text-[#4B6080]">{grade.classrooms}</td>
                      <td className="p-3.5 text-center font-mono text-[#6B7FA0]">
                        {(grade.total / grade.classrooms).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#EAF2FB]/80 font-bold text-xs text-[#1E3A5F] border-t-2 border-[#D1DFF0]">
                  <tr>
                    <td className="p-3.5 text-[#1E3A5F]">รวมทั้งสิ้น</td>
                    <td className="p-3.5 text-center font-mono text-[#2F6FED]">{currentStats.summary.totalMale}</td>
                    <td className="p-3.5 text-center font-mono text-rose-800">{currentStats.summary.totalFemale}</td>
                    <td className="p-3.5 text-center font-mono font-extrabold text-[#1E3A5F] text-sm">
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
