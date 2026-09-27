/**
 * Utility functions for Thai typography formatting to prevent awkward word-breaks ("คำตก" / orphan words/numbers).
 * Uses native Intl.Segmenter with Zero Width Space (\u200B) for natural Thai syllable/word boundary breaking.
 */

let thaiSegmenter: Intl.Segmenter | null = null;
if (typeof Intl !== "undefined" && typeof (Intl as any).Segmenter === "function") {
  try {
    thaiSegmenter = new Intl.Segmenter("th", { granularity: "word" });
  } catch {
    thaiSegmenter = null;
  }
}

/**
 * Segments Thai words and inserts zero-width space (\u200B) to enable natural line breaking
 * without cutting in the middle of words.
 */
export function segmentThaiText(text?: string): string {
  if (!text) return "";
  if (!thaiSegmenter) return text;

  try {
    const segments = Array.from(thaiSegmenter.segment(text));
    return segments.map((s) => s.segment).join("\u200B");
  } catch {
    return text;
  }
}

export function formatThaiTitle(title?: string): string {
  if (!title) return "";

  const formatted = title
    // Protect common Thai prefix + number combinations from breaking (e.g. "ปีที่ 1-3", "ชั้น ป.1-3", "ฉบับที่ 11", "เขต 3", "หมู่ที่ 7")
    .replace(/(ปีที่|ชั้น|ระดับ|ฉบับที่|ที่|เขต|หมู่ที่|หมู่|และ|ของ|ใน|กับ|ป\.|ม\.)\s+([0-9ปม\.\-\/]+)/g, "$1\u00A0$2")
    // Protect standalone trailing numbers/ranges at the end of text (e.g. " 1-3" or " 2569")
    .replace(/\s+([0-9]+(?:\s*[\-–]\s*[0-9]+)?)$/, "\u00A0$1");

  return segmentThaiText(formatted);
}

/**
 * Formats Thai educational affiliation strings so that "เขต 3" and geographic units
 * stay together on line breaks, avoiding orphan single-digit numbers.
 */
export function formatThaiAffiliation(text?: string): string {
  if (!text) return "";
  return text
    .replace(/เขต\s+([0-9]+)/g, "เขต\u00A0$1")
    .replace(/(ประถมศึกษา|มัธยมศึกษา)(บุรีรัมย์)/g, "$1\u200B$2");
}

