"use client";

import { forwardRef, VideoHTMLAttributes } from "react";
import { getMediaUrl } from "@/lib/media";

interface MediaVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

/**
 * Компонент для видео с поддержкой CDN
 * Автоматически использует CDN в production
 */
const MediaVideo = forwardRef<HTMLVideoElement, MediaVideoProps>(
  ({ src, ...props }, ref) => {
    const mediaUrl = getMediaUrl(src);

    return <video ref={ref} src={mediaUrl} {...props} />;
  }
);

MediaVideo.displayName = "MediaVideo";

export default MediaVideo;
