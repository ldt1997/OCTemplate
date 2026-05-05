import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  luoxiaoheiTemplateSpec,
} from "@/components/luoxiaohei/luoxiaoheiConfig";
import { hexToRgbTuple } from "@/lib/chtColor";

export type BaseImageLayout = {
  baseWidth: number;
  baseHeight: number;
  baseX: number;
  baseY: number;
};

export type ImageRenderLayout = {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
};

export type LuoxiaoheiPosterLayout = {
  leftBlock: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rightBlock: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  logo: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nameFrame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getBaseImageLayout(
  imageWidth: number,
  imageHeight: number,
): BaseImageLayout | null {
  if (imageWidth === 0 || imageHeight === 0) {
    return null;
  }

  const maxHeight = CANVAS_HEIGHT * luoxiaoheiTemplateSpec.imageAreaHeightRatio;
  const maxWidth = luoxiaoheiTemplateSpec.imageAreaMaxWidth;
  const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  const baseWidth = imageWidth * scale;
  const baseHeight = imageHeight * scale;

  return {
    baseWidth,
    baseHeight,
    baseX: (CANVAS_WIDTH - baseWidth) / 2,
    baseY: (CANVAS_HEIGHT - baseHeight) / 2,
  };
}

export function getDisplayNameText(name: string) {
  return (name || " ").trim() || " ";
}

export function getNameFrameHeight(name: string) {
  const text = getDisplayNameText(name);
  const contentHeight =
    text.length * luoxiaoheiTemplateSpec.nameFrameTextLineHeight;
  const paddedHeight =
    contentHeight + luoxiaoheiTemplateSpec.nameFrameVerticalPadding * 2;

  return Math.max(luoxiaoheiTemplateSpec.nameFrameMinHeight, paddedHeight);
}

export function getPosterLayout(): LuoxiaoheiPosterLayout {
  const nameFrameHeight = getNameFrameHeight("");

  return {
    leftBlock: {
      x: 0,
      y: 0,
      width: luoxiaoheiTemplateSpec.colorBlockWidth,
      height: CANVAS_HEIGHT,
    },
    rightBlock: {
      x: luoxiaoheiTemplateSpec.colorBlockWidth,
      y: 0,
      width: luoxiaoheiTemplateSpec.colorBlockWidth,
      height: CANVAS_HEIGHT,
    },
    logo: {
      x: (CANVAS_WIDTH - luoxiaoheiTemplateSpec.logoWidth) / 2,
      y:
        CANVAS_HEIGHT -
        luoxiaoheiTemplateSpec.logoBottom -
        luoxiaoheiTemplateSpec.logoHeight,
      width: luoxiaoheiTemplateSpec.logoWidth,
      height: luoxiaoheiTemplateSpec.logoHeight,
    },
    nameFrame: {
      x: luoxiaoheiTemplateSpec.nameFrameLeft,
      y: luoxiaoheiTemplateSpec.nameFrameTop,
      width: luoxiaoheiTemplateSpec.nameFrameWidth,
      height: nameFrameHeight,
    },
  };
}

export function getNameFrameLayout(name: string) {
  return {
    x: luoxiaoheiTemplateSpec.nameFrameLeft,
    y: luoxiaoheiTemplateSpec.nameFrameTop,
    width: luoxiaoheiTemplateSpec.nameFrameWidth,
    height: getNameFrameHeight(name),
  };
}

export function getImageRenderLayout(
  imageWidth: number,
  imageHeight: number,
  imageScale: number,
  imageOffsetX: number,
  imageOffsetY: number,
): ImageRenderLayout {
  const baseLayout = getBaseImageLayout(imageWidth, imageHeight);
  if (!baseLayout) {
    return {
      imageWidth: 0,
      imageHeight: 0,
      imageX: 0,
      imageY: 0,
    };
  }

  const nextWidth = baseLayout.baseWidth * imageScale;
  const nextHeight = baseLayout.baseHeight * imageScale;

  return {
    imageWidth: nextWidth,
    imageHeight: nextHeight,
    imageX:
      baseLayout.baseX + imageOffsetX - (nextWidth - baseLayout.baseWidth) / 2,
    imageY:
      baseLayout.baseY +
      imageOffsetY -
      (nextHeight - baseLayout.baseHeight) / 2,
  };
}

export function formatRgbLabel(hex: string) {
  const [red, green, blue] = hexToRgbTuple(hex);
  return `RGB ${red} ${green} ${blue}`;
}

export function formatHueLabel(hex: string) {
  return hex.trim().replace("#", "").toLowerCase();
}
