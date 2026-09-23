"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolDownloads } from "@/data/downloads";
import { DownloadDoc } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_downloads";
const UPDATE_EVENT = "nhm_downloads_updated";

export function useDownloads() {
  const [docList, setDocList] = useState<DownloadDoc[]>(schoolDownloads);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocList(parsed);
          return;
        }
      }
      setDocList(schoolDownloads);
    } catch (err) {
      console.error("Error reading nhm_school_downloads:", err);
      setDocList(schoolDownloads);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    // Check Supabase school_settings
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("school_settings")
        .select("value")
        .eq("key", "downloads")
        .single()
        .then(({ data, error }) => {
          if (!error && data && Array.isArray(data.value) && data.value.length > 0) {
            setDocList(data.value);
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
            }
          }
        });
    }

    const handleStorage = () => loadFromStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleStorage);
    };
  }, [loadFromStorage]);

  const persist = async (newList: DownloadDoc[]) => {
    setDocList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving downloads to localStorage:", err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("school_settings")
          .upsert({ key: "downloads", value: newList, updated_at: new Date().toISOString() });
      } catch (e) {
        console.warn("Could not sync downloads to Supabase:", e);
      }
    }
  };

  const addDoc = async (doc: Omit<DownloadDoc, "id"> & { id?: string }) => {
    const newId = doc.id || `doc-${Date.now()}`;
    const newDoc: DownloadDoc = {
      ...doc,
      id: newId,
      downloads: doc.downloads || 0,
      date: doc.date || new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })
    };
    const updated = [newDoc, ...docList];
    await persist(updated);
    return newDoc;
  };

  const updateDoc = async (id: string, updatedData: Partial<DownloadDoc>) => {
    const updated = docList.map((d) => (d.id === id ? { ...d, ...updatedData } : d));
    await persist(updated);
  };

  const deleteDoc = async (id: string) => {
    const updated = docList.filter((d) => d.id !== id);
    await persist(updated);
  };

  const resetToDefault = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
    setDocList(schoolDownloads);
  };

  return {
    docList,
    isLoaded,
    addDoc,
    updateDoc,
    deleteDoc,
    resetToDefault
  };
}
