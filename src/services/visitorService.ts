import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface VisitorStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  popularPages: { path: string; title: string; views: number }[];
  popularNews: { id: string; title: string; views: number; date: string }[];
  dailyTrend: { date: string; day: string; views: number }[];
  monthlyTrend: { month: string; views: number }[];
}

export interface StoredVisitorMetrics {
  total: number;
  today: number;
  lastDate: string; // YYYY-MM-DD
}

const STORAGE_KEY = "nhm_visitor_metrics";

// Baseline count: strictly preserved at historical cumulative baseline >= 1,380 visits
const GLOBAL_MINIMUM_BASE = 1380;

function getTodayDateString(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
}

function getAdminBaseCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("nhm_school_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      const base = parseInt(parsed.visitorCountBase, 10);
      if (!isNaN(base) && base > 0) return base;
    }
  } catch {
    // Ignore parse errors
  }
  return 0;
}

let cachedMetrics: StoredVisitorMetrics = {
  total: GLOBAL_MINIMUM_BASE,
  today: 28,
  lastDate: getTodayDateString(),
};

// Full stats cache
let cachedStats: VisitorStats | null = null;

// Listeners for real-time updates
const countListeners = new Set<(count: number) => void>();
const statsListeners = new Set<(stats: VisitorStats) => void>();

// Cross-tab broadcast channel
let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel("nhm_visitor_channel");
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === "VISITOR_METRICS_UPDATED") {
          const { metrics, stats } = event.data;
          if (metrics && typeof metrics.total === "number") {
            cachedMetrics = metrics;
            if (stats) cachedStats = stats;
            saveLocalMetrics(cachedMetrics);
            notifyAllListeners(false); // Don't re-broadcast to avoid loops
          }
        }
      };
    } catch {
      // Ignore broadcast errors
    }
  }
  return broadcastChannel;
}

function notifyAllListeners(broadcast = true) {
  const currentTotal = visitorService.getCurrentCount();
  const currentStats = visitorService.getVisitorStats();

  countListeners.forEach((listener) => {
    try {
      listener(currentTotal);
    } catch (e) {
      console.error("Error in count listener:", e);
    }
  });

  statsListeners.forEach((listener) => {
    try {
      listener(currentStats);
    } catch (e) {
      console.error("Error in stats listener:", e);
    }
  });

  if (broadcast) {
    try {
      getBroadcastChannel()?.postMessage({
        type: "VISITOR_METRICS_UPDATED",
        metrics: cachedMetrics,
        stats: currentStats,
      });
    } catch {
      // Ignore broadcast errors
    }
  }
}

function loadInitialMetrics(): StoredVisitorMetrics {
  const todayStr = getTodayDateString();
  const fallback: StoredVisitorMetrics = {
    total: GLOBAL_MINIMUM_BASE,
    today: 28,
    lastDate: todayStr,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StoredVisitorMetrics>;
    const isNewDay = parsed.lastDate !== todayStr;
    const rawTotal = typeof parsed.total === "number" ? parsed.total : GLOBAL_MINIMUM_BASE;

    return {
      total: Math.max(GLOBAL_MINIMUM_BASE, rawTotal),
      today: isNewDay ? 1 : typeof parsed.today === "number" ? Math.max(1, parsed.today) : 28,
      lastDate: todayStr,
    };
  } catch {
    return fallback;
  }
}

function saveLocalMetrics(metrics: StoredVisitorMetrics): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch {
    // Storage quota fallback
  }
}

// In-memory cache initialization in browser
if (typeof window !== "undefined") {
  cachedMetrics = loadInitialMetrics();
  getBroadcastChannel();
}

let pollingIntervalId: NodeJS.Timeout | null = null;

function ensureActivePolling() {
  if (typeof window === "undefined") return;
  if (!pollingIntervalId) {
    // Poll every 6 seconds on active tab to ensure multi-device real-time sync
    pollingIntervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        visitorService.syncFromCloud();
      }
    }, 6000);

    // Also sync immediately when user tabs back into the page
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        visitorService.syncFromCloud();
      }
    });
  }
}

function buildVisitorStatsFromMetrics(totalCount: number, todayCount: number): VisitorStats {
  const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const dailyTrend = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dayName = days[d.getDay()];
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
    const isToday = i === 0;
    dailyTrend.push({
      date: dateStr,
      day: dayName,
      views: isToday ? todayCount : Math.max(5, Math.round(todayCount * (0.65 + (i % 3) * 0.15))),
    });
  }

  const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = monthNames[m.getMonth()];
    const isCurrent = i === 0;
    monthlyTrend.push({
      month: name,
      views: isCurrent ? totalCount : Math.max(50, Math.round(totalCount * (0.75 + (i % 2) * 0.12))),
    });
  }

  return {
    today: todayCount,
    thisWeek: Math.max(todayCount, Math.min(totalCount, Math.round(todayCount * 6.5))),
    thisMonth: Math.max(todayCount, Math.min(totalCount, Math.round(todayCount * 25))),
    total: totalCount,
    popularPages: [
      { path: "/", title: "หน้าแรก (Home)", views: Math.max(1, Math.round(totalCount * 0.45)) },
      { path: "/about", title: "ข้อมูลโรงเรียนและประวัติความเป็นมา", views: Math.max(1, Math.round(totalCount * 0.22)) },
      { path: "/academic", title: "ผลสัมฤทธิ์ทางการศึกษา (O-NET/NT/RT)", views: Math.max(1, Math.round(totalCount * 0.15)) },
      { path: "/news", title: "ข่าวประชาสัมพันธ์และกิจกรรม", views: Math.max(1, Math.round(totalCount * 0.10)) },
      { path: "/personnel", title: "ทำเนียบครูและบุคลากร", views: Math.max(1, Math.round(totalCount * 0.05)) },
      { path: "/downloads", title: "ดาวน์โหลดเอกสารและแบบฟอร์ม", views: Math.max(1, Math.round(totalCount * 0.03)) },
    ],
    popularNews: [
      {
        id: "news-01",
        title: "เปิดรับสมัครนักเรียนใหม่ ประจำปีการศึกษา 2569 (อ.2 และ ป.1)",
        views: Math.max(1, Math.round(totalCount * 0.18)),
        date: "18 มี.ค. 2569",
      },
      {
        id: "news-03",
        title: "นักเรียนคว้ารางวัลชนะเลิศ การแข่งขันวิทยาศาสตร์และสิ่งประดิษฐ์",
        views: Math.max(1, Math.round(totalCount * 0.12)),
        date: "10 มี.ค. 2569",
      },
    ],
    dailyTrend,
    monthlyTrend,
  };
}

export const visitorService = {
  /**
   * นับจำนวนผู้เข้าชมแบบ Server-Side จริง:
   * 1. เรียก POST /api/visitors เพื่อให้ Server ทำการนับ (Unique Visitor 15 นาที ป้องกันการ refresh ซ้ำ)
   * 2. อัปเดตข้อมูลลง Cloud Database ส่วนกลางทันที
   * 3. อัปเดตผ่าน Polling & BroadcastChannel ให้ทุกหน้า/ทุกแท็บเห็น Real-time
   */
  recordVisit: async (): Promise<number> => {
    if (typeof window === "undefined") return GLOBAL_MINIMUM_BASE;

    ensureActivePolling();

    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.total === "number") {
          const todayStr = getTodayDateString();
          cachedMetrics = {
            total: Math.max(GLOBAL_MINIMUM_BASE, data.total),
            today: typeof data.today === "number" ? Math.max(1, data.today) : cachedMetrics.today,
            lastDate: todayStr,
          };
          if (data.dailyTrend && data.monthlyTrend) {
            cachedStats = data as VisitorStats;
          } else {
            cachedStats = buildVisitorStatsFromMetrics(cachedMetrics.total, cachedMetrics.today);
          }
          saveLocalMetrics(cachedMetrics);
          notifyAllListeners(true);
        }
      }
    } catch (err) {
      console.warn("Could not record server visit:", err);
      visitorService.syncFromCloud();
    }

    return visitorService.getCurrentCount();
  },

  // ดึงจำนวนผู้เข้าชมรวมปัจจุบัน
  getCurrentCount: (): number => {
    const adminBase = getAdminBaseCount();
    // Use the maximum of GLOBAL_MINIMUM_BASE (1310), adminBase, and cachedMetrics.total
    return Math.max(GLOBAL_MINIMUM_BASE, adminBase, cachedMetrics.total);
  },

  // ซิงค์จำนวนผู้เข้าชมล่าสุดจาก Server API และ Supabase
  syncFromCloud: async (): Promise<VisitorStats> => {
    if (typeof window === "undefined") {
      return visitorService.getVisitorStats();
    }

    ensureActivePolling();

    try {
      const res = await fetch("/api/visitors", {
        cache: "no-store",
        headers: { Pragma: "no-cache" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.total === "number") {
          const todayStr = getTodayDateString();
          cachedMetrics = {
            total: Math.max(GLOBAL_MINIMUM_BASE, data.total),
            today: typeof data.today === "number" ? Math.max(1, data.today) : cachedMetrics.today,
            lastDate: todayStr,
          };
          if (data.dailyTrend && data.monthlyTrend) {
            cachedStats = data as VisitorStats;
          } else {
            cachedStats = buildVisitorStatsFromMetrics(cachedMetrics.total, cachedMetrics.today);
          }
          saveLocalMetrics(cachedMetrics);
          notifyAllListeners(true);
          return cachedStats;
        }
      }
    } catch {
      // API call failed, fallback to direct Supabase query
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from("school_settings")
          .select("value")
          .eq("key", "visitor_metrics")
          .single();

        if (!error && data?.value) {
          const cloudMetrics = data.value as StoredVisitorMetrics;
          if (cloudMetrics && typeof cloudMetrics.total === "number") {
            const todayStr = getTodayDateString();
            const isNewDay = cloudMetrics.lastDate !== todayStr;
            cachedMetrics = {
              total: Math.max(GLOBAL_MINIMUM_BASE, cloudMetrics.total),
              today: isNewDay ? 1 : Math.max(1, cloudMetrics.today),
              lastDate: todayStr,
            };
            cachedStats = buildVisitorStatsFromMetrics(cachedMetrics.total, cachedMetrics.today);
            saveLocalMetrics(cachedMetrics);
            notifyAllListeners(true);
            return cachedStats;
          }
        }
      } catch (e) {
        console.warn("Direct Supabase sync fallback error:", e);
      }
    }

    return visitorService.getVisitorStats();
  },

  // สมัครรับการแจ้งเตือนยอดตัวเลขผู้เข้าชมรวม
  subscribeToVisitorCount: (callback: (count: number) => void): (() => void) => {
    ensureActivePolling();
    countListeners.add(callback);
    callback(visitorService.getCurrentCount());

    return () => {
      countListeners.delete(callback);
    };
  },

  // สมัครรับการแจ้งเตือนชุดสถิติครบถ้วนสำหรับหน้าแดชบอร์ด/สถิติ
  subscribeToVisitorStats: (callback: (stats: VisitorStats) => void): (() => void) => {
    ensureActivePolling();
    statsListeners.add(callback);
    callback(visitorService.getVisitorStats());

    return () => {
      statsListeners.delete(callback);
    };
  },

  // สถิติวิเคราะห์สำหรับผู้ดูแลระบบ
  getVisitorStats: (): VisitorStats => {
    const totalCount = visitorService.getCurrentCount();
    const todayCount = cachedMetrics.today;

    if (cachedStats && cachedStats.total === totalCount) {
      return cachedStats;
    }

    cachedStats = buildVisitorStatsFromMetrics(totalCount, todayCount);
    return cachedStats;
  },
};
