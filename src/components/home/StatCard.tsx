import React from "react";
import { Users, GraduationCap, School, Award } from "lucide-react";
import { schoolStats } from "@/data/stats";

const iconMap = {
  Users: Users,
  GraduationCap: GraduationCap,
  School: School,
  Award: Award,
};

export default function StatCard() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {schoolStats.map((stat) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
        const isPlaceholder = stat.value.toString().startsWith("[");

        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 line-clamp-1">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.colorClass}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 min-h-[36px]">
              <span
                className={`${
                  isPlaceholder
                    ? "text-base font-semibold text-slate-400"
                    : "text-3xl font-extrabold text-slate-900"
                } tracking-tight`}
              >
                {stat.value}
              </span>
              {!isPlaceholder && stat.unit && (
                <span className="text-sm font-medium text-slate-600">{stat.unit}</span>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate">{stat.description}</span>
              {stat.change && !stat.change.startsWith("[") && (
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium text-[11px] shrink-0 ml-1">
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
