import backgroundUrl from "@/assets/ake2/bg.webp";
import { ake2TemplateSpec } from "./ake2Config";

const imageCache = new Map<string, Promise<HTMLImageElement>>();
let fontsPromise: Promise<void> | null = null;

export function loadAke2Image(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const request = (async () => {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("图片尺寸无效。");
    }
    return image;
  })().catch((error: unknown) => {
    imageCache.delete(url);
    throw error;
  });
  imageCache.set(url, request);
  return request;
}

export function disposeAke2ObjectUrl(url: string) {
  imageCache.delete(url);
  URL.revokeObjectURL(url);
}

export function ensureAke2FontsLoaded(): Promise<void> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      Object.values(ake2TemplateSpec.fonts).map(async (definition) => {
        const faces = await document.fonts.load(definition);
        if (!faces.length) throw new Error("模板字体未能加载，请刷新页面重试。");
      }),
    ).then(() => undefined).catch((error: unknown) => {
      fontsPromise = null;
      throw error;
    });
  }
  return fontsPromise;
}

export type Ake2Resources = { background: HTMLImageElement };

export async function loadAke2Resources(): Promise<Ake2Resources> {
  const background = await loadAke2Image(backgroundUrl);
  return { background };
}
