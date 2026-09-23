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
      {/* Compact Page Header with Breadcrumbs */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="hover:text-[#0F2942] transition-colors flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>หน้าแรก</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {isLast || !item.href ? (
                    <span className="font-semibold text-slate-800" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-[#0F2942] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title and Short Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942] tracking-tight leading-snug thai-wrap">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed thai-wrap">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Optional Toolbar (Search, Filter, Actions) */}
        {toolbar && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            {toolbar}
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div>{children}</div>
    </div>
  );
}
