"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolPersonnel } from "@/data/personnel";
import { PersonnelMember } from "@/types";

const STORAGE_KEY = "nhm_school_personnel";
const UPDATE_EVENT = "nhm_personnel_updated";

export function usePersonnel() {
  const [personnelList, setPersonnelList] = useState<PersonnelMember[]>(schoolPersonnel);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out Nipaporn
          let cleaned = parsed.filter((p) => !p.name.includes("นิภาพร"));

          // Ensure Supaporn is updated as School Clerk
          const hasSupaporn = cleaned.some((p) => p.name.includes("สุภาภรณ์"));
          if (!hasSupaporn) {
            const supapornItem = schoolPersonnel.find((p) => p.name.includes("สุภาภรณ์"));
            if (supapornItem) cleaned.push(supapornItem);
          } else {
            cleaned = cleaned.map((p) => {
              if (p.name.includes("สุภาภรณ์")) {
                return {
                  ...p,
                  position: "เจ้าหน้าที่ธุรการโรงเรียน",
                  roles: ["เจ้าหน้าที่ธุรการโรงเรียน", "กรรมการฝ่ายบริหารทั่วไป", "กรรมการฝ่ายบริหารงบประมาณ"],
                  subjectGroup: "ฝ่ายสนับสนุนการศึกษา / งานธุรการ"
                };
              }
              return p;
            });
          }

          // Ensure Wiletu is added as Custodian
          const hasWiletu = cleaned.some((p) => p.name.includes("วิเลตุ"));
          if (!hasWiletu) {
            const wiletuItem = schoolPersonnel.find((p) => p.name.includes("วิเลตุ"));
            if (wiletuItem) cleaned.push(wiletuItem);
          }

          const sorted = [...cleaned].sort((a, b) => (a.order || 0) - (b.order || 0));
          const reindexed = sorted.map((item, idx) => ({ ...item, order: idx + 1 }));
          setPersonnelList(reindexed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
          return;
        }
      }
      // If none in storage, set initial default sorted by order
      const initialSorted = [...schoolPersonnel].sort((a, b) => (a.order || 0) - (b.order || 0));
      setPersonnelList(initialSorted);
    } catch (err) {
      console.error("Error reading nhm_school_personnel from localStorage", err);
      setPersonnelList(schoolPersonnel);
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

  const persist = (newList: PersonnelMember[]) => {
    setPersonnelList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving nhm_school_personnel to localStorage", err);
      }
    }
  };

  const addMember = (data: Omit<PersonnelMember, "id"> & { id?: string }) => {
    const newId = data.id || `p-${Date.now()}`;
    const newMember: PersonnelMember = {
      ...data,
      id: newId,
      order: data.order || personnelList.length + 1,
      roles: data.roles || (data.position ? [data.position] : [])
    };
    const updated = [...personnelList, newMember].sort((a, b) => (a.order || 0) - (b.order || 0));
    // Normalize order 1..N
    const reindexed = updated.map((m, idx) => ({ ...m, order: idx + 1 }));
    persist(reindexed);
    return newMember;
  };

  const updateMember = (id: string, updatedData: Partial<PersonnelMember>) => {
    const updated = personnelList.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      return item;
    });
    // Sort and re-index
    const sorted = [...updated].sort((a, b) => (a.order || 0) - (b.order || 0));
    const reindexed = sorted.map((m, idx) => ({ ...m, order: idx + 1 }));
    persist(reindexed);
  };

  const deleteMember = (id: string) => {
    const updated = personnelList.filter((item) => item.id !== id);
    const reindexed = updated.map((m, idx) => ({ ...m, order: idx + 1 }));
    persist(reindexed);
  };

  const moveUp = (id: string) => {
    const idx = personnelList.findIndex((p) => p.id === id);
    if (idx <= 0) return; // Already at the top
    const newList = [...personnelList];
    const current = newList[idx];
    newList[idx] = newList[idx - 1];
    newList[idx - 1] = current;
    
    // Reassign orders 1..N
    const reindexed = newList.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    persist(reindexed);
  };

  const moveDown = (id: string) => {
    const idx = personnelList.findIndex((p) => p.id === id);
    if (idx < 0 || idx >= personnelList.length - 1) return; // Already at the bottom
    const newList = [...personnelList];
    const current = newList[idx];
    newList[idx] = newList[idx + 1];
    newList[idx + 1] = current;

    // Reassign orders 1..N
    const reindexed = newList.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    persist(reindexed);
  };

  const resetToDefault = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
    const initialSorted = [...schoolPersonnel].sort((a, b) => (a.order || 0) - (b.order || 0));
    setPersonnelList(initialSorted);
  };

  return {
    personnelList,
    isLoaded,
    addMember,
    updateMember,
    deleteMember,
    moveUp,
    moveDown,
    resetToDefault
  };
}
