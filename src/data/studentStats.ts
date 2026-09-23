import { StudentYearStat } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const defaultSchoolStudentStats: Record<string, StudentYearStat> = {
  "2569": {
    academicYear: "2569",
    updatedDate: "10 มิถุนายน 2569",
    grades: [
      { grade: "อนุบาล 2 (4 ขวบ)", male: 5, female: 5, total: 10, classrooms: 1 },
      { grade: "อนุบาล 3 (5 ขวบ)", male: 6, female: 6, total: 12, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 1", male: 7, female: 7, total: 14, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 2", male: 7, female: 6, total: 13, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 3", male: 8, female: 6, total: 14, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 4", male: 8, female: 7, total: 15, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 5", male: 7, female: 7, total: 14, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 6", male: 6, female: 7, total: 13, classrooms: 1 },
    ],
    summary: {
      totalMale: 54,
      totalFemale: 51,
      totalStudents: 105,
      totalClassrooms: 8,
    },
  },
};

export const schoolStudentStats = defaultSchoolStudentStats;

const STORAGE_KEY = "nhm_student_stats_v2";
const CLOUD_KEY = "student_stats";

// Read from localStorage with 2569 as primary baseline
export function getStoredStudentStats(): Record<string, StudentYearStat> {
  if (typeof window === "undefined") {
    return defaultSchoolStudentStats;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSchoolStudentStats;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
      if (!parsed["2569"]) {
        parsed["2569"] = defaultSchoolStudentStats["2569"];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    return defaultSchoolStudentStats;
  } catch {
    return defaultSchoolStudentStats;
  }
}

// Save to localStorage + Supabase cloud
export async function saveStoredStudentStats(data: Record<string, StudentYearStat>): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("student_stats_updated"));
  } catch (err) {
    console.error("Failed to save student stats to localStorage:", err);
  }

  // Sync to Supabase cloud
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from("school_settings")
        .upsert({ key: CLOUD_KEY, value: data, updated_at: new Date().toISOString() });
    } catch (cloudErr) {
      console.warn("Could not sync student stats to Supabase:", cloudErr);
    }
  }
}

// Fetch from Supabase cloud → update localStorage
export async function fetchStudentStatsCloud(): Promise<Record<string, StudentYearStat> | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("school_settings")
      .select("value")
      .eq("key", CLOUD_KEY)
      .single();
    if (!error && data && data.value && typeof data.value === "object" && Object.keys(data.value).length > 0) {
      // Update localStorage cache
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
        window.dispatchEvent(new Event("student_stats_updated"));
      }
      return data.value as Record<string, StudentYearStat>;
    }
    return null;
  } catch {
    return null;
  }
}

export async function resetStoredStudentStats(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("student_stats_updated"));
  } catch (err) {
    console.error("Failed to reset student stats in localStorage:", err);
  }

  // Also reset in cloud
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("school_settings").delete().eq("key", CLOUD_KEY);
    } catch (cloudErr) {
      console.warn("Could not reset student stats in Supabase:", cloudErr);
    }
  }
}
