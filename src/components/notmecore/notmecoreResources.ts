import type { NotmecoreImageSize } from "@/components/notmecore/notmecoreConfig";
import { notmecoreTextFontSpec } from "@/components/notmecore/notmecoreConfig";
import { clearNotmecoreBaseImageCanvasCache } from "@/components/notmecore/notmecoreImageFilters";

const imageResourceCache = new Map<string, Promise<HTMLImageElement>>();

const notmecoreFontLoadEntries = Object.values(notmecoreTextFontSpec)
  .map((font) => font.fontLoad)
  .filter((font): font is string => Boolean(font));

let notmecoreFontsLoadPromise: Promise<void> | null = null;

function createImageLoadPromise(src: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`图片加载失败: ${src}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      resolve(image);
    }
  });
}

export function ensureNotmecoreFontsLoaded() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }

  if (!notmecoreFontsLoadPromise) {
    notmecoreFontsLoadPromise = Promise.all(
      notmecoreFontLoadEntries.map((font) => document.fonts.load(font)),
    ).then(() => undefined);
  }

  return notmecoreFontsLoadPromise;
}

export function loadNotmecoreImage(src: string) {
  const cached = imageResourceCache.get(src);
  if (cached) {
    return cached;
  }

  const request = createImageLoadPromise(src).catch((error) => {
    imageResourceCache.delete(src);
    throw error;
  });

  imageResourceCache.set(src, request);
  return request;
}

export async function readNotmecoreImageSize(
  src: string,
): Promise<NotmecoreImageSize> {
  const image = await loadNotmecoreImage(src);

  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

export function clearNotmecoreImageResource(src: string | null) {
  if (!src) {
    return;
  }

  imageResourceCache.delete(src);
}

export function disposeNotmecoreObjectUrl(src: string | null) {
  if (!src) {
    return;
  }

  clearNotmecoreBaseImageCanvasCache(src);
  clearNotmecoreImageResource(src);
  URL.revokeObjectURL(src);
}
