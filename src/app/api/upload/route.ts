import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, name } = body; // image is data URL (base64)

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid base64 image data" }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    const safePrefix = (name || "upload").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const mediaId = `${safePrefix}_${Date.now()}`;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("school_settings").upsert({
        key: `media_${mediaId}`,
        value: {
          contentType,
          base64: base64Data,
          updated_at: new Date().toISOString(),
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: `/api/images/${mediaId}`,
        id: mediaId,
      });
    }

    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
