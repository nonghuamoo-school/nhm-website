import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://myrkpmydqhbpysbrkqym.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const HISTORICAL_BASE_COUNT = 1380;

let serverCachedCount = HISTORICAL_BASE_COUNT;

/**
 * ดึงจำนวนผู้เข้าชมสดใหม่จาก Supabase Database บน Server-Side ทันที (SSR / Request Time)
 * เพื่อให้ HTML ที่ส่งออกจาก Server บรรจุตัวเลขจริง ไม่ใช่ค่าแคชเก่า
 */
export async function getLiveVisitorCountServer(): Promise<number> {
  try {
    if (!SUPABASE_ANON_KEY) {
      return serverCachedCount;
    }

    // วิธีที่ 1: เรียกตรงผ่าน REST endpoint ของ Supabase ด้วย cache: "no-store"
    // เพื่อให้ Next.js Server Components ทำการ Fetch สดใหม่ทุก Request โดยไม่ติด Data Cache
    const restUrl = `${SUPABASE_URL}/rest/v1/school_settings?key=eq.visitor_metrics&select=value`;
    const res = await fetch(restUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0]?.value) {
        const val = data[0].value;
        const total = typeof val.total === "number" ? val.total : Number(val.total);
        if (!isNaN(total) && total >= HISTORICAL_BASE_COUNT) {
          serverCachedCount = Math.max(serverCachedCount, total);
          return serverCachedCount;
        }
      }
    }

    // วิธีที่ 2: สำรองด้วย Supabase JS Client หาก REST ติดปัญหา
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: dbData, error } = await supabase
      .from("school_settings")
      .select("value")
      .eq("key", "visitor_metrics")
      .single();

    if (!error && dbData?.value) {
      const val = dbData.value as { total?: number };
      const total = typeof val.total === "number" ? val.total : Number(val.total);
      if (!isNaN(total) && total >= HISTORICAL_BASE_COUNT) {
        serverCachedCount = Math.max(serverCachedCount, total);
        return serverCachedCount;
      }
    }
  } catch (err) {
    console.warn("[getLiveVisitorCountServer] Error fetching live count:", err);
  }

  return serverCachedCount;
}
