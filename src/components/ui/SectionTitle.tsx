import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  centered?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  actionText,
  actionHref,
  centered = false,
}: SectionTitleProps) {
  return (
    <div
      className={`mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 ${
        centered ? "text-center md:text-center items-center" : ""
      }`}
    >
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-1.5 h-5 rounded-full bg-[#D96B34] shrink-0" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1E3A5F]">
            {title}
          </h2>
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-[#4B6080] pl-4">{subtitle}</p>}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2F6FED] hover:text-[#1f5bcc] transition-colors group"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
