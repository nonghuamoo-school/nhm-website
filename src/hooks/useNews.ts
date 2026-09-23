"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolNews } from "@/data/news";
import { NewsItem } from "@/types";

const STORAGE_KEY = "nhm_school_news";
const UPDATE_EVENT = "nhm_news_updated";

export function useNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>(schoolNews);
  const [isLoaded, setIsLoaded] = useState(false);

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

    const handleStorageChange = () => loadFromStorage();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(UPDATE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(UPDATE_EVENT, handleStorageChange);
    };
  }, [loadFromStorage]);

  const persist = (newList: NewsItem[]) => {
    setNewsList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving nhm_school_news to localStorage", err);
      }
    }
  };

  const addNews = (item: Omit<NewsItem, "id"> & { id?: string }) => {
    const newId = item.id || `news-${Date.now()}`;
    const newItem: NewsItem = {
      ...item,
      id: newId,
      views: item.views || 1,
      slug: item.slug || `news-${Date.now()}`,
    };
    const updated = [newItem, ...newsList];
    persist(updated);
    return newItem;
  };

  const updateNews = (id: string, updatedData: Partial<NewsItem>) => {
    const updated = newsList.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      return item;
    });
    persist(updated);
  };

  const deleteNews = (id: string) => {
    const updated = newsList.filter((item) => item.id !== id);
    persist(updated);
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
    addNews,
    updateNews,
    deleteNews,
    resetToDefault,
  };
}
