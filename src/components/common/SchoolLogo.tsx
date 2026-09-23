"use client";

import React, { useEffect, useState } from "react";
import { schoolInfo } from "@/data/schoolInfo";

interface SchoolLogoProps {
  className?: string;
  size?: number;
  customLogoUrl?: string;
  emblemType?: "vector" | "obec" | "moe" | "custom";
}

export default function SchoolLogo({
  className = "",
  size = 48,
  customLogoUrl: propLogoUrl,
  emblemType: propEmblemType,
}: SchoolLogoProps) {
  const [activeLogoUrl, setActiveLogoUrl] = useState<string>(
    propLogoUrl || "/images/school-logo.png"
  );
  const [activeEmblem, setActiveEmblem] = useState<string>(
    propEmblemType || "custom"
  );

  useEffect(() => {
    const loadFromSettings = () => {
      if (typeof window === "undefined") return;
      try {
        const saved = localStorage.getItem("nhm_school_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          const logo = parsed.customLogoUrl || parsed.logoUrl;
          if (logo && !propLogoUrl) {
            setActiveLogoUrl(logo);
          }
          if (parsed.emblemType && !propEmblemType) {
            setActiveEmblem(parsed.emblemType);
          }
        }
      } catch (e) {
        // fallback to defaults
      }
    };

    loadFromSettings();

    window.addEventListener("storage", loadFromSettings);
    window.addEventListener("nhm_settings_updated", loadFromSettings);

    return () => {
      window.removeEventListener("storage", loadFromSettings);
      window.removeEventListener("nhm_settings_updated", loadFromSettings);
    };
  }, [propLogoUrl, propEmblemType]);

  // Sync if props change directly
  useEffect(() => {
    if (propLogoUrl !== undefined) {
      setActiveLogoUrl(propLogoUrl || "/images/school-logo.png");
    }
  }, [propLogoUrl]);

  useEffect(() => {
    if (propEmblemType !== undefined) {
      setActiveEmblem(propEmblemType);
    }
  }, [propEmblemType]);

  // If custom logo image URL is set or emblem is custom (default)
  if (activeEmblem === "custom" || (!propEmblemType && activeLogoUrl)) {
    const logoSrc = activeLogoUrl || "/images/school-logo.png";
    return (
      <div
        className={`relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400/80 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoSrc}
          alt={schoolInfo.name}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/school-logo.png";
          }}
        />
      </div>
    );
  }

  // OBEC / สพฐ. Logo Preset
  if (activeEmblem === "obec") {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 text-white shadow-md border-2 border-amber-300/80 shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-label="ตรา สพฐ. กระทรวงศึกษาธิการ"
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="40" fill="#b45309" opacity="0.4" />
          <path d="M50 15 L58 35 L50 42 L42 35 Z" fill="#fef08a" />
          <circle cx="50" cy="28" r="3" fill="#ffffff" />
          <path d="M32 46 C42 40 58 40 68 46 L65 72 C55 68 45 68 35 72 Z" fill="#ffffff" />
          <path d="M38 78 C46 75 54 75 62 78 L60 83 C54 81 46 81 40 83 Z" fill="#fef08a" />
          <text x="50" y="60" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0f2942">
            สพฐ.
          </text>
        </svg>
      </div>
    );
  }

  // MOE / เสมาธรรมจักร Preset
  if (activeEmblem === "moe") {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-amber-300 shadow-md border-2 border-amber-400 shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-label="ตราเสมาธรรมจักร กระทรวงศึกษาธิการ"
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="5" fill="#fef08a" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 42 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 42 * Math.sin((angle * Math.PI) / 180)}
              stroke="#fef08a"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    );
  }

  // Default: Official Vector Emblem for Ban Nong Hua Mu School
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#0F2942] via-blue-950 to-slate-900 text-amber-400 shadow-md border-2 border-amber-300/80 shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="ตราประจำโรงเรียนบ้านหนองหัวหมู"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-4/5 h-4/5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Decorative outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        {/* Inner circle */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2.5" />
        {/* Flame / Lotus top torch */}
        <path
          d="M50 16 C47 24 43 28 46 34 C48 37 52 37 54 34 C57 28 53 24 50 16 Z"
          fill="#f59e0b"
        />
        <circle cx="50" cy="27" r="2.5" fill="#fef08a" />
        {/* Book / Wisdom symbol */}
        <path
          d="M26 62 C34 58 43 59 50 63 C57 59 66 58 74 62 L74 44 C66 40 57 41 50 45 C43 41 34 40 26 44 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        <line x1="50" y1="45" x2="50" y2="63" stroke="#0f172a" strokeWidth="2" />
        {/* Rays of dawn */}
        <path
          d="M38 35 L33 30 M50 32 L50 25 M62 35 L67 30"
          stroke="#fef08a"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Ribbon / Scroll banner */}
        <path
          d="M30 76 C40 73 60 73 70 76 L68 81 C60 78 40 78 32 81 Z"
          fill="#eab308"
        />
        {/* Tiny initials NHM */}
        <text
          x="50"
          y="71"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
          fill="#0f2942"
        >
          น.ห.ม.
        </text>
      </svg>
    </div>
  );
}
