/**
 * Universal Image Compressor & Optimizer for Ban Nong Hua Moo School
 * 
 * Ensures all image uploads (O-NET posters, personnel photos, director photo,
 * school emblem, hero banner, news cover & gallery) are properly resized and compressed.
 * Keeps payloads lightweight (~80KB - 200KB) to ensure flawless persistence in
 * browser localStorage (5MB origin quota) and Supabase cloud JSONB.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

/**
 * Compresses an image File into an optimized base64 Data URL.
 * Resilient against heavy mobile photos, high-res posters, ICC profiles, and EXIF orientations.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    // 1. Basic validation
    if (!file) {
      return reject(new Error("ไม่พบไฟล์รูปภาพ"));
    }

    const fileType = file.type || "";
    // Allow standard images and octet-stream (some mobile browsers report octet-stream for images)
    if (fileType && !fileType.startsWith("image/") && !fileType.includes("octet-stream")) {
      return reject(new Error("กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG, PNG, WebP)"));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("ไม่สามารถอ่านไฟล์ได้ กรุณาลองใหม่อีกครั้ง"));
    };

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error("ไฟล์รูปภาพว่างเปล่า"));
      }

      // If file is SVG, preserve vector code directly
      if (fileType === "image/svg+xml" || rawDataUrl.startsWith("data:image/svg+xml")) {
        return resolve(rawDataUrl);
      }

      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          if (!width || !height) {
            return resolve(rawDataUrl);
          }

          // Calculate aspect-ratio preserving dimensions
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          width = Math.max(1, width);
          height = Math.max(1, height);

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d", { willReadFrequently: false });
          if (!ctx) {
            return resolve(rawDataUrl);
          }

          // Smooth rendering for high-quality downsampling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // If JPEG, fill white background to avoid black transparency artifacts
          if (mimeType === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          let output = canvas.toDataURL(mimeType, quality);

          // If the output is still unusually large (> 700KB), downscale further
          if (output.length > 700000) {
            const secondCanvas = document.createElement("canvas");
            const scaleDown = 0.8;
            secondCanvas.width = Math.round(width * scaleDown);
            secondCanvas.height = Math.round(height * scaleDown);
            const ctx2 = secondCanvas.getContext("2d");
            if (ctx2) {
              if (mimeType === "image/jpeg") {
                ctx2.fillStyle = "#FFFFFF";
                ctx2.fillRect(0, 0, secondCanvas.width, secondCanvas.height);
              }
              ctx2.imageSmoothingEnabled = true;
              ctx2.imageSmoothingQuality = "high";
              ctx2.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
              output = secondCanvas.toDataURL(mimeType, 0.75);
            }
          }

          resolve(output);
        } catch (canvasErr) {
          console.warn("Canvas compression exception, falling back to original data URL:", canvasErr);
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        // If Image decoding fails, fallback to raw reader result safely
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes an existing base64 string or URL.
 * If given a huge raw base64 string (>150KB), downscales and compresses it cleanly.
 */
export async function optimizeBase64OrUrl(
  input: string,
  options: CompressOptions = {}
): Promise<string> {
  if (!input) return "";
  const trimmed = input.trim();

  // If not a data URL (e.g. /images/... or https://...), return as-is
  if (!trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  // If it's an SVG data URL, return as-is
  if (trimmed.startsWith("data:image/svg+xml")) {
    return trimmed;
  }

  // If already compact (< 120KB), keep as-is
  if (trimmed.length < 120000) {
    return trimmed;
  }

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (!width || !height) return resolve(trimmed);

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          if (mimeType === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL(mimeType, quality));
        } else {
          resolve(trimmed);
        }
      } catch {
        resolve(trimmed);
      }
    };
    img.onerror = () => resolve(trimmed);
    img.src = trimmed;
  });
}
