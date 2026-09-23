"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, BarChart3, Award, Sparkles, ExternalLink, FileDown, UploadCloud, Edit3, X } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import AcademicPerformance from "@/components/home/AcademicPerformance";
import { getStoredOnetPosters, fetchOnetPostersCloud, defaultHistoricalOnetScores, OnetPosterItem } from "@/data/academicScores";

export default function AcademicPage() {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [posters, setPosters] = useState<OnetPosterItem[]>(defaultHistoricalOnetScores);

  useEffect(() => {
    setPosters(getStoredOnetPosters());

    // Fetch from Supabase cloud
    fetchOnetPostersCloud().then((cloudData) => {
      if (cloudData) setPosters(cloudData);
    });

    const handleUpdate = () => {
      setPosters(getStoredOnetPosters());
    };

    window.addEventListener("academic_posters_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("academic_posters_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Display posters that have entered scores or uploaded images
  const activePosters = posters.filter(
    (p) => p.subjects.some((s) => s.school > 0) || p.image.startsWith("data:")
  );
  const displayPosters = activePosters.length > 0 ? activePosters : posters;

  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ผลการทดสอบระดับชาติ" }]}
      title="ผลการทดสอบทางการศึกษาระดับชาติ"
      description="รายงานผลการประเมินคุณภาพผู้เรียนระดับชาติ (O-NET, NT, RT) โรงเรียนบ้านหนองหัวหมู"
    >
      <div className="space-y-8 sm:space-y-10">
        {/* 1. Interactive 3-Level Score Comparison (โรงเรียน • เขตพื้นที่ • ประเทศ) */}
        <AcademicPerformance showHeader={false} />

        {/* 2. Official O-NET Posters Gallery */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>รายงานประกาศผลสอบอย่างเป็นทางการ สทศ.</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F2942] tracking-tight">
                ประกาศผลการทดสอบระดับชาติ O-NET ป.6 ย้อนหลัง {displayPosters.length} ปีการศึกษา
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                ข้อมูลเปรียบเทียบระดับโรงเรียนบ้านหนองหัวหมู กับ ค่าเฉลี่ยระดับประเทศ
              </p>
            </div>

            <Link
              href="/admin/academic"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>จัดการ/อัปโหลดภาพโปสเตอร์ O-NET</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPosters.map((poster) => (
              <div
                key={poster.year}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-slate-200">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-contain p-2 hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => setSelectedPoster(poster.image)}
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0F2942] text-white shadow-xs">
                        ปี {poster.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm text-[#0F2942] leading-snug">
                      {poster.title}
                    </h3>

                    {poster.highlight && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{poster.highlight}</span>
                      </div>
                    )}

                    <div className="divide-y divide-slate-200 text-xs pt-1">
                      {poster.subjects.map((sub, sIdx) => (
                        <div key={sIdx} className="py-2 flex items-center justify-between">
                          <span className="font-medium text-slate-700">{sub.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F2942]">{sub.school.toFixed(2)}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sub.higher
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-rose-100 text-rose-800 border border-rose-200"
                              }`}
                            >
                              {sub.diff}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={poster.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0F2942] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>ดูภาพประกาศขนาดเต็ม</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. โครงสร้าง 8 กลุ่มสาระการเรียนรู้ */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-[#0F2942]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#0F2942]">
              โครงสร้างหลักสูตรสถานศึกษา 8 กลุ่มสาระการเรียนรู้
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              "กลุ่มสาระการเรียนรู้ภาษาไทย",
              "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
              "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
              "กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม",
              "กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา",
              "กลุ่มสาระการเรียนรู้ศิลปะ",
              "กลุ่มสาระการเรียนรู้การงานอาชีพ",
              "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ (ภาษาอังกฤษ)",
            ].map((area, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 flex items-center gap-2.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal for Full Poster View */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPoster(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <img
              src={selectedPoster}
              alt="O-NET Poster Full"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold hover:bg-black"
            >
              ปิดหน้าต่าง ✕
            </button>
          </div>
        </div>
      )}
    </InnerPageLayout>
  );
}
