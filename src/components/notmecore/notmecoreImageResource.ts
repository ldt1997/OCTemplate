import type { NotmecoreImageSize } from "@/components/notmecore/notmecoreConfig";

const imageResourceCache = new Map<string, Promise<HTMLImageElement>>();

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
