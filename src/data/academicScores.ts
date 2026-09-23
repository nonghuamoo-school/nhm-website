export interface AcademicScoreItem {
  name: string; // e.g. "ภาษาไทย"
  school: number; // โรงเรียน
  area: number; // เขตพื้นที่
  national: number; // ประเทศ
}

export interface ExamDataset {
  id: "O-NET" | "NT" | "RT";
  title: string;
  grade: string;
  year: string;
  source: string;
  subjects: AcademicScoreItem[];
  posterImageUrl?: string;
}

export const defaultAcademicScores: Record<string, ExamDataset> = {
  "O-NET": {
    id: "O-NET",
    title: "ค่าเฉลี่ยคะแนน O-NET ป.6 (ล่าสุด)",
    grade: "ชั้นประถมศึกษาปีที่ 6",
    year: "2568",
    source: "สทศ.",
    posterImageUrl: "/images/onet-2568.png",
    subjects: [
      { name: "ภาษาไทย", school: 67.50, area: 54.50, national: 47.60 },
      { name: "คณิตศาสตร์", school: 31.34, area: 28.10, national: 24.90 },
      { name: "วิทยาศาสตร์", school: 43.13, area: 39.20, national: 35.43 },
      { name: "ภาษาอังกฤษ", school: 24.22, area: 28.80, national: 33.58 },
      { name: "รวมเฉลี่ย 4 วิชา", school: 41.55, area: 37.65, national: 35.38 },
    ],
  },
  "RT": {
    id: "RT",
    title: "ค่าเฉลี่ยคะแนน RT ป.1",
    grade: "ชั้นประถมศึกษาปีที่ 1",
    year: "2567",
    source: "สทศ.",
    subjects: [
      { name: "RT1 (อ่านออกเสียง)", school: 90.42, area: 81.20, national: 80.28 },
      { name: "RT2 (อ่านรู้เรื่อง)", school: 80.14, area: 78.50, national: 77.16 },
      { name: "รวมเฉลี่ย", school: 85.28, area: 79.85, national: 78.72 },
    ],
  },
  "NT": {
    id: "NT",
    title: "ค่าเฉลี่ยคะแนน NT ป.3",
    grade: "ชั้นประถมศึกษาปีที่ 3",
    year: "2567",
    source: "สทศ.",
    subjects: [
      { name: "คณิตศาสตร์", school: 57.20, area: 54.10, national: 54.00 },
      { name: "ภาษาไทย", school: 59.50, area: 56.20, national: 56.10 },
      { name: "รวมเฉลี่ย", school: 58.35, area: 55.15, national: 55.05 },
    ],
  },
};

export interface OnetPosterSubject {
  name: string;
  school: number;
  national: number;
  diff: string;
  higher: boolean;
}

export interface OnetPosterItem {
  year: string;
  title: string;
  image: string;
  highlight?: string;
  subjects: OnetPosterSubject[];
}

export const defaultHistoricalOnetScores: OnetPosterItem[] = [
  {
    year: "2568",
    title: "ผลการทดสอบ O-NET ป.6 ปีการศึกษา 2568",
    image: "/images/onet-2568.png",
    subjects: [
      { name: "ภาษาไทย", school: 67.50, national: 47.60, diff: "+19.90", higher: true },
      { name: "คณิตศาสตร์", school: 31.34, national: 24.90, diff: "+6.44", higher: true },
      { name: "วิทยาศาสตร์", school: 43.13, national: 35.43, diff: "+7.70", higher: true },
      { name: "ภาษาอังกฤษ", school: 24.22, national: 33.58, diff: "-9.36", higher: false },
    ],
  },
  {
    year: "2567",
    title: "ผลการทดสอบ O-NET ป.6 ปีการศึกษา 2567 (สูงกว่าระดับประเทศทุกวิชา)",
    image: "/images/onet-2567.png",
    highlight: "สูงกว่าระดับประเทศทุกรายวิชา",
    subjects: [
      { name: "ภาษาไทย", school: 63.14, national: 54.20, diff: "+8.94", higher: true },
      { name: "คณิตศาสตร์", school: 40.46, national: 29.21, diff: "+11.25", higher: true },
      { name: "วิทยาศาสตร์", school: 46.07, national: 42.87, diff: "+3.20", higher: true },
      { name: "ภาษาอังกฤษ", school: 34.82, national: 33.49, diff: "+1.33", higher: true },
    ],
  },
  {
    year: "2566",
    title: "ผลการทดสอบ O-NET ป.6 ปีการศึกษา 2566",
    image: "/images/onet-2566.png",
    subjects: [
      { name: "ภาษาไทย", school: 67.61, national: 57.30, diff: "+10.31", higher: true },
      { name: "คณิตศาสตร์", school: 34.71, national: 29.96, diff: "+4.75", higher: true },
      { name: "วิทยาศาสตร์", school: 52.86, national: 40.75, diff: "+12.11", higher: true },
      { name: "ภาษาอังกฤษ", school: 33.04, national: 37.32, diff: "-4.28", higher: false },
    ],
  },
];

export const historicalOnetScores = defaultHistoricalOnetScores;

const STORAGE_KEY = "nhm_academic_scores_v3";
const POSTERS_STORAGE_KEY = "nhm_academic_posters_v2";

export function getStoredAcademicScores(): Record<string, ExamDataset> {
  if (typeof window === "undefined") {
    return defaultAcademicScores;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAcademicScores;
    const parsed = JSON.parse(raw);
    return { ...defaultAcademicScores, ...parsed };
  } catch {
    return defaultAcademicScores;
  }
}

export function saveStoredAcademicScores(data: Record<string, ExamDataset>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to save academic scores to localStorage:", err);
  }
}

export function resetStoredAcademicScores(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to reset academic scores in localStorage:", err);
  }
}

export function getStoredOnetPosters(): OnetPosterItem[] {
  if (typeof window === "undefined") {
    return defaultHistoricalOnetScores;
  }
  try {
    const raw = localStorage.getItem(POSTERS_STORAGE_KEY);
    if (!raw) return defaultHistoricalOnetScores;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultHistoricalOnetScores;
  } catch {
    return defaultHistoricalOnetScores;
  }
}

export function saveStoredOnetPosters(posters: OnetPosterItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(POSTERS_STORAGE_KEY, JSON.stringify(posters));
    window.dispatchEvent(new Event("academic_posters_updated"));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to save O-NET posters to localStorage:", err);
  }
}

export function resetStoredOnetPosters(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(POSTERS_STORAGE_KEY);
    window.dispatchEvent(new Event("academic_posters_updated"));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to reset O-NET posters in localStorage:", err);
  }
}

