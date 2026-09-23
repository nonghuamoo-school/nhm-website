/**
 * Helper utilities for Google Maps embedding and navigation links
 */

const DEFAULT_SCHOOL_QUERY = "โรงเรียนบ้านหนองหัวหมู ตำบลทุ่งกระเต็น อำเภอหนองกี่ จังหวัดบุรีรัมย์";

/**
 * Extracts a valid iframe embed src URL from various input formats:
 * - Direct iframe tag: <iframe src="https://..."></iframe>
 * - Full Google Maps embed URL: https://www.google.com/maps/embed?pb=...
 * - GPS Coordinates: "14.6854, 102.5321"
 * - Place / Search URL or general text
 */
export function getGoogleMapsEmbedUrl(input?: string, fallbackQuery: string = DEFAULT_SCHOOL_QUERY): string {
  if (!input || !input.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  const trimmed = input.trim();

  // 1. If user pasted full iframe tag: <iframe src="https://www.google.com/maps/embed?pb=..." ...>
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // 2. If it's already a Google embed URL
  if (trimmed.includes("google.com/maps/embed") || trimmed.includes("output=embed")) {
    return trimmed;
  }

  // 3. If it's coordinates: e.g. "14.6823, 102.5312" or "14.6823,102.5312"
  const coordsMatch = trimmed.match(/^([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)$/);
  if (coordsMatch) {
    const lat = coordsMatch[1];
    const lng = coordsMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  // 4. If it's a standard Google Maps URL with ?q=
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      const q = url.searchParams.get("q");
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }

      // If it contains /place/Name/@lat,lng
      const placeMatch = url.pathname.match(/\/place\/([^/@]+)/);
      if (placeMatch && placeMatch[1]) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }
    }
  } catch {
    // Ignore URL parse error and fallback
  }

  // 5. Shortlink (maps.app.goo.gl) cannot be embedded directly due to iframe restrictions;
  // use the fallback query for embedding, while the external button links directly to the shortlink
  if (trimmed.includes("goo.gl") || trimmed.includes("maps.app.goo.gl")) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  // 6. Otherwise treat as query term or address
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Returns a direct navigation URL suitable for opening in Google Maps app / web tab
 */
export function getGoogleMapsNavigationUrl(input?: string, fallbackQuery: string = DEFAULT_SCHOOL_QUERY): string {
  if (!input || !input.trim()) {
    return `https://maps.google.com/?q=${encodeURIComponent(fallbackQuery)}`;
  }

  const trimmed = input.trim();

  // If user pasted iframe tag, extract src
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // If already a valid web link (e.g. https://maps.app.goo.gl/... or https://maps.google.com/...)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // If coordinates
  const coordsMatch = trimmed.match(/^([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)$/);
  if (coordsMatch) {
    return `https://maps.google.com/?q=${coordsMatch[1]},${coordsMatch[2]}`;
  }

  // Default query URL
  return `https://maps.google.com/?q=${encodeURIComponent(trimmed)}`;
}
