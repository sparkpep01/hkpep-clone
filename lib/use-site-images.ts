"use client";

import { useState, useEffect } from "react";

/**
 * 从 API 获取某个 section 的所有图片
 * 返回 slot → url 的映射
 */
export function useSiteImages(section: string): Record<number, string> {
  const [images, setImages] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/site-images?section=${section}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const map: Record<number, string> = {};
        data.forEach((img: { slot: number; url: string }) => {
          map[img.slot] = img.url;
        });
        setImages(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [section]);

  return images;
}

/**
 * 获取单张图片，带 fallback 默认值
 */
export function useSiteImage(
  section: string,
  slot: number,
  fallback: string
): string {
  const images = useSiteImages(section);
  return images[slot] || fallback;
}
