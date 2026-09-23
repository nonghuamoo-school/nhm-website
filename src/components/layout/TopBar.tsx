"use client";

import React, { useState, useEffect } from "react";
import { Eye, Phone } from "lucide-react";
import { schoolInfo } from "@/data/schoolInfo";
import { visitorService } from "@/services/visitorService";

export default function TopBar() {
  const [visitorCount, setVisitorCount] = useState<number>(12458);
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(0);

  useEffect(() => {
    const count = visitorService.recordVisit();
    setVisitorCount(count);
  }, []);

  const cycleFontSize = () => {
    const next = (fontSizeIndex + 1) % 3;
    setFontSizeIndex(next);
    const root = document.documentElement;
    if (next === 0) {
      root.removeAttribute("data-font-size");
    } else if (next === 1) {
      root.setAttribute("data-font-size", "large");
    } else {
      root.setAttribute("data-font-size", "xlarge");
    }
  };

  return (
    <div className="h-8 sm:h-9 bg-[#091A2B] text-slate-300 text-[11px] sm:text-xs border-b border-slate-800 flex items-center overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Left: Official Affiliation (Responsive: Short on mobile, full on desktop) */}
        <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate">
          <span className="font-bold text-sky-400">สพฐ.</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline truncate">{schoolInfo.subAffiliation}</span>
          <span className="sm:hidden truncate">สพป. บุรีรัมย์ เขต 3</span>
        </div>

        {/* Right: Visitor Counter & Accessibility */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Visitor count */}
          <div className="flex items-center gap-1 text-slate-300 font-medium">
            <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden md:inline">ผู้เข้าชม</span>
            <strong className="text-white font-bold font-mono">
              {visitorCount.toLocaleString()}
            </strong>
            <span className="hidden md:inline">ครั้ง</span>
          </div>

          {/* Telephone (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-700">|</span>
            <Phone className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{schoolInfo.phone}</span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Accessibility Font Size Toggle */}
          <button
            type="button"
            onClick={cycleFontSize}
            className="flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="ปรับขนาดตัวอักษร"
            aria-label="ปรับขนาดตัวอักษร"
          >
            <span className="font-bold text-[10px]">A</span>
            <span className="font-bold text-xs">A</span>
            <span className="text-[10px] text-amber-400 font-sans ml-0.5">
              {fontSizeIndex === 0 ? "ปกติ" : fontSizeIndex === 1 ? "+1" : "+2"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
