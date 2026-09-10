import backgroundUrl from "@/assets/ake2/bg.webp";
import bannerUrl from "@/assets/ake2/banner.svg";
import logoUrl from "@/assets/ake2/ak-logo.webp";
import collabBackgroundUrl from "@/assets/ake2/collab-event-new-operators-wrapper.webp";
import smallNameBackgroundUrl from "@/assets/ake2/small-en-name-bg.webp";
import starUrl from "@/assets/ake2/star.svg";
import attentionUrl from "@/assets/ake2/attention-icon.webp";
import arrowUrl from "@/assets/ake2/arrow.svg";
import rightDecorationUrl from "@/assets/ake2/right-deco.webp";
import { ake2TemplateSpec, type Ake2FormState } from "./ake2Config";
import { getAke2Profession, getAke2SelectionKey } from "./ake2Layout";

const imageCache = new Map<string, Promise<HTMLImageElement>>();
let fontsPromise: Promise<void> | null = null;

export function loadAke2Image(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;
  const request = (async () => {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error("图片尺寸无效。");
    return image;
  })().catch((error: unknown) => {
    imageCache.delete(url);
    throw error;
  });
  imageCache.set(url, request);
  return request;
}

// 职业 SVG 的宽高为 100%，显式指定正方形视口，避免浏览器使用 300×150 默认尺寸。
function loadProfessionLogo(url: string) {
  const key = `profession:${url}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  const request = (async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("职业图标加载失败。");
    const document = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
    const svg = document.documentElement;
    if (svg.tagName !== "svg") throw new Error("职业图标格式无效。");
    svg.setAttribute("width", "650");
    svg.setAttribute("height", "650");
    const objectUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    try {
      const image = new Image();
      image.src = objectUrl;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  })().catch((error: unknown) => {
    imageCache.delete(key);
    throw error;
  });
  imageCache.set(key, request);
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

const staticUrls = {
  background: backgroundUrl, banner: bannerUrl, logo: logoUrl,
  collabBackground: collabBackgroundUrl, smallNameBackground: smallNameBackgroundUrl,
  star: starUrl, attention: attentionUrl, arrow: arrowUrl, rightDecoration: rightDecorationUrl,
};
type StaticResources = Record<keyof typeof staticUrls, HTMLImageElement>;
let staticPromise: Promise<StaticResources> | null = null;

function loadStaticResources() {
  if (!staticPromise) {
    staticPromise = Promise.all(Object.entries(staticUrls).map(async ([key, url]) =>
      [key, await loadAke2Image(url)] as const,
    )).then((entries) => Object.fromEntries(entries) as StaticResources).catch((error: unknown) => {
      staticPromise = null;
      throw error;
    });
  }
  return staticPromise;
}

export type Ake2Resources = StaticResources & {
  selectionKey: string;
  profession: HTMLImageElement;
  branch: HTMLImageElement;
  character: HTMLImageElement | null;
};

export async function loadAke2Resources(form: Ake2FormState): Promise<Ake2Resources> {
  const { profession, branch } = getAke2Profession(form);
  const [images, professionImage, branchImage, character] = await Promise.all([
    loadStaticResources(), loadProfessionLogo(profession.logo), loadAke2Image(branch.logo),
    form.image ? loadAke2Image(form.image.url) : Promise.resolve(null),
  ]);
  return {
    ...images, selectionKey: getAke2SelectionKey(form),
    profession: professionImage, branch: branchImage, character,
  };
}
