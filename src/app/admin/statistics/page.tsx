"use client";

import React, { useState } from "react";
import {
  Eye,
  TrendingUp,
  Calendar,
  BarChart3,
  FileText,
  Globe,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { visitorService } from "@/services/visitorService";
import StudentAnalyticsWidget from "@/components/charts/StudentAnalyticsWidget";
import AcademicPerformanceChart from "@/components/academic/AcademicPerformanceChart";

export default function AdminStatisticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const stats = visitorService.getVisitorStats();

  // Find maximum view count to scale bars cleanly
  const maxDaily = Math.max(1, ...stats.dailyTrend.map((d) => d.views));
  const maxMonthly = Math.max(1, ...stats.monthlyTrend.map((m) => m.views));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            การวิเคราะห์ข้อมูลและสถิติ (Analytics)
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] mt-0.5">
            สถิติผู้เข้าชมเว็บไซต์สถานศึกษา
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            รายงานสถิติการเข้าใช้งาน ความนิยมของหน้าเว็บ และแนวโน้มความสนใจ
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E7EB] text-xs font-semibold">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeRange === "7d"
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ย้อนหลัง 7 วัน
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeRange === "30d"
                ? "bg-[#0F2942] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            รายเดือน (30 วัน)
          </button>
        </div>
      </div>

      {/* 4 Analytical KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">วันนี้</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0F2942] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0F2942]">
            {stats.today.toLocaleString()} ครั้ง
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% จากเฉลี่ยรายวัน</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">สัปดาห์นี้</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0F2942]">
            {stats.thisWeek.toLocaleString()} ครั้ง
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            เฉลี่ย 180 ครั้ง/วัน
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">เดือนนี้</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0F2942]">
            {stats.thisMonth.toLocaleString()} ครั้ง
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            ครอบคลุมทุกช่องทาง
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">ยอดรวมทั้งหมด</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0F2942]">
            {stats.total.toLocaleString()} ครั้ง
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            แสดงบนแถบ Utility Bar สาธารณะ
          </span>
        </div>
      </div>

      {/* Chart Visualization Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-[#0F2942]">
              {timeRange === "7d"
                ? "กราฟแสดงแนวโน้มผู้เข้าชมย้อนหลัง 7 วัน"
                : "กราฟแสดงแนวโน้มผู้เข้าชมย้อนหลัง 6 เดือน"}
            </h2>
            <p className="text-xs text-slate-500">
              {timeRange === "7d"
                ? "จำแนกจำนวนการเข้าชมตามวันในสัปดาห์"
                : "จำแนกจำนวนการเข้าชมตามรายเดือน"}
            </p>
          </div>
        </div>

        {/* 7-Day Chart */}
        {timeRange === "7d" ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 pt-6">
              {stats.dailyTrend.map((d, i) => {
                const heightPercent = Math.round((d.views / maxDaily) * 100);
                return (
                  <div key={i} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#0F2942] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.views}
                    </span>
                    <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#0F2942] group-hover:bg-[#163C61] rounded-t-lg transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">
                      {d.day}
                    </span>
                    <span className="text-[10px] text-slate-400">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 30-Day / Monthly Chart */
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-44 sm:h-52 pt-6">
              {stats.monthlyTrend.map((m, i) => {
                const heightPercent = Math.round((m.views / maxMonthly) * 100);
                return (
                  <div key={i} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#0F2942] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {m.views.toLocaleString()}
                    </span>
                    <div className="w-full max-w-[44px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#0F2942] group-hover:bg-[#163C61] rounded-t-lg transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 mt-2">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Breakdown Tables: Popular Pages & Popular News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <Globe className="w-4 h-4 text-[#0F2942]" />
            <h3 className="text-sm font-bold text-[#0F2942]">
              หน้าเว็บที่มีผู้เข้าชมสูงสุด (Popular Pages)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats.popularPages.map((page, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50"
              >
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 block truncate">
                    {page.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{page.path}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F2942]">
                    {page.views.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-[10px] block">ครั้ง</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular News */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <FileText className="w-4 h-4 text-[#0F2942]" />
            <h3 className="text-sm font-bold text-[#0F2942]">
              ข่าวประชาสัมพันธ์ที่มีผู้เข้าชมสูงสุด (Popular News)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats.popularNews.map((news, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50"
              >
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 block truncate">
                    {news.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{news.date}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F2942]">
                    {news.views.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-[10px] block">ครั้ง</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Demographics & Capsule Bars */}
      <StudentAnalyticsWidget />

      {/* Academic Score Benchmark Chart */}
      <AcademicPerformanceChart />
    </div>
  );
}
