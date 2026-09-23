"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolNews } from "@/data/news";
import { NewsItem } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_news";
const UPDATE_EVENT = "nhm_news_updated";

function rowToNews(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt || row.summary || "",
    category: row.category || "ประชาสัมพันธ์",
    date: row.date || new Date().toISOString().split("T")[0],
    author: row.author || "ประชาสัมพันธ์โรงเรียน",
    imageUrl: row.image_url || "/images/school-emblem-doc.png",
    views: Number(row.views) || 0,
    isFeatured: Boolean(row.is_featured || row.is_pinned),
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    slug: row.slug || row.id,
    status: row.status || "เผยแพร่แล้ว"
  };
}

function newsToRow(item: NewsItem) {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    excerpt: item.excerpt || "",
    category: item.category,
    date: item.date,
    author: item.author || "ประชาสัมพันธ์โรงเรียน",
    image_url: item.imageUrl || "/images/school-emblem-doc.png",
    views: item.views || 0,
    is_featured: Boolean(item.isFeatured),
    attachments: item.attachments || [],
    slug: item.slug || item.id,
    status: item.status || "เผยแพร่แล้ว",
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNewsList(parsed);
          return;
        }
      }
      setNewsList(schoolNews);
    } catch (err) {
      console.error("Error reading nhm_school_news from localStorage", err);
      setNewsList(schoolNews);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const fromCloud: NewsItem[] = data.map(rowToNews);
            setNewsList(fromCloud);
            setIsCloudSynced(true);
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(fromCloud));
            }
          }
        });
    }

    const handleStorageChange = () => loadFromStorage();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(UPDATE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(UPDATE_EVENT, handleStorageChange);
    };
  }, [loadFromStorage]);

  const persist = async (newList: NewsItem[]) => {
    setNewsList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving nhm_school_news to localStorage", err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = newList.map(newsToRow);
        await supabase.from("news").upsert(rows);
      } catch (cloudErr) {
        console.warn("Could not sync news to Supabase cloud:", cloudErr);
      }
    }
  };

  const addNews = async (item: Omit<NewsItem, "id"> & { id?: string }) => {
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

  const updateNews = async (id: string, updatedData: Partial<NewsItem>) => {
    const updated = newsList.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      return item;
    });
    await persist(updated);
  };

  const deleteNews = async (id: string) => {
    const updated = newsList.filter((item) => item.id !== id);
    await persist(updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("news").delete().eq("id", id);
      } catch (e) {
        console.warn("Error deleting news from cloud:", e);
      }
    }
  };

  const resetToDefault = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
    setNewsList(schoolNews);
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
