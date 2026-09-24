"use client";

import { useState, useEffect, useCallback } from "react";
import { schoolCalendarEvents } from "@/data/calendar";
import { CalendarEvent } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "nhm_school_calendar";
const UPDATE_EVENT = "nhm_calendar_updated";

export function useCalendar() {
  const [eventList, setEventList] = useState<CalendarEvent[]>(schoolCalendarEvents);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEventList(parsed);
          return;
        }
      }
      setEventList(schoolCalendarEvents);
    } catch (err) {
      console.error("Error reading nhm_school_calendar:", err);
      setEventList(schoolCalendarEvents);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    let channel: any = null;

    if (isSupabaseConfigured() && supabase) {
      // 1. Initial fetch from Cloud
      supabase
        .from("school_settings")
        .select("value")
        .eq("key", "calendar_events")
        .single()
        .then(({ data, error }) => {
          if (!error && data && Array.isArray(data.value)) {
            setEventList(data.value);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
              } catch (e) {
                console.warn("Storage quota warning:", e);
              }
            }
          }
        });

      // 2. Real-time Subscription: updates across all devices on Earth immediately
      channel = supabase
        .channel("calendar_events_realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "school_settings",
            filter: "key=eq.calendar_events",
          },
          (payload: any) => {
            if (payload?.new && Array.isArray(payload.new.value)) {
              setEventList(payload.new.value);
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.new.value));
                  window.dispatchEvent(new Event(UPDATE_EVENT));
                } catch (e) {
                  console.warn("Storage quota warning:", e);
                }
              }
            }
          }
        )
        .subscribe();
    }

    const handleStorage = () => loadFromStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(UPDATE_EVENT, handleStorage);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(UPDATE_EVENT, handleStorage);
    };
  }, [loadFromStorage]);

  const persist = async (newList: CalendarEvent[]) => {
    setEventList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        window.dispatchEvent(new Event(UPDATE_EVENT));
      } catch (err) {
        console.error("Error saving calendar to localStorage:", err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("school_settings")
          .upsert({ key: "calendar_events", value: newList, updated_at: new Date().toISOString() });
      } catch (e) {
        console.warn("Could not sync calendar to Supabase:", e);
      }
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, "id"> & { id?: string }) => {
    const newId = event.id || `cal-${Date.now()}`;
    const newEvent: CalendarEvent = {
      ...event,
      id: newId
    };
    const updated = [newEvent, ...eventList];
    await persist(updated);
    return newEvent;
  };

  const updateEvent = async (id: string, updatedData: Partial<CalendarEvent>) => {
    const updated = eventList.map((e) => (e.id === id ? { ...e, ...updatedData } : e));
    await persist(updated);
  };

  const deleteEvent = async (id: string) => {
    const updated = eventList.filter((e) => e.id !== id);
    await persist(updated);
  };

  const resetToDefault = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
    setEventList(schoolCalendarEvents);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("school_settings")
          .upsert({ key: "calendar_events", value: schoolCalendarEvents, updated_at: new Date().toISOString() });
      } catch (e) {
        console.warn("Could not reset calendar in Supabase:", e);
      }
    }
  };

  return {
    eventList,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    resetToDefault
  };
}
