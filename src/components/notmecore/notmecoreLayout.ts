import type { NotmecoreImageSize } from "@/components/notmecore/notmecoreConfig";

export type NotmecoreCanvasSize = {
  width: number;
  height: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getCanvasSize(
  imageSize: NotmecoreImageSize | null,
): NotmecoreCanvasSize {
  if (!imageSize) {
    return { width: 0, height: 0 };
  }

  return {
    width: imageSize.width,
    height: imageSize.height,
  };
}
