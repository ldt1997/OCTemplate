import { fancamTemplateSpec, type FancamFormState } from "@/components/fancam/fancamConfig";

export type FancamDisplaySize = {
  width: number;
  height: number;
};

export type FancamRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getFancamContainDisplaySize(
  availableWidth: number,
  availableHeight: number,
): FancamDisplaySize {
  const widthRatio = availableWidth / fancamTemplateSpec.canvasWidth;
  const heightRatio = availableHeight / fancamTemplateSpec.canvasHeight;
  const scale = Math.max(0, Math.min(widthRatio, heightRatio));

  return {
    width: fancamTemplateSpec.canvasWidth * scale,
    height: fancamTemplateSpec.canvasHeight * scale,
  };
}

export function getCoverImageRect(
  image: HTMLImageElement,
  target: Pick<FancamRect, "width" | "height">,
): FancamRect {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = target.width / target.height;

  if (imageRatio > targetRatio) {
    const width = image.naturalHeight * targetRatio;
    return {
      x: (image.naturalWidth - width) / 2,
      y: 0,
      width,
      height: image.naturalHeight,
    };
  }

  const height = image.naturalWidth / targetRatio;
  return {
    x: 0,
    y: (image.naturalHeight - height) / 2,
    width: image.naturalWidth,
    height,
  };
}

export function getCharacterRenderRect(
  image: HTMLImageElement,
  form: Pick<
    FancamFormState,
    "characterScale" | "characterOffsetX" | "characterOffsetY"
  >,
): FancamRect {
  const layer = fancamTemplateSpec.layers.character;
  const scale = clamp(
    form.characterScale,
    fancamTemplateSpec.characterScaleRange.min,
    fancamTemplateSpec.characterScaleRange.max,
  );
  const height = layer.baseHeight * scale;
  const width = height * (image.naturalWidth / image.naturalHeight);
  const x = layer.defaultCenterX - width / 2 + form.characterOffsetX;
  const y = layer.defaultBottomY - height + form.characterOffsetY;

  return { x, y, width, height };
}
