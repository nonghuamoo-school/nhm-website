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
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors group"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
