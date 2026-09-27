import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 1. Check if the image exists as a static file in public/images/news
  const safeFilename = path.basename(id);
  const possiblePaths = [
    path.join(process.cwd(), "public", "images", "news", safeFilename),
    path.join(process.cwd(), "public", "images", "news", `${safeFilename}.jpg`),
    path.join(process.cwd(), "public", "images", "news", `${safeFilename}.png`),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ p);
      const ext = path.extname(p).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : "image/jpeg";
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  // 2. Otherwise look in Supabase school_settings under key `media_${id}`
  if (isSupabaseConfigured() && supabase) {
    try {
      const lookupKey = id.startsWith("media_") ? id : `media_${id}`;
      const { data, error } = await supabase
        .from("school_settings")
        .select("value")
        .eq("key", lookupKey)
        .single();

      if (!error && data?.value?.base64) {
        const buffer = Buffer.from(data.value.base64, "base64");
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": data.value.contentType || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (e) {
      console.error("Error serving image from Supabase:", e);
    }
  }

  return new NextResponse("Image Not Found", { status: 404 });
}
