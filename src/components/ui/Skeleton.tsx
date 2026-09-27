import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Skeleton element with glassy blue-gray shimmer effect
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`nhm-shimmer rounded-xl ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * News Card Skeleton for grid views
 */
export function NewsCardSkeleton() {
  return (
    <div className="glass-card bg-white/70 backdrop-blur-sm rounded-2xl border border-[#D1DFF0] shadow-xs overflow-hidden flex flex-col h-full">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-5 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Side News Skeleton for homepage compact list
 */
export function SideNewsSkeleton() {
  return (
    <div className="glass-card flex gap-3.5 bg-white/70 backdrop-blur-sm rounded-2xl p-3.5 border border-[#D1DFF0] items-center">
      <Skeleton className="w-24 h-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-3.5 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

/**
 * News Grid Skeleton
 */
export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Personnel Card Skeleton matching PersonnelCard layout
 */
export function PersonnelCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl border border-[#D1DFF0] shadow-xs p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-stretch gap-3.5 sm:gap-0 justify-between h-full">
      {/* Profile Image Avatar Skeleton */}
      <div className="relative shrink-0 mb-0 sm:mb-3 flex justify-center">
        <Skeleton className="w-20 h-24 sm:w-26 sm:h-32 rounded-2xl border-2 border-slate-200/60" />
      </div>

      {/* Details Skeleton */}
      <div className="flex-1 min-w-0 sm:w-full flex flex-col justify-between space-y-2">
        <div className="space-y-2 sm:text-center flex flex-col sm:items-center">
          {/* Name */}
          <Skeleton className="h-4.5 w-3/4 sm:w-2/3 rounded-md" />

          {/* Primary Badge */}
          <Skeleton className="h-6 w-full rounded-lg" />

          {/* Secondary Badge */}
          <Skeleton className="h-5 w-4/5 rounded-md" />
        </div>

        {/* Bottom Tag */}
        <div className="pt-2 border-t border-slate-100/60 flex justify-center sm:justify-center">
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Personnel Grid Skeleton
 */
export function PersonnelGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PersonnelCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Metric Card Skeleton for Analytics Dashboard
 */
export function MetricCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 border border-[#D1DFF0] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-11 h-11 rounded-2xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="pt-3 border-t border-slate-100">
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>
    </div>
  );
}
