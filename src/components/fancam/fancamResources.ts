import effectBubbleUrl from "@/assets/fancam/effect_01.webp";
import effectRibbonUrl from "@/assets/fancam/effect_02.webp";
import effectStarUrl from "@/assets/fancam/effect_03.webp";
import sbsFrontUrl from "@/assets/fancam/front_sbs.webp";
import mbcFrontUrl from "@/assets/fancam/mbc_front.webp";
import type { FancamEffect, FancamTemplate } from "@/components/fancam/fancamConfig";
import { fancamTemplateSpec } from "@/components/fancam/fancamConfig";

const imageResourceCache = new Map<string, Promise<HTMLImageElement>>();
let fancamFontsLoadPromise: Promise<void> | null = null;

const templateAssetByValue: Record<FancamTemplate, string> = {
  mbc: mbcFrontUrl,
  sbs: sbsFrontUrl,
};

const effectAssetByValue: Record<Exclude<FancamEffect, "none">, string> = {
  bubble: effectBubbleUrl,
  ribbon: effectRibbonUrl,
  star: effectStarUrl,
};

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

export function loadFancamImage(src: string) {
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

export function loadFancamTemplateImage(template: FancamTemplate) {
  return loadFancamImage(templateAssetByValue[template]);
}

export function loadFancamEffectImage(effect: FancamEffect) {
  if (effect === "none") {
    return null;
  }

  return loadFancamImage(effectAssetByValue[effect]);
}

export function getFancamTemplatePreviewImage() {
  return mbcFrontUrl;
}

export function ensureFancamFontsLoaded() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }

  if (!fancamFontsLoadPromise) {
    fancamFontsLoadPromise = Promise.all(
      Object.values(fancamTemplateSpec.fonts).map((font) =>
        document.fonts.load(font.load),
      ),
    ).then(() => undefined);
  }

  return fancamFontsLoadPromise;
}

export function clearFancamImageResource(src: string | null) {
  if (!src) {
    return;
  }

  imageResourceCache.delete(src);
}

export function disposeFancamObjectUrl(src: string | null) {
  if (!src) {
    return;
  }

  clearFancamImageResource(src);
  URL.revokeObjectURL(src);
}
