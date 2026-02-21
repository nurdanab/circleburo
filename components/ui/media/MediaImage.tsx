"use client";

import Image, { ImageProps } from "next/image";
import { getMediaUrl } from "@/lib/media";

interface MediaImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

/**
 * Компонент для изображений с поддержкой CDN
 * Автоматически использует CDN в production
 */
export default function MediaImage({ src, alt, ...props }: MediaImageProps) {
  const mediaUrl = getMediaUrl(src);

  return <Image src={mediaUrl} alt={alt} {...props} />;
}
