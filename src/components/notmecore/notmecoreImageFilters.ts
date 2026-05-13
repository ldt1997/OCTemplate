type NotmecoreImageFilterOptions = {
  saturation: number;
  contrast: number;
};

const baseImageCanvasCache = new Map<string, HTMLCanvasElement>();

function getBaseImageCacheKey(
  src: string,
  width: number,
  height: number,
) {
  return `${src}::${width}x${height}`;
}

function createFilterCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("当前环境不支持滤镜画布。");
  }

  return { canvas, context };
}

function getBaseImageCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const cacheKey = getBaseImageCacheKey(image.src, width, height);
  const cachedCanvas = baseImageCanvasCache.get(cacheKey);
  if (cachedCanvas) {
    return cachedCanvas;
  }

  const { canvas, context } = createFilterCanvas(width, height);
  context.drawImage(image, 0, 0, width, height);
  baseImageCanvasCache.set(cacheKey, canvas);

  return canvas;
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

function applySaturation(
  red: number,
  green: number,
  blue: number,
  saturation: number,
) {
  if (saturation === 1) {
    return [red, green, blue] as const;
  }

  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;

  return [
    clampChannel(luminance + (red - luminance) * saturation),
    clampChannel(luminance + (green - luminance) * saturation),
    clampChannel(luminance + (blue - luminance) * saturation),
  ] as const;
}

function applyContrast(value: number, contrast: number) {
  if (contrast === 1) {
    return value;
  }

  return clampChannel((value - 128) * contrast + 128);
}

export function createFilteredImageCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
  options: NotmecoreImageFilterOptions,
) {
  const baseCanvas = getBaseImageCanvas(image, width, height);

  if (options.saturation === 1 && options.contrast === 1) {
    return baseCanvas;
  }

  const { canvas, context } = createFilterCanvas(width, height);
  context.drawImage(baseCanvas, 0, 0);

  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const [nextRed, nextGreen, nextBlue] = applySaturation(
      data[index] ?? 0,
      data[index + 1] ?? 0,
      data[index + 2] ?? 0,
      options.saturation,
    );

    data[index] = applyContrast(nextRed, options.contrast);
    data[index + 1] = applyContrast(nextGreen, options.contrast);
    data[index + 2] = applyContrast(nextBlue, options.contrast);
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

export function clearNotmecoreBaseImageCanvasCache(src: string | null) {
  if (!src) {
    return;
  }

  for (const key of baseImageCanvasCache.keys()) {
    if (key.startsWith(`${src}::`)) {
      baseImageCanvasCache.delete(key);
    }
  }
}
