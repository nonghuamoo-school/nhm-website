import { StudentYearStat } from "@/types";

export const defaultSchoolStudentStats: Record<string, StudentYearStat> = {
  "2568": {
    academicYear: "2568",
    updatedDate: "10 มีนาคม 2568",
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
  "2567": {
    academicYear: "2567",
    updatedDate: "10 พฤศจิกายน 2567",
    grades: [
      { grade: "อนุบาล 2 (4 ขวบ)", male: 5, female: 6, total: 11, classrooms: 1 },
      { grade: "อนุบาล 3 (5 ขวบ)", male: 6, female: 6, total: 12, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 1", male: 7, female: 6, total: 13, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 2", male: 8, female: 6, total: 14, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 3", male: 8, female: 7, total: 15, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 4", male: 7, female: 7, total: 14, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 5", male: 6, female: 7, total: 13, classrooms: 1 },
      { grade: "ประถมศึกษาปีที่ 6", male: 7, female: 6, total: 13, classrooms: 1 },
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

export function getStoredStudentStats(): Record<string, StudentYearStat> {
  if (typeof window === "undefined") {
    return defaultSchoolStudentStats;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSchoolStudentStats;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
      return { ...defaultSchoolStudentStats, ...parsed };
    }
    return defaultSchoolStudentStats;
  } catch {
    return defaultSchoolStudentStats;
  }
}

export function saveStoredStudentStats(data: Record<string, StudentYearStat>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("student_stats_updated"));
  } catch (err) {
    console.error("Failed to save student stats to localStorage:", err);
  }
}

export function resetStoredStudentStats(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("student_stats_updated"));
  } catch (err) {
    console.error("Failed to reset student stats in localStorage:", err);
  }
}

