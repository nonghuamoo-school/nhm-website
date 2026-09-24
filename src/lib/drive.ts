/**
 * Google Drive & Document Helper Utilities
 * For Nong Hua Moo School (NHM)
 */

export function extractGoogleDriveId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If it's already a bare ID (alphanumeric with underscores/hyphens, length 25-55)
  if (/^[a-zA-Z0-9_-]{25,55}$/.test(trimmed)) {
    return trimmed;
  }

  // Standard Drive share links: /file/d/{id}/...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  // Document / Spreadsheet / Presentation links: /document/d/{id}/... or /spreadsheets/d/{id}/...
  const docMatch = trimmed.match(/\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch && docMatch[1]) return docMatch[1];

  // Query parameter links: ?id={id} or &id={id}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // Folder links: /folders/{id}
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];

  return null;
}

export function getDrivePreviewUrl(idOrUrl?: string | null): string | null {
  if (!idOrUrl) return null;
  const id = extractGoogleDriveId(idOrUrl);
  if (!id) return null;

  // If it's a Docs or Sheets document
  if (idOrUrl.includes("docs.google.com/document")) {
    return `https://docs.google.com/document/d/${id}/preview`;
  }
  if (idOrUrl.includes("docs.google.com/spreadsheets")) {
    return `https://docs.google.com/spreadsheets/d/${id}/preview`;
  }

  // Standard Drive file preview (renders scrollable PDF viewer)
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function getDriveDownloadUrl(idOrUrl?: string | null): string | null {
  if (!idOrUrl) return null;
  const id = extractGoogleDriveId(idOrUrl);
  if (!id) return null;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

export function getDriveViewUrl(idOrUrl?: string | null): string | null {
  if (!idOrUrl) return null;
  const id = extractGoogleDriveId(idOrUrl);
  if (!id) return null;

  if (idOrUrl.includes("docs.google.com/spreadsheets")) {
    return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing`;
  }
  if (idOrUrl.includes("docs.google.com/document")) {
    return `https://docs.google.com/document/d/${id}/edit?usp=sharing`;
  }

  return `https://drive.google.com/file/d/${id}/view?usp=sharing`;
}

export interface ResolvedDocumentMedia {
  previewEmbedUrl: string | null;
  downloadUrl: string;
  driveViewUrl: string | null;
  fileName: string;
  isDrive: boolean;
  isPdf: boolean;
}

export function resolveDocumentMedia(doc: {
  title: string;
  fileType?: string;
  downloadUrl?: string;
  driveUrl?: string;
  previewUrl?: string;
}): ResolvedDocumentMedia {
  const ext = (doc.fileType || "pdf").toLowerCase().replace(/^\./, "");
  const cleanTitle = doc.title
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "_");
  const fileName = cleanTitle.toLowerCase().endsWith(`.${ext}`)
    ? cleanTitle
    : `${cleanTitle}.${ext}`;

  const driveId =
    extractGoogleDriveId(doc.driveUrl) ||
    extractGoogleDriveId(doc.previewUrl) ||
    extractGoogleDriveId(doc.downloadUrl);

  const isDrive = Boolean(driveId);
  const isPdf = ext === "pdf" || doc.fileType === "PDF" || (!doc.fileType && !doc.downloadUrl?.includes(".xlsx"));

  let previewEmbedUrl: string | null = null;
  if (driveId) {
    previewEmbedUrl = getDrivePreviewUrl(doc.driveUrl || driveId);
  } else if (doc.previewUrl && doc.previewUrl !== "#") {
    previewEmbedUrl = doc.previewUrl;
  } else if (doc.downloadUrl && doc.downloadUrl !== "#" && (doc.downloadUrl.startsWith("data:") || doc.downloadUrl.startsWith("http"))) {
    previewEmbedUrl = doc.downloadUrl;
  }

  let downloadUrl = doc.downloadUrl && doc.downloadUrl !== "#" ? doc.downloadUrl : "";
  if (driveId) {
    downloadUrl = getDriveDownloadUrl(driveId) || downloadUrl;
  }

  const driveViewUrl = driveId ? getDriveViewUrl(doc.driveUrl || driveId) : (doc.driveUrl || null);

  return {
    previewEmbedUrl,
    downloadUrl: downloadUrl || driveViewUrl || "#",
    driveViewUrl,
    fileName,
    isDrive,
    isPdf,
  };
}

/**
 * Trigger file download directly with correct filename
 */
export function triggerDocumentDownload(downloadUrl: string, fileName: string) {
  if (!downloadUrl || downloadUrl === "#") {
    alert("ไม่พบลิงก์ดาวน์โหลดสำหรับเอกสารนี้");
    return;
  }

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", fileName);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
