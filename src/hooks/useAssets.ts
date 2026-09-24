"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolInventoryAssets } from "@/data/assets";
import { InventoryAsset } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_assets";
const UPDATE_EVENT = "nhm_assets_updated";
const CLOUD_SETTINGS_KEY = "school_inventory_assets";

export function useAssets() {
  const [assetsList, setAssetsList] = useState<InventoryAsset[]>(schoolInventoryAssets);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAssetsList(parsed);
          setIsLoaded(true);
          return;
        }
      }
      setAssetsList(schoolInventoryAssets);
    } catch (err) {
      console.error("Error reading nhm_school_assets from localStorage:", err);
      setAssetsList(schoolInventoryAssets);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("school_settings")
        .select("value")
        .eq("key", CLOUD_SETTINGS_KEY)
        .single()
        .then(({ data, error }) => {
          if (!error && data && Array.isArray(data.value)) {
            setAssetsList(data.value);
            setIsCloudSynced(true);
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

  const persist = async (newList: InventoryAsset[]) => {
    setAssetsList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving assets to localStorage:", err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("school_settings")
          .upsert({
            key: CLOUD_SETTINGS_KEY,
            value: newList,
            updated_at: new Date().toISOString()
          });
        setIsCloudSynced(true);
      } catch (e) {
        console.warn("Could not sync assets to Supabase:", e);
      }
    }
  };

  const addAsset = async (asset: Omit<InventoryAsset, "id"> & { id?: string }) => {
    const newId = asset.id || `asset-${Date.now()}`;
    const newItem: InventoryAsset = {
      ...asset,
      id: newId
    };
    const updated = [newItem, ...assetsList];
    await persist(updated);
    return newItem;
  };

  const updateAsset = async (id: string, updatedData: Partial<InventoryAsset>) => {
    const updated = assetsList.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    await persist(updated);
  };

  const deleteAsset = async (id: string) => {
    const updated = assetsList.filter((item) => item.id !== id);
    await persist(updated);
  };

  const clearAllAssets = async () => {
    await persist([]);
  };

  const resetToDefault = async () => {
    await persist(schoolInventoryAssets);
  };

  return {
    assetsList,
    isLoaded,
    isCloudSynced,
    addAsset,
    updateAsset,
    deleteAsset,
    clearAllAssets,
    resetToDefault
  };
}
