"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolDownloads } from "@/data/downloads";
import { DownloadDoc } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { extractGoogleDriveId } from "@/lib/drive";

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
          // Auto-sanitize existing stored items:
          // 1. Fix date if title has 2569 but date was saved as 2568
          // 2. Auto-compute direct download and preview URLs for Google Drive links
          let changed = false;
          const sanitized = parsed.map((item: DownloadDoc) => {
            const updated = { ...item };
            if (updated.title.includes("2569") && updated.date && updated.date.includes("2568")) {
              updated.date = updated.date.replace("2568", "2569");
              changed = true;
            }
            if (updated.driveUrl) {
              const driveId = extractGoogleDriveId(updated.driveUrl);
              if (driveId) {
                if (!updated.downloadUrl || updated.downloadUrl === "#") {
                  updated.downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
                  changed = true;
                }
                if (!updated.previewUrl || updated.previewUrl === "#") {
                  updated.previewUrl = `https://drive.google.com/file/d/${driveId}/preview`;
                  changed = true;
                }
              }
            }
            return updated;
          });

          if (changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          }
          setDocList(sanitized);
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
    const driveId = extractGoogleDriveId(doc.driveUrl);
    const resolvedDownload =
      doc.downloadUrl && doc.downloadUrl !== "#"
        ? doc.downloadUrl
        : driveId
        ? `https://drive.google.com/uc?export=download&id=${driveId}`
        : "#";
    const resolvedPreview =
      doc.previewUrl || (driveId ? `https://drive.google.com/file/d/${driveId}/preview` : resolvedDownload);

    const newDoc: DownloadDoc = {
      ...doc,
      id: newId,
      downloadUrl: resolvedDownload,
      previewUrl: resolvedPreview,
      downloads: doc.downloads || 0,
      date: doc.date || new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })
    };
    const updated = [newDoc, ...docList];
    await persist(updated);
    return newDoc;
  };

  const updateDoc = async (id: string, updatedData: Partial<DownloadDoc>) => {
    const updated = docList.map((d) => {
      if (d.id !== id) return d;
      const merged = { ...d, ...updatedData };
      const driveId = extractGoogleDriveId(merged.driveUrl);
      if (driveId && (!merged.downloadUrl || merged.downloadUrl === "#")) {
        merged.downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
      }
      if (driveId && (!merged.previewUrl || merged.previewUrl === "#")) {
        merged.previewUrl = `https://drive.google.com/file/d/${driveId}/preview`;
      }
      return merged;
    });
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
