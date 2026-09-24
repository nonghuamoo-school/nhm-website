"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolPersonnel } from "@/data/personnel";
import { PersonnelMember } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_personnel";
const UPDATE_EVENT = "nhm_personnel_updated";

function rowToMember(row: any): PersonnelMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    academicDegree: row.academic_degree || "",
    subjectGroup: row.subject_group || "",
    department: row.department || "",
    roles: Array.isArray(row.roles) ? row.roles : (row.roles ? JSON.parse(row.roles) : []),
    imageUrl: row.image_url || "/images/school-emblem-doc.png",
    order: Number(row.order_index) || 999
  };
}

function memberToRow(member: PersonnelMember) {
  return {
    id: member.id,
    name: member.name,
    position: member.position,
    academic_degree: member.academicDegree || "",
    subject_group: member.subjectGroup || "",
    department: member.department || "",
    roles: member.roles || [],
    image_url: member.imageUrl || "/images/school-emblem-doc.png",
    order_index: member.order || 999,
    updated_at: new Date().toISOString()
  };
}

export function usePersonnel() {
  const [personnelList, setPersonnelList] = useState<PersonnelMember[]>(schoolPersonnel);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

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

          // Replace any legacy placeholder or unsplash images with real photos from schoolPersonnel
          cleaned = cleaned.map((p) => {
            if (!p.imageUrl || p.imageUrl.includes("unsplash.com")) {
              const realItem = schoolPersonnel.find((sp) => sp.name.trim() === p.name.trim() || sp.id === p.id);
              if (realItem?.imageUrl && !realItem.imageUrl.includes("unsplash")) {
                return { ...p, imageUrl: realItem.imageUrl };
              }
            }
            return p;
          });

          const sorted = [...cleaned].sort((a, b) => (a.order || 0) - (b.order || 0));
          const reindexed = sorted.map((item, idx) => ({ ...item, order: idx + 1 }));
          setPersonnelList(reindexed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexed));
          return;
        }
      }
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

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("personnel")
        .select("*")
        .order("order_index", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const fromCloud: PersonnelMember[] = data.map(rowToMember).map((p) => {
              if (!p.imageUrl || p.imageUrl.includes("unsplash.com")) {
                const realItem = schoolPersonnel.find((sp) => sp.name.trim() === p.name.trim() || sp.id === p.id);
                if (realItem?.imageUrl && !realItem.imageUrl.includes("unsplash")) {
                  return { ...p, imageUrl: realItem.imageUrl };
                }
              }
              return p;
            });
            setPersonnelList(fromCloud);
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

  const persist = async (newList: PersonnelMember[]) => {
    setPersonnelList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving nhm_school_personnel to localStorage", err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = newList.map(memberToRow);
        await supabase.from("personnel").upsert(rows);
      } catch (cloudErr) {
        console.warn("Could not sync personnel changes to Supabase cloud:", cloudErr);
      }
    }
  };

  const addMember = async (data: Omit<PersonnelMember, "id"> & { id?: string }) => {
    const newId = data.id || `p-${Date.now()}`;
    const newMember: PersonnelMember = {
      ...data,
      id: newId,
      order: data.order || personnelList.length + 1,
      roles: data.roles || (data.position ? [data.position] : [])
    };
    const updated = [...personnelList, newMember].sort((a, b) => (a.order || 0) - (b.order || 0));
    const reindexed = updated.map((m, idx) => ({ ...m, order: idx + 1 }));
    await persist(reindexed);
    return newMember;
  };

  const updateMember = async (id: string, updatedData: Partial<PersonnelMember>) => {
    const updated = personnelList.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedData };
      }
      return item;
    });
    const sorted = [...updated].sort((a, b) => (a.order || 0) - (b.order || 0));
    const reindexed = sorted.map((m, idx) => ({ ...m, order: idx + 1 }));
    await persist(reindexed);
  };

  const deleteMember = async (id: string) => {
    const updated = personnelList.filter((item) => item.id !== id);
    const reindexed = updated.map((m, idx) => ({ ...m, order: idx + 1 }));
    await persist(reindexed);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("personnel").delete().eq("id", id);
      } catch (e) {
        console.warn("Error deleting from cloud:", e);
      }
    }
  };

  const moveUp = async (id: string) => {
    const idx = personnelList.findIndex((p) => p.id === id);
    if (idx <= 0) return;
    const newList = [...personnelList];
    const current = newList[idx];
    newList[idx] = newList[idx - 1];
    newList[idx - 1] = current;
    
    const reindexed = newList.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    await persist(reindexed);
  };

  const moveDown = async (id: string) => {
    const idx = personnelList.findIndex((p) => p.id === id);
    if (idx < 0 || idx >= personnelList.length - 1) return;
    const newList = [...personnelList];
    const current = newList[idx];
    newList[idx] = newList[idx + 1];
    newList[idx + 1] = current;

    const reindexed = newList.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    await persist(reindexed);
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
    isCloudSynced,
    addMember,
    updateMember,
    deleteMember,
    moveUp,
    moveDown,
    resetToDefault
  };
}
