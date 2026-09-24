/**
 * Utility functions for Thai typography formatting to prevent awkward word-breaks ("คำตก" / orphan words/numbers).
 */

export function formatThaiTitle(title?: string): string {
  if (!title) return "";

  return title
    // Protect common Thai prefix + number combinations from breaking (e.g. "ปีที่ 1-3", "ชั้น ป.1-3", "ฉบับที่ 11")
    .replace(/(ปีที่|ชั้น|ระดับ|ฉบับที่|ที่|และ|ของ|ใน|กับ|ป\.|ม\.)\s+([0-9ปม\.\-\/]+)/g, "$1\u00A0$2")
    // Protect standalone trailing numbers/ranges at the end of text (e.g. " 1-3" or " 2569")
    .replace(/\s+([0-9]+(?:\s*[\-–]\s*[0-9]+)?)$/, "\u00A0$1");
}
