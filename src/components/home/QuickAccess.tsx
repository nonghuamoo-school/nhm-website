import React from "react";
import Link from "next/link";
import {
  Building2,
  UserCheck,
  Megaphone,
  TrendingUp,
  DownloadCloud,
  Laptop,
  ArrowRight
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { quickLinks } from "@/data/quickLinks";

const iconMap = {
  Building2: Building2,
  UserCheck: UserCheck,
  Megaphone: Megaphone,
  TrendingUp: TrendingUp,
  DownloadCloud: DownloadCloud,
  Laptop: Laptop,
};

export default function QuickAccess() {
  return (
    <section>
      <SectionTitle
        title="เมนูด่วน / บริการหลัก (Quick Access)"
        subtitle="เข้าถึงข้อมูลสำคัญและบริการออนไลน์ของโรงเรียนได้อย่างรวดเร็ว"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {quickLinks.map((item) => {
          const IconComp = iconMap[item.icon as keyof typeof iconMap] || Building2;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] font-medium text-blue-600 group-hover:text-blue-800">
                <span>เข้าสู่เมนู</span>
                <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
