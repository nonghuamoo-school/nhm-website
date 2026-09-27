import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface InnerPageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export default function InnerPageLayout({
  breadcrumbs,
  title,
  description,
  toolbar,
  children,
}: InnerPageLayoutProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Compact Page Header with Breadcrumbs: Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#D1DFF0] shadow-xs">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#4B6080]">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="hover:text-[#2F6FED] transition-colors flex items-center gap-1 text-[#1E3A5F] font-medium"
              >
                <Home className="w-3.5 h-3.5 text-[#2F6FED]" />
                <span>หน้าแรก</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {isLast || !item.href ? (
                    <span className="font-semibold text-[#0F1F30]" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-[#2F6FED] transition-colors text-[#4B6080]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title with school accent line and Short Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F] tracking-tight leading-snug thai-wrap flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-[#D96B34] rounded-full shrink-0" />
              <span>{title}</span>
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-[#4B6080] mt-1.5 max-w-4xl lg:max-w-5xl leading-relaxed thai-wrap pl-4">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Optional Toolbar (Search, Filter, Actions) */}
        {toolbar && (
          <div className="mt-4 pt-4 border-t border-[#D1DFF0]">
            {toolbar}
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div>{children}</div>
    </div>
  );
}
