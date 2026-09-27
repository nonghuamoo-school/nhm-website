"use client";

import React, { useState } from "react";
import Image from "next/image";

interface OptimizedNewsImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallbackSrc?: string;
}

export default function OptimizedNewsImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  className = "",
  loading,
  fallbackSrc = "/images/school-emblem-doc.png",
}: OptimizedNewsImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  // If src changes externally, reset state
  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const isDataUrl = typeof imgSrc === "string" && (imgSrc.startsWith("data:") || imgSrc.startsWith("blob:"));

  // Common error fallback handler
  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : loading || "lazy"}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized={isDataUrl}
        onError={handleError}
        className={className}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 600}
      height={height || 400}
      priority={priority}
      loading={priority ? undefined : loading || "lazy"}
      sizes={sizes}
      unoptimized={isDataUrl}
      onError={handleError}
      className={className}
    />
  );
}
