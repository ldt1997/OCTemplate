import bgImageUrl from "@/assets/br/bg.webp";
import skullImageUrl from "@/assets/br/skull.webp";
import { brTemplateSpec } from "@/components/br/brConfig";

const imageResourceCache = new Map<string, Promise<HTMLImageElement>>();
let brFontsLoadPromise: Promise<void> | null = null;

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

export function loadBrImage(src: string) {
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

export function loadBrBackgroundImage() {
  return loadBrImage(bgImageUrl);
}

export function loadBrSkullImage() {
  return loadBrImage(skullImageUrl);
}

export function ensureBrFontsLoaded() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }

  if (!brFontsLoadPromise) {
    brFontsLoadPromise = Promise.all(
      Object.values(brTemplateSpec.fonts).map((font) =>
        document.fonts.load(font.load),
      ),
    ).then(() => undefined);
  }

  return brFontsLoadPromise;
}

export function clearBrImageResource(src: string | null) {
  if (!src) {
    return;
  }

  imageResourceCache.delete(src);
}

export function disposeBrObjectUrl(src: string | null) {
  if (!src) {
    return;
  }

  clearBrImageResource(src);
  URL.revokeObjectURL(src);
}
