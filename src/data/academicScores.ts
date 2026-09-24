import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

// Multi-year type: [ExamType][AcademicYear] -> ExamDataset
export type AllAcademicScores = Record<string, Record<string, ExamDataset>>;

export const defaultAcademicScores: AllAcademicScores = {
  "O-NET": {
    "2568": {
      id: "O-NET",
      title: "ค่าเฉลี่ยคะแนน O-NET ป.6",
      grade: "ชั้นประถมศึกษาปีที่ 6",
      year: "2568",
      source: "สทศ.",
      posterImageUrl: "/images/onet-2567.png",
      subjects: [
        { name: "ภาษาไทย", school: 0, area: 0, national: 0 },
        { name: "คณิตศาสตร์", school: 0, area: 0, national: 0 },
        { name: "วิทยาศาสตร์", school: 0, area: 0, national: 0 },
        { name: "ภาษาอังกฤษ", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย 4 วิชา", school: 0, area: 0, national: 0 },
      ],
    },
    "2567": {
      id: "O-NET",
      title: "ค่าเฉลี่ยคะแนน O-NET ป.6",
      grade: "ชั้นประถมศึกษาปีที่ 6",
      year: "2567",
      source: "สทศ.",
      posterImageUrl: "/images/onet-2567.png",
      subjects: [
        { name: "ภาษาไทย", school: 63.14, area: 54.20, national: 54.20 },
        { name: "คณิตศาสตร์", school: 40.46, area: 29.21, national: 29.21 },
        { name: "วิทยาศาสตร์", school: 46.07, area: 42.87, national: 42.87 },
        { name: "ภาษาอังกฤษ", school: 34.82, area: 33.49, national: 33.49 },
        { name: "รวมเฉลี่ย 4 วิชา", school: 46.12, area: 39.94, national: 39.94 },
      ],
    },
    "2566": {
      id: "O-NET",
      title: "ค่าเฉลี่ยคะแนน O-NET ป.6",
      grade: "ชั้นประถมศึกษาปีที่ 6",
      year: "2566",
      source: "สทศ.",
      posterImageUrl: "/images/onet-2566.png",
      subjects: [
        { name: "ภาษาไทย", school: 67.61, area: 57.30, national: 57.30 },
        { name: "คณิตศาสตร์", school: 34.71, area: 29.96, national: 29.96 },
        { name: "วิทยาศาสตร์", school: 52.86, area: 40.75, national: 40.75 },
        { name: "ภาษาอังกฤษ", school: 33.04, area: 37.32, national: 37.32 },
        { name: "รวมเฉลี่ย 4 วิชา", school: 47.05, area: 41.33, national: 41.33 },
      ],
    },
  },
  "RT": {
    "2568": {
      id: "RT",
      title: "ค่าเฉลี่ยคะแนน RT ป.1",
      grade: "ชั้นประถมศึกษาปีที่ 1",
      year: "2568",
      source: "สพฐ.",
      subjects: [
        { name: "RT1 (อ่านออกเสียง)", school: 0, area: 0, national: 0 },
        { name: "RT2 (อ่านรู้เรื่อง)", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย", school: 0, area: 0, national: 0 },
      ],
    },
    "2567": {
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
    "2566": {
      id: "RT",
      title: "ค่าเฉลี่ยคะแนน RT ป.1",
      grade: "ชั้นประถมศึกษาปีที่ 1",
      year: "2566",
      source: "สทศ.",
      subjects: [
        { name: "RT1 (อ่านออกเสียง)", school: 84.10, area: 79.50, national: 77.89 },
        { name: "RT2 (อ่านรู้เรื่อง)", school: 80.80, area: 78.10, national: 76.57 },
        { name: "รวมเฉลี่ย", school: 82.45, area: 78.80, national: 77.23 },
      ],
    },
  },
  "NT": {
    "2568": {
      id: "NT",
      title: "ค่าเฉลี่ยคะแนน NT ป.3",
      grade: "ชั้นประถมศึกษาปีที่ 3",
      year: "2568",
      source: "สพฐ.",
      subjects: [
        { name: "คณิตศาสตร์", school: 0, area: 0, national: 0 },
        { name: "ภาษาไทย", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย", school: 0, area: 0, national: 0 },
      ],
    },
    "2567": {
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
    "2566": {
      id: "NT",
      title: "ค่าเฉลี่ยคะแนน NT ป.3",
      grade: "ชั้นประถมศึกษาปีที่ 3",
      year: "2566",
      source: "สทศ.",
      subjects: [
        { name: "คณิตศาสตร์", school: 66.45, area: 64.10, national: 63.80 },
        { name: "ภาษาไทย", school: 71.35, area: 68.20, national: 66.70 },
        { name: "รวมเฉลี่ย", school: 68.90, area: 66.15, national: 65.25 },
      ],
    },
  },
};

export function createDefaultExamYear(examId: "O-NET" | "RT" | "NT", year: string): ExamDataset {
  if (examId === "O-NET") {
    return {
      id: "O-NET",
      title: `ค่าเฉลี่ยคะแนน O-NET ป.6 ปีการศึกษา ${year}`,
      grade: "ชั้นประถมศึกษาปีที่ 6",
      year,
      source: "สทศ.",
      subjects: [
        { name: "ภาษาไทย", school: 0, area: 0, national: 0 },
        { name: "คณิตศาสตร์", school: 0, area: 0, national: 0 },
        { name: "วิทยาศาสตร์", school: 0, area: 0, national: 0 },
        { name: "ภาษาอังกฤษ", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย 4 วิชา", school: 0, area: 0, national: 0 },
      ],
    };
  } else if (examId === "RT") {
    return {
      id: "RT",
      title: `ค่าเฉลี่ยคะแนน RT ป.1 ปีการศึกษา ${year}`,
      grade: "ชั้นประถมศึกษาปีที่ 1",
      year,
      source: "สทศ.",
      subjects: [
        { name: "RT1 (อ่านออกเสียง)", school: 0, area: 0, national: 0 },
        { name: "RT2 (อ่านรู้เรื่อง)", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย", school: 0, area: 0, national: 0 },
      ],
    };
  } else {
    return {
      id: "NT",
      title: `ค่าเฉลี่ยคะแนน NT ป.3 ปีการศึกษา ${year}`,
      grade: "ชั้นประถมศึกษาปีที่ 3",
      year,
      source: "สทศ.",
      subjects: [
        { name: "คณิตศาสตร์", school: 0, area: 0, national: 0 },
        { name: "ภาษาไทย", school: 0, area: 0, national: 0 },
        { name: "รวมเฉลี่ย", school: 0, area: 0, national: 0 },
      ],
    };
  }
}

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
    image: "/images/onet-2567.png",
    highlight: "ผลการทดสอบระดับชาติ",
    subjects: [
      { name: "ภาษาไทย", school: 67.5, national: 47.6, diff: "+19.90", higher: true },
      { name: "คณิตศาสตร์", school: 31.34, national: 24.9, diff: "+6.44", higher: true },
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

const STORAGE_KEY = "nhm_academic_scores_v4";
const POSTERS_STORAGE_KEY = "nhm_academic_posters_v2";
const CLOUD_KEY_SCORES = "academic_scores";
const CLOUD_KEY_POSTERS = "onet_posters";

function normalizeAcademicScores(parsed: any): AllAcademicScores {
  const result: AllAcademicScores = {
    "O-NET": {},
    "RT": {},
    "NT": {},
  };

  const examKeys = ["O-NET", "RT", "NT"] as const;

  for (const key of examKeys) {
    const val = parsed?.[key];
    if (!val) {
      result[key] = { ...defaultAcademicScores[key] };
      continue;
    }

    // Check if it's the old single-dataset format (has .subjects directly on val)
    if (Array.isArray(val.subjects)) {
      const year = val.year || "2567";
      result[key][year] = {
        ...val,
        id: key,
        year,
      };
      // Include default historical years if missing
      for (const defYear of Object.keys(defaultAcademicScores[key])) {
        if (!result[key][defYear]) {
          result[key][defYear] = defaultAcademicScores[key][defYear];
        }
      }
    } else if (typeof val === "object") {
      // New format: val is Record<string, ExamDataset>
      const years = Object.keys(val);
      if (years.length === 0) {
        result[key] = { ...defaultAcademicScores[key] };
      } else {
        for (const yr of years) {
          if (val[yr] && Array.isArray(val[yr].subjects)) {
            result[key][yr] = val[yr];
          }
        }
        // Ensure default baseline years (2568, 2567, 2566) are merged if missing in existing storage
        for (const defYear of Object.keys(defaultAcademicScores[key])) {
          if (!result[key][defYear]) {
            result[key][defYear] = defaultAcademicScores[key][defYear];
          }
        }
        if (Object.keys(result[key]).length === 0) {
          result[key] = { ...defaultAcademicScores[key] };
        }
      }
    } else {
      result[key] = { ...defaultAcademicScores[key] };
    }
  }

  return result;
}

// ===================== ACADEMIC SCORES =====================

export function getStoredAcademicScores(): AllAcademicScores {
  if (typeof window === "undefined") {
    return defaultAcademicScores;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("nhm_academic_scores_v3");
    if (!raw) return defaultAcademicScores;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return normalizeAcademicScores(parsed);
    }
    return defaultAcademicScores;
  } catch {
    return defaultAcademicScores;
  }
}

export async function saveStoredAcademicScores(data: AllAcademicScores): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to save academic scores to localStorage:", err);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from("school_settings")
        .upsert({ key: CLOUD_KEY_SCORES, value: data, updated_at: new Date().toISOString() });
    } catch (cloudErr) {
      console.warn("Could not sync academic scores to Supabase:", cloudErr);
    }
  }
}

export async function fetchAcademicScoresCloud(): Promise<AllAcademicScores | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("school_settings")
      .select("value")
      .eq("key", CLOUD_KEY_SCORES)
      .single();
    if (!error && data && data.value && typeof data.value === "object" && Object.keys(data.value).length > 0) {
      const normalized = normalizeAcademicScores(data.value);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        window.dispatchEvent(new Event("academic_scores_updated"));
      }
      return normalized;
    }
    return null;
  } catch {
    return null;
  }
}

export async function resetStoredAcademicScores(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("nhm_academic_scores_v3");
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to reset academic scores in localStorage:", err);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("school_settings").delete().eq("key", CLOUD_KEY_SCORES);
    } catch (cloudErr) {
      console.warn("Could not reset academic scores in Supabase:", cloudErr);
    }
  }
}

// ===================== O-NET POSTERS =====================

export function getStoredOnetPosters(): OnetPosterItem[] {
  if (typeof window === "undefined") {
    return defaultHistoricalOnetScores;
  }
  try {
    const raw = localStorage.getItem(POSTERS_STORAGE_KEY);
    if (!raw) return defaultHistoricalOnetScores;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure 2568 template is present if missing
      const has2568 = parsed.some((p: any) => p.year === "2568");
      let list = parsed;
      if (!has2568 && defaultHistoricalOnetScores.length > 0) {
        list = [defaultHistoricalOnetScores[0], ...parsed];
      }
      // Fill fallback image if image was cleared to blank
      return list.map((item: any) => ({
        ...item,
        image: item.image || (item.year === "2566" ? "/images/onet-2566.png" : "/images/onet-2567.png"),
      }));
    }
    return defaultHistoricalOnetScores;
  } catch {
    return defaultHistoricalOnetScores;
  }
}

export async function saveStoredOnetPosters(posters: OnetPosterItem[]): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(POSTERS_STORAGE_KEY, JSON.stringify(posters));
    window.dispatchEvent(new Event("academic_posters_updated"));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to save O-NET posters to localStorage:", err);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      // Store full poster array with optimized compressed images into Supabase JSONB
      await supabase
        .from("school_settings")
        .upsert({ key: CLOUD_KEY_POSTERS, value: posters, updated_at: new Date().toISOString() });
    } catch (cloudErr) {
      console.warn("Could not sync O-NET posters to Supabase:", cloudErr);
    }
  }
}

export async function fetchOnetPostersCloud(): Promise<OnetPosterItem[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("school_settings")
      .select("value")
      .eq("key", CLOUD_KEY_POSTERS)
      .single();
    if (!error && data && Array.isArray(data.value) && data.value.length > 0) {
      const local = getStoredOnetPosters();
      // Safely merge cloud with local so empty cloud images never wipe out user uploaded images
      const merged: OnetPosterItem[] = (data.value as OnetPosterItem[]).map((cloudItem) => {
        const localMatch = local.find((l) => l.year === cloudItem.year);
        if (!cloudItem.image && localMatch?.image) {
          return { ...cloudItem, image: localMatch.image };
        }
        return cloudItem;
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(POSTERS_STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event("academic_posters_updated"));
          window.dispatchEvent(new Event("academic_scores_updated"));
        } catch (e) {
          console.warn("Could not write merged posters to localStorage:", e);
        }
      }
      return merged;
    }
    return null;
  } catch {
    return null;
  }
}

export async function resetStoredOnetPosters(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(POSTERS_STORAGE_KEY);
    window.dispatchEvent(new Event("academic_posters_updated"));
    window.dispatchEvent(new Event("academic_scores_updated"));
  } catch (err) {
    console.error("Failed to reset O-NET posters in localStorage:", err);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("school_settings").delete().eq("key", CLOUD_KEY_POSTERS);
    } catch (cloudErr) {
      console.warn("Could not reset O-NET posters in Supabase:", cloudErr);
    }
  }
}
