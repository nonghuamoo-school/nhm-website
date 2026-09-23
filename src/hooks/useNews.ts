"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolNews } from "@/data/news";
import { NewsItem } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_news";
const DELETED_KEY = "nhm_deleted_news_ids";
const UPDATE_EVENT = "nhm_news_updated";
const CLOUD_SETTINGS_KEY = "school_news_list";

/**
 * Convert Thai date format (e.g. "22 ก.ย. 2568" or "18 มี.ค. 2568") or any date string
 * into safe ISO format (YYYY-MM-DD) for Postgres DATE columns.
 */
export function toIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const thaiMonths: Record<string, string> = {
    "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
    "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
    "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12",
  };

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = thaiMonths[parts[1]] || "01";
    let year = parseInt(parts[2], 10);
    if (year > 2400) year -= 543; // Buddhist Era to Common Era
    if (!isNaN(year)) {
      return `${year}-${month}-${day}`;
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

/**
 * Format ISO or standard date into Thai formatted string (e.g. "22 ก.ย. 2568")
 */
export function formatThaiDate(dateStr?: string): string {
  if (!dateStr) return "";
  if (/[ก-๙]/.test(dateStr)) return dateStr;

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function rowToNews(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title || "ข่าวประชาสัมพันธ์",
    content: row.content || "",
    excerpt: row.summary || row.excerpt || row.title || "",
    category: row.category || "ประชาสัมพันธ์",
    date: formatThaiDate(row.date),
    author: row.author || "ฝ่ายงานประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู",
    imageUrl: row.image_url || row.imageUrl || "/images/school-emblem-doc.png",
    views: Number(row.views) || 1,
    isFeatured: Boolean(row.is_pinned ?? row.is_featured ?? row.isFeatured),
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    slug: row.slug || row.id,
    status: row.status || "เผยแพร่แล้ว",
    facebookUrl: row.facebook_url || row.facebookUrl || undefined,
    externalUrl: row.external_url || row.externalUrl || undefined,
    galleryImages: Array.isArray(row.gallery_images)
      ? row.gallery_images
      : Array.isArray(row.galleryImages)
      ? row.galleryImages
      : [],
  };
}

function newsToRow(item: NewsItem) {
  return {
    id: item.id,
    title: item.title,
    content: item.content || item.title,
    summary: item.excerpt || item.title,
    category: item.category || "ประชาสัมพันธ์",
    date: toIsoDate(item.date),
    author: item.author || "ฝ่ายงานประชาสัมพันธ์ โรงเรียนบ้านหนองหัวหมู",
    image_url: item.imageUrl || "/images/school-emblem-doc.png",
    views: item.views || 1,
    is_pinned: Boolean(item.isFeatured),
    attachments: item.attachments || [],
    slug: item.slug || item.id,
    updated_at: new Date().toISOString()
  };
}

export function useNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>(schoolNews);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const rawDeleted = localStorage.getItem(DELETED_KEY);
      const deletedIds = new Set<string>(rawDeleted ? JSON.parse(rawDeleted) : []);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter((n) => !deletedIds.has(n.id));
          if (cleaned.length > 0 || deletedIds.size > 0) {
            setNewsList(cleaned);
            return;
          }
        }
      }

      // Fallback: If no saved list or empty without intentional deletions, load default schoolNews
      const initialCleaned = schoolNews.filter((n) => !deletedIds.has(n.id));
      setNewsList(initialCleaned);
    } catch (err) {
      console.error("Error reading nhm_school_news from localStorage", err);
      setNewsList(schoolNews);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const fetchCloudNews = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const rawDeleted = typeof window !== "undefined" ? localStorage.getItem(DELETED_KEY) : null;
      const deletedIds = new Set<string>(rawDeleted ? JSON.parse(rawDeleted) : []);

      // 1. Try reading rich JSONB news list from school_settings first (preserves facebookUrl, galleryImages, etc.)
      const { data: settingsData, error: settingsError } = await supabase
        .from("school_settings")
        .select("value")
        .eq("key", CLOUD_SETTINGS_KEY)
        .single();

      if (!settingsError && settingsData?.value && Array.isArray(settingsData.value) && settingsData.value.length > 0) {
        const cloudItems: NewsItem[] = settingsData.value
          .map((item: any) => rowToNews(item))
          .filter((n) => !deletedIds.has(n.id));

        if (cloudItems.length > 0) {
          setNewsList(cloudItems);
          setIsCloudSynced(true);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudItems));
          }
          return;
        }
      }

      // 2. Fallback: Query public.news table directly
      const { data: newsTableData, error: newsError } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (!newsError && newsTableData && newsTableData.length > 0) {
        const cloudFromTable: NewsItem[] = newsTableData
          .map(rowToNews)
          .filter((n) => !deletedIds.has(n.id));

        if (cloudFromTable.length > 0) {
          setNewsList(cloudFromTable);
          setIsCloudSynced(true);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudFromTable));
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch cloud news:", err);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    fetchCloudNews();

    // Listen to local events across tabs/windows
    const handleStorageChange = () => loadFromStorage();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(UPDATE_EVENT, handleStorageChange);

    // Setup Supabase Realtime channel for instant cross-device updates
    let channel: any = null;
    if (isSupabaseConfigured() && supabase) {
      try {
        channel = supabase
          .channel("nhm_news_realtime_channel")
          .on("postgres_changes", { event: "*", schema: "public", table: "news" }, () => {
            fetchCloudNews();
          })
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "school_settings", filter: `key=eq.${CLOUD_SETTINGS_KEY}` },
            () => {
              fetchCloudNews();
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn("Supabase realtime subscription failed:", subErr);
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(UPDATE_EVENT, handleStorageChange);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadFromStorage, fetchCloudNews]);

  const persist = async (newList: NewsItem[]): Promise<void> => {
    setNewsList(newList);

    // 1. Save to localStorage immediately
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving nhm_school_news to localStorage", err);
      }
    }

    // 2. Dual-save to Supabase cloud
    if (isSupabaseConfigured() && supabase) {
      try {
        // A. Primary: Store full rich news payload in school_settings JSONB (100% schema resilient)
        await supabase.from("school_settings").upsert({
          key: CLOUD_SETTINGS_KEY,
          value: newList,
          updated_at: new Date().toISOString(),
        });

        // B. Secondary: Store rows in news table with mapped columns and safe ISO dates
        const rows = newList.map(newsToRow);
        const { error: upsertErr } = await supabase.from("news").upsert(rows);
        if (upsertErr) {
          console.warn("Notice: Sync to news table warning (JSONB backup secured):", upsertErr.message);
        }

        setIsCloudSynced(true);
      } catch (cloudErr) {
        console.warn("Could not sync news to Supabase cloud:", cloudErr);
      }
    }
  };

  const addNews = async (item: Omit<NewsItem, "id"> & { id?: string }): Promise<NewsItem> => {
    const newId = item.id || `news-${Date.now()}`;
    const newItem: NewsItem = {
      ...item,
      id: newId,
      views: item.views || 1,
      slug: item.slug || `news-${Date.now()}`,
    };
    const updated = [newItem, ...newsList];
    await persist(updated);
    return newItem;
  };

  const updateNews = async (id: string, updatedData: Partial<NewsItem>): Promise<void> => {
    const updated = newsList.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      return item;
    });
    await persist(updated);
  };

  const deleteNews = async (id: string): Promise<void> => {
    // 1. Mark ID in deleted persistent list so it never resurrects
    if (typeof window !== "undefined") {
      try {
        const rawDeleted = localStorage.getItem(DELETED_KEY);
        const set = new Set<string>(rawDeleted ? JSON.parse(rawDeleted) : []);
        set.add(id);
        localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(set)));
      } catch (err) {
        console.error("Error updating deleted news IDs", err);
      }
    }

    // 2. Filter out from newsList and save
    const updated = newsList.filter((item) => item.id !== id);
    await persist(updated);

    // 3. Delete from Supabase cloud database
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("news").delete().eq("id", id);
      } catch (e) {
        console.warn("Error deleting news from cloud:", e);
      }
    }
  };

  const resetToDefault = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DELETED_KEY);
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
    await persist(schoolNews);
  };

  return {
    newsList,
    isLoaded,
    isCloudSynced,
    addNews,
    updateNews,
    deleteNews,
    resetToDefault,
  };
}
